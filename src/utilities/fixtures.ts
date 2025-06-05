import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../modules/login/loginPage";
import { HomePage } from "../modules/home/Home.pom";
import { AccountPage } from "../modules/account/accountPage";
import { ActionsUtils } from "./Actions.utils";
import { StatementUtils } from "./Statement.utils";

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
