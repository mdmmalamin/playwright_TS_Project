import { Page, test } from "@playwright/test";
import logger from "../helpers/logger";
import { AllureReporter } from "../helpers/AllureReporter";
import {
  ErrorDetails,
  handlePlaywrightError,
} from "../errors/handlePlaywrightError";

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export class BaseUtils {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async captureScreenshotOnFailure(actionName: string): Promise<void> {
    try {
      const screenshotBuffer = await this.page.screenshot();
      await AllureReporter.attachScreenshotBuffer(
        screenshotBuffer,
        `${actionName} Screenshot`
      );
      logger.error(
        `${actionName} failed. Screenshot captured and attached to Allure.`
      );
    } catch (error: any) {
      // console.log(error);
      logger.error(
        `❌ 📸 Error capturing screenshot for ${actionName}: ${error.message}`
      );
    }
  }

  // private logMessage(
  //   message: string,
  //   level: "info" | "waring" | "error" = "info",
  //   errorDetails?: any
  // ): void {
  //   if (level === "info") {
  //     logger.info(message);
  //   }
  //   if (level === "waring") {
  //     logger.warn(message);
  //   }
  //   if (level === "error") {
  //     AllureReporter.attachText("Error Log", message);
  //     test.info().annotations.push({
  //       type: "error",
  //       description: message,
  //     });
  //     logger.error(message);
  //   }
  // }

  private logMessage(
    message: string,
    level: "info" | "waring" | "error" = "info",
    errorDetails?: ErrorDetails
  ): void {
    if (level === "info") {
      logger.info(message); // string only
    }

    if (level === "waring") {
      logger.warn(message); // string only
    }

    if (level === "error") {
      const logPayload = {
        action: message,
        ...errorDetails,
      };

      const formattedText = JSON.stringify(logPayload, null, 2);
      AllureReporter.attachText("Error Log", message);
      test.info().annotations.push({
        type: "error",
        description: message,
      });

      logger.error(formattedText); // object for error
    }
  }

  protected catchAsync<T extends any[], R>(
    actionName: string,
    func: AsyncFunction<T, R>
  ): AsyncFunction<T, R> {
    return async (...args: T): Promise<R> => {
      try {
        this.logMessage(`✅ Attempting action: ${actionName}`, "info");
        await AllureReporter.startStep(actionName);

        const result = await func(...args);

        this.logMessage(
          `✅ Successfully completed action: ${actionName}`,
          "info"
        );
        await AllureReporter.endStep("passed");

        return result;
      } catch (error: any) {
        // Ensure the error is thrown so the function never falls through without returning
        throw this.testError(actionName, error);
      }
    };
  }

  protected async testError(actionName: string, error: Error): Promise<any> {
    // console.error("❌ catchAsync ERROR:", error);
    this.logMessage(
      `❌ Action "${actionName}" failed`,
      "error",
      handlePlaywrightError(error)
    );

    await AllureReporter.endStep("failed");

    await test.step(`❌ Error Details for "${actionName}"`, async () => {
      await AllureReporter.attachText(
        "❌ Error Information",
        `
        👉  ACTION: ${actionName}
        ✏️  NAME: ${error.name || "UnknownError"}
        📋  MESSAGE: ${error.message || "No error message provided"}
        📍  PAGE URL: ${this.page.url()}
        🗂️  STACK: ${error.stack || "No stack trace"}
        `.trim()
      );

      await this.captureScreenshotOnFailure(actionName);
    });
  }
}
