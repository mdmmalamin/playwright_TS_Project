import { createLogger, format, transports } from "winston";
import fs from "fs";
import { test } from "allure-playwright";

const LOG_FILE_PATH = "test-logs.log";

// Delete existing log file on each run
if (fs.existsSync(LOG_FILE_PATH)) {
  fs.unlinkSync(LOG_FILE_PATH);
}

// Create base Winston logger
const baseLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: LOG_FILE_PATH }),
  ],
});

// Allure-integrated wrapper logger
const logger = {
  info: (msg: string) => {
    baseLogger.info(`✅ INFO: ${msg}`);
    test.step(`✅ INFO: ${msg}`, async () => Promise.resolve()); // Add as test step in Allure
  },

  error: (msg: string) => {
    baseLogger.error(`❌ ERROR: ${msg}`);
    test.step(`❌ ERROR: ${msg}`, async () => {
      return Promise.resolve();
    });
  },
};

export default logger;
