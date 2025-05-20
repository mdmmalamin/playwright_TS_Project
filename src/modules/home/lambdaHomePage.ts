import { Page } from "playwright";

export class LambdaHomePage {
  readonly textInputField: string;
  readonly searchButton: string;
  readonly accountButton: string;
  readonly loginButton: string;
  readonly emailField: string;
  readonly passwordField: string;
  readonly accountLoginButton: string;
  readonly rightColumnList: string;

  constructor(page: Page) {
    this.textInputField = `#entry_217820 [type='text']`;
    this.searchButton = `div#search  .type-text`;
    this.accountButton = `div#widget-navbar-217834 > ul > li:nth-of-type(6) > a[role='button']  .title`;
    this.loginButton = `div#widget-navbar-217834 .dropdown-menu.mz-sub-menu-96 > li:nth-of-type(1) > .both.dropdown-item.icon-left`;
    this.emailField = `input#input-email`;
    this.passwordField = `#input-password`;
    this.accountLoginButton = `[action] .btn-primary`;
    this.rightColumnList = `aside#column-right > div > a`;
  }
}
