import { Page, test } from "@playwright/test";
import { logger } from "../helpers/logger";
import { AllureReporter } from "../helpers/AllureReporter";
import { TErrorDetails, TestError } from "@src/errors";

export enum TLogLevel {
  Info = "info",
  Warning = "warning",
  Error = "error",
}

type TCatchAsync<T extends any[], R> = (...args: T) => Promise<R>;

export class BaseUtils {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Logs messages with different severity levels.
   * @param message - The message to log.
   * @param level - The severity level of the log (default: Info).
   * @param errorDetails - Optional error details for logging.
   */
  protected logMessage(
    message: string,
    level: TLogLevel = TLogLevel.Info,
    errorDetails?: TErrorDetails
  ): void {
    switch (level) {
      case TLogLevel.Info:
        logger.info(message);
        break;
      case TLogLevel.Warning:
        logger.warn({ message, context: errorDetails });
        break;
      case TLogLevel.Error:
        logger.error(
          JSON.stringify({ action: message, ...errorDetails }, null, 2)
        );
        break;
    }
  }

  /**
   * Captures a screenshot when an action fails.
   * @param actionName - Name of the action that failed.
   */
  private async captureScreenshotOnFailure(actionName: string): Promise<void> {
    try {
      if (this.page.isClosed()) return;
      const screenshotBuffer = await this.page.screenshot();
      await AllureReporter.attachScreenshotBuffer(
        screenshotBuffer,
        `${actionName} Screenshot`
      );

      this.logMessage(
        `✅ 📸 Screenshot captured for failed action: <<${actionName}>>`
      );
    } catch (error: any) {
      this.logMessage(
        `❌ 📸 Error capturing screenshot for action: <<${actionName}>>`,
        TLogLevel.Error,
        await this.handlePlaywrightError(error)
      );
    }
  }

  /**
   * Wraps an async function with error handling and logging.
   * @param actionName - Name of the action for logging.
   * @param func - The async function to wrap.
   * @returns A new function that handles errors and logs messages.
   */

  protected catchAsync<T extends any[], R>(
    actionName: string,
    func: TCatchAsync<T, R>
  ): TCatchAsync<T, R> {
    return async (...args: T): Promise<R> => {
      this.logMessage(`✅ Attempting: <<${actionName}>>`);
      await AllureReporter.startStep(actionName);

      try {
        const result = await func(...args);

        this.logMessage(`✅ Completed: <<${actionName}>>`);

        await AllureReporter.endStep("passed");

        return result;
      } catch (error: any) {
        const errorDetails = await this.handlePlaywrightError(error);

        this.logMessage(
          `❌ Failed: ${actionName}`,
          TLogLevel.Error,
          await errorDetails
        );

        await AllureReporter.endStep("failed");

        await test.step(`❌ Error Details for "${actionName}"`, async () => {
          await AllureReporter.attachText(
            "❌ Error Information",
            JSON.stringify(
              {
                action: actionName,
                name: (await errorDetails).type,
                message: (await errorDetails).message,
                pageUrl: this.page.url(),
                stack: (await errorDetails).stack,
              },
              null,
              2
            )
          );
          await this.captureScreenshotOnFailure(actionName);
        });

        if (error instanceof TestError) {
          throw error;
        } else {
          throw new TestError(errorDetails.type, errorDetails.message);
        }
      }
    };
  }

  /**
   * Handles Playwright errors and extracts relevant details.
   * @param error - The error object thrown by Playwright.
   * @returns A structured object containing error type, message, and stack trace.
   */
  private async handlePlaywrightError(error: Error): Promise<TErrorDetails> {
    const type = error.name || "UnknownError";

    const rawMessage = error?.message || "Unknown error message";
    const message = rawMessage
      .replace(/\x1B\[[0-9;]*m/g, "") // remove color codes
      .replace(/^TimeoutError:\s*/, "") // remove prefix
      .trim()
      .split("\n")[0]; // first line

    const rawStack = error?.stack || "";

    const stackLines = rawStack
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("at ")); // keep only stack trace lines

    return { type, message, stack: stackLines };
  }
}
