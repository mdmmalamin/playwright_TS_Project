import { test as base, Page } from "@playwright/test";
import { ActionsUtils } from "./Actions.utils";
import { StatementUtils } from "./Statement.utils";
import { HomePage } from "../modules/home/Home.page";
import { LoginPage } from "../modules/login/Login.page";
import { AccountPage } from "../modules/account/Account.page";

const test = base.extend<{
  runnerAction: ActionsUtils;
  runnerStatement: StatementUtils;

  useHomePage: HomePage;
  useLoginPage: LoginPage;
  useAccountPage: AccountPage;
}>({
  runnerAction: async ({ page }: { page: Page }, use) => {
    const runnerActionInstance = new ActionsUtils(page);
    await use(runnerActionInstance);
  },
  runnerStatement: async ({ page }: { page: Page }, use) => {
    const runnerStatementInstance = new StatementUtils(page);
    await use(runnerStatementInstance);
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
