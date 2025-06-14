import { createLogger, format, transports, config } from "winston";
import "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";

// Define the directory where log files will be stored
const LOG_FILE_PATH = "test-logs";

if (ENV.CONFIG.NODE_ENV !== "production") {
  //! Ensure the log directory exists, or create it if it doesn't
  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.mkdirSync(LOG_FILE_PATH, { recursive: true });
  } else {
    //! Clear existing log files
    fs.readdirSync(LOG_FILE_PATH).forEach((file) => {
      fs.unlinkSync(path.join(LOG_FILE_PATH, file));
    });
  }
}

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
export const logger = createLogger({
  levels: config.npm.levels,
  level: ENV.CONFIG.NODE_ENV !== "production" ? "debug" : "info",
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf((info) => {
          const { timestamp, level, message, stack } = info;

          let baseMessage = `[${timestamp}] ${level.toUpperCase()}: `;

          if (
            level === "error" &&
            typeof message === "object" &&
            message !== null
          ) {
            baseMessage += `\n${JSON.stringify(message, null, 2)}`;
            baseMessage += message;
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
