-- Duyên Phần — thêm cột "visible" vào menu_items: cho phép quản lý ẩn một món khỏi
-- trang Thực đơn công khai (/menu) mà không cần xoá hẳn khỏi hệ thống (ví dụ món
-- đang thử nghiệm, món theo mùa tạm ngưng). Khác với "status" (còn hàng/hết hàng,
-- vẫn hiển thị kèm nhãn), "visible=false" nghĩa là ẩn hẳn khỏi trang khách xem.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần. Cần đã chạy 004_menu_items.sql trước file này.

alter table public.menu_items add column if not exists visible boolean not null default true;
