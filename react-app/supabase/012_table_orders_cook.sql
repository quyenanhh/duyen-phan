-- Duyên Phần — thêm "cook_name" vào table_orders để tính KPI hiệu suất Bếp
-- (số order đã hoàn thành do đầu bếp nào đánh dấu xong). Chạy sau 009_table_orders.sql.
-- An toàn để chạy lại nhiều lần.

alter table public.table_orders add column if not exists cook_name text not null default '';
