// Reads the backdrops and their animations out of backdrops.css.

export function listBackdrops(css: string): string[] {
  return [...new Set([...css.matchAll(/\[data-backdrop="([\w-]+)"\]/g)].map(([, name = ""]) => name))];
}

export type Animation = { name: string; seconds: number };

// Every animation an animation property starts, as its keyframes name and duration.
export function listAnimations(css: string): Animation[] {
  return [...css.matchAll(/\banimation:\s*([^;]+);/g)].flatMap(([, value = ""]) =>
    value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part !== "none")
      .map((part) => {
        const name = part.split(/\s+/).find((word) => /^wf-[\w-]+$/.test(word)) ?? "";
        const seconds = Number(/(\d+(?:\.\d+)?)s\b/.exec(part)?.[1] ?? 0);
        return { name, seconds };
      }),
  );
}

export function listKeyframes(css: string): string[] {
  return [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name = ""]) => name);
}
