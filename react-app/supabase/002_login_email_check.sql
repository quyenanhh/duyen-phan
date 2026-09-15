-- Duyên Phần — hàm kiểm tra email đã có tài khoản đăng nhập (Supabase Auth) hay chưa.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần (create or replace).
--
-- Vì sao cần hàm này: supabase.auth.signInWithPassword() cố tình trả về CÙNG một lỗi
-- "Invalid login credentials" cho cả hai trường hợp sai mật khẩu và email chưa có
-- tài khoản (để chống dò email hàng loạt). Ứng dụng cần phân biệt hai thông báo này,
-- nên khi đăng nhập thất bại, app gọi hàm dưới đây (qua supabase.rpc) để biết email
-- đã tồn tại tài khoản hay chưa, từ đó hiển thị đúng thông báo. Hàm chỉ trả về true/false,
-- không lộ thêm thông tin nào khác về tài khoản.

create or replace function public.email_has_account(p_email text)
returns boolean
language sql
security definer
set search_path = auth, public
as $$
  select exists (
    select 1 from auth.users
    where lower(email) = lower(p_email)
  );
$$;

revoke all on function public.email_has_account(text) from public;
grant execute on function public.email_has_account(text) to anon, authenticated;
