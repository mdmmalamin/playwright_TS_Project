import { Page, test } from "@playwright/test";
import { logger } from "../helpers/logger";
import { AllureReporter } from "../helpers/AllureReporter";

type TCatchAsync<T extends any[], R> = (...args: T) => Promise<R>;
export type ErrorDetails = {
  type: string;
  message: string;
  functionPath: string;
  testStepPath: string;
};

export class BaseUtils {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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

      logger.error(formattedText); // object for error
    }
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
      // console.log("❌ 📸 Error capturing screenshot", error);

      this.logMessage(
        `❌ 📸 Error capturing screenshot for ${actionName}`,
        "error",
        await this.handlePlaywrightError(error)
      );
    }
  }

  protected catchAsync<T extends any[], R>(
    actionName: string,
    func: TCatchAsync<T, R>
  ): TCatchAsync<T, R> {
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
        // console.log(`❌ Error in action "${actionName}":`, error);
        // Ensure the error is thrown so the function never falls through without returning
        throw this.testError(actionName, error);
      }
    };
  }

  private async testError(actionName: string, error: Error): Promise<any> {
    // console.error("❌ catchAsync ERROR:", error);
    this.logMessage(
      `❌ Action "${actionName}" failed`,
      "error",
      await this.handlePlaywrightError(error)
    );

    await AllureReporter.endStep("failed");

    await test.step(`❌ Error Details for "${actionName}"`, async () => {
      const allureErrorData = {
        action: actionName,
        name: error.name || "UnknownError",
        message: error.message || "No error message provided",
        pageUrl: this.page.url(),
        stack: error.stack || "No stack trace",
      };
      await AllureReporter.attachText(
        "❌ Error Information",
        JSON.stringify(allureErrorData, null, 2)
      );

      await this.captureScreenshotOnFailure(actionName);
    });
  }

  private async handlePlaywrightError(error: any): Promise<ErrorDetails> {
    const rawMessage: string = error?.message || "Unknown error message";
    const rawStack: string = error?.stack || "";

    const message = rawMessage
      .replace(/\x1B\[[0-9;]*m/g, "")
      .replace(/^TimeoutError:\s*/, "")
      .trim()
      .split("\n")[0];

    const pathMatch = rawStack.match(/\((\/[^)]+):(\d+):(\d+)\)/);
    const functionPath = pathMatch
      ? `${pathMatch[1]}:${pathMatch[2]}:${pathMatch[3]}`
      : "Path not found";

    const specMatches = [
      ...rawStack.matchAll(
        /(?:\(|\s)(\/.*?\.spec\.ts):(\d+):(\d+)(?:\)|\s|$)/g
      ),
    ];
    const lastSpec = specMatches.at(-1);
    const testStepPath = lastSpec
      ? `${lastSpec[1]}:${lastSpec[2]}:${lastSpec[3]}`
      : "Test step path not found";

    return {
      type: error.name || "UnknownError",
      message,
      functionPath,
      testStepPath,
    };
  }
}
