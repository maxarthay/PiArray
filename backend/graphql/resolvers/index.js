// this file exports all our individual resolvers

const piResolvers = require('./RaspberryPi');
const groupResolvers = require('./Group');

module.exports = {

    Query: {
        ...piResolvers.Query,
        ...groupResolvers.Query
    },
    Mutation: {
        ...piResolvers.Mutation,
        ...groupResolvers.Mutation
    },
    RaspberryPi: {
        ...piResolvers.RaspberryPi
    },
    Group: {
        ...groupResolvers.Group
    }
};

