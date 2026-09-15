-- Duyên Phần — thêm vai trò "Bếp" (tách riêng khỏi "Nhân viên"/Phục vụ) để dùng cho
-- Màn hình bếp (KDS) ở Phase 4. Chạy sau 003_profiles.sql.
-- An toàn để chạy lại nhiều lần.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('Quản lý', 'Nhân viên', 'Bếp', 'Thu ngân'));
