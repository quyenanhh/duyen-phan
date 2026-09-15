import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return { id: row.id, phone: row.phone, name: row.name, points: row.points, totalSpent: Number(row.total_spent) };
}

export async function findCustomerByPhone(phone) {
  const { data, error } = await supabase.from('customers').select('*').eq('phone', phone).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function upsertCustomerAfterPurchase(phone, name, spentAmount, pointsDelta) {
  const existing = await findCustomerByPhone(phone);
  if (existing) {
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: name || existing.name,
        points: Math.max(0, existing.points + pointsDelta),
        total_spent: existing.totalSpent + spentAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id).select().single();
    if (error) throw error;
    return fromRow(data);
  }
  const { data, error } = await supabase
    .from('customers')
    .insert({ phone, name: name || '', points: Math.max(0, pointsDelta), total_spent: spentAmount })
    .select().single();
  if (error) throw error;
  return fromRow(data);
}
