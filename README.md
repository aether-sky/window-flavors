# Window flavors

A retro RPG menu look in plain CSS: double-framed windows in five flavors (plain, mint, strawberry, banana and peanut),
a menu pointer, buttons, menu choices, chips, rolling counters, meters and a moving backdrop. It's plain CSS so the
same files work in a Vue app, a static page or an Astro site.

Open `demo/index.html` in a browser to see every piece in every flavor.

## Using it

Install it from GitHub at a tag:

```powershell
pnpm add github:aether-sky/window-flavors#v1.0.0
```

Then load `window-flavors/window-flavors.css`, or `tokens.css` and `components.css` on their own. With a bundler such
as Vite, `import "window-flavors";`. A static page can link the file from `node_modules` or copy it at build time.

Everything only applies inside an element with the `wf` class, so the style can sit in one part of a page without
touching the rest. `data-flavor` on that element picks the flavor; without it, the flavor is plain. Every class and
custom property starts with `wf-`.

```html
<div class="wf" data-flavor="mint">
  <section class="wf-window">
    <div class="wf-window-inner">
      <h2 class="wf-label">Goods</h2>
      <button type="button" class="wf-choice wf-pointer" aria-current="true">Wooden bat</button>
      <button type="button" class="wf-button wf-pointer">Use</button>
    </div>
  </section>
</div>
```

### Fonts

The style names two fonts and doesn't load them: DotGothic16 for the pixel text and Atkinson Hyperlegible for body
text. Both are under the SIL Open Font License, so a page can load them from Google Fonts or host the files itself.
Without them, the style falls back to Courier New and the system font.

## The pieces

| Class                                                           | What it is                                                                                   |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `wf`                                                            | Sets the colors and body text for everything inside                                          |
| `wf-window`, `wf-window-inner`, `wf-window-warn`                | A window: outer frame, gap, inner frame; warn draws the frames in warn color                 |
| `wf-well`                                                       | A sunken panel inside a window                                                               |
| `wf-pointer`                                                    | The â–¶ beside a control on hover, focus, `aria-current`, `aria-pressed` and `aria-expanded` |
| `wf-button`, `wf-button-primary`                                | A menu button; primary and `aria-pressed="true"` are filled                                  |
| `wf-choice`                                                     | A menu choice, dotted until `aria-current` or `aria-expanded` is true                        |
| `wf-chip`, `wf-chip-accent`, `wf-chip-warn`                     | A small tag                                                                                  |
| `wf-input`                                                      | An input, select or textarea                                                                 |
| `wf-drums`, `wf-drum`                                           | A rolling counter, one drum per digit                                                        |
| `wf-bar`                                                        | A meter; the width of its `span` is the amount                                               |
| `wf-label`, `wf-pixel`, `wf-accent`, `wf-muted`, `wf-pixelated` | Text and image helpers                                                                       |
| `wf-skip-link`                                                  | A skip link that shows on focus                                                              |
| `wf-backdrop` and its parts                                     | The moving background; see below                                                             |

The backdrop fills its nearest positioned ancestor and sits behind it, so that ancestor needs `position: relative` and
`isolation: isolate`. Its parts, in order, are `wf-backdrop-bands`, `wf-backdrop-sway` holding `wf-backdrop-waves-a`
and `wf-backdrop-waves-b`, and `wf-backdrop-dots`; the moving ones also have `wf-moving`. Adding `wf-paused` to
`wf-backdrop` pauses it, and it stays still when the system asks for reduced motion. Give the page a pause button for
it, as WCAG asks of anything that moves for more than five seconds.

## Accessibility

Every text color measures 7:1 or more against the fills it is drawn on, in every flavor, which `pnpm test` checks.
Focus shows as a 3px outline, the pointer never stands in for it, and controls are at least 44px tall. In forced-colors
mode the backdrop is hidden and the pointer, meters, counters and the current choice keep a visible shape.

## Checks

```powershell
pnpm install
pnpm check   # typecheck, format check, then the tests
```

JUnit and Cobertura reports go to `.test-reports/`.
