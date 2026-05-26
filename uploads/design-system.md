# Design System — Field Ops Platform

> A working spec for Claude (or any designer/dev) to produce visually consistent, distinctive UI across modules. This is opinionated by design. Generic produces generic.

---

## 1. Design philosophy

**Aesthetic direction: Industrial Utilitarian.**

This product serves people who work with asphalt, concrete, machinery, and weather. It should look and feel like a tool built for that world — confident, dense with information, high-contrast, unfussy. Not another rounded-corner Material-UI SaaS dashboard. Not a "fun" consumer app.

Visual references:
- **Linear** — typography discipline, restraint, command-bar pattern
- **Cron / Notion Calendar** — dense calendar information design
- **Stripe Dashboard** — financial-grade table density done right
- **Vercel** — Geist typography, monochrome confidence, motion restraint
- **Procore / Fieldwire** — construction context (study, don't copy — they're mediocre visually)
- **Mil-spec / aviation HUDs** — the inspiration for information density without panic

What this product is NOT:
- Not friendly. It's a tool, not a companion.
- Not playful. The users are managing million-dollar projects and 200-person crews.
- Not minimalist for minimalism's sake. Density is correct here; restraint applies to *visual noise*, not to information.

---

## 2. Color system

All values in OKLCH for perceptual consistency, with hex fallbacks.

### Base palette — "Asphalt & Concrete"

```css
:root {
  /* Surface — warm off-whites and stones */
  --surface-0:    oklch(0.99 0.003 80);  /* #FCFBF8 — page bg */
  --surface-1:    oklch(0.97 0.005 80);  /* #F5F3EE — card bg */
  --surface-2:    oklch(0.94 0.006 80);  /* #EEEAE2 — hover */
  --surface-3:    oklch(0.90 0.008 80);  /* #E2DDD2 — borders soft */

  /* Ink — warm blacks and grays */
  --ink-0:        oklch(0.15 0.005 60);  /* #1C1A17 — primary text */
  --ink-1:        oklch(0.35 0.007 60);  /* #4F4A42 — secondary text */
  --ink-2:        oklch(0.55 0.008 60);  /* #847D71 — tertiary text */
  --ink-3:        oklch(0.75 0.008 60);  /* #B8B1A4 — disabled */
  --ink-border:   oklch(0.85 0.007 60);  /* #D4CEC1 — table borders */

  /* Asphalt — the deep blacks for emphasis */
  --asphalt:      oklch(0.18 0.008 50);  /* #221F1B */
  --asphalt-deep: oklch(0.10 0.006 50);  /* #15120F */
}
```

### Accent palette — "Safety & Signal"

The product has one and only one primary accent: **Safety Orange**. Everything that demands attention uses it. Everything that doesn't, doesn't.

```css
:root {
  /* Primary accent — Safety Orange (hi-vis) */
  --signal:       oklch(0.72 0.18 55);   /* #F08A2C — primary actions */
  --signal-hover: oklch(0.65 0.19 55);   /* #D9741D */
  --signal-soft:  oklch(0.95 0.04 60);   /* #FAEDD9 — bg fills */

  /* Status — restrained, semantic */
  --status-ok:       oklch(0.65 0.15 145);  /* #3F9B4F — confirmed/active */
  --status-ok-soft:  oklch(0.95 0.04 145);  /* #DEF0DD */
  --status-warn:     oklch(0.78 0.14 90);   /* #D4B83A — pending/scheduled */
  --status-warn-soft:oklch(0.96 0.04 90);   /* #F5F0D8 */
  --status-stop:     oklch(0.58 0.20 25);   /* #C84536 — blocked/error/cancel */
  --status-stop-soft:oklch(0.95 0.03 25);   /* #F8E5E0 */
  --status-info:     oklch(0.55 0.12 240);  /* #4B7CC4 — neutral info only */
  --status-info-soft:oklch(0.95 0.03 240);  /* #DFE7F3 */
}
```

### Dark mode (default for foreman mobile in trucks)

```css
[data-theme="dark"] {
  --surface-0:    oklch(0.13 0.006 50);   /* near-asphalt */
  --surface-1:    oklch(0.17 0.007 50);
  --surface-2:    oklch(0.22 0.008 50);
  --surface-3:    oklch(0.28 0.009 50);
  --ink-0:        oklch(0.96 0.005 60);
  --ink-1:        oklch(0.80 0.006 60);
  --ink-2:        oklch(0.62 0.007 60);
  /* Signal stays the same — hi-vis works in both */
}
```

**Rules:**
- Never use generic SaaS blue as a primary action color
- Never use purple, ever
- Never use more than two accent colors in a single screen
- Status colors are reserved for status — don't use `--status-ok` for "save" buttons

---

## 3. Typography

### Font stack — Geist + Instrument Serif

We commit to three typefaces, no more.

```css
:root {
  /* Body & UI — Geist (free, distinctive, industrial-precise) */
  --font-sans: 'Geist', 'Geist Fallback', system-ui, sans-serif;

  /* Numeric & code — Geist Mono (matches Geist, tabular figures) */
  --font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;

  /* Display accent — Instrument Serif (editorial weight for big numbers) */
  --font-display: 'Instrument Serif', 'Georgia', serif;
}
```

**Why these:** Geist has industrial-technical character without being cold. Instrument Serif used sparingly on dashboard hero numbers gives the product an editorial quality — makes important data feel important. All three are free via Google Fonts / Vercel.

**Banned fonts:** Inter, Roboto, Open Sans, Arial, system-ui as a primary, Space Grotesk, Poppins. These appear in every generic AI-designed SaaS app.

### Type scale (4px grid-aligned)

```css
:root {
  --text-xs:   11px;   line-height: 16px;  letter-spacing: 0.02em;  /* metadata, table headers */
  --text-sm:   13px;   line-height: 20px;  letter-spacing: 0.005em; /* body in dense contexts */
  --text-base: 15px;   line-height: 24px;  letter-spacing: 0;       /* default body */
  --text-md:   17px;   line-height: 28px;  letter-spacing: -0.005em;/* card titles */
  --text-lg:   20px;   line-height: 28px;  letter-spacing: -0.01em; /* page section heads */
  --text-xl:   28px;   line-height: 36px;  letter-spacing: -0.015em;/* page titles */
  --text-2xl:  40px;   line-height: 44px;  letter-spacing: -0.02em; /* dashboard heroes */
  --text-3xl:  64px;   line-height: 64px;  letter-spacing: -0.025em;/* hero numbers (Instrument Serif) */
}
```

**Important:** lift the default size from the current product's ~13px to **15px base**. Field users squinting at phones in trucks need it.

### Type usage rules

- **Hero numbers** (e.g., "5,524 jobs", "141 of 141 visible") → `--font-display`, `--text-3xl`, weight 400
- **All numbers in tables, timestamps, IDs, coordinates, equipment numbers** → `--font-mono`, tabular-nums
- **Status pill text** → `--font-mono`, `--text-xs`, uppercase, letter-spacing 0.05em
- **Body & forms** → `--font-sans`, `--text-base`
- **Never bold-on-bold.** If something is already a heading, don't make individual words bold inside it.

---

## 4. Spacing & layout

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-8:  48px;
  --space-10: 64px;
  --space-12: 96px;
}
```

**Density:** This product is information-dense. Use `--space-3` and `--space-4` for most internal padding. Reserve `--space-6+` for section separation. Don't airy-uppercut everything with `--space-8` like a marketing site.

**Breakpoints (mobile-first):**
- `sm: 380px` (phone — primary)
- `md: 768px` (tablet — foremen with iPads)
- `lg: 1024px` (laptop)
- `xl: 1440px` (desktop — dispatchers)
- `2xl: 1920px` (operations center)

Design every screen at `sm` first, then `xl`. Don't design at desktop and squeeze down.

---

## 5. Component specifications

### Status pills

The current product has 8+ pill variations. We have **one** pill component with **four** semantic variants.

```jsx
<StatusPill variant="ok|warn|stop|info" size="sm|md">label</StatusPill>
```

Specs:
- Height: 22px (sm), 28px (md)
- Padding: 0 10px (sm), 0 12px (md)
- Border-radius: 4px — NOT fully rounded. Square-ish industrial.
- Font: `--font-mono`, `--text-xs`, uppercase, letter-spacing 0.05em
- Background: `--status-{variant}-soft`
- Text: `--status-{variant}`
- Border: 1px solid `--status-{variant}` at 40% opacity

### Worker chips (kanban draggable items)

The current chips have an unexplained yellow/grey distinction. We replace with three explicit states:

```jsx
<WorkerChip state="available|assigned|unavailable" />
```

- **Available** (default) — surface-1 bg, ink-0 text, dashed border for "draggable"
- **Assigned** — signal-soft bg, signal text, solid border (visually attached)
- **Unavailable** (PTO, sick) — surface-2 bg, ink-2 text, strikethrough name

Each chip shows: avatar initial (mono font, 1 char), full name, role abbreviation as a tiny mono caption underneath.

### Buttons

Three variants only:

```jsx
<Button variant="primary|secondary|ghost" size="sm|md|lg" />
```

- **Primary** — `--asphalt` bg, `--surface-0` text. Only ONE per screen. Industrial weight.
- **Secondary** — `--surface-0` bg, `--asphalt` text, 1px `--ink-border` border
- **Ghost** — transparent bg, `--ink-1` text, hover to `--surface-2`

The "Notify Workers" / "Add Job" stack in the current UI? One primary, rest secondary.

Border-radius: 4px. Not pill-shaped. Not 8px+. Industrial.

### Cards & tables

- Cards: `--surface-1` bg, `--ink-border` 1px border, 4px radius, `--space-4` interior padding
- Tables: alternating row backgrounds disabled by default. Use `--ink-border` 1px row dividers only. Sticky header with `--surface-2` bg. Row hover: `--surface-2`.
- Virtualize everything over 50 rows (TanStack Table + react-virtual).

### Empty states

Current product has bare empty states ("No jobs scheduled for this date"). Replace pattern:

```
[Subtle icon — line weight, --ink-2 color]
[Headline — --text-md, --ink-0]
[One sentence subtext — --text-sm, --ink-1]
[Primary action button, if applicable]
```

Empty kanban columns should collapse to a 32px-tall header bar, not consume 200px of viewport.

### Forms / inputs

- Height: 44px (mobile-friendly tap target)
- Border: 1px `--ink-border`, focus to 2px `--signal`
- Border-radius: 4px
- Label above input, `--text-xs` uppercase mono
- Error state: `--status-stop` border + `--status-stop-soft` background tint

---

## 6. Motion

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);     /* fast settle */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* symmetric */
  --duration-fast:   120ms;
  --duration-normal: 200ms;
  --duration-slow:   320ms;
}
```

**Rules:**
- Hover/focus state changes: `--duration-fast`
- Drawer/modal entry: `--duration-normal` with `--ease-out`
- Toast notifications: `--duration-slow` slide-up entry, `--duration-normal` exit
- Drag-and-drop: instant pickup, `--duration-fast` snap on drop
- Loading: never spinners-into-the-void. Use skeleton screens matching the actual content shape.

**One signature interaction:** when a job is assigned to a crew, the worker chips that just got assigned do a subtle 200ms "lock-in" animation — they shift toward the assigned card with a slight scale-up (1.02 → 1.0) and the assigned card glows briefly with `--signal-soft`. This makes the assignment *feel* committed.

---

## 7. Layout patterns

### Header

`56px` tall. Three zones:
- **Left**: hamburger (mobile) / logo (desktop). That's it.
- **Center**: page title only. No customer logo, no search-bar-with-logo-inside.
- **Right**: avatar + a single contextual action (notifications bell with badge).

Search becomes a `cmd+K` command palette overlay, not a permanent header element. Massive screen-real-estate win.

### Sidebar (desktop)

`240px` expanded, `56px` collapsed. Push content; don't overlay. State persisted to localStorage. Group sections (Schedule / Field / CRM) with `--text-xs` uppercase mono group labels.

### Mobile primary navigation

Bottom tab bar with 4 destinations: **Today** (foreman home), **Schedule**, **Forms**, **More**. Bottom bar is 64px tall with `--space-3` safe-area padding.

### "My Day" foreman home screen (new pattern, mobile)

Top card: today's job (one big primary card with job name, location, crew, equipment). Below: today's forms to fill (vertical stack, swipe-to-complete). Below: notifications/messages.

---

## 8. The Big Numbers pattern

This is the signature visual move. Anywhere we display an important count or metric, use Instrument Serif at large size:

```jsx
<HeroMetric value={5524} label="active jobs" />
```

Renders as:
```
5,524               ← Instrument Serif, --text-3xl, --ink-0
ACTIVE JOBS         ← Geist Mono, --text-xs, uppercase, --ink-2
```

This single pattern, used on dashboards, in headers, and on summary cards, gives the entire product an editorial-data-publication feel that distinguishes it from every other SaaS app.

---

## 9. Iconography

- Use **Lucide** icons (line weight, 1.5px stroke at 20px size)
- NEVER mix icon libraries
- NEVER use filled icons. Line only. Industrial.
- Icon + label always preferred over icon-only (except in tight navs)

---

## 10. What we explicitly reject

- ❌ Inter, Roboto, Open Sans, Arial, Space Grotesk
- ❌ Generic SaaS blue (#3B82F6 and friends) as the primary action color
- ❌ Purple gradients
- ❌ Drop shadows beyond `0 1px 2px rgba(0,0,0,0.06)`
- ❌ Border-radius greater than 8px on any element
- ❌ Fully rounded pills for status indicators
- ❌ Emoji as UI iconography
- ❌ Glass-morphism, neumorphism, any "morphism"
- ❌ Particle effects, animated gradients, mesh gradients on UI surfaces
- ❌ More than 2 font weights in use on one screen
- ❌ Multiple competing primary actions
- ❌ Modals that block more than they reveal
- ❌ Lottie animations for loading states
- ❌ Toast notifications that auto-dismiss critical info

---

## 11. Voice & microcopy

- **Imperative, not polite.** "Notify workers" not "Would you like to notify workers?"
- **Specific, not generic.** "5 trucks dispatched" not "Action completed."
- **Plain, not corporate.** "Job moved to Aaron's Crew" not "Resource reassignment successful."
- **Numbers in mono.** Always. Even in body copy when referring to counts.

---

## 12. Accessibility (non-negotiable)

- Contrast ratios: 4.5:1 for body text, 3:1 for large text and UI
- Focus rings: 2px `--signal`, 2px offset
- Keyboard navigation: every action reachable, with visible focus
- Screen reader: status changes announced via `aria-live` regions
- Tap targets: 44×44px minimum on mobile
- Reduced motion: `@media (prefers-reduced-motion)` disables non-essential animation
- Sunlight contrast: critical actions tested in `--signal` against `--surface-0` outdoors

---

## 13. How to use this document with Claude

When prompting Claude for any module:

1. **Attach this file** to the conversation as `design-system.md`
2. **Reference specific tokens** in your prompt ("use `--signal` for the primary action, `--font-display` at `--text-3xl` for the count")
3. **Quote the negative space** ("per design-system.md section 10, do not use border-radius > 8px")
4. **Reinforce the aesthetic** ("industrial utilitarian, per design-system.md section 1")

Without this file, Claude will produce generic. With it — and with you quoting specific sections in your prompts — Claude will produce something that looks intentional, distinctive, and like it was actually designed.

---

## 14. Quick-reference tokens (copy into your Tailwind config)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'oklch(0.99 0.003 80)',
          1: 'oklch(0.97 0.005 80)',
          2: 'oklch(0.94 0.006 80)',
          3: 'oklch(0.90 0.008 80)',
        },
        ink: {
          0: 'oklch(0.15 0.005 60)',
          1: 'oklch(0.35 0.007 60)',
          2: 'oklch(0.55 0.008 60)',
          3: 'oklch(0.75 0.008 60)',
          border: 'oklch(0.85 0.007 60)',
        },
        asphalt: {
          DEFAULT: 'oklch(0.18 0.008 50)',
          deep: 'oklch(0.10 0.006 50)',
        },
        signal: {
          DEFAULT: 'oklch(0.72 0.18 55)',
          hover: 'oklch(0.65 0.19 55)',
          soft: 'oklch(0.95 0.04 60)',
        },
        // ... status colors
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '8px',
        // no xl+
      },
    },
  },
}
```
