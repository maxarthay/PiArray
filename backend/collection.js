const { NodeSSH } = require('node-ssh');
const path = require('path');

async function collectFromPi(piIpAddress) {
    const ssh = new NodeSSH();
    await ssh.connect({
        host: piIpAddress,
        username: 'maxa',
        privateKeyPath: path.join(__dirname, 'id_rsa'),
        readyTimeout: 10000,
    });

    // Temperature
    const tempResult = await ssh.execCommand('cat /sys/class/thermal/thermal_zone0/temp');
    const tempCelsius = parseInt(tempResult.stdout) / 1000;

    // Uptime
    const uptimeResult = await ssh.execCommand('cat /proc/uptime');
    const uptimeSeconds = Math.floor(parseFloat(uptimeResult.stdout));

    // CPU usage: take two snapshots 1 second apart to get CURRENT usage (not cumulative)
    // A single /proc/stat read gives time since boot, which is always ~1% on an idle Pi.
    const cpuResult = await ssh.execCommand(
        `head -1 /proc/stat; sleep 1; head -1 /proc/stat`
    );
    const lines = cpuResult.stdout.trim().split('\n');
    const cpuUsage = calcCpuPercent(lines[0], lines[1]);

    ssh.dispose();
    return { tempCelsius, uptime: uptimeSeconds, cpuUsage, isOnline: true };
}

// Parse two /proc/stat lines and compute CPU% from the delta
function calcCpuPercent(line1, line2) {
    const parse = (line) => {
        const parts = line.replace(/^cpu\s+/, '').trim().split(/\s+/).map(Number);
        // parts: user, nice, system, idle, iowait, irq, softirq, steal
        const idle = parts[3] + (parts[4] || 0);
        const total = parts.reduce((a, b) => a + b, 0);
        return { idle, total };
    };
    const a = parse(line1);
    const b = parse(line2);
    const idleDelta = b.idle - a.idle;
    const totalDelta = b.total - a.total;
    if (totalDelta === 0) return 0;
    return Math.round((1 - idleDelta / totalDelta) * 100);
}

module.exports = { collectFromPi };