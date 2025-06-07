import { test } from "../../utilities/fixtures";
import homePageData from "../home/home.data.json";

class ProductPageTest {
  constructor() {}

  runTests() {
    test.describe("Validating User Product Page Scenarios", () => {
      test.beforeEach(async ({ runnerAction, runnerStatement }) => {
        await runnerAction.navigateTo(homePageData.lambdaTestUrl);
        await runnerStatement.verifyContainsUrl(homePageData.lambdaTestUrl);
        await runnerStatement.verifyTitle(homePageData.pageTitle);
      });

      test("first test", async () => {});
    }); // end of describe block
  } // end of runTests
} // end of ProductPageTest class

const testSuite = new ProductPageTest();
testSuite.runTests();
