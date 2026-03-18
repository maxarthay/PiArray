const { model, Schema } = require('mongoose');

const piSchema = new Schema({
    name: String,
    model: String,
    ipAddress: String,
    isOnline: Boolean,
    currScript: String,
    cpuUsage: Number,
    uptime: Number,
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' }
})

module.exports = model('RaspberryPi', piSchema);
