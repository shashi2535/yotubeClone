// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
module.exports = {
  development: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: dbDriver,
  },
};
