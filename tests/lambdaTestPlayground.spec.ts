import { test } from "../utilities/fixtures";
import lambdaData from "../testData/lambda.json";
import { ExpectedTextProvider } from "../utilities/valueProvider";

class MenuValidationTests extends ExpectedTextProvider {
  constructor() {
    super();
  }

  runTests() {
    test.describe.skip("Validating Menu Click", () => {
      test.beforeEach(async ({ runner }) => {
        await runner.navigateTo(lambdaData.lambdaTestUrl);
      });

      test("Validating Navigation with URL & Title", async ({ runner }) => {
        await runner.verifyContainsUrl(lambdaData.lambdaTestUrl);
        await runner.verifyTitle(lambdaData.pageTitle);
      });

      test("Validating and Entering value to text input field", async ({
        runner,
        lambdaPage,
      }) => {
        await runner.typeInputBox(lambdaPage.textInputField, "cameras");
        await runner.clickOnElement(lambdaPage.searchButton);
        await runner.mouseHover(lambdaPage.accountButton);
        await runner.clickOnElement(lambdaPage.loginButton);
        await runner.clickOnElement(lambdaPage.accountButton);
      });

      test("Validating Login Form & Successful Login Attempt", async ({
        runner,
        lambdaPage,
      }) => {
        await runner.mouseHover(lambdaPage.accountButton);
        await runner.clickOnElement(lambdaPage.loginButton);
        await runner.clickOnElement(lambdaPage.accountButton);

        await runner.verifyLinksText(
          lambdaPage.rightColumnList,
          this.expectedTexts,
        );
      });
    });
  }
}

// Run the tests
const testSuite = new MenuValidationTests();
testSuite.runTests();
