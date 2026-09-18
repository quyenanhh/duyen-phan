// Duyên Phần — Edge Function "create-staff".
//
// Vì sao cần function này: nếu Quản lý gọi supabase.auth.signUp() thẳng từ trình duyệt để
// tạo tài khoản cho nhân viên, Supabase sẽ tự đăng nhập (gán session) cho tài khoản MỚI đó
// ngay trên trình duyệt, làm Quản lý bị văng ra khỏi phiên đăng nhập của chính mình.
//
// Cách giải quyết đúng: tạo tài khoản bằng Supabase Admin API (service_role key), chạy ở
// phía server (Edge Function), không đụng đến session của Quản lý ở phía client. Function
// này: (1) xác minh người gọi là Quản lý đã được duyệt, (2) random một mật khẩu tạm thời,
// (3) tạo tài khoản Auth mới qua admin.createUser (kích hoạt trigger handle_new_user tự tạo
// dòng profiles), (4) duyệt sẵn hồ sơ đó và bật cờ must_change_password, (5) trả email + mật
// khẩu tạm thời về cho Quản lý để copy đưa lại cho nhân viên.
//
// Cách triển khai: mở Supabase Dashboard -> Edge Functions -> Deploy a new function ->
// đặt tên "create-staff" -> dán toàn bộ nội dung file này -> Deploy. Supabase tự cấp sẵn
// các biến môi trường SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY cho mọi
// Edge Function, không cần cấu hình thêm gì.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_ROLES = ['Quản lý', 'Nhân viên', 'Bếp', 'Thu ngân'];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function randomTempPassword() {
  // Bỏ các ký tự dễ nhầm lẫn khi đọc/gõ lại: 0/O, 1/l/I.
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let pass = '';
  for (const b of bytes) pass += chars[b % chars.length];
  return pass;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Phương thức không được hỗ trợ.' }, 405);

  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '');
  if (!jwt) return json({ error: 'Thiếu thông tin đăng nhập.' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Xác minh người gọi có phải Quản lý đã được duyệt hay không.
  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userData?.user) return json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' }, 401);

  const { data: callerProfile } = await admin
    .from('profiles')
    .select('role, approved')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (!callerProfile || callerProfile.role !== 'Quản lý' || !callerProfile.approved) {
    return json({ error: 'Chỉ Quản lý mới được tạo tài khoản nhân viên.' }, 403);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400);
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const name = String(body?.name || '').trim();
  const phone = String(body?.phone || '').trim();
  const branch = String(body?.branch || '').trim();
  const role = String(body?.role || '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Email không hợp lệ.' }, 400);
  if (!name) return json({ error: 'Nhập họ và tên.' }, 400);
  if (!branch) return json({ error: 'Chọn chi nhánh phụ trách.' }, 400);
  if (!ALLOWED_ROLES.includes(role)) return json({ error: 'Vai trò không hợp lệ.' }, 400);

  const tempPassword = randomTempPassword();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: name, phone, branch, role },
  });

  if (createErr) {
    const msg = /already.*registered|already.*exists/i.test(createErr.message)
      ? 'Email này đã có tài khoản trong hệ thống.'
      : createErr.message;
    return json({ error: msg }, 400);
  }

  const newUserId = created.user!.id;

  // handle_new_user (trigger) đã tự tạo dòng profiles, nhưng KHÔNG đọc "role" từ
  // user_metadata nữa (022_signup_admin_token.sql cố tình bỏ, để chặn client tự gán role qua
  // console) — nên dòng vừa tạo luôn có role = 'customer'. Sửa lại đúng role/branch ở đây,
  // ngay sau khi tạo, bằng service_role key (025_fix_staff_role_bug.sql đã cho phép
  // service_role ghi đè enforce_profile_update_rules). Quản lý tạo trực tiếp nên duyệt sẵn
  // luôn, và bắt buộc đổi mật khẩu tạm thời ở lần đăng nhập đầu tiên.
  const { error: updateErr } = await admin
    .from('profiles')
    .update({ role, branch, approved: true, must_change_password: true })
    .eq('id', newUserId);

  if (updateErr) {
    return json({ error: 'Đã tạo tài khoản nhưng không cập nhật được hồ sơ: ' + updateErr.message }, 500);
  }

  return json({ email, tempPassword, name, phone, branch, role });
});
