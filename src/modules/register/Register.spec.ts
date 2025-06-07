import { test } from "../../utilities/fixtures";
import homePageData from "../home/home.data.json";

class RegisterPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Register Page Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerStatement }) => {
        await runnerAction.navigateTo(homePageData.lambdaTestUrl);
        await runnerStatement.verifyContainsUrl(homePageData.lambdaTestUrl);
        await runnerStatement.verifyTitle(homePageData.pageTitle);
      });

      test("first test", async () => {});
    }); // end of describe block
  } // end of runTests
} // end of RegisterPageTest class

const testSuite = new RegisterPageTest();
testSuite.runTests();
