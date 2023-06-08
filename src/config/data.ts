import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
});

const connection = async () => {
    await sequelizeConnection
        .authenticate({ logging: false })
        .then(() => {
            console.log('database connected successfully');
        })
        .catch(() => {
            console.log('database not connected');
        });
};

export { sequelizeConnection, connection };
