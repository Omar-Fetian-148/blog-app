// dependencies imports
import { ApolloServer } from '@apollo/server';
import gql from "graphql-tag";
import { expressMiddleware } from '@apollo/server/express4';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from "fs";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
//relative imports
import resolvers from './schema/resolvers/resolvers.js';
import db from './config/connection.js';
import { verifyJWT } from './utils/auth.js';
import { publisher, subscriber } from './config/redis.js';

console.log(publisher, subscriber);
dotenv.config()

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const typeDefs = gql(
    readFileSync(resolve(__dirname, "./schema/monolith.graphql"), { encoding: "utf8" })
  );
  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  //
  app.set('trust proxy', 1);
  //Helmet helps secure Express apps by setting HTTP response headers.
  app.use(helmet());
  //protect against HTTP Parameter Pollution attacks
  app.use(hpp());

  //to handle image uploads
  app.use(graphqlUploadExpress());

  //Rate Limiting
  app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 2 requests per `window` (here, per 10 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Too many requests from this IP, please try again later.',
  }))

  // Ensure we wait for our server to start
  await server.start();

  app.get('/', (_req, res) => {
    process.env.NODE_ENV === 'production';
    res.send(
      `
        <h1>Server is up and running!</h1>
        <h2>Check out the GraphQL endpoint at 
          <a href='graphql'>
            /graphql
          </a>
        </h2>
        `
    );
  });

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors({
      origin: '*',
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({
        auth: verifyJWT(req),
        language: req.headers.language
      }),
    }),
  );

  // Modified server startup
  const PORT = process.env.PORT || 4000
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

async function shutdown() {
  try {
    // Close the Redis connection
    publisher.disconnect();
    subscriber.disconnect();
    console.log('Redis connection closed.');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
  process.exit(0);
}

db.once('open', () => {
  startApolloServer().catch((error) => {
    console.error('Failed to start Apollo Server:', error);
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Server is shutting down...');
  await shutdown();
});