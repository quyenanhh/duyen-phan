-- Duyên Phần — Cơ chế RIÊNG BIỆT, có bảo vệ, để tạo thêm tài khoản Quản lý ('Quản lý').
--
-- VÌ SAO KHÔNG CÓ FORM ĐĂNG KÝ QUẢN LÝ TRÊN WEB: web nội bộ (5174) tuyệt đối không có bất
-- kỳ hình thức tự đăng ký nào, kể cả cho Quản lý — để tránh người ngoài tự tạo tài khoản
-- Quản lý phá hệ thống. Việc tạo thêm Quản lý phải đi qua 2 bước, cả hai đều yêu cầu quyền
-- truy cập trực tiếp vào Supabase Dashboard (không lộ ra web công khai):
--   (1) Supabase Dashboard -> Authentication -> Users -> Add user (tạo tài khoản Auth thật
--       bằng email/mật khẩu, KHÔNG qua trang web nào cả).
--   (2) Chạy hàm bên dưới trong SQL Editor để gán role = 'Quản lý' cho đúng email đó.
--
-- Hàm public.admin_promote_to_manager() CHỈ có thể gọi được từ SQL Editor (chạy với quyền
-- chủ sở hữu database) — KHÔNG grant execute cho anon/authenticated, nên không thể gọi được
-- từ trình duyệt/API công khai dù có biết tên hàm.
--
-- Cách dùng: sau khi đã tạo user ở bước (1), chạy:
--   select public.admin_promote_to_manager('email-quan-ly-moi@gmail.com');
--
-- An toàn để chạy lại nhiều lần (idempotent).

create or replace function public.admin_promote_to_manager(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_existing_role text;
begin
  select id into v_user_id from auth.users where lower(email) = lower(trim(p_email));
  if v_user_id is null then
    return 'Không tìm thấy tài khoản Auth với email này — tạo trước ở Dashboard -> Authentication -> Users -> Add user.';
  end if;

  select role into v_existing_role from public.profiles where id = v_user_id;

  if v_existing_role is null then
    insert into public.profiles (id, email, full_name, role, approved)
    values (v_user_id, p_email, split_part(p_email, '@', 1), 'Quản lý', true);
    return 'Đã tạo hồ sơ mới và gán vai trò Quản lý cho ' || p_email;
  end if;

  if v_existing_role = 'customer' then
    return 'Email này đang là tài khoản khách hàng — không tự động chuyển thành Quản lý. Xoá hồ sơ khách hàng đó trước nếu chắc chắn muốn dùng lại email này cho Quản lý.';
  end if;

  update public.profiles set role = 'Quản lý', approved = true where id = v_user_id;
  return 'Đã cập nhật vai trò Quản lý cho ' || p_email || ' (trước đó là ' || v_existing_role || ').';
end;
$$;

-- Cố tình KHÔNG có dòng "grant execute ... to anon, authenticated" — chỉ chủ sở hữu database
-- (người có quyền vào SQL Editor) mới gọi được hàm này.
