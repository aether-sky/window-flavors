// Fails any test that writes a console error or warning. A test that expects one replaces console.error or
// console.warn itself.

import { afterEach, beforeEach } from "vitest";
import { format } from "node:util";

const original = { error: console.error, warn: console.warn };
let logged: string[] = [];

beforeEach(() => {
  logged = [];
  console.error = (...args: unknown[]) => {
    logged.push(`console.error: ${format(...args)}`);
    original.error(...args);
  };
  console.warn = (...args: unknown[]) => {
    logged.push(`console.warn: ${format(...args)}`);
    original.warn(...args);
  };
});

afterEach(() => {
  console.error = original.error;
  console.warn = original.warn;
  if (logged.length > 0) throw new Error(`the test wrote to the console:\n${logged.join("\n")}`);
});
