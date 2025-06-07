import { Page } from "playwright";

export class RegisterPage {
  readonly registerHeder: string;

  constructor(page: Page) {
    this.registerHeder = `css=`;
  }
}
