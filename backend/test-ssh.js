const { NodeSSH } = require('node-ssh');
const path = require('path');

const host = process.argv[2];
if (!host) {
    console.error('Usage: node test-ssh.js <pi-hostname-or-ip>');
    console.error('Example: node test-ssh.js 192.168.1.10');
    console.error('Example: node test-ssh.js maxpi');
    console.error('\nDo NOT include the username — just the host.');
    process.exit(1);
}

const keyPath = path.join(__dirname, 'id_rsa');
const username = 'maxa';

console.log(`--- SSH Test ---`);
console.log(`Host:     ${host}`);
console.log(`User:     ${username}`);
console.log(`Key:      ${keyPath}`);
console.log(`Connecting...\n`);

const ssh = new NodeSSH();
ssh.connect({
    host,
    username,
    privateKeyPath: keyPath,
    readyTimeout: 10000,
})
.then(async () => {
    console.log('✓ SSH connected!\n');

    // Test each command individually
    const commands = [
        { label: 'Temperature', cmd: 'cat /sys/class/thermal/thermal_zone0/temp' },
        { label: 'Uptime',      cmd: 'cat /proc/uptime' },
        { label: 'CPU',         cmd: `awk '/^cpu / {u=$2+$4; t=$2+$4+$5; printf "%.0f", (u/t)*100}' /proc/stat` },
        { label: 'Hostname',    cmd: 'hostname' },
    ];

    for (const { label, cmd } of commands) {
        const result = await ssh.execCommand(cmd);
        if (result.stderr) {
            console.log(`✗ ${label}: ERROR → ${result.stderr.trim()}`);
        } else {
            console.log(`✓ ${label}: ${result.stdout.trim()}`);
        }
    }

    ssh.dispose();
    console.log('\nAll done!');
})
.catch(err => {
    console.error(`✗ Connection failed: ${err.message}\n`);
    if (err.message.includes('getaddrinfo')) {
        console.error('  → The hostname could not be resolved. Check that:');
        console.error('    1. The Pi is on the same network');
        console.error('    2. You used just the hostname/IP, not "user@host"');
    } else if (err.message.includes('timeout')) {
        console.error('  → Connection timed out. Check that:');
        console.error('    1. The Pi is powered on and connected');
        console.error('    2. SSH is enabled on the Pi');
        console.error('    3. The IP/hostname is correct');
    } else if (err.message.includes('Authentication')) {
        console.error('  → SSH key rejected. Check that:');
        console.error('    1. id_rsa.pub is in the Pi\'s ~/.ssh/authorized_keys');
        console.error('    2. The username "maxa" is correct');
    }
    process.exit(1);
});
