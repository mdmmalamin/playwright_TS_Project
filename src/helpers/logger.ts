// import { createLogger, format, transports } from "winston";
// import fs from "fs";
// import { test } from "allure-playwright";

// const LOG_FILE_PATH = "test-logs.log";

// // Delete existing log file on each run
// if (fs.existsSync(LOG_FILE_PATH)) {
//   fs.unlinkSync(LOG_FILE_PATH);
// }

// // Create base Winston logger
// const logger = createLogger({
//   level: "info",
//   format: format.combine(
//     format.colorize(),
//     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     format.printf(({ timestamp, level, message }) => {
//       return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//     })
//   ),
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: LOG_FILE_PATH }),
//   ],
// });

// export default logger;

import { createLogger, format, transports, config } from "winston";
import "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

// Define the directory where log files will be stored
const LOG_FILE_PATH = "test-logs";

// Ensure the log directory exists
if (!fs.existsSync(LOG_FILE_PATH)) {
  fs.mkdirSync(LOG_FILE_PATH, { recursive: true });
}

fs.readdir(LOG_FILE_PATH, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(LOG_FILE_PATH, file), (err) => {
      if (err) throw err;
    });
  }
});

// Configure Winston Daily Rotate File transport
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: path.join(LOG_FILE_PATH, "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
});

// Create base Winston logger
const logger = createLogger({
  levels: config.npm.levels,
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // format.printf(({ timestamp, level, message, stack }) => {
        //   if (stack) {
        //     return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
        //   }
        //   return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        // }),
        format.printf((info) => {
          const { timestamp, level, message, stack } = info;

          let baseMessage = `[${timestamp}] ${level.toUpperCase()}: `;

          if (level === "error" && typeof message === "object") {
            baseMessage += `\n${JSON.stringify(message, null, 2)}`;
          } else {
            baseMessage += message;
          }

          if (stack) {
            baseMessage += `\n${stack}`;
          }

          return baseMessage;
        }),

        format.colorize()
      ),
    }),
    // File Transport: For structured, rotated logs
    dailyRotateFileTransport,
  ],
  // Catch and log unhandled exceptions and promise rejections
  exceptionHandlers: [
    new transports.File({
      filename: path.join(LOG_FILE_PATH, "exceptions.log"), // Log unhandled exceptions to logs/exceptions.log
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json(),
        format.errors({ stack: true })
      ),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(LOG_FILE_PATH, "rejections.log"), // Log unhandled promise rejections to logs/rejections.log
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json(),
        format.errors({ stack: true })
      ),
    }),
  ],
});

export default logger;
