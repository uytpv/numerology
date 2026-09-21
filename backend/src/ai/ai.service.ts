import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import * as knowledgeDataRaw from './knowledge/knowledge_base_252.json';

export interface AIAnalysisRequest {
  fullName: string;
  dob: string;
  map: any; // Bản đồ 17 chỉ số Pythagoras
  tier: number; // 0: Free, 1: Nền tảng, 2: 21 Chỉ số, 3: Luận giải Đa Chiều Độc Bản
  language?: string; // 'vi', 'en'...
  readingProfile?: string; // 'career', 'relationship', 'personal_growth'...
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI: any;
  private readonly level2Knowledge: Record<string, any>;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('Khởi tạo Google Generative AI thành công');
    } else {
      this.logger.warn('Chưa cấu hình GEMINI_API_KEY, AIService sẽ hoạt động ở chế độ fallback');
    }
    this.level2Knowledge = (knowledgeDataRaw as any) || {};
  }

  /**
   * Trích xuất ngữ cảnh tri thức Cấp độ 2 (Ý nghĩa con số tại vị trí chỉ số)
   * phục vụ làm dữ liệu nền tảng để Gemini AI tổng hòa Cấp độ 3
   */
  private extractLevel2Context(map: any): string {
    const indicatorsToExtract = [
      { code: 'life_path', num: map?.life_path || map?.lifePath },
      { code: 'expression', num: map?.expression },
      { code: 'heart_desire', num: map?.heart_desire || map?.soulUrge },
      { code: 'personality', num: map?.personality },
      { code: 'birthday', num: map?.birthday },
      { code: 'maturity', num: map?.maturity },
      { code: 'rational_thought', num: map?.rational_thought || map?.rationalThought },
      { code: 'balance', num: map?.balance },
    ];

    let context = '=== TÀI LIỆU NGỮ NGHĨA CẤP ĐỘ 2 THAM CHIẾU (CHUẨN PYTHAGORAS) ===\n';

    for (const item of indicatorsToExtract) {
      if (!item.num) continue;
      const key = `${item.code}_${item.num}`;
      const record = this.level2Knowledge[key];
      if (record) {
        context += `\n[Chỉ số: ${record.indicator_name || item.code} - Số: ${item.num}]:\n`;
        context += `- Năng lượng cốt lõi: ${record.core_energy || ''}\n`;
        if (record.positive_traits?.length) {
          context += `- Điểm sáng: ${record.positive_traits.join('; ')}\n`;
        }
        if (record.shadow_traits?.length) {
          context += `- Vùng tối cần rèn luyện: ${record.shadow_traits.join('; ')}\n`;
        }
        if (record.career_guidance) {
          context += `- Định hướng sự nghiệp: ${record.career_guidance}\n`;
        }
      }
    }

    return context;
  }

  /**
   * Sinh bài luận giải CẤP ĐỘ 3 ĐỘC BẢN bằng cơ chế Multi-Factor Synthesis
   * Kết hợp toàn diện 17 chỉ số Pythagoras thành một bản sắc cá nhân duy nhất
   */
  async generatePersonalizedReport(req: AIAnalysisRequest): Promise<any> {
    const { fullName, dob, map, tier, language = 'vi', readingProfile = 'career' } = req;

    // Trích xuất ngữ cảnh Cấp 2
    const level2Context = this.extractLevel2Context(map);

    // Xây dựng System Prompt chuẩn Chuyên Gia Khai Vấn Quốc Tế (ICF Master Coach)
    const systemInstruction = `
      Bạn là Master Executive Coach (ICF) kiêm Chuyên gia Tâm lý học Hành vi ứng dụng Hệ thống Pythagoras Quốc tế (Life Maps).
      
      NGHIÊM CẤM TUYỆT ĐỐI (HIẾN PHÁP DỰ ÁN LIFEMAPS):
      - Tuyệt đối KHÔNG nhắc đến các từ: "AI", "Trí tuệ nhân tạo", "Gemini", "GPT", "LLM", "Chatbot", "Mô hình ngôn ngữ".
      - Không sử dụng giọng văn bói toán mê tín dị đoan, phán xét tương lai thần bí, định mệnh cố định.
      - Tuyệt đối KHÔNG viết văn mẫu lý thuyết số học đại trà (như: "Số 8 là kinh doanh, số 6 là gia đình...").
      - Luôn dùng giọng văn ĐỐI THOẠI TRỰC DIỆN (xưng "bạn"), SẮC BÉN, TRÚNG TIM ĐEN, THẤU CẢM, CHUẨN TÂM LÝ HỌC HÀNH VI VÀ THỰC CHỨNG.

      MỤC TIÊU CỐT LÕI - BẢN LUẬN GIẢI CHUYỂN HÓA ĐỘC BẢN (DEEP TRANSFORMATION REPORT):
      - Phân tích sự tương tác, bổ trợ và xung đột nội tâm sâu sắc giữa các chỉ số của ${fullName}:
        1. Trục Hạt Nhân: Đường Đời (${map?.life_path}) kết hợp Sứ Mệnh (${map?.expression}). Con đường và phương tiện đang tương hỗ hay giằng xé?
        2. Tháo Bỏ Mặt Nạ: Sự chênh lệch giữa Khát vọng sâu kín bên trong (Linh Hồn ${map?.heart_desire}) và Mặt nạ ứng xử với xã hội (Nhân Cách ${map?.personality}). Họ có đang kiệt sức vì cố làm hài lòng người khác?
        3. Điểm Mù & Mô Thức Tự Phá Hoại (Self-Sabotage): Nút thắt từ các bài học thiếu (${JSON.stringify(map?.karmic_lessons || [])}) và Nợ nghiệp (${JSON.stringify(map?.karmic_debts || [])}). Chỉ rõ lý do vì sao họ nỗ lực nhưng thường bị chững lại hoặc lặp lại sai lầm trong quá khứ.
        4. Chiến Lược Thực Thi: Tư Duy Lý Trí (${map?.rational_thought}) và Năng Lực Ngày Sinh (${map?.birthday}) giúp họ ra quyết định ra sao?
        5. Lộ Trình Hành Động 90 Ngày & Năm Cá Nhân (${map?.personal_year}): Kế hoạch hành vi thực tế, đo lường được để bứt phá.

      ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
      Chỉ trả về JSON thuần túy (không bọc trong \`\`\`json markdown) với cấu trúc sau:
      {
        "identitySynthesis": {
          "title": "Bản Sắc Độc Bản: [Danh xưng Archetype sắc bén, độc nhất cho người này]",
          "coreDynamic": "Phân tích trực diện trục Đường Đời và Sứ Mệnh: Điểm mạnh bẩm sinh và điểm nghẽn năng lượng khi 2 chỉ số này tương tác.",
          "innerVsOuter": "Giải mã sự giằng xé giữa Linh Hồn và Nhân Cách: Tháo bỏ mặt nạ xã hội, giúp người đọc nhìn thẳng vào khát vọng chân thật.",
          "executionPower": "Phong cách ra quyết định và hành động từ Tư Duy Lý Trí và Ngày Sinh: Khắc phục sự chần chừ hoặc bốc đồng."
        },
        "shadowAndGrowth": {
          "karmicPattern": "Mô thức tự phá hoại tiềm thức từ bài học thiếu/nợ nghiệp: Tại sao họ hay vướng vào cùng một kiểu rắc rối/thất bại?",
          "transformationKey": "Đòn bẩy chuyển hóa tâm lý: Bài học bắt buộc phải tốt nghiệp và phương pháp biến vết thương thành sức mạnh độc nhất."
        },
        "strategicRoadmap": {
          "personalYearFocus": "Chiến lược Năm Cá Nhân hiện tại: Quy tắc 'Đúng Thời Điểm' để không hao tài tốn lực.",
          "shortTerm0to6m": "Lộ trình 30-90 ngày tới: 3 hành động cụ thể, đo lường được để sắp xếp lại cuộc sống và tạo đà bứt phá.",
          "midTerm1to3y": "Mục tiêu trọng tâm 1-3 năm: Đòn bẩy sự nghiệp và tài chính cần tập trung đột phá.",
          "longTermPinnacle": "Tầm nhìn Đỉnh Cao Cuộc Đời: Cách chuẩn bị để chạm tới đỉnh cao Kim Tự Tháp thành công."
        },
        "coachingQuestions": [
          "Câu hỏi khai vấn 1: Chạm sâu vào vùng an toàn hoặc sự trì hoãn lớn nhất của họ",
          "Câu hỏi khai vấn 2: Tháo gỡ xung đột giữa mong muốn bên trong và áp lực bên ngoài",
          "Câu hỏi khai vấn 3: Hành động can đảm nhất họ cần làm ngay trong tuần này"
        ]
      }
    `;

    const userPrompt = `
      Khách hàng: ${fullName}
      Ngày sinh: ${dob}
      Hồ sơ trọng tâm mong muốn: ${readingProfile}
      Bản đồ 17 chỉ số Pythagoras chi tiết:
      ${JSON.stringify(map, null, 2)}

      ${level2Context}

      Hãy thực hiện bài luận giải chuyển hóa tâm lý độc bản sâu sắc, chạm đến trái tim và đánh thức tiềm năng của ${fullName} theo đúng cấu trúc JSON quy định (Ngôn ngữ: ${language}).
    `;

    if (!this.genAI) {
      this.logger.error('Chưa cấu hình GEMINI_API_KEY trên máy chủ');
      throw new InternalServerErrorException('Chưa cấu hình GEMINI_API_KEY trên hệ thống máy chủ.');
    }

    const primaryModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.1-flash-lite';
    const candidateModels = [primaryModel, 'gemini-3.5-flash'].filter((v, i, a) => a.indexOf(v) === i);

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = result.response.text();
        return JSON.parse(text);
      } catch (error) {
        lastError = error;
        this.logger.warn(`Model ${modelName} gặp sự cố (${error.message}), đang thử model dự phòng...`);
      }
    }

    this.logger.error(`Tất cả mô hình AI đều không phản hồi:`, lastError?.message);
    throw new InternalServerErrorException(
      `Không thể khởi tạo bài luận giải độc bản: ${lastError?.message || 'Lỗi kết nối dịch vụ AI'}`
    );
  }
}

