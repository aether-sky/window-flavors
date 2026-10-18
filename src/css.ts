// Reads animations, keyframes and declared values out of a stylesheet's text.

export type Animation = { name: string; seconds: number; iterations: number };

// Every animation an animation property starts, with its duration and how many times it runs.
export function listAnimations(css: string): Animation[] {
  return [...css.matchAll(/\banimation:\s*([^;]+);/g)].flatMap(([, value = ""]) =>
    value
      .split(",")
      .map((part) => part.trim().split(/\s+/))
      .filter((words) => !words.includes("none"))
      .map((words) => {
        const name = words.find((word) => /^wf-[\w-]+$/.test(word)) ?? "";
        const seconds = Number(/^(\d*\.?\d+)s$/.exec(words.find((word) => /^\d*\.?\d+s$/.test(word)) ?? "")?.[1] ?? 0);
        const count = words.find((word) => word === "infinite" || /^\d+$/.test(word));
        return { name, seconds, iterations: count === "infinite" ? Infinity : Number(count ?? 1) };
      }),
  );
}

export function listKeyframes(css: string): string[] {
  return [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name = ""]) => name);
}

// Every value the stylesheet gives a property, such as each font-size.
export function listValues(css: string, property: string): string[] {
  return [...css.matchAll(new RegExp(String.raw`(?:^|[\s;{])${property}:\s*([^;]+);`, "g"))].map(([, value = ""]) =>
    value.trim(),
  );
}
