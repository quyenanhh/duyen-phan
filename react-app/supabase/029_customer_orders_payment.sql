-- Duyên Phần — Thêm bước thanh toán cho đơn đặt món online (customer_orders): khách chọn
-- phương thức thanh toán lúc đặt, xem trạng thái thanh toán ở "Đơn của tôi". Vì free tier
-- không dùng cổng thanh toán thật (Stripe/VNPay... đều mất phí hoặc cần pháp nhân doanh
-- nghiệp), "chuyen_khoan"/"the" chỉ lưu trạng thái do NHÂN VIÊN xác nhận thủ công khi nhận
-- được tiền — không có tích hợp cổng thanh toán thật, đúng tinh thần đồ án miễn phí.
-- Cách dùng: mở Supabase Dashboard -> SQL Editor -> New query -> dán toàn bộ file này -> Run.
-- Cần đã chạy 023_customer_portal.sql trước file này. An toàn để chạy lại nhiều lần.

alter table public.customer_orders
  add column if not exists payment_method text not null default 'tien_mat'
    check (payment_method in ('tien_mat', 'chuyen_khoan', 'the'));

alter table public.customer_orders
  add column if not exists payment_status text not null default 'chua_thanh_toan'
    check (payment_status in ('chua_thanh_toan', 'da_thanh_toan'));

-- Đơn "mang_ve" (giao hàng) trả tiền mặt mặc định thu khi giao — chỉ đánh dấu "đã thanh
-- toán" khi nhân viên/thu ngân xác nhận (is_staff()), khách không tự đánh dấu đơn của mình
-- đã trả tiền để tránh gian lận. Khách chỉ chọn được payment_method lúc tạo đơn.
create or replace function public.enforce_customer_order_payment_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    new.payment_status := old.payment_status;
  end if;
  return new;
end;
$$;

drop trigger if exists before_customer_order_payment_update on public.customer_orders;
create trigger before_customer_order_payment_update
  before update on public.customer_orders
  for each row execute function public.enforce_customer_order_payment_rules();
