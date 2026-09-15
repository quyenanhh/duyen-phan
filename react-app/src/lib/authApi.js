import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

export async function signInWithPassword(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, metadata) {
  return supabase.auth.signUp({ email, password, options: { data: metadata } });
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

export async function signOut() {
  if (!supabaseEnabled) return;
  await supabase.auth.signOut();
}

// Supabase Auth gộp chung lỗi "Invalid login credentials" cho cả sai mật khẩu
// lẫn email chưa có tài khoản (chống dò email). Hàm RPC email_has_account
// (xem supabase/002_login_email_check.sql) cho phép phân biệt hai trường hợp
// đó ở phía app mà không cần lộ service_role key ra trình duyệt.
export async function checkEmailExists(email) {
  const { data, error } = await supabase.rpc('email_has_account', { p_email: email });
  if (error) throw error;
  return Boolean(data);
}
