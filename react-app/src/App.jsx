import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { signInWithPassword, signInWithGoogle, signUp, signOut, checkEmailExists, updatePassword, onAuthStateChange, getSession, resetPasswordForEmail, checkEmailPhoneMatch } from './lib/authApi.js';
import { getMyProfile, listProfiles, updateProfileRow, deleteProfileRow } from './lib/profilesApi.js';
import { listMenuItems } from './lib/menuApi.js';
import { listExpenses } from './lib/expensesApi.js';
import { listOrders } from './lib/ordersApi.js';
import { listTables } from './lib/tablesApi.js';
import { listActiveTableOrders } from './lib/tableOrdersApi.js';
import { listMyReservations } from './lib/reservationsApi.js';
import { listMyOrders } from './lib/customerOrdersApi.js';
import CustomerDashboard from './CustomerDashboard.jsx';
import InternalHome from './InternalHome.jsx';

// Chạy `npm run dev:customer` (cổng 5173) và `npm run dev:internal` (cổng 5174) để có 2 web
// localhost tách biệt từ CÙNG một source code — không viết trùng lặp component. APP_MODE đọc
// từ cờ --mode của Vite; `npm run dev`/`npm run build` bình thường (không set --mode) mặc định
// coi là 'customer' — chỉ web chạy đúng bằng dev:internal mới mở khu vực nội bộ.
const APP_MODE = import.meta.env.MODE === 'internal' ? 'internal' : 'customer';
const CUSTOMER_ORIGIN = 'http://localhost:5173';
const INTERNAL_ORIGIN = 'http://localhost:5174';
const CUSTOMER_ONLY_PAGES = ['landing', 'menu', 'branches', 'about', 'contact', 'signup', 'account'];

// Ánh xạ URL thật -> giá trị "page" nội bộ (thuần, không phụ thuộc state) — dùng để khởi
// tạo page đúng ngay từ URL lúc mở app (deep link / F5), tránh nhấp nháy điều hướng về "/".
// /quan-tri (Quản lý) và /pos (Nhân viên/Thu ngân/Bếp) đều render Dashboard — Dashboard.jsx
// tự phân biệt giao diện theo vai trò (ctx.userRole), không cần tách "page" riêng cho mỗi cổng.
// "/" tự khác nhau theo cổng: web khách hàng ("/") ra trang chủ marketing như cũ; web nội bộ
// ra một trang chủ tối giản riêng (internalHome) rồi mới có nút vào form đăng nhập — không tự
// nhảy thẳng vào form đăng nhập ngay khi mở web nội bộ.
function pageForPath(pathname) {
  if (pathname.startsWith('/thuc-don')) return 'menu';
  if (pathname.startsWith('/chi-nhanh')) return 'branches';
  if (pathname.startsWith('/ve-chung-toi')) return 'about';
  if (pathname.startsWith('/lien-he')) return 'contact';
  if (pathname.startsWith('/dang-ky')) return 'signup';
  if (pathname.startsWith('/quen-mat-khau')) return 'forgotPassword';
  if (pathname.startsWith('/dang-nhap')) return 'auth';
  if (pathname.startsWith('/doi-mat-khau')) return 'changePassword';
  if (pathname.startsWith('/app')) return 'account';
  if (pathname.startsWith('/quan-tri') || pathname.startsWith('/pos')) return 'dashboard';
  if (pathname === '/' || pathname === '') return APP_MODE === 'internal' ? 'internalHome' : 'landing';
  return APP_MODE === 'internal' ? 'internalHome' : 'landing';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // page routing — vẫn giữ nguyên "page" làm nguồn sự thật nội bộ (mọi goXxx()/setPage() hiện
  // có không đổi gì cả); hai effect phía dưới (sau khi đã có đủ userRole/isLoggedIn) chỉ đồng
  // bộ hai chiều giữa "page" và URL thật trên thanh địa chỉ.
  const [page, setPage] = useState(() => pageForPath(window.location.pathname));
  // Lưu lựa chọn giao diện sáng/tối vào localStorage — nếu không, mỗi lần trang tải lại
  // (F5, hoặc dev server tự load lại khi sửa code) sẽ quay về màu nền sáng mặc định.
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('duyenphan_theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });

  // login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [authLoading, setAuthLoading] = useState(false);

  // đăng ký (signup) — chỉ dành cho khách hàng, xem submitSignup() bên dưới. Web nội bộ không
  // có đăng ký công khai; tài khoản Nhân viên/Thu ngân/Bếp/Quản lý chỉ do một Quản lý đã đăng
  // nhập cấp qua trang "Nhân viên" (Edge Function create-staff), không qua form này.
  // Số điện thoại bắt buộc lúc đăng ký — dùng để xác minh đúng chủ tài khoản, không phải chỉ
  // để liên hệ. Lưu vào profiles.phone qua user_metadata (trigger handle_new_user đọc sẵn).
  const [signupPhone, setSignupPhone] = useState('');
  const [signupNotice, setSignupNotice] = useState('');

  // quên mật khẩu (chỉ có đường email — miễn phí qua Supabase Auth; SMS cần nhà cung cấp trả
  // phí nên chưa làm, xem lib/authApi.js#resetPasswordForEmail). Bắt buộc nhập đúng cả email
  // lẫn SĐT đã đăng ký (kiểm tra qua RPC email_phone_match) mới được gửi — thêm một lớp xác
  // minh đúng chủ tài khoản, không phải ai biết email cũng tự ý reset được mật khẩu người khác.
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // session
  const [loggedId, setLoggedId] = useState('');
  const [loggedName, setLoggedName] = useState('');
  const [loggedEmail, setLoggedEmail] = useState('');
  const [loggedPhone, setLoggedPhone] = useState('');
  const [loggedPin, setLoggedPin] = useState('');
  const [loggedAvatarUrl, setLoggedAvatarUrl] = useState('');
  const [loggedSalary, setLoggedSalary] = useState(0);
  const [userRole, setUserRole] = useState('Quản lý');
  const [userBranch, setUserBranch] = useState('');
  const [userWeek, setUserWeek] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // khách hàng (Cổng khách hàng) — phiên riêng, tách khỏi isLoggedIn ("đang ở trong hệ
  // thống quản trị") vì một tài khoản customer không bao giờ được vào dashboard nội bộ.
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [cart, setCart] = useState([]); // [{ id, name, price, quantity }]
  const [myReservations, setMyReservations] = useState([]);
  const [myCustomerOrders, setMyCustomerOrders] = useState([]);
  // Tab đang mở trong Cổng khách hàng (/app) — nâng lên đây (thay vì state cục bộ trong
  // CustomerDashboard.jsx) để trang chủ có thể điều hướng thẳng tới đúng tab (goReservation/
  // goOrderFood bên dưới), giống cách các trang khác trong app đã nâng state lên App.jsx.
  const [customerDashboardTab, setCustomerDashboardTab] = useState('menu'); // menu | reservation | orders
  // Nhớ lại "khách đang định vào /app" khi họ bấm Đặt bàn/Đặt món lúc CHƯA đăng nhập, để sau
  // khi đăng nhập/đăng ký xong tự vào thẳng /app thay vì bị đưa về trang chủ như luồng thường.
  const [pendingCustomerPage, setPendingCustomerPage] = useState(null);

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
  // Đặt bàn / đơn đặt món của khách hàng chỉ tải sau khi đăng nhập Cổng khách hàng — RLS
  // (xem supabase/023_customer_portal.sql) chỉ trả về đúng dữ liệu của tài khoản đang gọi.
  useEffect(() => {
    if (!supabaseEnabled || !isCustomerLoggedIn) return;
    listMyReservations().then(setMyReservations).catch(err => console.error('[Supabase] Không tải được đặt bàn của tôi:', err));
    listMyOrders().then(setMyCustomerOrders).catch(err => console.error('[Supabase] Không tải được đơn của tôi:', err));
  }, [isCustomerLoggedIn]);

  // Đọc hồ sơ (profiles) cho một user Supabase Auth đã đăng nhập rồi bật đúng state/trang
  // tương ứng — dùng chung cho cả đăng nhập bằng mật khẩu (submitLogin) lẫn đăng nhập Google
  // (submitGoogleLogin, xem effect bên dưới), vì cả hai chỉ khác nhau ở CÁCH lấy được user,
  // còn "có user rồi thì làm gì" là y hệt nhau.
  const appliedSessionRef = useRef(null);
  async function applySessionUser(user) {
    if (appliedSessionRef.current === user.id) return; // đã xử lý user này rồi, tránh chạy 2 lần
    appliedSessionRef.current = user.id;

    let profile = null;
    try { profile = await getMyProfile(user.id); } catch (err) { console.error('[Supabase] Không tải được hồ sơ nhân sự:', err); }

    if (!profile) {
      await signOut();
      appliedSessionRef.current = null;
      setErrors({ password: 'Không tìm thấy hồ sơ nhân sự cho tài khoản này — có thể đã bị xoá. Liên hệ quản lý.' });
      setAuthLoading(false);
      return;
    }

    // Web nội bộ tuyệt đối không cho tài khoản khách hàng vào — kể cả khi họ vô tình đăng nhập
    // đúng email/mật khẩu của mình ở nhầm cổng 5174. Đăng xuất ngay, không set bất kỳ state nào.
    if (APP_MODE === 'internal' && profile.role === 'customer') {
      await signOut();
      appliedSessionRef.current = null;
      setErrors({ password: 'Tài khoản khách hàng không thể đăng nhập ở đây. Vui lòng dùng trang web dành cho khách hàng.' });
      setAuthLoading(false);
      return;
    }

    // Chiều ngược lại: tài khoản Quản lý/Nhân viên/Thu ngân/Bếp lỡ đăng nhập ở cổng khách hàng
    // (5173) — cổng này không có trang quản trị nào để vào, trước đây sẽ âm thầm bị đưa về lại
    // trang chủ (rất dễ hiểu nhầm là "đăng nhập không vào được"). Báo rõ và chỉ đúng cổng cần dùng.
    if (APP_MODE === 'customer' && profile.role !== 'customer') {
      await signOut();
      appliedSessionRef.current = null;
      setErrors({ password: `Tài khoản ${profile.role} chỉ đăng nhập được ở trang quản trị nội bộ (${INTERNAL_ORIGIN}), không phải trang khách hàng này.` });
      setAuthLoading(false);
      return;
    }

    const fallbackName = user.email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (profile.role === 'customer') {
      setLoggedId(user.id);
      setLoggedEmail(user.email);
      setLoggedName(profile.name || fallbackName);
      setLoggedPhone(profile.phone || '');
      setUserRole('customer');
      setIsCustomerLoggedIn(true);
      setAuthLoading(false);
      setPassword('');
      // Nếu khách bấm Đặt bàn/Đặt món lúc chưa đăng nhập (goReservation/goOrderFood đã ghi
      // pendingCustomerPage='account' trước khi bị đưa sang màn đăng nhập), vào thẳng /app
      // đúng tab đã chọn thay vì về trang chủ. Ngược lại, chỉ ép về "landing" khi đây là lần
      // đăng nhập chủ động (đang đứng ở màn hình đăng nhập/đăng ký) — nếu đang khôi phục phiên
      // có sẵn từ một đường dẫn sâu (ví dụ mở thẳng /app khi đã đăng nhập từ trước), giữ
      // nguyên trang đang đứng, không nhảy về trang chủ.
      if (pendingCustomerPage) {
        setPage(pendingCustomerPage);
        setPendingCustomerPage(null);
      } else {
        setPage(prev => (prev === 'auth' || prev === 'signup' ? 'landing' : prev));
      }
      flash('Đăng nhập thành công. Chào mừng bạn quay lại Duyên Phần.');
      return;
    }

    setLoggedId(user.id);
    setLoggedEmail(user.email);
    setLoggedName((profile && profile.name) || fallbackName);
    setLoggedPhone((profile && profile.phone) || '');
    setLoggedPin((profile && profile.approvalPin) || '');
    setLoggedAvatarUrl((profile && profile.avatarUrl) || '');
    setUserRole((profile && profile.role) || 'Quản lý');
    setUserBranch((profile && profile.branch) || '');
    setUserWeek((profile && profile.week) || null);
    setLoggedSalary((profile && profile.salary) || 0);
    setAuthLoading(false);

    if (profile && profile.mustChangePassword) {
      setPage('changePassword');
      return;
    }
    setIsLoggedIn(true);
    setPage('dashboard');
  }

  // Đăng nhập Google điều hướng cả trang ra ngoài rồi quay lại (không phải gọi API trong
  // lúc app vẫn mở) — nên không thể xử lý kết quả ngay sau lời gọi như submitLogin. Thay vào
  // đó: kiểm tra một lần lúc mở app (getSession, bắt cả trường hợp tải lại trang khi đã có
  // phiên) và lắng nghe onAuthStateChange (bắt đúng lúc Supabase phát hiện phiên mới từ URL
  // sau khi Google chuyển hướng về).
  // true khi lần kiểm tra phiên đăng nhập đầu tiên (getSession) đã xong — dùng để chặn effect
  // "route guard" bên dưới không redirect nhầm về /dang-nhap trong lúc còn đang chờ kết quả.
  const [sessionChecked, setSessionChecked] = useState(false);
  // React StrictMode (dev) chạy effect này 2 lần khi mount — dùng ref để đảm bảo getSession()
  // chỉ thực sự khởi động một lần duy nhất. Nếu không, lần chạy "thừa" có thể tự thấy user đã
  // được applySessionUser xử lý (qua appliedSessionRef) và báo xong ngay lập tức, khiến
  // sessionChecked bật true SỚM HƠN lần chạy thật (vẫn đang chờ getMyProfile) — kéo theo route
  // guard hiểu nhầm là "đã kiểm tra xong, chưa đăng nhập" và redirect nhầm về /dang-nhap.
  const sessionCheckStartedRef = useRef(false);
  useEffect(() => {
    if (!supabaseEnabled) { setSessionChecked(true); return; }
    if (!sessionCheckStartedRef.current) {
      sessionCheckStartedRef.current = true;
      getSession()
        .then(async session => { if (session && session.user) await applySessionUser(session.user); })
        .finally(() => setSessionChecked(true));
    }
    const { data: sub } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && session.user) applySessionUser(session.user);
      // Người dùng vừa bấm link "đặt lại mật khẩu" trong email (resetPasswordForEmail) — Supabase
      // tự tạo một phiên đăng nhập tạm thời cho họ và phát sự kiện này. Đưa thẳng vào màn "Đổi
      // mật khẩu mới" (submitNewPassword ở dưới gọi updatePassword(), có phiên tạm này là đủ),
      // KHÔNG chạy applySessionUser() (không cần tra hồ sơ/điều hướng theo vai trò ở bước này).
      if (event === 'PASSWORD_RECOVERY') { setErrors({}); setPage('changePassword'); }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // page -> URL (đăng nhập, goXxx()... đổi "page" thì URL thật trên thanh địa chỉ đổi theo)
  function pathForPage(pg) {
    switch (pg) {
      case 'menu': return '/thuc-don';
      case 'branches': return '/chi-nhanh';
      case 'about': return '/ve-chung-toi';
      case 'contact': return '/lien-he';
      case 'signup': return '/dang-ky';
      case 'auth': return '/dang-nhap';
      case 'forgotPassword': return '/quen-mat-khau';
      case 'changePassword': return '/doi-mat-khau';
      case 'account': return '/app';
      case 'dashboard': return userRole === 'Quản lý' ? '/quan-tri' : '/pos';
      case 'internalHome': return '/';
      default: return '/';
    }
  }
  useEffect(() => {
    const target = pathForPage(page);
    if (location.pathname !== target) navigate(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, userRole]);

  // URL -> page (gõ thẳng URL, nút back/forward, F5 giữa chừng)
  useEffect(() => {
    const derived = pageForPath(location.pathname);
    if (derived !== page) setPage(derived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Chặn truy cập thẳng URL nội bộ (/quan-tri, /pos, /app) khi chưa đăng nhập — chỉ chạy sau
  // khi đã biết chắc kết quả kiểm tra phiên đăng nhập (sessionChecked), tránh redirect nhầm
  // trong lúc Google OAuth/getSession còn đang xử lý.
  // Web nội bộ: gõ thẳng /quan-tri hay /pos khi chưa đăng nhập phải về TRANG CHỦ nội bộ trước
  // (không nhảy thẳng vào form đăng nhập) — chỉ khi tự bấm nút "Đăng nhập" ở trang chủ đó mới
  // sang /dang-nhap. Web khách hàng vẫn giữ hành vi cũ (thẳng /dang-nhap) vì /app không có một
  // "trang chủ nội bộ" riêng để về, trang chủ khách hàng ("/") vốn đã luôn hiện trước rồi.
  useEffect(() => {
    if (!sessionChecked) return;
    if (page === 'dashboard' && !isLoggedIn) {
      setPage(APP_MODE === 'internal' ? 'internalHome' : 'auth');
      return;
    }
    if (page === 'account' && !isCustomerLoggedIn) { setPage('auth'); return; }
  }, [sessionChecked, page, isLoggedIn, isCustomerLoggedIn]);

  // Web nội bộ (dev:internal, cổng 5174) chỉ hiện đăng nhập + /quan-tri + /pos, không có trang
  // công khai nào. Web khách hàng (dev:customer, cổng 5173) không có khu vực nội bộ — lỡ ai gõ
  // thẳng /quan-tri hay /pos trên web khách hàng cũng chỉ quay lại trang chủ, không vào được.
  useEffect(() => {
    if (APP_MODE === 'internal') {
      if (CUSTOMER_ONLY_PAGES.includes(page)) { setPage(isLoggedIn ? 'dashboard' : 'internalHome'); }
      return;
    }
    if (APP_MODE === 'customer' && page === 'dashboard') { setPage('landing'); }
  }, [page, isLoggedIn]);

  async function submitGoogleLogin() {
    if (!supabaseEnabled) {
      setErrors({ password: 'Chưa cấu hình Supabase Auth — xem HUONG_DAN_SUPABASE.md' });
      return;
    }
    setErrors({});
    const { error } = await signInWithGoogle();
    // Nếu thành công, trình duyệt điều hướng sang Google ngay ở dòng trên — không có gì chạy
    // tiếp ở đây nữa. Chỉ khi Supabase từ chối yêu cầu ngay lập tức (ví dụ Google provider
    // chưa bật trong Dashboard) mới rơi xuống được đây để hiển thị lỗi.
    if (error) setErrors({ password: error.message });
  }

  function addToCart(item) {
    setCart(prev => {
      const found = prev.find(c => c.id === item.id);
      if (found) return prev.map(c => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }
  function updateCartQty(id, quantity) {
    setCart(prev => (quantity <= 0 ? prev.filter(c => c.id !== id) : prev.map(c => (c.id === id ? { ...c, quantity } : c))));
  }
  function removeFromCart(id) { setCart(prev => prev.filter(c => c.id !== id)); }
  function clearCart() { setCart([]); }
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.quantity * c.price, 0);
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
  const [orderAddOpen, setOrderAddOpen] = useState(false);
  const [orderAddForm, setOrderAddForm] = useState(null);
  const [orderAddErrors, setOrderAddErrors] = useState({});

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
  const userRoleLabel = userRole === 'customer' ? 'Khách hàng' : userRole === 'Nhân viên' ? 'Nhân viên' : userRole === 'Thu ngân' ? 'Thu ngân' : userRole === 'Bếp' ? 'Bếp' : 'Quản lý chuỗi';
  const staffCode = loggedId ? (userRole === 'customer' ? 'KH-' : 'NV-') + loggedId.slice(0, 6).toUpperCase() : '';

  function goAuth(e) {
    if (e) e.preventDefault();
    setLandingAcctMenuOpen(false);
    if (isLoggedIn) { setPage('dashboard'); return; }
    if (isCustomerLoggedIn) { setPage('account'); return; }
    setPage('auth'); setErrors({});
  }
  function goAccount(e) { if (e) e.preventDefault(); setLandingAcctMenuOpen(false); setPage('account'); window.scrollTo(0, 0); }
  // Đặt bàn/Đặt món từ trang chủ — mở thẳng đúng tab trong Cổng khách hàng (/app). Nếu chưa
  // đăng nhập, effect chặn "account" ở dưới sẽ tự đưa sang màn đăng nhập; ghi nhớ ý định qua
  // pendingCustomerPage để applySessionUser (đăng nhập) và submitSignup (đăng ký) biết đường
  // quay lại đúng /app thay vì mặc định về trang chủ.
  function goReservation(e) {
    if (e) e.preventDefault();
    setLandingAcctMenuOpen(false);
    setCustomerDashboardTab('reservation');
    if (!isCustomerLoggedIn) setPendingCustomerPage('account');
    setPage('account');
    window.scrollTo(0, 0);
  }
  function goOrderFood(e) {
    if (e) e.preventDefault();
    setLandingAcctMenuOpen(false);
    setCustomerDashboardTab('menu');
    if (!isCustomerLoggedIn) setPendingCustomerPage('account');
    setPage('account');
    window.scrollTo(0, 0);
  }
  // Web nội bộ không có "landing" (trang này nằm trong CUSTOMER_ONLY_PAGES) — nếu set 'landing'
  // lúc đang đăng nhập (isLoggedIn=true), effect chặn CUSTOMER_ONLY_PAGES ở trên sẽ tự đưa
  // thẳng về lại 'dashboard', khiến bấm logo "Duyên Phần" trong Dashboard.jsx tưởng như không
  // có tác dụng gì. Đi thẳng đúng "trang chủ" theo từng cổng: internalHome cho web nội bộ,
  // landing cho web khách hàng — không cần đợi effect đó chữa cháy nữa.
  function goLanding() { setPage(APP_MODE === 'internal' ? 'internalHome' : 'landing'); }
  function goSignup(e) { if (e) e.preventDefault(); setErrors({}); setSignupNotice(''); setPage('signup'); }
  function goLoginFromSignup(e) { if (e) e.preventDefault(); setErrors({}); setPage('auth'); }
  function goForgotPasswordPublic(e) { if (e) e.preventDefault(); setErrors({}); setForgotNotice(''); setForgotEmail(email.trim()); setForgotPhone(''); setPage('forgotPassword'); }
  async function submitForgotPassword() {
    const trimmedEmail = forgotEmail.trim();
    const trimmedPhone = forgotPhone.trim();
    const errs = {};
    if (!trimmedEmail) errs.forgotEmail = 'Nhập email';
    if (!trimmedPhone) errs.forgotPhone = 'Nhập số điện thoại đã đăng ký';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!supabaseEnabled) { setErrors({ forgotEmail: 'Chưa cấu hình Supabase Auth' }); return; }

    setErrors({}); setForgotLoading(true);

    // Điều kiện xác minh: phải đúng cả email LẪN số điện thoại đã đăng ký mới được gửi email
    // đặt lại mật khẩu — chỉ biết email thôi (dễ đoán/dễ lộ) là không đủ. RPC chỉ trả về
    // true/false, không lộ thêm dữ liệu nào khác (xem supabase/026_forgot_password_phone_check.sql).
    let matched = false;
    try { matched = await checkEmailPhoneMatch(trimmedEmail, trimmedPhone); }
    catch (err) {
      console.error('[Supabase] Không kiểm tra được email/SĐT:', err);
      setForgotLoading(false);
      setErrors({ forgotPhone: 'Chưa cấu hình được bước xác minh này trên máy chủ. Chạy migration 026_forgot_password_phone_check.sql trên Supabase rồi thử lại.' });
      return;
    }

    if (!matched) {
      setForgotLoading(false);
      setErrors({ forgotPhone: 'Email và số điện thoại không khớp với tài khoản nào trong hệ thống.' });
      return;
    }

    const { error } = await resetPasswordForEmail(trimmedEmail, window.location.origin + '/doi-mat-khau');
    setForgotLoading(false);
    if (error) { setErrors({ forgotEmail: error.message }); return; }
    setForgotNotice(`Đã gửi email đặt lại mật khẩu tới ${trimmedEmail}. Kiểm tra hộp thư (kể cả mục spam).`);
  }
  function goMenu(e) { if (e) e.preventDefault(); setPage('menu'); window.scrollTo(0, 0); }
  function goBranchesPublic(e) { if (e) e.preventDefault(); setPage('branches'); window.scrollTo(0, 0); }
  function goAbout(e) { if (e) e.preventDefault(); setPage('about'); window.scrollTo(0, 0); }
  function goContact(e) { if (e) e.preventDefault(); setPage('contact'); window.scrollTo(0, 0); }
  function toggleTheme() {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('duyenphan_theme', next); } catch { /* ignore */ }
      return next;
    });
  }
  function logout() {
    const wasCustomer = isCustomerLoggedIn;
    signOut();
    // Xoá luôn "đã xử lý user này rồi" (xem applySessionUser) — nếu không, đăng nhập lại
    // ĐÚNG tài khoản vừa đăng xuất sẽ bị applySessionUser coi là user cũ đã xử lý và return
    // sớm, không setAuthLoading(false)/setIsLoggedIn(true) — kẹt mãi ở nút "Đang..." trên
    // form đăng nhập.
    appliedSessionRef.current = null;
    setPassword(''); setErrors({}); setIsLoggedIn(false);
    setIsCustomerLoggedIn(false); setCart([]); setMyReservations([]); setMyCustomerOrders([]);
    setPage(wasCustomer ? 'landing' : 'auth');
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

    await applySessionUser(data.user);
  }

  async function submitSignup() {
    const trimmedEmail = email.trim();
    const trimmedPhone = signupPhone.trim();
    const errs = {};
    if (!trimmedEmail) errs.email = 'Nhập email';
    if (!password.trim()) errs.password = 'Nhập mật khẩu';
    else if (password.length < 8) errs.password = 'Cần tối thiểu 8 ký tự';
    // Bắt buộc SĐT lúc đăng ký — dùng để xác minh đúng chủ tài khoản (không cho người khác tự
    // ý tạo tài khoản giả danh), và là kênh dự phòng cho tính năng khôi phục tài khoản sau này.
    if (!trimmedPhone) errs.signupPhone = 'Nhập số điện thoại';
    else if (!/^0\d{9,10}$/.test(trimmedPhone)) errs.signupPhone = 'Số điện thoại không hợp lệ';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!supabaseEnabled) {
      setErrors({ password: 'Chưa cấu hình Supabase Auth — xem HUONG_DAN_SUPABASE.md' });
      return;
    }

    setErrors({}); setSignupNotice(''); setAuthLoading(true);

    // Đăng ký công khai chỉ tạo tài khoản khách hàng — KHÔNG gửi admin_token hay role: dù
    // trigger handle_new_user() phía CSDL (xem supabase/022_signup_admin_token.sql) có cơ chế
    // nhận admin_token để gán vai trò nội bộ, form đăng ký công khai không còn đường nào để
    // gửi giá trị đó nữa. Tài khoản Nhân viên/Thu ngân/Bếp/Quản lý chỉ do một Quản lý đã đăng
    // nhập cấp qua trang "Nhân viên" (Edge Function create-staff). "phone" thì trigger đã đọc
    // sẵn từ user_metadata (xem 022_signup_admin_token.sql) để lưu vào profiles.phone.
    const { data, error } = await signUp(trimmedEmail, password, { phone: trimmedPhone });

    if (error) {
      const msg = /already.*registered|already.*exists/i.test(error.message)
        ? 'Email này đã có tài khoản trong hệ thống.'
        : error.message;
      setErrors({ email: msg });
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);

    if (!data.session) {
      // Dự án đang bật xác nhận email — chưa có phiên đăng nhập ngay, phải xác nhận qua email.
      setSignupNotice(`Đã gửi email xác nhận tới ${trimmedEmail}. Vui lòng kiểm tra hộp thư rồi đăng nhập lại.`);
      setPassword(''); setSignupPhone('');
      setPage('auth');
      return;
    }

    // Dự án tắt xác nhận email -> có phiên ngay. Đăng ký công khai luôn là khách hàng.
    let profile = null;
    try { profile = await getMyProfile(data.user.id); } catch (err) { console.error('[Supabase] Không tải được hồ sơ vừa tạo:', err); }

    setPassword(''); setSignupPhone('');
    setLoggedId(data.user.id);
    setLoggedEmail(data.user.email);
    setLoggedName((profile && profile.name) || trimmedEmail.split('@')[0]);
    setLoggedPhone((profile && profile.phone) || '');
    setUserRole('customer');
    setIsCustomerLoggedIn(true);
    setPendingCustomerPage(null);
    setPage('account');
    flash('Đăng ký thành công. Chào mừng bạn đến với Duyên Phần.');
  }

  async function submitNewPassword() {
    const errs = {};
    if (!newPassword.trim()) errs.newPassword = 'Nhập mật khẩu mới';
    else if (newPassword.length < 8) errs.newPassword = 'Cần tối thiểu 8 ký tự';
    if (newConfirm !== newPassword) errs.newConfirm = 'Mật khẩu xác nhận không khớp';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!supabaseEnabled) {
      setPage('dashboard'); setNewPassword(''); setNewConfirm(''); setErrors({}); setIsLoggedIn(true);
      return;
    }

    setAuthLoading(true);
    const { error } = await updatePassword(newPassword);
    if (error) { setErrors({ newPassword: error.message }); setAuthLoading(false); return; }

    // Hai đường tới màn này: (1) nhân viên bị bắt đổi mật khẩu lần đầu — loggedId/userRole đã
    // có sẵn từ applySessionUser(); (2) khách hàng bấm link "quên mật khẩu" trong email —
    // PASSWORD_RECOVERY không chạy applySessionUser() nên chưa biết là ai, phải tự tra lại.
    let role = userRole;
    if (!loggedId) {
      const session = await getSession();
      if (session && session.user) {
        try {
          const profile = await getMyProfile(session.user.id);
          role = (profile && profile.role) || 'customer';
          setLoggedId(session.user.id);
          setLoggedEmail(session.user.email);
          setLoggedName((profile && profile.name) || '');
          setLoggedPhone((profile && profile.phone) || '');
          setUserRole(role);
          setUserBranch((profile && profile.branch) || '');
        } catch (err) { console.error('[Supabase] Không tải được hồ sơ sau khi đổi mật khẩu:', err); role = 'customer'; }
      }
    } else {
      try { await updateProfileRow(loggedId, { mustChangePassword: false }); }
      catch (err) { console.error('[Supabase] Không xoá được cờ bắt buộc đổi mật khẩu:', err); }
    }

    setAuthLoading(false);
    setNewPassword(''); setNewConfirm(''); setErrors({});

    if (role === 'customer') {
      setIsCustomerLoggedIn(true);
      setPage('landing');
      flash('Đã đổi mật khẩu thành công.');
    } else {
      setIsLoggedIn(true);
      setPage('dashboard');
    }
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
    page, setPage, theme, toggleTheme, goAuth, goLanding, goMenu, goBranchesPublic, goAbout, goContact, goAccount, logout, switchAccount,
    goSignup, goLoginFromSignup, goReservation, goOrderFood,
    isCustomerLoggedIn, cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartTotal,
    myReservations, setMyReservations, myCustomerOrders, setMyCustomerOrders,
    customerDashboardTab, setCustomerDashboardTab,
    email, setEmail, password, setPassword, remember, setRemember, errors, setErrors,
    submitLogin, submitGoogleLogin, authLoading,
    signupPhone, setSignupPhone, signupNotice, submitSignup,
    forgotEmail, setForgotEmail, forgotPhone, setForgotPhone, forgotNotice, forgotLoading, submitForgotPassword, goForgotPasswordPublic,
    loggedId, loggedName, loggedEmail, loggedPhone, loggedPin, loggedAvatarUrl, setLoggedAvatarUrl, loggedSalary, userRole, userBranch, userWeek, setUserWeek, isLoggedIn, userInitials, userName, userRoleLabel, staffCode,
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
    orderAddOpen, setOrderAddOpen, orderAddForm, setOrderAddForm, orderAddErrors, setOrderAddErrors,
    expenseRecords, setExpenseRecords, expenseQuery, setExpenseQuery, expenseFilterCategory, setExpenseFilterCategory,
    expenseAddOpen, setExpenseAddOpen, expenseAddForm, setExpenseAddForm, expenseAddErrors, setExpenseAddErrors,
    deleteExpenseId, setDeleteExpenseId,
    toastMsg, flash,
    profileOpen, profileNameDraft, setProfileNameDraft, pinDraft, setPinDraft, openProfile, openProfileFromLanding, closeProfile, saveProfile,
    securityOpen, secCurrent, setSecCurrent, secNew, setSecNew, secConfirm, setSecConfirm, secErrors,
    secSms, setSecSms, secEmail, setSecEmail, secApp, setSecApp,
    openSecurity, openSecurityFromLanding, closeSecurity, submitSecurity, goForgotPassword,
    landingAcctMenuOpen, setLandingAcctMenuOpen,
    appMode: APP_MODE, customerOrigin: CUSTOMER_ORIGIN, internalOrigin: INTERNAL_ORIGIN
  };

  return (
    <div>
      {page === 'landing' && <Landing ctx={ctx} />}
      {page === 'internalHome' && <InternalHome ctx={ctx} />}
      {page === 'menu' && <MenuPage ctx={ctx} />}
      {page === 'branches' && <BranchesPage ctx={ctx} />}
      {page === 'about' && <AboutPage ctx={ctx} />}
      {page === 'contact' && <ContactPage ctx={ctx} />}
      {(page === 'auth' || page === 'signup' || page === 'changePassword' || page === 'forgotPassword') && <Auth ctx={ctx} />}
      {page === 'dashboard' && <Dashboard ctx={ctx} />}
      {page === 'account' && <CustomerDashboard ctx={ctx} />}
      <ProfileDialog ctx={ctx} />
      <SecurityDialog ctx={ctx} />
      <Toast msg={toastMsg} />
    </div>
  );
}
