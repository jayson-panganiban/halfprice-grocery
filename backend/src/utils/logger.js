const winston = require("winston");

const errorStackFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message,
    });
  }
  return info;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    errorStackFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
