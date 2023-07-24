/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { handle as i18nextMiddlewareHandle, LanguageDetector } from 'i18next-http-middleware';
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import { resolve } from 'path';
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
import { config } from './config';
import { logger } from './config';
import { User } from './models';
import { GraphQLError } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from 'apollo-server-core';
import { Locale } from './constant';
const { JWT_SECRET } = config.JWT;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const app = express();
const httpServer = http.createServer(app);
app.use(express.json());
i18next
  .use(LanguageDetector)
  .use(i18nextFsBackend)
  .init({
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: resolve(__dirname, './locales/{{lng}}/{{ns}}.json'),
    },
    debug: false,
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
    },
    preload: [Locale.EN, Locale.HI],
    saveMissing: false,
    fallbackLng: Locale.EN,
  });

app.use(i18nextMiddlewareHandle(i18next));
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
        const lan = req.rawHeaders[25] === Locale.HI ? Locale.HI : Locale.EN;
        i18next.changeLanguage(lan);
        if (token) {
          const payload = (await verify(token, JWT_SECRET)) as JwtPayload;
          const userData = await User.findOne({ where: { user_uuid: payload.id }, raw: true, nest: true });
          if (!userData) {
            throw new AuthenticationError(i18next.t('STATUS.USER_NOT_FOUND'));
          }
          return {
            userId: userData.id,
            user_uuid: userData.user_uuid,
          };
        }
      } catch (err: unknown) {
        logger.error(JSON.stringify(err));
        if (err instanceof JsonWebTokenError) {
          throw new AuthenticationError(err.message);
        }
      }
    },
    formatError: (err: unknown): any => {
      if (err instanceof GraphQLError) {
        return new ApolloError(err.message);
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
