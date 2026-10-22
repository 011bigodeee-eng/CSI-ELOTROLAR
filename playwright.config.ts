import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    env: {
      ADMIN_PASSWORD: "csi-e2e-only-not-for-deployment",
      ADMIN_SESSION_SECRET: "csi-e2e-only-session-secret-not-for-deployment",
    },
    timeout: 60000,
  },
});
