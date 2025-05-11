import { test } from "../utilities/fixtures";
import lambdaData from "../testData/lambda.json";
import { ExpectedTextProvider } from "../utilities/valueProvider";

class LoginTest extends ExpectedTextProvider {
  constructor() {
    super();
  }

  runTests() {
    test.describe("Validating User Login Scenarios", () => {
      test.beforeEach(async ({ runner }) => {
        await runner.navigateTo(lambdaData.lambdaTestUrl);
        await runner.verifyContainsUrl(lambdaData.lambdaTestUrl);
        await runner.verifyTitle(lambdaData.pageTitle);
      });

      test.skip("Validating the input fields", async ({
        runner,
        loginPage,
        lambdaPage,
      }) => {
        await runner.mouseHover(lambdaPage.accountButton);
        await runner.clickOnElement(lambdaPage.loginButton);
        await runner.verifyContainsUrl(lambdaData.loginPageUrl);
        await runner.verifyElementIsVisible(loginPage.emailInputField);
        await runner.clearInputField(loginPage.emailInputField);
        await runner.typeInputBox(
          loginPage.emailInputField,
          "testUser@gmail.com",
        );
        await runner.verifyElementIsVisible(loginPage.passwordInputField);
        await runner.clearInputField(loginPage.passwordInputField);
        await runner.typeInputBox(loginPage.passwordInputField, "12345678");
        await runner.clickOnElement(loginPage.loginButton);
      });

      test("Validating Login Attempts With Valid Credentials", async ({
        runner,
        loginPage,
        lambdaPage,
        accountPage,
      }) => {
        await runner.mouseHover(lambdaPage.accountButton);
        await runner.clickOnElement(lambdaPage.loginButton);
        await runner.verifyContainsUrl(lambdaData.loginPageUrl);
        await runner.verifyElementIsVisible(loginPage.emailInputField);
        await runner.clearInputField(loginPage.emailInputField);
        await runner.typeInputBox(
          loginPage.emailInputField,
          "mahbubasr091@gmail.com",
        );
        await runner.verifyElementIsVisible(loginPage.passwordInputField);
        await runner.clearInputField(loginPage.passwordInputField);
        await runner.typeInputBox(loginPage.passwordInputField, "1234567889");
        await runner.clickOnElement(loginPage.loginButton);
        await runner.verifyElementIsVisible(accountPage.loginPageText);
        await runner.verifyContainText(
          accountPage.loginPageText,
          "This is a dummy website for Web Automation Testing",
        );
        await runner.verifyContainsUrl(lambdaData.accountPageUrl);
        await runner.mouseHover(lambdaPage.accountButton);
        await runner.clickOnElement(lambdaPage.accountButton);
      });
    }); //exit
  }
}
const testSuite = new LoginTest();
testSuite.runTests();
