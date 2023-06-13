import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { User } from './models';
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
        context: async ({ req }) => {
            const token: any = req?.headers?.token;
            if (token) {
                if (token?.startsWith('Bearer')) {
                    const tokenWithOutBearer = token.split('.')[1];
                    const payload = await jwt.verify(
                        tokenWithOutBearer,
                        'secret'
                    );
                    return {
                        payload,
                    };
                }
            }
        },
        formatError: (err: any) => {
            return err.message;
        },
    });
    process.stdout.on('error', function (err) {
        if (err.code == 'EPIPE') {
            process.exit(0);
        }
    });
    await server.start();
    server.applyMiddleware({ app });
    connection();
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 9000 }, resolve)
    );
    console.log(
        `🚀 Server ready at http://localhost:9000${server.graphqlPath}`
    );
};

expressServer();
