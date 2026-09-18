-- Duyên Phần — Xoá dữ liệu mẫu (seed) khỏi "expenses" và "orders" để các báo cáo (Hiệu suất
-- chi nhánh, Tổng quan, Doanh thu & Chi tiêu) phản ánh đúng hoạt động thật, không còn bị lẫn
-- 10 khoản chi mẫu (005_expenses.sql) và 10 đơn giao hàng mẫu (006_orders.sql).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.
--
-- KHÔNG đụng tới menu_items hay restaurant_tables — đó là danh mục thật (thực đơn, sơ đồ
-- bàn) đang được dùng, không phải dữ liệu mẫu để xoá.

delete from public.expenses where id between 1 and 10;
delete from public.orders where id between 1 and 10;

-- Đưa lại số thứ tự (identity sequence) về đầu nếu bảng đang trống, để đơn/chi phí thật đầu
-- tiên bạn tạo bắt đầu từ id = 1 thay vì nhảy lên 11.
do $$
begin
  if not exists (select 1 from public.expenses) then
    perform setval(pg_get_serial_sequence('public.expenses', 'id'), 1, false);
  end if;
  if not exists (select 1 from public.orders) then
    perform setval(pg_get_serial_sequence('public.orders', 'id'), 1, false);
  end if;
end $$;
