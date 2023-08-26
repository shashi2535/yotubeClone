import { Dialect, Sequelize } from 'sequelize';
import { logger } from './logger';
import { config } from './credential.env';
const {
  DB: { DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_USERNAME },
} = config;
const dbName = DB_DATABASE as string;
const dbUser = DB_USERNAME as string;
const dbHost = DB_HOST;
const dbDriver = DB_DIALECT as Dialect;
const dbPassword = DB_PASSWORD;
let sequelizeConnection: any;
if (process.env.NODE_ENV === 'development') {
  sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
    logging: false,
    // dialectOptions: {
    //   socket: '/var/run/mysqld/mysqld.sock',
    // },
  });
} else {
  sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
    logging: false,

    dialectOptions: {
      ssl: {
        require: 'true',
      },
    },
  });
}
const connection = async () => {
  // Create a raw query to create the database if it doesn't exist
  sequelizeConnection
    .query('CREATE DATABASE IF NOT EXISTS your_database_name')
    .then(() => {
      logger.info('database connected or already exists');
    })
    .catch((error: any) => {
      console.error('Error creating database:', error);
    });
  // console.log('???');
  await sequelizeConnection
    .authenticate()
    .then(() => {
      logger.info('😀 database connected successfully');
    })
    .catch(async (err: any) => {
      logger.error('database not connected');
    });
};

export { sequelizeConnection, connection };
