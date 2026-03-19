const Group = require('../../models/Group');

module.exports = {
    Query: {
        // According to TypeDefs.js: group: [Group]
        async group() {
            try {
                return await Group.find();
            } catch (error) {
                throw new Error('Failed to fetch groups: ' + error.message);
            }
        }
    },

    Mutation: {
        // Add mutations for Group if needed in the future
    },

    Group: {
        // Resolves the `devices: [RaspberryPi]` field on the Group type
        async devices(parent) {
            try {
                // Require here to avoid circular dependencies between resolvers
                const RaspberryPi = require('../../models/RaspberryPi');
                return await RaspberryPi.find({ groupId: parent.id });
                // Note: since your Group model uses deviceIds as an array, 
                // you could also return RaspberryPi.find({ _id: { $in: parent.deviceIds } })
            } catch (error) {
                throw new Error('Failed to fetch devices for group: ' + error.message);
            }
        }
    }
}
