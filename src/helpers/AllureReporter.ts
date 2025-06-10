import * as allure from "allure-js-commons";
import { readFileSync } from 'fs';

export class AllureReporter {
  /**
   * Starts a new Allure step.
   * @param stepName The name of the step.
   */
  static async startStep(stepName: string) {
    // allure.step automatically handles the step lifecycle within its callback.
    // We wrap it here to ensure consistency and potential future enhancements.
    await allure.step(stepName, async () => {});
  }

  /**
   * Ends the current Allure step.
   * This method is mostly a placeholder as allure.step and test.step manage status implicitly.
   * @param status The status of the step ('passed', 'failed', 'skipped', 'broken').
   */
  static async endStep(status: 'passed' | 'failed' | 'skipped' | 'broken') {
    // The status is typically determined by whether an error is thrown within the step's execution.
    // For explicit status setting, allure-playwright's internal mechanisms are usually leveraged.
  }

  /**
   * Attaches text content to the Allure report.
   * @param name The name of the attachment.
   * @param content The text content to attach.
   */
  static async attachText(name: string, content: string) {
    await allure.attachment(name, content, 'application/json');
  }

  /**
   * Attaches a screenshot from a file path to the Allure report.
   * @param path The file path of the screenshot.
   * @param name The name of the attachment.
   */
  static async attachScreenshot(path: string, name: string) {
    try {
      const buffer = readFileSync(path);
      await allure.attachment(name, buffer, 'image/png');
    } catch (error) {
      console.error(`Failed to attach screenshot from file ${path}:`, error);
    }
  }

  /**
   * Attaches a screenshot from a Buffer to the Allure report.
   * This is useful when `page.screenshot()` returns a Buffer directly.
   * @param buffer The screenshot buffer.
   * @param name The name of the attachment.
   */
  static async attachScreenshotBuffer(buffer: Buffer, name: string) {
    try {
      await allure.attachment(name, buffer, 'image/png');
    } catch (error) {
      console.error(`Failed to attach screenshot from buffer ${name}:`, error);
    }
  }

  /**
   * Adds an Allure parameter.
   * @param name The name of the parameter.
   * @param value The value of the parameter.
   */
  static async addParameter(name: string, value: string) {
    await allure.parameter(name, value);
  }

  /**
   * Adds an Allure issue link.
   * @param name The name of the issue.
   * @param url The URL of the issue.
   */
  static async addIssue(name: string, url: string) {
    await allure.issue(name, url);
  }

  /**
   * Adds an Allure link.
   * @param url The URL of the link.
   * @param name The name of the link.
   * @param type The type of the link (e.g., 'tms', 'issue', 'url').
   */
  static async addLink(url: string, name?: string, type?: string) {
    await allure.link(url, name, type);
  }
}
