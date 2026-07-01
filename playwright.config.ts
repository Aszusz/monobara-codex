/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "tests/features/*.feature",
  outputDir: "tests/.features-gen",
  steps: "tests/steps/*.ts",
});

export default defineConfig({
  outputDir: "tests/test-results",
  testDir,
  use: {
    baseURL: "http://localhost:4173",
  },
  webServer: {
    command:
      "bun run dev:api & VITE_API_URL=http://localhost:3000/rpc bun run build && bun run preview -- --host localhost",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
