---
name: designer
description: Enforce the house minimalist, high-contrast UI design system — one token layer, two themes (dark default, light companion) — built on Tailwind CSS tokens. Load BEFORE writing or editing any UI — components, pages, layouts, styles, Tailwind config, or design tokens — and before choosing any color, spacing, radius, shadow, or type size. Triggers on "build a UI", "make a page/screen/component", "style this", "design system", "theme", "dark mode", "light mode", "Tailwind", "restyle", "make it look better".
---

# Designer — minimalist, high-contrast, dual-theme

This system has one job: make interfaces that are **calm to look at and impossible to misread**.
Every rule below is a constraint, not a suggestion. When a request conflicts with a rule,
follow the rule and say so in one sentence.

## 0. The three laws

1. **One palette, two modes, one set of token names.** Dark is the default; light is its
   companion, not a second design. A theme switch changes **only token values** — never a
   rule, never a component, never a layout. If you find yourself writing a second version of
   a component for the other theme, the token layer is wrong; fix the tokens instead.
2. **Contrast is a hard floor, not a goal.** Body text >= 4.5:1, large text (>=18.66px bold
   or >=24px) and non-text UI (borders that carry meaning, icons, focus rings) >= 3:1 —
   **in both themes**. A pair that clears the floor on dark can fail on light. Never ship a
   pair that is not in the tables in section 2.
3. **Minimalist means subtractive.** Depth comes from *surface elevation and spacing*,
   never from decoration. If a border, shadow, gradient, or icon can be removed without
   losing meaning, remove it.

## 1. Token layer

Tokens are the only way color enters a file. **Never** write a raw hex, `rgb()`, or a stock
Tailwind palette class (`bg-gray-900`, `text-slate-400`, `border-zinc-800`, ...) in markup.
This is what makes two themes cost one implementation.

### Tailwind v4 — `app.css`

```css
@import "tailwindcss";

@theme {
  /* ---------- DARK (default) ---------- */
  /* surfaces: the only four backgrounds that exist */
  --color-base:        #0A0A0B;  /* page. nothing sits behind it */
  --color-surface:     #131316;  /* cards, panels, table rows */
  --color-elevated:    #1B1B1F;  /* popovers, dropdowns, modals, hover */
  --color-sunken:      #060607;  /* wells, code blocks, inset tracks */

  --color-line:        #26262C;  /* default hairline, decorative */
  --color-line-strong: #35353D;  /* interactive borders, inputs */

  --color-fg:          #F5F5F7;  /* primary — headings, body */
  --color-fg-muted:    #A1A1AA;  /* secondary — labels, captions */
  --color-fg-subtle:   #8A8A93;  /* tertiary — metadata, timestamps */
  --color-fg-disabled: #71717A;  /* disabled ONLY. never body copy */

  --color-accent:      #7C9CFF;  /* exactly one accent */
  --color-accent-fg:   #0A0A0B;  /* text ON a filled accent surface */
  --color-accent-weak: #1A2240;  /* accent-tinted fill for subtle states */

  --color-success:     #34D399;  /* semantic: state only, never branding */
  --color-warning:     #FBBF24;
  --color-danger:      #F87171;
  --color-danger-weak: #2A1416;

  /* ---------- shape and type (theme-independent) ---------- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* ---------- LIGHT ----------
   `@theme` emits its values as custom properties on :root, and every generated
   utility resolves them through var(). So the light theme is just an override
   of those same properties — no second utility set, no `dark:` variants.

   Written TWICE on purpose: once for the system preference when the user has
   made no choice, once for an explicit choice so a toggle wins in both
   directions. Plain duplication — there is no CSS mechanism to share a
   declaration block across a media query and a bare selector, and duplicating
   ~18 lines is far cheaper than a second component library. Keep the two
   blocks adjacent so they are edited together. */

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --color-base:        #F3F4F6;
    --color-surface:     #FAFAFB;
    --color-elevated:    #FDFDFE;
    --color-sunken:      #EDEEF1;
    --color-line:        #DFE2E8;
    --color-line-strong: #C6CBD4;
    --color-fg:          #16181D;
    --color-fg-muted:    #4E5666;
    --color-fg-subtle:   #646C7D;
    --color-fg-disabled: #949BA8;
    --color-accent:      #2C5BD8;
    --color-accent-fg:   #FAFAFB;
    --color-accent-weak: #E7EDFD;
    --color-success:     #17693C;
    --color-warning:     #8A5A00;
    --color-danger:      #B03024;
    --color-danger-weak: #FBE7E5;
    color-scheme: light;
  }
}

:root[data-theme="light"] {
  --color-base:        #F3F4F6;
  --color-surface:     #FAFAFB;
  --color-elevated:    #FDFDFE;
  --color-sunken:      #EDEEF1;
  --color-line:        #DFE2E8;
  --color-line-strong: #C6CBD4;
  --color-fg:          #16181D;
  --color-fg-muted:    #4E5666;
  --color-fg-subtle:   #646C7D;
  --color-fg-disabled: #949BA8;
  --color-accent:      #2C5BD8;
  --color-accent-fg:   #FAFAFB;
  --color-accent-weak: #E7EDFD;
  --color-success:     #17693C;
  --color-warning:     #8A5A00;
  --color-danger:      #B03024;
  --color-danger-weak: #FBE7E5;
  color-scheme: light;
}
```

> Use plain `@theme`, not `@theme inline`. With `inline`, utilities are compiled to literal
> values instead of `var()` references, and overriding the custom property later has no
> effect — the light theme silently does nothing.

### Tailwind v3 — `tailwind.config.js`

v3 cannot swap palettes by name, so map every color to a CSS variable and define the
variables per theme in your stylesheet:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)', surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)', sunken: 'var(--color-sunken)',
        line: { DEFAULT: 'var(--color-line)', strong: 'var(--color-line-strong)' },
        fg: {
          DEFAULT: 'var(--color-fg)', muted: 'var(--color-fg-muted)',
          subtle: 'var(--color-fg-subtle)', disabled: 'var(--color-fg-disabled)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)', fg: 'var(--color-accent-fg)',
          weak: 'var(--color-accent-weak)',
        },
        success: 'var(--color-success)', warning: 'var(--color-warning)',
        danger: { DEFAULT: 'var(--color-danger)', weak: 'var(--color-danger-weak)' },
      },
      borderRadius: { sm: '6px', md: '10px', lg: '16px' },
    },
  },
};
```

### Wiring the theme

- `<html>` carries **`data-theme="light" | "dark"` only when the user has chosen**. No
  attribute means "follow the system" — do not stamp a default on first paint.
- Declare `<meta name="color-scheme" content="dark light">` so form controls, scrollbars
  and the canvas behind your page match.
- `body` must set an explicit `bg-base text-fg`. A transparent body borrows the host's
  background and breaks in the other theme.
- Set `color-scheme` inside each theme block, not once globally.
- Reading the system preference in JS: **guard `matchMedia`.** It is absent in jsdom and in
  old engines, and an unguarded call throws before your toggle ever runs.
  ```js
  const prefersLight =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  ```
- Persist the choice in `localStorage` inside `try/catch` — `file://` origins and locked-down
  browsers throw on access, and losing the preference must never break the page.

## 2. Contrast — the checked pairs

Re-verify with a contrast checker whenever a token value changes. Ratios come from the WCAG
relative-luminance formula.

### Dark — measured against `--color-base` `#0A0A0B`

| Foreground | Hex | Ratio | Verdict |
| --- | --- | --- | --- |
| `fg` | `#F5F5F7` | ~18.2:1 | OK — any size |
| `fg-muted` | `#A1A1AA` | ~7.7:1 | OK — any size |
| `fg-subtle` | `#8A8A93` | ~5.8:1 | OK for body — keep >=14px |
| `fg-disabled` | `#71717A` | ~4.1:1 | **FAILS AA.** Disabled controls only. |
| `accent` | `#7C9CFF` | ~7.6:1 | OK — any size, and OK as a 3:1 UI border |
| `success` | `#34D399` | ~10.5:1 | OK |
| `warning` | `#FBBF24` | ~11.6:1 | OK |
| `danger` | `#F87171` | ~7.6:1 | OK |
| `line` | `#26262C` | ~1.4:1 | decorative hairlines only |
| `line-strong` | `#35353D` | ~1.9:1 | below 3:1 — never the sole signal |

### Light — measured against `--color-base` `#F3F4F6`

| Foreground | Hex | Ratio | Verdict |
| --- | --- | --- | --- |
| `fg` | `#16181D` | ~16.1:1 | OK — any size |
| `fg-muted` | `#4E5666` | ~6.7:1 | OK — any size |
| `fg-subtle` | `#646C7D` | ~4.8:1 | OK for body, but it is the thinnest margin in the system — do not darken the background behind it |
| `fg-disabled` | `#949BA8` | ~2.5:1 | **FAILS AA.** Disabled controls only. |
| `accent` | `#2C5BD8` | ~5.3:1 | OK — any size |
| `success` | `#17693C` | ~6.1:1 | OK |
| `warning` | `#8A5A00` | ~5.4:1 | OK |
| `danger` | `#B03024` | ~5.8:1 | OK |
| `line` | `#DFE2E8` | ~1.2:1 | decorative hairlines only |
| `line-strong` | `#C6CBD4` | ~1.5:1 | below 3:1 — never the sole signal |

**Rules that follow from the tables**

- `fg-disabled` fails AA in **both** themes. That is deliberate — it marks unavailable
  controls. It is never body text, never a caption, never a placeholder you expect read.
- On dark, semantic colors are *light* foregrounds on dark tinted fills. On light they are
  *dark* foregrounds on pale tinted fills. Never dark-on-saturated in either theme.
  Error state = `text-danger` + `border-danger` + `bg-danger-weak`, both themes.
- A border alone never carries meaning (error, selected, active) — `line-strong` clears 3:1
  in neither theme. Pair it with text or an icon.
- **Hover and active states must be derived, not hardcoded.** A literal lighter hex lightens
  correctly on dark and washes out on light. Mix toward the foreground token so the same
  declaration darkens on light and lightens on dark:
  ```css
  .btn-primary:hover { background: color-mix(in srgb, var(--color-accent) 82%, var(--color-fg)); }
  ```

## 3. Space, size, shape

- **Spacing scale:** `2 / 3 / 4 / 6 / 8 / 12 / 16 / 24` (Tailwind units). Nothing else.
  No `p-5`, no `gap-7`, no arbitrary `mt-[13px]`.
- **Radius:** `rounded-sm` inputs/badges, `rounded-md` buttons/cards, `rounded-lg` modals/sheets.
  Never `rounded-full` except avatars and dot indicators.
- **Type scale:** `text-xs` 12 (metadata), `text-sm` 14 (UI default), `text-base` 16 (body),
  `text-lg` 18, `text-xl` 20, `text-2xl` 24, `text-4xl` 36 (page title). Nothing between.
- **Weight:** `font-normal` body, `font-medium` UI labels and buttons, `font-semibold` headings.
  `font-bold` is not in the system.
- **Line height:** `leading-relaxed` for prose, `leading-none` for numerals and single-line UI.
- **Measure:** prose caps at `max-w-[68ch]`. Page shells cap at `max-w-6xl mx-auto px-6`.
- **Tracking:** `tracking-tight` on `text-2xl` and up. `tracking-wide uppercase text-xs` for
  overline labels — this is the *only* sanctioned uppercase.

## 4. Elevation

Depth is surface color. **Shadows are banned** except on genuinely floating layers
(popover, dropdown, modal, toast), where exactly one value per theme is allowed:

```
dark:  0 16px 48px -12px rgba(0, 0, 0, 0.7)
light: 0 16px 48px -12px rgba(22, 24, 29, 0.18)
```

Ship it as a `--shadow-float` token so the component never names a theme. A card does not
float. A card is `bg-surface` with `border border-line`. That is the whole recipe.

## 5. Density — text people actually scan

High contrast is wasted on a wall of prose. Anything a user reads to make a decision:

- **Lead with the value, not the sentence.** A metric is an overline label + a large value +
  a caveat underneath, in that order.
- **Two or more sentences becomes a list.** Split on sentence boundaries; a clause after an
  em-dash is usually its own point. Never a one-item list — a single sentence stays a
  paragraph.
- **Splitting is presentation, never editing.** Rejoining the parts must reproduce the source
  string exactly. In a codebase with real content, assert that in a test — it is the only
  thing standing between "easier to scan" and "quietly reworded".
- **Long rules and policies are lead + conditions**, not one sentence with `AND`/`BUT` buried
  mid-line.
- Collapse supporting detail behind `<details>`; keep the first sentence always visible.

## 6. Component recipes

Copy these. Do not invent variants. They carry no theme information — the tokens do.

```html
<!-- Button: primary -->
<button class="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm
               font-medium text-accent-fg transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
               focus-visible:ring-offset-2 focus-visible:ring-offset-base
               disabled:bg-elevated disabled:text-fg-disabled">

<!-- Button: secondary -->
<button class="... rounded-md border border-line-strong bg-surface px-4 text-sm font-medium
               text-fg hover:bg-elevated ...">

<!-- Button: ghost -->
<button class="... rounded-md px-4 text-sm font-medium text-fg-muted hover:bg-elevated
               hover:text-fg ...">

<!-- Button: destructive -->
<button class="... rounded-md border border-danger bg-danger-weak px-4 text-sm font-medium
               text-danger ...">

<!-- Card -->
<div class="rounded-md border border-line bg-surface p-6">

<!-- Input -->
<input class="h-9 w-full rounded-sm border border-line-strong bg-sunken px-3 text-sm
              text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none
              focus:ring-1 focus:ring-accent aria-[invalid=true]:border-danger">

<!-- Badge -->
<span class="inline-flex items-center rounded-sm border border-line-strong bg-elevated
             px-2 py-0.5 text-xs font-medium text-fg-muted">

<!-- Overline label -->
<span class="text-xs font-medium uppercase tracking-wide text-fg-subtle">

<!-- Table row -->
<tr class="border-b border-line last:border-0 hover:bg-elevated">
```

**Focus is never removed.** Every interactive element carries
`focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base`.
`outline-none` without a paired `focus-visible:` ring is a defect.

## 7. Motion

- Durations: `duration-150` (state change), `duration-200` (enter/exit). Nothing slower.
- Animate `opacity`, `transform`, `background-color`, `border-color`. Never `width`,
  `height`, `top`, `left`.
- Every animation sits inside `motion-safe:`; honour `prefers-reduced-motion`.
- No parallax, no scroll-jacking, no looping ambient animation.

## 8. Forbidden

Do not use, and remove on sight:

- Raw hex, `rgb()`, or stock Tailwind palette classes in markup
- `dark:` variants on components — theming happens in the token layer, nowhere else
- A color whose only definition lives inside a media query or a `[data-theme]` block
- Hardcoded hover/active colors that only work in one theme
- Gradients as surfaces (a gradient may only exist inside an illustration or chart)
- Glassmorphism, `backdrop-blur` on content surfaces, neon glow, `text-shadow`
- Shadows on non-floating elements; more than one shadow token
- More than one accent hue; semantic colors used decoratively
- Emoji as UI iconography (use an icon set); decorative icons without `aria-hidden="true"`
- Pure black `#000` and pure white `#FFF` anywhere, in either theme
- Centered body copy, justified text, font sizes below 12px
- `!important`, except a `prefers-reduced-motion` override

## 9. Pre-ship checklist

Run before declaring any UI done:

- [ ] Zero raw colors — this returns nothing outside the token file:
      `grep -rnE '#[0-9a-fA-F]{3,8}|rgb\(|(bg|text|border)-(gray|slate|zinc|neutral|stone)-' src/`
- [ ] Every text/background pair appears in section 2, **for both themes**
- [ ] `fg-disabled` appears only on `disabled:` variants
- [ ] No `dark:` prefix and no per-component theme override anywhere
- [ ] Every token used has a value defined outside any media/`[data-theme]` block
- [ ] Every interactive element has a visible `focus-visible` ring
- [ ] Spacing values are all on the section 3 scale
- [ ] At most three radius values, one shadow token
- [ ] Meaning is never carried by color alone — an icon or text accompanies every state
- [ ] Prose that drives a decision is scannable per section 5; any split is lossless
- [ ] **Screenshot both themes and look at them.** Computed-style checks catch what
      screenshots miss (a rule that silently never landed); screenshots catch what computed
      styles miss (a layout that collapsed). Run both.
- [ ] Keyboard-only pass: tab through, nothing invisible, nothing trapped
- [ ] Zoom to 200% — no clipping, no horizontal scroll
