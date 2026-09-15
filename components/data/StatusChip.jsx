import React from 'react';
import { Badge } from '../core/Badge.jsx';
export const STATUS_MAP = {
  completed: { tone: 'success', label: 'Hoàn tất' },
  paid: { tone: 'success', label: 'Đã thanh toán' },
  open: { tone: 'success', label: 'Đang mở' },
  processing: { tone: 'warning', label: 'Đang xử lý' },
  pending: { tone: 'warning', label: 'Chờ xác nhận' },
  delivering: { tone: 'info', label: 'Đang giao' },
  scheduled: { tone: 'info', label: 'Đã đặt trước' },
  cancelled: { tone: 'danger', label: 'Đã huỷ' },
  late: { tone: 'danger', label: 'Trễ' },
  draft: { tone: 'neutral', label: 'Nháp' }
};
export function StatusChip({ status, label, style }) {
  const s = STATUS_MAP[status] || STATUS_MAP.draft;
  return <Badge tone={s.tone} dot style={style}>{label || s.label}</Badge>;
}
