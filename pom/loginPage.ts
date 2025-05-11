import { Page } from "playwright";

export class LoginPage {
  readonly textInputField: string;
  readonly emailInputField: string;
  readonly passwordInputField: string;
  readonly loginButton: string;


  constructor(page: Page) {
    this.textInputField = `#entry_217820 [type='text']`;
    this.emailInputField = `#input-email`;
    this.passwordInputField = `#input-password`;
    this.loginButton = `[action] .btn-primary`;

  }
}
