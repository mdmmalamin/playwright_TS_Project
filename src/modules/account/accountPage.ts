import { Page } from "playwright";

export class AccountPage {
  readonly loginPageText: string;
  readonly accountMenus: string;

  constructor(page: Page) {
    this.loginPageText = `[class='m-0 font-size-sm'] strong`;
    this.accountMenus = `.dropdown-menu.mz-sub-menu-96 > li > .both.dropdown-item.icon-left > .info > .title`;
  }
}
