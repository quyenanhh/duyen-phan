import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromOrderRow(row) {
  return {
    id: row.id, code: row.code, branch: row.branch, orderMode: row.order_mode, tableId: row.table_id,
    status: row.status, total: Number(row.total), note: row.note,
    customerName: row.customer_name, customerPhone: row.customer_phone, createdAt: row.created_at,
    paymentMethod: row.payment_method, paymentStatus: row.payment_status
  };
}

function fromItemRow(row) {
  return { id: row.id, menuItemId: row.menu_item_id, name: row.item_name, price: Number(row.unit_price), quantity: row.quantity };
}

// Đơn của CHÍNH khách hàng đang đăng nhập, kèm danh sách món — RLS chỉ trả về đúng đơn của người gọi.
export async function listMyOrders() {
  const { data: orders, error } = await supabase.from('customer_orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  if (!orders.length) return [];
  const { data: items, error: itemsErr } = await supabase.from('customer_order_items').select('*').in('order_id', orders.map(o => o.id));
  if (itemsErr) throw itemsErr;
  return orders.map(o => ({ ...fromOrderRow(o), items: items.filter(it => it.order_id === o.id).map(fromItemRow) }));
}

// Tạo đơn đặt món: chèn đơn trước để lấy id, rồi chèn danh sách món gắn với đơn đó.
// cart: [{ id, name, price, quantity }]. paymentMethod: 'tien_mat' | 'chuyen_khoan' | 'the'.
export async function createCustomerOrder({ branch, orderMode, tableId, note, customerName, customerPhone, cart, paymentMethod }) {
  const { data: auth } = await supabase.auth.getUser();
  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const orderRow = {
    customer_id: auth.user.id, branch, order_mode: orderMode, table_id: tableId || null,
    total, note: note || '', customer_name: customerName || '', customer_phone: customerPhone || '',
    payment_method: paymentMethod || 'tien_mat'
  };
  const { data: order, error } = await supabase.from('customer_orders').insert(orderRow).select().single();
  if (error) throw error;

  const itemRows = cart.map(it => ({ order_id: order.id, menu_item_id: it.id, item_name: it.name, unit_price: it.price, quantity: it.quantity }));
  const { data: items, error: itemsErr } = await supabase.from('customer_order_items').insert(itemRows).select();
  if (itemsErr) throw itemsErr;

  return { ...fromOrderRow(order), items: items.map(fromItemRow) };
}

// Đơn khách tự đặt đã hoàn tất trong khoảng thời gian — dùng để gộp vào doanh thu toàn
// chuỗi (xem BranchPerformance.jsx) cùng với đơn tại bàn (table_orders) và đơn giao hàng
// (orders). Không lọc theo customer_id: RLS (023_customer_portal.sql) đã tự cho phép
// is_staff() đọc mọi đơn, còn khách hàng gọi hàm này (nếu có) sẽ chỉ nhận đúng đơn của mình.
export async function listCompletedCustomerOrdersSince(sinceIso) {
  const { data, error } = await supabase.from('customer_orders').select('*').eq('status', 'completed').gte('created_at', sinceIso).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromOrderRow);
}

export async function listCompletedCustomerOrdersBetween(sinceIso, untilIso) {
  const { data, error } = await supabase.from('customer_orders').select('*').eq('status', 'completed').gte('created_at', sinceIso).lt('created_at', untilIso).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromOrderRow);
}

// Khách chỉ được tự huỷ đơn còn "pending" — DB trigger đã chặn mọi thay đổi trạng thái khác.
export async function cancelCustomerOrder(id) {
  const { data, error } = await supabase.from('customer_orders').update({ status: 'cancelled' }).eq('id', id).select().single();
  if (error) throw error;
  return fromOrderRow(data);
}
