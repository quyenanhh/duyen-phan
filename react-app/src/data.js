export const BRANCH_STATUS_STYLE = { open: ['#E7ECE5', '#2E3B35', 'Đang mở'], closed: ['#F6DED7', '#8E3421', 'Tạm đóng'] };

export const BRANCH_LIST = [
  { name: 'Quận 3 — Võ Văn Tần', address: '182 Võ Văn Tần, Phường 5, Quận 3, TP.HCM', manager: 'Đặng Thị Hồng Nhung', phone: '028 3930 1182', hours: '06:30 – 21:00', opened: '14/02/2021', status: 'open', staffCount: 9 },
  { name: 'Quận 1 — Lê Lợi', address: '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM', manager: 'Trịnh Quốc Bảo', phone: '028 3822 4567', hours: '06:00 – 21:30', opened: '03/06/2020', status: 'open', staffCount: 11 },
  { name: 'Tân Bình — Hoàng Việt', address: '76 Hoàng Việt, Phường 4, Tân Bình, TP.HCM', manager: 'Lâm Thu Hà', phone: '028 3811 9034', hours: '06:30 – 20:30', opened: '19/09/2021', status: 'open', staffCount: 7 },
  { name: 'Thủ Đức — Kha Vạn Cân', address: '210 Kha Vạn Cân, Linh Đông, Thủ Đức, TP.HCM', manager: 'Ngô Minh Tuấn', phone: '028 3897 2251', hours: '06:30 – 21:00', opened: '11/01/2022', status: 'open', staffCount: 8 },
  { name: 'Phú Nhuận — Phan Xích Long', address: '58 Phan Xích Long, Phường 2, Phú Nhuận, TP.HCM', manager: 'Bùi Thị Kim Ngân', phone: '028 3995 6673', hours: '06:30 – 21:00', opened: '27/03/2022', status: 'open', staffCount: 8 },
  { name: 'Quận 5 — Nguyễn Trãi', address: '320 Nguyễn Trãi, Phường 8, Quận 5, TP.HCM', manager: 'Trần Gia Huy', phone: '028 3855 4419', hours: '06:00 – 20:30', opened: '05/05/2022', status: 'open', staffCount: 6 },
  { name: 'Quận 7 — Nguyễn Thị Thập', address: '89 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM', manager: 'Phạm Anh Thư', phone: '028 3775 2298', hours: '06:30 – 21:30', opened: '18/08/2022', status: 'open', staffCount: 9 },
  { name: 'Quận 10 — Sư Vạn Hạnh', address: '412 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', manager: 'Đỗ Văn Khiêm', phone: '028 3863 7710', hours: '06:00 – 20:30', opened: '02/11/2022', status: 'closed', staffCount: 5 },
  { name: 'Bình Thạnh — Điện Biên Phủ', address: '155 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM', manager: 'Vũ Thị Ngọc Lan', phone: '028 3512 8834', hours: '06:30 – 21:00', opened: '20/01/2023', status: 'open', staffCount: 7 },
  { name: 'Gò Vấp — Quang Trung', address: '267 Quang Trung, Phường 10, Gò Vấp, TP.HCM', manager: 'Nguyễn Hữu Phát', phone: '028 3894 4456', hours: '06:30 – 20:30', opened: '14/04/2023', status: 'open', staffCount: 6 },
  { name: 'Bình Tân — Kinh Dương Vương', address: '520 Kinh Dương Vương, Bình Trị Đông, Bình Tân, TP.HCM', manager: 'Lê Thị Mỹ Duyên', phone: '028 3760 3321', hours: '06:00 – 20:00', opened: '09/07/2023', status: 'open', staffCount: 6 },
  { name: 'Quận 4 — Nguyễn Tất Thành', address: '98 Nguyễn Tất Thành, Phường 12, Quận 4, TP.HCM', manager: 'Hoàng Đức Anh', phone: '028 3943 2287', hours: '06:30 – 20:30', opened: '25/11/2023', status: 'closed', staffCount: 4 }
].map((b, i) => ({ ...b, id: i + 1 }));

export const BRANCHES = BRANCH_LIST.map(b => b.name);

export const MENU_CATEGORIES = ['Cơm phần', 'Món mặn chay', 'Canh & súp', 'Tráng miệng', 'Nước uống'];
export const MENU_STATUS_STYLE = { available: ['#E7ECE5', '#2E3B35', 'Còn hàng'], soldout: ['#F6DED7', '#8E3421', 'Hết hàng'] };

export const MENU_ITEMS = [
  { name: 'Cơm phần đậu hũ sả ớt', category: 'Cơm phần', price: 45000, status: 'available', desc: 'Cơm trắng, đậu hũ chiên sả ớt, rau luộc và canh ngày.' },
  { name: 'Cơm phần nấm kho tiêu', category: 'Cơm phần', price: 48000, status: 'available', desc: 'Nấm bào ngư kho tiêu, cơm trắng, dưa leo và canh ngày.' },
  { name: 'Cơm phần chả giò chay', category: 'Cơm phần', price: 50000, status: 'available', desc: 'Chả giò chay chiên giòn, bún, rau sống, nước chấm chay.' },
  { name: 'Đậu hũ sốt cà chua', category: 'Món mặn chay', price: 38000, status: 'available', desc: 'Đậu hũ non sốt cà chua, dùng kèm cơm hoặc bún.' },
  { name: 'Nấm kho tộ', category: 'Món mặn chay', price: 42000, status: 'available', desc: 'Nấm đùi gà kho tộ đậm vị, ăn kèm cơm trắng.' },
  { name: 'Rau củ xào thập cẩm', category: 'Món mặn chay', price: 36000, status: 'soldout', desc: 'Bông cải, cà rốt, nấm, đậu que xào tỏi.' },
  { name: 'Canh chua chay', category: 'Canh & súp', price: 25000, status: 'available', desc: 'Canh chua dứa, đậu bắp, cà chua, giá đỗ.' },
  { name: 'Canh bí đỏ nấu đậu phộng', category: 'Canh & súp', price: 22000, status: 'available', desc: 'Bí đỏ hầm mềm cùng đậu phộng, nêm nhạt.' },
  { name: 'Súp nấm bốn mùa', category: 'Canh & súp', price: 28000, status: 'soldout', desc: 'Súp sánh nhẹ với bốn loại nấm và bắp non.' },
  { name: 'Chè đậu xanh nước cốt dừa', category: 'Tráng miệng', price: 18000, status: 'available', desc: 'Chè đậu xanh đánh nhuyễn, nước cốt dừa béo nhẹ.' },
  { name: 'Rau câu lá dứa', category: 'Tráng miệng', price: 15000, status: 'available', desc: 'Rau câu dẻo vị lá dứa, ăn kèm nước cốt dừa.' },
  { name: 'Trà đào cam sả', category: 'Nước uống', price: 25000, status: 'available', desc: 'Trà đào thanh mát cùng cam và sả tươi.' },
  { name: 'Nước sâm bí đao', category: 'Nước uống', price: 15000, status: 'available', desc: 'Nước sâm mát gan, nấu từ bí đao và mía lau.' },
  { name: 'Sữa hạt sen', category: 'Nước uống', price: 20000, status: 'soldout', desc: 'Sữa hạt sen nguyên chất, không đường tinh luyện.' }
].map((m, i) => ({ ...m, id: i + 1, visible: true }));

export const PHONE_PREFIXES = ['090', '091', '092', '093', '094', '096', '097', '098', '099', '032', '033', '034', '035', '036', '037', '038', '039', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '088', '089'];

export const RANGES = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
  { id: 'year', label: 'Năm' }
];

export const DASH_DATA = {
  today: {
    sub: '03/09/2026 · theo giờ',
    revenue: '18.420.000₫', revenueDelta: '+8,2% so với hôm qua',
    orders: '264', ordersDelta: '+12 đơn so với hôm qua',
    delivering: '4', deliveringDelta: '1 đơn quá 30 phút',
    labels: ['08h', '10h', '12h', '14h', '16h', '18h', '20h'],
    series: [8, 22, 96, 74, 38, 66, 44],
    prev: [10, 26, 88, 62, 44, 58, 40],
    branches: [['Quận 3 — Võ Văn Tần', '5.240.000₫', 100], ['Quận 1 — Lê Lợi', '4.180.000₫', 80], ['Tân Bình — Hoàng Việt', '3.020.000₫', 58], ['Thủ Đức — Kha Vạn Cân', '2.480.000₫', 47], ['Phú Nhuận — Phan Xích Long', '1.860.000₫', 36]]
  },
  week: {
    sub: '28/08 – 03/09/2026 · theo ngày',
    revenue: '124.860.000₫', revenueDelta: '+6,4% so với tuần trước',
    orders: '1.842', ordersDelta: '+96 đơn so với tuần trước',
    delivering: '4', deliveringDelta: '1 đơn quá 30 phút',
    labels: ['28/08', '29/08', '30/08', '31/08', '01/09', '02/09', '03/09'],
    series: [58, 72, 96, 88, 74, 62, 80],
    prev: [54, 66, 84, 80, 70, 58, 72],
    branches: [['Quận 3 — Võ Văn Tần', '32.480.000₫', 100], ['Quận 1 — Lê Lợi', '27.140.000₫', 84], ['Tân Bình — Hoàng Việt', '19.620.000₫', 60], ['Thủ Đức — Kha Vạn Cân', '15.280.000₫', 47], ['Phú Nhuận — Phan Xích Long', '11.940.000₫', 37]]
  },
  month: {
    sub: '01/09 – 03/09/2026 · theo tuần',
    revenue: '486.320.000₫', revenueDelta: '+11,3% so với tháng trước',
    orders: '7.264', ordersDelta: '+624 đơn so với tháng trước',
    delivering: '4', deliveringDelta: '1 đơn quá 30 phút',
    labels: ['T1', 'T2', 'T3', 'T4'],
    series: [64, 78, 92, 86],
    prev: [60, 70, 82, 80],
    branches: [['Quận 3 — Võ Văn Tần', '128.640.000₫', 100], ['Quận 1 — Lê Lợi', '104.280.000₫', 81], ['Tân Bình — Hoàng Việt', '76.420.000₫', 59], ['Thủ Đức — Kha Vạn Cân', '58.960.000₫', 46], ['Phú Nhuận — Phan Xích Long', '44.180.000₫', 34]]
  },
  year: {
    sub: '01/2026 – 09/2026 · theo tháng',
    revenue: '4.284.000.000₫', revenueDelta: '+18,6% so với cùng kỳ 2025',
    orders: '64.180', ordersDelta: '+8.240 đơn so với cùng kỳ',
    delivering: '4', deliveringDelta: '1 đơn quá 30 phút',
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
    series: [52, 46, 68, 72, 80, 76, 88, 96, 84],
    prev: [44, 40, 58, 64, 70, 68, 76, 82, 74],
    branches: [['Quận 3 — Võ Văn Tần', '1.086.000.000₫', 100], ['Quận 1 — Lê Lợi', '924.400.000₫', 85], ['Tân Bình — Hoàng Việt', '682.200.000₫', 63], ['Thủ Đức — Kha Vạn Cân', '524.800.000₫', 48], ['Phú Nhuận — Phan Xích Long', '398.600.000₫', 37]]
  }
};

export const ORDER_STATUS_STYLE = {
  completed: ['#E7ECE5', '#2E3B35', 'Hoàn tất'],
  processing: ['#F7E9CC', '#8C5E14', 'Đang xử lý'],
  delivering: ['#DFE7EF', '#3F5C79', 'Đang giao'],
  cancelled: ['#F6DED7', '#8E3421', 'Đã huỷ'],
  late: ['#F6DED7', '#8E3421', 'Trễ'],
  pending: ['#F7E9CC', '#8C5E14', 'Chờ xác nhận']
};

export const TABLE_STATUS_STYLE = {
  trong: ['#E7ECE5', '#2E3B35', 'Trống'],
  co_khach: ['#E8DFD2', '#8F775F', 'Có khách'],
  cho_don: ['#F6DED7', '#8E3421', 'Chờ dọn'],
  da_dat: ['#DFE7EF', '#3F5C79', 'Đã đặt trước']
};

export const ORDERS = [
  { id: 1, code: 'DP-1042', br: 'Quận 3 — Võ Văn Tần', st: 'delivering', total: '385.000₫', t: '14:20 03/09/2026', customer: 'Nguyễn Thảo Vy', phone: '090 552 3341', address: '12 Bà Huyện Thanh Quan, Quận 3, TP.HCM', payment: 'Ví điện tử', items: [['Cơm phần đậu hũ sả ớt', 2, 45000], ['Trà đào cam sả', 2, 25000], ['Chè đậu xanh nước cốt dừa', 3, 18000]], note: 'Giao trước 14:45, để đồ ăn trước cổng bảo vệ.' },
  { id: 2, code: 'DP-1041', br: 'Quận 1 — Lê Lợi', st: 'completed', total: '1.250.000₫', t: '13:52 03/09/2026', customer: 'Công ty TNHH An Phát', phone: '028 3822 9910', address: '77 Nguyễn Huệ, Quận 1, TP.HCM', payment: 'Chuyển khoản', items: [['Cơm phần chả giò chay', 15, 50000], ['Canh chua chay', 15, 25000], ['Nước sâm bí đao', 15, 15000]], note: 'Đặt cơm văn phòng, xuất hoá đơn công ty.' },
  { id: 3, code: 'DP-1040', br: 'Tân Bình — Hoàng Việt', st: 'processing', total: '96.000₫', t: '13:41 03/09/2026', customer: 'Lê Minh Khoa', phone: '093 118 4402', address: '45/2 Hoàng Việt, Tân Bình, TP.HCM', payment: 'Tiền mặt', items: [['Cơm phần nấm kho tiêu', 2, 48000]], note: '' },
  { id: 4, code: 'DP-1039', br: 'Quận 1 — Lê Lợi', st: 'cancelled', total: '210.000₫', t: '13:02 03/09/2026', customer: 'Phạm Hoài An', phone: '097 774 2210', address: '9 Pasteur, Quận 1, TP.HCM', payment: 'Ví điện tử', items: [['Đậu hũ sốt cà chua', 3, 38000], ['Rau câu lá dứa', 6, 15000]], note: 'Khách huỷ do đổi địa chỉ giao.' },
  { id: 5, code: 'DP-1038', br: 'Thủ Đức — Kha Vạn Cân', st: 'completed', total: '540.000₫', t: '12:47 03/09/2026', customer: 'Trường Mầm non Hoa Sen', phone: '028 3897 5561', address: '30 Kha Vạn Cân, Thủ Đức, TP.HCM', payment: 'Chuyển khoản', items: [['Cơm phần đậu hũ sả ớt', 10, 45000], ['Sữa hạt sen', 6, 20000]], note: 'Giao trước 11h trưa cho bữa ăn học sinh.' },
  { id: 6, code: 'DP-1037', br: 'Quận 3 — Võ Văn Tần', st: 'late', total: '87.000₫', t: '12:20 03/09/2026', customer: 'Đặng Quốc Việt', phone: '096 220 8871', address: '182/5 Võ Văn Tần, Quận 3, TP.HCM', payment: 'Tiền mặt', items: [['Nấm kho tộ', 2, 42000]], note: 'Đơn giao trễ hơn 30 phút so với dự kiến.' },
  { id: 7, code: 'DP-1036', br: 'Phú Nhuận — Phan Xích Long', st: 'pending', total: '164.000₫', t: '11:58 03/09/2026', customer: 'Vũ Thị Hồng Ngọc', phone: '094 663 1298', address: '58/3 Phan Xích Long, Phú Nhuận, TP.HCM', payment: 'Ví điện tử', items: [['Cơm phần chả giò chay', 2, 50000], ['Canh bí đỏ nấu đậu phộng', 2, 22000], ['Nước sâm bí đao', 1, 15000]], note: 'Chờ chi nhánh xác nhận đơn.' },
  { id: 8, code: 'DP-1035', br: 'Quận 7 — Nguyễn Thị Thập', st: 'completed', total: '312.000₫', t: '11:30 03/09/2026', customer: 'Bùi Anh Tuấn', phone: '098 441 0032', address: '89/4 Nguyễn Thị Thập, Quận 7, TP.HCM', payment: 'Tiền mặt', items: [['Cơm phần đậu hũ sả ớt', 4, 45000], ['Trà đào cam sả', 5, 25000]], note: '' },
  { id: 9, code: 'DP-1034', br: 'Quận 5 — Nguyễn Trãi', st: 'delivering', total: '198.000₫', t: '11:05 03/09/2026', customer: 'Trịnh Bảo Châu', phone: '091 887 6623', address: '320/1 Nguyễn Trãi, Quận 5, TP.HCM', payment: 'Ví điện tử', items: [['Rau củ xào thập cẩm', 3, 36000], ['Rau câu lá dứa', 6, 15000]], note: 'Gọi trước khi giao, chung cư không thang máy.' },
  { id: 10, code: 'DP-1033', br: 'Bình Thạnh — Điện Biên Phủ', st: 'completed', total: '276.000₫', t: '10:40 03/09/2026', customer: 'Nguyễn Gia Bảo', phone: '090 331 5567', address: '155/8 Điện Biên Phủ, Bình Thạnh, TP.HCM', payment: 'Chuyển khoản', items: [['Cơm phần nấm kho tiêu', 4, 48000], ['Súp nấm bốn mùa', 3, 28000]], note: '' }
];

export const ORDER_NEXT_STATUS = {
  pending: [['processing', 'Xác nhận đơn'], ['cancelled', 'Huỷ đơn']],
  processing: [['delivering', 'Chuyển sang giao hàng'], ['cancelled', 'Huỷ đơn']],
  delivering: [['completed', 'Đánh dấu hoàn tất'], ['late', 'Đánh dấu trễ giờ']],
  late: [['completed', 'Đánh dấu hoàn tất'], ['cancelled', 'Huỷ đơn']],
  completed: [],
  cancelled: []
};

export const EXPENSE_CATEGORIES = ['Nguyên liệu', 'Lương nhân viên', 'Thuê mặt bằng', 'Điện nước', 'Marketing', 'Khác'];

export const EXPENSE_LIST = [
  { date: '01/09/2026', branch: 'Quận 3 — Võ Văn Tần', category: 'Nguyên liệu', amount: 8400000, note: 'Nhập rau củ, đậu hũ, nấm cho tuần đầu tháng.' },
  { date: '01/09/2026', branch: 'Toàn hệ thống', category: 'Lương nhân viên', amount: 186000000, note: 'Lương tháng 8 cho toàn bộ nhân sự.' },
  { date: '02/09/2026', branch: 'Quận 1 — Lê Lợi', category: 'Thuê mặt bằng', amount: 42000000, note: 'Tiền thuê mặt bằng tháng 9.' },
  { date: '02/09/2026', branch: 'Tân Bình — Hoàng Việt', category: 'Điện nước', amount: 5200000, note: 'Hoá đơn điện nước tháng 8.' },
  { date: '02/09/2026', branch: 'Thủ Đức — Kha Vạn Cân', category: 'Nguyên liệu', amount: 6750000, note: 'Nhập gạo, dầu ăn, gia vị.' },
  { date: '03/09/2026', branch: 'Toàn hệ thống', category: 'Marketing', amount: 12500000, note: 'Chạy quảng cáo ứng dụng giao đồ ăn.' },
  { date: '03/09/2026', branch: 'Phú Nhuận — Phan Xích Long', category: 'Điện nước', amount: 4800000, note: 'Hoá đơn điện nước tháng 8.' },
  { date: '03/09/2026', branch: 'Quận 7 — Nguyễn Thị Thập', category: 'Thuê mặt bằng', amount: 38000000, note: 'Tiền thuê mặt bằng tháng 9.' },
  { date: '03/09/2026', branch: 'Quận 5 — Nguyễn Trãi', category: 'Nguyên liệu', amount: 5900000, note: 'Nhập rau củ tươi trong ngày.' },
  { date: '03/09/2026', branch: 'Toàn hệ thống', category: 'Khác', amount: 3200000, note: 'Sửa chữa thiết bị bếp chi nhánh Quận 10.' }
].map((e, i) => ({ ...e, id: i + 1 }));

export const LOGIN_ROLES = ['Quản lý', 'Nhân viên', 'Bếp', 'Thu ngân'];
export const LOGIN_ROLE_HINT = {
  'Quản lý': 'Xem toàn bộ hệ thống: tổng quan, chi nhánh, thực đơn, nhân viên, doanh thu.',
  'Nhân viên': 'Chỉ xem được lịch đi làm và ca làm của chính mình.',
  'Thu ngân': 'Xem tổng kết doanh thu theo ngày, tháng, năm.'
};

export const STAFF_WEEK_DAYS = [['T2', '31/08'], ['T3', '01/09'], ['T4', '02/09'], ['T5', '03/09'], ['T6', '04/09'], ['T7', '05/09'], ['CN', '06/09']];
export const STAFF_WEEK_PATTERN = ['am', 'am', 'am', 'off', 'am', 'am', 'off'];
export const STAFF_SHIFT_CELL = { am: ['#E7ECE5', '#B7C2B4', '#2E3B35', 'Ca sáng'], pm: ['#F7E9CC', '#C98A2C', '#8C5E14', 'Ca chiều'], off: ['#F0EBE3', '#D2C4B4', '#8A948F', 'Nghỉ'] };

export const STAFF_LIST = [
  { name: 'Nguyễn Văn An', role: 'Nhân viên', branch: 'Quận 3 — Võ Văn Tần', phone: '090 123 4567', cccd: '079201012345', dob: '12/04/1998', status: 'active', shifts: 6, salary: 7500000, checkedIn: true, week: ['am', 'am', 'am', 'off', 'am', 'am', 'off'], account: 'nguyenvanan214@gmail.com', password: 'Qw7tRb2k!x' },
  { name: 'Trần Thị Bích', role: 'Thu ngân', branch: 'Quận 1 — Lê Lợi', phone: '091 234 5678', cccd: '079301023456', dob: '05/09/2000', status: 'active', shifts: 5, salary: 8200000, checkedIn: true, week: ['pm', 'pm', 'off', 'pm', 'pm', 'am', 'off'], account: 'tranthibich587@gmail.com', password: 'Mn4jLp9s@2' },
  { name: 'Lê Văn Cường', role: 'Nhân viên', branch: 'Tân Bình — Hoàng Việt', phone: '093 345 6789', cccd: '079198034567', dob: '22/11/1995', status: 'active', shifts: 6, salary: 7500000, checkedIn: false, week: ['am', 'pm', 'am', 'pm', 'am', 'off', 'off'], account: 'levancuong063@gmail.com', password: 'Zx8hVt5d#7' },
  { name: 'Phạm Thị Diệu', role: 'Thu ngân', branch: 'Thủ Đức — Kha Vạn Cân', phone: '094 456 7890', cccd: '079299045678', dob: '30/01/1999', status: 'paused', shifts: 0, salary: 8200000, checkedIn: false, week: ['off', 'off', 'off', 'off', 'off', 'off', 'off'], account: 'phamthidieu348@gmail.com', password: 'Rk3wNc6y$4' },
  { name: 'Hoàng Văn Em', role: 'Nhân viên', branch: 'Quận 3 — Võ Văn Tần', phone: '096 567 8901', cccd: '079197056789', dob: '18/07/1997', status: 'active', shifts: 5, salary: 7200000, checkedIn: true, week: ['am', 'am', 'off', 'am', 'am', 'pm', 'off'], account: 'hoangvanem729@gmail.com', password: 'Tb5gXs1p&9' },
  { name: 'Vũ Thị Phương', role: 'Nhân viên', branch: 'Phú Nhuận — Phan Xích Long', phone: '097 678 9012', cccd: '079202067890', dob: '03/03/2001', status: 'paused', shifts: 0, salary: 7200000, checkedIn: false, week: ['off', 'off', 'off', 'off', 'off', 'off', 'off'], account: 'vuthiphuong841@gmail.com', password: 'Fh2dQz8m!6' }
].map((s, i) => ({ ...s, id: i + 1 }));

export const STAFF_STATUS_STYLE = { active: ['#E7ECE5', '#2E3B35', 'Đang làm'], paused: ['#F6DED7', '#8E3421', 'Tạm nghỉ'] };
export const STAFF_ROLE_STYLE = { 'Nhân viên': ['#E7ECE5', '#2E3B35'], 'Thu ngân': ['#F7E9CC', '#8C5E14'], 'Bếp': ['#DFE7EF', '#3F5C79'] };
export const STAFF_CHECKIN_STYLE = { true: ['#E7ECE5', '#2E3B35', 'Đã chấm ca'], false: ['#F7E9CC', '#8C5E14', 'Chưa chấm ca'] };
export const STAFF_ROLES = ['Nhân viên', 'Bếp', 'Thu ngân'];
export const CONTRACT_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Thời vụ'];

export const VIET_MAP = {
  'à':'a','á':'a','ạ':'a','ả':'a','ã':'a','â':'a','ầ':'a','ấ':'a','ậ':'a','ẩ':'a','ẫ':'a','ă':'a','ằ':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a',
  'è':'e','é':'e','ẹ':'e','ẻ':'e','ẽ':'e','ê':'e','ề':'e','ế':'e','ệ':'e','ể':'e','ễ':'e',
  'ì':'i','í':'i','ị':'i','ỉ':'i','ĩ':'i',
  'ò':'o','ó':'o','ọ':'o','ỏ':'o','õ':'o','ô':'o','ồ':'o','ố':'o','ộ':'o','ổ':'o','ỗ':'o','ơ':'o','ờ':'o','ớ':'o','ợ':'o','ở':'o','ỡ':'o',
  'ù':'u','ú':'u','ụ':'u','ủ':'u','ũ':'u','ư':'u','ừ':'u','ứ':'u','ự':'u','ử':'u','ữ':'u',
  'ỳ':'y','ý':'y','ỵ':'y','ỷ':'y','ỹ':'y',
  'đ':'d'
};
