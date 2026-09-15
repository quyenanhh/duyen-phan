-- Duyên Phần — bảng "restaurant_tables" (Sơ đồ bàn ăn tại chi nhánh).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần đã chạy 003_profiles.sql trước file này.

create table if not exists public.restaurant_tables (
  id bigint generated always as identity primary key,
  branch text not null,
  name text not null,
  capacity integer not null default 4,
  status text not null default 'trong' check (status in ('trong', 'co_khach', 'cho_don', 'da_dat')),
  created_at timestamptz not null default now(),
  unique (branch, name)
);

alter table public.restaurant_tables enable row level security;

-- Dữ liệu bàn là nội bộ (phục vụ/thu ngân/quản lý thao tác) — chỉ tài khoản đã đăng nhập.
drop policy if exists "Staff can view tables" on public.restaurant_tables;
create policy "Staff can view tables" on public.restaurant_tables
  for select to authenticated using (true);

drop policy if exists "Staff can insert tables" on public.restaurant_tables;
create policy "Staff can insert tables" on public.restaurant_tables
  for insert to authenticated with check (true);

drop policy if exists "Staff can update tables" on public.restaurant_tables;
create policy "Staff can update tables" on public.restaurant_tables
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete tables" on public.restaurant_tables;
create policy "Staff can delete tables" on public.restaurant_tables
  for delete to authenticated using (true);

-- Seed: 8 bàn mỗi chi nhánh (12 chi nhánh), sức chứa và trạng thái mẫu đa dạng để dễ hình dung.
insert into public.restaurant_tables (branch, name, capacity, status)
select b.branch, 'Bàn ' || t.n,
  (array[2,2,4,4,4,6,6,8])[t.n],
  (array['trong','co_khach','trong','cho_don','da_dat','trong','co_khach','trong'])[t.n]
from (values
  ('Quận 3 — Võ Văn Tần'), ('Quận 1 — Lê Lợi'), ('Tân Bình — Hoàng Việt'),
  ('Thủ Đức — Kha Vạn Cân'), ('Phú Nhuận — Phan Xích Long'), ('Quận 5 — Nguyễn Trãi'),
  ('Quận 7 — Nguyễn Thị Thập'), ('Quận 10 — Sư Vạn Hạnh'), ('Bình Thạnh — Điện Biên Phủ'),
  ('Gò Vấp — Quang Trung'), ('Bình Tân — Kinh Dương Vương'), ('Quận 4 — Nguyễn Tất Thành')
) as b(branch)
cross join generate_series(1, 8) as t(n)
on conflict (branch, name) do nothing;
