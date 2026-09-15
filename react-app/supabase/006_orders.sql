-- Duyên Phần — bảng "orders" (Đơn hàng), thí điểm tích hợp Supabase.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần chạy 003_profiles.sql trước file này.
--
-- Đơn giản hoá: danh sách món trong đơn (items) lưu dạng jsonb thay vì tách bảng
-- order_items riêng — đủ dùng cho quy mô hiện tại, tránh phức tạp hoá không cần thiết.

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  code text not null unique,
  branch text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'delivering', 'completed', 'cancelled', 'late')),
  total numeric not null default 0,
  order_time text not null,
  customer text not null,
  phone text not null default '',
  address text not null default '',
  payment text not null default '',
  items jsonb not null default '[]'::jsonb,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Staff can view orders" on public.orders;
create policy "Staff can view orders" on public.orders
  for select to authenticated using (true);

drop policy if exists "Staff can insert orders" on public.orders;
create policy "Staff can insert orders" on public.orders
  for insert to authenticated with check (true);

drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders" on public.orders
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete orders" on public.orders;
create policy "Staff can delete orders" on public.orders
  for delete to authenticated using (true);

-- Seed dữ liệu mẫu — giống hệt danh sách đang có trong data.js.
insert into public.orders (id, code, branch, status, total, order_time, customer, phone, address, payment, items, note)
overriding system value
values
  (1, 'DP-1042', 'Quận 3 — Võ Văn Tần', 'delivering', 385000, '14:20 03/09/2026', 'Nguyễn Thảo Vy', '090 552 3341', '12 Bà Huyện Thanh Quan, Quận 3, TP.HCM', 'Ví điện tử', '[["Cơm phần đậu hũ sả ớt",2,45000],["Trà đào cam sả",2,25000],["Chè đậu xanh nước cốt dừa",3,18000]]', 'Giao trước 14:45, để đồ ăn trước cổng bảo vệ.'),
  (2, 'DP-1041', 'Quận 1 — Lê Lợi', 'completed', 1250000, '13:52 03/09/2026', 'Công ty TNHH An Phát', '028 3822 9910', '77 Nguyễn Huệ, Quận 1, TP.HCM', 'Chuyển khoản', '[["Cơm phần chả giò chay",15,50000],["Canh chua chay",15,25000],["Nước sâm bí đao",15,15000]]', 'Đặt cơm văn phòng, xuất hoá đơn công ty.'),
  (3, 'DP-1040', 'Tân Bình — Hoàng Việt', 'processing', 96000, '13:41 03/09/2026', 'Lê Minh Khoa', '093 118 4402', '45/2 Hoàng Việt, Tân Bình, TP.HCM', 'Tiền mặt', '[["Cơm phần nấm kho tiêu",2,48000]]', ''),
  (4, 'DP-1039', 'Quận 1 — Lê Lợi', 'cancelled', 210000, '13:02 03/09/2026', 'Phạm Hoài An', '097 774 2210', '9 Pasteur, Quận 1, TP.HCM', 'Ví điện tử', '[["Đậu hũ sốt cà chua",3,38000],["Rau câu lá dứa",6,15000]]', 'Khách huỷ do đổi địa chỉ giao.'),
  (5, 'DP-1038', 'Thủ Đức — Kha Vạn Cân', 'completed', 540000, '12:47 03/09/2026', 'Trường Mầm non Hoa Sen', '028 3897 5561', '30 Kha Vạn Cân, Thủ Đức, TP.HCM', 'Chuyển khoản', '[["Cơm phần đậu hũ sả ớt",10,45000],["Sữa hạt sen",6,20000]]', 'Giao trước 11h trưa cho bữa ăn học sinh.'),
  (6, 'DP-1037', 'Quận 3 — Võ Văn Tần', 'late', 87000, '12:20 03/09/2026', 'Đặng Quốc Việt', '096 220 8871', '182/5 Võ Văn Tần, Quận 3, TP.HCM', 'Tiền mặt', '[["Nấm kho tộ",2,42000]]', 'Đơn giao trễ hơn 30 phút so với dự kiến.'),
  (7, 'DP-1036', 'Phú Nhuận — Phan Xích Long', 'pending', 164000, '11:58 03/09/2026', 'Vũ Thị Hồng Ngọc', '094 663 1298', '58/3 Phan Xích Long, Phú Nhuận, TP.HCM', 'Ví điện tử', '[["Cơm phần chả giò chay",2,50000],["Canh bí đỏ nấu đậu phộng",2,22000],["Nước sâm bí đao",1,15000]]', 'Chờ chi nhánh xác nhận đơn.'),
  (8, 'DP-1035', 'Quận 7 — Nguyễn Thị Thập', 'completed', 312000, '11:30 03/09/2026', 'Bùi Anh Tuấn', '098 441 0032', '89/4 Nguyễn Thị Thập, Quận 7, TP.HCM', 'Tiền mặt', '[["Cơm phần đậu hũ sả ớt",4,45000],["Trà đào cam sả",5,25000]]', ''),
  (9, 'DP-1034', 'Quận 5 — Nguyễn Trãi', 'delivering', 198000, '11:05 03/09/2026', 'Trịnh Bảo Châu', '091 887 6623', '320/1 Nguyễn Trãi, Quận 5, TP.HCM', 'Ví điện tử', '[["Rau củ xào thập cẩm",3,36000],["Rau câu lá dứa",6,15000]]', 'Gọi trước khi giao, chung cư không thang máy.'),
  (10, 'DP-1033', 'Bình Thạnh — Điện Biên Phủ', 'completed', 276000, '10:40 03/09/2026', 'Nguyễn Gia Bảo', '090 331 5567', '155/8 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Chuyển khoản', '[["Cơm phần nấm kho tiêu",4,48000],["Súp nấm bốn mùa",3,28000]]', '')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.orders', 'id'), 10, true);
