import { Page } from "playwright";

export class BlogPage {
  readonly blogHeader: string;

  constructor(page: Page) {
    this.blogHeader = `css=`;
  }
}
