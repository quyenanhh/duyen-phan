import { supabase } from './supabaseClient.js';

// Gọi Edge Function "create-staff" (chạy phía server với service_role key) để Quản lý tạo
// tài khoản trực tiếp cho nhân viên mà KHÔNG bị văng khỏi phiên đăng nhập của chính mình —
// xem supabase/functions/create-staff/index.ts để biết vì sao cần tách ra server-side.
export async function createStaffAccount({ email, name, phone, branch, role }) {
  const { data, error } = await supabase.functions.invoke('create-staff', {
    body: { email, name, phone, branch, role },
  });

  if (error) {
    let message = error.message;
    if (error.context && typeof error.context.json === 'function') {
      try {
        const body = await error.context.json();
        if (body && body.error) message = body.error;
      } catch { /* giữ message mặc định */ }
    }
    throw new Error(message);
  }
  if (data && data.error) throw new Error(data.error);
  return data; // { email, tempPassword, name, phone, branch, role }
}
