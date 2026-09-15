-- Duyên Phần — bỏ bước duyệt tài khoản khi đăng ký: mọi tài khoản mới đều approved ngay,
-- không phân biệt vai trò. Chạy sau 003_profiles.sql. An toàn để chạy lại nhiều lần.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'Nhân viên');
begin
  insert into public.profiles (id, email, full_name, phone, branch, role, approved)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'branch', ''),
    v_role,
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Các hồ sơ đang ở trạng thái chờ duyệt từ trước khi bỏ bước này: duyệt luôn để không ai bị
-- kẹt ngoài hệ thống vì một bước không còn tồn tại.
update public.profiles set approved = true where approved = false;
