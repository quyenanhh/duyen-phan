import Overview from './Overview.jsx';
import Branches from './Branches.jsx';
import Menu from './Menu.jsx';
import Orders from './Orders.jsx';
import Finance from './Finance.jsx';
import StaffList from './StaffList.jsx';
import CashierView from './CashierView.jsx';
import StaffView from './StaffView.jsx';
import TableMap from './TableMap.jsx';
import TableOrder from './TableOrder.jsx';
import KitchenView from './KitchenView.jsx';
import Checkout from './Checkout.jsx';
import BranchPerformance from './BranchPerformance.jsx';
import { LogoutIcon } from './icons.jsx';

export default function Dashboard({ ctx }) {
  const {
    goLanding, userRole, managerTab, setManagerTab, staffTab, setStaffTab,
    userInitials, userName, userRoleLabel, loggedAvatarUrl, openProfile, logout, orderRecords, orderingTableId, checkoutTableId
  } = ctx;

  const isManager = userRole === 'Quản lý';
  const isStaff = userRole === 'Nhân viên';
  const isCashier = userRole === 'Thu ngân';
  const isKitchen = userRole === 'Bếp';
  const pendingOrders = orderRecords.filter(o => o.st === 'pending' || o.st === 'processing').length;

  const dashNavLabel = isStaff ? 'Lịch làm của tôi' : isCashier ? 'Doanh thu' : 'Tổng quan';
  const scheduleLabel = isStaff || isKitchen ? 'Lịch làm của tôi' : 'Ca trực của tôi';

  function goOverview() { setManagerTab('overview'); }

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 1000, color: 'var(--text-body)', fontSize: 'var(--fs-body)', lineHeight: 1.6 }}>
      <nav className="sidebar-w" style={{ flex: '0 0 248px', display: 'flex', flexDirection: 'column', background: 'var(--surface-card)', borderRight: '1px solid var(--border)', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}>
        <div className="nameplate" onClick={goLanding}>
          <span className="nameplate-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z" /><path d="M2 21c0-3 1.9-5.4 5.1-6" /></svg>
          </span>
          <span>
            <span className="nameplate-title" style={{ display: 'block' }}>Duyên Phần</span>
            <span className="nameplate-sub" style={{ display: 'block' }}>Quản trị chuỗi</span>
          </span>
        </div>
        <div style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {isManager && (
            <button className={`nav-item ${managerTab === 'overview' ? 'active' : ''}`} onClick={goOverview}>
              <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg></span>
              <span style={{ flex: 1, textAlign: 'left' }}>{dashNavLabel}</span>
            </button>
          )}
          {(isStaff || isCashier) && (
            <button className={`nav-item ${staffTab === 'tables' ? 'active' : ''}`} onClick={() => setStaffTab('tables')}>
              <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 20h10M9 16v4M15 16v4" /></svg></span>
              <span style={{ flex: 1, textAlign: 'left' }}>Sơ đồ bàn</span>
            </button>
          )}
          {isKitchen && (
            <button className={`nav-item ${staffTab === 'tables' ? 'active' : ''}`} onClick={() => setStaffTab('tables')}>
              <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v4M16 3v4M6 8h12l-1 4H7z" /><path d="M5 12h14l-1.2 8.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z" /></svg></span>
              <span style={{ flex: 1, textAlign: 'left' }}>Bếp</span>
            </button>
          )}
          {(isStaff || isCashier || isKitchen) && (
            <button className={`nav-item ${staffTab === 'schedule' ? 'active' : ''}`} onClick={() => setStaffTab('schedule')}>
              <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg></span>
              <span style={{ flex: 1, textAlign: 'left' }}>{scheduleLabel}</span>
            </button>
          )}
          {isManager && (
            <>
              <span className="section-label">Vận hành</span>
              <button className={`nav-item ${managerTab === 'branches' ? 'active' : ''}`} onClick={() => setManagerTab('branches')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M4 9v10h16V9" /><path d="M9 21v-6h6v6" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Chi nhánh</span>
              </button>
              <button className={`nav-item ${managerTab === 'menu' ? 'active' : ''}`} onClick={() => setManagerTab('menu')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v8a2 2 0 0 0 2 2v10" /><path d="M4 2v4" /><path d="M7 2v4" /><path d="M20 2c-2 1-3 3-3 6 0 2 1 3 2 3v11" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Thực đơn</span>
              </button>
              <button className={`nav-item ${managerTab === 'orders' ? 'active' : ''}`} onClick={() => setManagerTab('orders')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="13" height="10" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Đặt hàng &amp; Giao hàng</span>
                {pendingOrders > 0 && <span className="seal-badge">{pendingOrders}</span>}
              </button>
              <button className={`nav-item ${managerTab === 'branchPerf' ? 'active' : ''}`} onClick={() => setManagerTab('branchPerf')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Hiệu suất chi nhánh</span>
              </button>
              <span className="section-label">Nội bộ</span>
              <button className={`nav-item ${managerTab === 'staffList' ? 'active' : ''}`} onClick={() => setManagerTab('staffList')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Nhân viên</span>
              </button>
              <button className={`nav-item ${managerTab === 'finance' ? 'active' : ''}`} onClick={() => setManagerTab('finance')}>
                <span className="nav-medallion"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" /><path d="M17 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4z" /></svg></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Doanh thu &amp; Chi tiêu</span>
              </button>
            </>
          )}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="nav-item" style={{ flex: 1, minWidth: 0, padding: '6px 8px', gap: 10 }} onClick={openProfile} title="Xem thông tin tài khoản">
            {loggedAvatarUrl ? (
              <img src={loggedAvatarUrl} alt={userName} style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: 999, objectFit: 'cover' }} />
            ) : (
              <span style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: 999, background: 'var(--clay-100)', color: 'var(--text-accent)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 12 }}>{userInitials}</span>
            )}
            <span style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.35 }}>
              <span style={{ display: 'block', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</span>
              <span style={{ display: 'block', color: 'var(--text-muted)' }}>{userRoleLabel}</span>
            </span>
          </span>
          <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} onClick={logout}><LogoutIcon /></button>
        </div>
      </nav>

      {isManager && managerTab === 'overview' && <Overview ctx={ctx} />}
      {isManager && managerTab === 'branches' && <Branches ctx={ctx} />}
      {isManager && managerTab === 'menu' && <Menu ctx={ctx} />}
      {isManager && managerTab === 'orders' && <Orders ctx={ctx} />}
      {isManager && managerTab === 'staffList' && <StaffList ctx={ctx} />}
      {isManager && managerTab === 'finance' && <Finance ctx={ctx} />}
      {isManager && managerTab === 'branchPerf' && <BranchPerformance ctx={ctx} />}
      {isStaff && staffTab === 'tables' && (orderingTableId != null ? <TableOrder ctx={ctx} /> : <TableMap ctx={ctx} />)}
      {isStaff && staffTab === 'schedule' && <StaffView ctx={ctx} />}
      {isCashier && staffTab === 'tables' && (checkoutTableId != null ? <Checkout ctx={ctx} /> : <TableMap ctx={ctx} />)}
      {isCashier && staffTab === 'schedule' && <CashierView ctx={ctx} />}
      {isKitchen && staffTab === 'tables' && <KitchenView ctx={ctx} />}
      {isKitchen && staffTab === 'schedule' && <StaffView ctx={ctx} />}
    </div>
  );
}
