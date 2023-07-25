const {
  config: {
    DB: { DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_USERNAME },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../config');

const dbName = DB_DATABASE;
const dbHost = DB_HOST;
const dbDriver = DB_DIALECT;
const dbPassword = DB_PASSWORD;
const dbUser = DB_USERNAME;
module.exports = {
  development: {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    dialect: dbDriver,
  },
};
