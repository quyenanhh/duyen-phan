-- Duyên Phần — Sửa lỗi: tài khoản nhân viên do Quản lý tạo (Edge Function "create-staff")
-- bị lưu nhầm role = 'customer' thay vì Nhân viên/Thu ngân/Bếp.
--
-- NGUYÊN NHÂN: 022_signup_admin_token.sql viết lại handle_new_user() để chỉ xét admin_token
-- (chặn client tự gán role qua console) nhưng vô tình bỏ luôn việc đọc "role" mà Edge
-- Function create-staff gửi trong user_metadata — mọi tài khoản tạo qua đó đều rơi vào
-- nhánh else -> 'customer'.
--
-- CÁCH SỬA: KHÔNG cho handle_new_user() tin field "role" từ metadata (giữ nguyên chỗ vá bảo
-- mật của 022 — nếu tin field này, ai mở Console gọi thẳng
-- supabase.auth.signUp({options:{data:{role:'Quản lý'}}}) vẫn tự cấp quyền được, y hệt lỗ
-- hổng 022 đã vá). Thay vào đó, cho phép Edge Function (chạy bằng service_role key, không
-- lộ ra trình duyệt) SỬA LẠI role/branch ngay sau khi tạo tài khoản — cần nới
-- enforce_profile_update_rules() để không tự khoá field role/branch lại với các lệnh update
-- đến từ service_role.
--
-- Cách dùng: dán vào Supabase SQL Editor -> Run. SAU ĐÓ vào Supabase Dashboard -> Edge
-- Functions -> create-staff -> deploy lại bản mới của
-- supabase/functions/create-staff/index.ts (đã thêm "role" vào update cuối) thì tài khoản
-- nhân viên tạo TỪ NAY MỚI đúng role. An toàn để chạy lại nhiều lần.

create or replace function public.enforce_profile_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- service_role (chỉ Edge Function phía server dùng, key không lộ ra trình duyệt) được
  -- toàn quyền sửa mọi field — dùng cho luồng Quản lý tạo tài khoản nhân viên.
  if auth.role() = 'service_role' then
    return new;
  end if;
  if not public.is_manager() then
    new.role := old.role;
    new.approved := old.approved;
    new.branch := old.branch;
    new.status := old.status;
    new.shifts := old.shifts;
    new.salary := old.salary;
    new.checked_in := old.checked_in;
    new.week := old.week;
  end if;
  return new;
end;
$$;
