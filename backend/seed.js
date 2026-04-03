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
    cpuHistory: [32, 38, 41, 55, 62, 48, 44, 50, 39, 42, 47, 45],
    tempCelsius: 52.3,
    uptime: 3600,
    currScript: 'sensor.py',
  },
  {
    name: 'Pi-002',
    model: 'Pi Zero W',
    ipAddress: '192.168.1.11',
    isOnline: true,
    cpuUsage: 12,
    cpuHistory: [8, 10, 14, 11, 9, 13, 15, 10, 12, 11, 14, 12],
    tempCelsius: 41.7,
    uptime: 7200,
    currScript: 'logger.py',
  },
  {
    name: 'Pi-003',
    model: 'Pi 4B',
    ipAddress: '192.168.1.12',
    isOnline: false,
    cpuUsage: 0,
    cpuHistory: [55, 60, 72, 85, 91, 88, 74, 45, 12, 0, 0, 0],
    tempCelsius: null,
    uptime: 0,
    currScript: '',
  },
  {
    name: 'Pi-004',
    model: 'Pi 5',
    ipAddress: '192.168.1.13',
    isOnline: true,
    cpuUsage: 78,
    cpuHistory: [65, 70, 72, 80, 85, 82, 79, 76, 81, 74, 77, 78],
    tempCelsius: 63.1,
    uptime: 14400,
    currScript: 'ml_inference.py',
  },
  {
    name: 'Pi-005',
    model: 'Pi Zero 2W',
    ipAddress: '192.168.1.14',
    isOnline: true,
    cpuUsage: 23,
    cpuHistory: [18, 20, 25, 30, 22, 19, 21, 24, 28, 26, 20, 23],
    tempCelsius: 44.9,
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
