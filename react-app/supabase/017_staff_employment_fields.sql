-- Duyên Phần — thêm "Ngày bắt đầu làm việc" và "Loại hợp đồng" vào hồ sơ nhân viên.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- An toàn để chạy lại nhiều lần.

alter table public.profiles add column if not exists start_date date;
alter table public.profiles add column if not exists contract_type text not null default 'Toàn thời gian';

alter table public.profiles drop constraint if exists profiles_contract_type_check;
alter table public.profiles add constraint profiles_contract_type_check
  check (contract_type in ('Toàn thời gian', 'Bán thời gian', 'Thời vụ'));
