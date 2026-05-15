# Admin Panel Brand Guidelines

This document captures the visual identity and tokens for the Admin Dashboard (light + dark). Additions below include colors, typography, spacing, components usage, accessibility notes, and quick implementation hints.

---

## 1. Core Idea
- Tone: Professional, modern, and data-focused.
- Personality: Trustworthy, efficient, and slightly playful via accent gradients.

---

## 2. Color Palette
Primary and accents create the brand look — use primary for CTAs and key UI accents, accent/pink for highlights and badges.

- Brand Primary: `#2563EB` (use for primary CTAs)
- Brand Primary Variant: `#60A5FA` (gradients, hover)
- Brand Accent: `#8B5CF6` (cards, badges)
- Brand Accent 2: `#EC4899` (alerts, tags)

Neutrals / surfaces (light)
- Surface 0 (page): `#FFFFFF`
- Surface 1 (cards/panels): `#F8FAFF`
- Surface 2 (sub-panels): `#F1F5F9`
- Border: `#E6EDF8`

Neutrals / surfaces (dark)
- Surface 0 (page): `#0B1724` (deep navy)
- Surface 1 (panels): `#0F2336`
- Surface 2 (cards): `#0B1A2A`
- Border (dark): `rgba(255,255,255,0.06)`

Usage guidance:
- CTA primary: `--brand-primary` background + white text.
- Metric cards: use `--brand-accent` or gradient `--gradient-primary` for top bars and KPI badges.
- Panels/cards: use `--surface-1` on light, `--surface-1`/`--surface-2` on dark.

Contrast & Accessibility:
- Always verify contrast ratio of text on backgrounds. Primary text on `--surface-0` should be >= 4.5:1 for body text.

---

## 3. Typography
Primary UI font: Inter (system fallback provided). Use weights for hierarchical clarity.

- Font-family: `Inter, system-ui, -apple-system, "Segoe UI", Roboto` (declared in `--font-sans`)
- Scale (tokens):
  - xs: 12px
  - sm: 13px
  - base: 15px (body)
  - lg: 18px
  - xl: 20px

- Weights:
  - Regular: 400
  - Medium: 500 (buttons, label emphasis)
  - Semibold: 600 (titles)
  - Bold: 700 (strong headings)

Headlines:
- H1: 28–32px, 700
- H2: 20–24px, 600
- H3: 18px, 600

Form & controls:
- Use `--type-base` (15px) for input text; labels use `--type-sm` with `--weight-medium`.

---

## 4. Spacing & Radius
- Small radius: 6px
- Medium radius: 12px (cards)
- Large radius: 18px (panels, modals)

Spacing system is 4px baseline; prefer multiples of 4 for padding/margin.

---

## 5. Elevation & Shadows
- Subtle: `0 6px 18px rgba(16,24,40,0.06)` (light)
- Strong: `0 10px 30px rgba(2,6,23,0.25)` (dark/highlight)

Use elevation to separate primary content blocks from background; avoid heavy shadows for small inline elements.

---

## 6. Components & Usage Examples
- Primary button (CTA): background `--brand-primary`, white text, `--radius-sm`.
- KPI card: top-left KPI number on `--brand-accent` or `--gradient-primary`, body on `--surface-1`.
- Sidebar: dark/dim surface in dark mode (`--surface-1`) with subtle border.

Example CSS usage (tokens are in `src/app/globals.css`):

```
/* HTML */
<button class="btn-primary">Create product</button>

/* CSS uses variables from globals.css */
.btn-primary { background: var(--brand-primary); color: #fff; }
.card { background: var(--surface-1); box-shadow: var(--shadow-1); }
```

---

## 7. Implementation Notes
- Centralized tokens live in: [src/app/globals.css](src/app/globals.css#L1)
- For Tailwind projects: map CSS variables into `theme.extend.colors` in `tailwind.config.js` to enable utility usage.

Quick Tailwind mapping example (tailwind.config.js):

```
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--brand-primary)',
        accent: 'var(--brand-accent)',
        surface: 'var(--surface-1)'
      }
    }
  }
}
```

---

## 8. Assets & Imagery
- Use simplified screenshots of the dashboard for marketing with a soft vignette and one-card spotlight.
- For icons, prefer a geometric icon set (e.g., Radix UI, Heroicons) and keep stroke weight consistent.

---

## 9. Accessibility Checklist
- Ensure color contrast >= 4.5:1 for body text. For large headings use >= 3:1.
- Provide focus states for interactive elements (2–3px outline using `--brand-primary-variant`).
- Avoid conveying information by color alone (add icons or labels for statuses).

---

## 10. Next Steps (suggested)
1. Map tokens into `tailwind.config.js` so design tokens are available as utilities.
2. Replace hard-coded hex values in key components with CSS variables (KPI cards, buttons, sidebar, inputs).
3. Run an accessibility audit (Lighthouse or axe-core) to verify contrast and focus states.

If you want, I can: (a) map tokens to `tailwind.config.js`, (b) replace color literals in the most-used components, and (c) run an accessibility check locally.
