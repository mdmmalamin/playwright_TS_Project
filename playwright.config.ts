import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./src/config";

export default defineConfig({
  testDir: "./src/modules",
  testMatch: "**/*.spec.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: ENV.CONFIG.RETRIES ? 1 : 0,
  workers: ENV.CONFIG.WORKERS ? 5 : 1,

  reporter: [["allure-playwright", { outputFolder: "reports/allure-report" }]],

  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
