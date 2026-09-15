-- Duyên Phần — ảnh đại diện nhân viên (upload thật qua Supabase Storage).
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.

-- Bucket lưu ảnh đại diện — công khai đọc (ảnh đại diện không nhạy cảm, hiển thị ngay trên
-- thẻ nhân viên trong khu quản trị), chỉ tài khoản đã đăng nhập mới tải lên/sửa/xoá được.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public can view avatars" on storage.objects;
create policy "Public can view avatars" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Staff can upload avatars" on storage.objects;
create policy "Staff can upload avatars" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars');

drop policy if exists "Staff can update avatars" on storage.objects;
create policy "Staff can update avatars" on storage.objects
  for update to authenticated using (bucket_id = 'avatars');

drop policy if exists "Staff can delete avatars" on storage.objects;
create policy "Staff can delete avatars" on storage.objects
  for delete to authenticated using (bucket_id = 'avatars');

-- Cột lưu URL ảnh đại diện trên hồ sơ nhân viên.
alter table public.profiles add column if not exists avatar_url text;
