const Group = require('../../models/Group');

module.exports = {
    Query: {
        // According to TypeDefs.js: groups: [Group]
        async groups() {
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
        async devices(parent) {
            try {
                const RaspberryPi = require('../../models/RaspberryPi');
                return await RaspberryPi.find({ groupId: parent.id });

            } catch (error) {
                throw new Error('Failed to fetch devices for group: ' + error.message);
            }
        }
    }
}
