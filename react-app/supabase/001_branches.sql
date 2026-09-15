-- Duyên Phần — bảng "branches" (Chi nhánh), thí điểm tích hợp Supabase.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần (dùng IF NOT EXISTS / ON CONFLICT).

create table if not exists public.branches (
  id bigint generated always as identity primary key,
  name text not null,
  address text not null,
  manager text not null,
  phone text not null,
  hours text not null,
  opened text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  staff_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.branches enable row level security;

-- Chưa có Supabase Auth ở giai đoạn này (đăng nhập trong app vẫn là giả lập),
-- nên tạm thời cho phép đọc/ghi công khai qua anon key để giữ đúng hành vi hiện tại
-- (ai vào trang quản trị cũng thao tác được). Khi làm Supabase Auth thật, hãy
-- thắt lại các policy này (vd. chỉ cho user đã đăng nhập, theo vai trò Quản lý).
drop policy if exists "Public can view branches" on public.branches;
create policy "Public can view branches" on public.branches
  for select using (true);

drop policy if exists "Public can insert branches" on public.branches;
create policy "Public can insert branches" on public.branches
  for insert with check (true);

drop policy if exists "Public can update branches" on public.branches;
create policy "Public can update branches" on public.branches
  for update using (true) with check (true);

drop policy if exists "Public can delete branches" on public.branches;
create policy "Public can delete branches" on public.branches
  for delete using (true);

-- Seed dữ liệu mẫu — giống hệt danh sách 12 chi nhánh đang có trong data.js,
-- để chuyển sang Supabase không làm mất/đổi dữ liệu đang hiển thị trong app.
insert into public.branches (id, name, address, manager, phone, hours, opened, status, staff_count)
overriding system value
values
  (1, 'Quận 3 — Võ Văn Tần', '182 Võ Văn Tần, Phường 5, Quận 3, TP.HCM', 'Đặng Thị Hồng Nhung', '028 3930 1182', '06:30 – 21:00', '14/02/2021', 'open', 9),
  (2, 'Quận 1 — Lê Lợi', '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM', 'Trịnh Quốc Bảo', '028 3822 4567', '06:00 – 21:30', '03/06/2020', 'open', 11),
  (3, 'Tân Bình — Hoàng Việt', '76 Hoàng Việt, Phường 4, Tân Bình, TP.HCM', 'Lâm Thu Hà', '028 3811 9034', '06:30 – 20:30', '19/09/2021', 'open', 7),
  (4, 'Thủ Đức — Kha Vạn Cân', '210 Kha Vạn Cân, Linh Đông, Thủ Đức, TP.HCM', 'Ngô Minh Tuấn', '028 3897 2251', '06:30 – 21:00', '11/01/2022', 'open', 8),
  (5, 'Phú Nhuận — Phan Xích Long', '58 Phan Xích Long, Phường 2, Phú Nhuận, TP.HCM', 'Bùi Thị Kim Ngân', '028 3995 6673', '06:30 – 21:00', '27/03/2022', 'open', 8),
  (6, 'Quận 5 — Nguyễn Trãi', '320 Nguyễn Trãi, Phường 8, Quận 5, TP.HCM', 'Trần Gia Huy', '028 3855 4419', '06:00 – 20:30', '05/05/2022', 'open', 6),
  (7, 'Quận 7 — Nguyễn Thị Thập', '89 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM', 'Phạm Anh Thư', '028 3775 2298', '06:30 – 21:30', '18/08/2022', 'open', 9),
  (8, 'Quận 10 — Sư Vạn Hạnh', '412 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', 'Đỗ Văn Khiêm', '028 3863 7710', '06:00 – 20:30', '02/11/2022', 'closed', 5),
  (9, 'Bình Thạnh — Điện Biên Phủ', '155 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM', 'Vũ Thị Ngọc Lan', '028 3512 8834', '06:30 – 21:00', '20/01/2023', 'open', 7),
  (10, 'Gò Vấp — Quang Trung', '267 Quang Trung, Phường 10, Gò Vấp, TP.HCM', 'Nguyễn Hữu Phát', '028 3894 4456', '06:30 – 20:30', '14/04/2023', 'open', 6),
  (11, 'Bình Tân — Kinh Dương Vương', '520 Kinh Dương Vương, Bình Trị Đông, Bình Tân, TP.HCM', 'Lê Thị Mỹ Duyên', '028 3760 3321', '06:00 – 20:00', '09/07/2023', 'open', 6),
  (12, 'Quận 4 — Nguyễn Tất Thành', '98 Nguyễn Tất Thành, Phường 12, Quận 4, TP.HCM', 'Hoàng Đức Anh', '028 3943 2287', '06:30 – 20:30', '25/11/2023', 'closed', 4)
on conflict (id) do nothing;

-- Đảm bảo lần thêm chi nhánh tiếp theo trong app không đụng id 1..12 vừa seed ở trên.
select setval(pg_get_serial_sequence('public.branches', 'id'), 12, true);
