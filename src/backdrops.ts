// Reads the backdrop names out of backdrops.css.

export function listBackdrops(css: string): string[] {
  return [...new Set([...css.matchAll(/\[data-backdrop="([\w-]+)"\]/g)].map(([, name = ""]) => name))];
}
