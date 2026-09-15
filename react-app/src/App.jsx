import { useEffect, useState } from 'react';
import Landing from './Landing.jsx';
import MenuPage from './MenuPage.jsx';
import BranchesPage from './BranchesPage.jsx';
import AboutPage from './AboutPage.jsx';
import ContactPage from './ContactPage.jsx';
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';
import ProfileDialog from './ProfileDialog.jsx';
import SecurityDialog from './SecurityDialog.jsx';
import Toast from './Toast.jsx';
import {
  STAFF_LIST, BRANCH_LIST, MENU_ITEMS, ORDERS, EXPENSE_LIST
} from './data.js';
import { initials } from './utils.js';
import { listBranches, supabaseEnabled } from './lib/branchesApi.js';
import { signInWithPassword, signUp, signOut, checkEmailExists, updatePassword } from './lib/authApi.js';
import { getMyProfile, listProfiles, updateProfileRow, deleteProfileRow } from './lib/profilesApi.js';
import { listMenuItems } from './lib/menuApi.js';
import { listExpenses } from './lib/expensesApi.js';
import { listOrders } from './lib/ordersApi.js';
import { listTables } from './lib/tablesApi.js';
import { listActiveTableOrders } from './lib/tableOrdersApi.js';

export default function App() {
  // page routing
  const [page, setPage] = useState('landing'); // landing | auth | dashboard | changePassword
  const [mode, setMode] = useState('login'); // login | register
  const [theme, setTheme] = useState('light');

  // login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [authLoading, setAuthLoading] = useState(false);

  // register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [agree, setAgree] = useState(true);
  const [regErrors, setRegErrors] = useState({});

  const [success, setSuccess] = useState(null);

  // session
  const [loggedId, setLoggedId] = useState('');
  const [loggedName, setLoggedName] = useState('');
  const [loggedEmail, setLoggedEmail] = useState('');
  const [loggedPhone, setLoggedPhone] = useState('');
  const [loggedPin, setLoggedPin] = useState('');
  const [userRole, setUserRole] = useState('Quản lý');
  const [userBranch, setUserBranch] = useState('');
  const [userWeek, setUserWeek] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // change password
  const [newPassword, setNewPassword] = useState('');
  const [newConfirm, setNewConfirm] = useState('');

  // dashboard nav
  const [managerTab, setManagerTab] = useState('overview'); // overview | branches | menu | orders | staffList | finance
  const [staffTab, setStaffTab] = useState('tables'); // tables | schedule  (nhân viên / thu ngân)
  const [range, setRange] = useState('week');

  // staff
  const [staffRecords, setStaffRecords] = useState(STAFF_LIST);
  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [pauseStaffId, setPauseStaffId] = useState(null);
  const [staffQuery, setStaffQuery] = useState('');
  const [staffFilterRole, setStaffFilterRole] = useState('');
  const [staffFilterBranch, setStaffFilterBranch] = useState('');
  const [staffProfileId, setStaffProfileId] = useState(null);
  const [staffCalYear, setStaffCalYear] = useState(2026);
  const [staffCalMonth, setStaffCalMonth] = useState(8);

  // branches
  const [branchRecords, setBranchRecords] = useState(BRANCH_LIST);
  // Nếu đã cấu hình Supabase (.env.local), nạp danh sách chi nhánh thật từ đó.
  // Nếu chưa cấu hình hoặc lỗi mạng, giữ nguyên dữ liệu mẫu ở trên (BRANCH_LIST) — không mất chức năng.
  useEffect(() => {
    if (!supabaseEnabled) return;
    listBranches()
      .then(setBranchRecords)
      .catch(err => console.error('[Supabase] Không tải được danh sách chi nhánh, dùng dữ liệu mẫu:', err));
  }, []);
  useEffect(() => {
    if (!supabaseEnabled) return;
    listMenuItems().then(setMenuRecords).catch(err => console.error('[Supabase] Không tải được thực đơn, dùng dữ liệu mẫu:', err));
  }, []);
  // Chi phí, đơn hàng, nhân viên chỉ tải SAU khi đăng nhập — các bảng này chỉ cho phép
  // tài khoản đã xác thực đọc (RLS "to authenticated"), tải trước khi đăng nhập sẽ luôn
  // rỗng vì chưa có phiên xác thực, và không tự tải lại nếu chỉ chạy một lần lúc mở app.
  useEffect(() => {
    if (!supabaseEnabled || !isLoggedIn) return;
    listExpenses().then(setExpenseRecords).catch(err => console.error('[Supabase] Không tải được chi phí, dùng dữ liệu mẫu:', err));
  }, [isLoggedIn]);
  useEffect(() => {
    if (!supabaseEnabled || !isLoggedIn) return;
    listOrders().then(setOrderRecords).catch(err => console.error('[Supabase] Không tải được đơn hàng, dùng dữ liệu mẫu:', err));
  }, [isLoggedIn]);
  useEffect(() => {
    if (!supabaseEnabled || !isLoggedIn) return;
    setTablesLoading(true);
    listTables()
      .then(setTableRecords)
      .catch(err => console.error('[Supabase] Không tải được sơ đồ bàn:', err))
      .finally(() => setTablesLoading(false));
  }, [isLoggedIn]);
  useEffect(() => {
    if (!supabaseEnabled || !isLoggedIn || !userBranch) return;
    listActiveTableOrders(userBranch).then(setTableOrderRecords).catch(err => console.error('[Supabase] Không tải được order tại bàn:', err));
  }, [isLoggedIn, userBranch]);
  useEffect(() => {
    if (!supabaseEnabled || !isLoggedIn) return;
    listProfiles().then(setStaffRecords).catch(err => console.error('[Supabase] Không tải được danh sách nhân viên, dùng dữ liệu mẫu:', err));
  }, [isLoggedIn]);
  const [branchQuery, setBranchQuery] = useState('');
  const [branchFilterStatus, setBranchFilterStatus] = useState('');
  const [branchAddOpen, setBranchAddOpen] = useState(false);
  const [branchAddForm, setBranchAddForm] = useState({ id: null, name: '', address: '', manager: '', phone: '', hours: '' });
  const [branchAddErrors, setBranchAddErrors] = useState({});
  const [branchProfileId, setBranchProfileId] = useState(null);
  const [deleteBranchId, setDeleteBranchId] = useState(null);
  const [toggleBranchId, setToggleBranchId] = useState(null);

  // menu
  const [menuRecords, setMenuRecords] = useState(MENU_ITEMS);
  const [menuQuery, setMenuQuery] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('');
  const [menuFilterStatus, setMenuFilterStatus] = useState('');
  const [menuAddOpen, setMenuAddOpen] = useState(false);
  const [menuAddForm, setMenuAddForm] = useState({ id: null, name: '', category: '', price: '', status: 'available', desc: '', visible: true });
  const [menuAddErrors, setMenuAddErrors] = useState({});
  const [deleteMenuId, setDeleteMenuId] = useState(null);

  // orders
  const [orderRecords, setOrderRecords] = useState(ORDERS);
  const [orderQuery, setOrderQuery] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');
  const [orderFilterBranch, setOrderFilterBranch] = useState('');
  const [orderProfileId, setOrderProfileId] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  // tables (sơ đồ bàn)
  const [tableRecords, setTableRecords] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  // gọi món tại bàn
  const [tableOrderRecords, setTableOrderRecords] = useState([]);
  const [orderingTableId, setOrderingTableId] = useState(null);
  function openTableOrder(tableId) { setOrderingTableId(tableId); }
  function closeTableOrder() { setOrderingTableId(null); }

  // thanh toán tại bàn
  const [checkoutTableId, setCheckoutTableId] = useState(null);
  function openCheckout(tableId) { setCheckoutTableId(tableId); }
  function closeCheckout() { setCheckoutTableId(null); }

  // finance / expenses
  const [expenseRecords, setExpenseRecords] = useState(EXPENSE_LIST);
  const [expenseQuery, setExpenseQuery] = useState('');
  const [expenseFilterCategory, setExpenseFilterCategory] = useState('');
  const [expenseAddOpen, setExpenseAddOpen] = useState(false);
  const [expenseAddForm, setExpenseAddForm] = useState({ id: null, date: '', branch: '', category: '', amount: '', note: '' });
  const [expenseAddErrors, setExpenseAddErrors] = useState({});
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);

  // toast
  const [toastMsg, setToastMsg] = useState('');
  function flash(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  }

  // account profile dialog (shared: landing header + dashboard sidebar)
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileNameDraft, setProfileNameDraft] = useState('');
  const [pinDraft, setPinDraft] = useState('');

  // security dialog
  const [securityOpen, setSecurityOpen] = useState(false);
  const [secCurrent, setSecCurrent] = useState('');
  const [secNew, setSecNew] = useState('');
  const [secConfirm, setSecConfirm] = useState('');
  const [secErrors, setSecErrors] = useState({});
  const [secSms, setSecSms] = useState(false);
  const [secEmail, setSecEmail] = useState(false);
  const [secApp, setSecApp] = useState(false);

  // landing account dropdown
  const [landingAcctMenuOpen, setLandingAcctMenuOpen] = useState(false);

  const userInitials = loggedName ? initials(loggedName) : 'AN';
  const userName = loggedName || 'An Nguyễn';
  const userRoleLabel = userRole === 'Nhân viên' ? 'Nhân viên' : userRole === 'Thu ngân' ? 'Thu ngân' : userRole === 'Bếp' ? 'Bếp' : 'Quản lý chuỗi';
  const staffCode = loggedId ? 'NV-' + loggedId.slice(0, 6).toUpperCase() : '';

  function goAuth(e) {
    if (e) e.preventDefault();
    setLandingAcctMenuOpen(false);
    if (isLoggedIn) { setPage('dashboard'); return; }
    setPage('auth'); setMode('login'); setSuccess(null); setErrors({});
  }
  function goLanding() { setPage('landing'); }
  function goMenu(e) { if (e) e.preventDefault(); setPage('menu'); window.scrollTo(0, 0); }
  function goBranchesPublic(e) { if (e) e.preventDefault(); setPage('branches'); window.scrollTo(0, 0); }
  function goAbout(e) { if (e) e.preventDefault(); setPage('about'); window.scrollTo(0, 0); }
  function goContact(e) { if (e) e.preventDefault(); setPage('contact'); window.scrollTo(0, 0); }
  function toggleTheme() { setTheme(t => (t === 'dark' ? 'light' : 'dark')); }
  function logout() {
    signOut();
    setPage('auth'); setMode('login'); setPassword(''); setErrors({}); setIsLoggedIn(false);
  }
  function switchAccount() { setLandingAcctMenuOpen(false); logout(); }

  async function submitLogin() {
    const trimmedEmail = email.trim();
    const errs = {};
    if (!trimmedEmail) errs.email = 'Nhập email nội bộ';
    if (!password.trim()) errs.password = 'Nhập mật khẩu';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!supabaseEnabled) {
      setErrors({ password: 'Chưa cấu hình Supabase Auth — xem HUONG_DAN_SUPABASE.md' });
      return;
    }

    setErrors({});
    setAuthLoading(true);
    const { data, error } = await signInWithPassword(trimmedEmail, password);

    if (error) {
      if (error.message === 'Invalid login credentials') {
        let emailExists = false;
        try { emailExists = await checkEmailExists(trimmedEmail); } catch { /* giữ mặc định false, coi như sai mật khẩu */ }
        setErrors(emailExists
          ? { password: 'Mật khẩu không chính xác' }
          : { email: 'Email này chưa có tài khoản trong hệ thống' });
      } else if (error.message === 'Email not confirmed') {
        setErrors({ email: 'Email chưa được xác thực — kiểm tra hộp thư để xác nhận tài khoản' });
      } else {
        setErrors({ password: error.message });
      }
      setAuthLoading(false);
      return;
    }

    const user = data.user;
    let profile = null;
    try { profile = await getMyProfile(user.id); } catch (err) { console.error('[Supabase] Không tải được hồ sơ nhân sự:', err); }

    if (!profile) {
      await signOut();
      setErrors({ password: 'Không tìm thấy hồ sơ nhân sự cho tài khoản này — có thể đã bị từ chối hoặc xoá. Liên hệ quản lý.' });
      setAuthLoading(false);
      return;
    }
    if (!profile.approved) {
      await signOut();
      setErrors({ password: 'Tài khoản đang chờ quản lý duyệt, vui lòng quay lại sau.' });
      setAuthLoading(false);
      return;
    }

    const fallbackName = trimmedEmail.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setLoggedId(user.id);
    setLoggedEmail(user.email);
    setLoggedName((profile && profile.name) || fallbackName);
    setLoggedPhone((profile && profile.phone) || '');
    setLoggedPin((profile && profile.approvalPin) || '');
    setUserRole((profile && profile.role) || 'Quản lý');
    setUserBranch((profile && profile.branch) || '');
    setUserWeek((profile && profile.week) || null);
    setAuthLoading(false);

    if (profile && profile.mustChangePassword) {
      // Tài khoản do Quản lý tạo trực tiếp, đăng nhập bằng mật khẩu tạm thời — bắt buộc đổi
      // mật khẩu trước khi vào hệ thống chính. isLoggedIn cố tình vẫn để false: phiên Supabase
      // Auth đã có sẵn (đủ để gọi updatePassword/updateProfileRow), nhưng UI coi như chưa
      // "vào" app cho tới khi đổi mật khẩu xong (xem submitNewPassword bên dưới).
      setPage('changePassword');
      return;
    }
    setIsLoggedIn(true);
    setPage('dashboard');
  }

  async function submitRegister() {
    const errs = {};
    if (!regName.trim()) errs.regName = 'Nhập họ và tên';
    if (!regEmail.trim()) errs.regEmail = 'Nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) errs.regEmail = 'Email không hợp lệ';
    if (!regPhone.trim()) errs.regPhone = 'Nhập số điện thoại';
    else if (!/^0\d{9}$/.test(regPhone.replace(/[\s.-]/g, ''))) errs.regPhone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!regBranch) errs.regBranch = 'Chọn chi nhánh phụ trách';
    if (!regRole) errs.regRole = 'Chọn chức vụ';
    if (!regPassword.trim()) errs.regPassword = 'Nhập mật khẩu';
    else if (regPassword.length < 8) errs.regPassword = 'Cần tối thiểu 8 ký tự';
    if (regConfirm !== regPassword) errs.regConfirm = 'Mật khẩu xác nhận không khớp';
    if (!agree) errs.agree = 'Cần đồng ý điều khoản để tiếp tục';
    if (Object.keys(errs).length) { setRegErrors(errs); return; }

    if (!supabaseEnabled) {
      setRegErrors({ regEmail: 'Chưa cấu hình Supabase Auth — xem HUONG_DAN_SUPABASE.md' });
      return;
    }

    setRegErrors({});
    setAuthLoading(true);
    const trimmedEmail = regEmail.trim();
    const { error } = await signUp(trimmedEmail, regPassword, {
      full_name: regName.trim(), phone: regPhone.trim(), branch: regBranch, role: regRole
    });
    setAuthLoading(false);

    if (error) {
      if (/already|đã đăng ký/i.test(error.message)) setRegErrors({ regEmail: 'Email này đã có tài khoản trong hệ thống' });
      else setRegErrors({ regEmail: error.message });
      return;
    }
    setSuccess({ type: 'register', email: trimmedEmail, role: regRole });
  }

  function backToLogin() {
    setSuccess(null); setMode('login');
    setEmail(success && success.type === 'register' ? success.email : email);
    setPassword(''); setErrors({});
    setRegName(''); setRegEmail(''); setRegPhone(''); setRegBranch(''); setRegRole('');
    setRegPassword(''); setRegConfirm(''); setAgree(true); setRegErrors({});
  }

  async function submitNewPassword() {
    const errs = {};
    if (!newPassword.trim()) errs.newPassword = 'Nhập mật khẩu mới';
    else if (newPassword.length < 8) errs.newPassword = 'Cần tối thiểu 8 ký tự';
    if (newConfirm !== newPassword) errs.newConfirm = 'Mật khẩu xác nhận không khớp';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (supabaseEnabled) {
      setAuthLoading(true);
      const { error } = await updatePassword(newPassword);
      setAuthLoading(false);
      if (error) { setErrors({ newPassword: error.message }); return; }
      if (loggedId) {
        try { await updateProfileRow(loggedId, { mustChangePassword: false }); }
        catch (err) { console.error('[Supabase] Không xoá được cờ bắt buộc đổi mật khẩu:', err); }
      }
    }
    setPage('dashboard'); setNewPassword(''); setNewConfirm(''); setErrors({}); setIsLoggedIn(true);
  }

  function openProfile() { setProfileOpen(true); setProfileNameDraft(loggedName); setPinDraft(loggedPin); }
  function openProfileFromLanding() { setProfileOpen(true); setProfileNameDraft(loggedName); setPinDraft(loggedPin); setLandingAcctMenuOpen(false); }
  function closeProfile() { setProfileOpen(false); }
  async function saveProfile() {
    const name = profileNameDraft.trim();
    if (!name) return;
    const pin = pinDraft.trim();
    setLoggedName(name); setLoggedPin(pin); setProfileOpen(false);
    flash('Đã cập nhật hồ sơ.');
    if (supabaseEnabled && loggedId) {
      try { await updateProfileRow(loggedId, { name, approvalPin: pin }); }
      catch (err) { console.error('[Supabase] Cập nhật hồ sơ thất bại:', err); flash('Không lưu được lên máy chủ — thay đổi chỉ có trên trình duyệt này.'); }
    }
  }

  function openSecurity() {
    setSecurityOpen(true);
    setSecCurrent(''); setSecNew(''); setSecConfirm(''); setSecErrors({});
  }
  function openSecurityFromLanding() {
    openSecurity(); setLandingAcctMenuOpen(false);
  }
  function closeSecurity() { setSecurityOpen(false); }
  async function submitSecurity() {
    const errs = {};
    if (!secCurrent.trim()) errs.secCurrent = 'Nhập mật khẩu hiện tại';
    if (!secNew.trim()) errs.secNew = 'Nhập mật khẩu mới';
    else if (secNew.length < 8) errs.secNew = 'Cần tối thiểu 8 ký tự';
    if (secConfirm !== secNew) errs.secConfirm = 'Mật khẩu xác nhận không khớp';
    if (Object.keys(errs).length) { setSecErrors(errs); return; }

    if (!supabaseEnabled) {
      setSecErrors({ secCurrent: 'Chưa cấu hình Supabase Auth' });
      return;
    }

    const { error: verifyError } = await signInWithPassword(loggedEmail, secCurrent);
    if (verifyError) {
      setSecErrors({ secCurrent: 'Mật khẩu hiện tại không chính xác' });
      return;
    }
    const { error: updateError } = await updatePassword(secNew);
    if (updateError) {
      setSecErrors({ secNew: updateError.message });
      return;
    }
    setSecurityOpen(false);
    flash('Đã cập nhật mật khẩu mới.');
  }
  function goForgotPassword() {
    setPage('changePassword'); setSecurityOpen(false); setNewPassword(''); setNewConfirm(''); setErrors({});
  }

  const ctx = {
    page, setPage, mode, setMode, theme, toggleTheme, goAuth, goLanding, goMenu, goBranchesPublic, goAbout, goContact, logout, switchAccount,
    email, setEmail, password, setPassword, remember, setRemember, errors, setErrors,
    submitLogin, authLoading,
    regName, setRegName, regEmail, setRegEmail, regPhone, setRegPhone, regBranch, setRegBranch,
    regRole, setRegRole, regPassword, setRegPassword, regConfirm, setRegConfirm, agree, setAgree,
    regErrors, setRegErrors, submitRegister, success, backToLogin,
    loggedName, loggedEmail, loggedPhone, loggedPin, userRole, userBranch, userWeek, isLoggedIn, userInitials, userName, userRoleLabel, staffCode,
    newPassword, setNewPassword, newConfirm, setNewConfirm, submitNewPassword,
    managerTab, setManagerTab, staffTab, setStaffTab, range, setRange,
    tableRecords, setTableRecords, tablesLoading,
    tableOrderRecords, setTableOrderRecords, orderingTableId, openTableOrder, closeTableOrder,
    checkoutTableId, openCheckout, closeCheckout,
    staffRecords, setStaffRecords, deleteStaffId, setDeleteStaffId, pauseStaffId, setPauseStaffId,
    staffQuery, setStaffQuery, staffFilterRole, setStaffFilterRole, staffFilterBranch, setStaffFilterBranch,
    staffProfileId, setStaffProfileId, staffCalYear, setStaffCalYear, staffCalMonth, setStaffCalMonth,
    branchRecords, setBranchRecords, branchQuery, setBranchQuery, branchFilterStatus, setBranchFilterStatus,
    branchAddOpen, setBranchAddOpen, branchAddForm, setBranchAddForm, branchAddErrors, setBranchAddErrors,
    branchProfileId, setBranchProfileId, deleteBranchId, setDeleteBranchId, toggleBranchId, setToggleBranchId,
    menuRecords, setMenuRecords, menuQuery, setMenuQuery, menuFilterCategory, setMenuFilterCategory,
    menuFilterStatus, setMenuFilterStatus, menuAddOpen, setMenuAddOpen, menuAddForm, setMenuAddForm,
    menuAddErrors, setMenuAddErrors, deleteMenuId, setDeleteMenuId,
    orderRecords, setOrderRecords, orderQuery, setOrderQuery, orderFilterStatus, setOrderFilterStatus,
    orderFilterBranch, setOrderFilterBranch, orderProfileId, setOrderProfileId, deleteOrderId, setDeleteOrderId,
    expenseRecords, setExpenseRecords, expenseQuery, setExpenseQuery, expenseFilterCategory, setExpenseFilterCategory,
    expenseAddOpen, setExpenseAddOpen, expenseAddForm, setExpenseAddForm, expenseAddErrors, setExpenseAddErrors,
    deleteExpenseId, setDeleteExpenseId,
    toastMsg, flash,
    profileOpen, profileNameDraft, setProfileNameDraft, pinDraft, setPinDraft, openProfile, openProfileFromLanding, closeProfile, saveProfile,
    securityOpen, secCurrent, setSecCurrent, secNew, setSecNew, secConfirm, setSecConfirm, secErrors,
    secSms, setSecSms, secEmail, setSecEmail, secApp, setSecApp,
    openSecurity, openSecurityFromLanding, closeSecurity, submitSecurity, goForgotPassword,
    landingAcctMenuOpen, setLandingAcctMenuOpen
  };

  return (
    <div>
      {page === 'landing' && <Landing ctx={ctx} />}
      {page === 'menu' && <MenuPage ctx={ctx} />}
      {page === 'branches' && <BranchesPage ctx={ctx} />}
      {page === 'about' && <AboutPage ctx={ctx} />}
      {page === 'contact' && <ContactPage ctx={ctx} />}
      {(page === 'auth' || page === 'changePassword') && <Auth ctx={ctx} />}
      {page === 'dashboard' && <Dashboard ctx={ctx} />}
      <ProfileDialog ctx={ctx} />
      <SecurityDialog ctx={ctx} />
      <Toast msg={toastMsg} />
    </div>
  );
}
