// Vitest reporter that fails the run when any test is skipped, whether by .skip, .todo or skipping itself.
// Tests left out by a name filter (-t) don't count.

import type { Reporter, TestModule, Vitest } from "vitest/node";

export default class FailOnSkippedTests implements Reporter {
  private filtered = false;

  onInit(vitest: Vitest): void {
    this.filtered = vitest.config.testNamePattern !== undefined;
  }

  onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
    if (this.filtered) return;
    const skipped = testModules.flatMap((testModule) =>
      [...testModule.children.allTests("skipped")].map((test) => `${testModule.moduleId}: ${test.fullName}`),
    );
    if (skipped.length === 0) return;
    console.error(
      `\nThese tests were skipped, which fails the run:\n${skipped.map((name) => `  ${name}`).join("\n")}\n`,
    );
    process.exitCode = 1;
  }
}
