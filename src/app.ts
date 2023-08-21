/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { handle as i18nextMiddlewareHandle, LanguageDetector } from 'i18next-http-middleware';
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import { resolve } from 'path';
import { connection } from './config/';
import http from 'http';
import { logger } from './config';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { Locale } from './constant';
import { schema } from './helper';
import { verifyJwt } from './middleware';
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
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);
  const setHttpPlugin = {
    async requestDidStart() {
      return {
        async willSendResponse({ response }: any) {
          response.http.status = response?.data?.create_video_track?.status_code
            ? response?.data?.create_video_track?.status_code
            : response?.errors && response?.errors[0].status_code;
        },
      };
    },
  };
  const server = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      const data = await verifyJwt(req);
      if (data) {
        return data;
      }
    },
    formatError: (err: any): any => {
      return {
        message: err.message,
        status_code: 400,
      };
    },
    csrfPrevention: false,
    cache: 'bounded',
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      setHttpPlugin,
      // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
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
