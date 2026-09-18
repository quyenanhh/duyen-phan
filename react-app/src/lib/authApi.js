import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

export async function signInWithPassword(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Chuyển hướng cả trang sang Google rồi quay lại đúng origin hiện tại — cần bật
// Google provider trong Supabase Dashboard (Authentication > Providers) trước,
// nếu chưa bật thì Supabase trả lỗi "Unsupported provider" ở bước này.
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
}

// Vì đăng nhập Google điều hướng ra khỏi trang rồi quay lại (không phải gọi API
// trong lúc app vẫn mở), App.jsx cần hai hàm này để "nhận lại" phiên đăng nhập
// đã có sẵn khi trang tải lại, thay vì chỉ trông chờ vào kết quả của submitLogin().
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signUp(email, password, metadata) {
  return supabase.auth.signUp({ email, password, options: { data: metadata } });
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

// Gửi email đặt lại mật khẩu (Supabase Auth có sẵn, miễn phí). Link trong email đưa người
// dùng quay lại đúng redirectTo kèm một phiên đăng nhập tạm "recovery" — App.jsx lắng nghe sự
// kiện PASSWORD_RECOVERY qua onAuthStateChange để đưa thẳng vào màn "Đổi mật khẩu mới".
// Lưu ý: chỉ có đường email. Gửi mã qua SMS cần một nhà cung cấp SMS trả phí (Twilio...),
// ngoài phạm vi miễn phí của dự án nên chưa làm.
export async function resetPasswordForEmail(email, redirectTo) {
  return supabase.auth.resetPasswordForEmail(email, { redirectTo });
}

// Điều kiện xác minh trước khi cho gửi email đặt lại mật khẩu: phải đúng cả email lẫn số điện
// thoại đã đăng ký (xem supabase/026_forgot_password_phone_check.sql). RPC chỉ trả về true/false.
export async function checkEmailPhoneMatch(email, phone) {
  const { data, error } = await supabase.rpc('email_phone_match', { p_email: email, p_phone: phone });
  if (error) throw error;
  return Boolean(data);
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
