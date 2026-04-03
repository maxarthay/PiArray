const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');
const typeDefs = require('./graphql/TypeDefs');
const resolvers = require('./graphql/resolvers');
const { startPolling } = require('./pollingLoop');


const app = express();
const port = 3000;

async function startServer() {
  // 1. Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // 2. Start Apollo Server
  await server.start();

  // 3. Connect Apollo to Express
  server.applyMiddleware({ app });

  // 4. Connect to Mongoose (MongoDB)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      // 5. Start the Express server
      startPolling(5000);
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
      });
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
    });
}

startServer();
