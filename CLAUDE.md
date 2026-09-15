# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This is a **Claude Design System skill package**, not an application. It is the `duyen-phan-design` skill (`SKILL.md`) for **Duyên Phần**, a fictional Vietnamese vegetarian rice-meal restaurant chain, covering two surfaces: the public landing page (`Trang chủ`) and an internal multi-branch admin console (`Hệ thống quản trị chuỗi`).

There is no build tool, package manager, linter, or test suite here (no `package.json`) — the deliverables are static HTML/CSS/JSX design artifacts consumed by Claude Design's canvas runtime. There is nothing to build/lint/test; verify changes by opening the relevant `.html` file (or a `.card.html` / `.dc.html` file via the design canvas) and checking it visually against `readme.md`.

**Always read `readme.md` first** — it is the single source of truth for brand voice, Vietnamese copy conventions, color palette, typography, spacing, iconography, and every other design rule. Do not duplicate or re-derive those rules from memory; read the file. `SKILL.md` is just the pointer into it.

## Where things live

| Path | What |
| --- | --- |
| `styles.css` | Global entry point — only `@import`s `tokens/*.css` then `base.css` |
| `tokens/*.css` | Design tokens: fonts, colors, typography, spacing, radius, elevation, motion |
| `base.css` | Element resets (body/page bg, headings, links, focus ring, selection) |
| `components/{core,forms,data,navigation,feedback}/` | React component primitives |
| `guidelines/*.card.html` | Foundation specimen cards (colors, type, spacing, brand) |
| `ui_kits/landing/`, `ui_kits/admin/` | Full page recreations of the two product surfaces |
| `templates/<name>/` | Individual Claude Design canvas templates (one per admin/landing screen) |
| `assets/` | Intentionally empty — no logo/photography was supplied (see `assets/README.md`) |
| `Canvas.dc.html` | Blank design-canvas entry point |
| `image-slot.js` | `<image-slot>` custom element (user-fillable image placeholder web component) |
| `support.js` / `templates/*/support.js` | **Generated** dc-runtime bundle — `// GENERATED from dc-runtime/src/*.ts — do not edit` |

### Component convention

Every component in `components/<category>/` follows a fixed four-file (+one shared) pattern — keep it when adding or editing components:

- `<Name>.jsx` — the React implementation. Styling is inline `style={{...}}` objects referencing CSS custom properties from `tokens/*.css` (e.g. `var(--brand)`, `var(--radius-control)`), not hardcoded hex/px values.
- `<Name>.d.ts` — the props contract, with a `@startingPoint` JSDoc tag (`section`, `subtitle`, `viewport`) used by the design canvas.
- `<Name>.prompt.md` — short usage guidance: when to use it, a JSX example, key constraints (e.g. sizes, do/don't).
- One shared `<category>.card.html` per folder (`@dsCard` header comment) — a live demo page loading React/Babel/Lucide from CDN plus `../../_ds_bundle.js`, showing every component in the folder in its states. This is the file to open to visually verify a component change.

Components list (see `readme.md` for the "why" behind the non-brief additions like `Icon`, `StatusChip`, `StatCard`, `DataTable`, `Sidebar`, `Pagination`, `EmptyState`):
- **core** — `Icon`, `Button`, `IconButton`, `Badge`, `Tag`, `Card`
- **forms** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
- **data** — `DataTable`, `StatusChip` (+ `STATUS_MAP`), `StatCard`
- **navigation** — `Sidebar`, `Tabs`, `Pagination`
- **feedback** — `Dialog`, `Toast`, `Tooltip`, `EmptyState`

### `.dc.html` template convention (`templates/<name>/`)

Each template directory is one screen (`auth`, `branches`, `dashboard`, `finance`, `landing-page`, `menu`, `orders`, `staff`), each with:
- `<Name>.dc.html` — an `<x-dc>` document: a `<!-- @template name="..." description="..." -->` comment, a `<helmet>` block loading `ds-base.js` + the Lucide CDN script, then markup that pulls design-system components via `<x-import component-from-global-scope="DuyNPhNDesignSystem_e06890.<Component>" ...>` with `{{ }}` template interpolation bindings and `hint-size` streaming placeholders.
- `ds-base.js` — small loader that links the design system's CSS tokens and `_ds_bundle.js` relative to the template (`base = '../..'`); when copying this design system into a consuming project, only this file's `base` line needs to change.
- `support.js` — same generated dc-runtime bundle as the root `support.js`; do not hand-edit.
- `.thumbnail` — canvas thumbnail asset.

`ui_kits/{admin,landing}/` are the fuller, click-through recreations (`Views.jsx` / `Sections.jsx` + `index.html`) of the same surfaces — see each folder's `README.md` for what's covered (e.g. admin's login → dashboard → orders → menu → staff flow; landing's single-page sections).

## Content & brand rules (quick reference — `readme.md` is authoritative)

- **Language:** Vietnamese with full diacritics everywhere; never mix in English UI words.
- **Tone:** plain, calm, concrete (*mộc mạc*); never exclamation marks, never emoji, never ALL-CAPS sentences.
- **Numbers/dates:** `1.250.000₫` (dot separators, trailing ₫, no space), dates `dd/MM/yyyy`, decimals with a comma (`+8,2%`).
- **Fonts:** Be Vietnam Pro everywhere; Lora is landing-page-only (hero, section headings, wordmark) and must never appear in the admin console.
- **Color:** green `--brand` (`#4B6B3E`) is the only primary action color; clay `--accent` (`#B9773A`) is a secondary accent, never a second primary; no gradients anywhere.
- **Icons:** Lucide only, always through `<Icon name="…" />` (or the `x-import` equivalent) — never raw SVG, never filled/duotone variants.

When generating new artifacts (mocks, prototypes, extra templates) for this brand, follow the "Copy assets out, create static HTML" guidance in `SKILL.md`: read `readme.md`, then act as the brand's expert designer.
