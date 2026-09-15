-- Duyên Phần — mã PIN duyệt của quản lý, dùng để xác nhận huỷ món/điều chỉnh hoá đơn tại quầy thu ngân.
-- Chạy sau 003_profiles.sql. An toàn để chạy lại nhiều lần.

alter table public.profiles add column if not exists approval_pin text not null default '';

-- Kiểm tra mã PIN duyệt có khớp với một quản lý đã duyệt nào đó hay không, KHÔNG lộ dữ liệu
-- hồ sơ khác cho người gọi — cần SECURITY DEFINER vì RLS của bảng profiles chỉ cho phép
-- người dùng tự xem hồ sơ của mình (hoặc quản lý xem tất cả), nên Nhân viên/Thu ngân sẽ
-- không tự đọc được approval_pin của quản lý qua truy vấn thường.
create or replace function public.verify_manager_pin(p_pin text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where role = 'Quản lý' and approved = true and approval_pin = p_pin and p_pin <> ''
  );
$$;

revoke all on function public.verify_manager_pin(text) from public;
grant execute on function public.verify_manager_pin(text) to authenticated;
