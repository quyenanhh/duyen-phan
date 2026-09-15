# UI kit — Hệ thống quản trị chuỗi (internal admin)

Desktop-only, 1440×900 design frame. Fixed 248px `Sidebar` + sticky 64px top bar + cream content area, 32px page padding, 24px block gap.

- `Views.jsx` — `LoginScreen`, `AdminApp` (shell + routing), `TopBar`, `Dashboard`, `Orders`, `MenuAdmin`, `Staff`, `Placeholder`
- `index.html` — starts on login; **click "Đăng nhập"** to enter, then use the sidebar.

Click-through covered: login → dashboard → orders (tab filter, row select, cancel dialog → danger toast, empty state) → menu (category chips, availability switch → success toast, edit form) → staff. Branches / Finance / Settings intentionally render a "chưa có thiết kế" placeholder — no source design existed for them.

All type is Be Vietnam Pro; never Lora here. Money is right-aligned tabular numerals, `1.250.000₫`. Status colour comes only from `StatusChip`.
