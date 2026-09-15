# Duyên Phần — Design System

**Duyên Phần** is a Vietnamese vegetarian rice-meal restaurant chain (*chuỗi nhà hàng cơm chay*). Two surfaces are covered here:

1. **Trang chủ (public landing page)** — a warm, editorial brand site: story, seasonal menu, branch finder, booking CTA. Consumer-facing, Vietnamese, image-led.
2. **Hệ thống quản trị chuỗi (internal admin console)** — desktop web app for chain managers and back-office staff: multi-branch operations, menus, orders/delivery, staff, finance. Dense but airy; data tables and status chips are the core UI.

Locale is Vietnamese throughout: dates `dd/MM/yyyy`, money with dot thousand separators and a trailing ₫ (`1.250.000₫`).

## Sources

This system was built from a **written brand brief only** (pasted into chat, 31/08/2026): mood, colour palette with hex values, typography, spacing/radius/shadow rules, iconography direction, locale and design constraints.

- No Figma file, no GitHub repository, no codebase, no slide deck, no screenshots were provided.
- **No logo file was provided.** Nothing has been drawn or invented: wherever a mark belongs, the brand name is set in type (Lora 600 on green / on white). Send the real logo files and they'll replace the type-set wordmark.
- **Fonts are Google Fonts, loaded from CDN** (`tokens/fonts.css`): *Be Vietnam Pro* (UI, admin, all data) and *Lora* (landing-page display accent only). Both were named in the brief, so this is the canonical source rather than a substitution — but no self-hosted binaries exist in `assets/`. If licensed/self-hosted files are preferred, send them and `fonts.css` becomes `@font-face` rules.
- **Icons are Lucide 0.454 from CDN** — a *substitution*: the brief specified "thin outline, softly rounded, food/nature glyphs where possible" but supplied no icon set. Lucide matches that description (1.5px stroke, round caps). Flagging so it can be swapped for a house set.
- No product photography was supplied. Every image in the UI kits is an explicit dashed placeholder labelled in Vietnamese.

## Index

| Path | What |
| --- | --- |
| `styles.css` | Global entry — `@import` list only. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css` |
| `base.css` | Element resets: body/page background, headings, link colours, focus ring, selection |
| `components/` | React primitives, grouped `core` / `forms` / `data` / `navigation` / `feedback` |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `ui_kits/landing/` | Public homepage recreation — `Sections.jsx`, `index.html`, `README.md` |
| `ui_kits/admin/` | Admin console recreation — `Views.jsx`, `index.html`, `README.md` |
| `thumbnail.html` | Homepage tile for this design system |
| `SKILL.md` | Agent-skill entry point |

### Components

- **core** — `Icon`, `Button`, `IconButton`, `Badge`, `Tag`, `Card`
- **forms** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
- **data** — `DataTable`, `StatusChip` (+ `STATUS_MAP`), `StatCard`
- **navigation** — `Sidebar`, `Tabs`, `Pagination`
- **feedback** — `Dialog`, `Toast`, `Tooltip`, `EmptyState`

Each directory has `<Name>.jsx`, `<Name>.d.ts` (props contract) and `<Name>.prompt.md` (when/how to use), plus one `@dsCard` HTML showing states.

**Intentional additions** (not in the brief, added because the brief's constraints require them):
- `Icon` — a thin wrapper over the Lucide set so stroke weight (1.5) can never drift.
- `StatusChip` — encodes the brief's mandated status→colour mapping in one place so order/delivery states stay consistent.
- `StatCard`, `DataTable`, `Sidebar`, `Pagination`, `EmptyState` — the brief explicitly requires a fixed-sidebar admin layout with scannable data tables; these are that layout's parts.

## Content fundamentals

**Language.** Vietnamese with full diacritics, always. Never mix English UI words into Vietnamese sentences ("Đơn hàng", not "Orders"; "Xuất Excel" is acceptable because the file format is the proper noun).

**Person.** The brand speaks as *chúng tôi* (we) and addresses the guest as *bạn* — warm but not familiar; never *quý khách* (too formal/corporate), never *mình* (too cute). In the admin console, drop the pronouns entirely and name the object: "Đã lưu thực đơn", "Đơn đã huỷ không thể hoàn tác."

**Tone.** Plain, calm, concrete, a little unhurried. Talk about food and craft, not "solutions" or "optimisation". Short sentences. Understatement over superlatives — the brief's mood is *mộc mạc* (unadorned).

- Landing: "Rau củ theo mùa, gạo lứt và đậu hũ làm mỗi sáng. Chúng tôi nấu vừa đủ cho một ngày, không phô trương, không dư thừa."
- Value prop: "Nấu vừa đủ" / "Bữa cơm lành, nấu bằng sự tử tế"
- Admin empty state: "Chưa có đơn nào hôm nay — đơn mới sẽ xuất hiện ở đây ngay khi khách đặt."
- Destructive confirm: "Huỷ đơn DP-1039? Đơn đã huỷ không thể hoàn tác."

**Avoid:** "CẬP NHẬT THÀNH CÔNG!!!", "giải pháp F&B tối ưu hoá vận hành", "Đặt ngay 🌿", "Ưu đãi cực sốc".

**Casing.** Sentence case everywhere — headings, buttons, labels, table cells. The single exception is the 12px caption in uppercase with 0.08em tracking, used for table column headers, sidebar section labels and eyebrow lines above headings. Never all-caps a sentence, never Title Case A Whole Heading.

**Buttons** are verb-first and 1–3 words: "Xem thực đơn", "Lưu món", "Tạo đơn", "Huỷ đơn". Dialog pairs are always [keep] then [do]: "Giữ đơn" / "Huỷ đơn".

**Numbers.** `65.000₫`, `1.250.000₫` (dot separators, ₫ suffix, no space). Dates `31/08/2026`; date+time `14:20 31/08/2026`. Decimals use a comma: "+8,2% so với hôm qua". Counts read naturally: "264 đơn hôm nay · 12 chi nhánh".

**Emoji: never.** Not in UI, not in marketing copy, not in toasts. Meaning is carried by Lucide outline icons.

**Punctuation.** The middot `·` separates metadata ("Chi nhánh Quận 3 · 14:20 31/08/2026"). No exclamation marks. Em-dashes are used sparingly in branch names ("Quận 3 — Võ Văn Tần").

## Visual foundations

**Palette.** One warm neutral field, one green, one clay. Page is rice-paper cream `#FAF7F2`; cards are pure white; sunken/zebra areas are `#F3EDE2`. Green `#4B6B3E` is the only primary action colour (hover `#3A5430`, active `#2C4022`); clay `#B9773A` is the accent — landing CTAs, tags, small emphasis — never a second primary. Dark green `#2C4022` is the inverse field (branch band, login panel). Status: success = the brand green, warning `#C98A2C`, info `#5C7A99`, danger `#B4462E`, each with a soft tint for chip backgrounds. Every text/surface pairing in use clears WCAG AA (body ink on cream ≈ 11.9:1, muted ink on cream ≈ 6.0:1, cream on green ≈ 7.4:1).

**Type.** Be Vietnam Pro carries everything; 600 for headings, 500 for labels/buttons, 400 for body, 300 unused in UI. Lora appears **only** on the landing page — hero, section headings, the type-set wordmark, pull quotes — and never in the admin console, where data legibility wins. Scale: display 40 (hero may go to 52), H1 32, H2 26, H3 19, body-lg 16, body 15, body-sm 14 (tables, dense UI), label 13, caption 12. Line-height 1.6 body, 1.3 headings, 1.45 in tables. Headings take −0.01em tracking; uppercase captions take +0.08em. Numerals are tabular wherever they line up in a column.

**Spacing & layout.** 4px base; the used steps are 4/8/12/16/24/32/48/64/96. Card padding 24; stacked blocks 16–24 apart; page padding 32 in admin, 32-gutter 1200px max content on landing; section rhythm on landing is 72–80px vertical. Admin is a fixed 248px left sidebar + sticky 64px top bar + scrolling cream content; the sidebar never collapses (desktop-only product). Table rows are 52px with 16px cell padding. Generous whitespace is a rule, not a preference — when in doubt, add a step, don't compress.

**Backgrounds & imagery.** Flat warm colour fields only — **no gradients anywhere**, no repeating patterns, no textures, no noise. Depth comes from the cream/white/sunken triad plus hairline borders. Photography (none supplied yet) should read warm and natural: daylight, real bowls of food, hands and kitchens, matte rather than glossy, no heavy filters, no cool blue casts, no black & white. Full-bleed photography is reserved for the landing hero and section breaks; the admin console has no imagery at all beyond icons and avatars.

**Corners & cards.** 12px on cards and modals, 8px on buttons/inputs/selects, 6px on checkboxes and tooltips, 999px on badges/chips/tags/avatars. A card is: white fill, 1px `#E4DCC8` border, 12px radius, `0 2px 8px rgba(46,42,34,.06)`. Border AND shadow together — the hairline is what keeps it from floating.

**Shadows.** Three levels, all warm-ink based and deliberately faint: card `0 2px 8px /.06`, raised (hover on clickable cards) `0 4px 14px /.08`, modal `0 16px 40px /.14`. Never stack, never use a cool/black shadow, never use shadow to separate two adjacent surfaces — use a border. Inner shadow is used once, as the 2px underline on the active tab.

**Borders & dividers.** `--border` `#E4DCC8` for card and section edges; `--border-soft` `#EFE9DC` for row dividers inside a list; `--border-strong` `#D3C7A9` for input outlines so fields read as interactive. 1px always.

**Transparency & blur.** Almost never. Two sanctioned uses: the sticky landing nav (`rgba(250,247,242,.88)` + `blur(8px)`) and the modal scrim (`rgba(46,42,34,.38)` — warm ink, not black). On the dark-green band, panels are `rgba(255,253,250,.06)` with a `.12` border. No glassmorphism.

**Animation.** Restrained and short: 120ms for colour/hover, 180ms for toggles and card lift, 280ms only for entrances. Easing `cubic-bezier(.22,.61,.36,1)` (ease-out) for almost everything. Fades and small translations only — no bounce, no spring, no scale-up entrances, no looping motion, no scroll-jacking. Reduced-motion users lose nothing important.

**Hover states.** Filled buttons darken one step (green 700→800, clay 600→700). Secondary/ghost buttons and icon buttons take a cream `--surface-sunken` wash. Table rows wash to `#FAF7F2`. Sidebar items wash to sunken; the active item keeps a green-100 fill with green text. Clickable cards lift 2px and swap to the raised shadow. Links darken and add a 3px-offset underline. Never change layout on hover; never use opacity as the hover cue.

**Press states.** Buttons translate 1px down — no scale, no ring. Toggles animate the knob 180ms. No colour flash.

**Focus.** 2px solid green outline, 2px offset (`:focus-visible`), plus a 3px `rgba(75,107,62,.32)` ring on text inputs, which also switch their border to green. Focus is never removed.

**Fixed elements.** Landing: sticky translucent nav. Admin: sticky sidebar (full height) and sticky top bar; toasts pinned bottom-right 24px; modals centred with a 24px viewport gutter.

## Iconography

- **Set:** [Lucide](https://lucide.dev) v0.454, outline only, **1.5px stroke**, round caps and joins, 24px viewBox. Loaded from CDN (`https://unpkg.com/lucide@0.454.0/dist/umd/lucide.min.js`) — no icon binaries are vendored in `assets/`, and no house icon set was supplied (see Sources: this is a flagged substitution).
- **Wrapper:** always render icons through `<Icon name="…" />` so stroke weight and sizing stay uniform. Do not paste raw SVG and do not hand-draw glyphs.
- **Sizes:** 16px inline with 14px text and in sm controls, 18px in sidebar items, 20px default and in md/lg buttons, 22px inside the 48px empty-state medallion.
- **Colour:** `currentColor`. Muted `--text-muted` for decorative/inactive, `--brand` for active nav, status colour only in Toast leading icons.
- **Never:** filled/solid icon variants, duotone, two-tone brand icons, stroke weights above 2, icon-only buttons without a `label`.
- **Preferred vocabulary** (food & nature first, per the brief): `leaf`, `sprout`, `soup`, `utensils`, `store`, `truck`, `package`, `receipt-text`, `wallet`, `users`, `calendar-days`, `clock`, `chart-line`, `settings`, `map-pin`, `phone`.
- **Emoji and unicode symbols are not icons.** The only decorative unicode in use is the middot `·` as a metadata separator and `₫` as the currency symbol.
- **Avatars** are initials on a tinted pill (clay-100 for office staff, green-100 in lists) — no illustrated avatars, no gravatars.

## Assets

`assets/` is intentionally empty: no logo, no photography, no illustration and no icon binaries were provided. Nothing here was drawn or generated to fill the gap. **Please send: logo files (SVG preferred), 6–10 real dish/kitchen photos, and licensed font files if self-hosting is required.**
