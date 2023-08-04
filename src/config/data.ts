import { Dialect, Sequelize } from 'sequelize';
import { logger } from './logger';
import { config } from './credential.env';
import { createConnection } from 'mysql2';
const {
  DB: { DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_USERNAME },
} = config;
const dbName = DB_DATABASE as string;
const dbUser = DB_USERNAME as string;
const dbHost = DB_HOST;
const dbDriver = DB_DIALECT as Dialect;
const dbPassword = DB_PASSWORD;

// Open the connection to MySQL server
const mySqlConnection = createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
});
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  logging: false,
});

const connection = async () => {
  await sequelizeConnection
    .authenticate()
    .then(() => {
      logger.info('😀 database connected successfully');
    })
    .catch(async () => {
      logger.error('database not connected');
      await mySqlConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    });
};

export { sequelizeConnection, connection };
