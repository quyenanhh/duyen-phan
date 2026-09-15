import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id, code: row.code, discountType: row.discount_type, discountValue: Number(row.discount_value),
    active: row.active, maxUses: row.max_uses, usedCount: row.used_count
  };
}

// Trả về null nếu không tìm thấy mã, hoặc { voucher, error } nếu tìm thấy nhưng không hợp lệ để dùng.
export async function findVoucherByCode(code) {
  const { data, error } = await supabase.from('vouchers').select('*').ilike('code', code.trim()).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

// Đọc rồi ghi lại số lần dùng — quy mô nhỏ nên chấp nhận rủi ro race hiếm gặp thay vì cần RPC riêng.
export async function incrementVoucherUse(id) {
  const { data: v, error: readErr } = await supabase.from('vouchers').select('used_count').eq('id', id).single();
  if (readErr) throw readErr;
  const { error } = await supabase.from('vouchers').update({ used_count: v.used_count + 1 }).eq('id', id);
  if (error) throw error;
}
