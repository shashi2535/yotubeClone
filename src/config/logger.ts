import winston, { format, addColors, createLogger } from 'winston';
const { combine, timestamp, printf, prettyPrint, colorize, simple } = format;
const logger = createLogger({
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        simple(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' ')
        )
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
