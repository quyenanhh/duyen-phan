-- Duyên Phần — Đăng ký công khai với mã xác thực Admin (admin_token).
-- Chạy sau 019_remove_approval.sql. An toàn để chạy lại nhiều lần.
--
-- QUAN TRỌNG VỀ BẢO MẬT: trigger handle_new_user() (003_profiles.sql) trước đây đọc thẳng
-- role từ new.raw_user_meta_data — dữ liệu này do TRÌNH DUYỆT gửi lên lúc gọi
-- supabase.auth.signUp(), nên bất kỳ ai mở Console cũng có thể tự gọi
-- signUp({ options: { data: { role: 'Quản lý' } } }) để tự cấp quyền quản lý. File này thay
-- đổi cách xác định role: client CHỈ gửi admin_token (không gửi role); server so khớp token
-- đó với mã bí mật lưu trong bảng app_secrets (không cấp quyền đọc cho anon/authenticated,
-- không lộ ra bundle JS) rồi mới quyết định role thật — giống cách verify_manager_pin() đã
-- làm với mã PIN quản lý (014_manager_approval_pin.sql).

-- Nơi lưu các mã bí mật phía server. KHÔNG cấp SELECT cho anon/authenticated — chỉ hàm
-- SECURITY DEFINER bên dưới mới đọc được, nên token không thể bị dò qua API/PostgREST.
create table if not exists public.app_secrets (
  key text primary key,
  value text not null
);
revoke all on public.app_secrets from anon, authenticated;

insert into public.app_secrets (key, value)
values ('admin_signup_token', 'MAT_MA_ADMIN_123')
on conflict (key) do nothing;

-- Thêm role "customer" cho tài khoản đăng ký công khai không có admin_token hợp lệ.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('Quản lý', 'Nhân viên', 'Bếp', 'Thu ngân', 'customer'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text := new.raw_user_meta_data->>'admin_token';
  v_secret text;
  v_role text;
begin
  select value into v_secret from public.app_secrets where key = 'admin_signup_token';

  -- Role KHÔNG bao giờ đọc từ new.raw_user_meta_data->>'role' (client tự gửi, không tin
  -- được). Chỉ có admin_token được đọc, và chỉ dùng để so khớp ở đây, phía server.
  v_role := case
    when v_token is not null and v_secret is not null and v_token = v_secret then 'Quản lý'
    else 'customer'
  end;

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

-- Đổi mã admin_token bất kỳ lúc nào bằng:
--   update public.app_secrets set value = 'MA_MOI_CUA_BAN' where key = 'admin_signup_token';
