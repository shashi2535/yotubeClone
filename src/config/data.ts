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
