import winston from "winston";

// TODO: need to improve it later.
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 5,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  defaultMeta: { service: "account-service" },
  transports: [
    new winston.transports.Console({ level: "debug", handleExceptions: true }),
    new winston.transports.File({
      filename: `${__dirname}/../logs/app.log`,
      handleExceptions: true,
    }),
  ],
});

export default logger;
