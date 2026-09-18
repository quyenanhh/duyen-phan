import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id, branch: row.branch, date: row.reservation_date, time: (row.reservation_time || '').slice(0, 5),
    guests: row.guests, note: row.note, customerName: row.customer_name, customerPhone: row.customer_phone,
    status: row.status, createdAt: row.created_at
  };
}

// Đặt bàn của CHÍNH khách hàng đang đăng nhập — RLS chỉ trả về đúng bàn của người gọi.
export async function listMyReservations() {
  const { data, error } = await supabase.from('reservations').select('*').order('reservation_date', { ascending: false }).order('reservation_time', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function createReservation({ branch, date, time, guests, note, customerName, customerPhone }) {
  const { data: auth } = await supabase.auth.getUser();
  const row = {
    customer_id: auth.user.id, branch, reservation_date: date, reservation_time: time,
    guests, note: note || '', customer_name: customerName || '', customer_phone: customerPhone || ''
  };
  const { data, error } = await supabase.from('reservations').insert(row).select().single();
  if (error) throw error;
  return fromRow(data);
}

// Khách chỉ được tự huỷ đặt bàn còn "pending" — DB trigger đã chặn mọi thay đổi trạng thái khác.
export async function cancelReservation(id) {
  const { data, error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}
