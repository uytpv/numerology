# Kế hoạch Triển khai (Cập nhật): Chuyển đổi Hệ thống Thần số học chuẩn UyFullStack

Bản kế hoạch này đã được cập nhật dựa trên phản hồi của bạn để tối giản hóa kiến trúc (thay thế Flutter Admin bằng Next.js), tối ưu cơ chế đăng nhập, phương thức AI tích hợp và chuẩn bị cho việc tích hợp thanh toán toàn cầu.

---

## Cấu trúc Thư mục Hệ thống (Monorepo Ecosystem)

Để tối ưu hóa quá trình triển khai nhanh và chia sẻ mã nguồn (Share Types/Helpers), dự án sẽ được chia làm 2 phân vùng chính:
1. **`backend/`**: API Server viết bằng **NestJS (Node.js/TypeScript)**, chịu trách nhiệm tính toán nâng cao, xử lý thanh toán (Lemon Squeezy Webhook), quản lý dữ liệu Firestore, lưu trữ tài liệu tham khảo và gọi Gemini AI API.
2. **`client_web/`**: Website duy nhất viết bằng **Next.js (React) + Tailwind CSS**, bao gồm:
   - Giao diện tra cứu công khai cho khách hàng hướng SEO (`/`).
   - Giao diện quản trị CMS cho Admin (`/admin`) được bảo vệ bằng lớp bảo mật Router của Next.js và Firestore Rules.
3. **`archive_laravel/`**: Thư mục lưu trữ mã nguồn Laravel cũ để tham khảo thuật toán.

---

## Ý kiến Phản hồi & Nguyên tắc Thống nhất (User Review Accepted)

> [!IMPORTANT]
> **Đăng nhập (Authentication):**
> - **Môi trường Production (Thực tế):** Chỉ hỗ trợ đăng nhập bằng tài khoản Google (Google Sign-In) cho cả khách hàng và admin.
> - **Môi trường Development (Dev/Emulator):** Hỗ trợ song song đăng nhập bằng Google Sign-In và Email/Password để dễ dàng tạo tài khoản test và lập trình viên chạy thử.
> 
> **Lemon Squeezy (Thanh toán):**
> Khi đến bước tích hợp Lemon Squeezy, tôi sẽ hướng dẫn bạn đăng ký tài khoản Sandbox, tạo sản phẩm, cấu hình Webhook và API key từng bước một (step-by-step).
> 
> **Vận hành AI kết hợp RAG (Cả 2 phương án):**
> Chúng ta sẽ kết hợp:
> 1. Bộ Prompt hệ thống chứa sẵn kiến thức Thần số học Pythagoras chuẩn quốc tế theo phong cách tâm lý học hành vi / khoa học phát triển bản thân.
> 2. Đọc các file hướng dẫn/luận giải chi tiết (được bạn tải xuống từ Drive và đặt trong thư mục `backend/knowledge-base/`) để AI tham chiếu cách dùng từ, hành văn kiểu Việt Nam khi sinh báo cáo tiếng Việt.
> 
> **Loại bỏ Luận giải Cố định trong Database:**
> Việc lưu các đoạn văn dài cố định trong DB không còn phù hợp với mô hình phân tích đa yếu tố (Multi-factor). Thay vào đó, chúng ta sẽ lưu các **"Từ khóa cốt lõi (Keywords) & Nguyên lý (Principles)"** của từng con số trong Firestore/tệp tĩnh. AI sẽ đọc các từ khóa này, kết hợp với các chỉ số liên quan của người dùng (Ví dụ: Sự tương tác giữa Đường đời 8 và Sứ mệnh 4) để tự động tổng hợp ra bài viết giải nghĩa sâu sắc, độc bản.

---

## Chi tiết Thay đổi & Triển khai các Module

---

### 1. Cấu hình Hạ tầng Firebase (Root Folder)

Cấu hình các Emulator và định nghĩa luật bảo mật dữ liệu.

#### [NEW] [firebase.json](file:///c:/Users/UY/works/numerology/firebase.json)
- Cấu hình chạy Local Emulator cho: Auth (9099), Firestore (8080), Hosting (Next.js - 5000), Functions (5001).

#### [NEW] [firestore.rules](file:///c:/Users/UY/works/numerology/firestore.rules)
- Quy định quyền truy cập Firestore:
  - Khách hàng chỉ được đọc hồ sơ cá nhân của chính mình.
  - Chỉ tài khoản có trường `role == 'admin'` trong document `users/{uid}` mới được quyền ghi đè dữ liệu tài liệu học và cấu hình chỉ số.

#### [NEW] [firestore.indexes.json](file:///c:/Users/UY/works/numerology/firestore.indexes.json)
- Quản lý các Composite index để phục vụ truy vấn danh sách khách hàng của admin mượt mà.

---

### 2. Backend Module (`backend/`) - NestJS Server

#### [NEW] [firebase.service.ts](file:///c:/Users/UY/works/numerology/backend/src/firebase/firebase.service.ts)
- Kết nối SDK Firebase Admin. Tự động chuyển đổi trỏ về Emulator Port `127.0.0.1:8080` khi chạy ở môi trường phát triển local (`NODE_ENV === 'development'`).

#### [NEW] [auth.guard.ts & admin.guard.ts](file:///c:/Users/UY/works/numerology/backend/src/auth/guards)
- `AuthGuard`: Giải mã JWT token gửi lên từ Client để xác định UID.
- `AdminGuard`: Kiểm tra quyền hạn admin trong Firestore.

#### [NEW] [customer.dto.ts](file:///c:/Users/UY/works/numerology/backend/src/customers/dto/customer.dto.ts)
- Kiểm tra tính hợp lệ dữ liệu gửi lên (Họ tên không ký tự đặc biệt, Ngày sinh đúng format DD/MM/YYYY) bằng `class-validator`.

#### [NEW] [ai.service.ts](file:///c:/Users/UY/works/numerology/backend/src/ai/ai.service.ts)
- Quản lý prompt hệ thống theo **phong cách khoa học, tâm lý hành vi và phát triển bản thân (development-oriented)**.
- Tự động đọc dữ liệu tham chiếu trong thư mục `backend/knowledge-base/` (nơi chứa các file văn bản bạn tải từ Drive xuống) và truyền vào context của Gemini API để tối ưu văn phong Việt Nam.
- Kết xuất báo cáo thần số học dưới dạng JSON có cấu trúc để gửi về Client.

#### [NEW] [payment.controller.ts](file:///c:/Users/UY/works/numerology/backend/src/payment/payment.controller.ts)
- Nhận thông báo Webhook từ Lemon Squeezy để mở khóa các phân đoạn phân tích nâng cao (Tier 1 & Tier 2) trong hồ sơ khách hàng trên Firestore.

---

### 3. Client Web Module (`client_web/`) - Next.js (React)

Một dự án Next.js duy nhất quản lý cả giao diện người dùng và trang quản trị CMS.

#### [NEW] [next.config.js](file:///c:/Users/UY/works/numerology/client_web/next.config.js)
- Cấu hình đa ngôn ngữ (chuyển đổi ngôn ngữ i18n cho Tiếng Việt, Tiếng Anh, Tiếng Phần Lan, v.v.).

#### [NEW] [numerology.ts](file:///c:/Users/UY/works/numerology/client_web/src/lib/numerology.ts)
- Chuyển đổi 1:1 logic tính toán thần số học Pythagoras từ PHP sang TypeScript (bao gồm cả xử lý chữ cái có dấu tiếng Việt, xác định nguyên âm/phụ âm cho chữ Y, tính toán chu kỳ 4 chặng đỉnh cao, năm cá nhân và tháng cá nhân). Các hàm sẽ được **comment chi tiết từng dòng bằng tiếng Việt** để phục vụ việc bảo trì.

#### [NEW] [page.tsx (Trang chủ tra cứu)](file:///c:/Users/UY/works/numerology/client_web/src/app/%5Blocale%5D/page.tsx)
- Giao diện landing page tra cứu thiết kế theo xu hướng hiện đại (mystic dark mode, hiệu ứng mờ kính glassmorphism, hiệu ứng lấp lánh nhẹ của các ngôi sao).

#### [NEW] [ReportDashboard.tsx](file:///c:/Users/UY/works/numerology/client_web/src/components/ReportDashboard.tsx)
- Giao diện trực quan hóa Bản đồ Thần số học: các vòng tròn năng lượng, biểu đồ chặng đường.
- Tích hợp 3 phân cấp trải nghiệm tâm lý học:
  - **Miễn phí:** Nhìn thấy các chỉ số chủ đạo và mô tả ngắn về bản sắc cốt lõi (Tạo cảm giác tò mò và nhận diện bản thân).
  - **Tier 1 (Mở khóa điểm nghẽn/thách thức - Phí thấp):** Phân tích chi tiết các chỉ số nợ nghiệp, bài học nghiệp và các thách thức lớn trong cuộc đời giúp người dùng nhận diện sâu sắc vấn đề của mình.
  - **Tier 2 (Mở khóa giải pháp & AI Chat - Phí đầy đủ):** Nhận toàn bộ giải pháp cải thiện năng lượng, bản đồ hành động và mở khóa hộp thoại trò chuyện trực tiếp với AI Coach để hỏi đáp về bản đồ cá nhân.

#### [NEW] [admin-page.tsx (Giao diện Quản trị)](file:///c:/Users/UY/works/numerology/client_web/src/app/%5Blocale%5D/admin/page.tsx)
- Thay thế cho Flutter Admin cũ.
- Thiết kế sidebar quản lý danh sách khách hàng, công cụ lọc tìm kiếm nâng cao theo chỉ số chủ đạo.
- Nút "In Bản Đồ" hoặc "Xuất PDF" được tinh chỉnh CSS in ấn để xuất báo cáo đẹp mắt cho khách hàng.
- Trang cập nhật các từ khóa cốt lõi (Keywords/Principles) cho các con số để gửi kèm vào API AI.

---

## Kế hoạch Kiểm thử & Xác minh (Verification Plan)

### Kiểm thử Tự động (Automated Testing)
- Chạy unit test kiểm tra logic tính toán toán học của `numerology.ts` với 10 bộ tên và ngày sinh khác nhau để đảm bảo giống 100% kết quả từ Laravel cũ.
- Lệnh: `cd client_web && npm run test`

### Xác minh Thủ công (Manual Verification)
- Kiểm thử luồng đăng nhập:
  - Ở Local: Tạo tài khoản test bằng Email/Password trên Emulator để kiểm tra.
  - Ở Production: Chỉ cho phép click đăng nhập bằng Google Sign-In.
- Kiểm thử AI Prompt:
  - Chạy thử một lượt tra cứu, kiểm tra xem Gemini API có viết báo cáo đúng bằng ngôn ngữ tương ứng (ví dụ: tiếng Phần Lan nếu giao diện đang chọn tiếng Phần) và văn phong có mang tính khoa học/tâm lý trị liệu (psychological coaching) như thiết kế hay không.
- Kiểm thử thanh toán sandbox Lemon Squeezy để xác minh webhook tự động mở khóa báo cáo đầy đủ trên Firestore.
