import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return { id: row.id, name: row.name, category: row.category, price: Number(row.price), status: row.status, desc: row.description, visible: row.visible !== false };
}

function toRow(m) {
  const row = {};
  if (m.name !== undefined) row.name = m.name;
  if (m.category !== undefined) row.category = m.category;
  if (m.price !== undefined) row.price = m.price;
  if (m.status !== undefined) row.status = m.status;
  if (m.desc !== undefined) row.description = m.desc;
  if (m.visible !== undefined) row.visible = m.visible;
  return row;
}

export async function listMenuItems() {
  const { data, error } = await supabase.from('menu_items').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

// Dùng cho trang Thực đơn công khai (/menu) — chỉ lấy món quản lý đã cho phép hiển thị.
export async function listVisibleMenuItems() {
  const { data, error } = await supabase.from('menu_items').select('*').eq('visible', true).order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertMenuItem(item) {
  const { data, error } = await supabase.from('menu_items').insert(toRow(item)).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateMenuItemRow(id, patch) {
  const { data, error } = await supabase.from('menu_items').update(toRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteMenuItemRow(id) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}
