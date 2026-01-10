import { defineConfig } from "@playwright/test";

const webUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const apiUrl = process.env.E2E_API_URL ?? "http://localhost:8000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: webUrl,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "bun run dev:api",
      url: apiUrl,
      reuseExistingServer: !process.env.CI,
      env: {
        CORS_ORIGIN: webUrl,
      },
      timeout: 120_000,
    },
    {
      command: "bun run dev:web",
      url: webUrl,
      reuseExistingServer: !process.env.CI,
      env: {
        NEXT_PUBLIC_API_URL: apiUrl,
        NEXT_PUBLIC_SERVER_URL: webUrl,
      },
      timeout: 120_000,
    },
  ],
});
