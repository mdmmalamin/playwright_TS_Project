import { ENV } from "@src/config";
import { test } from "@src/utilities/fixtures";
import homePageData from "@src/modules/home/home.data.json";

class BlogPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Blog Page Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerAssertion }) => {
        await runnerAction.navigateTo(ENV.PUBLIC_URL.HOME_PAGE);
        await runnerAssertion.verifyContainsUrl(ENV.PUBLIC_URL.HOME_PAGE);
        await runnerAssertion.verifyTitle(homePageData.pageTitle);
      });

      test("first test", async () => {});
    }); // end of describe block
  } // end of runTests
} // end of BlogPageTest class

const testSuite = new BlogPageTest();
testSuite.runTests();
