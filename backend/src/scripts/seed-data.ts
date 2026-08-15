import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Cấu hình biến môi trường giả lập Firebase local
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

// Tự động load API Key từ file .env nếu có
let apiKey = '';
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
}

// Khởi tạo Google Gen AI SDK nếu có Key
let genAI: any = null;
if (apiKey) {
  console.log('--- KHỞI TẠO GEMINI API ĐỂ HỖ TRỢ TRÍCH XUẤT DATA ---');
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.log('--- CHẠY CHẾ ĐỘ OFFLINE: SỬ DỤNG PARSER THƯỜNG ---');
}

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  projectId: 'numerology-app-dev',
});
const db = getFirestore();

// 2. Danh sách 17 Chỉ số
const indicatorsList = [
  { id: 'life_path', name: 'Đường Đời (Life Path Number)', desc: 'Con đường bạn đi, bài học cốt lõi và bản chất tâm lý sâu xa nhất của bạn trong cả cuộc đời.' },
  { id: 'attitude', name: 'Thái Độ (Attitude Number)', desc: 'Cách bạn phản ứng tự nhiên ban đầu trước các cơ hội, khó khăn hay biến động xảy ra trong cuộc sống.' },
  { id: 'expression', name: 'Sứ Mệnh (Expression Number)', desc: 'Mục đích sống, lĩnh vực thế mạnh và những giá trị bạn cần kiến tạo, đóng góp cho cuộc đời này.' },
  { id: 'soul_bridge', name: 'Cầu Nối Đường Đời - Sứ Mệnh (LPE Bridge)', desc: 'Bài học trung gian và năng lực cần rèn luyện giúp cân bằng giữa bản thể bên trong và hành động thực thi bên ngoài.' },
  { id: 'heart_desire', name: 'Linh Hồn (Heart\'s Desire / Soul Urge)', desc: 'Khao khát sâu kín trong tâm hồn, động lực phía sau mọi hành động của bạn.' },
  { id: 'personality', name: 'Nhân Cách (Personality Number)', desc: 'Cách bạn thể hiện bên ngoài, cá tính và ấn tượng đầu tiên mà người khác cảm nhận về bạn.' },
  { id: 'personality_bridge', name: 'Cầu Nối Linh Hồn - Nhân Cách (HDP Bridge)', desc: 'Cầu nối dung hòa giữa mong muốn thực sự bên trong tâm hồn và biểu hiện bên ngoài xã hội của bạn.' },
  { id: 'birthday', name: 'Ngày Sinh (Birthday Number)', desc: 'Tài năng thiên bẩm và công cụ bổ trợ giúp bạn đạt được các bài học Đường đời thuận lợi hơn.' },
  { id: 'maturity', name: 'Trưởng Thành (Maturity Number)', desc: 'Sứ mệnh và mục tiêu lớn mà bạn cần tập trung phát triển khi bước vào giai đoạn hoàng kim (từ 30 - 40 tuổi).' },
  { id: 'karmic_lessons', name: 'Bài Học Nghiệp Quả (Karmic Lessons)', desc: 'Các phẩm chất/kỹ năng bạn còn thiếu từ các kiếp sống trước, cần rèn luyện tích cực trong kiếp sống này.' },
  { id: 'karmic_debt', name: 'Nợ Nghiệp / Điểm Yếu (Karmic Debt)', desc: 'Các sai lầm quá khứ hoặc thói quen xấu tích tụ cần được nhận diện và hóa giải bằng kỷ luật bản thân.' },
  { id: 'rational_thought', name: 'Tư Duy Lý Trí (Rational Thought)', desc: 'Phương pháp tư duy, cách bạn phân tích logic và đưa ra quyết định khi giải quyết vấn đề.' },
  { id: 'subconscious_confidence', name: 'Sức Mạnh Tiềm Thức (Subconscious Confidence)', desc: 'Sự tự tin nội tại và cách bạn phản ứng tự động trước những biến cố bất ngờ xảy ra.' },
  { id: 'hidden_passion', name: 'Đam Mê Ẩn Giấu (Hidden Passion)', desc: 'Những tài năng, sở thích mang lại cho bạn niềm vui sáng tạo và sự tự nhận thức sâu sắc nhất.' },
  { id: 'personal_year', name: 'Năm Cá Nhân (Personal Year)', desc: 'Dự báo năng lượng và xu hướng biến động xảy ra trong vòng chu kỳ 9 năm tiếp theo.' },
  { id: 'pinnacles', name: 'Các Chặng Đỉnh Cao (Pinnacles)', desc: '4 chặng đỉnh cao năng lượng trong cuộc đời, đại diện cho những thành công rực rỡ bạn hướng tới.' },
  { id: 'challenges', name: 'Các Thử Thách (Challenges)', desc: '4 thử thách tương ứng các chặng đời bạn cần vượt qua để hoàn thiện nhân cách.' }
];

// Bản đồ ánh xạ từ Tên Tiếng Việt trong file sang Indicator ID
const indicatorMapping: Record<string, string> = {
  'Chỉ số Đường đời': 'life_path',
  'Chỉ số Đường Đời': 'life_path',
  'Chỉ số cân bằng': 'balance',
  'Chỉ số Sứ mệnh': 'expression',
  'Chỉ số Sứ Mệnh': 'expression',
  'Chỉ số Kết nối Đường đời - Sứ mệnh': 'soul_bridge',
  'Chỉ số Linh hồn': 'heart_desire',
  'Chỉ số Linh Hồn': 'heart_desire',
  'Chỉ số Ngày sinh': 'birthday',
  'Chỉ số Ngày Sinh': 'birthday',
  'Chỉ số Nhân cách': 'personality',
  'Chỉ số Nhân Cách': 'personality',
  'Chỉ số Kết nối Linh hồn - Nhân cách': 'personality_bridge',
  'Chỉ số Trưởng thành': 'maturity',
  'Chỉ số Trưởng Thành': 'maturity',
  'Chỉ số Thiếu': 'karmic_lessons',
  'Chỉ số Tư duy lý trí': 'rational_thought',
  'Chỉ số Tư duy Lý trí': 'rational_thought',
  'Chỉ số Sức mạnh tiềm thức': 'subconscious_confidence',
  'Chỉ số Đam mê': 'hidden_passion',
  'Chỉ số Năm': 'personal_year',
  'Chỉ số Chặng': 'pinnacles',
  'Chỉ số Thách thức': 'challenges'
};

// 3. Hàm làm sạch text (lọc bỏ header/footer/hotline quảng cáo trong file)
function cleanTextContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/https:\/\/gein\.vn\s*\|\s*Hotline:\s*[\d\.]+\s*\d*/gi, '') // Lọc sạch "https://gein.vn | Hotline: 0345.268.799 15" hoặc các số trang tương tự
    .replace(/Họ tên:.*Ngày sinh:.*\d{2}\/\d{2}\/\d{4}/gi, '') // Lọc tên và ngày sinh
    .replace(/NĂNG LƯỢNG CỦA CÁC CON SỐ/g, '')
    .trim();
}

interface RawRecord {
  docId: string;
  indicator: string;
  indicatorName: string;
  number: number;
  rawText: string;
}

// 4. Hàm trích xuất dữ liệu bằng AI theo BATCH (Gemini)
async function parseBatchWithAI(batch: RawRecord[], attempt = 1): Promise<any[] | null> {
  const itemsPrompt = batch.map((item, idx) => `
--- KHỐI THỨ ${idx + 1} ---
ID chỉ số: ${item.indicator}
Tên chỉ số: ${item.indicatorName}
Con số: ${item.number}
Văn bản thô:
${item.rawText}
`).join('\n=========================================\n');

  const prompt = `
    Bạn là một Biên tập viên cao cấp kiêm Chuyên gia Số học Pythagoras.
    Nhiệm vụ của bạn là đọc các khối văn bản luận giải số học thô bị lỗi định dạng dưới đây và BIÊN TẬP, VIẾT LẠI từng khối thành bài luận giải chuyên nghiệp, mượt mà làm dữ liệu RAG tham chiếu cho AI.

    CÁC LỖI CẦN SỬA CHO MỖI KHỐI:
    1. Sửa lỗi dính chữ: Thêm khoảng trắng hợp lý giữa các từ bị dính liền nhau (ví dụ: "chúngtôi" -> "chúng tôi", "thànhcông" -> "thành công", "bạnthànhcông" -> "bạn thành công").
    2. Sửa lỗi ngắt dòng sai: Ghép các từ/câu bị xuống dòng tùy tiện ở giữa câu (lỗi do copy từ PDF cũ) thành câu hoàn chỉnh, trôi chảy.
    3. Chia đoạn mạch lạc: Tổ chức lại văn bản thành các đoạn văn rõ ràng theo logic lập luận. Sử dụng tiêu đề phụ Markdown (ví dụ: ### Năng lực, ### Thách thức, ### Lời khuyên) để cấu trúc văn bản sạch đẹp.
    4. Loại bỏ thông tin rác: Loại bỏ tất cả số trang, hotline, url, hoặc tên khách hàng cụ thể (nếu có). Thay thế tên khách hàng cụ thể bằng các đại từ chung như "Bạn", "Người sở hữu con số này".
    5. Bảo toàn giá trị gốc: Giữ nguyên các luận điểm khoa học, thuật ngữ số học và bài học cốt lõi của con số. Không tự bịa thêm thông tin ngoài lề.

    DANH SÁCH CÁC KHỐI CẦN XỬ LÝ:
    ${itemsPrompt}

    Bắt buộc trả về định dạng JSON Array thuần túy (không bọc trong tag \`\`\`json) theo đúng định dạng sau:
    [
      {
        "indicator": "ID chỉ số tương ứng (ví dụ: life_path)",
        "number": con số tương ứng (kiểu số, ví dụ: 11),
        "keywords": "3-5 từ khóa tính cách cốt lõi phân tách bằng dấu phẩy",
        "principles": "1 câu đúc kết nguyên lý hành động chính của con số này",
        "description": "Nội dung bài luận giải chi tiết sau khi đã được biên tập làm mịn, sửa lỗi dính chữ, ngắt dòng và cấu trúc lại sạch đẹp"
      },
      ...
    ]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });
    const resultText = response.response.text();
    return JSON.parse(resultText);
  } catch (error: any) {
    console.error(`Lỗi AI trích xuất Batch (Lần thử ${attempt}):`, error.message);
    
    // Nếu gặp lỗi cạn quota ngày thì dừng gọi AI luôn
    if (error.message.includes('GenerateRequestsPerDayPerProjectPerModel') || error.message.includes('quotaValue')) {
      console.log('⚠ Phát hiện cạn kiệt Quota ngày của Gemini API. Dừng sử dụng AI và chuyển sang Offline mode.');
      throw new Error('DAILY_QUOTA_EXCEEDED');
    }

    // Kiểm tra lỗi 429 Rate Limit hoặc Quota
    if ((error.message.includes('429') || error.message.includes('quota') || error.message.includes('Quota')) && attempt < 5) {
      const delay = 35000 * attempt; // Đợi 35s, 70s, v.v.
      console.log(`Gặp lỗi Rate Limit/Quota. Đang tạm dừng ${delay / 1000} giây trước khi thử lại lần ${attempt + 1}...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return parseBatchWithAI(batch, attempt + 1);
    }
    return null;
  }
}

// 5. Hàm trích xuất thủ công bằng Parser thường (Fallback Offline)
function parseOffline(rawText: string, num: number): any {
  const cleaned = cleanTextContent(rawText);
  // Trích xuất keywords thô từ 2 câu đầu tiên
  const sentences = cleaned.split(/[.\n]/).filter(s => s.trim().length > 10);
  const keywords = sentences.slice(0, 2).map(s => s.trim()).join(', ');
  
  return {
    keywords: keywords.substring(0, 150),
    principles: `Học hỏi, phát huy thế mạnh của con số ${num} và rèn luyện nâng cao năng lực ứng phó.`,
    description: cleaned
  };
}

// 6. Hàm chạy chính (Main Process)
async function run() {
  console.log('=== BẮT ĐẦU NẠP DỮ LIỆU NỀN TẢNG THẦN SỐ HỌC ===');

  // A. Nạp 17 chỉ số mặc định
  console.log('1. Đang nạp danh sách 17 chỉ số cốt lõi...');
  for (const ind of indicatorsList) {
    await db.collection('indicators').doc(ind.id).set({
      name: ind.name,
      description: ind.desc,
      updatedAt: new Date().toISOString()
    });
  }
  console.log('✓ Hoàn tất nạp 17 chỉ số.');

  // B. Đọc và phân tích các tệp văn bản trong knowledge-base
  console.log('2. Đang quét thư mục backend/knowledge-base để thu thập records...');
  const kbPath = path.join(__dirname, '..', '..', 'knowledge-base');

  if (!fs.existsSync(kbPath)) {
    console.error('Không tìm thấy thư mục knowledge-base!');
    return;
  }

  const files = fs.readdirSync(kbPath).filter(f => f.endsWith('.txt'));
  console.log(`Tìm thấy tổng cộng ${files.length} tệp văn bản thô.`);

  const seededRecords: Record<string, boolean> = {};
  const recordsToProcess: RawRecord[] = [];

  // Giới hạn xử lý tối đa 30 files tiêu biểu để tối ưu hóa thời gian và tài nguyên
  const filesToProcess = files.slice(0, 30);

  for (let i = 0; i < filesToProcess.length; i++) {
    const file = filesToProcess[i];
    const filePath = path.join(kbPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Tìm kiếm các khối chỉ số bằng biểu thức chính quy: dạng "01. Chỉ số Đường đời - 11"
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

    // Cắt nhỏ văn bản theo các khối chỉ số đã định vị
    for (let j = 0; j < blocks.length; j++) {
      const currentBlock = blocks[j];
      const nextBlock = blocks[j + 1];
      
      const start = currentBlock.startIdx;
      const end = nextBlock ? nextBlock.startIdx : content.length;
      
      const rawText = content.substring(start, end);
      
      // Ánh xạ sang ID chỉ số hệ thống
      const indId = indicatorMapping[currentBlock.indName];
      if (!indId) continue;

      // Xử lý các con số (có thể có nhiều số ví dụ: 3,5 hoặc 0,8,8,8)
      const numbers = currentBlock.numStr.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));

      for (const num of numbers) {
        const docId = `${indId}_${num}`;
        
        // Tránh trùng lặp trong đợt thu thập
        if (seededRecords[docId]) continue;

        recordsToProcess.push({
          docId,
          indicator: indId,
          indicatorName: currentBlock.indName,
          number: num,
          rawText
        });
        seededRecords[docId] = true;
      }
    }
  }

  // C. Xử lý ghi nhận theo batch và tích hợp AI
  const batchSize = 3;
  let totalSeeded = 0;
  console.log(`\nTổng số bản ghi độc bản thu thập được: ${recordsToProcess.length}`);
  console.log(`Đang tiến hành xử lý bằng AI theo từng batch (Batch size: ${batchSize})...`);

  for (let i = 0; i < recordsToProcess.length; i += batchSize) {
    const batch = recordsToProcess.slice(i, i + batchSize);
    
    // Kiểm tra và lọc ra các bản ghi thực sự cần xử lý (chưa có hoặc là thô trong DB)
    const batchToProcess: RawRecord[] = [];
    for (const item of batch) {
      const docRef = db.collection('indicator_numbers').doc(item.docId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const docData = docSnap.data();
        const isAlreadyRefined = docData && docData.principles && !docData.principles.includes('Học hỏi, phát huy thế mạnh của con số');
        if (isAlreadyRefined) {
          totalSeeded++;
          continue;
        }
      }
      batchToProcess.push(item);
    }

    if (batchToProcess.length === 0) {
      continue;
    }

    console.log(`\n➔ Xử lý Batch [${Math.floor(i / batchSize) + 1}/${Math.ceil(recordsToProcess.length / batchSize)}] (${batchToProcess.map(b => b.docId).join(', ')})...`);
    
    let batchResults: any[] | null = null;
    
    if (genAI) {
      try {
        batchResults = await parseBatchWithAI(batchToProcess);
        // Nghỉ 8 giây giữa các batch để tránh bị Rate Limit 429 trên Free Tier của Gemini
        await new Promise(resolve => setTimeout(resolve, 8000));
      } catch (err: any) {
        if (err.message === 'DAILY_QUOTA_EXCEEDED') {
          genAI = null; // Vô hiệu hóa AI
        }
      }
    }

    for (const item of batchToProcess) {
      let data = batchResults ? batchResults.find(r => r.indicator === item.indicator && r.number === item.number) : null;

      if (!data) {
        console.log(`    ⚠ AI không trả về kết quả cho ${item.docId}, tự động chuyển sang offline parser...`);
        data = parseOffline(item.rawText, item.number);
      } else {
        console.log(`    ✓ AI làm mịn thành công cho ${item.docId}`);
      }

      // Ghi vào Firestore Emulator
      await db.collection('indicator_numbers').doc(item.docId).set({
        indicator: item.indicator,
        number: item.number,
        keywords: data.keywords || '',
        principles: data.principles || '',
        description: data.description || '',
        updatedAt: new Date().toISOString()
      });
      totalSeeded++;
    }

    // Nếu đã nạp đủ 204 records, dừng lại
    if (totalSeeded >= 204) {
      console.log('\n✓ Đã nạp đủ hơn 204 records luận giải cần thiết. Dừng lại.');
      break;
    }
  }

  console.log(`\n=== HOÀN TẤT SEED DỮ LIỆU ===`);
  console.log(`- Tổng số chỉ số đã tạo: ${indicatorsList.length}`);
  console.log(`- Tổng số bản ghi luận giải đã nạp: ${totalSeeded}`);
  console.log('Bạn có thể xem dữ liệu ngay tại: http://localhost:4000/firestore');
}

run().catch(console.error);
