-- Duyên Phần — Cổng khách hàng: đặt bàn (reservations) + đặt món online (customer_orders,
-- customer_order_items), và vá lỗ hổng RLS đang mở trên các bảng nội bộ.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần đã chạy 003_profiles.sql, 004_menu_items.sql,
-- 008_restaurant_tables.sql, 022_signup_admin_token.sql trước file này.
--
-- VÌ SAO TÁCH BẢNG RIÊNG CHO KHÁCH HÀNG: bảng "orders" (006) là đơn giao hàng do NHÂN VIÊN
-- nhập tay, "table_orders" (009) là order tại bàn do PHỤC VỤ thao tác — cả hai không có cột
-- gắn với auth.uid() và RLS đang mở "to authenticated using (true)" (bất kỳ ai đăng nhập đều
-- đọc/ghi được toàn bộ). Dùng chung hai bảng đó cho khách hàng sẽ vừa lẫn dữ liệu vừa không
-- giới hạn được "khách chỉ xem đơn của chính mình" một cách an toàn. Nên tạo bảng mới, độc
-- lập, RLS ràng buộc theo customer_id = auth.uid().

-- Hàm kiểm tra người gọi có phải tài khoản nội bộ (không phải khách hàng) không — dùng để
-- thắt lại RLS của các bảng vốn đang mở "to authenticated using (true)".
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role <> 'customer'
  );
$$;
grant execute on function public.is_staff() to anon, authenticated;

-- ============================================================================
-- 1) Đặt bàn (reservations)
-- ============================================================================
create table if not exists public.reservations (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users(id) on delete cascade,
  branch text not null,
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null default 2 check (guests > 0),
  note text not null default '',
  customer_name text not null default '',
  customer_phone text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_customer_id_idx on public.reservations(customer_id);
create index if not exists reservations_branch_date_idx on public.reservations(branch, reservation_date);

alter table public.reservations enable row level security;

-- Chặn khách hàng tự đổi trạng thái sang "confirmed"/"completed" (chỉ nhân viên xác nhận
-- được) hoặc gắn đặt bàn cho người khác — khách chỉ được sửa thông tin đặt bàn của CHÍNH
-- mình lúc còn "pending", và chỉ được tự huỷ (status = 'cancelled').
create or replace function public.enforce_reservation_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    new.customer_id := old.customer_id;
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists before_reservation_update on public.reservations;
create trigger before_reservation_update
  before update on public.reservations
  for each row execute function public.enforce_reservation_update_rules();

drop policy if exists "Customers view own reservations, staff view all" on public.reservations;
create policy "Customers view own reservations, staff view all" on public.reservations
  for select to authenticated using (customer_id = auth.uid() or public.is_staff());

drop policy if exists "Customers create own reservations" on public.reservations;
create policy "Customers create own reservations" on public.reservations
  for insert to authenticated with check (customer_id = auth.uid());

drop policy if exists "Customers update own, staff update all" on public.reservations;
create policy "Customers update own, staff update all" on public.reservations
  for update to authenticated using (customer_id = auth.uid() or public.is_staff())
  with check (customer_id = auth.uid() or public.is_staff());

drop policy if exists "Staff can delete reservations" on public.reservations;
create policy "Staff can delete reservations" on public.reservations
  for delete to authenticated using (public.is_staff());

-- ============================================================================
-- 2) Đặt món online (customer_orders + customer_order_items)
-- ============================================================================
create table if not exists public.customer_orders (
  id bigint generated always as identity primary key,
  code text not null unique default ('DH-' || to_char(now(), 'YYMMDDHH24MISS') || floor(random() * 900 + 100)::int),
  customer_id uuid not null references auth.users(id) on delete cascade,
  branch text not null,
  order_mode text not null default 'mang_ve' check (order_mode in ('tai_ban', 'mang_ve')),
  table_id bigint references public.restaurant_tables(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  total numeric not null default 0,
  note text not null default '',
  customer_name text not null default '',
  customer_phone text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists customer_orders_customer_id_idx on public.customer_orders(customer_id);
create index if not exists customer_orders_branch_idx on public.customer_orders(branch);

alter table public.customer_orders enable row level security;

-- Cùng nguyên tắc như reservations: khách không tự chuyển đơn sang "confirmed"/"preparing"/
-- "ready"/"completed" (chỉ nhân viên xử lý), chỉ tự huỷ được lúc đơn còn "pending".
create or replace function public.enforce_customer_order_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    new.customer_id := old.customer_id;
    if new.status is distinct from old.status then
      if old.status <> 'pending' or new.status <> 'cancelled' then
        new.status := old.status;
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists before_customer_order_update on public.customer_orders;
create trigger before_customer_order_update
  before update on public.customer_orders
  for each row execute function public.enforce_customer_order_update_rules();

drop policy if exists "Customers view own orders, staff view all" on public.customer_orders;
create policy "Customers view own orders, staff view all" on public.customer_orders
  for select to authenticated using (customer_id = auth.uid() or public.is_staff());

drop policy if exists "Customers create own orders" on public.customer_orders;
create policy "Customers create own orders" on public.customer_orders
  for insert to authenticated with check (customer_id = auth.uid());

drop policy if exists "Customers update own, staff update all orders" on public.customer_orders;
create policy "Customers update own, staff update all orders" on public.customer_orders
  for update to authenticated using (customer_id = auth.uid() or public.is_staff())
  with check (customer_id = auth.uid() or public.is_staff());

drop policy if exists "Staff can delete customer orders" on public.customer_orders;
create policy "Staff can delete customer orders" on public.customer_orders
  for delete to authenticated using (public.is_staff());

create table if not exists public.customer_order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.customer_orders(id) on delete cascade,
  menu_item_id bigint references public.menu_items(id) on delete set null,
  item_name text not null,
  unit_price numeric not null default 0,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists customer_order_items_order_id_idx on public.customer_order_items(order_id);

alter table public.customer_order_items enable row level security;

drop policy if exists "View items of own orders, staff view all" on public.customer_order_items;
create policy "View items of own orders, staff view all" on public.customer_order_items
  for select to authenticated using (
    public.is_staff() or exists (
      select 1 from public.customer_orders co where co.id = order_id and co.customer_id = auth.uid()
    )
  );

drop policy if exists "Insert items into own orders" on public.customer_order_items;
create policy "Insert items into own orders" on public.customer_order_items
  for insert to authenticated with check (
    exists (
      select 1 from public.customer_orders co where co.id = order_id and co.customer_id = auth.uid()
    )
  );

drop policy if exists "Staff can delete order items" on public.customer_order_items;
create policy "Staff can delete order items" on public.customer_order_items
  for delete to authenticated using (public.is_staff());

-- ============================================================================
-- 3) Vá RLS đang mở trên các bảng nội bộ — trước đây "to authenticated using (true)" nghĩa
--    là BẤT KỲ tài khoản nào đăng nhập (kể cả khách hàng vừa tự đăng ký ở mục 022) đều gọi
--    thẳng được Supabase API để đọc/sửa dữ liệu này. Từ nay chỉ role khác "customer" mới
--    đọc/ghi được — không ảnh hưởng nhân viên/thu ngân/bếp/quản lý đang dùng bình thường.
-- ============================================================================
drop policy if exists "Staff can view orders" on public.orders;
create policy "Staff can view orders" on public.orders
  for select to authenticated using (public.is_staff());
drop policy if exists "Staff can insert orders" on public.orders;
create policy "Staff can insert orders" on public.orders
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders" on public.orders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "Staff can delete orders" on public.orders;
create policy "Staff can delete orders" on public.orders
  for delete to authenticated using (public.is_staff());

drop policy if exists "Staff can view tables" on public.restaurant_tables;
create policy "Staff can view tables" on public.restaurant_tables
  for select to authenticated using (public.is_staff());
drop policy if exists "Staff can insert tables" on public.restaurant_tables;
create policy "Staff can insert tables" on public.restaurant_tables
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update tables" on public.restaurant_tables;
create policy "Staff can update tables" on public.restaurant_tables
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "Staff can delete tables" on public.restaurant_tables;
create policy "Staff can delete tables" on public.restaurant_tables
  for delete to authenticated using (public.is_staff());

drop policy if exists "Staff can view table orders" on public.table_orders;
create policy "Staff can view table orders" on public.table_orders
  for select to authenticated using (public.is_staff());
drop policy if exists "Staff can insert table orders" on public.table_orders;
create policy "Staff can insert table orders" on public.table_orders
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update table orders" on public.table_orders;
create policy "Staff can update table orders" on public.table_orders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "Staff can delete table orders" on public.table_orders;
create policy "Staff can delete table orders" on public.table_orders
  for delete to authenticated using (public.is_staff());

drop policy if exists "Staff can view expenses" on public.expenses;
create policy "Staff can view expenses" on public.expenses
  for select to authenticated using (public.is_staff());
drop policy if exists "Staff can insert expenses" on public.expenses;
create policy "Staff can insert expenses" on public.expenses
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update expenses" on public.expenses;
create policy "Staff can update expenses" on public.expenses
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "Staff can delete expenses" on public.expenses;
create policy "Staff can delete expenses" on public.expenses
  for delete to authenticated using (public.is_staff());
