-- Duyên Phần — bảng "contact_messages" (tin nhắn từ form Liên hệ trên trang chủ).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null default '',
  email text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Khách trên trang chủ CHƯA đăng nhập vẫn phải gửi được form liên hệ — cho phép cả anon lẫn
-- authenticated ghi (insert), nhưng chỉ Quản lý mới đọc được nội dung tin nhắn (select).
drop policy if exists "Anyone can send contact message" on public.contact_messages;
create policy "Anyone can send contact message" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "Managers can view contact messages" on public.contact_messages;
create policy "Managers can view contact messages" on public.contact_messages
  for select to authenticated using (public.is_manager());
