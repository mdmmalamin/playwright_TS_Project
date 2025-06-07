import { test } from "../../utilities/fixtures";
import homePageData from "./home.data.json";
import { ExpectedTextProvider } from "../../utilities/valueProvider";

class HomePageTest extends ExpectedTextProvider {
  constructor() {
    super();
  }

  runTests() {
    test.describe("Validating Menu Click", () => {
      test.beforeEach(async ({ runnerAction }) => {
        await runnerAction.navigateTo(homePageData.lambdaTestUrl);
      });

      test("Validating Navigation with URL & Title", async ({
        runnerStatement,
      }) => {
        await runnerStatement.verifyContainsUrl(homePageData.lambdaTestUrl);
        await runnerStatement.verifyTitle(homePageData.pageTitle);
      });

      test("Validating and Entering value to text input field", async ({
        runnerAction,
        runnerStatement,
        useHomePage,
      }) => {
        await runnerStatement.verifyElementIsVisible([
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
        runnerStatement,
        useHomePage,
      }) => {
        await runnerAction.mouseHover(useHomePage.accountButton);
        await runnerStatement.verifyElementIsVisible([
          useHomePage.accountButton,
          useHomePage.loginButton,
        ]);
        await runnerAction.clickOnElement(useHomePage.loginButton);
        await runnerAction.clickOnElement(useHomePage.accountButton);

        await runnerStatement.verifyLinksText(
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
