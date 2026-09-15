import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    manager: row.manager,
    phone: row.phone,
    hours: row.hours,
    opened: row.opened,
    status: row.status,
    staffCount: row.staff_count
  };
}

function toRow(b) {
  const row = {};
  if (b.name !== undefined) row.name = b.name;
  if (b.address !== undefined) row.address = b.address;
  if (b.manager !== undefined) row.manager = b.manager;
  if (b.phone !== undefined) row.phone = b.phone;
  if (b.hours !== undefined) row.hours = b.hours;
  if (b.opened !== undefined) row.opened = b.opened;
  if (b.status !== undefined) row.status = b.status;
  if (b.staffCount !== undefined) row.staff_count = b.staffCount;
  return row;
}

export async function listBranches() {
  const { data, error } = await supabase.from('branches').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertBranch(branch) {
  const { data, error } = await supabase.from('branches').insert(toRow(branch)).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateBranchRow(id, patch) {
  const { data, error } = await supabase.from('branches').update(toRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteBranchRow(id) {
  const { error } = await supabase.from('branches').delete().eq('id', id);
  if (error) throw error;
}
