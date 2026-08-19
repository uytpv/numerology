// ============================================================================
// ADAPTIVE READING PROFILES ENGINE (APDE)
// Hệ thống định hình phong cách trình bày, độ dài và văn phong theo Persona
// ============================================================================

export type ReadingProfileId = 'executive' | 'dynamic' | 'deep' | 'empathic';

export interface ReadingProfileConfig {
  id: ReadingProfileId;
  name: string;
  shortName: string;
  tagline: string;
  pageCount: string;
  targetAudience: string;
  icon: string;
  badgeColor: string;
  accentBg: string;
  borderColor: string;
  description: string;
  keyHighlights: string[];
  toneStyle: string;
}

export const READING_PROFILES: Record<ReadingProfileId, ReadingProfileConfig> = {
  executive: {
    id: 'executive',
    name: 'Thực Chiến & Quản Trị (Executive)',
    shortName: 'Thực Chiến',
    tagline: 'Súc tích, trọng tâm, đòn bẩy tài chính & chỉ số hành động',
    pageCount: '12–18 trang',
    targetAudience: 'Nhà quản trị, lãnh đạo, người bận rộn (Nhóm số 8, 4, 1, 22)',
    icon: '⚡',
    badgeColor: 'bg-[#013E37] text-[#FFEFB3]',
    accentBg: 'bg-[#EEF5F3]',
    borderColor: 'border-[#267D71]',
    description: 'Tối ưu hóa thời gian đọc bằng cách đưa ngay Core Map, Executive Summary lên đầu; tập trung vào năng lực thực thi, quản trị dòng tiền, OKRs/KPIs và loại bỏ các diễn giải triết học dài dòng.',
    keyHighlights: [
      'Bản đồ cốt lõi (Core Map) & Executive Summary 1 trang',
      'Ma trận thực thi chiến lược & Bản lĩnh điều hành',
      'Chỉ số tài chính, tỷ lệ nợ (DTI) & Quỹ dự phòng khẩn cấp',
      'Kế hoạch hành động 7 / 30 / 90 ngày định lượng'
    ],
    toneStyle: 'Khúc chiết, trực diện, hướng đến hiệu quả và kết quả thực tế.'
  },
  dynamic: {
    id: 'dynamic',
    name: 'Trực Quan & Nhanh Gọn (Dynamic Action)',
    shortName: 'Trực Quan',
    tagline: 'Visual cards, infographics, từ khóa trọng tâm & hành động ngay',
    pageCount: '8–12 trang',
    targetAudience: 'Người thích tự do, sáng tạo, ghét đọc dài (Nhóm số 5, 3)',
    icon: '🚀',
    badgeColor: 'bg-amber-500 text-white',
    accentBg: 'bg-amber-50',
    borderColor: 'border-amber-400',
    description: 'Chuyển hóa toàn bộ nội dung thành các thẻ đồ họa trực quan (Visual Cards), gạch đầu dòng và Action Cheatsheet; giúp người đọc nắm bắt bản sắc và triển khai hành động chỉ trong 5 phút.',
    keyHighlights: [
      'Visual Cards & Thẻ tóm tắt từ khóa',
      'Action Cheatsheet 7 ngày tức thì',
      'Bản đồ tam giác vàng rút gọn & Đỉnh cao kim tự tháp',
      'Lược bỏ các diễn giải lý thuyết và phân tích hàn lâm'
    ],
    toneStyle: 'Tươi sáng, năng động, ngắn gọn và giàu cảm hứng.'
  },
  deep: {
    id: 'deep',
    name: 'Chiêm Nghiệm & Kiểm Toán Sâu (Deep Research)',
    shortName: 'Chiêm Nghiệm',
    tagline: 'Toàn diện 21 chỉ số, ma trận tương tác đa chiều & kiểm toán chữ cái',
    pageCount: '25–35 trang',
    targetAudience: 'Người phân tích, nghiên cứu, thích đào sâu bản chất (Nhóm số 7, 11)',
    icon: '🔬',
    badgeColor: 'bg-purple-900 text-purple-100',
    accentBg: 'bg-purple-50',
    borderColor: 'border-purple-300',
    description: 'Dành cho những người muốn hiểu cặn kẽ từng nguyên lý Pythagoras cổ điển: bao gồm đầy đủ 21 chỉ số, ma trận tương tác đa yếu tố, các câu hỏi tự vấn triết học và bảng kiểm toán dữ liệu từng từ trong họ tên.',
    keyHighlights: [
      'Trọn bộ 21 chỉ số chi tiết từ Tầng 1 đến Tầng 3',
      'Phân tích tương tác ma trận đa chiều (Interaction Matrix)',
      'Bộ câu hỏi khai vấn tự phản tỉnh chuyên sâu (Power Questions)',
      'Phụ lục kiểm toán dữ liệu họ tên & đối chiếu phương pháp'
    ],
    toneStyle: 'Điềm tĩnh, học thuật, lập luận logic và chiêm nghiệm sâu sắc.'
  },
  empathic: {
    id: 'empathic',
    name: 'Gắn Kết & Trắc Ẩn (Empathic Harmonizer)',
    shortName: 'Gắn Kết',
    tagline: 'Ấm áp, nâng đỡ tinh thần, nghệ thuật lắng nghe & tổ ấm gia đình',
    pageCount: '18–25 trang',
    targetAudience: 'Người hướng gia đình, chăm sóc đội ngũ, phụng sự (Nhóm số 6, 2, 9, 33)',
    icon: '💖',
    badgeColor: 'bg-rose-700 text-white',
    accentBg: 'bg-rose-50',
    borderColor: 'border-rose-300',
    description: 'Tập trung sâu vào các khía cạnh tình cảm, sự thấu cảm, gắn kết gia đình và nuôi dưỡng đội ngũ; hướng dẫn phương pháp lắng nghe, thiết lập ranh giới lành mạnh và chăm sóc sức khỏe cảm xúc.',
    keyHighlights: [
      'Phân tích nhu cầu kết nối & Động lực nội tâm',
      'Nghệ thuật lắng nghe 3 phút & Gắn kết tổ ấm',
      'Phương pháp chăm sóc bản thân (Self-Care) tránh kiệt sức',
      'Kế hoạch nuôi dưỡng các mối quan hệ chất lượng'
    ],
    toneStyle: 'Ấm áp, thấu cảm, nâng đỡ tinh thần và giàu tính nhân văn.'
  }
};

export interface ProfileRecommendationResult {
  recommendedProfile: ReadingProfileConfig;
  scores: Record<ReadingProfileId, number>;
  confidence: number;
  reasoning: string;
}

export function recommendReadingProfile(
  lifePath: number,
  soul: number,
  personality: number,
  rationalThought: number = 1
): ProfileRecommendationResult {
  const scores: Record<ReadingProfileId, number> = {
    executive: 0,
    dynamic: 0,
    deep: 0,
    empathic: 0
  };

  // Trọng số đánh giá:
  // Life Path: 40 điểm | Soul: 30 điểm | Personality: 15 điểm | Rational Thought: 15 điểm

  // 1. Executive (8, 4, 1, 22)
  if ([8, 4, 1, 22].includes(lifePath)) scores.executive += 40;
  if ([8, 4, 1, 22].includes(soul)) scores.executive += 30;
  if ([8, 4, 1, 22].includes(personality)) scores.executive += 15;
  if ([8, 4, 1, 22].includes(rationalThought)) scores.executive += 15;

  // 2. Dynamic (5, 3)
  if ([5, 3].includes(lifePath)) scores.dynamic += 40;
  if ([5, 3].includes(soul)) scores.dynamic += 30;
  if ([5, 3].includes(personality)) scores.dynamic += 15;
  if ([5, 3].includes(rationalThought)) scores.dynamic += 15;

  // 3. Deep Research (7, 11)
  if ([7, 11].includes(lifePath)) scores.deep += 40;
  if ([7, 11].includes(soul)) scores.deep += 30;
  if ([7, 11].includes(personality)) scores.deep += 15;
  if ([7, 11].includes(rationalThought)) scores.deep += 15;

  // 4. Empathic (6, 2, 9, 33)
  if ([6, 2, 9, 33].includes(lifePath)) scores.empathic += 40;
  if ([6, 2, 9, 33].includes(soul)) scores.empathic += 30;
  if ([6, 2, 9, 33].includes(personality)) scores.empathic += 15;
  if ([6, 2, 9, 33].includes(rationalThought)) scores.empathic += 15;

  // Xác định profile cao điểm nhất
  let bestProfileId: ReadingProfileId = 'executive';
  let maxScore = -1;

  for (const [id, score] of Object.entries(scores) as [ReadingProfileId, number][]) {
    if (score > maxScore) {
      maxScore = score;
      bestProfileId = id;
    }
  }

  // Fallback nếu điểm bằng nhau
  if (maxScore === 0) {
    if ([8, 1, 4].includes(lifePath)) bestProfileId = 'executive';
    else if ([5, 3].includes(lifePath)) bestProfileId = 'dynamic';
    else if ([7, 11].includes(lifePath)) bestProfileId = 'deep';
    else bestProfileId = 'empathic';
    maxScore = 40;
  }

  const recommendedProfile = READING_PROFILES[bestProfileId];
  const confidence = Math.min(Math.round((maxScore / 100) * 100), 95);

  let reasoning = '';
  switch (bestProfileId) {
    case 'executive':
      reasoning = `Dựa trên sự hội tụ của Đường Đời ${lifePath} và Linh Hồn ${soul}, bạn có thiên hướng thực thi và quản trị mạnh mẽ. Bản báo cáo Thực Chiến (Executive) sẽ tối ưu hóa thời gian và cung cấp các đòn bẩy hành động trực diện.`;
      break;
    case 'dynamic':
      reasoning = `Trường năng lượng Đường Đời ${lifePath} và Linh Hồn ${soul} phản ánh tinh thần tự do, tốc độ và sáng tạo. Bản báo cáo Trực Quan (Dynamic Action) với visual cards sẽ giúp bạn nắm bắt nhanh nhất mà không bị ngợp chữ.`;
      break;
    case 'deep':
      reasoning = `Nhu cầu nội tâm Linh Hồn ${soul} và Đường Đời ${lifePath} hướng về chiều sâu tri thức và nguyên lý gốc rễ. Bản báo cáo Chiêm Nghiệm (Deep Research) sẽ cung cấp trọn vẹn 21 chỉ số và bảng kiểm toán dữ liệu chi tiết.`;
      break;
    case 'empathic':
      reasoning = `Trường năng lượng Đường Đời ${lifePath} và Sứ Mệnh gắn liền với tình yêu thương, sự chăm sóc và trách nhiệm cộng đồng. Bản báo cáo Gắn Kết (Empathic) tập trung nâng đỡ cảm xúc và xây dựng các mối quan hệ hòa hợp.`;
      break;
  }

  return {
    recommendedProfile,
    scores,
    confidence,
    reasoning
  };
}
