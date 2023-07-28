import { config as dotEnvConfig } from 'dotenv';
import { ApiVersions, NodeEnv } from '../constant';
import { getOsEnv, normalizePort, toNumber } from '../service';
dotEnvConfig({ path: `.env.${process.env.NODE_ENV}` });
export const config = {
  APP_NAME: 'Node',
  NODE_ENV: getOsEnv('NODE_ENV'),
  PORT: normalizePort(getOsEnv('PORT')),
  isProduction: getOsEnv('NODE_ENV') === NodeEnv.PRODUCTION,
  isDevelopment: getOsEnv('NODE_ENV') === NodeEnv.DEVELOPMENT,
  isStaging: getOsEnv('NODE_ENV') === NodeEnv.STAGING,
  BASE_URL: '/api/',
  V1_BASE_URL: `/api/${ApiVersions.V1}`,
  SWAGGER_URL: '/docs',
  V1_SWAGGER_URL: `/docs/${ApiVersions.V1}`,
  TWILLIO: {
    ACCOUNT_SID: getOsEnv('ACCOUNT_SID'),
    AUTH_TOKEN: getOsEnv('AUTH_TOKEN'),
    TWILLIO_PHONE_NUMBER: getOsEnv('TWILLIO_PHONE_NUMBER'),
  },
  DB: {
    DB_HOST: getOsEnv('DB_HOST'),
    DB_PORT: toNumber(getOsEnv('DB_PORT')),
    DB_DIALECT: getOsEnv('DB_DRIVER'),
    DB_DATABASE: getOsEnv('DB_NAME'),
    DB_USERNAME: getOsEnv('DB_USER'),
    DB_PASSWORD: getOsEnv('DB_PASSWORD'),
  },
  JWT: {
    EXPIRES_IN: getOsEnv('JWT_EXPIRES_IN'),
    JWT_SECRET: getOsEnv('MY_SECRET'),
  },
  EMAIL: {
    EMAIL_SERVICE: getOsEnv('SERVICE'),
    EMAIL_USERNAME: getOsEnv('MY_EMAIL'),
    EMAIL_PASSWORD: getOsEnv('MY_PASSWORD'),
  },
  CLOUDINARY: {
    CLOUDINARY_API_KEY: getOsEnv('API_KEY'),
    CLOUDINARY_API_SECRET: getOsEnv('API_SECRET'),
    CLOUDINARY_CLOUD_NAME: getOsEnv('CLOUD_NAME'),
  },
  HASH_SALT: toNumber(getOsEnv('HASH_SALT')),
  CRYPTO_ROUNDS: toNumber(getOsEnv('CRYPTO_ROUNDS')),
  CORS: {
    ORIGIN: '*',
    CREDENTIALS: true,
  },
  LOGS: {
    FORMAT: 'dev',
    DIR: '../../logs',
  },
  RATE_LIMIT: {
    MAX: 100,
    WINDOW__MS: 60 * 60 * 1000,
  },
};
