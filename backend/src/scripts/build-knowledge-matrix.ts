import * as fs from 'fs';
import * as path from 'path';

export interface IndicatorSlot {
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

const INDICATORS_DEF: { code: string; name: string }[] = [
  { code: 'life_path', name: 'Đường đời' },
  { code: 'expression', name: 'Sứ mệnh' },
  { code: 'soul_bridge', name: 'Liên kết Đường đời - Sứ mệnh' },
  { code: 'heart_desire', name: 'Linh hồn' },
  { code: 'personality', name: 'Nhân cách' },
  { code: 'personality_bridge', name: 'Liên kết Linh hồn - Nhân cách' },
  { code: 'birthday', name: 'Ngày sinh' },
  { code: 'rational_thought', name: 'Tư duy lý trí' },
  { code: 'hidden_passion', name: 'Đam mê' },
  { code: 'karmic_lessons', name: 'Thiếu' },
  { code: 'balance', name: 'Cân bằng' },
  { code: 'attitude', name: 'Thái độ' },
  { code: 'subconscious_confidence', name: 'Sức mạnh tiềm thức' },
  { code: 'maturity', name: 'Trưởng thành' },
  { code: 'karmic_debt', name: 'Bài học' },
  { code: 'generation', name: 'Thế hệ' },
  { code: 'pinnacles', name: 'Chặng' },
  { code: 'challenges', name: 'Thách thức' },
  { code: 'personal_year', name: 'Năm cá nhân' },
  { code: 'personal_month', name: 'Tháng cá nhân' },
  { code: 'personal_day', name: 'Ngày cá nhân' },
];

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

const INDICATOR_PATTERNS: { regex: RegExp; code: string; name: string }[] = [
  { regex: /Chỉ số Đường đời/i, code: 'life_path', name: 'Đường đời' },
  { regex: /Chỉ số Sứ mệnh/i, code: 'expression', name: 'Sứ mệnh' },
  { regex: /Chỉ số (Kết nối|Liên kết) Đường đời\s*[-–]\s*Sứ mệnh/i, code: 'soul_bridge', name: 'Liên kết Đường đời - Sứ mệnh' },
  { regex: /Chỉ số Linh hồn/i, code: 'heart_desire', name: 'Linh hồn' },
  { regex: /Chỉ số Nhân cách/i, code: 'personality', name: 'Nhân cách' },
  { regex: /Chỉ số (Kết nối|Liên kết) Linh hồn\s*[-–]\s*Nhân cách/i, code: 'personality_bridge', name: 'Liên kết Linh hồn - Nhân cách' },
  { regex: /Chỉ số Ngày sinh/i, code: 'birthday', name: 'Ngày sinh' },
  { regex: /Chỉ số Tư duy lý trí/i, code: 'rational_thought', name: 'Tư duy lý trí' },
  { regex: /Chỉ số Đam mê/i, code: 'hidden_passion', name: 'Đam mê' },
  { regex: /Chỉ số Thiếu/i, code: 'karmic_lessons', name: 'Thiếu' },
  { regex: /Chỉ số cân bằng/i, code: 'balance', name: 'Cân bằng' },
  { regex: /Chỉ số Thái độ/i, code: 'attitude', name: 'Thái độ' },
  { regex: /Chỉ số Sức mạnh tiềm thức/i, code: 'subconscious_confidence', name: 'Sức mạnh tiềm thức' },
  { regex: /Chỉ số Trưởng thành/i, code: 'maturity', name: 'Trưởng thành' },
  { regex: /Chỉ số Bài học/i, code: 'karmic_debt', name: 'Bài học' },
  { regex: /Chỉ số Thế hệ/i, code: 'generation', name: 'Thế hệ' },
  { regex: /Chỉ số Chặng/i, code: 'pinnacles', name: 'Chặng' },
  { regex: /Chỉ số Thách thức/i, code: 'challenges', name: 'Thách thức' },
  { regex: /Chỉ số Năm/i, code: 'personal_year', name: 'Năm cá nhân' },
  { regex: /Chỉ số Tháng/i, code: 'personal_month', name: 'Tháng cá nhân' },
  { regex: /Chỉ số Ngày\b/i, code: 'personal_day', name: 'Ngày cá nhân' },
];

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/https:\/\/gein\.vn\s*\|\s*Hotline:\s*[\d\.]+\s*\d*/gi, '')
    .replace(/Họ tên:.*Ngày sinh:.*\d{2}\/\d{2}\/\d{4}/gi, '')
    .replace(/NĂNG LƯỢNG CỦA CÁC CON SỐ/gi, '')
    .replace(/Bản đồ thành công – Map for Success/gi, 'Bản đồ Life Map')
    .replace(/GEIN/gi, 'Life Maps')
    .trim();
}

function extractSectionTraits(rawText: string, num: number, indName: string): Partial<IndicatorSlot> {
  const cleaned = cleanText(rawText);
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);

  const positive_traits: string[] = [];
  const shadow_traits: string[] = [];
  let career_guidance = '';
  let full_desc = cleaned;

  let currentSection = '';
  for (const line of lines) {
    if (/Ưu điểm/i.test(line)) {
      currentSection = 'pos';
      continue;
    } else if (/Nhược điểm/i.test(line)) {
      currentSection = 'neg';
      continue;
    } else if (/Sự nghiệp/i.test(line)) {
      currentSection = 'career';
      continue;
    }

    if (currentSection === 'pos' && line.length > 15 && positive_traits.length < 5) {
      positive_traits.push(line);
    } else if (currentSection === 'neg' && line.length > 15 && shadow_traits.length < 5) {
      shadow_traits.push(line);
    } else if (currentSection === 'career' && !career_guidance) {
      career_guidance = line;
    }
  }

  if (positive_traits.length === 0) {
    positive_traits.push(`Phát huy bản lĩnh, tính tự chủ và năng lượng tích cực của số ${num}.`);
    positive_traits.push(`Khả năng thích ứng và kiến tạo giải pháp trong lĩnh vực chuyên môn.`);
  }
  if (shadow_traits.length === 0) {
    shadow_traits.push(`Dễ bị căng thẳng hoặc cực đoan khi gặp áp lực kéo dài.`);
    shadow_traits.push(`Cần rèn luyện tính kiên nhẫn và kiểm soát cảm xúc bộc phát.`);
  }
  if (!career_guidance) {
    career_guidance = `Phù hợp với các công việc đòi hỏi tư duy độc lập, sáng tạo, phát triển năng lực cá nhân và có lộ trình thăng tiến rõ ràng.`;
  }

  return {
    positive_traits,
    shadow_traits,
    career_guidance,
    relationships: `Trong mối quan hệ, số ${num} đề cao sự chân thành, tôn trọng lẫn nhau và tinh thần đồng hành phát triển.`,
    decision_making: `Xu hướng ra quyết định dựa trên trực giác kết hợp phân tích thực tế của năng lượng số ${num}.`,
    money_management: `Quản trị tài chính theo hướng an toàn bền vững, tối ưu hóa các cơ hội đầu tư giá trị dài hạn.`,
    growth_actions: [
      `Dành 15 phút mỗi ngày để rèn luyện thói quen tự phản tỉnh và lập kế hoạch hành động.`,
      `Chủ động đón nhận phản hồi từ đồng nghiệp và người thân để hoàn thiện góc nhìn.`
    ],
    power_questions: [
      `Điều gì đang là rào cản lớn nhất ngăn bạn phát huy tối đa năng lượng của số ${num}?`,
      `Nếu có thể thay đổi một thói quen ngay hôm nay để bứt phá, bạn sẽ chọn thay đổi điều gì?`
    ],
    full_description: full_desc
  };
}

async function buildKnowledgeMatrix() {
  console.log('=== KHỞI ĐỘNG XÂY DỰNG MA TRẬN TRI THỨC 252 RECORDS ===');

  const kbPath = path.join(process.cwd(), 'knowledge-base');
  const matrix: Record<string, IndicatorSlot> = {};

  let filledCount = 0;
  const totalSlots = INDICATORS_DEF.length * NUMBERS.length; // 21 * 12 = 252

  if (fs.existsSync(kbPath)) {
    const allFiles = fs.readdirSync(kbPath).filter(f => f.endsWith('.txt'));
    const sampleFiles = allFiles.slice(0, 50); // Quét 50 files tiêu biểu
    console.log(`Tìm thấy ${allFiles.length} file mẫu trong thư mục knowledge-base. Sẽ quét ${sampleFiles.length} files...`);

    // Quét qua các file để lấp đầy ma trận
    for (let fIdx = 0; fIdx < sampleFiles.length; fIdx++) {
      const filePath = path.join(kbPath, sampleFiles[fIdx]);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Định vị các mục: "01. Chỉ số Đường đời - 11"
      const regex = /(\d{2})\.\s*([^-\n]+)\s*-\s*([\d,]+)/g;
      let match;
      const blocks: { startIdx: number; indName: string; numStr: string }[] = [];

      while ((match = regex.exec(content)) !== null) {
        blocks.push({
          startIdx: match.index,
          indName: match[2].trim(),
          numStr: match[3].trim()
        });
      }

      for (let j = 0; j < blocks.length; j++) {
        const curr = blocks[j];
        const next = blocks[j + 1];
        const start = curr.startIdx;
        const end = next ? next.startIdx : content.length;
        const blockText = content.substring(start, end);

        // Khớp với pattern
        let matchedIndicator = INDICATOR_PATTERNS.find(p => p.regex.test(curr.indName));
        if (!matchedIndicator) continue;

        const nums = curr.numStr.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        for (const num of nums) {
          const slotKey = `${matchedIndicator.code}_${num}`;
          if (!matrix[slotKey]) {
            const traits = extractSectionTraits(blockText, num, matchedIndicator.name);
            matrix[slotKey] = {
              indicator_code: matchedIndicator.code,
              indicator_name: matchedIndicator.name,
              number: num,
              core_energy: `Năng lượng số ${num} trong chỉ số ${matchedIndicator.name}.`,
              positive_traits: traits.positive_traits || [],
              shadow_traits: traits.shadow_traits || [],
              career_guidance: traits.career_guidance || '',
              relationships: traits.relationships || '',
              decision_making: traits.decision_making || '',
              money_management: traits.money_management || '',
              growth_actions: traits.growth_actions || [],
              power_questions: traits.power_questions || [],
              full_description: traits.full_description || ''
            };
            filledCount++;
          }
        }
      }

      if ((fIdx + 1) % 10 === 0 || fIdx === sampleFiles.length - 1) {
        console.log(`-> Đã quét ${fIdx + 1}/${sampleFiles.length} files. Số slot đã lấp: ${filledCount}/${totalSlots}`);
      }

      if (filledCount >= totalSlots) {
        console.log(`✓ Đã lấp đầy đủ ${filledCount}/${totalSlots} slots! Tự động dừng quét sớm tại file thứ ${fIdx + 1}.`);
        break;
      }
    }
  }

  console.log(`Đã thu thập từ file thực tế: ${filledCount}/${totalSlots} slots.`);

  let curatedCount = 0;
  for (const ind of INDICATORS_DEF) {
    for (const num of NUMBERS) {
      const slotKey = `${ind.code}_${num}`;
      if (!matrix[slotKey]) {
        matrix[slotKey] = {
          indicator_code: ind.code,
          indicator_name: ind.name,
          number: num,
          core_energy: `Trường năng lượng của số ${num} tác động trực tiếp vào chỉ số ${ind.name}, kiến tạo mô thức hành vi và bài học tiến hóa đặc thù.`,
          positive_traits: [
            `Phát huy tối đa thế mạnh tự nhiên của con số ${num} khi ở trạng thái cân bằng.`,
            `Năng lực giải quyết vấn đề linh hoạt và kiên định theo đuổi mục tiêu dài hạn.`
          ],
          shadow_traits: [
            `Dễ rơi vào bẫy áp lực và phản ứng phòng vệ khi gặp nghịch cảnh bất ngờ.`,
            `Cần lưu ý kiểm soát cảm xúc và cân bằng giữa lý trí và trực giác.`
          ],
          career_guidance: `Phát triển sự nghiệp mạnh mẽ trong môi trường tôn trọng sự tự chủ, sáng tạo và cho phép bạn phát huy tối đa năng lực số ${num}.`,
          relationships: `Đề cao sự thấu cảm, minh bạch và xây dựng sự tin tưởng vững chắc trong các mối quan hệ gia đình, đồng nghiệp.`,
          decision_making: `Kết hợp logic phân tích và trực giác để đưa ra các lựa chọn chuẩn xác, hạn chế rủi ro cảm xúc.`,
          money_management: `Quản trị dòng tiền kỷ luật, tập trung vào đầu tư tri thức và giá trị sinh lời bền vững.`,
          growth_actions: [
            `Thiết lập thói quen ghi chép nhật ký hành động và đánh giá hiệu quả mỗi tuần.`,
            `Rèn luyện sự tập trung và kiên định với các mục tiêu ưu tiên hàng đầu.`
          ],
          power_questions: [
            `Con số ${num} đang mang đến cho bạn cơ hội chuyển hóa lớn nhất nào trong giai đoạn này?`,
            `Bạn cần buông bỏ điều gì để bước lên một tầm cao mới trong sự nghiệp và cuộc sống?`
          ],
          full_description: `Chỉ số ${ind.name} mang con số ${num} đại diện cho sự phát triển vượt bậc khi bạn biết dung hòa giữa điểm mạnh tự nhiên và rèn luyện các bài học chuyển hóa.`
        };
        curatedCount++;
      }
    }
  }

  console.log(`✓ Đã hoàn tất 252/252 slots (Thực tế: ${filledCount}, Curated chuẩn hóa: ${curatedCount}).`);

  const backendOutputDir = path.join(process.cwd(), 'src', 'ai', 'knowledge');
  if (!fs.existsSync(backendOutputDir)) {
    fs.mkdirSync(backendOutputDir, { recursive: true });
  }
  const backendFilePath = path.join(backendOutputDir, 'knowledge_base_252.json');
  fs.writeFileSync(backendFilePath, JSON.stringify(matrix, null, 2), 'utf-8');
  console.log(`✓ Đã ghi file backend: ${backendFilePath}`);

  const clientOutputDir = path.join(process.cwd(), '..', 'client_web', 'src', 'lib', 'knowledge');
  if (!fs.existsSync(clientOutputDir)) {
    fs.mkdirSync(clientOutputDir, { recursive: true });
  }
  const clientFilePath = path.join(clientOutputDir, 'knowledge_base_252.json');
  fs.writeFileSync(clientFilePath, JSON.stringify(matrix, null, 2), 'utf-8');
  console.log(`✓ Đã ghi file client: ${clientFilePath}`);

  console.log('=== HOÀN TẤT XÂY DỰNG TỪ ĐIỂN TRI THỨC 252 RECORDS! ===');
}

buildKnowledgeMatrix().catch(console.error);
