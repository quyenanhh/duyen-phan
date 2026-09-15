# Hướng dẫn tích hợp Supabase (giai đoạn 1 — thí điểm bảng Chi nhánh)

Trạng thái hiện tại: code đã sẵn sàng, **nhưng app vẫn đang chạy bằng dữ liệu mẫu cục bộ** (`data.js`) vì `.env.local` chưa có khoá thật. Làm xong các bước dưới đây, app sẽ tự động chuyển sang đọc/ghi dữ liệu "Chi nhánh" trên Supabase — không cần sửa code gì thêm.

## Bước 1 — Tạo project Supabase

1. Vào https://supabase.com → **Start your project** → đăng nhập (GitHub/Google/email).
2. **New project**:
   - Chọn một Organization (hoặc tạo mới, miễn phí).
   - Đặt tên project, ví dụ `duyen-phan`.
   - Đặt **Database Password** (lưu lại chỗ nào đó an toàn, không cần dùng trong app nhưng cần khi truy cập DB trực tiếp sau này).
   - Chọn Region gần bạn (vd. Singapore).
   - Bấm **Create new project**, đợi khoảng 1-2 phút để project khởi tạo xong.

## Bước 2 — Tạo bảng `branches` + nạp dữ liệu mẫu

1. Trong project vừa tạo, vào menu trái → **SQL Editor** → **New query**.
2. Mở file `react-app/supabase/001_branches.sql` (đã có sẵn trong project này), copy toàn bộ nội dung, dán vào ô query.
3. Bấm **Run**. Script này sẽ:
   - Tạo bảng `branches` với đúng các cột app đang dùng (tên, địa chỉ, quản lý, SĐT, giờ mở cửa, trạng thái, số nhân sự...).
   - Bật Row Level Security (RLS) và cho phép đọc/ghi công khai qua anon key — vì app hiện **chưa có Supabase Auth thật** (đăng nhập vẫn là giả lập), để giữ đúng hành vi hiện tại (ai vào trang quản trị cũng thao tác được).
   - Nạp sẵn 12 chi nhánh giống hệt dữ liệu đang hiển thị trong app — chuyển sang Supabase sẽ không bị mất/đổi dữ liệu đang thấy.
4. Kiểm tra: vào **Table Editor** → bảng `branches` → phải thấy đủ 12 dòng.

> An toàn khi chạy lại: script dùng `if not exists` / `on conflict do nothing`, chạy lại nhiều lần không bị lỗi hay nhân đôi dữ liệu.

## Bước 3 — Lấy Project URL và anon key

1. Vào **Project Settings** (biểu tượng bánh răng) → **API**.
2. Copy hai giá trị:
   - **Project URL** (dạng `https://xxxxxxxx.supabase.co`)
   - **anon public** key (chuỗi dài bắt đầu `eyJ...`)

⚠️ Chỉ dùng khoá **anon public**, không dùng `service_role` (khoá đó có toàn quyền, không được đưa vào code chạy trên trình duyệt).

## Bước 4 — Điền vào `.env.local`

Mở file `react-app/.env.local` (đã tạo sẵn, đang để trống) và điền:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Lưu file. File này đã được thêm vào `.gitignore` nên sẽ không bị commit lên git.

## Bước 5 — Khởi động lại dev server

Vite chỉ đọc biến môi trường lúc khởi động, nên cần dừng và chạy lại:

```
npm run dev
```

Mở lại trang **Chi nhánh** trong khu quản trị — nếu thấy đúng 12 chi nhánh như cũ, tức là app đang đọc thật từ Supabase. Thử **Thêm chi nhánh / Sửa / Tạm đóng cửa / Xoá** — vào lại **Table Editor** trên Supabase Dashboard để xác nhận thay đổi đã lưu thật.

Nếu chưa điền `.env.local` hoặc điền sai, app **tự động rơi về dữ liệu mẫu cục bộ** như trước (có cảnh báo ở Console trình duyệt), mọi chức năng vẫn hoạt động bình thường — không bị vỡ trang.

## Những gì đã thay đổi trong code

- `package.json`: thêm dependency `@supabase/supabase-js`.
- `src/lib/supabaseClient.js`: khởi tạo Supabase client từ biến môi trường; nếu thiếu key thì `supabaseEnabled = false` và không tạo client (tránh lỗi).
- `src/lib/branchesApi.js`: các hàm `listBranches / insertBranch / updateBranchRow / deleteBranchRow`, tự chuyển đổi giữa tên cột Supabase (`staff_count`) và tên field trong app (`staffCount`).
- `src/App.jsx`: nạp `branchRecords` từ Supabase khi mở app (nếu đã cấu hình); nếu không, vẫn dùng `BRANCH_LIST` từ `data.js` như trước.
- `src/Branches.jsx`: các thao tác Thêm/Sửa/Xoá/Đổi trạng thái chi nhánh giờ đồng thời ghi lên Supabase (khi đã cấu hình); nếu ghi lỗi, sẽ báo qua toast và dữ liệu vẫn đúng trên trình duyệt hiện tại.
- `supabase/001_branches.sql`: script tạo bảng + policy + seed dữ liệu, chạy trong Supabase SQL Editor.

## Đăng nhập — đã nối Supabase Auth thật

Màn hình Đăng nhập giờ xác thực thật qua **Supabase Authentication** (`supabase.auth.signInWithPassword`), không còn giả lập.

### Việc cần làm để bật tính năng này

1. Hoàn thành Bước 1-5 ở trên (project + `.env.local` + restart dev server) nếu chưa làm.
2. Chạy thêm file `react-app/supabase/002_login_email_check.sql` trong **SQL Editor** (giống cách chạy `001_branches.sql`). Script này tạo một hàm `email_has_account(email)` dùng để phân biệt "sai mật khẩu" và "email chưa có tài khoản" — chi tiết lý do xem chú thích trong file.
3. Vào **Authentication → Providers**, đảm bảo **Email** provider đang bật (mặc định đã bật sẵn).
4. Tạo tài khoản thử để đăng nhập: **Authentication → Users → Add user** (đặt email + mật khẩu, tick **Auto Confirm User** để khỏi phải xác nhận qua email khi test nhanh).

### Cách hoạt động

- Nhấn **Đăng nhập** → app gọi `supabase.auth.signInWithPassword({ email, password })`. Supabase tự kiểm tra mật khẩu phía server (mật khẩu được Supabase lưu dạng băm/hash, app không bao giờ đọc hay so sánh mật khẩu).
- **Đúng email + đúng mật khẩu** → đăng nhập thành công, chuyển vào trang quản trị (`dashboard`).
- **Sai mật khẩu** (email có tồn tại) → hiển thị "Mật khẩu không chính xác" ở ô mật khẩu.
- **Email chưa có tài khoản** → hiển thị "Email này chưa có tài khoản trong hệ thống" ở ô email.
  - Ghi chú kỹ thuật: Supabase Auth cố tình trả về CÙNG một lỗi ("Invalid login credentials") cho cả hai trường hợp trên để chống dò email hàng loạt (email enumeration). Để tách được hai thông báo như yêu cầu, app gọi thêm hàm RPC `email_has_account` (bước 2 ở trên) — hàm này chỉ trả về `true/false`, không lộ thêm thông tin tài khoản nào khác. Đây là điểm đánh đổi bảo mật có chủ đích, chấp nhận để có đúng 2 thông báo riêng biệt theo yêu cầu.
- **Email chưa xác nhận** (nếu bật "Confirm email" trong Supabase và người dùng chưa bấm link xác nhận) → hiển thị thông báo yêu cầu kiểm tra hộp thư.
- Nếu `.env.local` chưa cấu hình, nút Đăng nhập báo lỗi rõ ràng thay vì cho qua giả.
- **Đăng xuất** giờ cũng gọi `supabase.auth.signOut()` để huỷ phiên thật trên Supabase, không chỉ xoá state cục bộ.

### Các phần liên quan CHƯA đụng tới

- **Đăng ký** (tạo tài khoản quản trị mới) vẫn là giả lập, chưa gọi `supabase.auth.signUp`.
- Dropdown "Vai trò đăng nhập" trên form vẫn là lựa chọn thủ công ở UI (không lấy từ Supabase) — dùng để hiển thị đúng trải nghiệm dashboard theo vai trò, chưa phải phân quyền thật. Nếu cần phân quyền thật (RBAC), nên lưu vai trò trong bảng `profiles` liên kết với `auth.users` và kiểm tra ở RLS policy.
- Luồng "Đây là lần đăng nhập đầu tiên → đổi mật khẩu mới" vẫn chỉ là điều hướng UI, màn "Đổi mật khẩu" chưa gọi `supabase.auth.updateUser` để đổi mật khẩu thật.

## Các phần CHƯA đụng tới (còn dùng dữ liệu mẫu như cũ)

- Thực đơn, Đơn hàng, Nhân viên, Chi phí (Finance) — vẫn 100% dữ liệu mẫu trong `data.js`, chưa nối Supabase.
- Danh sách chi nhánh dùng cho các dropdown ở nơi khác (form Đăng ký, thêm Nhân viên, thêm Chi phí) vẫn lấy từ hằng số tĩnh `BRANCHES` trong `data.js`, **chưa** tự cập nhật theo chi nhánh mới thêm qua Supabase — đây là hạn chế có sẵn từ trước (ngay cả với state cục bộ cũng vậy), sẽ cần xử lý riêng nếu bạn muốn đồng bộ.

## Bước tiếp theo (khi bạn sẵn sàng)

Sau khi xác nhận bảng `branches` và đăng nhập chạy ổn, lặp lại đúng cách làm này cho từng bảng còn lại theo thứ tự đề xuất: **Thực đơn → Nhân viên → Chi phí → Đơn hàng** (đơn hàng phức tạp nhất vì có danh sách món lồng bên trong, nên để cuối). Báo tôi khi bạn muốn làm bảng tiếp theo, hoặc khi muốn nối luôn Đăng ký / đổi mật khẩu thật với Supabase Auth.
