import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:3107",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run start -- -p 3107",
    env: {
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      ADMIN_AUTH_REQUIRED: "true",
      AUTH_SECRET: "e2e-only-secret-with-more-than-32-characters",
      ADMIN_EMAIL: "e2e-admin@example.com",
      ADMIN_PASSWORD: "e2e-only-password-never-used-in-production",
      PAYMENT_MODE: "disabled",
    },
    url: "http://localhost:3107",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
