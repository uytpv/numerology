# TÀI LIỆU ĐẶC TẢ KIẾN TRÚC HỆ THỐNG & QUY TRÌNH TẠO LUẬN GIẢI LIFE MAPS
**Phiên bản:** LM-PY-2026.02  
**Calculation Engine:** v2.4.0  
**Tác giả:** Đội ngũ Phát triển Hệ thống Life Maps  
**Trạng thái:** Active Specification  

---

## 1. Triết Lý Thiết Kế & Định Vị Nghiệp Vụ

### 1.1 Tôn Chỉ Cốt Lõi
> **"Ít content hơn → Nhiều reasoning hơn → Nhiều interaction hơn → Nhiều personalization hơn → Ít claim hơn."**

Hệ thống Life Maps không đi theo lối mòn của các phần mềm thần số học truyền thống (vốn nhồi nhét văn bản khuôn mẫu 50–60 trang lặp đi lặp lại). Thay vào đó, Life Maps định vị là **Hệ thống Phân Tích Bản Sắc & Kế Hoạch Hành Động Tự Phản Tỉnh** kết hợp chặt chẽ giữa:
1. **Hệ thống Thần số học Pythagoras Cổ Điển** (Tính toán số học minh bạch, kiểm toán được 100%).
2. **Cấu trúc Khai Vấn & Kế Hoạch Hành Động Thực Tế** (Actionable Coaching Framework: OKRs, KPIs, DTI, Quỹ dự phòng, Time-blocking, Kế hoạch 7/30/90 ngày).
3. **Hiệu Chuẩn Ngôn Ngữ Tự Phản Tỉnh (Epistemic Calibration)**: Triệt tiêu mọi phán xét mang tính định mệnh, mê tín tiền kiếp; chuyển hóa toàn bộ sang ngôn ngữ quan sát có điều kiện.

### 1.2 Ba Nguyên Tắc Kỹ Thuật Bất Di Bất Dịch
1. **LLM Không Tính Số**: Toàn bộ 21 chỉ số, 4 đỉnh cao, 4 thách thức, các số nợ nghiệp compound đều được tính toán bằng TypeScript Calculation Engine thuần túy.
2. **LLM Không Quyết Định Methodology**: Các công thức rút gọn, quy tắc nguyên âm, phân dải tuổi Kim Tự Tháp đều tuân theo Single Source of Truth được kiểm soát chặt chẽ.
3. **LLM Không Chịu Trách Nhiệm Format**: Renderer (React Component / CSS Print Engine) trực tiếp quản lý typography, spacing, card layout và ngắt trang in.

---

## 2. Quy Trình Tạo Báo Cáo 7 Giai Đoạn (End-to-End Pipeline)

```mermaid
flowchart TD
    A[1. USER INPUT\nHọ tên, Ngày sinh, Giới tính, Nhóm tuổi, Focus Topics] --> B[2. CALCULATION ENGINE\n21 Chỉ số, Đỉnh cao Kim Tự Tháp, Nợ nghiệp, Lịch cá nhân]
    B --> C[3. VALIDATION & AUDIT\nKiểm tra dữ liệu, Làm sạch OCR/Markdown, Bảng kiểm toán chữ cái]
    C --> D[4. ROLE-SPECIFIC CONTEXT\nTách Archetype khỏi Role: ĐĐ, SM, LH, NC, TĐ, CB]
    D --> E[5. MULTI-FACTOR INTERACTION\nMa trận tương tác: 8x8x8x1, 7x7, 6 ↔ Thiếu 6]
    E --> F[6. ADAPTIVE DELIVERY PROFILER\nExecutive 15p | Dynamic 10p | Deep 30p | Empathic 20p]
    F --> G[7. REFLECTION & ACTION PLAN\nAdaptive Pillars, Checklist 7/30/90 ngày, Export Web & PDF]
```

---

## 3. Đặc Tả Chi Tiết Đầu Vào (Inputs) & Đầu Ra (Outputs)

### 3.1 Dữ Liệu Đầu Vào (Inputs)
| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả & Quy chuẩn |
| :--- | :--- | :---: | :--- |
| `fullName` | `string` | Có | Họ và tên khai sinh đầy đủ (Chuẩn hóa Unicode NFC, xóa khoảng trắng thừa). |
| `dob` | `string` | Có | Ngày tháng năm sinh (Định dạng `YYYY-MM-DD` hoặc `DD/MM/YYYY`). |
| `gender` | `'Nam' \| 'Nữ' \| 'Khác'` | Không | Bối cảnh nhân khẩu học phục vụ gợi ý phong thái phù hợp. |
| `age` | `number` | Không | Tuổi hiện tại để đối chiếu với chặng Kim Tự Tháp và tuổi Trưởng Thành. |
| `life_focus` | `string[]` | Không | 1 đến 3 trọng tâm ưu tiên (vd: `career`, `money`, `love`, `family`, `health`). |
| `readingProfile` | `enum` | Không | Phong cách đọc được chọn: `executive` \| `dynamic` \| `deep` \| `empathic`. |

### 3.2 Dữ Liệu Đầu Ra (Outputs)
Hệ thống xuất ra cấu trúc dữ liệu phân cấp 3 Tầng:
- **Tầng 1 (`layer1`)**: Bộ Số Tam Giác Vàng Cốt Lõi (Đường Đời, Sứ Mệnh, Linh Hồn).
- **Tầng 2 (`layer2`)**: Lưới 21 Chỉ Số Toàn Diện kèm Thư viện Giải nghĩa Tầng 2.
- **Tầng 3 (`layer3`)**: Báo cáo Luận giải Đa chiều 5 Chương + Executive Summary 1 trang + Bảng Kiểm toán Dữ liệu + Kế hoạch Hành động.

---

## 4. Kiến Trúc Dữ Liệu 3 Tầng Chi Tiết

### 4.1 Tầng 1: Bộ Số Tam Giác Vàng (Core Golden Triangle)
- **Chỉ Số Đường Đời (Life Path - LP)**: Tính từ tổng các con số ngày, tháng, năm sinh. Đại diện cho trục định hướng phát triển và bài học lớn của cuộc đời.
- **Chỉ Số Sứ Mệnh (Expression / Destiny - EXP)**: Tính từ tổng tất cả chữ cái trong họ tên. Đại diện cho kho tàng năng lực và phương tiện hành động.
- **Chỉ Số Linh Hồn (Heart's Desire / Soul Urge - HD)**: Tính từ tổng các chữ cái **Nguyên Âm** (A, E, I, O, U và Y theo quy tắc). Đại diện cho động lực nội tâm và nhu cầu cảm xúc sâu thẳm.

---

### 4.2 Tầng 2: Thư Viện Kiến Thức Tĩnh & Tách Bạch Vai Trò (Static Knowledge Base & Role Engine)

#### Nguồn Dữ Liệu Tĩnh:
- File `backend/src/ai/knowledge/knowledge_base_252.json` và `client_web/src/lib/knowledge/knowledge_base_252.json`.
- Chứa 252 bản ghi cấu trúc cho các tổ hợp `[indicator_code]_[number]`.

#### Cấu Trúc Mỗi Bản Ghi (Schema):
```typescript
interface IndicatorKnowledgeRecord {
  indicator_code: string;       // vd: 'life_path', 'personality', 'attitude'
  indicator_name: string;       // vd: 'Chỉ Số Đường Đời (Life Path)'
  number: number;               // vd: 8
  core_energy: string;          // Mô tả ngắn gọn tần số rung động cốt lõi
  positive_traits: string[];    // Các phẩm chất phát huy khi ở trạng thái cân bằng
  shadow_traits: string[];      // Điểm mù / Mặt bóng cần nhận diện
  career_guidance: string;      // Ứng dụng trong công việc & môi trường tối ưu
  relationships: string;        // Biểu hiện trong tình cảm & giao tiếp
  decision_making: string;      // Phong cách tư duy & cơ chế ra quyết định
  money_management: string;     // Quản trị nguồn lực & tài chính
  growth_actions: string[];     // Hành động rèn luyện cụ thể hàng ngày
  power_questions: string[];    // Câu hỏi khai vấn tự phản tỉnh
  full_description: string;     // Bài luận giải chuyên sâu Tầng 2
}
```

#### Cơ Chế Role-Specific Context Prefix (Tách Archetype Khỏi Role):
Để tránh tình trạng cùng một con số (ví dụ Số 8) bị lặp lại cùng một đoạn văn ở nhiều vị trí, engine tự động gán ngữ cảnh vai trò riêng biệt trước khi render:
- **Khi là Đường Đời 8**: `[Vai trò: Trục Xương Sống & Bài Học Cuộc Đời]` → Hướng tới mục tiêu lớn và năng lực gánh vác sứ mệnh dài hạn.
- **Khi là Sứ Mệnh 8**: `[Vai trò: Kho Tàng Năng Lực & Phương Tiện Hành Động]` → Phương tiện quản trị, tổ chức quy mô và đòn bẩy tài chính.
- **Khi là Nhân Cách 8**: `[Vai trò: Phong Thái Xã Hội & Ấn Tượng Ngoại Giao]` → Diện mạo đĩnh đạc, uy tín và sự tự tin khi đối nhân xử thế.
- **Khi là Thái Độ 8**: `[Vai trò: Phản Xạ Tự Nhiên Khi Đối Diện Biến Cố]` → Phản xạ đứng mũi chịu sào, bình tĩnh giải quyết khó khăn bằng hành động thực tế.

---

### 4.3 Tầng 3: Luận Giải Đa Chiều & Ma Trận Đa Yếu Tố (Multi-Factor Dynamic Synthesis)

Tầng 3 là bước đột phá kết hợp nhiều chỉ số đồng thời (`multiIndicatorSynthesis.ts`):

#### 1. Ma Trận Tổ Hợp Tương Tác Cốt Lõi:
- **Trục Thực Thi & Điều Hành**: `Đường Đời 8 × Nhân Cách 8 × Thái Độ 8 × Tư Duy Lý Trí 1`.
  * *Ý nghĩa reasoning*: Sự cộng hưởng của ba số 8 tạo nên bản lĩnh hành động quyết liệt, kết hợp cùng tư duy độc lập (Số 1) giúp ra quyết định dựa trên số liệu thực tế chứ không bị dao động bởi cảm xúc đám đông.
- **Trục Chiêm Nghiệm & Phân Tích Bản Chất**: `Linh Hồn 7 × Cân Bằng 7`.
  * *Ý nghĩa reasoning*: Nội tâm hướng về chiều sâu nguyên lý; khi gặp biến cố, điểm tựa lấy lại bình tĩnh cũng là sự tĩnh lặng để nghiên cứu nguyên nhân gốc rễ.
- **Trục Dung Hòa Trách Nhiệm & Kỹ Năng Cần Rèn**: `Sứ Mệnh 6 ↔ Chỉ Số Thiếu 6`.
  * *Ý nghĩa reasoning*: Thôi thúc cống hiến cho gia đình/tổ đội (Sứ Mệnh 6) đi liền với bài học rèn luyện ranh giới lành mạnh (Thiếu 6) để không bị kiệt sức vì ôm đồm.

#### 2. Hệ Thống Trụ Cột Thích Ứng (Adaptive Pillars):
Thay vì sử dụng 4 tiêu đề cố định (Sự nghiệp, Tình cảm, Tư duy, Tiền bạc), hệ thống biến đổi động theo từng con số:
- **Số 8**: `Lãnh Đạo & Tầm Nhìn Chiến Lược` | `Quản Trị Nguồn Lực & Dòng Tiền` | `Năng Lực Hiện Thực Hóa` | `Quản Trị Áp Lực & Điểm Mù Quyền Lực`.
- **Số 7**: `Thế Giới Nội Tâm & Chiêm Nghiệm` | `Khát Khao Tri Thức & Lập Luận Độc Lập` | `Xây Dựng Niềm Tin & Sự Gắn Kết` | `Chuyển Hóa Trí Tuệ Thành Hành Động`.
- **Số 6**: `Trách Nhiệm & Tâm Thế Phụng Sự` | `Xây Dựng Mái Ấm & Tổ Đội` | `Nghệ Thuật Lắng Nghe & Ranh Giới Lành Mạnh` | `Chăm Sóc Bản Thân (Self-Care)`.

---

## 5. Các Engine & Công Cụ Kỹ Thuật Trong Hệ Thống

| Tên Engine / Module | File Code Nguồn | Chức Năng Chính |
| :--- | :--- | :--- |
| **Calculation Engine** | `numerology.ts`<br>`numerologyReportGenerator.ts` | Tính toán 21 chỉ số, 4 đỉnh cao Kim Tự Tháp, nợ bài học compound (13, 14, 16, 19), Năm/Tháng/Ngày Cá Nhân. |
| **Validation & Calibration** | `reportSemanticValidator.ts` | Loại bỏ rác OCR, strip sạch dấu `**`, hiệu chuẩn ngôn ngữ phán xét định mệnh sang ngôn ngữ khai vấn có điều kiện. |
| **Synthesis & Interaction** | `multiIndicatorSynthesis.ts` | Phân tích ma trận tương tác đa chỉ số, tạo Executive Summary 1 trang, sinh Adaptive Pillars. |
| **Adaptive Reading Profiler** | `adaptiveReadingProfiles.ts`<br>`AdaptiveProfileModal.tsx` | Chấm điểm và phân phối 4 phong cách đọc (`executive`, `dynamic`, `deep`, `empathic`). |
| **Personal Calendar Generator** | `personalCalendarGenerator.ts`<br>`PersonalCalendarModal.tsx` | Tính toán chính xác chuỗi 30 ngày năng lượng cá nhân cho tài khoản Coach / Subscription. |
| **Data Audit & Methodology** | `NameAuditAppendix.tsx` | Bảng kiểm toán chữ cái từng từ, quy tắc nguyên âm chữ Y, bảng đối chiếu Standard vs Life Maps. |
| **Print & PDF Engine** | `src/app/report/print/page.tsx` | Render bố cục in ấn khổ A4 chuẩn xuất bản, loại bỏ URL localhost và timestamp rác của browser. |

---

## 6. Quy Tắc Toán Học & Kiểm Toán Chuẩn Pythagoras

### 6.1 Bảng Quy Đổi Ký Tự Sang Số (Pythagorean Chart)
```text
1: A, J, S
2: B, K, T
3: C, L, U
4: D, M, V
5: E, N, W
6: F, O, X
7: G, P, Y
8: H, Q, Z
9: I, R
```

### 6.2 Quy Tắc Phân Loại Nguyên Âm Chữ "Y" (Y Vowel Classification Rule)
- **Nguyên Âm**: Khi chữ "Y" đứng độc lập trong từ hoặc đóng vai trò là **hạt nhân nguyên âm duy nhất** trong từ đó (ví dụ trong từ **"UY"**, "Y" là nguyên âm duy nhất mang giá trị 7 thuộc chỉ số Linh Hồn).
- **Phụ Âm**: Khi chữ "Y" đứng liền sau một nguyên âm chính khác với vai trò bán nguyên âm (ví dụ: "NGUYEN" -> U, Y, E được phân định theo vị trí âm tiết).

### 6.3 Quy Tắc Phân Biệt Chỉ Số Thiếu (Karmic Lessons) vs Nợ Bài Học (Karmic Debt)
- **Chỉ Số Thiếu (Karmic Lessons 1–9)**: Là các chữ số từ 1 đến 9 **hoàn toàn không xuất hiện** trong chuỗi chữ cái họ tên khai sinh. Đây là bài học kỹ năng mềm cần chú tâm rèn luyện.
- **Nợ Bài Học (Karmic Debt 13/4, 14/5, 16/7, 19/1)**: CHỈ xuất hiện khi tổng thành phần chưa rút gọn của Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách hoặc Ngày Sinh chạm đúng các số 13, 14, 16, 19. Nếu không phát hiện compound number, hệ thống xác nhận **"Không có Nợ Bài Học"** và hoàn toàn không render thẻ nợ nghiệp.

---

## 7. Metadata Phiên Bản & Tính Tái Lập (Reproducibility)

Mọi báo cáo được xuất bản bởi hệ thống Life Maps đều đi kèm chữ ký metadata chuẩn:
```text
Methodology Version : LM-PY-2026.02
Calculation Engine  : v2.4.0
Semantic Validator  : Active (ICF-inspired Actionable Reflection)
Standard Reference  : Pythagorean Classical Numerology & ICF Action Framework
Single Source Truth : 100% Deterministic Mathematical Pipeline
```
