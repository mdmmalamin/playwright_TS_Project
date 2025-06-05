import { expect, Page } from "@playwright/test";
import { BaseUtils } from "./Base.utils";

export class StatementUtils extends BaseUtils {
  constructor(page: Page) {
    super(page);
  }

  async verifyTitle(title: string): Promise<void> {
    await this.catchAsync(`Verify page title: "${title}"`, async () => {
      await expect(this.page).toHaveTitle(title);
    })();
  }

  async verifyContainsUrl(url: string, timeout: number = 20): Promise<void> {
    await this.catchAsync(
      `Verify URL contains: "${url}" with timeout ${timeout * 1000}ms`,
      async () => {
        await this.page.waitForLoadState("load", { timeout: timeout * 1000 });
        await expect(this.page).toHaveURL(url);
      }
    )();
  }

  async verifyContainText(
    identifier: string,
    expectedText: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify element <<${identifier}>> contains text: "${expectedText}"`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await expect
          .soft(this.page.locator(identifier))
          .toContainText(expectedText);
      }
    )();
  }

  async verifyToHaveValue(
    identifier: string,
    inputFieldText: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify element <<${identifier}>> has value: "${inputFieldText}"`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await expect
          .soft(this.page.locator(identifier))
          .toHaveValue(inputFieldText);
      }
    )();
  }

  async verifyToHaveCss(
    identifier: string,
    key: string,
    value: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify element <<${identifier}>> has CSS property "${key}": "${value}"`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await expect.soft(this.page.locator(identifier)).toHaveCSS(key, value);
      }
    )();
  }

  // async verifyElementIsVisible(
  //   identifier: string,
  //   timeout: number = 10
  // ): Promise<void> {
  //   await this.catchAsync(
  //     `Verify element <<${identifier}>> is visible`,
  //     async () => {
  //       await this.page.waitForSelector(identifier, {
  //         state: "visible",
  //         timeout: timeout * 1000,
  //       });
  //       await expect.soft(this.page.locator(identifier)).toBeVisible();
  //     }
  //   )();
  // }
  async verifyElementIsVisible(
    identifier: string | string[],
    timeout: number = 10
  ): Promise<void> {
    const identifiersToVerify = Array.isArray(identifier)
      ? identifier
      : [identifier];

    for (const singleIdentifier of identifiersToVerify) {
      await this.catchAsync(
        `Verify element <<${singleIdentifier}>> is visible`,
        async () => {
          await this.page.waitForSelector(singleIdentifier, {
            state: "visible",
            timeout: timeout * 1000,
          });
          await expect.soft(this.page.locator(singleIdentifier)).toBeVisible();
        }
      )();
    }
  }

  async verifyLinksText(
    identifier: string,
    expectedTexts: string | string[],
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify link texts for <<${identifier}>>`,
      async () => {
        const elements = this.page.locator(identifier);
        const count = await elements.count();

        const textsArray = Array.isArray(expectedTexts)
          ? expectedTexts
          : new Array(count).fill(expectedTexts);

        if (textsArray.length !== count) {
          throw new Error(
            `Number of expected texts does not match the number of elements. Expected ${textsArray.length}, Found ${count}.`
          );
        }

        for (let i = 0; i < count; i++) {
          const text = await elements.nth(i).innerText();
          expect.soft(text).toBe(textsArray[i]);
        }
      }
    )();
  }

  async validateButtonAttribute(
    identifier: string,
    hrefAttribute: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Validate button <<${identifier}>> has href attribute: "${hrefAttribute}"`,
      async () => {
        const button = this.page.locator(identifier);
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        await expect(button).toBeVisible();
        const hrefValue = await button.getAttribute("href");
        expect(hrefValue).toBe(hrefAttribute);
      }
    )();
  }
}
