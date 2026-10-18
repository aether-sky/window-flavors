import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { listBackdrops } from "./backdrops.ts";
import { listAnimations, listKeyframes } from "./css.ts";

const read = (file: string): string => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const css = read("backdrops.css");
const backdrops = listBackdrops(css);
const animations = listAnimations(css);

describe("backdrops.css", () => {
  it("has ten backdrops", () => {
    expect(backdrops).toHaveLength(10);
  });

  it("only starts animations it defines, so none silently stands still", () => {
    const defined = listKeyframes(css);
    expect(animations.map((animation) => animation.name).filter((name) => !defined.includes(name))).toEqual([]);
  });

  // Slow loops keep any change far below the three flashes a second that WCAG 2.3.1 limits.
  it("takes at least 8 seconds for every animation", () => {
    expect(animations.length).toBeGreaterThanOrEqual(backdrops.length);
    expect(animations.filter((animation) => animation.seconds < 8)).toEqual([]);
  });

  it("names every backdrop in the README and the demo's menu", () => {
    const readme = read("README.md");
    const demo = read("demo/index.html");
    expect(backdrops.filter((name) => !readme.includes(`\`${name}\``))).toEqual([]);
    expect(backdrops.filter((name) => !demo.includes(`<option>${name}</option>`))).toEqual([]);
  });
});
