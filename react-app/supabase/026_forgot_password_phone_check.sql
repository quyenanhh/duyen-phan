-- Duyên Phần — RPC kiểm tra khớp email + số điện thoại trước khi cho gửi email đặt lại mật
-- khẩu, thêm một lớp xác minh đúng chủ tài khoản (khách hàng phải biết cả email lẫn SĐT đã
-- đăng ký, không chỉ email). Chỉ trả về true/false, KHÔNG lộ thêm bất kỳ thông tin nào khác
-- của hồ sơ (không phải cách để dò xem một email có tồn tại hay không).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.

create or replace function public.email_phone_match(p_email text, p_phone text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where lower(email) = lower(trim(p_email))
      and phone = trim(p_phone)
      and phone <> ''
  );
$$;

grant execute on function public.email_phone_match(text, text) to anon, authenticated;
