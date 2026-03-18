const { model, Schema } = require('mongoose');

const groupSchema = new Schema({
    name: String,
    description: String,
    deviceIds: [{ type: Schema.Types.ObjectId, ref: 'RaspberryPi' }]
})

module.exports = model('Group', groupSchema);
