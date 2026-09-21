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

    // Xây dựng System Prompt tuân thủ 100% HIẾN PHÁP DỰ ÁN LIFEMAPS (docs/PROJECT_CONSTITUTION.md)
    const systemInstruction = `
      Bạn là Chuyên gia Cao cấp về Tâm lý học Hành vi và Khai vấn Phát triển Bản thân, ứng dụng Hệ thống Giải mã Khoa học Pythagoras Quốc tế (Life Maps).
      
      NGHIÊM CẤM (HIẾN PHÁP DỰ ÁN LIFEMAPS):
      - Tuyệt đối KHÔNG đề cập đến các từ: "AI", "Trí tuệ nhân tạo", "Gemini", "GPT", "LLM", "Chatbot", "Mô hình ngôn ngữ".
      - Không sử dụng giọng văn bói toán mê tín dị đoan, phán xét tương lai thần bí. 
      - Luôn sử dụng ngôn ngữ KHOA HỌC THỰC CHỨNG, khai vấn tâm lý (coaching), thấu cảm, khích lệ và hướng tới hành động cụ thể.

      MỤC TIÊU CỐT LÕI - LUẬN GIẢI CẤP ĐỘ 3 ĐỘC BẢN (MULTI-FACTOR SYNTHESIS):
      - Mỗi con người là một thực thể duy nhất. 252+ dữ liệu Cấp 2 chỉ là tài liệu tham khảo nền tảng.
      - Bạn phải tạo ra bài luận giải CẤP ĐỘ 3 ĐỘC BẢN không ai trùng ai, bằng cách phân tích sự giao thoa, tương tác, bổ trợ hoặc mâu thuẫn nội tâm giữa 17 chỉ số của người này:
        1. Hạt nhân bản sắc: Đường Đời (${map?.life_path}) kết hợp Sứ Mệnh (${map?.expression}). Phương tiện Sứ Mệnh đang trợ lực hay kéo chậm con đường của Đường Đời?
        2. Động lực nội tâm vs Biểu hiện: Linh Hồn (${map?.heart_desire}) và Nhân Cách (${map?.personality}) có đồng thuận hay mâu thuẫn? Họ có đang phải "đeo mặt nạ" trước xã hội không?
        3. Bộ công cụ thực thi: Tư Duy Lý Trí (${map?.rational_thought}) và Ngày Sinh (${map?.birthday}) giúp họ ra quyết định và hành động như thế nào?
        4. Vùng trũng & Bài học: Các số thiếu (${JSON.stringify(map?.karmic_lessons || [])}) và Nợ nghiệp (${JSON.stringify(map?.karmic_debts || [])}) tạo ra những bài học lặp lại nào trong cuộc sống của họ?
        5. Dòng chảy thời gian: Đỉnh cao Kim Tự Tháp hiện tại và Năm Cá Nhân (${map?.personal_year}) mang thông điệp hành động gì cho năm nay?

      CẤU TRÚC PHÂN TÍCH THEO PHÂN CẤP (TIER):
      - TIER 0 / TIER 1: Phân tích khái quát Tam Giác Vàng (Đường Đời, Sứ Mệnh, Linh Hồn) và bộ số bản sắc.
      - TIER 2: Mở rộng phân tích 21 chỉ số, 4 Khối kể chuyện, Kim Tự Tháp và Thách thức.
      - TIER 3 (LUẬN GIẢI ĐA CHIỀU CHUYÊN SÂU): Phân tích độc bản sâu sắc nhất, lộ trình chuyển hóa 3 giai đoạn (0-6 tháng, 1-3 năm, dài hạn), định hướng theo hồ sơ: "${readingProfile}".

      ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
      Chỉ trả về JSON thuần túy (không bọc trong markdown \`\`\`json) với cấu trúc sau:
      {
        "identitySynthesis": {
          "title": "Bản Sắc Độc Bản: [Tiêu đề định vị phù hợp nhất]",
          "coreDynamic": "Phân tích sự tương tác độc nhất giữa Đường Đời và Sứ Mệnh",
          "innerVsOuter": "Phân tích sự giao thoa giữa Linh Hồn và Nhân Cách",
          "executionPower": "Cách Tư Duy Lý Trí và Ngày Sinh hỗ trợ hiện thực hóa mục tiêu"
        },
        "shadowAndGrowth": {
          "karmicPattern": "Mô thức rào cản lặp đi lặp lại từ bài học thiếu/nợ nghiệp",
          "transformationKey": "Chìa khóa hóa giải và chuyển hóa bài học thành sức mạnh"
        },
        "strategicRoadmap": {
          "personalYearFocus": "Chiến lược hành động tối ưu cho Năm Cá Nhân hiện tại",
          "shortTerm0to6m": "3 hành động cụ thể cần làm ngay trong 6 tháng tới",
          "midTerm1to3y": "Mục tiêu trọng tâm cho 1-3 năm tới",
          "longTermPinnacle": "Định hướng để chạm tới Đỉnh Cao Kim Tự Tháp thành công"
        },
        "coachingQuestions": [
          "Câu hỏi khai vấn đánh thức tiềm năng 1",
          "Câu hỏi khai vấn đánh thức tiềm năng 2",
          "Câu hỏi khai vấn đánh thức tiềm năng 3"
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

      Hãy thực hiện tổng hòa đa yếu tố Cấp độ 3 và xuất ra bài phân tích độc bản theo đúng cấu trúc JSON đã yêu cầu (Ngôn ngữ: ${language}).
    `;

    // Nếu không có Gemini API key hoặc gặp lỗi kết nối, trả về Fallback synthesis chất lượng cao từ Cấp 2
    if (!this.genAI) {
      this.logger.warn('Không có Gemini API Key, sử dụng Local Synthesis Engine Cấp độ 3');
      return this.generateLocalLevel3Synthesis(fullName, dob, map, readingProfile);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
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
      this.logger.error('Lỗi khi gọi Gemini API:', error.message);
      // Fallback an toàn
      return this.generateLocalLevel3Synthesis(fullName, dob, map, readingProfile);
    }
  }

  /**
   * Bộ sinh dự phòng cục bộ Cấp độ 3 (Local Synthesis Engine)
   * Đảm bảo hệ thống KHÔNG BAO GIỜ bị sập hay gián đoạn khi mạng chậm hoặc API quota giới hạn
   */
  private generateLocalLevel3Synthesis(fullName: string, dob: string, map: any, profile: string): any {
    const lp = map?.life_path || map?.lifePath || 1;
    const ex = map?.expression || 1;
    const hd = map?.heart_desire || map?.soulUrge || 1;
    const year = map?.personal_year || 1;

    return {
      identitySynthesis: {
        title: `Bản Sắc Độc Bản: Sự Hòa Hợp Năng Lượng ${lp} - ${ex}`,
        coreDynamic: `Đường đời ${lp} dẫn dắt bạn trên con đường kiến tạo giá trị riêng biệt, trong khi Sứ mệnh ${ex} đóng vai trò là phương tiện thực thi giúp bạn hiện thực hóa các mục tiêu lớn. Khi hai nguồn năng lượng này tương hỗ, bạn phát huy tối đa sức bật cá nhân.`,
        innerVsOuter: `Khao khát linh hồn số ${hd} thôi thúc bạn tìm kiếm sự an yên và thỏa mãn nội tâm, kết hợp cùng năng lượng đối ngoại giúp bạn giữ được sự chân thành trong mọi mối quan hệ đối tác.`,
        executionPower: `Bộ công cụ tư duy số học Pythagoras giúp bạn nhận diện sớm cơ hội, ra quyết định logic và duy trì kỷ luật hành động.`
      },
      shadowAndGrowth: {
        karmicPattern: `Cần chú trọng thấu cảm và lắng nghe phản hồi của người đồng hành; tránh để áp lực công việc làm lu mờ sự gắn kết tình cảm.`,
        transformationKey: `Thực hành tự phản tỉnh định kỳ và thiết lập ranh giới làm việc lành mạnh để duy trì năng lượng đỉnh cao.`
      },
      strategicRoadmap: {
        personalYearFocus: `Năm cá nhân số ${year} là thời điểm vàng để tập trung vào việc ${year === 1 ? 'khởi xướng dự án mới' : year === 8 ? 'bứt phá tài chính và gặt hái thành tựu' : 'học tập, tích lũy nội lực và phát triển chuyên sâu'}.`,
        shortTerm0to6m: `Tối ưu hóa các kỹ năng cốt lõi và xây dựng kế hoạch hành động 90 ngày rõ ràng.`,
        midTerm1to3y: `Mở rộng tầm ảnh hưởng, xây dựng mạng lưới cộng sự đáng tin cậy.`,
        longTermPinnacle: `Đạt được sự tự do và cân bằng trọn vẹn giữa sự nghiệp và đời sống cá nhân.`
      },
      coachingQuestions: [
        `Mục tiêu quan trọng nhất trong 6 tháng tới sẽ đưa bạn đến gần nhất với Sứ mệnh ${ex} của mình là gì?`,
        `Thói quen nào đang lấy đi nhiều năng lượng nhất mà bạn sẵn sàng loại bỏ ngay hôm nay?`,
        `Nếu bạn tin tưởng 100% vào năng lực Đường đời ${lp} của mình, quyết định táo bạo tiếp theo của bạn sẽ là gì?`
      ]
    };
  }
}
