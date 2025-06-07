import { Page } from "playwright";

export class ProductPage {
  readonly productHeader: string;

  constructor(page: Page) {
    this.productHeader = `css=`;
  }
}
