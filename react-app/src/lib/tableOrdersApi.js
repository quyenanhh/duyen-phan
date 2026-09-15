import { supabase, supabaseEnabled } from './supabaseClient.js';

export { supabaseEnabled };

function fromRow(row) {
  return {
    id: row.id, tableId: row.table_id, branch: row.branch, tableName: row.table_name,
    status: row.status, items: row.items || [], total: Number(row.total),
    note: row.note, waiterName: row.waiter_name, createdAt: row.created_at, updatedAt: row.updated_at,
    discount: Number(row.discount || 0), paymentMethod: row.payment_method || '',
    cashierName: row.cashier_name || '', paidAt: row.paid_at, cookName: row.cook_name || '',
    vatPct: Number(row.vat_pct || 0), vatAmount: Number(row.vat_amount || 0),
    customerPhone: row.customer_phone || '', voucherCode: row.voucher_code || '',
    pointsEarned: row.points_earned || 0, pointsRedeemed: row.points_redeemed || 0
  };
}

function toRow(o) {
  const row = {};
  if (o.tableId !== undefined) row.table_id = o.tableId;
  if (o.branch !== undefined) row.branch = o.branch;
  if (o.tableName !== undefined) row.table_name = o.tableName;
  if (o.status !== undefined) row.status = o.status;
  if (o.items !== undefined) row.items = o.items;
  if (o.total !== undefined) row.total = o.total;
  if (o.note !== undefined) row.note = o.note;
  if (o.waiterName !== undefined) row.waiter_name = o.waiterName;
  if (o.discount !== undefined) row.discount = o.discount;
  if (o.paymentMethod !== undefined) row.payment_method = o.paymentMethod;
  if (o.cashierName !== undefined) row.cashier_name = o.cashierName;
  if (o.paidAt !== undefined) row.paid_at = o.paidAt;
  if (o.cookName !== undefined) row.cook_name = o.cookName;
  if (o.vatPct !== undefined) row.vat_pct = o.vatPct;
  if (o.vatAmount !== undefined) row.vat_amount = o.vatAmount;
  if (o.customerPhone !== undefined) row.customer_phone = o.customerPhone;
  if (o.voucherCode !== undefined) row.voucher_code = o.voucherCode;
  if (o.pointsEarned !== undefined) row.points_earned = o.pointsEarned;
  if (o.pointsRedeemed !== undefined) row.points_redeemed = o.pointsRedeemed;
  return row;
}

// Order đang hoạt động (chưa thanh toán/huỷ) của một chi nhánh — dùng để hiển thị trên Sơ đồ bàn.
export async function listActiveTableOrders(branch) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('branch', branch)
    .in('status', ['open', 'sent', 'served'])
    .order('id', { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function insertTableOrder(o) {
  const { data, error } = await supabase.from('table_orders').insert(toRow(o)).select().single();
  if (error) throw error;
  return fromRow(data);
}

// Các hoá đơn đã thanh toán trong ca của MỘT thu ngân cụ thể — dùng cho Báo cáo kết ca.
// Lọc theo cashier_name để mỗi thu ngân chỉ thấy giao dịch của chính mình, không thấy của người khác.
export async function listPaidTableOrdersByCashier(branch, cashierName, sinceIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('branch', branch)
    .eq('status', 'paid')
    .eq('cashier_name', cashierName)
    .gte('paid_at', sinceIso)
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Các order một PHỤC VỤ cụ thể đã tạo trong khoảng thời gian — dùng cho KPI hiệu suất nhân viên.
export async function listOrdersByWaiter(branch, waiterName, sinceIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('branch', branch)
    .eq('waiter_name', waiterName)
    .neq('status', 'cancelled')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Các order một ĐẦU BẾP cụ thể đã đánh dấu xong trong khoảng thời gian — dùng cho KPI hiệu suất Bếp.
export async function listOrdersByCook(branch, cookName, sinceIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('branch', branch)
    .eq('cook_name', cookName)
    .gte('updated_at', sinceIso)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Mọi hoá đơn đã thanh toán trong khoảng thời gian, KHÔNG lọc theo chi nhánh —
// dùng cho trang Hiệu suất chi nhánh (quản lý xem toàn chuỗi).
export async function listPaidTableOrdersSince(sinceIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('status', 'paid')
    .gte('paid_at', sinceIso)
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Mọi order (bất kể trạng thái), KHÔNG lọc chi nhánh — dùng cho trang Tổng quan (đếm đơn
// đang chờ/đang phục vụ/tổng đơn, và bảng "Hoạt động gần đây").
export async function listTableOrdersSince(sinceIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

// Hoá đơn đã thanh toán trong một khoảng [sinceIso, untilIso) — dùng để so sánh kỳ này với kỳ trước.
export async function listPaidTableOrdersBetween(sinceIso, untilIso) {
  const { data, error } = await supabase
    .from('table_orders')
    .select('*')
    .eq('status', 'paid')
    .gte('paid_at', sinceIso)
    .lt('paid_at', untilIso)
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function updateTableOrderRow(id, patch) {
  const { data, error } = await supabase
    .from('table_orders')
    .update({ ...toRow(patch), updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data);
}
