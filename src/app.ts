import { ApolloServer } from 'apollo-server-express';
import {
    createApolloQueryValidationPlugin,
    constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers, typedef } from './graphql';
import { connection } from './config/';
import http from 'http';
const app = express();
const httpServer = http.createServer(app);
const expressServer = async () => {
    const schema = makeExecutableSchema({
        typeDefs: [constraintDirectiveTypeDefs, typedef],
        resolvers,
    });
    const plugins = [
        createApolloQueryValidationPlugin({
            schema,
        }),
    ];
    const server = new ApolloServer({
        schema,
        plugins,
        context: async ({ req }) => ({ token: req.headers.token }),
        formatError: (err: any) => {
            return err.message;
        },
    });
    await server.start();
    server.applyMiddleware({ app });
    connection();
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 9000 }, resolve)
    );
    process.stdout.on('error', function (err) {
        if (err.code == 'EPIPE') {
            process.exit(0);
        }
        process.on('uncaughtException', (err) => {
            console.error(err, 'Uncaught Exception thrown');
            process.exit(1);
        });
    });
    console.log(
        `🚀 Server ready at http://localhost:9000${server.graphqlPath}`
    );
};

expressServer();
