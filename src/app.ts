/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { createApolloQueryValidationPlugin, constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers, typedef } from './graphql';
import { connection } from './config/';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from './config';
import { User } from './models';
import { AuthMiddleware, validationMiddleware } from './graphql/';
const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
const expressServer = async () => {
  let schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typedef],
    resolvers,
  });
  // new midleware is priority first for calling
  schema = AuthMiddleware(schema, 'auth');
  const plugins = [
    createApolloQueryValidationPlugin({
      schema,
    }),
  ];
  const server = new ApolloServer({
    schema,
    plugins,
    context: async ({ req }: any) => {
      try {
        if (req.rawHeaders[15].includes('application/json') === false) {
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
        }
      } catch (err: any) {
        if (err.message == 'jwt malformed') {
          throw new ApolloError('UnAuthorized', '400');
        }
      }
    },
    formatError: (err: any) => {
      throw new ApolloError(err.message, '400');
    },
  });
  await server.start();
  server.applyMiddleware({ app });
  process.stdout.on('error', function (err) {
    if (err.code == 'EPIPE') {
      process.exit(0);
    }
  });
  connection();
  await new Promise<void>((resolve) => httpServer.listen({ port: 9000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:9000${server.graphqlPath}`);
  // console.log();
};

expressServer();
