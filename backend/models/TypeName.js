// this file is the blueprint for the data stored in the obj's collection

const {model, Schema} = require('mongoose');


/*const TypeNameSchema = new Schema({
    field1: String,
    field2: String
});*/

const piSchema = new Schema({
    name: String,
    model: String,
    ipAddress: String,
    isOnline: Boolean,
    currScript: String,
    cpuUsage: Number,
    uptime: Number,
    groupId: { type: mongoose.Schema.TYpes.ObjectId, ref:'Group'}
})

const groupSchema = new Schema({
    name: String,
    description: String,
    deviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref:'RaspberryPi'}]
})

// Create and export the model.
// automatically creates a collection named whatever the TypeNameSchema is called
module.exports = model('Type Name', TypeNameSchema);

