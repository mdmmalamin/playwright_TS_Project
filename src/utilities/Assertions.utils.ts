import { expect, Page } from "@playwright/test";
import TimeoutError from "@playwright/test";
import { BaseUtils } from "./Base.utils";
import { TErrorType, TestError } from "@src/errors";

export class AssertionsUtils extends BaseUtils {
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
    identifier: string | string[],
    expectedText: string | string[],
    timeout = 10
  ): Promise<void> {
    const ids = Array.isArray(identifier) ? identifier : [identifier];
    const texts = Array.isArray(expectedText) ? expectedText : [expectedText];
    const timeoutMs = timeout * 1000;

    if (ids.length !== texts.length) {
      throw new TestError(
        TErrorType.TextMismatch,
        `❌ Expected ${texts.length} identifiers but received ${ids.length}. Make sure both arrays are of equal length.`
      );
    }

    const description =
      ids.length === 1
        ? `🔍 Verify element <<${ids[0]}>> contains text: "${texts[0]}"`
        : `🔍 Verify ${ids.length} elements contain expected texts`;

    await this.catchAsync(description, async () => {
      const locators = ids.map((id) => this.page.locator(id));
      const missing: string[] = [];

      //? Step 1: Wait for visibility
      await Promise.all(
        locators.map((locator, i) =>
          locator
            .waitFor({ state: "visible", timeout: timeoutMs })
            .catch((error) => {
              if (error instanceof TimeoutError) missing.push(ids[i]);
              else throw error;
            })
        )
      );

      if (missing.length) {
        throw new TestError(
          TErrorType.ElementNotVisible,
          `❌ The following elements were NOT visible within ${timeout} seconds:\n${missing.join(
            "\n"
          )}`
        );
      }

      //? Step 2: Check that each element contains the expected text
      const failedAssertions: string[] = [];

      await Promise.all(
        locators.map(async (locator, i) => {
          const textContent = await locator.textContent();
          const actual = textContent?.trim() || "";
          const expected = texts[i].trim();
          if (!actual.includes(expected)) {
            failedAssertions.push(
              `- Selector: <<${ids[i]}>>\n  Expected: "${expected}"\n  Actual: "${actual}"`
            );
          }
          //? Still run soft assertion for test report
          await expect.soft(locator).toContainText(texts[i]);
        })
      );

      if (failedAssertions.length) {
        throw new TestError(
          TErrorType.TextMismatch,
          `❌ Text content mismatches:\n${failedAssertions.join("\n")}`
        );
      }
    })();
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

  async verifyElementIsVisible(
    identifier: string | string[],
    timeout: number = 10
  ): Promise<void> {
    const identifiersToVerify = Array.isArray(identifier)
      ? identifier
      : [identifier];

    const failedSelectors: string[] = [];

    for (const singleIdentifier of identifiersToVerify) {
      await this.catchAsync(
        `Verify element <<${singleIdentifier}>> is visible`,
        async () => {
          try {
            await this.page.waitForSelector(singleIdentifier, {
              state: "visible",
              timeout: timeout * 1000,
            });
            await expect
              .soft(this.page.locator(singleIdentifier))
              .toBeVisible();
          } catch {
            failedSelectors.push(singleIdentifier);
          }
        }
      )();
    }

    if (failedSelectors.length) {
      throw new TestError(
        TErrorType.ElementNotVisible,
        `The following elements were not visible:\n${failedSelectors.join(
          "\n"
        )}`
      );
    }
  }

  async verifyLinksText(
    identifier: string,
    expectedTexts: string | string[],
    timeout = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify link texts for <<${identifier}>>`,
      async () => {
        const elements = this.page.locator(identifier);
        await elements
          .first()
          .waitFor({ state: "visible", timeout: timeout * 1000 });

        const count = await elements.count();
        const textsArray = Array.isArray(expectedTexts)
          ? expectedTexts
          : Array(count).fill(expectedTexts);

        if (textsArray.length !== count) {
          throw new TestError(
            TErrorType.TextMismatch,
            `❌ Number of expected texts does not match the number of elements. Expected ${textsArray.length}, Found ${count}.`
          );
        }

        for (let i = 0; i < count; i++) {
          const actualText = await elements.nth(i).innerText();

          if (actualText.trim() !== textsArray[i].trim()) {
            throw new TestError(
              TErrorType.TextMismatch,
              `❌ Text mismatch at index ${i}. Expected: "${textsArray[i]}", but Actual: "${actualText}"`
            );
          }
        }
      }
    )();
  }

  async verifyAttribute(
    identifier: string,
    attribute: string,
    expectedValue: string,
    timeout: number = 10
  ): Promise<void> {
    await this.catchAsync(
      `Verify <<${identifier}>> has attribute [${attribute}="${expectedValue}"]`,
      async () => {
        await this.page.waitForSelector(identifier, {
          state: "visible",
          timeout: timeout * 1000,
        });
        const attrValue = await this.page
          .locator(identifier)
          .getAttribute(attribute);
        expect(attrValue).toBe(expectedValue);
      }
    )();
  }

  async verifyCount(identifier: string, expectedCount: number): Promise<void> {
    await this.catchAsync(
      `Verify <<${identifier}>> has count: ${expectedCount}`,
      async () => {
        const elements = this.page.locator(identifier);
        await expect(elements).toHaveCount(expectedCount);
      }
    )();
  }
}
