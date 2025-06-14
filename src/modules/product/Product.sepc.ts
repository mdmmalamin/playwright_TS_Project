import { test } from "@src/utilities/fixtures";
import { ENV } from "@src/config";
import homePageData from "@src/modules/home/home.data.json";

class ProductPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Product Page Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerAssertion }) => {
        await runnerAction.navigateTo(ENV.PUBLIC_URL.HOME_PAGE);
        await runnerAssertion.verifyContainsUrl(ENV.PUBLIC_URL.HOME_PAGE);
        await runnerAssertion.verifyTitle(homePageData.pageTitle);
      });

      test("first test", async () => {});
    }); // end of describe block
  } // end of runTests
} // end of ProductPageTest class

const testSuite = new ProductPageTest();
testSuite.runTests();
