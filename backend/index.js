// index.js is the entry point of your backend application.
// It sets up the Express server, connects to the MongoDB database,
// and configures the Apollo GraphQL server.


/*

//this is calling all the libraries and APIs we will be using
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

// Import your MongoDB connection URI from the config file.
const { MONGODB_URI } = require('./config');

// Import the GraphQL schema definitions and resolvers.
const typeDefs = require('./graphql/TypeDefs');
const resolvers = require('./graphql/resolvers');

// Initialize the Express and Apollo Server instances.
// Then start the server with a function


*/

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


