export type ErrorDetails = {
  type: string;
  message: string;
  functionPath: string;
  testStepPath: string;
};

export class TestError extends Error {
  public error: any;

  constructor(message: string, stack?: string) {
    super(message);

    stack ? this.stack : Error.captureStackTrace(this, this.constructor);
  }
}
