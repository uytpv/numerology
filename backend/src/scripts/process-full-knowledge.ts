import * as fs from 'fs';
import * as path from 'path';
import { cleanAndFormatText } from './cleanTextHelper';
import { DEEP_ENRICHMENT_CATALOG, IndicatorRecord } from './enrichKnowledgeCatalog';

// TỪ ĐIỂN TỔNG QUÁT VỀ TÍNH CHẤT 1-9, 11, 22, 33 CỦA PYTHAGORAS
const NUMBER_PROFILES: Record<number, {
  name: string;
  archetype: string;
  coreKeyword: string;
  positive: string[];
  shadow: string[];
  career: string;
  relationship: string;
  decision: string;
  money: string;
  actions: string[];
  questions: string[];
}> = {
  0: {
    name: 'Tiềm Năng Thuần Khiết / Vô Cực',
    archetype: 'Vũ Trụ & Khởi Nguyên',
    coreKeyword: 'Tiềm năng vô hạn, tự do tuyệt đối, trực giác sơ khởi',
    positive: ['Khả năng thích ứng với mọi hoàn cảnh', 'Trực giác nhạy bén và tâm hồn rộng mở'],
    shadow: ['Dễ mông lung hoặc thiếu định hướng cụ thể', 'Khó duy trì cam kết nếu không có kỷ luật'],
    career: 'Phù hợp với các lĩnh vực sáng tạo tự do, đổi mới sáng tạo, nghiên cứu trừu tượng.',
    relationship: 'Chân thành, cởi mở, không định kiến.',
    decision: 'Dựa trên cảm nhận tổng thể và trực giác linh hoạt.',
    money: 'Quản trị linh hoạt, cần học cách tích lũy bài bản.',
    actions: ['Thiết lập mục tiêu ngắn hạn rõ ràng để neo giữ hành động thực tế.'],
    questions: ['Bạn đang hướng tiềm năng vô hạn của mình vào mục tiêu cụ thể nào?']
  },
  1: {
    name: 'Người Tiên Phong & Lãnh Đạo',
    archetype: 'Nhà Tiên Phong (Pioneer / Leader)',
    coreKeyword: 'Độc lập, ý chí, quyết đoán, tiên phong, tự chủ',
    positive: ['Bản lĩnh dám nghĩ dám làm, tinh thần trách nhiệm cao', 'Khả năng khởi xướng và dẫn dắt vượt trội'],
    shadow: ['Dễ bảo thủ, độc đoán hoặc áp đặt ý chí', 'Ngại mở lời nhờ vả, dễ ôm đồm kiệt sức'],
    career: 'Lãnh đạo doanh nghiệp, quản lý dự án, sáng lập khởi nghiệp, chuyên gia tư vấn độc lập.',
    relationship: 'Thẳng thắn, tôn trọng sự độc lập của đối phương, cần mềm mại trong lắng nghe.',
    decision: 'Quyết đoán, tốc độ, chịu trách nhiệm 100% về kết quả.',
    money: 'Tập trung tạo ra nguồn thu mới và đầu tư mạo hiểm có tính toán.',
    actions: ['Thực hành trao quyền cho cộng sự và lắng nghe phản hồi đa chiều.'],
    questions: ['Quyết định can đảm nào bạn cần thực hiện ngay lúc này?']
  },
  2: {
    name: 'Người Hòa Giải & Kết Nối',
    archetype: 'Nhà Ngoại Giao (Diplomat / Peacemaker)',
    coreKeyword: 'Hợp tác, thấu cảm, lắng nghe, hòa bình, trực giác',
    positive: ['Kỹ năng ngoại giao tinh tế, khả năng thấu hiểu cảm xúc sâu sắc', 'Chất keo gắn kết tập thể'],
    shadow: ['Dễ do dự, nhượng bộ quá mức vì sợ mất lòng', 'Nhạy cảm quá mức, dễ bị tổn thương'],
    career: 'Ngoại giao, đàm phán hợp tác, nhân sự, chăm sóc khách hàng, tư vấn tâm lý, trị liệu.',
    relationship: 'Nuôi dưỡng tình cảm bằng sự thấu hiểu, ân cần và kiên nhẫn đồng hành.',
    decision: 'Tìm kiếm sự đồng thuận và cân nhắc tác động đến tất cả các bên.',
    money: 'Quản trị an toàn, ưu tiên hợp tác đầu tư minh bạch và bảo toàn vốn.',
    actions: ['Thiết lập ranh giới cá nhân lành mạnh và học cách nói "Không" lịch thiệp.'],
    questions: ['Bạn có đang vì sợ mâu thuẫn mà kìm nén tiếng nói thật của mình?']
  },
  3: {
    name: 'Người Truyền Cảm Hứng & Sáng Tạo',
    archetype: 'Nhà Truyền Tin (Communicator / Creator)',
    coreKeyword: 'Biểu đạt, sáng tạo, lạc quan, truyền cảm hứng, giao tiếp',
    positive: ['Khả năng ngôn từ lôi cuốn, tư duy sáng tạo dồi dào', 'Lan tỏa năng lượng tích cực'],
    shadow: ['Dễ phân tán năng lượng, cả thèm chóng chán', 'Thiếu kỷ luật thực thi chi tiết'],
    career: 'Truyền thông, marketing, sáng tạo nội dung, diễn thuyết, đào tạo, nghệ thuật biểu diễn.',
    relationship: 'Mang lại tiếng cười, sự cởi mở và không khí vui tươi cho các mối quan hệ.',
    decision: 'Ra quyết định dựa trên cảm hứng và khả năng tạo ra sự đổi mới.',
    money: 'Cần kiểm soát chi tiêu cảm xúc và thiết lập ngân sách tiết kiệm tự động.',
    actions: ['Cam kết hoàn thành trọn vẹn 1 dự án trước khi bắt đầu dự án mới.'],
    questions: ['Thông điệp truyền cảm hứng lớn nhất bạn muốn gửi tới cuộc đời là gì?']
  },
  4: {
    name: 'Người Xây Dựng & Chuyên Gia Quy Trình',
    archetype: 'Kiến Trúc Sư Nền Tảng (Builder / Systemizer)',
    coreKeyword: 'Kỷ luật, quy trình, vững chắc, thực tế, tỉ mỉ',
    positive: ['Tổ chức bài bản, làm việc có phương pháp, đáng tin cậy tuyệt đối', 'Năng lực thực thi kiên định'],
    shadow: ['Dễ cứng nhắc, bảo thủ hoặc quá cầu toàn chi tiết', 'Ngại đổi mới và khó thích ứng nhanh'],
    career: 'Quản trị vận hành, quy trình hệ thống, tài chính kế toán, kỹ thuật, xây dựng, pháp lý.',
    relationship: 'Chung thủy, trách nhiệm, coi trọng sự an toàn và cam kết dài lâu.',
    decision: 'Dựa trên số liệu thực tế, logic quy trình và đánh giá rủi ro chặt chẽ.',
    money: 'Tích lũy có kế hoạch, ưu tiên tài sản hữu hình và đầu tư an toàn.',
    actions: ['Thực hành nới lỏng kiểm soát và đón nhận ít nhất 1 ý tưởng đổi mới mỗi tháng.'],
    questions: ['Quy trình nào của bạn đang cần được tinh gọn và số hóa?']
  },
  5: {
    name: 'Người Tiên Phong Đổi Mới & Thích Ứng',
    archetype: 'Nhà Thám Hiểm (Explorer / Catalyst)',
    coreKeyword: 'Tự do, đổi mới, linh hoạt, trải nghiệm, thích ứng',
    positive: ['Nhạy bén với cơ hội thị trường, khả năng thích nghi siêu việt', 'Tư duy mở và sáng tạo đột phá'],
    shadow: ['Dễ mất kiên nhẫn, thiếu nhất quán hoặc bốc đồng', 'Khó duy trì kỷ luật với công việc lặp lại'],
    career: 'Kinh doanh, thương mại quốc tế, bán hàng, du lịch, truyền thông số, công nghệ đổi mới.',
    relationship: 'Tôn trọng sự tự do của nhau, mang lại sự tươi mới và trải nghiệm thú vị.',
    decision: 'Nhanh chóng nắm bắt cơ hội dựa trên tầm nhìn xu hướng tương lai.',
    money: 'Đa dạng hóa nguồn thu, cần giữ quỹ dự phòng bất biến.',
    actions: ['Áp dụng quy tắc "Tự do trong khuôn khổ" để duy trì cam kết mục tiêu cốt lõi.'],
    questions: ['Thói quen cũ nào đang kìm hãm sự bứt phá của bạn?']
  },
  6: {
    name: 'Người Chăm Sóc & Nuôi Dưỡng Trách Nhiệm',
    archetype: 'Người Bảo Hộ (Nurturer / Guardian)',
    coreKeyword: 'Trách nhiệm, yêu thương, gia đình, phụng sự, thẩm mỹ',
    positive: ['Chu đáo, giàu lòng trắc ẩn, khả năng vun đắp tập thể và gia đình', 'Mắt thẩm mỹ tinh tế'],
    shadow: ['Dễ ôm đồm, can thiệp quá sâu hoặc kiểm soát vì danh nghĩa yêu thương', 'Dễ mệt mỏi vì hy sinh'],
    career: 'Giáo dục, y tế, quản trị nhân sự, dịch vụ khách hàng, thiết kế nội thất, nghệ thuật.',
    relationship: 'Hết lòng vì người thân, tạo dựng không gian an ấm và che chở.',
    decision: 'Đặt lợi ích gia đình và sự hài hòa con người làm trọng tâm.',
    money: 'Đầu tư cho mái ấm, giáo dục con cái và các quỹ bảo an đời sống.',
    actions: ['Học cách chăm sóc bản thân trước và để người khác tự chịu trách nhiệm về lựa chọn của họ.'],
    questions: ['Bạn có đang gánh vác trách nhiệm thay cho người khác?']
  },
  7: {
    name: 'Người Tìm Kiếm Chân Lý & Chiến Lược Gia',
    archetype: 'Triết Gia & Học Giả (Seeker / Strategist)',
    coreKeyword: 'Trí tuệ, nghiên cứu, chiêm nghiệm, trực giác sâu, chiến lược',
    positive: ['Khả năng đào sâu bản chất vấn đề, tư duy phân tích độc lập', 'Năng lực tự học xuất sắc'],
    shadow: ['Dễ cô lập, đa nghi hoặc xa cách xã hội', 'Hay phán xét và khó bộc lộ cảm xúc'],
    career: 'Nghiên cứu khoa học, cố vấn chiến lược, phân tích dữ liệu, lập trình, giảng viên chuyên sâu.',
    relationship: 'Cần sự đồng điệu về trí tuệ và không gian riêng tư được tôn trọng.',
    decision: 'Đào sâu nguyên lý cốt lõi, không hành động theo cảm tính bề nổi.',
    money: 'Ưu tiên đầu tư cho tri thức, công nghệ và tài sản tri thức bền vững.',
    actions: ['Thực hành "Tri hành hợp nhất" - mang tri thức sâu sắc vào ứng dụng thực tiễn.'],
    questions: ['Hiểu biết nào của bạn đang cần được đóng gói thành giải pháp thực tế?']
  },
  8: {
    name: 'Người Điều Hành & Làm Chủ Nguồn Lực',
    archetype: 'Nhà Điều Hành Thực Thi (Executive / Ruler)',
    coreKeyword: 'Thành tựu, quyền lực, tài chính, điều hành, hiệu quả',
    positive: ['Tầm nhìn chiến lược vĩ mô, khả năng quản trị tài chính và hiện thực hóa mục tiêu lớn', 'Bản lĩnh vững vàng'],
    shadow: ['Dễ thực dụng, độc đoán hoặc bị cuốn vào vòng xoáy vật chất', 'Nghiện việc và bỏ bê cảm xúc'],
    career: 'CEO, điều hành doanh nghiệp, đầu tư tài chính, bất động sản, ngân hàng, thương mại lớn.',
    relationship: 'Bảo bọc tài chính và hành động thực tế, cần học cách lắng nghe cảm xúc.',
    decision: 'Đo lường bằng chỉ số hiệu quả thực tế và giá trị gia tăng bền vững.',
    money: 'Tối ưu hóa dòng tiền, quản trị rủi ro đòn bẩy và tái đầu tư sinh lời.',
    actions: ['Thiết lập ranh giới minh bạch giữa công việc và đời sống cá nhân.'],
    questions: ['Thành công tài chính đang phục vụ cho sứ mệnh sống cao đẹp nào của bạn?']
  },
  9: {
    name: 'Người Phụng Sự Nhân Đạo & Di Sản',
    archetype: 'Nhà Nhân Đạo (Humanitarian / Healer)',
    coreKeyword: 'Bao dung, nhân đạo, cống hiến, buông bỏ, di sản',
    positive: ['Trái tim nhân hậu, tầm nhìn nhân văn rộng lớn, truyền cảm hứng phụng sự', 'Khát vọng cống hiến'],
    shadow: ['Dễ mơ mộng thiếu thực tế, khó buông bỏ quá khứ', 'Dễ bị lợi dụng lòng tốt'],
    career: 'Tổ chức phi chính phủ, giáo dục cộng đồng, y tế, văn hóa nghệ thuật, chính sách xã hội.',
    relationship: 'Bao dung, bình đẳng, tôn trọng và nâng đỡ người yếu thế.',
    decision: 'Đặt giá trị nhân văn và tác động xã hội lâu dài lên hàng đầu.',
    money: 'Sử dụng tài chính làm công cụ tạo tác động tích cực cho cộng đồng.',
    actions: ['Học cách khép lại những chương cũ trong cuộc đời để đón nhận cơ hội mới.'],
    questions: ['Di sản ý nghĩa nhất bạn muốn để lại cho thế hệ sau là gì?']
  },
  11: {
    name: 'Bậc Thầy Trực Giác & Khai Sáng',
    archetype: 'Người Khai Sáng (Master Intuitive / Illuminator)',
    coreKeyword: 'Khai sáng, trực giác siêu nhạy, truyền cảm hứng tinh thần, tầm nhìn',
    positive: ['Trực giác nhạy bén, khả năng nhìn thấu tiềm năng con người', 'Nguồn năng lượng truyền cảm hứng mạnh mẽ'],
    shadow: ['Dễ bị căng thẳng thần kinh, nhạy cảm quá mức với năng lượng xung quanh', 'Áp lực tự thân lớn'],
    career: 'Nhà khai vấn, tâm lý học, cố vấn tinh thần, giáo dục khai phóng, truyền thông nghệ thuật.',
    relationship: 'Đòi hỏi sự thấu hiểu tâm hồn sâu sắc và chân thành tuyệt đối.',
    decision: 'Kết hợp trực giác nhạy bén với các bằng chứng thực tế.',
    money: 'Tài chính vững vàng khi tập trung vào các dự án mang lại giá trị nhân văn.',
    actions: ['Thực hành thiền định, bảo vệ trường năng lượng cá nhân khỏi căng thẳng.'],
    questions: ['Bạn đang dùng trực giác và sự nhạy bén của mình để khai sáng điều gì?']
  },
  22: {
    name: 'Bậc Thầy Kiến Tạo Di Sản',
    archetype: 'Kiến Trúc Sư Vĩ Đại (Master Builder)',
    coreKeyword: 'Kiến tạo quy mô lớn, hiện thực hóa tầm nhìn vĩ mô, di sản bền vững',
    positive: ['Khả năng biến những ý tưởng khổng lồ thành hiện thực', 'Năng lực tổ chức và lãnh đạo tầm cỡ quốc tế'],
    shadow: ['Gánh nặng trách nhiệm quá lớn gây kiệt sức', 'Dễ thất vọng nếu cộng sự không theo kịp tiêu chuẩn'],
    career: 'Sáng lập các tập đoàn, lãnh đạo tổ chức quốc tế, phát triển hạ tầng, dự án cộng đồng quy mô lớn.',
    relationship: 'Cam kết cao độ, đồng hành vì những mục tiêu phụng sự vĩ đại.',
    decision: 'Chiến lược vĩ mô kết hợp quản trị chi tiết hoàn hảo.',
    money: 'Quản trị các dòng vốn quy mô lớn và tạo dựng nền tảng tài chính trường tồn.',
    actions: ['Học cách xây dựng đội ngũ kế thừa để chia sẻ gánh nặng triển khai.'],
    questions: ['Dự án vĩ đại nào bạn muốn hiện thực hóa cho xã hội?']
  },
  33: {
    name: 'Bậc Thầy Chữa Lành & Tình Yêu Vô Điều Kiện',
    archetype: 'Người Thầy Đại Bi (Master Teacher / Healer)',
    coreKeyword: 'Tình yêu vị tha, chữa lành tâm hồn, nâng tầm ý thức cộng đồng',
    positive: ['Lòng bao dung vô bờ bến, khả năng chữa lành và nâng đỡ tâm hồn con người', 'Năng lượng bình an'],
    shadow: ['Dễ quên mình vì người khác dẫn đến kiệt quệ sinh lực', 'Quá nhạy cảm với nỗi đau thế gian'],
    career: 'Lãnh đạo tinh thần, chuyên gia chữa lành, giáo dục cấp cao, tổ chức nhân đạo toàn cầu.',
    relationship: 'Yêu thương vô điều kiện, bao dung và tôn trọng tự do của đối phương.',
    decision: 'Lấy sự giác ngộ và nâng đỡ con người làm kim chỉ nam.',
    money: 'Dòng tiền lưu chuyển phục vụ cho các công trình phụng sự nhân loại.',
    actions: ['Giữ vững sự cân bằng giữa việc trao đi yêu thương và tự tái tạo sinh lực bản thân.'],
    questions: ['Làm thế nào để bạn vừa phụng sự thế giới vừa giữ được sự an yên nội tại?']
  }
};

// Hàm sinh nội dung chuyên sâu Tầng 2 chuẩn mực cho từng chỉ số và con số
function generateDeepSectionAnalysis(indCode: string, indName: string, num: number): {
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
} {
  // Kiểm tra nếu có trong từ điển định nghĩa riêng
  if (DEEP_ENRICHMENT_CATALOG[indCode] && DEEP_ENRICHMENT_CATALOG[indCode][num]) {
    return DEEP_ENRICHMENT_CATALOG[indCode][num];
  }

  const profile = NUMBER_PROFILES[num] || NUMBER_PROFILES[1];

  let specificContext = '';
  let roleTitle = '';

  switch (indCode) {
    case 'soul_bridge':
      roleTitle = 'Cầu Nối Đường Đời – Sứ Mệnh';
      specificContext = `Trong vai trò Cầu Nối Đường Đời – Sứ Mệnh, năng lượng số ${num} là chiếc chìa khóa giúp bạn hóa giải các xung đột giữa "yêu cầu của hoàn cảnh sống" (Đường Đời) và "năng lực hành động tự nhiên" (Sứ Mệnh).`;
      break;
    case 'personality_bridge':
      roleTitle = 'Cầu Nối Linh Hồn – Nhân Cách';
      specificContext = `Trong vai trò Cầu Nối Linh Hồn – Nhân Cách, năng lượng số ${num} giúp bạn hợp nhất khát khao nội tâm sâu kín với phong thái ứng xử xã hội, mang lại sự chân thật và tự tin trọn vẹn.`;
      break;
    case 'attitude':
      roleTitle = 'Chỉ Số Thái Độ';
      specificContext = `Chỉ số Thái Độ mang năng lượng số ${num} phản ánh phản xạ tức thì của bạn trước những biến cố bất ngờ và ấn tượng đầu tiên bạn để lại cho thế giới xung quanh.`;
      break;
    case 'karmic_debt':
      roleTitle = 'Nợ Bài Học / Bài Học Chuyển Hóa';
      specificContext = `Năng lượng số ${num} trong chỉ số Bài Học chỉ ra những rèn luyện then chốt về tính kỷ luật, đạo đức và sự kiên trì mà bạn cần hoàn tất để bước lên nấc thang tiến hóa mới.`;
      break;
    case 'generation':
      roleTitle = 'Chỉ Số Thế Hệ';
      specificContext = `Con số Thế Hệ ${num} đại diện cho bối cảnh lịch sử, tâm thức thời đại và xu hướng phát triển chung mà thế hệ của bạn đang cùng gánh vác và kiến tạo.`;
      break;
    case 'personal_year':
      roleTitle = 'Chỉ Số Năm Cá Nhân';
      specificContext = `Năm Cá Nhân số ${num} là giai đoạn đặc thù trong chu kỳ phát triển 9 năm, mang lại thời cơ chiến lược và những bài toán trọng tâm bạn cần tập trung nguồn lực để hoàn thành.`;
      break;
    case 'personal_month':
      roleTitle = 'Chỉ Số Tháng Cá Nhân';
      specificContext = `Tháng Cá Nhân số ${num} điều phối nhịp điệu hành động ngắn hạn, giúp bạn tối ưu hóa hiệu suất làm việc và phân bổ năng lượng phù hợp trong từng tuần.`;
      break;
    case 'personal_day':
      roleTitle = 'Chỉ Số Ngày Cá Nhân';
      specificContext = `Ngày Cá Nhân số ${num} mang tần số vi mô, gợi ý cách thức phản ứng và ra quyết định hiệu quả nhất trong các tương tác hàng ngày.`;
      break;
    case 'challenges':
      roleTitle = 'Chỉ Số Thách Thức';
      specificContext = `Thách Thức số ${num} là bài kiểm tra nghị lực được thiết kế để giúp bạn nhận diện điểm mù, rèn luyện sự dẻo dai và chuyển hóa điểm yếu thành năng lực phòng thủ vững vàng.`;
      break;
    case 'karmic_lessons':
      roleTitle = 'Chỉ Số Thiếu Trong Họ Tên';
      specificContext = `Con số ${num} không xuất hiện trong các chữ cái họ tên khai sinh, phản ánh nhóm kỹ năng mềm cần sự chú tâm rèn luyện có chủ đích qua học tập và hợp tác.`;
      break;
    case 'balance':
      roleTitle = 'Chỉ Số Cân Bằng';
      specificContext = `Chỉ số Cân Bằng số ${num} là chiếc mỏ neo tinh thần giúp bạn lấy lại sự bình tĩnh, sáng suốt và thế chủ động khi đối diện với các khủng hoảng đời thường.`;
      break;
    case 'maturity':
      roleTitle = 'Chỉ Số Trưởng Thành';
      specificContext = `Chỉ số Trưởng Thành ${num} thức tỉnh mạnh mẽ sau tuổi 30-40, là giai đoạn gặt hái thành quả và định hình di sản bền vững mà bạn muốn để lại cho đời.`;
      break;
    case 'subconscious_confidence':
      roleTitle = 'Sức Mạnh Tiềm Thức';
      specificContext = `Sức Mạnh Tiềm Thức số ${num} phản ánh mức độ phong phú của kho tàng phản xạ vô thức, tiếp thêm sự tự tin và niềm tin nội tại khi bạn đương đầu với thử thách.`;
      break;
    case 'rational_thought':
      roleTitle = 'Tư Duy Lý Trí';
      specificContext = `Tư Duy Lý Trí số ${num} định hình phong cách xử lý thông tin, phân tích dữ liệu và cơ chế ra quyết định logic của bạn.`;
      break;
    case 'hidden_passion':
      roleTitle = 'Đam Mê Ẩn Giấu';
      specificContext = `Đam Mê Ẩn Giấu số ${num} là ngọn lửa nhiệt huyết âm thầm thôi thúc bạn tìm kiếm niềm vui, sự thỏa nguyện và năng lượng sáng tạo trong công việc.`;
      break;
    case 'pinnacles':
      roleTitle = 'Đỉnh Cao Kim Tự Tháp';
      specificContext = `Đỉnh Cao số ${num} đại diện cho cột mốc thành tựu và cơ hội gặt hái quả ngọt tương ứng với nỗ lực rèn luyện của bạn trong chặng đời này.`;
      break;
    default:
      roleTitle = `Chỉ Số ${indName}`;
      specificContext = `Năng lượng số ${num} tác động trực tiếp vào chỉ số ${indName}, định hình năng lực và hành trình phát triển của bạn.`;
      break;
  }

  const full_description = `### 1. Ý Nghĩa Năng Lượng Cốt Lõi
${specificContext}

Mang bản chất của ${profile.archetype}, con số ${num} đại diện cho các phẩm chất cốt lõi: **${profile.coreKeyword}**. Khi bạn hiểu rõ cơ chế vận hành của năng lượng này, bạn sẽ làm chủ được phản xạ tư duy và hành vi của chính mình.

### 2. Biểu Hiện Thực Tế & Lợi Thế Vượt Trội
Khi ở trạng thái cân bằng, bạn phát huy tối đa các thế mạnh tự nhiên:
• ${profile.positive[0]}
• ${profile.positive[1]}
• Bạn có khả năng định vị vấn đề nhanh chóng và tạo dựng niềm tin vững chắc đối với những người xung quanh.

### 3. Thách Thức & Điểm Mù Cần Chuyển Hóa
Nếu thiếu sự tự nhận thức hoặc chịu áp lực kéo dài, năng lượng số ${num} có thể biểu hiện dưới dạng vùng tối:
• ${profile.shadow[0]}
• ${profile.shadow[1]}
• Việc nhận diện rõ những cạm bẫy tâm lý này giúp bạn chủ động phòng ngừa thay vì để hoàn cảnh đưa đẩy vào thế bị động.

### 4. Lời Khuyên Hành Động & Chiến Lược Chuyển Hóa
• **Hành động ưu tiên:** ${profile.actions[0]}
• **Định hướng nghề nghiệp & môi trường:** ${profile.career}
• **Trong các mối quan hệ:** ${profile.relationship}
• **Tự vấn khai vấn:** *"${profile.questions[0]}"*`;

  return {
    core_energy: `Trường năng lượng của số ${num} tác động vào ${indName}, kiến tạo phẩm chất ${profile.coreKeyword}.`,
    positive_traits: profile.positive,
    shadow_traits: profile.shadow,
    career_guidance: profile.career,
    relationships: profile.relationship,
    decision_making: profile.decision,
    money_management: profile.money,
    growth_actions: profile.actions,
    power_questions: profile.questions,
    full_description
  };
}

async function processFullKnowledge() {
  console.log('=== BẮT ĐẦU XỬ LÝ LÀM SẠCH VÀ LÀM GIÀU DỮ LIỆU KNOWLEDGE BASE 252 RECORDS ===');

  const backendFilePath = path.join(__dirname, '..', 'ai', 'knowledge', 'knowledge_base_252.json');
  const clientFilePath = path.join(__dirname, '..', '..', '..', 'client_web', 'src', 'lib', 'knowledge', 'knowledge_base_252.json');

  if (!fs.existsSync(backendFilePath)) {
    console.error('Không tìm thấy file:', backendFilePath);
    process.exit(1);
  }

  const rawData: Record<string, any> = JSON.parse(fs.readFileSync(backendFilePath, 'utf-8'));
  const cleanedMatrix: Record<string, IndicatorRecord> = {};

  let cleanedCount = 0;
  let enrichedCount = 0;

  for (const [key, record] of Object.entries(rawData)) {
    const indCode = record.indicator_code || key.replace(/_\d+$/, '');
    const indName = record.indicator_name || indCode;
    const num = typeof record.number === 'number' ? record.number : parseInt(key.match(/\d+$/)?.[0] || '1', 10);

    const rawDesc = record.full_description || '';
    const cleanedDesc = cleanAndFormatText(rawDesc);

    // Kiểm tra xem bài có bị quá ngắn hoặc là văn bản mẫu 1 dòng không
    const isTooShortOrGeneric = cleanedDesc.length < 250 || 
      cleanedDesc.includes('đại diện cho sự phát triển vượt bậc khi bạn biết dung hòa') ||
      cleanedDesc.includes('Trường năng lượng của số');

    if (isTooShortOrGeneric) {
      // Làm giàu chuyên sâu bằng bộ từ điển Pythagorean Life Coaching
      const enriched = generateDeepSectionAnalysis(indCode, indName, num);
      cleanedMatrix[key] = {
        indicator_code: indCode,
        indicator_name: indName,
        number: num,
        core_energy: enriched.core_energy,
        positive_traits: enriched.positive_traits,
        shadow_traits: enriched.shadow_traits,
        career_guidance: enriched.career_guidance,
        relationships: enriched.relationships,
        decision_making: enriched.decision_making,
        money_management: enriched.money_management,
        growth_actions: enriched.growth_actions,
        power_questions: enriched.power_questions,
        full_description: enriched.full_description
      };
      enrichedCount++;
    } else {
      // Giữ nguyên nội dung đã trích xuất nhưng LÀM SẠCH 100% LỖI DÍNH CHỮ VÀ NGẮT DÒNG
      const profile = NUMBER_PROFILES[num] || NUMBER_PROFILES[1];
      cleanedMatrix[key] = {
        indicator_code: indCode,
        indicator_name: indName,
        number: num,
        core_energy: record.core_energy ? cleanAndFormatText(record.core_energy) : `Năng lượng số ${num} trong chỉ số ${indName}.`,
        positive_traits: record.positive_traits && record.positive_traits.length > 0
          ? record.positive_traits.map((t: string) => cleanAndFormatText(t))
          : profile.positive,
        shadow_traits: record.shadow_traits && record.shadow_traits.length > 0
          ? record.shadow_traits.map((t: string) => cleanAndFormatText(t))
          : profile.shadow,
        career_guidance: record.career_guidance ? cleanAndFormatText(record.career_guidance) : profile.career,
        relationships: record.relationships ? cleanAndFormatText(record.relationships) : profile.relationship,
        decision_making: record.decision_making ? cleanAndFormatText(record.decision_making) : profile.decision,
        money_management: record.money_management ? cleanAndFormatText(record.money_management) : profile.money,
        growth_actions: record.growth_actions && record.growth_actions.length > 0
          ? record.growth_actions.map((t: string) => cleanAndFormatText(t))
          : profile.actions,
        power_questions: record.power_questions && record.power_questions.length > 0
          ? record.power_questions.map((t: string) => cleanAndFormatText(t))
          : profile.questions,
        full_description: cleanedDesc
      };
      cleanedCount++;
    }
  }

  // Bổ sung các alias key đặc biệt để lookup an toàn tuyệt đối
  const specialDebts = [0, 13, 14, 16, 19];
  for (const debtNum of specialDebts) {
    const aliasKey = `karmic_debt_${debtNum}`;
    if (!cleanedMatrix[aliasKey]) {
      const enriched = generateDeepSectionAnalysis('karmic_debt', 'Nợ Bài Học', debtNum);
      cleanedMatrix[aliasKey] = {
        indicator_code: 'karmic_debt',
        indicator_name: debtNum === 0 ? 'Không có nợ bài học lớn' : `Nợ Bài Học ${debtNum}/${debtNum === 13 ? 4 : debtNum === 14 ? 5 : debtNum === 16 ? 7 : 1}`,
        number: debtNum,
        core_energy: enriched.core_energy,
        positive_traits: enriched.positive_traits,
        shadow_traits: enriched.shadow_traits,
        career_guidance: enriched.career_guidance,
        relationships: enriched.relationships,
        decision_making: enriched.decision_making,
        money_management: enriched.money_management,
        growth_actions: enriched.growth_actions,
        power_questions: enriched.power_questions,
        full_description: enriched.full_description
      };
    }
  }

  console.log(`✓ Đã xử lý tổng cộng ${Object.keys(cleanedMatrix).length} bản ghi:`);
  console.log(`  - Làm sạch văn bản trích xuất: ${cleanedCount} bản ghi`);
  console.log(`  - Làm giàu chuyên sâu Tầng 2: ${enrichedCount} bản ghi`);

  // Lưu file Backend
  fs.writeFileSync(backendFilePath, JSON.stringify(cleanedMatrix, null, 2), 'utf-8');
  console.log(`✓ Đã lưu file Backend: ${backendFilePath}`);

  // Lưu file Client Web
  fs.writeFileSync(clientFilePath, JSON.stringify(cleanedMatrix, null, 2), 'utf-8');
  console.log(`✓ Đã lưu file Client Web: ${clientFilePath}`);

  console.log('=== HOÀN TẤT CHUẨN HÓA VÀ NÂNG CẤP KHO TRI THỨC 252 RECORDS! ===');
}

processFullKnowledge().catch(console.error);
