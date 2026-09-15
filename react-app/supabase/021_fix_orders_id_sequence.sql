-- Duyên Phần — đồng bộ lại sequence tự tăng của orders.id.
-- Phát hiện khi test tính năng "Tạo đơn hàng mới": insert báo lỗi 23505 (duplicate key
-- violates unique constraint "orders_pkey"). Nguyên nhân: 006_orders.sql seed dữ liệu bằng
-- "overriding system value" (ghi đè id cụ thể 1..10) rồi setval sequence về 10 — nhưng nếu
-- sau đó có thêm dòng được chèn bằng id chỉ định tay (không qua sequence), sequence sẽ tụt
-- lại sau max(id) thật, khiến lần insert tự động tiếp theo sinh ra id đã tồn tại.
-- An toàn để chạy lại nhiều lần.

select setval(
  pg_get_serial_sequence('public.orders', 'id'),
  greatest(1, coalesce((select max(id) from public.orders), 0)),
  true
);
