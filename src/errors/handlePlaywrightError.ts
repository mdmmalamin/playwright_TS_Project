export type ErrorDetails = {
  type: string;
  message: string;
  path: string;
  testStepPath: string;
};

export function handlePlaywrightError(error: any): ErrorDetails {
  const rawMessage: string = error?.message || "Unknown error message";
  const rawStack: string = error?.stack || "";

  const message = rawMessage
    .replace(/\x1B\[[0-9;]*m/g, "")
    .replace(/^TimeoutError:\s*/, "")
    .trim()
    .split("\n")[0];

  const pathMatch = rawStack.match(/\((\/[^)]+):(\d+):(\d+)\)/);
  const path = pathMatch
    ? `${pathMatch[1]}:${pathMatch[2]}:${pathMatch[3]}`
    : "Path not found";

  const specMatches = [
    ...rawStack.matchAll(/(?:\(|\s)(\/.*?\.spec\.ts):(\d+):(\d+)(?:\)|\s|$)/g),
  ];
  const lastSpec = specMatches.at(-1);
  const testStepPath = lastSpec
    ? `${lastSpec[1]}:${lastSpec[2]}:${lastSpec[3]}`
    : "Test step path not found";

  return {
    type: error.name || "UnknownError",
    message,
    path,
    testStepPath,
  };
}
