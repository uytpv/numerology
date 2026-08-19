import * as fs from 'fs';
import * as path from 'path';
import { cleanAndFormatText } from './cleanTextHelper';

export interface IndicatorRecord {
  indicator_code: string;
  indicator_name: string;
  number: number;
  core_energy: string;
  positive_traits: string[];
  shadow_traits: string[];
  career_guidance: string;
  relationships: string;
  decision_making: string;
  money_management: string;
  growth_actions: string[];
  power_questions: string[];
  full_description: string;
}

// BỘ TỪ ĐIỂN TRI THỨC CHUYÊN SÂU TẦNG 2 CHO CÁC CHỈ SỐ
// Soạn thảo theo chuẩn mực Thần số học Pythagoras kết hợp Khai vấn Life Coach ICF
export const DEEP_ENRICHMENT_CATALOG: Record<string, Record<number, {
  core_energy: string;
  positive_traits: string[];
  shadow_traits: string[];
  career_guidance: string;
  relationships: string;
  decision_making: string;
  money_management: string;
  growth_actions: string[];
  power_questions: string[];
  full_description: string;
}>> = {
  // 1. LIÊN KẾT ĐƯỜNG ĐỜI - SỨ MỆNH (SOUL BRIDGE / LPE BRIDGE)
  soul_bridge: {
    0: {
      core_energy: 'Sự đồng điệu và cộng hưởng trực tiếp giữa Đường Đời và Sứ Mệnh, không có khoảng cách xung đột.',
      positive_traits: ['Định hướng mục tiêu và tài năng tự nhiên hòa làm một', 'Khả năng tập trung năng lượng cao độ không bị phân tán'],
      shadow_traits: ['Dễ chủ quan hoặc thiếu góc nhìn phản biện đa chiều', 'Cần chủ động mở rộng trải nghiệm ngoài vùng an toàn'],
      career_guidance: 'Thuận lợi thăng tiến trong các lĩnh vực sở trường mà bạn đam mê từ sớm.',
      relationships: 'Giao tiếp chân thành, thẳng thắn và nhất quán giữa lời nói và việc làm.',
      decision_making: 'Ra quyết định nhanh chóng, dứt khoát dựa trên sự thống nhất giữa lý trí và trực giác.',
      money_management: 'Tập trung tối ưu hóa nguồn thu nhập chính từ chuyên môn cốt lõi.',
      growth_actions: [
        'Thiết lập mục tiêu lớn hơn để thử thách và mở rộng tiềm năng bản thân.',
        'Lắng nghe phản hồi từ những người có góc nhìn trái ngược để hoàn thiện giải pháp.'
      ],
      power_questions: [
        'Bạn đang tận dụng tối đa lợi thế thống nhất giữa Đường Đời và Sứ Mệnh chưa?',
        'Điều gì sẽ giúp bạn bứt phá khỏi vùng an toàn hiện tại?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Chỉ số Cầu Nối Đường Đời – Sứ Mệnh bằng 0 phản ánh trạng thái cộng hưởng tự nhiên: con đường bạn cần đi (Đường Đời) và phương tiện, tài năng bạn sở hữu (Sứ Mệnh) mang cùng một tần số năng lượng hoặc có sự tương thích tuyệt đối. Bạn không gặp phải xung đột nội tâm lớn giữa "điều mình muốn làm" và "điều hoàn cảnh đòi hỏi".

### 2. Biểu Hiện Thực Tế & Lợi Thế
Bạn có khả năng nhận diện hướng đi cuộc đời từ sớm và dồn toàn bộ tâm trí vào một định hướng duy nhất mà không bị giằng xé giữa các ngã rẽ. Khi hành động, năng lượng của bạn tập trung cao độ, giúp bạn tích lũy kinh nghiệm nhanh hơn và đạt được sự tinh thông chuyên môn vượt trội.

### 3. Thách Thức & Điểm Mù
Lợi thế không có xung đột đôi khi lại trở thành điểm mù: bạn có xu hướng dễ hài lòng với quỹ đạo quen thuộc, ngại thay đổi hoặc ít có cơ hội rèn luyện khả năng thích ứng trước các biến động trái chiều. Nếu không có mục tiêu lớn thôi thúc, bạn có thể dừng lại ở mức "vừa đủ".

### 4. Chiến Lược Chuyển Hóa & Lời Khuyên Khai Vấn
• Thiết lập các cột mốc thử thách cao hơn chuẩn mực thông thường để kích hoạt tối đa tiềm năng.
• Chủ động tìm kiếm những cộng sự có góc nhìn đa chiều để bổ khuyết cho các khía cạnh ngoài chuyên môn.
• Rèn luyện tính linh hoạt, sẵn sàng đón nhận những phương pháp tiếp cận mới trong kỷ nguyên số.`
    },
    1: {
      core_energy: 'Năng lượng số 1 kích hoạt bản lĩnh tự chủ, ý chí tiên phong và năng lực hành động độc lập để hợp nhất Đường Đời và Sứ Mệnh.',
      positive_traits: ['Dám nghĩ dám làm, quyết đoán vượt qua trì hoãn', 'Tinh thần tiên phong khai mở lối đi riêng'],
      shadow_traits: ['Dễ độc đoán hoặc vội vã khi chưa đủ dữ liệu', 'Khó ủy quyền và ôm đồm công việc'],
      career_guidance: 'Phù hợp với các vai trò quản lý dự án, sáng lập, dẫn dắt đội ngũ hoặc chuyên gia độc lập.',
      relationships: 'Tôn trọng sự độc lập của đối phương, tránh áp đặt ý chí cá nhân.',
      decision_making: 'Chủ động chịu trách nhiệm 100% cho mọi lựa chọn của bản thân.',
      money_management: 'Tập trung đầu tư cho các dự án khởi xướng mới có tiềm năng tăng trưởng cao.',
      growth_actions: [
        'Mỗi ngày chọn một quyết định quan trọng nhất và thực thi dứt điểm trước 12h trưa.',
        'Học cách phân quyền và tin tưởng vào năng lực của cộng sự.'
      ],
      power_questions: [
        'Quyết định can đảm nào bạn đang trì hoãn mà nếu làm ngay sẽ thay đổi toàn bộ cục diện?',
        'Làm thế nào để bạn vừa giữ vững vai trò tiên phong vừa tạo động lực cho người khác?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 1 đòi hỏi bạn phải dùng lòng dũng cảm, tính tự lập và ý chí tiên phong làm chiếc cầu nối để đưa các bài học của Đường Đời vào việc thực thi Sứ Mệnh. Đây là con số của sự khởi xướng, đòi hỏi bạn phải bước lên phía trước và chịu trách nhiệm cao nhất về cuộc đời mình.

### 2. Biểu Hiện Khi Cân Bằng
Khi bạn kích hoạt đúng năng lượng số 1, bạn không còn chờ đợi sự cho phép hay phụ thuộc vào hoàn cảnh. Bạn chủ động vạch ra lộ trình, chuyển hóa các xung đột nội tâm thành hành động cụ thể và dám dấn thân vào những lĩnh vực mới mà người khác còn e dè.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Nếu thiếu cân bằng, năng lượng số 1 có thể biến thành sự bướng bỉnh, độc đoán hoặc cô lập bản thân. Bạn dễ rơi vào cái bẫy "tự làm tất cả" vì không tin tưởng người khác, dẫn đến quá tải và kiệt sức cảm xúc.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Chuyển từ "lãnh đạo bằng kiểm soát" sang "lãnh đạo bằng truyền cảm hứng và trao quyền".
• Thiết lập kỷ luật cá nhân dựa trên mục tiêu cốt lõi (OKRs) thay vì chạy theo các phản xạ nhất thời.
• Dành thời gian lắng nghe góc nhìn của cộng sự trước khi đưa ra quyết định sau cùng.`
    },
    2: {
      core_energy: 'Năng lượng số 2 kết nối Đường Đời và Sứ Mệnh thông qua sự thấu cảm, kỹ năng lắng nghe, hợp tác và ngoại giao mềm dẻo.',
      positive_traits: ['Khả năng đàm phán, hòa giải xung đột xuất sắc', 'Trực giác tinh tế và sự nhạy bén cảm xúc'],
      shadow_traits: ['Dễ do dự, sợ mếch lòng hoặc nhượng bộ quá mức', 'Dễ bị ảnh hưởng tiêu cực bởi tâm lý đám đông'],
      career_guidance: 'Phát triển mạnh mẽ trong các lĩnh vực hợp tác kinh doanh, quan hệ đối tác, tư vấn, nhân sự và trị liệu.',
      relationships: 'Xây dựng mối quan hệ dựa trên sự chân thành, kiên nhẫn và chia sẻ sâu sắc.',
      decision_making: 'Cân nhắc kỹ lưỡng tác động của quyết định đến tất cả các bên liên quan.',
      money_management: 'Hợp tác đầu tư minh bạch, quản trị rủi ro thông qua thỏa thuận văn bản rõ ràng.',
      growth_actions: [
        'Thực hành lắng nghe sâu 100% không ngắt lời trong các cuộc trò chuyện quan trọng.',
        'Thiết lập ranh giới cá nhân rõ ràng: biết nói "Không" một cách lịch thiệp.'
      ],
      power_questions: [
        'Mối quan hệ hợp tác chiến lược nào đang cần bạn chủ động kết nối và nuôi dưỡng?',
        'Bạn có đang nhượng bộ ranh giới của mình chỉ để duy trì sự hòa hoãn tạm thời?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 2 là bài học về sự dung hòa và kết nối tinh tế. Để biến bài học Đường Đời thành thành tựu của Sứ Mệnh, bạn không thể hành động đơn độc mà cần nghệ thuật đồng hành, xây dựng liên minh và tạo dựng niềm tin bền vững với những người xung quanh.

### 2. Biểu Hiện Khi Cân Bằng
Bạn sở hữu năng lực hòa giải tự nhiên, biết cách lắng nghe những điều không nói thành lời và tìm ra điểm chung giữa các luồng quan điểm đối lập. Bạn là chất keo gắn kết đội ngũ và giúp các dự án vận hành mượt mà thông qua sự đồng thuận.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Khi bị chi phối bởi năng lượng tiêu cực của số 2, bạn dễ rơi vào tình trạng do dự, sợ làm tổn thương người khác nên không dám đưa ra quyết định cương quyết. Sự nhạy cảm quá mức có thể khiến bạn thu mình hoặc tích tụ uất ức khi không được thấu hiểu.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Xây dựng nguyên tắc "Ranh giới mềm nhưng chắc": yêu thương và hỗ trợ người khác nhưng không gánh vác thay trách nhiệm của họ.
• Sử dụng kỹ năng ngoại giao để kiến tạo các mối quan hệ đôi bên cùng có lợi (Win-Win).
• Dành không gian riêng mỗi ngày để thanh lọc năng lượng cảm xúc sau các buổi làm việc giao tiếp dày đặc.`
    },
    3: {
      core_energy: 'Năng lượng số 3 kết nối Đường Đời và Sứ Mệnh bằng khả năng truyền cảm hứng, biểu đạt ngôn từ và tư duy sáng tạo tích cực.',
      positive_traits: ['Giao tiếp lôi cuốn, truyền năng lượng và niềm tin', 'Tư duy sáng tạo, nhiều ý tưởng đột phá'],
      shadow_traits: ['Dễ phân tán nguồn lực vào quá nhiều sở thích', 'Nói nhiều hơn làm nếu thiếu kỷ luật thực thi'],
      career_guidance: 'Phù hợp với truyền thông, đào tạo, marketing, sáng tạo nội dung, nghệ thuật và diễn thuyết.',
      relationships: 'Mang lại tiếng cười, sự cởi mở và không khí tích cực cho mọi tương tác xã hội.',
      decision_making: 'Đưa ra quyết định nhanh dựa trên sự hứng khởi, cần bổ sung bảng phân tích dữ liệu thực tế.',
      money_management: 'Kiểm soát chi tiêu cảm xúc, tránh mua sắm bốc đồng theo tâm trạng nhất thời.',
      growth_actions: [
        'Luyện tập cô đọng thông điệp trong 3 ý chính khi trình bày trước đám đông.',
        'Chọn duy nhất 1 dự án sáng tạo trọng tâm và hoàn thành trọn vẹn trước khi mở dự án mới.'
      ],
      power_questions: [
        'Thông điệp truyền cảm hứng lớn nhất mà bạn muốn lan tỏa đến thế giới là gì?',
        'Ý tưởng sáng tạo nào của bạn đang cần được đóng gói thành một sản phẩm cụ thể?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 3 chỉ ra rằng chiếc chìa khóa vạn năng để bạn giải phóng xung đột nội tâm chính là khả năng biểu đạt: nói ra suy nghĩ, viết ra ý tưởng và chia sẻ câu chuyện cuộc đời mình. Bạn sinh ra để dùng ngôn từ và sự lạc quan thắp sáng con đường cho chính mình và người khác.

### 2. Biểu Hiện Khi Cân Bằng
Bạn là người truyền lửa tài ba, có khả năng biến những khái niệm phức tạp thành thông điệp gần gũi, cuốn hút. Năng lượng tích cực của bạn giúp giải tỏa bầu không khí căng thẳng và khơi gợi sự sáng tạo trong tập thể.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Điểm yếu chí tử của số 3 là sự phân tán và cả thèm chóng chán. Bạn có thể có hàng trăm ý tưởng xuất sắc nhưng lại gặp khó khăn ở khâu hoàn tất chi tiết. Ngoài ra, việc dùng sự hài hước để che đậy nỗi buồn nội tâm cũng có thể khiến bạn né tránh đối diện với các vấn đề cốt lõi.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Áp dụng quy tắc "Hoàn thành hơn hoàn hảo": cam kết đưa ít nhất 1 ý tưởng ra thị trường mỗi quý.
• Thiết lập đối tác phản biện hoặc người đồng hành có năng lượng số 4/số 8 để giữ bạn bám sát kế hoạch thực thi.
• Học cách đối diện chân thật với mọi cung bậc cảm xúc, không chỉ riêng sự vui vẻ bên ngoài.`
    },
    4: {
      core_energy: 'Năng lượng số 4 kết nối Đường Đời và Sứ Mệnh bằng tính kỷ luật, tư duy quy trình và sự kiên trì xây dựng nền tảng vững chắc.',
      positive_traits: ['Tổ chức bài bản, tỉ mỉ, đáng tin cậy tuyệt đối', 'Năng lực thực thi kiên định và khả năng quản trị rủi ro cao'],
      shadow_traits: ['Dễ cứng nhắc, bảo thủ hoặc ngại thay đổi phương pháp mới', 'Quá chú trọng chi tiết mà bỏ lỡ cơ hội lớn'],
      career_guidance: 'Phát triển xuất sắc trong quản trị vận hành, quy trình hệ thống, kỹ thuật, tài chính và xây dựng.',
      relationships: 'Đề cao sự trung thực, cam kết lâu dài và sự an toàn trách nhiệm đối với gia đình.',
      decision_making: 'Dựa trên số liệu, bằng chứng thực tế và quy trình chuẩn đã được kiểm chứng.',
      money_management: 'Tích lũy có kế hoạch, ưu tiên các kênh tài sản bảo toàn vốn và đầu tư dài hạn.',
      growth_actions: [
        'Hàng tuần dành 1 buổi đánh giá và tối ưu hóa 1 quy trình làm việc đang bị nghẽn.',
        'Tập mở rộng tư duy đón nhận ít nhất một phương pháp công nghệ hoặc quy trình đổi mới mỗi tháng.'
      ],
      power_questions: [
        'Hệ thống hay quy trình nào trong công việc của bạn đang cần được chuẩn hóa để nhân bản?',
        'Bạn có đang quá cầu toàn về chi tiết đến mức làm chậm tiến độ tổng thể?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 4 là bài học về sự vững chãi và tính kỷ luật. Để sứ mệnh cuộc đời không chỉ dừng lại ở những kế hoạch trên giấy, bạn cần năng lượng số 4 để đặt từng viên gạch thực tế, chuẩn hóa quy trình và tạo dựng nền móng có thể nhân bản bền vững qua thời gian.

### 2. Biểu Hiện Khi Cân Bằng
Bạn là chỗ dựa vững chắc cho đồng đội và tổ chức. Mọi kế hoạch qua tay bạn đều trở nên rõ ràng về lộ trình, ngân sách, nhân sự và thời hạn thực hiện. Bạn biến những ước mơ viển vông thành kết quả đo lường được.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Sự quá cẩn trọng có thể biến bạn thành người bảo thủ, sợ rủi ro và từ chối các cơ hội bứt phá mang tính đột biến. Khi gặp những thay đổi ngoài dự kiến, bạn dễ bị căng thẳng và có xu hướng kiểm soát vi mô khiến những người xung quanh ngột ngạt.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Xây dựng tư duy "Kỷ luật linh hoạt": giữ vững mục tiêu cốt lõi nhưng sẵn sàng điều chỉnh phương pháp khi môi trường biến đổi.
• Thực hành nới lỏng kiểm soát, tập trung vào kết quả đầu ra thay vì can thiệp vào từng bước đi của cấp dưới.
• Chăm sóc sức khỏe thể chất và cột sống thông qua các bài tập giãn cơ và thể thao định kỳ.`
    },
    5: {
      core_energy: 'Năng lượng số 5 kết nối Đường Đời và Sứ Mệnh bằng tinh thần đổi mới, sự linh hoạt thích ứng và khát vọng bứt phá mọi rào cản.',
      positive_traits: ['Nhạy bén với cơ hội mới, khả năng kết nối đa văn hóa', 'Dũng cảm thay đổi, tư duy mở và tự do sáng tạo'],
      shadow_traits: ['Dễ mất kiên nhẫn, thiếu nhất quán hoặc nuông chiều cảm xúc', 'Khó duy trì các công việc lặp đi lặp lại'],
      career_guidance: 'Phù hợp với kinh doanh, thương mại quốc tế, du lịch, truyền thông số, bán hàng và công nghệ đổi mới.',
      relationships: 'Tôn trọng không gian tự do của nhau, mang lại sự mới mẻ và trải nghiệm thú vị.',
      decision_making: 'Ra quyết định dựa trên cảm nhận về xu hướng tương lai và mức độ mở rộng cơ hội.',
      money_management: 'Đa dạng hóa danh mục đầu tư, giữ một quỹ dự phòng an toàn trước khi mạo hiểm.',
      growth_actions: [
        'Mỗi quý trải nghiệm một môi trường hoặc kỹ năng hoàn toàn mới để mở rộng góc nhìn.',
        'Lập danh sách 3 việc quan trọng nhất cần hoàn thành trước khi chuyển sang việc khác.'
      ],
      power_questions: [
        'Khuôn mẫu cũ kỹ nào đang kìm hãm bạn mà bạn cần can đảm phá vỡ ngay lúc này?',
        'Làm thế nào để bạn vừa tự do khám phá vừa giữ được sự cam kết với các mục tiêu dài hạn?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 5 đại diện cho làn gió đổi mới và sự giải phóng. Khi bạn cảm thấy cuộc sống bị bế tắc hoặc các mục tiêu Đường Đời và Sứ Mệnh dường như đang xung đột, giải pháp duy nhất là dám thay đổi góc nhìn, bước ra khỏi khuôn khổ chật hẹp và đón nhận những trải nghiệm mới.

### 2. Biểu Hiện Khi Cân Bằng
Bạn thích ứng cực kỳ nhanh với các biến động của thị trường và công nghệ. Bạn có khả năng kết nối những con người và lĩnh vực dường như không liên quan lại với nhau để tạo ra các mô hình kinh doanh hoặc giải pháp độc đáo.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Mặt trái của số 5 là sự thiếu bền bỉ và dễ bị cuốn vào những thú vui ngắn hạn. Bạn có thể bắt đầu rất hào hứng nhưng lại bỏ dở giữa chừng khi công việc đòi hỏi sự kiên trì và kỷ luật chi tiết.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Áp dụng nguyên tắc "Tự do trong khuôn khổ": tạo ra lịch làm việc linh hoạt nhưng có các mốc kiểm soát tiến độ không thể thương lượng.
• Rèn luyện khả năng đào sâu vấn đề thay vì chỉ dừng lại ở bề mặt của các xu hướng ngắn hạn.
• Thực hành chánh niệm hoặc thiền định để giữ tâm trí tĩnh lặng giữa những luồng thông tin dồn dập.`
    },
    6: {
      core_energy: 'Năng lượng số 6 kết nối Đường Đời và Sứ Mệnh bằng tình yêu thương, tinh thần trách nhiệm và năng lực chăm sóc, chữa lành cộng đồng.',
      positive_traits: ['Giàu lòng trắc ẩn, chu đáo, có mắt thẩm mỹ và năng lực xây dựng tổ ấm/đội ngũ', 'Khả năng gắn kết con người bằng tình cảm chân thành'],
      shadow_traits: ['Dễ gánh vác việc của người khác rồi sinh ra mệt mỏi, oán trách', 'Hay can thiệp sâu hoặc kỳ vọng quá cao vào người thân'],
      career_guidance: 'Xuất sắc trong quản trị nhân sự, giáo dục, chăm sóc sức khỏe, dịch vụ khách hàng, nghệ thuật và thiết kế.',
      relationships: 'Cống hiến hết mình, vun đắp sự an toàn và ấm áp cho gia đình và tập thể.',
      decision_making: 'Đặt giá trị con người và sự hài hòa lâu dài lên hàng đầu.',
      money_management: 'Ưu tiên tài chính cho gia đình, nhà ở, giáo dục con cái và các hoạt động bảo an đời sống.',
      growth_actions: [
        'Dành thời gian chăm sóc chính bản thân trước khi lo lắng cho người khác.',
        'Học cách buông tay để con cái hoặc cấp dưới tự trải nghiệm và chịu trách nhiệm về sai lầm của họ.'
      ],
      power_questions: [
        'Bạn có đang cố gắng gánh vác trách nhiệm không phải của mình?',
        'Điều gì sẽ giúp bạn cân bằng trọn vẹn giữa sự nghiệp bên ngoài và hạnh phúc gia đình?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 6 là bài học về tình yêu thương vô điều kiện kết hợp với tinh thần trách nhiệm. Bạn dung hòa các xung đột trong cuộc sống bằng cách đặt con người làm trung tâm, nuôi dưỡng các mối quan hệ bằng sự chân thành và tạo ra môi trường sống/làm việc an lành, thẩm mỹ.

### 2. Biểu Hiện Khi Cân Bằng
Bạn là người chữa lành tâm lý cho những người xung quanh. Dưới sự dẫn dắt của bạn, đội ngũ cảm thấy được tôn trọng, thấu hiểu và an tâm cống hiến. Bạn có khả năng tổ chức cuộc sống gia đình và công việc một cách ngăn nắp, ấm cúng.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Cạm bẫy lớn nhất của số 6 là hội chứng "Người cứu rỗi": bạn có xu hướng ôm đồm mọi rắc rối của người khác, can thiệp vào cuộc sống của họ với danh nghĩa yêu thương, để rồi cảm thấy thất vọng và kiệt sức khi đối phương không làm theo ý mình.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Thực hành "Tình yêu thương tỉnh thức": hỗ trợ bằng sự lắng nghe và tạo điều kiện, nhưng để người khác tự bước đi trên đôi chân của họ.
• Thiết lập lịch nghỉ ngơi và nạp lại năng lượng riêng cho bản thân mỗi tuần.
• Tận dụng năng khiếu thẩm mỹ và sắp đặt để biến không gian làm việc thành nơi tràn đầy cảm hứng.`
    },
    7: {
      core_energy: 'Năng lượng số 7 kết nối Đường Đời và Sứ Mệnh bằng năng lực nghiên cứu sâu, tư duy triết học và sự thức tỉnh trí tuệ nội tâm.',
      positive_traits: ['Óc phân tích sắc bén, khả năng nhìn thấu bản chất vấn đề', 'Tính tự lập cao, đam mê tri thức và phát triển bản thân'],
      shadow_traits: ['Dễ cô lập, đa nghi hoặc hoài nghi bản thân và người khác', 'Khó bộc lộ cảm xúc, tạo cảm giác xa cách'],
      career_guidance: 'Phù hợp với chuyên gia nghiên cứu, cố vấn chiến lược, phân tích dữ liệu, lập trình viên, nhà khoa học và giảng viên chuyên sâu.',
      relationships: 'Đề cao sự đồng điệu về mặt trí tuệ và tinh thần, cần không gian riêng tư được tôn trọng.',
      decision_making: 'Phân tích đa chiều, kiểm chứng kỹ lưỡng các nguyên lý trước khi kết luận.',
      money_management: 'Đầu tư bền vững vào tri thức, công nghệ và các tài sản có giá trị thực chất.',
      growth_actions: [
        'Mỗi ngày dành 30 phút tĩnh tâm hoặc đọc sách chuyên sâu không bị gián đoạn bởi thiết bị điện tử.',
        'Chủ động mở lòng chia sẻ tri thức và cảm xúc với ít nhất 1 người tin cậy mỗi tuần.'
      ],
      power_questions: [
        'Bài học sâu sắc nhất mà những biến cố gần đây đang muốn dạy cho bạn là gì?',
        'Làm thế nào để bạn đưa những hiểu biết tri thức sâu sắc của mình vào ứng dụng thực tiễn?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 7 là con đường của tri thức và sự chiêm nghiệm. Mọi xung đột giữa Đường Đời và Sứ Mệnh chỉ được hóa giải khi bạn dừng việc tìm kiếm câu trả lời ở bên ngoài và bắt đầu quay vào bên trong, đào sâu bản chất của vấn đề và đúc kết thành các nguyên lý vững chắc.

### 2. Biểu Hiện Khi Cân Bằng
Bạn sở hữu trí tuệ uyên bác và khả năng tự học siêu việt. Bạn không tin vào những lời đồn thổi bề nổi mà luôn truy tìm nguồn gốc thực sự. Lời khuyên và nhận định của bạn luôn mang tính chiến lược và có chiều sâu khác biệt.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Nếu chìm đắm quá mức vào thế giới nội tâm, số 7 có thể trở nên lạnh lùng, xa cách và phán xét người khác là "nông cạn". Sự đa nghi và cầu toàn về mặt lý thuyết có thể khiến bạn bỏ lỡ các thời cơ hành động thực tế.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Thực hành "Tri hành hợp nhất": học đến đâu, ứng dụng vào thực tế và chia sẻ cho cộng đồng đến đó.
• Rèn luyện kỹ năng kết nối cảm xúc, nhận ra rằng trí tuệ thực sự luôn đi kèm với lòng trắc ẩn và sự khiêm nhường.
• Tiếp cận thiên nhiên định kỳ để giải tỏa các căng thẳng thần kinh do suy nghĩ quá nhiều.`
    },
    8: {
      core_energy: 'Năng lượng số 8 kết nối Đường Đời và Sứ Mệnh bằng năng lực quản trị nguồn lực, tư duy tài chính sắc bén và bản lĩnh điều hành thực thi.',
      positive_traits: ['Tầm nhìn vĩ mô, khả năng quản trị tài chính và hiện thực hóa mục tiêu lớn', 'Bản lĩnh vững vàng trước áp lực kinh doanh'],
      shadow_traits: ['Dễ thực dụng, đặt áp lực vật chất quá nặng hoặc kiểm soát độc đoán', 'Khó chấp nhận thất bại và có xu hướng nghiện việc'],
      career_guidance: 'Xuất sắc trong vai trò CEO, điều hành doanh nghiệp, đầu tư tài chính, bất động sản, ngân hàng và thương mại quy mô lớn.',
      relationships: 'Thể hiện tình cảm bằng sự bảo bọc tài chính và hành động thực tế, cần bổ sung sự lắng nghe cảm xúc.',
      decision_making: 'Đo lường bằng chỉ số ROI, hiệu quả kinh tế và tính khả thi trong dài hạn.',
      money_management: 'Tối ưu hóa dòng tiền, sử dụng đòn bẩy tài chính thông minh và quản trị rủi ro chặt chẽ.',
      growth_actions: [
        'Thiết lập hệ thống đo lường hiệu suất tài chính cá nhân và doanh nghiệp minh bạch.',
        'Cân bằng giữa việc tích lũy tài sản và trao đi các giá trị thiện nguyện cho xã hội.'
      ],
      power_questions: [
        'Ranh giới tài chính và quyền lực nào bạn cần thiết lập rõ ràng hơn trong công việc?',
        'Thành công về mặt vật chất đang phục vụ cho mục đích sống cao đẹp nào của bạn?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 8 là bài học về quyền lực, tiền bạc và sự làm chủ thế giới vật chất. Để sứ mệnh cuộc đời nở rộ, bạn cần can đảm nắm giữ vị trí điều hành, làm chủ dòng tiền và chuyển hóa các giá trị tinh thần thành những thành tựu vật chất cụ thể, có thể đo lường được.

### 2. Biểu Hiện Khi Cân Bằng
Bạn có tư duy của một nhà lãnh đạo thực thụ: nhìn thấy bức tranh lớn, biết cách tập hợp và phân bổ nguồn lực (nhân lực, tài lực, công nghệ) để đạt được hiệu quả tối đa. Bạn không sợ áp lực mà lấy áp lực làm động lực để bứt phá quy mô.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Nguy cơ lớn nhất của số 8 là đồng nhất giá trị bản thân với số dư tài khoản hoặc chức danh xã hội. Khi bị cuốn vào vòng xoáy quyền lực, bạn có thể trở nên lạnh lùng, thực dụng và bỏ bê các mối quan hệ tình cảm cốt lõi.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Quản trị ranh giới tài chính minh bạch: kiểm soát tỷ lệ nợ (DTI), dòng tiền dự phòng và các thỏa thuận pháp lý chặt chẽ.
• Nuôi dưỡng tâm thế "Kinh doanh phụng sự": xem tiền bạc là phương tiện để tạo ra công ăn việc làm và nâng tầm xã hội.
• Dành thời gian kết nối với gia đình và chăm sóc sức khỏe tim mạch, huyết áp.`
    },
    9: {
      core_energy: 'Năng lượng số 9 kết nối Đường Đời và Sứ Mệnh bằng lòng nhân đạo, tinh thần cống hiến vì cộng đồng và khát vọng để lại di sản trường tồn.',
      positive_traits: ['Bao dung, tầm nhìn nhân văn vĩ mô, khả năng truyền cảm hứng phụng sự', 'Sẵn sàng hy sinh lợi ích cá nhân vì sự phát triển chung'],
      shadow_traits: ['Dễ mơ mộng xa vời, thiếu thực tế ở các khâu chi tiết', 'Khó buông bỏ quá khứ hoặc dễ bị lợi dụng lòng tốt'],
      career_guidance: 'Phù hợp với tổ chức phi chính phủ, giáo dục cộng đồng, y tế, văn hóa nghệ thuật, chính sách xã hội và lãnh đạo tinh thần.',
      relationships: 'Đối xử bình đẳng, bao dung và tôn trọng tất cả mọi người bất kể xuất thân.',
      decision_making: 'Đánh giá tác động xã hội và giá trị nhân văn lâu dài trước khi hành động.',
      money_management: 'Xem tài chính là công cụ phục vụ các dự án cộng đồng, cần có quy chế kiểm toán minh bạch.',
      growth_actions: [
        'Tham gia hoặc khởi xướng 1 hoạt động thiện nguyện có tính bền vững mỗi năm.',
        'Thực hành tha thứ và buông bỏ những oán hận từ các trải nghiệm trong quá khứ.'
      ],
      power_questions: [
        'Di sản ý nghĩa nhất mà bạn muốn để lại cho thế hệ sau là gì?',
        'Làm thế nào để bạn vừa phụng sự xã hội vừa bảo đảm sự vững vàng về kinh tế cho bản thân?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 9 là bài học cao nhất về sự buông bỏ và phụng sự. Mọi rào cản trên con đường của bạn sẽ tự động tan biến khi bạn nâng tầm mục tiêu của mình: từ mưu cầu cá nhân đơn thuần trở thành hành trình cống hiến giá trị cho cộng đồng và nhân loại.

### 2. Biểu Hiện Khi Cân Bằng
Bạn sở hữu trái tim rộng lớn và tầm nhìn vượt thời đại. Bạn có khả năng thu hút và dẫn dắt hàng ngàn người cùng hướng về một lý tưởng cao đẹp. Sự hiện diện của bạn mang lại niềm tin, sự an ủi và định hướng cho những mảnh đời khó khăn.

### 3. Điểm Mù & Thách Thức Cần Chuyển Hóa
Nếu thiếu sự thực tế, số 9 dễ rơi vào tình trạng "lo chuyện bao đồng" trong khi cuộc sống cá nhân chưa ổn định. Bạn cũng dễ bị dằn vặt bởi những bất công xã hội hoặc gặp khó khăn trong việc buông bỏ những mối quan hệ độc hại.

### 4. Lời Khuyên Hành Động & Định Hướng Phát Triển
• Thực hành "Bồ Tát đạo - Trí tuệ đi đôi với từ bi": giúp người đúng cách, trao cần câu thay vì chỉ cho con cá.
• Học cách đóng gói và chuyển giao quy trình để các dự án cộng đồng tự vận hành mà không phụ thuộc vào sức lực của riêng bạn.
• Đóng lại trọn vẹn những chương cũ của cuộc đời để sẵn sàng mở ra những cơ hội mới.`
    }
  },

  // 2. LIÊN KẾT LINH HỒN - NHÂN CÁCH (PERSONALITY BRIDGE / HDP BRIDGE)
  personality_bridge: {
    1: {
      core_energy: 'Năng lượng số 1 giúp hợp nhất nhu cầu nội tâm sâu kín và phong thái xã hội bên ngoài thông qua sự tự tin, chân thật và can đảm bộc lộ chính kiến.',
      positive_traits: ['Tính nhất quán cao, không giả tạo, dám bảo vệ quan điểm cá nhân', 'Phong thái đĩnh đạc, độc lập'],
      shadow_traits: ['Dễ tạo cảm giác phòng thủ hoặc xa cách khi bị góp ý', 'Cần học cách mềm mại trong giao tiếp'],
      career_guidance: 'Phù hợp với các vai trò đòi hỏi hình ảnh đại diện thương hiệu cá nhân mạnh mẽ và độc lập.',
      relationships: 'Thẳng thắn, minh bạch, không giấu giếm cảm xúc thật.',
      decision_making: 'Tự tin vào trực giác cá nhân, không bị lung lay bởi áp lực xã hội.',
      money_management: 'Tự chủ tài chính hoàn toàn, không phụ thuộc vào nguồn lực của người khác.',
      growth_actions: [
        'Thực hành nói thẳng suy nghĩ của mình trong các cuộc họp quan trọng với thái độ xây dựng.',
        'Mỗi tuần dành thời gian nhìn lại xem hành vi bên ngoài có phản ánh đúng giá trị cốt lõi bên trong chưa.'
      ],
      power_questions: [
        'Bạn có đang ngần ngại bộc lộ con người thật của mình vì sợ bị phán xét?',
        'Điều gì sẽ giúp bạn tự tin tỏa sáng 100% bản sắc độc bản của mình?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối Linh Hồn – Nhân Cách số 1 là chiếc chìa khóa giúp bạn tháo bỏ mặt nạ xã hội để sống một cuộc đời chân thật nhất. Nó đòi hỏi bạn phải có lòng can đảm để thể hiện những khát khao thầm kín của Linh Hồn ra ngoài thế giới thông qua phong thái Nhân Cách tự tin, độc lập.

### 2. Biểu Hiện Khi Cân Bằng
Không có sự mâu thuẫn giữa con người bên trong và hình ảnh bên ngoài của bạn. Bạn là người "nói là làm, nghĩ sao nói vậy", tạo dựng được uy tín cá nhân vững chắc và sự kính trọng từ những người xung quanh.

### 3. Điểm Mù & Thách Thức
Nếu thiếu cân bằng, bạn có thể dựng lên một vỏ bọc quá cứng rắn, tỏ ra bất cần hoặc luôn ở thế phòng thủ vì sợ người khác nhìn thấy sự yếu đuối bên trong tâm hồn mình.

### 4. Lời Khuyên Hành Động
• Học cách thể hiện sự dễ bị tổn thương một cách có kiểm soát với những người thực sự tin cậy.
• Nhất quán giữa giá trị cá nhân và các thông điệp truyền thông thương hiệu bên ngoài.`
    },
    2: {
      core_energy: 'Năng lượng số 2 giúp kết nối nội tâm và hành vi bằng sự dịu dàng, lắng nghe và khả năng bộc lộ cảm xúc tinh tế.',
      positive_traits: ['Duyên dáng, hòa nhã, tạo cảm giác an tâm cho người đối diện', 'Biết cách dung hòa nhu cầu bản thân và người khác'],
      shadow_traits: ['Dễ kìm nén cảm xúc thật để làm hài lòng đám đông', 'Sợ xung đột nên có xu hướng né tránh đối thoại thẳng thắn'],
      career_guidance: 'Phát triển mạnh trong các công việc đòi hỏi giao tế, chăm sóc khách hàng, ngoại giao và trị liệu.',
      relationships: 'Nuôi dưỡng tình cảm bằng sự chu đáo, thấu cảm và chia sẻ chân thành.',
      decision_making: 'Tìm kiếm giải pháp hòa bình, tránh các xung đột đối đầu gay gắt.',
      money_management: 'Cùng thảo luận và thống nhất các kế hoạch tài chính với người bạn đời.',
      growth_actions: [
        'Tập bộc lộ cảm xúc không hài lòng một cách êm ái nhưng rõ ràng ngay khi vấn đề phát sinh.',
        'Thực hành viết nhật ký cảm xúc mỗi tối để nhận diện nhu cầu nội tâm đích thực.'
      ],
      power_questions: [
        'Bạn có đang hy sinh mong muốn của Linh Hồn chỉ để giữ hình ảnh hiền lành bên ngoài?',
        'Làm thế nào để bạn vừa giữ được sự hòa nhã vừa bảo vệ được tiếng nói bên trong?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối số 2 giúp bắc nhịp cầu cảm xúc giữa thế giới nội tâm sâu kín và phong thái ứng xử xã hội. Bạn dung hòa bản thân với thế giới xung quanh bằng sự tinh tế, lòng trắc ẩn và sự tôn trọng đối phương.

### 2. Biểu Hiện Khi Cân Bằng
Bạn tỏa ra năng lượng bình an, khiến mọi người xung quanh luôn cảm thấy thoải mái và tin tưởng khi tiếp xúc. Bạn biết cách thể hiện mong muốn của mình một cách khéo léo mà không cần phải gồng mình hay gây hấn.

### 3. Điểm Mù & Thách Thức
Bạn dễ rơi vào cái bẫy "Làm hài lòng tất cả mọi người" (People Pleaser). Bạn giấu kín nỗi buồn hoặc sự bất đồng trong lòng, bên ngoài vẫn mỉm cười, dẫn đến sự phân liệt cảm xúc và stress tích tụ.

### 4. Lời Khuyên Hành Động
• Hãy nhớ rằng: "Sự trung thực chân thành luôn có giá trị cao hơn sự hòa hoãn giả tạo".
• Tập nói lên mong muốn của bản thân mà không cần cảm thấy có lỗi.`
    },
    8: {
      core_energy: 'Năng lượng số 8 giúp hợp nhất nội tâm và hình ảnh xã hội bằng sự đĩnh đạc, tính chuyên nghiệp cao và năng lực làm chủ giá trị cá nhân.',
      positive_traits: ['Thần thái tự tin, sang trọng, phong cách lãnh đạo chuyên nghiệp', 'Định giá đúng bản thân và quản trị nguồn lực hiệu quả'],
      shadow_traits: ['Dễ để vẻ hào nhoáng bên ngoài lấn át sự an yên nội tâm', 'Căng thẳng khi hình ảnh thành công bị thử thách'],
      career_guidance: 'Xuất sắc trong xây dựng thương hiệu cá nhân cấp cao, đàm phán thương mại và điều hành doanh nghiệp.',
      relationships: 'Tôn trọng sự cam kết, rõ ràng về ranh giới tài chính và trách nhiệm.',
      decision_making: 'Quyết đoán, cân nhắc trên bức tranh tổng thể và giá trị bền vững.',
      money_management: 'Quản trị tài sản bài bản, đầu tư nâng tầm phong cách sống xứng tầm.',
      growth_actions: [
        'Định kỳ rà soát các cam kết để đảm bảo hành động bên ngoài luôn phục vụ đúng mục đích tâm hồn.',
        'Dành thời gian tĩnh lặng để kết nối lại với giá trị bình an phi vật chất.'
      ],
      power_questions: [
        'Hình ảnh thành công bạn đang thể hiện bên ngoài có thực sự mang lại sự thỏa nguyện bên trong?',
        'Bạn cần buông bỏ áp lực chứng minh điều gì với xã hội?'
      ],
      full_description: `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
Cầu Nối HDP số 8 là bài học về sự tự chủ và định giá bản thân. Nó giúp bạn chuyển hóa những khát khao nội tâm thành phong thái đĩnh đạc, bản lĩnh và thành công có thực chất ngoài đời thực, xóa bỏ hoàn toàn cảm giác tự ti hoặc hoài nghi năng lực.

### 2. Biểu Hiện Khi Cân Bằng
Bạn có phong thái của một người làm chủ cuộc đời: tự tin, chuyên nghiệp và đáng tin cậy. Bạn không cần phải phô trương nhưng người khác vẫn cảm nhận được sức mạnh nội tại và năng lực thực thi vững vàng của bạn.

### 3. Điểm Mù & Thách Thức
Nếu quá chú trọng vào việc giữ gìn vỏ bọc thành đạt hoàn hảo, bạn có thể tự tạo áp lực khủng khiếp cho chính mình. Sự ngắt kết nối giữa khát khao giản dị bên trong và hình ảnh lộng lẫy bên ngoài có thể gây ra cảm giác cô đơn tột cùng.

### 4. Lời Khuyên Hành Động
• Hãy để thành công bên ngoài là kết quả tự nhiên của sự bình an và trí tuệ bên trong.
• Thực hành sống chân thật với những giới hạn của bản thân, cho phép mình được nghỉ ngơi mà không cảm thấy tội lỗi.`
    }
  },

  // 3. CHỈ SỐ THÁI ĐỘ (ATTITUDE)
  attitude: {
    1: {
      core_energy: 'Phản xạ ban đầu trước biến cố là tính chủ động, quyết liệt và lập tức tìm kiếm giải pháp tiên phong để làm chủ tình thế.',
      positive_traits: ['Nhanh nhẹn, không hoảng loạn, lập tức hành động', 'Tinh thần chịu trách nhiệm cao'],
      shadow_traits: ['Dễ nóng vội, bực bội nếu người khác xử lý chậm chạp', 'Có xu hướng gạt bỏ ý kiến xung quanh'],
      career_guidance: 'Phù hợp xử lý các tình huống khủng hoảng cần người đứng mũi chịu sào.',
      relationships: 'Thẳng thắn, rõ ràng, muốn giải quyết dứt điểm khúc mắc ngay trong ngày.',
      decision_making: 'Ra quyết định tức thì dựa trên mục tiêu trước mắt.',
      money_management: 'Chủ động cắt lỗ hoặc nắm bắt cơ hội tài chính chớp nhoáng.',
      growth_actions: ['Hít thở sâu 3 nhịp trước khi phản hồi trong các tình huống căng thẳng.'],
      power_questions: ['Bạn có đang phản ứng quá nhanh trước khi lắng nghe đủ thông tin?'],
      full_description: `### 1. Bản Chất Phản Xạ Tự Nhiên
Chỉ số Thái Độ 1 định hình phản ứng đầu tiên của bạn khi đối mặt với bất kỳ sự việc bất ngờ nào: bạn lập tức đứng thẳng dậy, nhận trách nhiệm và tìm cách xử lý ngay. Bạn không bao giờ chọn đóng vai nạn nhân hay chờ đợi người khác đến giải cứu.

### 2. Biểu Hiện Trong Đời Thường
Người xung quanh cảm nhận ở bạn sự tự tin, quả quyết và tốc độ. Trong các cuộc họp hay sự cố bất ngờ, bạn luôn là người đầu tiên lên tiếng đưa ra đề xuất hành động.

### 3. Cạm Bẫy Cần Lưu Ý
Sự vội vã có thể khiến bạn đưa ra quyết định khi chưa đủ dữ liệu. Tính khí bộc trực và thiếu kiên nhẫn với những người phản ứng chậm có thể vô tình làm tổn thương mối quan hệ.

### 4. Lời Khuyên Chuyển Hóa
• Thực hành nguyên tắc "Chậm lại 5 giây" để chuyển từ phản xạ cảm xúc sang phản ứng tỉnh thức.
• Học cách ghi nhận đóng góp của tập thể thay vì chỉ tập trung vào giải pháp của riêng mình.`
    },
    9: {
      core_energy: 'Phản xạ tự nhiên trước biến cố là lòng trắc ẩn, nhìn nhận sự việc dưới góc độ bức tranh lớn và tìm kiếm giải pháp nhân văn.',
      positive_traits: ['Bình tĩnh, bao dung, thấu hiểu nguyên nhân sâu xa của vấn đề', 'Không chấp nhặt lỗi lầm nhỏ'],
      shadow_traits: ['Dễ bị cảm xúc chi phối hoặc suy nghĩ quá xa vời thực tế', 'Ngại đối đầu trực diện với sự thật phũ phàng'],
      career_guidance: 'Phù hợp với các vai trò hòa giải, quản trị quan hệ cộng đồng và xử lý khủng hoảng truyền thông.',
      relationships: 'Luôn sẵn sàng tha thứ và cho người khác cơ hội sửa sai.',
      decision_making: 'Ưu tiên sự hài hòa và đạo đức hơn là thắng thua ngắn hạn.',
      money_management: 'Hào phóng nhưng cần giữ sự tỉnh táo trước các lời đề nghị vay mượn.',
      growth_actions: ['Tập trung vào những hành động thực tế có thể làm ngay thay vì chỉ trăn trở về lý tưởng.'],
      power_questions: ['Bạn có đang vì thương người mà dung túng cho những hành vi thiếu trách nhiệm?'],
      full_description: `### 1. Bản Chất Phản Xạ Tự Nhiên
Khi đứng trước nghịch cảnh hay biến cố, người có Thái Độ 9 phản ứng bằng sự điềm tĩnh và lòng trắc ẩn. Bạn có xu hướng nhìn sự việc từ góc độ vĩ mô, tự hỏi "Bài học lớn ở đây là gì?" và tìm cách giải quyết sao cho ít gây tổn thương nhất cho tất cả các bên.

### 2. Biểu Hiện Trong Đời Thường
Ấn tượng đầu tiên bạn để lại cho người khác là sự ấm áp, hào sảng và đáng tin cậy. Bạn sẵn sàng dang tay giúp đỡ người gặp khó khăn mà không toan tính thiệt hơn.

### 3. Cạm Bẫy Cần Lưu Ý
Sự nhạy cảm và bao dung quá mức có thể khiến bạn bị lợi dụng. Đôi khi bạn mải lo cho cảm xúc của người khác mà quên bảo vệ quyền lợi chính đáng của mình và tổ chức.

### 4. Lời Khuyên Chuyển Hóa
• Kết hợp "Trái tim nóng và cái đầu lạnh" khi giải quyết khủng hoảng.
• Thiết lập nguyên tắc rõ ràng giữa sự vị tha và tính kỷ luật nghiêm minh.`
    }
  },

  // 4. CHỈ SỐ NỢ BÀI HỌC (KARMIC DEBT)
  karmic_debt: {
    0: {
      core_energy: 'Bản đồ không mang cấu phần Nợ bài học lớn, năng lượng lưu thông thông suốt và cân bằng.',
      positive_traits: ['Tâm lý nhẹ nhàng, phát triển thuận lợi khi đi đúng trường năng lượng', 'Ít gặp các biến cố mang tính lặp lại cực đoan'],
      shadow_traits: ['Dễ chủ quan nếu không duy trì kỷ luật bản thân liên tục'],
      career_guidance: 'Tự do lựa chọn lĩnh vực phát triển theo sở trường và đam mê.',
      relationships: 'Xây dựng mối quan hệ thuận hòa, tôn trọng và nâng đỡ nhau.',
      decision_making: 'Sáng suốt, ít bị chi phối bởi các bóng ma tâm lý quá khứ.',
      money_management: 'Tích lũy và đầu tư bền vững theo đúng chu kỳ kinh tế.',
      growth_actions: ['Chủ động rèn luyện tính kỷ luật để tối ưu hóa thuận duyên cuộc đời.'],
      power_questions: ['Bạn đang tận dụng thuận duyên hiện tại để tạo ra giá trị gì cho xã hội?'],
      full_description: `### 1. Ý Nghĩa Vận Trình
Bản đồ số học của bạn không xuất hiện các con số Nợ bài học đặc thù (13/4, 14/5, 16/7, 19/1). Điều này chỉ ra rằng năng lượng bẩm sinh của bạn khá thông suốt, bạn không phải gánh vác những khuôn mẫu nghiệp lực lặp đi lặp lại mang tính thử thách cực đoan.

### 2. Lợi Thế Phát Triển
Bạn có điều kiện thuận lợi để tập trung 100% tâm trí vào việc rèn luyện bài học Đường Đời và phát huy tài năng Sứ Mệnh. Khi nỗ lực đúng hướng, bạn thường gặt hái kết quả xứng đáng mà không bị những cản trở vô hình làm gián đoạn.

### 3. Lời Khuyên Khai Vấn
Thuận duyên là một món quà, nhưng sự bứt phá bền vững vẫn đòi hỏi tính kỷ luật và sự kiên trì mỗi ngày. Hãy chủ động đặt ra những tiêu chuẩn cao cho bản thân để không ngừng vươn tới sự hoàn thiện.`
    },
    13: {
      core_energy: 'Nợ Bài Học 13/4: Bài học về tính kỷ luật, sự kiên trì lao động thực chất và vượt qua thói quen đi đường tắt.',
      positive_traits: ['Ý chí sắt đá, sức chịu đựng phi thường sau khi chuyển hóa', 'Khả năng xây dựng lại từ đầu vững chắc'],
      shadow_traits: ['Dễ nản lòng khi công việc đòi hỏi chi tiết tỉ mỉ hoặc hay tìm cách làm nhanh'],
      career_guidance: 'Phù hợp với các lĩnh vực đòi hỏi sự chính xác, quy trình và kiên định dài hạn.',
      relationships: 'Học cách giữ cam kết và trung thực tuyệt đối trong mọi lời hứa.',
      decision_making: 'Dựa trên kế hoạch chi tiết, không đánh cược vào vận may.',
      money_management: 'Tích lũy từng bước, tuyệt đối tránh các cơ hội làm giàu nhanh thiếu minh bạch.',
      growth_actions: ['Cam kết hoàn thành trọn vẹn mọi công việc đã bắt đầu, dù nhỏ nhất.'],
      power_questions: ['Công việc nào bạn đang muốn bỏ cuộc mà thực ra chỉ cần thêm sự kiên trì?'],
      full_description: `### 1. Nguồn Gốc & Ý Nghĩa Bài Học
Nợ Bài Học 13/4 xuất hiện như một lời nhắc nhở về giá trị của sự chăm chỉ, kỷ luật và trung thực trong lao động. Trong quá khứ hoặc thói quen cũ, bạn có thể từng có xu hướng ỷ lại, tìm cách đi đường tắt hoặc né tránh công việc nặng nhọc.

### 2. Biểu Hiện Thử Thách
Bạn có thể thường xuyên cảm thấy mình phải làm việc vất vả hơn người khác mới đạt được cùng một kết quả, hoặc khi sắp hoàn thành thì lại phát sinh chướng ngại đòi hỏi phải làm lại từ đầu. Đây là cơ chế tôi luyện bản lĩnh và tính tỉ mỉ của bạn.

### 3. Chìa Khóa Chuyển Hóa
• Chấp nhận rằng: "Không có đường tắt dẫn đến thành công bền vững".
• Rèn luyện thói quen tổ chức, ngăn nắp, làm việc có kế hoạch chi tiết từng bước.
• Khi bạn vượt qua được bài học 13/4, bạn sẽ trở thành một chuyên gia thực thụ với năng lực thực thi không ai có thể lay chuyển.`
    },
    19: {
      core_energy: 'Nợ Bài Học 19/1: Bài học về sự độc lập chân chính, học cách lắng nghe, thấu cảm và buông bỏ cái tôi độc đoán.',
      positive_traits: ['Bản lĩnh lãnh đạo kiên cường, khả năng tự lực cánh sinh vượt bậc', 'Ý chí vươn lên mạnh mẽ'],
      shadow_traits: ['Dễ cô lập bản thân, cái tôi quá lớn, ngại mở lời nhờ giúp đỡ hoặc áp đặt người khác'],
      career_guidance: 'Xuất sắc trong vai trò dẫn dắt khi học được cách trao quyền và truyền cảm hứng.',
      relationships: 'Học cách chia sẻ điểm yếu và đón nhận sự hỗ trợ từ người thân, đồng nghiệp.',
      decision_making: 'Lắng nghe phản hồi đa chiều trước khi đưa ra quyết định độc lập.',
      money_management: 'Tự chủ tài chính nhưng minh bạch trong hợp tác kinh doanh.',
      growth_actions: ['Mỗi tuần thực hành mở lời đề nghị sự giúp đỡ từ đồng đội trong ít nhất 1 việc.'],
      power_questions: ['Cái tôi hay sự sĩ diện nào đang ngăn bạn đón nhận sự giúp đỡ quý giá?'],
      full_description: `### 1. Nguồn Gốc & Ý Nghĩa Bài Học
Nợ Bài Học 19/1 xuất hiện khi bạn cần hoàn tất bài học về sự tự chủ và mối tương quan giữa cá nhân với tập thể. Thói quen cũ có thể là sự lạm dụng quyền lực, áp đặt ý chí lên người khác hoặc ngược lại là sự phụ thuộc vào người khác rồi sinh ra oán trách.

### 2. Biểu Hiện Thử Thách
Bạn thường rơi vào những hoàn cảnh buộc phải tự mình xoay xở một mình mà không có ai giúp đỡ, hoặc cảm thấy cô đơn ngay giữa đám đông. Bạn có xu hướng tự ái cao, ngại nhờ vả vì sợ bị xem thường.

### 3. Chìa Khóa Chuyển Hóa
• Nhận ra rằng: "Biết đón nhận sự giúp đỡ cũng là một biểu hiện của sự khiêm nhường và dũng cảm".
• Chuyển từ "Tôi là trung tâm" sang "Tôi là người kết nối và nâng đỡ mọi người cùng thành công".
• Khi tốt nghiệp bài học 19/1, bạn sẽ trở thành một nhà lãnh đạo kiệt xuất với trái tim bao dung và tầm ảnh hưởng sâu rộng.`
    }
  },

  // 5. CHỈ SỐ THIẾU TRONG HỌ TÊN (KARMIC LESSONS)
  karmic_lessons: {
    6: {
      core_energy: 'Chỉ số Thiếu 6 phản ánh chủ đề cần rèn luyện có chủ đích về kỹ năng chăm sóc, lắng nghe và dung hòa trách nhiệm với gia đình và tập thể.',
      positive_traits: ['Khi rèn luyện, bạn xây dựng được năng lực quan tâm sâu sắc và tinh tế', 'Khả năng kiến tạo không gian sống và làm việc an lành'],
      shadow_traits: ['Dễ né tránh trách nhiệm gia đình hoặc ngược lại là lo lắng thái quá', 'Lúng túng trong việc bộc lộ tình cảm ấm áp'],
      career_guidance: 'Phù hợp rèn luyện qua các công việc quản lý nhân sự, dịch vụ khách hàng, chăm sóc đời sống nội bộ.',
      relationships: 'Chủ động bày tỏ tình cảm bằng lời nói và cử chỉ ân cần cụ thể mỗi ngày.',
      decision_making: 'Luôn tính đến yếu tố con người và sự ổn định của tập thể trước khi ra quyết định.',
      money_management: 'Phân bổ ngân sách bảo vệ và chăm sóc gia đình một cách có kế hoạch.',
      growth_actions: [
        'Mỗi ngày dành ít nhất 1 hành động quan tâm thiết thực tới một người thân trong gia đình.',
        'Thực hành lắng nghe không phán xét khi người thân chia sẻ cảm xúc.'
      ],
      power_questions: [
        'Hành động chăm sóc cụ thể nào bạn có thể làm hôm nay để người thân cảm nhận được sự ấm áp?',
        'Bạn có đang giữ khoảng cách cảm xúc vì ngại gánh vác trách nhiệm?'
      ],
      full_description: `### 1. Ý Nghĩa Bài Học Rèn Luyện
Số 6 không xuất hiện trong chuỗi chữ cái của họ tên khai sinh. Theo phương pháp Life Maps, điều này chỉ gợi ý một chủ đề kỹ năng mềm cần rèn luyện thêm: đó là nghệ thuật chăm sóc, tinh thần trách nhiệm và khả năng bày tỏ tình yêu thương; hoàn toàn không đủ cơ sở để kết luận về tuổi thơ, gia đình hay mức độ được yêu thương trong quá khứ.

### 2. Biểu Hiện Thường Gặp
Bạn có thể cảm thấy hơi ngượng ngùng hoặc lúng túng khi phải thể hiện sự quan tâm trực diện, hoặc đôi khi có xu hướng ưu tiên công việc bên ngoài hơn là việc nhà. Khi chưa rèn luyện kỹ năng này, bạn có thể dễ bị xem là người hơi khô khan dù bên trong tâm hồn rất thiện lương.

### 3. Chiến Lược Vun Bồi & Chuyển Hóa
• **Chủ động thực hành cử chỉ chăm sóc:** Bắt đầu từ những việc nhỏ như hỏi thăm sức khỏe, chuẩn bị bữa ăn hay lắng nghe người thân 15 phút mỗi tối.
• **Xây dựng ranh giới lành mạnh:** Yêu thương và chăm sóc bằng sự tôn trọng tự do, không bao bọc thái quá cũng không bỏ bê.
• **Chăm sóc bản thân trước:** Bạn chỉ có thể trao đi tình yêu thương ấm áp khi chính bạn cảm thấy đủ đầy và bình an bên trong.`
    }
  },

  // 6. CHỈ SỐ THỬ THÁCH (CHALLENGES)
  challenges: {
    1: {
      core_energy: 'Thử thách 1 là bài toán cân bằng giữa hai thái cực: vượt qua sự phụ thuộc/e ngại đánh giá bên ngoài và kiềm chế xu hướng áp đặt cái tôi để bảo vệ sự độc lập.',
      positive_traits: ['Khi vượt qua, bạn sở hữu bản lĩnh tự chủ vững vàng và năng lực lãnh đạo đầy thấu cảm', 'Dám bảo vệ lẽ phải'],
      shadow_traits: ['Dễ rơi vào thế phòng thủ, sợ bị so sánh hoặc phản ứng gắt gao khi bị chỉ trích'],
      career_guidance: 'Rèn luyện qua các vai trò quản lý độc lập, tự chịu trách nhiệm về KPIs và dẫn dắt đội ngũ.',
      relationships: 'Tôn trọng sự bình đẳng và độc lập của đối phương, không áp đặt quan điểm.',
      decision_making: 'Độc lập ra quyết định sau khi đã lắng nghe phản hồi đa chiều một cách khách quan.',
      money_management: 'Tự chủ dòng tiền cá nhân, không để phụ thuộc tài chính làm mất đi tiếng nói riêng.',
      growth_actions: [
        'Thực hành lắng nghe 3 phút không ngắt lời khi người khác đóng góp ý kiến phản biện.',
        'Mỗi ngày tự đưa ra 1 quyết định mà không cần hỏi ý kiến xin phép từ bất kỳ ai.'
      ],
      power_questions: [
        'Bạn có đang vì sợ bị phán xét mà kìm hãm năng lực lãnh đạo tự nhiên của mình?',
        'Làm thế nào để bạn vừa độc lập quyết đoán vừa giữ được sự kết nối mềm mại với đồng đội?'
      ],
      full_description: `### 1. Bản Chất Bài Kiểm Tra
Thử thách 1 là bài kiểm tra cốt lõi về tính tự lập và lòng tự trọng lành mạnh. Thử thách này có thể biểu hiện ở hai cực căng kéo: một mặt là sự e ngại, dễ so sánh mình với người khác hoặc bị phụ thuộc vào ý kiến đám đông; mặt khác là phản ứng ngược lại bằng cách dựng lên vỏ bọc áp đặt, độc đoán để bảo vệ tính độc lập của mình.

### 2. Biểu Hiện Căng Kéo Trong Thực Tế
Trong giai đoạn chịu tác động của Thử thách 1, bạn thường đứng trước những tình huống buộc bạn phải tự mình đưa ra lựa chọn và chịu trách nhiệm 100%. Nếu chùn bước vì sợ sai lầm, bạn sẽ đánh mất quyền làm chủ cuộc đời; nếu quá độc đoán, bạn sẽ tự cô lập mình khỏi sự trợ lực của tập thể.

### 3. Chiến Lược Vượt Qua Thử Thách
• **Xây dựng sự tự tin nội tại:** Nhận thức rõ rằng giá trị của bạn không phụ thuộc vào lời khen hay tiếng chê từ bên ngoài.
• **Lãnh đạo bằng sự đồng hành:** Chuyển từ "Ra lệnh áp đặt" sang "Truyền cảm hứng và làm gương".
• **Tự chủ tài chính & tư duy:** Độc lập trong dòng tiền và vững vàng trong lập trường nguyên tắc sống.`
    }
  }
};
