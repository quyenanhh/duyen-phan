import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;

if (!supabaseEnabled) {
  console.warn(
    '[Supabase] Chưa cấu hình VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY trong .env.local — ' +
    'ứng dụng đang chạy với dữ liệu mẫu cục bộ (data.js). Xem HUONG_DAN_SUPABASE.md để kết nối Supabase thật.'
  );
}
