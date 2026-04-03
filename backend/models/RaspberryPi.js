const { model, Schema } = require('mongoose');

const piSchema = new Schema({
    name: String,
    model: String,
    ipAddress: String,
    isOnline: Boolean,
    currScript: String,
    cpuUsage: Number,
    cpuHistory: { type: [Number], default: [] },
    tempCelsius: { type: Number, default: null },
    uptime: Number,
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    positionX: { type: Number, default: null },
    positionY: { type: Number, default: null },
})

module.exports = model('RaspberryPi', piSchema);
