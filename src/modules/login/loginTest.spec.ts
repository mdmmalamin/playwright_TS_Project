import { test } from "../../utilities/fixtures";
import homePageData from "../home/home.data.json";
import { ExpectedTextProvider } from "../../utilities/valueProvider";

class LoginTest extends ExpectedTextProvider {
  constructor() {
    super();
  }

  runTests() {
    test.describe("Validating User Login Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerStatement }) => {
        await runnerAction.navigateTo(homePageData.lambdaTestUrl);
        await runnerStatement.verifyContainsUrl(homePageData.lambdaTestUrl);
        await runnerStatement.verifyTitle(homePageData.pageTitle);
      });

      test("Validating the input fields", async ({
        runnerAction,
        runnerStatement,
        useLoginPage,
        useHomePage,
      }) => {
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAction.clickOnElement(useHomePage.loginButton);
        await runnerStatement.verifyContainsUrl(homePageData.loginPageUrl);
        await runnerStatement.verifyElementIsVisible(
          useLoginPage.emailInputField
        );
        await runnerAction.clearInputField(useLoginPage.emailInputField);
        await runnerAction.typeInputBox(
          useLoginPage.emailInputField,
          "testUser@gmail.com"
        );
        await runnerStatement.verifyElementIsVisible(
          useLoginPage.passwordInputField
        );
        await runnerAction.clearInputField(useLoginPage.passwordInputField);
        await runnerAction.typeInputBox(
          useLoginPage.passwordInputField,
          "12345678"
        );
        await runnerAction.clickOnElement(useLoginPage.loginButton);
      });

      test("Validating Login Attempts With Valid Credentials", async ({
        runnerAction,
        runnerStatement,
        useLoginPage,
        useHomePage,
        useAccountPage,
      }) => {
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAction.clickOnElement(useHomePage.loginButton);
        await runnerStatement.verifyContainsUrl(homePageData.loginPageUrl);
        await runnerStatement.verifyElementIsVisible(
          useLoginPage.emailInputField
        );
        await runnerAction.clearInputField(useLoginPage.emailInputField);
        await runnerAction.typeInputBox(
          useLoginPage.emailInputField,
          "mahbubasr091@gmail.com"
        );
        await runnerStatement.verifyElementIsVisible(
          useLoginPage.passwordInputField
        );
        await runnerAction.clearInputField(useLoginPage.passwordInputField);
        await runnerAction.typeInputBox(
          useLoginPage.passwordInputField,
          "1234567889"
        );
        await runnerAction.clickOnElement(useLoginPage.loginButton);
        await runnerStatement.verifyElementIsVisible(
          useAccountPage.useLoginPageText
        );
        await runnerStatement.verifyContainText(
          useAccountPage.useLoginPageText,
          "This is a dummy website for Web Automation Testing"
        );
        await runnerStatement.verifyContainsUrl(homePageData.accountPageUrl);
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAction.clickOnElement(useHomePage.accountButton);
      });
    }); //exit
  }
}
const testSuite = new LoginTest();
testSuite.runTests();
