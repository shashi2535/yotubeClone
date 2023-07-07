/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  resolvers,
  typedef,
  verifyEmailValidateMiddleware,
  AuthMiddleware,
  loginValidateMiddleware,
  signupValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  imageValidation,
} from './graphql';
import { connection } from './config/';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from './config';
import { User } from './models';
import { GraphQLError } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const app = express();
const httpServer = http.createServer(app);
app.use(express.json());

const expressServer = async () => {
  let schema = makeExecutableSchema({
    typeDefs: typedef,
    resolvers,
  });
  // new midleware is priority first for calling
  schema = verifyOtpValidateMiddleware(schema, 'verifyOtpValid');
  schema = resendCodeOnEmailValidateMiddleware(schema, 'resendCodeOnEmailValid');
  schema = verifyEmailValidateMiddleware(schema, 'verifyEmailValid');
  schema = loginValidateMiddleware(schema, 'loginValid');
  schema = signupValidateMiddleware(schema, 'signupValid');
  schema = imageValidation(schema, 'avtarValid');
  schema = AuthMiddleware(schema, 'auth');

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      try {
        // if (req.rawHeaders[15].includes('application/json') === false) {
        const token: any = req?.headers?.token;
        if (token) {
          const payload = (await verify(token, String(process.env.MY_SECRET))) as JwtPayload;
          const userData = await User.findOne({ where: { user_uuid: payload.id } });
          if (!userData?.dataValues) {
            throw new ApolloError('User Not Found', '400');
          }
          return {
            userId: userData.dataValues.id,
            user_uuid: userData.dataValues.user_uuid,
          };
        }
      } catch (err: unknown) {
        logger.error(JSON.stringify(err));
        if (err instanceof JsonWebTokenError) {
          if (err.message == 'jwt malformed') {
            throw new ApolloError('UnAuthorized');
          }
          if (err.name == 'TokenExpiredError') {
            throw new ApolloError(err.message);
          }
        }
      }
    },
    formatError: (err: unknown): any => {
      if (err instanceof GraphQLError) {
        return new ApolloError(err.message, '400');
      }
    },
    csrfPrevention: false,
    cache: 'bounded',
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  app.use(graphqlUploadExpress());
  await server.start();
  server.applyMiddleware({ app });
  connection();
  await new Promise<void>((resolve) => httpServer.listen({ port: 9000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:9000${server.graphqlPath}`);
};

expressServer();
