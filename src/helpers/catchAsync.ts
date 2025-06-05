import test from "@playwright/test";
import { AllureReporter } from "./allureReporter";

// Define a generic type for asynchronous functions
type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export function catchAsync<T extends any[], R>(
  actionName: string,
  func: AsyncFunction<T, R>
): AsyncFunction<T, R> {
  return async (...args: T): Promise<R> => {
    let result: R;
    try {
      this.logMessage(`Attempting action: ${actionName}`, "info");
      // Start an Allure step for the action
      await AllureReporter.startStep(actionName);

      // Execute the actual Playwright action
      result = await func(...args);

      this.logMessage(`Successfully completed action: ${actionName}`, "info");
      // End the Allure step as passed
      await AllureReporter.endStep("passed");
      return result;
    } catch (error: any) {
      const errorMessage = `Action "${actionName}" failed: ${error.message}`;
      this.logMessage(errorMessage, "error");

      // End the Allure step as failed
      await AllureReporter.endStep("failed");

      // Create a Playwright test step specifically for the error details
      // This ensures the error details and screenshot appear clearly in the report.
      await test.step(`Error Details for "${actionName}"`, async () => {
        // Attach comprehensive error details to Allure
        await AllureReporter.attachText(
          "Error Information",
          `
            Action: ${actionName}
            Message: ${error.message}
            Name: ${error.name}
            Stack: ${error.stack || "No stack trace available"}
          `
        );

        // Capture and attach a screenshot at the point of failure
        await this.captureScreenshotOnFailure(actionName);
      });

      // Re-throw the error to ensure the Playwright test itself fails
      // and its status is correctly reflected in the overall report.
      throw new Error(errorMessage);
    }
  };
}
