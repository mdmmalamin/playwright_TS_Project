import { expect, Page } from "@playwright/test";
import { allure } from "allure-playwright";
import logger from "./logger"; // Import Winston Logger

export class Utils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async captureScreenshotOnFailure(testName: string): Promise<void> {
    try {
      const screenshot = await this.page.screenshot();
      allure.attachment(`${testName} Screenshot`, screenshot, "image/png");
      logger.error(`${testName} failed. Screenshot captured.`);
    } catch (error) {
      logger.error(`Error capturing screenshot: ${error}`);
    }
  }

  private logMessage(message: string, level: "info" | "error" = "info"): void {
    if (level === "info") {
      logger.info(message);
    } else {
      logger.error(message);
    }
  }

  async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url);
      this.logMessage(`Navigated to ${url}`);
    } catch (error) {
      const errorMsg = `Failed to navigate to ${url}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("navigateTo");
      throw new Error(errorMsg);
    }
  }

  async clickOnElement(identifier: string): Promise<void> {
    try {
      await this.page.isVisible(identifier);
      await this.page.locator(identifier).click();
      this.logMessage(`Clicked on element with identifier: ${identifier}`);
    } catch (error) {
      const errorMsg = `Failed to click on element with identifier: ${identifier}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("clickOnElement");
      throw new Error(errorMsg);
    }
  }

  async mouseHover(identifier: string): Promise<void> {
    try {
      await this.page.locator(identifier).hover();
      this.logMessage(`Hovered over element with identifier: ${identifier}`);
    } catch (error) {
      const errorMsg = `Failed to hover over element with identifier: ${identifier}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("mouseHover");
      throw new Error(errorMsg);
    }
  }

  async fillInputBox(identifier: string, text: string): Promise<void> {
    try {
      await this.page.locator(identifier).fill(text);
      this.logMessage(`Filled input box (${identifier}) with text: "${text}"`);
    } catch (error) {
      const errorMsg = `Failed to fill input box (${identifier}) with text: "${text}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("fillInputBox");
      throw new Error(errorMsg);
    }
  }

  async typeInputBox(identifier: string, text: string): Promise<void> {
    try {
      const inputField = this.page.locator(identifier);
      await inputField.fill(""); // Clear first
      await inputField.fill(text);
      this.logMessage(`Typed text: "${text}" in input box (${identifier})`);
    } catch (error) {
      const errorMsg = `Failed to type text: "${text}" in input box (${identifier})`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("typeInputBox");
      throw new Error(errorMsg);
    }
  }

  async dblClickOnElement(identifier: string): Promise<void> {
    try {
      await this.page.locator(identifier).dblclick();
      this.logMessage(`Double-clicked on element (${identifier})`);
    } catch (error) {
      const errorMsg = `Failed to double-click on element (${identifier})`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("dblClickOnElement");
      throw new Error(errorMsg);
    }
  }

  async focusOnElement(identifier: string): Promise<void> {
    try {
      await this.page.locator(identifier).focus();
      this.logMessage(`Focused on element (${identifier})`);
    } catch (error) {
      const errorMsg = `Failed to focus on element (${identifier})`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("focusOnElement");
      throw new Error(errorMsg);
    }
  }

  async verifyTitle(title: string): Promise<void> {
    try {
      await expect(this.page).toHaveTitle(title);
      this.logMessage(`Verified page title: "${title}"`);
    } catch (error) {
      const errorMsg = `Failed to verify title: "${title}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyTitle");
      throw new Error(errorMsg);
    }
  }

  async verifyContainsUrl(url: string, timeout: number = 20000): Promise<void> {
    try {
      await this.page.waitForLoadState("load", { timeout: timeout });
      await expect(this.page).toHaveURL(url);
      this.logMessage(`Verified URL contains: "${url}"`);
    } catch (error) {
      const errorMsg = `Failed to verify URL contains: "${url}" within ${timeout}ms`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyContainsUrl");
      throw new Error(errorMsg);
    }
  }

  async verifyContainText(
    identifier: string,
    expectedText: string,
  ): Promise<void> {
    try {
      await expect
        .soft(this.page.locator(identifier))
        .toContainText(expectedText);
      this.logMessage(
        `Verified element with identifier ${identifier} contains text: "${expectedText}"`,
      );
    } catch (error) {
      const errorMsg = `Failed to verify element with identifier ${identifier} contains text: "${expectedText}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyContainText");
      throw new Error(errorMsg);
    }
  }

  async verifyToHaveValue(
    identifier: string,
    inputFieldText: string,
  ): Promise<void> {
    try {
      await expect
        .soft(this.page.locator(identifier))
        .toHaveValue(inputFieldText);
      this.logMessage(
        `Verified element (${identifier}) has value: "${inputFieldText}"`,
      );
    } catch (error) {
      const errorMsg = `Failed to verify element (${identifier}) has value: "${inputFieldText}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyToHaveValue");
      throw new Error(errorMsg);
    }
  }

  async verifyToHaveCss(
    identifier: string,
    key: string,
    value: string,
  ): Promise<void> {
    try {
      await expect.soft(this.page.locator(identifier)).toHaveCSS(key, value);
      this.logMessage(
        `Verified ${identifier} has CSS property "${key}": "${value}"`,
      );
    } catch (error) {
      const errorMsg = `Failed to verify ${identifier} has CSS property "${key}": "${value}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyToHaveCss");
      throw new Error(errorMsg);
    }
  }

  async verifyElementIsVisible(identifier: string): Promise<void> {
    try {
      await expect.soft(this.page.locator(identifier)).toBeVisible();
      this.logMessage(
        `Verified element with identifier ${identifier} is visible`,
      );
    } catch (error) {
      const errorMsg = `Failed to verify element with identifier ${identifier} is visible`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyElementIsVisible");
      throw new Error(errorMsg);
    }
  }

  async verifyLinksText(
    identifier: string,
    expectedTexts: string | string[],
  ): Promise<void> {
    try {
      const elements = this.page.locator(identifier);
      const count = await elements.count();

      const textsArray = Array.isArray(expectedTexts)
        ? expectedTexts
        : new Array(count).fill(expectedTexts);

      if (textsArray.length !== count) {
        throw new Error(
          `Number of expected texts does not match the number of elements`,
        );
      }

      for (let i = 0; i < count; i++) {
        const text = await elements.nth(i).innerText();
        expect.soft(text).toBe(textsArray[i]);
      }

      this.logMessage(`Verified link texts for ${identifier}`);
    } catch (error) {
      const errorMsg = `Failed to verify link texts for ${identifier}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("verifyLinksText");
      throw new Error(errorMsg);
    }
  }

  async validateAndClick(
    identifier: string,
    expectedText: string,
  ): Promise<void> {
    try {
      await this.page.locator(identifier).focus();
      await expect.soft(this.page.locator(identifier)).toBeVisible();
      const actualText = await this.page.locator(identifier).textContent();

      if (actualText && actualText.trim() === expectedText) {
        await this.page.locator(identifier).click();
        this.logMessage(
          `Validated and clicked on ${identifier} with expected text "${expectedText}"`,
        );
      } else {
        const errorMsg = `Text mismatch on ${identifier}. Expected: "${expectedText}", Found: "${actualText}"`;
        this.logMessage(errorMsg, "error");
        await this.captureScreenshotOnFailure("validateAndClick");
        throw new Error(errorMsg);
      }
    } catch (error) {
      throw error;
    }
  }

  async validateButtonAttribute(
    identifier: string,
    hrefAttribute: string,
  ): Promise<void> {
    try {
      const button = this.page.locator(identifier);
      await expect(button).toBeVisible();
      const hrefValue = await button.getAttribute("href");
      expect(hrefValue).toBe(hrefAttribute);
      this.logMessage(`Verified ${identifier} has href: "${hrefValue}"`);
    } catch (error) {
      const errorMsg = `Failed to verify ${identifier} has href: "${hrefAttribute}"`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("validateButtonAttribute");
      throw new Error(errorMsg);
    }
  }

  async scrollAndClick(identifier: string): Promise<void> {
    try {
      const targetElement = this.page.locator(identifier);
      await targetElement.scrollIntoViewIfNeeded();
      await expect(targetElement).toBeVisible();
      await targetElement.click();
      this.logMessage(`Scrolled and clicked on ${identifier}`);
    } catch (error) {
      const errorMsg = `Failed to scroll and click ${identifier}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("scrollAndClick");
      throw new Error(errorMsg);
    }
  }

  async wait(
    time: number,
    options: {
      waitForSelector?: string;
      waitForNetworkIdle?: boolean;
      waitForLoadState?: "load" | "domcontentloaded" | "networkidle";
    } = {},
  ): Promise<void> {
    const { waitForSelector, waitForNetworkIdle, waitForLoadState } = options;

    try {
      await this.page.waitForTimeout(time * 1000);

      if (waitForSelector) {
        await this.page.waitForSelector(waitForSelector, {
          state: "visible",
          timeout: time * 1000,
        });
        this.logMessage(`Waited for selector: ${waitForSelector}`);
      }

      if (waitForNetworkIdle) {
        await this.page.waitForLoadState("networkidle", {
          timeout: time * 1000,
        });
        this.logMessage("Waited for network idle");
      }

      if (waitForLoadState) {
        await this.page.waitForLoadState(waitForLoadState, {
          timeout: time * 1000,
        });
        this.logMessage(`Waited for page load state: ${waitForLoadState}`);
      }
    } catch (error) {
      const errorMsg = "Failed to wait for the specified conditions";
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("wait");
      throw new Error(errorMsg);
    }
  }

  async clearInputField(identifier: string): Promise<void> {
    try {
      const inputField = this.page.locator(identifier);
      await expect(inputField).toBeVisible();
      await inputField.fill("");
      this.logMessage(`Cleared input field ${identifier}`);
    } catch (error) {
      const errorMsg = `Failed to clear input field ${identifier}`;
      this.logMessage(errorMsg, "error");
      await this.captureScreenshotOnFailure("clearInputField");
      throw new Error(errorMsg);
    }
  }
} // This is the class curly braces
