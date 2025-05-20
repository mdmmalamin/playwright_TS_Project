import { test as base, Page } from "@playwright/test";
import { Utils } from "./utils";
import { LoginPage } from "../modules/login/loginPage";
import { LambdaHomePage } from "../modules/home/lambdaHomePage";
import { AccountPage } from "../modules/account/accountPage";

const test = base.extend<{
  runner: Utils;
  lambdaPage: LambdaHomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
}>({
  runner: async ({ page }: { page: Page }, use) => {
    const utilsInstance = new Utils(page);
    await use(utilsInstance);
  },
  lambdaPage: async ({ page }: { page: Page }, use) => {
    const lambdaPageInstance = new LambdaHomePage(page);
    await use(lambdaPageInstance);
  },
  loginPage: async ({ page }: { page: Page }, use) => {
    const loginPageInstance = new LoginPage(page);
    await use(loginPageInstance);
  },

  accountPage: async ({ page }: { page: Page }, use) => {
    const accountPageInstance = new AccountPage(page);
    await use(accountPageInstance);
  },
});

export { test };
