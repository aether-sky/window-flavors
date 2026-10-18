# Window flavors

A retro RPG menu look in plain CSS: double-framed windows in five flavors (plain, mint, strawberry, banana and peanut),
a menu pointer, buttons, menu choices, chips, rolling counters, meters and ten moving backdrops. It's plain CSS so the
same files work in a Vue app, a static page or an Astro site.

Open `demo/index.html` in a browser to see every piece in every flavor, with a menu to switch backdrops, and
`demo/backdrops.html` to see all ten backdrops moving side by side.

## Using it

Install it from GitHub at a tag:

```powershell
pnpm add github:aether-sky/window-flavors#v1.0.0
```

Then load `window-flavors/window-flavors.css`, or `tokens.css`, `components.css` and `backdrops.css` on their own. With a bundler such
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

| Class                                                           | What it is                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `wf`                                                            | Sets the colors and body text for everything inside                                        |
| `wf-window`, `wf-window-inner`, `wf-window-warn`                | A window: outer frame, gap, inner frame; warn draws the frames in warn color               |
| `wf-well`                                                       | A sunken panel inside a window                                                             |
| `wf-pointer`                                                    | The ▶ beside a control on hover, focus, `aria-current`, `aria-pressed` and `aria-expanded` |
| `wf-button`, `wf-button-primary`                                | A menu button; primary and `aria-pressed="true"` are filled                                |
| `wf-choice`                                                     | A menu choice, dotted until `aria-current` or `aria-expanded` is true                      |
| `wf-chip`, `wf-chip-accent`, `wf-chip-warn`                     | A small tag                                                                                |
| `wf-input`                                                      | An input, select or textarea                                                               |
| `wf-drums`, `wf-drum`, `wf-drum-strip`                          | A rolling counter; see below                                                               |
| `wf-bar`                                                        | A meter; the width of its `span` is the amount                                             |
| `wf-label`, `wf-pixel`, `wf-accent`, `wf-muted`, `wf-pixelated` | Text and image helpers                                                                     |
| `wf-skip-link`                                                  | A skip link that shows on focus                                                            |
| `wf-backdrop` and its parts                                     | The moving background; see below                                                           |

A counter's drums roll to a new number when it changes. Each digit's drum holds a strip of the ten digits, and
`--wf-digit` says which one shows; any other character, such as a `k`, sits in its drum as plain text:

```html
<span class="wf-drums" aria-hidden="true">
  <span class="wf-drum"><span class="wf-drum-strip" style="--wf-digit: 4">0123456789</span></span>
  <span class="wf-drum">k</span>
</span>
<span class="sr-only">4k</span>
```

## Sizes

The tokens keep the scale small, and pages using the style can use them too:

- Pixel text: `--wf-pixel-1` to `--wf-pixel-3` (16, 32 and 48px). DotGothic16 is drawn on a 16px dot grid, so at any
  other size its dots fall between screen pixels and blur.
- Body text: `--wf-text-small`, `--wf-text` and `--wf-text-large` (15, 17 and 20px).
- Spacing: `--wf-space-1` to `--wf-space-7` (4, 8, 12, 16, 24, 32 and 48px).
- Corners: `--wf-radius-small`, `--wf-radius` and `--wf-radius-window` (4, 10 and 16px).
- `--wf-pointer-room` is the space a control leaves on its left for the pointer, and `--wf-target` the smallest a
  control may be (44px).

## Backdrops

A backdrop fills its nearest positioned ancestor and sits behind it, so that ancestor needs `position: relative` and
`isolation: isolate`. Keep text in windows, never straight on a backdrop. `data-backdrop` on `wf-backdrop` picks one;
without it, the backdrop is sunset. Every backdrop uses the same markup:

```html
<div class="wf-backdrop" data-backdrop="stars" aria-hidden="true">
  <div class="wf-backdrop-base wf-moving"></div>
  <div class="wf-backdrop-sway wf-moving">
    <div class="wf-backdrop-layer-a wf-moving"></div>
    <div class="wf-backdrop-layer-b wf-moving"></div>
  </div>
  <div class="wf-backdrop-overlay"></div>
</div>
```

| `data-backdrop` | What moves                                                      |
| --------------- | --------------------------------------------------------------- |
| `sunset`        | Purple and orange bands rolling down under cream and mint waves |
| `checker`       | A mint checkerboard sliding diagonally over violet, wobbling    |
| `stripes`       | Pink candy stripes and thin yellow ones crossing on the slant   |
| `rings`         | Two sets of circles, mint and gold, slowly swelling out of step |
| `zigzag`        | Two rows of zigzags running opposite ways over deep green       |
| `stars`         | Two layers of stars falling at different speeds                 |
| `grid`          | A pink grid rolling toward the horizon under a setting sun      |
| `bubbles`       | Rings of foam rising through dark water                         |
| `plaid`         | Peach rows and rose columns sliding past each other             |
| `swirl`         | A slow color wheel turning while its colors cycle               |

Adding `wf-paused` to `wf-backdrop` pauses it, and it stays still when the system asks for reduced motion. Give the
page a pause button for it, as WCAG asks of anything that moves for more than five seconds. Every loop takes 8 seconds
or more, so nothing flashes.

## Accessibility

Every text color measures 7:1 or more against the fills it is drawn on, in every flavor, which `pnpm test` checks.
Focus shows as a 3px outline, the pointer never stands in for it, and controls are at least 44px tall. In forced-colors
mode the backdrop is hidden and the pointer, meters, counters and the current choice keep a visible shape.

Windows unfold when they appear, the pointer nudges a few times beside the current choice, and counters roll. All of
these stop within five seconds, and none of them happen when the system asks for reduced motion.

## Checks

```powershell
pnpm install
pnpm check   # typecheck, format check, then the tests
```

JUnit and Cobertura reports go to `.test-reports/`.
