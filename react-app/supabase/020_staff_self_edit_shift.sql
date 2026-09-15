-- Duyên Phần — cho phép nhân viên tự sửa ca làm của chính mình (cột "week").
-- Trước đây enforce_profile_update_rules() khoá cột week lại như các trường chỉ quản lý mới
-- được sửa (vai trò, duyệt, lương...) — nay bỏ khoá riêng cho week, các trường còn lại vẫn
-- chỉ quản lý mới được đổi. Chạy sau 003_profiles.sql. An toàn để chạy lại nhiều lần.

create or replace function public.enforce_profile_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_manager() then
    new.role := old.role;
    new.approved := old.approved;
    new.branch := old.branch;
    new.status := old.status;
    new.shifts := old.shifts;
    new.salary := old.salary;
    new.checked_in := old.checked_in;
  end if;
  return new;
end;
$$;
