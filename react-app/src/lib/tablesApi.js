import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return { id: row.id, branch: row.branch, name: row.name, capacity: row.capacity, status: row.status };
}

function toRow(t) {
  const row = {};
  if (t.branch !== undefined) row.branch = t.branch;
  if (t.name !== undefined) row.name = t.name;
  if (t.capacity !== undefined) row.capacity = t.capacity;
  if (t.status !== undefined) row.status = t.status;
  return row;
}

export async function listTables() {
  const { data, error } = await supabase.from('restaurant_tables').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertTable(t) {
  const { data, error } = await supabase.from('restaurant_tables').insert(toRow(t)).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateTableRow(id, patch) {
  const { data, error } = await supabase.from('restaurant_tables').update(toRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteTableRow(id) {
  const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);
  if (error) throw error;
}
