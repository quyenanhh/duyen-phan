import { supabase, supabaseEnabled } from './supabaseClient.js';
import { fmtVnd } from '../utils.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id, code: row.code, br: row.branch, st: row.status, total: fmtVnd(Number(row.total)), totalRaw: Number(row.total),
    t: row.order_time, customer: row.customer, phone: row.phone, address: row.address,
    payment: row.payment, items: row.items, note: row.note, createdAt: row.created_at
  };
}

function toRow(o) {
  const row = {};
  if (o.code !== undefined) row.code = o.code;
  if (o.br !== undefined) row.branch = o.br;
  if (o.st !== undefined) row.status = o.st;
  if (o.totalRaw !== undefined) row.total = o.totalRaw;
  if (o.t !== undefined) row.order_time = o.t;
  if (o.customer !== undefined) row.customer = o.customer;
  if (o.phone !== undefined) row.phone = o.phone;
  if (o.address !== undefined) row.address = o.address;
  if (o.payment !== undefined) row.payment = o.payment;
  if (o.items !== undefined) row.items = o.items;
  if (o.note !== undefined) row.note = o.note;
  return row;
}

export async function listOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Đơn giao hàng đã hoàn tất trong khoảng thời gian — dùng để gộp vào doanh thu toàn chuỗi
// (xem BranchPerformance.jsx) cùng với đơn tại bàn (table_orders) và đơn khách tự đặt
// (customer_orders). Lọc theo created_at vì order_time chỉ là chuỗi hiển thị, không dùng
// để truy vấn khoảng thời gian được.
export async function listCompletedOrdersSince(sinceIso) {
  const { data, error } = await supabase.from('orders').select('*').eq('status', 'completed').gte('created_at', sinceIso).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function listCompletedOrdersBetween(sinceIso, untilIso) {
  const { data, error } = await supabase.from('orders').select('*').eq('status', 'completed').gte('created_at', sinceIso).lt('created_at', untilIso).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertOrderRow(order) {
  const { data, error } = await supabase.from('orders').insert(toRow(order)).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateOrderRow(id, patch) {
  const { data, error } = await supabase.from('orders').update(toRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateOrderStatusRow(id, status) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteOrderRow(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}
