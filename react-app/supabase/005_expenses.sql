-- Duyên Phần — bảng "expenses" (Chi phí vận hành), thí điểm tích hợp Supabase.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần chạy 003_profiles.sql trước file này.

create table if not exists public.expenses (
  id bigint generated always as identity primary key,
  expense_date text not null,
  branch text not null,
  category text not null,
  amount numeric not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

-- Chi phí là dữ liệu nội bộ — chỉ tài khoản đã đăng nhập mới đọc/ghi được.
drop policy if exists "Staff can view expenses" on public.expenses;
create policy "Staff can view expenses" on public.expenses
  for select to authenticated using (true);

drop policy if exists "Staff can insert expenses" on public.expenses;
create policy "Staff can insert expenses" on public.expenses
  for insert to authenticated with check (true);

drop policy if exists "Staff can update expenses" on public.expenses;
create policy "Staff can update expenses" on public.expenses
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete expenses" on public.expenses;
create policy "Staff can delete expenses" on public.expenses
  for delete to authenticated using (true);

-- Seed dữ liệu mẫu — giống hệt danh sách đang có trong data.js.
insert into public.expenses (id, expense_date, branch, category, amount, note)
overriding system value
values
  (1, '01/09/2026', 'Quận 3 — Võ Văn Tần', 'Nguyên liệu', 8400000, 'Nhập rau củ, đậu hũ, nấm cho tuần đầu tháng.'),
  (2, '01/09/2026', 'Toàn hệ thống', 'Lương nhân viên', 186000000, 'Lương tháng 8 cho toàn bộ nhân sự.'),
  (3, '02/09/2026', 'Quận 1 — Lê Lợi', 'Thuê mặt bằng', 42000000, 'Tiền thuê mặt bằng tháng 9.'),
  (4, '02/09/2026', 'Tân Bình — Hoàng Việt', 'Điện nước', 5200000, 'Hoá đơn điện nước tháng 8.'),
  (5, '02/09/2026', 'Thủ Đức — Kha Vạn Cân', 'Nguyên liệu', 6750000, 'Nhập gạo, dầu ăn, gia vị.'),
  (6, '03/09/2026', 'Toàn hệ thống', 'Marketing', 12500000, 'Chạy quảng cáo ứng dụng giao đồ ăn.'),
  (7, '03/09/2026', 'Phú Nhuận — Phan Xích Long', 'Điện nước', 4800000, 'Hoá đơn điện nước tháng 8.'),
  (8, '03/09/2026', 'Quận 7 — Nguyễn Thị Thập', 'Thuê mặt bằng', 38000000, 'Tiền thuê mặt bằng tháng 9.'),
  (9, '03/09/2026', 'Quận 5 — Nguyễn Trãi', 'Nguyên liệu', 5900000, 'Nhập rau củ tươi trong ngày.'),
  (10, '03/09/2026', 'Toàn hệ thống', 'Khác', 3200000, 'Sửa chữa thiết bị bếp chi nhánh Quận 10.')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.expenses', 'id'), 10, true);
