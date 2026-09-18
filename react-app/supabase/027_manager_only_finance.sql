-- Duyên Phần — Thắt lại RLS: "expenses" (Chi phí) và "orders" (Đặt hàng & Giao hàng) chỉ
-- Quản lý mới đọc/ghi được, thay vì mọi tài khoản nội bộ (is_staff()) như cũ.
--
-- VÌ SAO CẦN SỬA: giao diện (Finance.jsx, Orders.jsx) vốn đã chỉ hiện cho Quản lý
-- (Dashboard.jsx chỉ render 2 màn này khi isManager), nhưng đó chỉ là ẩn/hiện ở React —
-- không phải bảo mật thật. RLS trước đây (023_customer_portal.sql) dùng is_staff() (role
-- khác 'customer') cho 2 bảng này, nghĩa là một tài khoản Nhân viên/Thu ngân/Bếp vẫn gọi
-- thẳng được Supabase REST API (qua console trình duyệt) để đọc toàn bộ doanh thu/chi phí —
-- đúng dữ liệu mà yêu cầu nghiệp vụ nói rõ "Staff CANNOT view overall business metrics,
-- revenues, financial reports". Sửa lại đúng ranh giới: chỉ is_manager().
--
-- Không đụng "restaurant_tables" / "table_orders" — 2 bảng đó vẫn cần chia sẻ giữa Nhân
-- viên/Thu ngân/Bếp (sơ đồ bàn, gọi món, thanh toán tại bàn, bếp xem món cần nấu).
--
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.

-- ============================================================================
-- expenses (Chi phí vận hành) — chỉ Quản lý
-- ============================================================================
drop policy if exists "Staff can view expenses" on public.expenses;
create policy "Managers can view expenses" on public.expenses
  for select to authenticated using (public.is_manager());

drop policy if exists "Staff can insert expenses" on public.expenses;
create policy "Managers can insert expenses" on public.expenses
  for insert to authenticated with check (public.is_manager());

drop policy if exists "Staff can update expenses" on public.expenses;
create policy "Managers can update expenses" on public.expenses
  for update to authenticated using (public.is_manager()) with check (public.is_manager());

drop policy if exists "Staff can delete expenses" on public.expenses;
create policy "Managers can delete expenses" on public.expenses
  for delete to authenticated using (public.is_manager());

-- Dọn luôn tên policy do 023_customer_portal.sql tạo lại (cùng tên "Staff can ... expenses")
-- phòng trường hợp đã chạy file đó sau bản gốc 005 — an toàn nếu không tồn tại.

-- ============================================================================
-- orders (Đặt hàng & Giao hàng — do nhân viên nhập tay, KHÁC "table_orders" tại bàn và
-- "customer_orders" khách tự đặt online) — chỉ Quản lý
-- ============================================================================
drop policy if exists "Staff can view orders" on public.orders;
create policy "Managers can view orders" on public.orders
  for select to authenticated using (public.is_manager());

drop policy if exists "Staff can insert orders" on public.orders;
create policy "Managers can insert orders" on public.orders
  for insert to authenticated with check (public.is_manager());

drop policy if exists "Staff can update orders" on public.orders;
create policy "Managers can update orders" on public.orders
  for update to authenticated using (public.is_manager()) with check (public.is_manager());

drop policy if exists "Staff can delete orders" on public.orders;
create policy "Managers can delete orders" on public.orders
  for delete to authenticated using (public.is_manager());
