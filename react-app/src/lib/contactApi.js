import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

export async function submitContactMessage({ name, phone, email, message }) {
  const { error } = await supabase.from('contact_messages').insert({ name, phone, email, message });
  if (error) throw error;
}
