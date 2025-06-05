import { expect, Page } from "@playwright/test";
import TimeoutError from "@playwright/test";
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

  // async verifyContainText(
  //   identifier: string,
  //   expectedText: string,
  //   timeout: number = 10
  // ): Promise<void> {
  //   await this.catchAsync(
  //     `Verify element <<${identifier}>> contains text: "${expectedText}"`,
  //     async () => {
  //       await this.page.waitForSelector(identifier, {
  //         state: "visible",
  //         timeout: timeout * 1000,
  //       });
  //       await expect
  //         .soft(this.page.locator(identifier))
  //         .toContainText(expectedText);
  //     }
  //   )();
  // }

  // async verifyContainText(
  //   identifier: string | string[],
  //   expectedText: string | string[],
  //   timeout: number = 10 // Default timeout
  // ): Promise<void> {
  //   if (typeof identifier === "string") {
  //     const description =
  //       typeof expectedText === "string"
  //         ? `Verify element <<${identifier}>> contains text: "${expectedText}"`
  //         : `Verify element <<${identifier}>> contains one of texts: "${expectedText.join(
  //             '", "'
  //           )}"`;

  //     await this.catchAsync(description, async () => {
  //       // Wait for at least one element matching the selector to be visible
  //       await this.page.waitForSelector(identifier, {
  //         state: "visible",
  //         timeout: timeout * 1000,
  //       });

  //       // Use Playwright's locator and toContainText.
  //       // If 'identifier' matches multiple elements, toContainText will pass if at least one of them
  //       // contains the string, or if any of them contains any of the strings in the array.
  //       await expect
  //         .soft(this.page.locator(identifier))
  //         .toContainText(expectedText);
  //     })();
  //   } else {
  //     // Scenario 2: Multiple identifiers (string[])
  //     const identifiers = identifier;
  //     const expectedTexts = expectedText; // Must be string[]

  //     if (!Array.isArray(expectedTexts)) {
  //       throw new Error(
  //         "When 'identifiers' is an array, 'expectedTexts' must also be an array."
  //       );
  //     }
  //     if (identifiers.length !== expectedTexts.length) {
  //       throw new Error(
  //         "The number of 'identifiers' must match the number of 'expectedTexts'."
  //       );
  //     }

  //     const description = `Verify multiple elements contain specific texts`;
  //     await this.catchAsync(description, async () => {
  //       // Optimization: Create an array of locator promises for all elements
  //       const locators = identifiers.map((id) => this.page.locator(id));

  //       // Wait for all locators to be visible concurrently for efficiency.
  //       // This ensures all target elements are ready before assertions.
  //       await Promise.all(
  //         locators.map((locator) =>
  //           locator.waitFor({
  //             state: "visible",
  //             timeout: timeout * 1000,
  //           })
  //         )
  //       );

  //       // Now, perform soft assertions for each element
  //       for (let i = 0; i < identifiers.length; i++) {
  //         await expect.soft(locators[i]).toContainText(expectedTexts[i]);
  //       }
  //     })();
  //   }
  // }

  async verifyContainText(
    identifier: string | string[],
    expectedText: string | string[],
    timeout: number = 10
  ): Promise<void> {
    if (typeof identifier === "string") {
      // Scenario 1: Single identifier (string)

      const description =
        typeof expectedText === "string"
          ? `Verify element <<${identifier}>> contains text: "${expectedText}"`
          : `Verify element <<${identifier}>> contains one of texts: "${expectedText.join(
              '", "'
            )}"`;

      await this.catchAsync(description, async () => {
        try {
          // Attempt to wait for the selector
          await this.page.waitForSelector(identifier, {
            state: "visible",
            timeout: timeout * 1000,
          });
        } catch (error) {
          if (error instanceof TimeoutError) {
            throw new Error(
              `Element with selector <<${identifier}>> was NOT found or not visible within ${timeout} seconds.`
            );
          }
          throw error; // Re-throw other unexpected errors
        }

        // The toContainText assertion itself provides clear messages on mismatch
        await expect
          .soft(this.page.locator(identifier))
          .toContainText(expectedText);
      })();
    } else {
      // Scenario 2: Multiple identifiers (string[])
      const identifiers = identifier;
      const expectedTexts = expectedText;

      if (!Array.isArray(expectedTexts)) {
        throw new Error(
          "When 'identifiers' is an array, 'expectedTexts' must also be an array."
        );
      }
      if (identifiers.length !== expectedTexts.length) {
        throw new Error(
          "The number of 'identifiers' must match the number of 'expectedTexts'."
        );
      }

      const description = `Verify multiple elements contain specific texts`;
      await this.catchAsync(description, async () => {
        const locators = identifiers.map((id) => this.page.locator(id));
        const missingIdentifiers: string[] = [];

        try {
          // Wait for all locators to be visible concurrently.
          // Catch errors if any individual locator times out.
          await Promise.all(
            locators.map(async (locator, index) => {
              try {
                await locator.waitFor({
                  state: "visible",
                  timeout: timeout * 1000,
                });
              } catch (error) {
                if (error instanceof TimeoutError) {
                  missingIdentifiers.push(identifiers[index]);
                } else {
                  throw error; // Re-throw other unexpected errors
                }
              }
            })
          );
        } catch (error) {
          // This catch block handles errors from Promise.all if one of the inner
          // promises explicitly re-throws an error that isn't a TimeoutError.
          throw error;
        }

        // If any identifiers were missing, throw a consolidated error
        if (missingIdentifiers.length > 0) {
          throw new Error(
            `The following elements were NOT found or not visible within ${timeout} seconds: ${missingIdentifiers.join(
              ", "
            )}.`
          );
        }

        // Perform soft assertions for each element.
        // Playwright's expect().toContainText() provides excellent error messages
        // when the text does not match.
        for (let i = 0; i < identifiers.length; i++) {
          await expect.soft(locators[i]).toContainText(expectedTexts[i]);
        }
      })();
    }
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
