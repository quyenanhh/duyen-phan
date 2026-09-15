-- Duyên Phần — bảng "profiles" (hồ sơ nhân sự gắn với tài khoản Supabase Auth thật).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.
--
-- Vì sao cần bảng này: Supabase Auth (auth.users) chỉ lưu email/mật khẩu, không có chỗ
-- lưu vai trò (Quản lý/Nhân viên/Thu ngân), chi nhánh, trạng thái duyệt... Bảng profiles
-- lưu các thông tin đó, gắn 1-1 với auth.users qua cột id.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  phone text not null default '',
  branch text not null default '',
  role text not null default 'Nhân viên' check (role in ('Quản lý', 'Nhân viên', 'Thu ngân')),
  approved boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused')),
  shifts integer not null default 0,
  salary numeric not null default 0,
  checked_in boolean not null default false,
  week jsonb not null default '["off","off","off","off","off","off","off"]'::jsonb,
  cccd text not null default '',
  dob text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Kiểm tra người gọi hiện tại có phải Quản lý đã được duyệt không — dùng trong các policy
-- bên dưới. Viết security definer + set search_path để tránh đệ quy RLS khi hàm tự
-- truy vấn lại bảng profiles.
create or replace function public.is_manager()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'Quản lý' and approved = true
  );
$$;
grant execute on function public.is_manager() to anon, authenticated;

-- Khi có tài khoản Supabase Auth mới (người dùng tự đăng ký ở trang Đăng ký), tự tạo
-- dòng profile tương ứng, đọc họ tên/điện thoại/chi nhánh/vai trò từ metadata gửi kèm
-- lúc supabase.auth.signUp(). Vai trò Quản lý được duyệt (approved) ngay; Nhân viên/Thu
-- ngân phải chờ quản lý duyệt trước khi đăng nhập được vào hệ thống.
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
    v_role = 'Quản lý'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Chặn tự nâng quyền: người không phải Quản lý không được tự đổi vai trò, trạng thái
-- duyệt, chi nhánh, hoặc các trường thuộc quyền quản lý (lương, ca làm, trạng thái làm
-- việc...) của chính hồ sơ mình. Họ vẫn tự sửa được thông tin cá nhân (tên, SĐT, CCCD...).
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
    new.week := old.week;
  end if;
  return new;
end;
$$;

drop trigger if exists before_profile_update on public.profiles;
create trigger before_profile_update
  before update on public.profiles
  for each row execute function public.enforce_profile_update_rules();

-- Xem: tự xem hồ sơ mình, hoặc Quản lý xem tất cả.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (id = auth.uid() or public.is_manager());

-- Sửa: tự sửa hồ sơ mình (giới hạn trường ở trigger phía trên), hoặc Quản lý sửa tất cả.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (id = auth.uid() or public.is_manager())
  with check (id = auth.uid() or public.is_manager());

-- Xoá: chỉ Quản lý được xoá hồ sơ nhân viên.
drop policy if exists "Managers can delete profiles" on public.profiles;
create policy "Managers can delete profiles" on public.profiles
  for delete using (public.is_manager());

-- Tạo hồ sơ cho các tài khoản Supabase Auth đã có TRƯỚC khi bảng này tồn tại (ví dụ tài
-- khoản test tạo tay trong Dashboard) — mặc định gán vai trò Quản lý và duyệt sẵn, vì đây
-- thường là tài khoản của người đang thiết lập hệ thống. An toàn khi chạy lại nhiều lần.
insert into public.profiles (id, email, full_name, role, approved)
select u.id, u.email, split_part(u.email, '@', 1), 'Quản lý', true
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
