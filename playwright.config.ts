import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./src/config";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.spec.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: ENV.CONFIG.RETRIES ? 2 : 0,
  workers: ENV.CONFIG.WORKERS ? 5 : 2,

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
