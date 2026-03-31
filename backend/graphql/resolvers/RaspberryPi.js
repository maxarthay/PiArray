// the resolvers folder create a file for each of your data types
// this is the actual code that fetches data from and sends data to our database.

const RaspberryPi = require('../../models/RaspberryPi');
const Group = require('../../models/Group');

module.exports = {
    Query: {
        //inside here would go all your queries
        async fleet() {
            try {
                const pis = await RaspberryPi.find();
                return pis;
            } catch (error) {
                throw new Error('Failed to fetch fleet: ' + error.message);
            }
        },

        async pi(_, { id }) {
            try {
                const pi = await RaspberryPi.findById(id);
                return pi;
            } catch (error) {
                throw new Error('Failed to fetch pi: ' + error.message);
            }
        }
    },

    Mutation: {
        // inside here would go all your mutations
        async registerPi(_, { name, ipAddress, model, groupId = null }) {
            try {
                let resolvedGroupId = null;

                if (groupId) {
                    // Check if it's a valid ObjectId; if not, treat it as a group name
                    const isObjectId = /^[0-9a-fA-F]{24}$/.test(groupId);
                    if (isObjectId) {
                        resolvedGroupId = groupId;
                    } else {
                        // Look up by name, create if it doesn't exist
                        let group = await Group.findOne({ name: groupId });
                        if (!group) {
                            group = new Group({ name: groupId });
                            await group.save();
                        }
                        resolvedGroupId = group._id;
                    }
                }

                const pi = new RaspberryPi({
                    name,
                    ipAddress,
                    model,
                    groupId: resolvedGroupId,
                    isOnline: false,
                    cpuUsage: 0,
                });
                await pi.save();
                return pi;
            } catch (error) {
                throw new Error('Failed to register pi: ' + error.message);
            }
        },

        async removePi(_, { id }) {
            try {
                const pi = await RaspberryPi.findByIdAndDelete(id);
                return pi;
            } catch (error) {
                throw new Error('Failed to remove pi: ' + error.message);
            }
        },

        /*
        // TODO: implement rebootPi from Raspberry Pi
        async rebootPi(_, { id }) {
            try {
                const pi = await RaspberryPi.findById(id);
                return pi;
            } catch (error) {
                throw new Error('Failed to reboot pi: ' + error.message);
            }
        }

        */

        // TODO: implement changeOnlineStatus from Raspberry Pi
        async changeOnlineStatus(_, { id, isOnline }) {
            try {
                const pi = await RaspberryPi.findById(id);
                pi.isOnline = isOnline;
                await pi.save();
                return pi;
            } catch (error) {
                throw new Error('Failed to change online status: ' + error.message);
            }
        },

        async runScript(_, { id, script }) {
            try {
                const pi = await RaspberryPi.findById(id);
                pi.currScript = script;
                await pi.save();
                return pi;
            } catch (error) {
                throw new Error('Failed to run script: ' + error.message);
            }
        },

        async updatePiPosition(_, { id, positionX, positionY }) {
            try {
                const pi = await RaspberryPi.findByIdAndUpdate(
                    id,
                    { positionX, positionY },
                    { new: true }
                );
                if (!pi) throw new Error('Pi not found');
                return pi;
            } catch (error) {
                throw new Error('Failed to update position: ' + error.message);
            }
        }
    },

    RaspberryPi: {
        async group(parent) {
            if (!parent.groupId) return null;
            try {
                return await Group.findById(parent.groupId);
            } catch (error) {
                return null;
            }
        },
        async groupName(parent) {
            if (!parent.groupId) return null;
            try {
                const group = await Group.findById(parent.groupId);
                return group ? group.name : null;
            } catch (error) {
                return null;
            }
        }
    }
}