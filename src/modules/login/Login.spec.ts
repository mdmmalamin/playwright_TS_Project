import { test } from "@src/utilities/fixtures";
import homePageData from "@src/modules/home/home.data.json";
import { ENV } from "@src/config";

class LoginPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Login Scenarios", () => {
      test.beforeEach(
        async ({ runnerAction, runnerAssertion, useHomePage }) => {
          await runnerAction.navigateTo(ENV.PUBLIC_URL.HOME_PAGE);
          await runnerAssertion.verifyContainsUrl(ENV.PUBLIC_URL.HOME_PAGE);
          await runnerAssertion.verifyTitle(homePageData.pageTitle);

          await runnerAction.mouseHover(useHomePage.accountButton);
          await runnerAction.clickOnElement(useHomePage.loginButton);
          await runnerAssertion.verifyContainsUrl(ENV.PUBLIC_URL.LOGIN_PAGE);
        }
      );

      test("Validating the input fields", async ({
        runnerAction,
        runnerAssertion,
        useLoginPage,
      }) => {
        await runnerAssertion.verifyElementIsVisible(
          useLoginPage.emailInputField
        );
        await runnerAction.clearInputField(useLoginPage.emailInputField);
        await runnerAction.typeInputBox(
          useLoginPage.emailInputField,
          "testUser@gmail.com"
        );
        await runnerAssertion.verifyElementIsVisible(
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
        runnerAssertion,
        useLoginPage,
        useHomePage,
        useAccountPage,
      }) => {
        await runnerAssertion.verifyElementIsVisible(
          useLoginPage.emailInputField
        );
        await runnerAction.clearInputField(useLoginPage.emailInputField);
        await runnerAction.typeInputBox(
          useLoginPage.emailInputField,
          "mahbubasr091@gmail.com"
        );
        await runnerAssertion.verifyElementIsVisible(
          useLoginPage.passwordInputField
        );
        await runnerAction.clearInputField(useLoginPage.passwordInputField);
        await runnerAction.typeInputBox(
          useLoginPage.passwordInputField,
          "1234567889"
        );
        await runnerAction.clickOnElement(useLoginPage.loginButton);
        await runnerAssertion.verifyElementIsVisible(
          useAccountPage.useLoginPageText
        );
        await runnerAssertion.verifyContainText(
          useAccountPage.useLoginPageText,
          "This is a dummy website for Web Automation Testing"
        );
        await runnerAssertion.verifyContainsUrl(
          ENV.USER_ACCOUNT_URL.ACCOUNT_PAGE
        );
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAction.clickOnElement(useHomePage.accountButton);
      });
    }); // end of describe block
  } // end of runTests
} // end of LoginPageTest class

const testSuite = new LoginPageTest();
testSuite.runTests();
