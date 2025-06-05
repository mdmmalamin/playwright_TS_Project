import { Page, test } from "@playwright/test";
import logger from "../helpers/logger";
import { AllureReporter } from "../helpers/allureReporter";

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
      logger.error(
        `Error capturing screenshot for ${actionName}: ${error.message}`
      );
    }
  }

  private logMessage(
    message: string,
    level: "info" | "waring" | "error" = "info"
  ): void {
    if (level === "info") {
      logger.info(message);
    }
    if (level === "waring") {
      logger.warn(message);
    }
    if (level === "error") {
      AllureReporter.attachText("Error Log", message);
      test.info().annotations.push({
        type: "error",
        description: message,
      });
      logger.error(message);
    }
  }

  protected catchAsync<T extends any[], R>(
    actionName: string,
    func: AsyncFunction<T, R>
  ): AsyncFunction<T, R> {
    return async (...args: T): Promise<R> => {
      let result: R;
      try {
        this.logMessage(`✅ Attempting action: ${actionName}`, "info");
        await AllureReporter.startStep(actionName);

        result = await func(...args);

        this.logMessage(
          `✅ Successfully completed action: ${actionName}`,
          "info"
        );
        await AllureReporter.endStep("passed");
        return result;
      } catch (error: any) {
        console.log(error)
        const errorMessage = `❌ Action "${actionName}" failed: ${error.message}`;
        this.logMessage(errorMessage, "error");

        await AllureReporter.endStep("failed");

        await test.step(`❌ Error Details for "${actionName}"`, async () => {
          await AllureReporter.attachText(
            "❌ Error Information",
            `
            👉 ACTION: ${actionName}
            📋 MESSAGE: ${error.message}
            ✒️ NAME: ${error.name}
            🗂️ STACK: ${error.stack || "No stack trace available"}
          `
          );
          await this.captureScreenshotOnFailure(actionName);
        });

        throw new Error(errorMessage);
      }
    };
  }
}
