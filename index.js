const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB_URI, PORT } = require('./config');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const app = express();

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});
const wsServerCleanup = useServer(
  {
    schema,
  },
  wsServer
);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await apolloServer.start();
    app.use(
      '/',
      cors(),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({
          req,
        }),
      })
    );
  } catch (error) {
    console.log('Error:', error);
  }
})();

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}`);
});
