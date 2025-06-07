import { handlePlaywrightError } from "./handlePlaywrightError";

export class TestError extends Error {
  public error: any;

  constructor(message: string, error: any, stack?: string) {
    super(message);
    this.name = error.name || "TestError";
    this.error = handlePlaywrightError(error);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


