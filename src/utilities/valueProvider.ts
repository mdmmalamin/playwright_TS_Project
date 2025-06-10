import * as fs from "fs";
import * as path from "path";
import { TestError } from "../errors/TestError";

interface LambdaData {
  expectedTexts: string[];
  accountMenuTexts: string[];
}

export class ExpectedTextProvider {
  protected expectedTexts: string[];
  protected accountMenuTexts: string[];

  constructor() {
    const data = this.loadLambdaData();
    this.expectedTexts = data.expectedTexts;
    this.accountMenuTexts = data.accountMenuTexts;
  }

  private loadLambdaData(): LambdaData {
    const jsonFilePath = path.resolve(
      __dirname,
      "../modules/home/home.data.json"
    );

    try {
      const data = fs.readFileSync(jsonFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new TestError(
        `❌ Error reading or parsing the file: ${jsonFilePath}`
      );
    }
  }
}
