import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import {
  expressMiddleware,
  ExpressContextFunctionArgument
} from '@apollo/server/express4';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import pubSub from './pubSub';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { mongodbUri, clientUrl, port } from './config';

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
    await mongoose.connect(mongodbUri);
    await apolloServer.start();
    app
      .use(
        '/graphql',
        cors({
          origin: clientUrl,
          credentials: true
        }),
        cookieParser(),
        express.json(),
        expressMiddleware(apolloServer, {
          context: async (ctx: ExpressContextFunctionArgument) => ({
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

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
  console.log(`Subscriptions ready at ws://localhost:${port}/subscriptions`);
});
