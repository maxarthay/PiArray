// this file exports all our individual resolvers
//helps with organization

// rename it according to whatever types you are using!



// here go each of the different data types:

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

