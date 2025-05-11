import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    // ["html", { outputFolder: "reports/html" }],
    // ["allure-playwright", { outputFolder: "reports/allure" }],
    ['allure-playwright']
  ],

  use: {
    trace: "on-first-retry",
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

  ],
});
