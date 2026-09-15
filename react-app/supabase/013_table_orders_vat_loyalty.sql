-- Duyên Phần — thêm thuế VAT và các trường tra cứu điểm/khách hàng, mã giảm giá cho table_orders.
-- Chạy sau 011_table_orders_payment.sql. An toàn để chạy lại nhiều lần.

alter table public.table_orders add column if not exists vat_pct numeric not null default 0;
alter table public.table_orders add column if not exists vat_amount numeric not null default 0;
alter table public.table_orders add column if not exists customer_phone text not null default '';
alter table public.table_orders add column if not exists voucher_code text not null default '';
alter table public.table_orders add column if not exists points_earned integer not null default 0;
alter table public.table_orders add column if not exists points_redeemed integer not null default 0;

-- Khách hàng thân thiết — tra cứu theo số điện thoại, tích/đổi điểm khi thanh toán.
create table if not exists public.customers (
  id bigint generated always as identity primary key,
  phone text not null unique,
  name text not null default '',
  points integer not null default 0,
  total_spent numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;

drop policy if exists "Staff can view customers" on public.customers;
create policy "Staff can view customers" on public.customers
  for select to authenticated using (true);

drop policy if exists "Staff can insert customers" on public.customers;
create policy "Staff can insert customers" on public.customers
  for insert to authenticated with check (true);

drop policy if exists "Staff can update customers" on public.customers;
create policy "Staff can update customers" on public.customers
  for update to authenticated using (true) with check (true);

-- Mã giảm giá / voucher — quản lý tạo, thu ngân áp dụng lúc thanh toán.
create table if not exists public.vouchers (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'amount')),
  discount_value numeric not null default 0,
  active boolean not null default true,
  max_uses integer,
  used_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.vouchers enable row level security;

drop policy if exists "Staff can view vouchers" on public.vouchers;
create policy "Staff can view vouchers" on public.vouchers
  for select to authenticated using (true);

drop policy if exists "Staff can insert vouchers" on public.vouchers;
create policy "Staff can insert vouchers" on public.vouchers
  for insert to authenticated with check (true);

drop policy if exists "Staff can update vouchers" on public.vouchers;
create policy "Staff can update vouchers" on public.vouchers
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete vouchers" on public.vouchers;
create policy "Staff can delete vouchers" on public.vouchers
  for delete to authenticated using (true);

-- Vài mã giảm giá mẫu để dùng thử ngay.
insert into public.vouchers (code, discount_type, discount_value, active)
values
  ('DUYENPHAN10', 'percent', 10, true),
  ('GIAM20K', 'amount', 20000, true)
on conflict (code) do nothing;
