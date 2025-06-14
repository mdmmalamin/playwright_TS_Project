import { test as base, Page } from "@playwright/test";
import { ActionsUtils } from "./Actions.utils";
import { HomePage } from "../modules/home/Home.page";
import { LoginPage } from "../modules/login/Login.page";
import { AccountPage } from "../modules/account/Account.page";
import { AssertionsUtils } from "./Assertions.utils";

const test = base.extend<{
  runnerAction: ActionsUtils;
  runnerAssertion: AssertionsUtils;

  useHomePage: HomePage;
  useLoginPage: LoginPage;
  useAccountPage: AccountPage;
}>({
  runnerAction: async ({ page }: { page: Page }, use) => {
    const runnerActionsInstance = new ActionsUtils(page);
    await use(runnerActionsInstance);
  },
  runnerAssertion: async ({ page }: { page: Page }, use) => {
    const runnerAssertionsInstance = new AssertionsUtils(page);
    await use(runnerAssertionsInstance);
  },

  useHomePage: async ({ page }: { page: Page }, use) => {
    const lambdaPageInstance = new HomePage(page);
    await use(lambdaPageInstance);
  },
  useLoginPage: async ({ page }: { page: Page }, use) => {
    const loginPageInstance = new LoginPage(page);
    await use(loginPageInstance);
  },

  useAccountPage: async ({ page }: { page: Page }, use) => {
    const accountPageInstance = new AccountPage(page);
    await use(accountPageInstance);
  },
});

export { test };
