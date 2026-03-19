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
        },

        async group(_, { id }) {
            try {
                const group = await Group.findById(id);
                return group;
            } catch (error) {
                throw new Error('Failed to fetch group: ' + error.message);
            }
        }
    },

    Mutation: {
        // inside here would go all your mutations
        async registerPi(_, { id, name, model, groupId = null }) {
            try {
                const pi = new RaspberryPi({
                    id,
                    name,
                    model,
                    groupId
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
        }
    }
}