import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { logger } from './logger';
dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

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
    .catch(() => {
      logger.error('database not connected');
    });
};

export { sequelizeConnection, connection };
