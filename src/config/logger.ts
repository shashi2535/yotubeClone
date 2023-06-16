import winston, { format, addColors, createLogger } from 'winston';
const { combine, timestamp, printf, prettyPrint, colorize, simple } = format;
const logger = createLogger({
  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        simple(),
        printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' ')
        ),
        colorize({ all: true })
      ),
    }),
  ],
});
addColors({
  error: 'red',
  warn: 'pink',
  info: 'yellow',
  debug: 'blue',
});

export { logger };
