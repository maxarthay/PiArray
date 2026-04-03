const RaspberryPi = require('./models/RaspberryPi');
const { collectFromPi } = require('./collection');

let polling = false; // Prevent overlapping cycles

function startPolling(intervalMs = 30000) {
    console.log(`Telemetry polling started (every ${intervalMs / 1000}s)`);
    setInterval(async () => {
        // Skip if the previous cycle is still running
        if (polling) {
            console.log('[Poll] Previous cycle still running, skipping...');
            return;
        }
        polling = true;
        try {
            const pis = await RaspberryPi.find();
            console.log(`[Poll] Polling ${pis.length} device(s)...`);
            for (const pi of pis) {
                try {
                    const data = await collectFromPi(pi.ipAddress);
                    // Atomic update — avoids Mongoose VersionError from concurrent saves
                    const history = [...(pi.cpuHistory || []), data.cpuUsage].slice(-20);
                    await RaspberryPi.findByIdAndUpdate(pi._id, {
                        cpuUsage: data.cpuUsage,
                        tempCelsius: data.tempCelsius,
                        uptime: data.uptime,
                        isOnline: true,
                        cpuHistory: history,
                    });
                    console.log(`[Poll] ✓ ${pi.name}: cpu=${data.cpuUsage}% temp=${data.tempCelsius}°C uptime=${data.uptime}s`);
                } catch (err) {
                    console.error(`[Poll] ✗ ${pi.name} (${pi.ipAddress}): ${err.message}`);
                    await RaspberryPi.findByIdAndUpdate(pi._id, { isOnline: false });
                }
            }
        } finally {
            polling = false;
        }
    }, intervalMs);
}

module.exports = { startPolling };