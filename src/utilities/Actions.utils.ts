import { expect, Page } from "@playwright/test";
import { BaseUtils } from "./Base.utils";
import { TestError } from "../errors/TestError";

export class ActionsUtils extends BaseUtils {
  constructor(page: Page) {
    super(page);
  }

  async navigateTo(url: string): Promise<void> {
    await this.catchAsync(`Navigate to "${url}"`, async () => {
      await this.page.goto(url);
    })();
  }

  async clickOnElement(
    identifier: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(`Click on element: <<${identifier}>>`, async () => {
      await this.page.waitForSelector(identifier, {
        state: "visible",
        timeout: timeout * 1000,
      });
      await this.page.locator(identifier).click();
    })();
  }

  async mouseHover(identifier: string, timeout: number = 10): Promise<void> {
    await this.catchAsync(
      `Mouse hover over element: <<${identifier}>>`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await this.page.locator(identifier).hover();
      }
    )();
  }

  async fillInputBox(
    identifier: string,
    text: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Fill input box <<${identifier}>> with text: "${text}"`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await this.page.locator(identifier).fill(text);
      }
    )();
  }

  async typeInputBox(
    identifier: string,
    text: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Type text: "${text}" in input box <<${identifier}>>`,
      async () => {
        const inputField = this.page.locator(identifier);
        await inputField.fill(""); // Clear first
        await inputField.fill(text);
      }
    )();
  }

  async dblClickOnElement(
    identifier: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Double-click on element: <<${identifier}>>`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await this.page.locator(identifier).dblclick();
      }
    )();
  }

  async focusOnElement(
    identifier: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(`Focus on element: <<${identifier}>>`, async () => {
      await this.page.waitForSelector(identifier, {
        state: "visible",
        timeout: timeout * 1000,
      });
      await this.page.locator(identifier).focus();
    })();
  }

  async scrollAndClick(
    identifier: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Scroll and click on element: <<${identifier}>>`,
      async () => {
        const targetElement = this.page.locator(identifier);
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await targetElement.scrollIntoViewIfNeeded();
        await targetElement.click();
      }
    )();
  }

  async wait(
    time: number,
    options: {
      waitForSelector?: string;
      waitForNetworkIdle?: boolean;
      waitForLoadState?: "load" | "domcontentloaded" | "networkidle";
    } = {}
  ): Promise<void> {
    const { waitForSelector, waitForNetworkIdle, waitForLoadState } = options;

    await this.catchAsync(
      `Wait for ${time} seconds with options: ${JSON.stringify(options)}`,
      async () => {
        await this.page.waitForTimeout(time * 1000); // Convert seconds to milliseconds

        if (waitForSelector) {
          await this.page.waitForSelector(waitForSelector, {
            state: "visible",
            timeout: time * 1000,
          });
        }

        if (waitForNetworkIdle) {
          await this.page.waitForLoadState("networkidle", {
            timeout: time * 1000,
          });
        }

        if (waitForLoadState) {
          await this.page.waitForLoadState(waitForLoadState, {
            timeout: time * 1000,
          });
        }
      }
    )();
  }

  async clearInputField(
    identifier: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(`Clear input field: <<${identifier}>>`, async () => {
      const inputField = this.page.locator(identifier);
      await this.page.waitForSelector(identifier, {
        state: "visible",
        timeout: timeout * 1000,
      });
      await expect(inputField).toBeVisible();
      await inputField.fill("");
    })();
  }

  // This method combines validation and clicking, often better suited for a specific Page Object
  // but included here as a compound action.
  async validateAndClick(
    identifier: string,
    expectedText: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Validate and click on element: <<${identifier}>> with expected text: "${expectedText}"`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await this.page.locator(identifier).focus();
        await expect.soft(this.page.locator(identifier)).toBeVisible();
        const actualText = await this.page.locator(identifier).textContent();

        if (actualText && actualText.trim() === expectedText) {
          await this.page.locator(identifier).click();
        } else {
          throw new TestError(
            `❌ Text mismatch on ${identifier}. Expected: "${expectedText}", Found: "${actualText}"`,
          );
        }
      }
    )();
  }
}
