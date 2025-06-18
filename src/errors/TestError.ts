// export type ErrorDetails = {
//   type: string;
//   message: string;
//   stack?: string[];
// };

// export class TestError extends Error {
//   public error: any;

//   constructor(message: string, stack?: string) {
//     super(message);

//     stack ? this.stack : Error.captureStackTrace(this, this.constructor);
//   }
// }

// export class TestError extends Error {
//   public details: TErrorDetails;

//   constructor(details: TErrorDetails) {
//     super(details.message || "Unknown Error");

//     this.name = details.type || "TestError";
//     this.details = {
//       type: details.type || "TestError",
//       message: details.message || "No message provided",
//       stack: details.stack || [],
//     };

//     if (this.details.stack && this.details.stack.length) {
//       this.stack = this.details.stack.join("\n");
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

export type TErrorDetails = {
  type: string;
  message: string;
  stack?: string[];
};

export class TestError extends Error {
  public details: TErrorDetails;
  public cause?: Error;

  constructor(type: string, message: string, stack?: string[], cause?: Error) {
    super(message || "Unknown Error");

    this.name = type || "TestError";
    this.details = {
      type: type || "TestError",
      message: message || "No message provided",
      stack: stack || [],
    };

    if (this.details.stack && this.details.stack.length) {
      this.stack = this.details.stack
        .map((line) => (line.startsWith("at ") ? line : `at ${line}`))
        .join("\n");
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    if (cause) this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.details.type,
      message: this.details.message,
      stack: this.details.stack,
    };
  }

  toString(): string {
    return `${this.name}: ${this.details.message}\n${this.stack}`;
  }
}

export enum TErrorType {
  Assertion = "AssertionError",
  Timeout = "TimeoutError",
  TextMismatch = "TextMismatchError",
  CountMismatch = "CountMismatchError",
  ElementNotVisible = "ElementNotVisibleError",
  ValueMismatch = "ValueMismatchError",
  CssMismatch = "CssMismatchError",
  AttributeMismatch = "AttributeMismatchError",
  UnexpectedError = "UnexpectedError",
  NavigationError = "NavigationError",
  SelectorNotFound = "SelectorNotFoundError",
}
