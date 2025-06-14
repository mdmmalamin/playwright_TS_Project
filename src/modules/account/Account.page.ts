import { Page } from "playwright";

export class AccountPage {
  readonly useLoginPageText: string;
  readonly accountMenus: string;

  readonly accountBreadcrumb: string;

  constructor(page: Page) {
    this.useLoginPageText = `[class='m-0 font-size-sm'] strong`;
    this.accountMenus = `.dropdown-menu.mz-sub-menu-96 > li > .both.dropdown-item.icon-left > .info > .title`;

    this.accountBreadcrumb = `css=ol > li[class='breadcrumb-item active']`;
  }
}
