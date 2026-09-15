-- Duyên Phần — bảng "menu_items" (Thực đơn), thí điểm tích hợp Supabase.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần chạy 003_profiles.sql trước file này.

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  price numeric not null default 0,
  status text not null default 'available' check (status in ('available', 'soldout')),
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

-- Ai cũng xem được thực đơn (khách vãng lai không cần đăng nhập); chỉ tài khoản đã đăng
-- nhập (nhân viên/quản lý) mới được thêm/sửa/xoá món.
drop policy if exists "Anyone can view menu" on public.menu_items;
create policy "Anyone can view menu" on public.menu_items
  for select using (true);

drop policy if exists "Staff can insert menu items" on public.menu_items;
create policy "Staff can insert menu items" on public.menu_items
  for insert to authenticated with check (true);

drop policy if exists "Staff can update menu items" on public.menu_items;
create policy "Staff can update menu items" on public.menu_items
  for update to authenticated using (true) with check (true);

drop policy if exists "Staff can delete menu items" on public.menu_items;
create policy "Staff can delete menu items" on public.menu_items
  for delete to authenticated using (true);

-- Seed dữ liệu mẫu — giống hệt danh sách món đang có trong data.js.
insert into public.menu_items (id, name, category, price, status, description)
overriding system value
values
  (1, 'Cơm phần đậu hũ sả ớt', 'Cơm phần', 45000, 'available', 'Cơm trắng, đậu hũ chiên sả ớt, rau luộc và canh ngày.'),
  (2, 'Cơm phần nấm kho tiêu', 'Cơm phần', 48000, 'available', 'Nấm bào ngư kho tiêu, cơm trắng, dưa leo và canh ngày.'),
  (3, 'Cơm phần chả giò chay', 'Cơm phần', 50000, 'available', 'Chả giò chay chiên giòn, bún, rau sống, nước chấm chay.'),
  (4, 'Đậu hũ sốt cà chua', 'Món mặn chay', 38000, 'available', 'Đậu hũ non sốt cà chua, dùng kèm cơm hoặc bún.'),
  (5, 'Nấm kho tộ', 'Món mặn chay', 42000, 'available', 'Nấm đùi gà kho tộ đậm vị, ăn kèm cơm trắng.'),
  (6, 'Rau củ xào thập cẩm', 'Món mặn chay', 36000, 'soldout', 'Bông cải, cà rốt, nấm, đậu que xào tỏi.'),
  (7, 'Canh chua chay', 'Canh & súp', 25000, 'available', 'Canh chua dứa, đậu bắp, cà chua, giá đỗ.'),
  (8, 'Canh bí đỏ nấu đậu phộng', 'Canh & súp', 22000, 'available', 'Bí đỏ hầm mềm cùng đậu phộng, nêm nhạt.'),
  (9, 'Súp nấm bốn mùa', 'Canh & súp', 28000, 'soldout', 'Súp sánh nhẹ với bốn loại nấm và bắp non.'),
  (10, 'Chè đậu xanh nước cốt dừa', 'Tráng miệng', 18000, 'available', 'Chè đậu xanh đánh nhuyễn, nước cốt dừa béo nhẹ.'),
  (11, 'Rau câu lá dứa', 'Tráng miệng', 15000, 'available', 'Rau câu dẻo vị lá dứa, ăn kèm nước cốt dừa.'),
  (12, 'Trà đào cam sả', 'Nước uống', 25000, 'available', 'Trà đào thanh mát cùng cam và sả tươi.'),
  (13, 'Nước sâm bí đao', 'Nước uống', 15000, 'available', 'Nước sâm mát gan, nấu từ bí đao và mía lau.'),
  (14, 'Sữa hạt sen', 'Nước uống', 20000, 'soldout', 'Sữa hạt sen nguyên chất, không đường tinh luyện.')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.menu_items', 'id'), 14, true);
