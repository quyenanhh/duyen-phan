# Backend & frontend foundation — Duyên Phần admin console

Status: proposed, pending user review
Sub-project 1 of 6 in the plan to turn the Duyên Phần admin mockups into a real, free-to-run application for a graduation thesis project.

## Context and roadmap

`nganhtin/` is documented in `CLAUDE.md` and `readme.md` as a static design-system skill package for a fictional Vietnamese vegetarian restaurant chain: no backend, no database, no build tool. `ui_kits/admin/Views.jsx` is a 236-line click-through mockup with hardcoded sample data; the richer `.dc.html` templates under `templates/orders`, `templates/finance`, `templates/staff`, and `templates/auth` are fuller static designs of the same screens but are equally static.

The goal is to turn this into a real, working admin console for a school graduation thesis (group project), for free (no paid services anywhere in the stack). Because the request spans several independent areas, it has been decomposed into six sub-projects, each to be brainstormed, designed, and implemented on its own:

1. **Backend & frontend foundation** (this document) — stack, data model, auth, project scaffolding. Blocks every other sub-project.
2. **Đặt hàng & Giao hàng (Orders)** — create/edit order, order detail, order tracking, backed by real data.
3. **Doanh thu & Chi tiêu (Finance)** — revenue/expense calculation wired to real order and ledger data.
4. **Tài khoản & nhân sự** — no manual approval step on registration (decided in this document), staff can edit their own shift info.
5. **Self-service account modal** — a modal shown when clicking the account name in the sidebar, showing/editing the logged-in user's own profile.
6. **Brand corner** — keep the current placeholder leaf icon next to the wordmark; no new logo asset is available yet.

Sub-projects 2–6 are out of scope for this document and will each get their own brainstorming pass once this foundation is approved and built.

## Goals of this sub-project

Stand up enough real infrastructure that later sub-projects can build actual features against it:

- A NestJS backend with Prisma talking to the user's already-provisioned Supabase Postgres database.
- Supabase Auth for signup/login, with NestJS verifying the resulting JWT and enforcing roles.
- A Vite + React frontend that replaces the current `<script>`-tag/Babel-in-browser admin mockup, reusing the existing `components/` design-system primitives as real ES module imports.
- The two-role model (`MANAGER`, `STAFF`) and the full data schema, migrated onto Supabase.
- A working, deployed-nowhere-yet-but-runnable-locally login → dashboard loop using real (seeded) data, proving the whole chain works end to end.

Explicitly **out of scope** here (each belongs to a later sub-project): order create/edit forms, real finance charts wired to computed values, staff self-service shift editing, the account modal, and the logo/icon tweak. This sub-project only needs to render the dashboard's existing KPIs and tables from real (seeded) rows — it does not need to build the Orders/Finance/Staff screens' full interactivity.

## Architecture

**Stack:** NestJS (backend, hand-written by the student per thesis requirements) + Prisma (ORM) + Supabase Postgres (database, free tier, already provisioned) + Supabase Auth (signup/login, free tier) + Vite + React (frontend).

**Repo layout** — two new folders alongside the untouched design-system files:

```
backend/     NestJS app: Prisma schema, auth guard, feature modules
frontend/    Vite + React app: pages, API client, reused components/
components/  (existing, untouched) design-system primitives
templates/   (existing, untouched) reference designs for each screen
```

The `frontend/` app imports design-system components directly as ES modules (e.g. `import { Button } from '../../components/core/Button/Button'`) instead of the current global-`window` + Babel-standalone pattern used by `ui_kits/admin/Views.jsx` and the `.dc.html` templates. Those existing files are left as-is — they remain the visual reference/spec for each screen, not the runtime code.

## Data model (Prisma schema, on Supabase Postgres)

```prisma
enum Role { MANAGER STAFF }
enum OrderStatus { pending processing delivering late completed cancelled }
enum FinanceCategory { NGUYEN_LIEU LUONG_NHAN_VIEN MAT_BANG MARKETING KHAC }

model User {
  id          String   @id // matches Supabase auth.users.id
  email       String   @unique
  fullName    String
  phone       String?
  role        Role     @default(STAFF)
  position    String?  // "Đầu bếp", "Phục vụ", "Shipper", "Quản lý"...
  branchId    String?
  branch      Branch?  @relation(fields: [branchId], references: [id])
  baseSalary  Decimal?
  dob         DateTime?
  address     String?
  joinedAt    DateTime @default(now())
  active      Boolean  @default(true)
  shifts      Shift[]
  shipments   Order[]  @relation("Shipper")
}

model Branch {
  id       String     @id @default(uuid())
  name     String
  address  String?
  users    User[]
  orders   Order[]
  menu     MenuItem[]
  entries  FinanceEntry[]
}

model MenuItem {
  id               String   @id @default(uuid())
  name             String
  category         String
  price            Decimal
  description      String?
  portionsToday    Int?
  deliveryEnabled  Boolean  @default(true)
  status           String   @default("open") // "open" | "draft"
  branchId         String?
  branch           Branch?  @relation(fields: [branchId], references: [id])
  orderItems       OrderItem[]
}

model Order {
  id            String   @id @default(uuid())
  code          String   @unique // "DP-1042"
  branchId      String
  branch        Branch   @relation(fields: [branchId], references: [id])
  customerName  String
  customerPhone String?
  address       String?
  note          String?
  status        OrderStatus @default(pending)
  shipperId     String?
  shipper       User?    @relation("Shipper", fields: [shipperId], references: [id])
  placedAt      DateTime @default(now())
  etaAt         DateTime?
  totalAmount   Decimal
  items         OrderItem[]
  events        OrderStatusEvent[]
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  menuItemId  String?
  menuItem    MenuItem? @relation(fields: [menuItemId], references: [id])
  name        String   // snapshot at order time
  qty         Int
  unitPrice   Decimal
  lineTotal   Decimal
}

model OrderStatusEvent {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  status      OrderStatus
  occurredAt  DateTime @default(now())
}

model FinanceEntry {
  id        String   @id @default(uuid())
  date      DateTime
  category  FinanceCategory
  branchId  String?
  branch    Branch?  @relation(fields: [branchId], references: [id])
  amount    Decimal  // negative = chi, positive = other income
  note      String?
}

model Shift {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime
  type      String   // "sang" | "chieu" | "off" | custom label
  notes     String?
}
```

Revenue is **not** a `FinanceEntry` row — it is computed on read by summing `Order.totalAmount` for `status = completed` (or all non-cancelled, to be confirmed in sub-project #3) over the requested branch/date range. `FinanceEntry` only holds manually entered expenses (nguyên liệu, lương, mặt bằng, marketing, khác).

## Auth

- Supabase Auth owns signup/login/password/email confirmation.
- On successful Supabase signup, a NestJS `POST /auth/register-profile` endpoint (called by the frontend right after Supabase confirms signup) creates the matching `User` row with `role = STAFF` by default and no manager approval step — the account is usable immediately.
- A manager can later promote a `User` to `MANAGER` via a staff-management endpoint (built in a later sub-project).
- Every other NestJS endpoint sits behind an `AuthGuard` that verifies the Supabase-issued JWT (via Supabase's JWT secret) and attaches the resolved `User` (with role and branchId) to the request for role/branch-scoped authorization checks.

## API modules (skeleton in this sub-project; full CRUD lands in later sub-projects)

`AuthModule`, `BranchesModule`, `MenuModule`, `OrdersModule`, `FinanceModule`, `StaffModule` (staff + shifts). This sub-project stands up each module with its Prisma-backed read endpoints (list/get) and the auth guard wired in; write endpoints beyond registration are built alongside their feature sub-project.

## Frontend scaffold

- Vite + React, TypeScript optional (student's choice, not architecturally significant).
- Supabase JS client for signup/login; access token stored via Supabase's own client-side session handling and attached as a `Bearer` header on every NestJS API call.
- Routing: a protected shell (mirrors `AdminApp` in `Views.jsx`) that redirects to `/login` when unauthenticated, otherwise renders `Sidebar` + `TopBar` + the active screen.
- Dashboard screen is ported first, reading real (seeded) `Order`/`FinanceEntry` rows through the new API, proving the full chain (Supabase Auth → NestJS guard → Prisma → Postgres → React) end to end.
- Other screens (Orders, Menu, Staff, Finance) are scaffolded as routed pages during this sub-project but keep their current mock-data rendering until their own sub-project wires them to the real API.

## Local dev / cost

Entirely free: Supabase free-tier Postgres + Auth (already provisioned by the user), NestJS and Vite run locally (`npm run start:dev`, `npm run dev`). No deployment target is chosen yet — if the thesis needs a public URL for a demo day, that choice (e.g., Render/Railway free tier for the backend, Vercel free tier for the frontend) is deferred to a later, separate decision.

## Open questions carried into later sub-projects

- Sub-project #3: should cancelled orders be excluded from revenue, and should "Lương nhân viên" ever auto-populate from `User.baseSalary` instead of manual entry?
- Sub-project #2: does menu stay chain-wide or become per-branch (schema above allows either via `MenuItem.branchId` being nullable)?
- Deployment target for a public demo URL, if the thesis requires one.
