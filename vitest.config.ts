// Settings for the tests, which read the CSS files and check the flavors' colors.

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["default", "junit", "./test-support/fail-on-skipped-tests.ts"],
    setupFiles: ["./test-support/fail-on-console.ts"],
    outputFile: { junit: ".test-reports/junit.xml" },
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text-summary", "cobertura"],
      reportsDirectory: ".test-reports/coverage",
    },
  },
});
