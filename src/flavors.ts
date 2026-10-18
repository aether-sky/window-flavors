// Reads the flavors' colors out of tokens.css and measures contrast the way WCAG 2.2 defines it.

export type Colors = Readonly<Record<string, string>>;

// Each flavor's colors, with the colors every flavor shares added in.
export function parseFlavors(css: string): Map<string, Colors> {
  const shared = readColors(/^\.wf \{([^}]*)\}/m.exec(css)?.[1] ?? "");
  const flavors = new Map<string, Colors>();
  for (const match of css.matchAll(/\.wf\[data-flavor="([\w-]+)"\]\s*\{([^}]*)\}/g)) {
    const [, name = "", body = ""] = match;
    flavors.set(name, { ...shared, ...readColors(body) });
  }
  return flavors;
}

function readColors(body: string): Colors {
  return Object.fromEntries(
    [...body.matchAll(/--wf-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, name, hex]) => [name, hex]),
  );
}

export function getContrastRatio(first: string, second: string): number {
  const [lighter, darker] = [getLuminance(first), getLuminance(second)].sort((a, b) => b - a);
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

function getLuminance(hex: string): number {
  const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}
