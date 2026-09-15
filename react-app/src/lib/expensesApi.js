import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return { id: row.id, date: row.expense_date, branch: row.branch, category: row.category, amount: Number(row.amount), note: row.note };
}

function toRow(e) {
  const row = {};
  if (e.date !== undefined) row.expense_date = e.date;
  if (e.branch !== undefined) row.branch = e.branch;
  if (e.category !== undefined) row.category = e.category;
  if (e.amount !== undefined) row.amount = e.amount;
  if (e.note !== undefined) row.note = e.note;
  return row;
}

export async function listExpenses() {
  const { data, error } = await supabase.from('expenses').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertExpense(exp) {
  const { data, error } = await supabase.from('expenses').insert(toRow(exp)).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateExpenseRow(id, patch) {
  const { data, error } = await supabase.from('expenses').update(toRow(patch)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteExpenseRow(id) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}
