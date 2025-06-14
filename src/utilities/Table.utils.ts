import { Page } from "@playwright/test";
import { BaseUtils } from "./Base.utils";

export class TableUtils extends BaseUtils {
  constructor(page: Page) {
    super(page);
  }
}
