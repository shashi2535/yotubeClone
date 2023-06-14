import winston, { format } from 'winston';
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = 'winston custom format';
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
export { logger };
