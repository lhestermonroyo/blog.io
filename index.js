const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const {
  ApolloServerPluginDrainHttpServer
} = require('@apollo/server/plugin/drainHttpServer');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const pubSub = require('./pubSub');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB_URI, PORT } = require('./config');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
const app = express();

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions'
});
const wsServerCleanup = useServer(
  {
    schema,
    onConnect: () => console.log('WebSocket client connected'),
    onDisconnect: () => console.log('WebSocket client disconnected')
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
          }
        };
      }
    }
  ]
});

(async () => {
  const __dirname = path.resolve();

  try {
    await mongoose.connect(MONGODB_URI);
    await apolloServer.start();
    app
      .use(
        '/graphql',
        cors({
          origin: 'http://localhost:4173',
          credentials: true
        }),
        cookieParser(),
        express.json(),
        expressMiddleware(apolloServer, {
          context: async (ctx) => ({
            pubSub,
            ...ctx
          })
        })
      )
      .use(express.static(path.join(__dirname, '/client/dist')))
      .get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
      });
  } catch (error) {
    console.log('Error:', error);
  }
})();

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}/subscriptions`);
});
