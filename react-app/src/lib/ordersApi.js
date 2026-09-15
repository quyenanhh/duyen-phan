import { supabase, supabaseEnabled } from './supabaseClient.js';
import { fmtVnd } from '../utils.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id, code: row.code, br: row.branch, st: row.status, total: fmtVnd(Number(row.total)),
    t: row.order_time, customer: row.customer, phone: row.phone, address: row.address,
    payment: row.payment, items: row.items, note: row.note
  };
}

export async function listOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
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
