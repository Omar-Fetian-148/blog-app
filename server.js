// dependencies imports
import { ApolloServer } from '@apollo/server';
import gql from "graphql-tag";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from "fs";
//relative imports
import resolvers from './schema/resolvers/resolvers.js';
import db from './config/connection.js';
import { verifyJWT } from './utils/auth.js';

dotenv.config()

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  const typeDefs = gql(
    readFileSync("./schema/monolith.graphql", { encoding: "utf8" })
  );

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
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



db.once('open', () => {
  startApolloServer().catch((error) => {
    console.error('Failed to start Apollo Server:', error);
    process.exit(1);
  });
});