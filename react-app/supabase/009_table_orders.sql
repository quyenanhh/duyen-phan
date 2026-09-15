-- Duyên Phần — bảng "table_orders" (Gọi món tại bàn — order đang phục vụ tại chỗ).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần đã chạy 008_restaurant_tables.sql trước file này.
--
-- Một order gắn với một bàn cụ thể. status:
--   open      — đang gọi món, chưa gửi bếp, phục vụ có thể sửa tự do.
--   sent      — đã gửi bếp, bếp đang chuẩn bị (dùng ở Phase 4 — Màn hình bếp).
--   served    — bếp đã làm xong, đã mang ra bàn, chờ thanh toán (Phase 5).
--   paid      — thu ngân đã thanh toán xong (Phase 5/6).
--   cancelled — huỷ order.

create table if not exists public.table_orders (
  id bigint generated always as identity primary key,
  table_id bigint not null references public.restaurant_tables(id) on delete cascade,
  branch text not null,
  table_name text not null,
  status text not null default 'open' check (status in ('open', 'sent', 'served', 'paid', 'cancelled')),
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  note text not null default '',
  waiter_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.table_orders enable row level security;

drop policy if exists "Staff can view table orders" on public.table_orders;
create policy "Staff can view table orders" on public.table_orders
  for select to authenticated using (true);

drop policy if exists "Staff can insert table orders" on public.table_orders;
create policy "Staff can insert table orders" on public.table_orders
  for insert to authenticated with check (true);

drop policy if exists "Staff can update table orders" on public.table_orders;
create policy "Staff can update table orders" on public.table_orders
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete table orders" on public.table_orders;
create policy "Staff can delete table orders" on public.table_orders
  for delete to authenticated using (true);
