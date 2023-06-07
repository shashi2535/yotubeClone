import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { resolvers } from './resolver';
import { typeDefs } from './schema';
import { connection } from './config/';
import cors from 'cors';
import http from 'http';
const app = express();
const httpServer = http.createServer(app);
const expressServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    app.use(
        '/',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server)
    );
    connection();

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 9000 }, resolve)
    );
    console.log('🚀 Server ready at http://localhost:9000');
};
expressServer();
