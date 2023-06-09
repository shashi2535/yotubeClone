import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import { resolvers, typedefs } from './graphql';
import { connection } from './config/';
import http from 'http';
const app = express();
const httpServer = http.createServer(app);
const expressServer = async () => {
    const server = new ApolloServer({
        typeDefs: typedefs,
        resolvers,
        context: async ({ req }) => ({ token: req.headers.token }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
    });
    console.log(
        `🚀 Server ready at http://localhost:9000${server.graphqlPath}`
    );
};
expressServer();
