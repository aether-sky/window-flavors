import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { listAnimations, listKeyframes, listValues } from "./css.ts";

const read = (file: string): string => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const components = read("components.css");
const tokens = read("tokens.css");

describe("components.css", () => {
  it("sizes all text and corners from the tokens, so the scale stays small", () => {
    const sizes = [...listValues(components, "font-size"), ...listValues(components, "border-radius")];
    expect(sizes.length).toBeGreaterThan(10);
    expect(sizes.filter((value) => !value.includes("var(--wf-"))).toEqual([]);
  });

  // WCAG 2.2.2: anything that starts moving on its own must stop within five seconds, or have a pause button.
  it("stops every animation of its own within five seconds", () => {
    const animations = listAnimations(components);
    expect(animations.length).toBeGreaterThan(0);
    expect(animations.filter((animation) => animation.seconds * animation.iterations > 5)).toEqual([]);
  });

  it("only starts animations it defines", () => {
    const defined = listKeyframes(components);
    expect(listAnimations(components).filter((animation) => !defined.includes(animation.name))).toEqual([]);
  });
});

describe("tokens.css", () => {
  it("keeps pixel text at whole multiples of the font's 16px dot grid, so it stays sharp", () => {
    const pixelSizes = [...tokens.matchAll(/--wf-pixel-\d+:\s*(\d+)px/g)].map(([, size]) => Number(size));
    expect(pixelSizes.length).toBeGreaterThan(0);
    expect(pixelSizes.filter((size) => size % 16 !== 0)).toEqual([]);
  });
});

describe("listAnimations", () => {
  it("reads each animation in a list with its runs, skipping none", () => {
    const css = "a { animation: wf-spin 120s linear infinite, wf-nudge 0.8s ease-in-out 4; } b { animation: none; }";
    expect(listAnimations(css)).toEqual([
      { name: "wf-spin", seconds: 120, iterations: Infinity },
      { name: "wf-nudge", seconds: 0.8, iterations: 4 },
    ]);
  });
});
