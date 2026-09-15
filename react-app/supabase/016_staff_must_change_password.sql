-- Duyên Phần — cột "must_change_password" trên bảng profiles.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.
--
-- Dùng khi Quản lý tạo tài khoản trực tiếp cho nhân viên (xem Edge Function
-- "create-staff"): tài khoản mới có mật khẩu tạm thời do hệ thống random ra, và cột
-- này được bật = true để bắt buộc nhân viên đổi mật khẩu ngay lần đăng nhập đầu tiên
-- trước khi được vào hệ thống chính (xử lý ở App.jsx: submitLogin / submitNewPassword).

alter table public.profiles add column if not exists must_change_password boolean not null default false;
