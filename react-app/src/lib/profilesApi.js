import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    branch: row.branch,
    role: row.role,
    approved: row.approved,
    status: row.status,
    shifts: row.shifts,
    salary: Number(row.salary),
    checkedIn: row.checked_in,
    week: row.week,
    cccd: row.cccd,
    dob: row.dob,
    account: row.email,
    createdAt: row.created_at,
    approvalPin: row.approval_pin || '',
    mustChangePassword: !!row.must_change_password,
    startDate: row.start_date || '',
    contractType: row.contract_type || 'Toàn thời gian',
    avatarUrl: row.avatar_url || ''
  };
}

export async function getMyProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function listProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function updateProfileRow(id, patch) {
  const row = {};
  if (patch.name !== undefined) row.full_name = patch.name;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.branch !== undefined) row.branch = patch.branch;
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.approved !== undefined) row.approved = patch.approved;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.shifts !== undefined) row.shifts = patch.shifts;
  if (patch.salary !== undefined) row.salary = patch.salary;
  if (patch.checkedIn !== undefined) row.checked_in = patch.checkedIn;
  if (patch.week !== undefined) row.week = patch.week;
  if (patch.cccd !== undefined) row.cccd = patch.cccd;
  if (patch.dob !== undefined) row.dob = patch.dob;
  if (patch.approvalPin !== undefined) row.approval_pin = patch.approvalPin;
  if (patch.mustChangePassword !== undefined) row.must_change_password = patch.mustChangePassword;
  if (patch.startDate !== undefined) row.start_date = patch.startDate || null;
  if (patch.contractType !== undefined) row.contract_type = patch.contractType;
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl || null;
  const { data, error } = await supabase.from('profiles').update(row).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteProfileRow(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}

// Tải ảnh đại diện lên Supabase Storage (bucket "avatars", xem supabase/018_staff_avatars.sql)
// và trả về URL công khai để lưu vào profiles.avatar_url.
export async function uploadAvatar(profileId, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${profileId}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, cacheControl: '3600' });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

// Kiểm tra mã PIN duyệt có khớp với BẤT KỲ quản lý đã duyệt nào trong hệ thống không.
// Gọi qua RPC (SECURITY DEFINER) vì RLS không cho Nhân viên/Thu ngân tự đọc hồ sơ quản lý.
export async function verifyManagerPin(pin) {
  if (!pin || !pin.trim()) return false;
  const { data, error } = await supabase.rpc('verify_manager_pin', { p_pin: pin.trim() });
  if (error) throw error;
  return !!data;
}
