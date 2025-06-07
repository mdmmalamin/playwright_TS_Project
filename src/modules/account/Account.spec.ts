import { test } from "../../utilities/fixtures";
import homePageData from "../home/home.data.json";

class LoginPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Account Page Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerStatement }) => {
        await runnerAction.navigateTo(homePageData.lambdaTestUrl);
        await runnerStatement.verifyContainsUrl(homePageData.lambdaTestUrl);
        await runnerStatement.verifyTitle(homePageData.pageTitle);
      });

      test("first test", async () => {});
    }); // end of describe block
  } // end of runTests
} // end of LoginPageTest class

const testSuite = new LoginPageTest();
testSuite.runTests();
