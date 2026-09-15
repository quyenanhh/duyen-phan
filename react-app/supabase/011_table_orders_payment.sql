-- Duyên Phần — mở rộng "table_orders" để hỗ trợ Màn hình thanh toán (Phase 5) và
-- Báo cáo kết ca (Phase 6): giảm giá, phương thức thanh toán, thời điểm và người thu ngân.
-- Chạy sau 009_table_orders.sql. An toàn để chạy lại nhiều lần.

alter table public.table_orders add column if not exists discount numeric not null default 0;
alter table public.table_orders add column if not exists payment_method text not null default '';
alter table public.table_orders add column if not exists cashier_name text not null default '';
alter table public.table_orders add column if not exists paid_at timestamptz;
