import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

// Tự động load API Key từ file .env
let apiKey = '';
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error('Không tìm thấy GEMINI_API_KEY trong file .env!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
admin.initializeApp({ projectId: 'numerology-app-dev' });
const db = getFirestore();

// Hàm gọi AI làm mịn một bản ghi đơn lẻ
async function refineSingleRecord(docId: string, indicator: string, number: number, rawText: string, attempt = 1): Promise<any> {
  const prompt = `
    Bạn là một Biên tập viên cao cấp kiêm Chuyên gia Số học Pythagoras.
    Nhiệm vụ của bạn là đọc khối văn bản luận giải số học thô bị lỗi định dạng dưới đây và BIÊN TẬP, VIẾT LẠI thành bài luận giải chuyên nghiệp, mượt mà làm dữ liệu RAG tham chiếu cho AI.

    CÁC LỖI CẦN SỬA:
    1. Sửa lỗi dính chữ: Thêm khoảng trắng hợp lý giữa các từ bị dính liền nhau (ví dụ: "chúngtôi" -> "chúng tôi", "thànhcông" -> "thành công").
    2. Sửa lỗi ngắt dòng sai: Ghép các từ/câu bị xuống dòng tùy tiện ở giữa câu thành câu hoàn chỉnh, trôi chảy.
    3. Chia đoạn mạch lạc: Tổ chức lại văn bản thành các đoạn văn rõ ràng theo logic lập luận. Sử dụng tiêu đề phụ Markdown (ví dụ: ### Năng lực, ### Thách thức, ### Lời khuyên) để cấu trúc văn bản sạch đẹp.
    4. Loại bỏ thông tin rác: Loại bỏ tất cả số trang, hotline (ví dụ: "https://gein.vn | Hotline: 0345.268.799 15"), url, hoặc tên khách hàng cụ thể. Thay thế tên khách hàng cụ thể bằng các đại từ chung như "Bạn", "Người sở hữu con số này".
    5. Bảo toàn giá trị gốc: Giữ nguyên các luận điểm khoa học, thuật ngữ số học và bài học cốt lõi của con số. Không tự bịa thêm thông tin ngoài lề.

    THÔNG TIN BẢN GHI:
    ID chỉ số: ${indicator}
    Con số: ${number}
    Văn bản thô:
    ${rawText}

    Bắt buộc trả về định dạng JSON thuần túy (không bọc trong tag \`\`\`json) theo đúng cấu trúc sau:
    {
      "keywords": "3-5 từ khóa tính cách cốt lõi phân tách bằng dấu phẩy",
      "principles": "1 câu đúc kết nguyên lý hành động chính của con số này",
      "description": "Nội dung bài luận giải chi tiết sau khi đã được biên tập làm mịn, sửa lỗi dính chữ, ngắt dòng và cấu trúc lại sạch đẹp"
    }
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
    console.error(`[Lỗi] Refine ${docId} (Lần thử ${attempt}):`, error.message);
    
    // Xử lý Rate Limit 429 hoặc Service Unavailable 503
    if ((error.message.includes('429') || error.message.includes('503') || error.message.includes('quota')) && attempt < 5) {
      const delay = 15000 * attempt;
      console.log(`Đang tạm dừng ${delay / 1000} giây trước khi thử lại...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return refineSingleRecord(docId, indicator, number, rawText, attempt + 1);
    }
    return null;
  }
}

async function run() {
  console.log('=== BẮT ĐẦU QUÉT VÀ LÀM MỊN LẠI DỮ LIỆU THÔ TRÊN FIRESTORE ===');
  
  const snapshot = await db.collection('indicator_numbers').get();
  const allDocs = snapshot.docs;
  console.log(`Tìm thấy tổng cộng ${allDocs.length} bản ghi trong database.`);

  const rawDocs: any[] = [];
  allDocs.forEach(doc => {
    const data = doc.data();
    // Phát hiện bản ghi thô (chưa qua AI xử lý hoặc bị ghi đè thô)
    const isRaw = !data.principles || 
                  data.principles.includes('Học hỏi, phát huy thế mạnh của con số') || 
                  data.keywords.includes('Chỉ số') ||
                  data.description.includes('\r\n') ||
                  data.description.includes('https://gein.vn');
                  
    if (isRaw) {
      rawDocs.push({
        id: doc.id,
        ...data
      });
    }
  });

  console.log(`Tìm thấy ${rawDocs.length} bản ghi chưa được làm mịn hoặc bị lỗi định dạng.`);
  
  if (rawDocs.length === 0) {
    console.log('Tất cả các bản ghi đều đã được làm mịn và định dạng chuẩn Markdown. Không cần xử lý thêm.');
    return;
  }

  console.log('Đang tiến hành gửi lên Gemini làm mịn từng bản ghi...');
  let count = 0;

  for (const doc of rawDocs) {
    console.log(`\n➔ Đang xử lý làm mịn: ${doc.id} (${count + 1}/${rawDocs.length})...`);
    
    const refinedData = await refineSingleRecord(doc.id, doc.indicator, doc.number, doc.description);
    
    if (refinedData) {
      await db.collection('indicator_numbers').doc(doc.id).set({
        indicator: doc.indicator,
        number: doc.number,
        keywords: refinedData.keywords,
        principles: refinedData.principles,
        description: refinedData.description,
        updatedAt: new Date().toISOString()
      });
      console.log(`    ✓ Cập nhật thành công bản ghi đã làm mịn cho ${doc.id}`);
      count++;
    } else {
      console.log(`    ⚠ Không thể làm mịn ${doc.id} bằng AI, giữ nguyên dữ liệu.`);
    }

    // Nghỉ 5 giây giữa các request để tránh rate limit
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log(`\n=== HOÀN TẤT QUÁ TRÌNH LÀM MỊN LẠI DỮ LIỆU ===`);
  console.log(`Đã sửa và cập nhật thành công ${count}/${rawDocs.length} bản ghi.`);
}

run().catch(console.error);
