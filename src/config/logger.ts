import winston, { format } from 'winston';
const { combine, timestamp, label, printf, prettyPrint } = format;
const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' ')
    ),
    prettyPrint()
  ),
  transports: [new winston.transports.Console()],
});
export { logger };
