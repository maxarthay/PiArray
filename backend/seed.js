const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');
const RaspberryPi = require('./models/RaspberryPi');

const samplePis = [
  {
    name: 'Pi-001',
    model: 'Pi 4B',
    ipAddress: '192.168.1.10',
    isOnline: true,
    cpuUsage: 45,
    uptime: 3600,
    currScript: 'sensor.py',
  },
  {
    name: 'Pi-002',
    model: 'Pi Zero W',
    ipAddress: '192.168.1.11',
    isOnline: true,
    cpuUsage: 12,
    uptime: 7200,
    currScript: 'logger.py',
  },
  {
    name: 'Pi-003',
    model: 'Pi 4B',
    ipAddress: '192.168.1.12',
    isOnline: false,
    cpuUsage: 0,
    uptime: 0,
    currScript: '',
  },
  {
    name: 'Pi-004',
    model: 'Pi 5',
    ipAddress: '192.168.1.13',
    isOnline: true,
    cpuUsage: 78,
    uptime: 14400,
    currScript: 'ml_inference.py',
  },
  {
    name: 'Pi-005',
    model: 'Pi Zero 2W',
    ipAddress: '192.168.1.14',
    isOnline: true,
    cpuUsage: 23,
    uptime: 1800,
    currScript: 'temp_monitor.py',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing data
    await RaspberryPi.deleteMany({});
    console.log('Cleared existing Pi data');

    // Insert sample data
    const inserted = await RaspberryPi.insertMany(samplePis);
    console.log(`Inserted ${inserted.length} sample Pis`);

    await mongoose.disconnect();
    console.log('Done! Disconnected from MongoDB.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
