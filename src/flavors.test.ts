import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getContrastRatio, parseFlavors } from "./flavors.ts";

const flavors = parseFlavors(readFileSync(new URL("../tokens.css", import.meta.url), "utf8"));

// Each text color and the fills it is drawn on in components.css.
const TEXT_ON_FILL: readonly (readonly [string, string])[] = [
  ...["ink", "accent", "muted", "warn", "frame"].flatMap((text) => [[text, "fill"] as const, [text, "well"] as const]),
  ["fill", "frame"],
  ["fill", "warn"],
  ["fill", "accent"],
  ["drum-ink", "drum"],
  ["drum-ink", "drum-edge"],
];

describe("tokens.css", () => {
  it("has the five flavors", () => {
    expect([...flavors.keys()]).toEqual(["plain", "mint", "strawberry", "banana", "peanut"]);
  });

  it("gives every flavor the same colors, so none falls back to another flavor's", () => {
    const plain = Object.keys(flavors.get("plain") ?? {}).sort();
    for (const colors of flavors.values()) expect(Object.keys(colors).sort()).toEqual(plain);
  });

  it.each([...flavors.keys()])("keeps all text in %s at WCAG AAA contrast, 7:1 or more", (name) => {
    const colors = flavors.get(name) ?? {};
    const failing = TEXT_ON_FILL.filter(([text, fill]) => {
      const [textColor, fillColor] = [colors[text], colors[fill]];
      return textColor === undefined || fillColor === undefined || getContrastRatio(textColor, fillColor) < 7;
    });
    expect(failing).toEqual([]);
  });
});

describe("getContrastRatio", () => {
  it("measures black on white as 21:1 either way round", () => {
    expect(getContrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
    expect(getContrastRatio("#ffffff", "#000000")).toBeCloseTo(21);
  });

  it("measures a color on itself as 1:1", () => {
    expect(getContrastRatio("#7b2a88", "#7b2a88")).toBe(1);
  });
});
