import { test } from "@src/utilities/fixtures";
import homePageData from "./home.data.json";
import { ENV } from "@src/config";
import { ExpectedTextProvider } from "@src/utilities/valueProvider";

class HomePageTest extends ExpectedTextProvider {
  constructor() {
    super();
  }

  runTests() {
    test.describe("Validating Menu Click", () => {
      test.beforeEach(async ({ runnerAction }) => {
        await runnerAction.navigateTo(ENV.PUBLIC_URL.HOME_PAGE);
      });

      test("Validating Navigation with URL & Title", async ({
        runnerAssertion,
      }) => {
        await runnerAssertion.verifyContainsUrl(ENV.PUBLIC_URL.HOME_PAGE);
        // await runnerAssertion.verifyTitle(homePageData.pageTitle);
      });

      test("Validating and Entering value to text input field", async ({
        runnerAction,
        runnerAssertion,
        useHomePage,
      }) => {
        await runnerAssertion.verifyElementIsVisible([
          useHomePage.textInputField,
          useHomePage.searchButton,
          useHomePage.accountButton,
          useHomePage.loginButton,
        ]);
        await runnerAction.typeInputBox(useHomePage.textInputField, "cameras");
        await runnerAction.clickOnElement(useHomePage.searchButton);
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAction.clickOnElement(useHomePage.loginButton);
        await runnerAction.clickOnElement(useHomePage.accountButton);
      });

      test("Validating Login Form & Successful Login Attempt", async ({
        runnerAction,
        runnerAssertion,
        useHomePage,
      }) => {
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerAssertion.verifyElementIsVisible([
          useHomePage.accountButton,
          useHomePage.loginButton,
        ]);
        await runnerAction.clickOnElement(useHomePage.loginButton);
        await runnerAction.clickOnElement(useHomePage.accountButton);

        await runnerAssertion.verifyLinksText(
          useHomePage.rightColumnList,
          this.expectedTexts
        );
      });
    }); // end of describe block
  } // end of runTests
} // end of HomePageTest class

// Run the tests
const testSuite = new HomePageTest();
testSuite.runTests();
