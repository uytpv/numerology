import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface AIAnalysisRequest {
  fullName: string;
  dob: string;
  map: any; // Bản đồ số học tính toán từ client/lib
  tier: number; // 0: Free, 1: Tier 1 (Problems), 2: Tier 2 (Solutions)
  language: string; // 'vi', 'en', 'fi', v.v.
}

@Injectable()
export class AIService {
  private genAI: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      // Khởi tạo Google GenAI SDK
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Đọc tài liệu tham chiếu từ thư mục knowledge-base
   * Tìm kiếm các file trùng khớp với chỉ số để cung cấp làm ngữ cảnh (RAG tĩnh)
   */
  private getReferenceKnowledge(map: any): string {
    const kbPath = path.join(process.cwd(), 'knowledge-base');
    let referenceText = '';

    if (!fs.existsSync(kbPath)) {
      // Nếu chưa có thư mục, tự động tạo để người dùng upload tài liệu sau
      fs.mkdirSync(kbPath, { recursive: true });
      return '';
    }

    try {
      const files = fs.readdirSync(kbPath);
      
      // Tìm file tài liệu của Life Path
      const lifePathFile = files.find(f => 
        f.toLowerCase().includes(`life_path_${map.life_path}`) || 
        f.toLowerCase().includes(`duong_doi_${map.life_path}`)
      );
      if (lifePathFile) {
        referenceText += `\n[Tài liệu tham khảo Đường đời ${map.life_path}]:\n` + 
          fs.readFileSync(path.join(kbPath, lifePathFile), 'utf-8') + '\n';
      }

      // Tìm file tài liệu của Sứ mệnh (Expression)
      const expressionFile = files.find(f => 
        f.toLowerCase().includes(`expression_${map.expression}`) || 
        f.toLowerCase().includes(`su_menh_${map.expression}`)
      );
      if (expressionFile) {
        referenceText += `\n[Tài liệu tham khảo Sứ mệnh ${map.expression}]:\n` + 
          fs.readFileSync(path.join(kbPath, expressionFile), 'utf-8') + '\n';
      }

      // Tìm file tài liệu của Linh hồn (Heart Desire)
      const soulFile = files.find(f => 
        f.toLowerCase().includes(`heart_desire_${map.heart_desire}`) || 
        f.toLowerCase().includes(`linh_hon_${map.heart_desire}`)
      );
      if (soulFile) {
        referenceText += `\n[Tài liệu tham khảo Linh hồn ${map.heart_desire}]:\n` + 
          fs.readFileSync(path.join(kbPath, soulFile), 'utf-8') + '\n';
      }

    } catch (error) {
      console.warn('Lỗi đọc thư mục knowledge-base:', error.message);
    }

    return referenceText;
  }

  /**
   * Sinh báo cáo thần số học cá nhân hóa sâu bằng Gemini AI
   */
  async generatePersonalizedReport(req: AIAnalysisRequest): Promise<any> {
    if (!this.genAI) {
      throw new InternalServerErrorException('Gemini API Key chưa được cấu hình ở Backend');
    }

    const { fullName, dob, map, tier, language } = req;
    const modelName = 'gemini-2.5-flash'; // Sử dụng gemini-2.5-flash để tối ưu chi phí và tốc độ

    // Đọc tri thức địa phương nếu có
    const localKnowledge = this.getReferenceKnowledge(map);

    // Xây dựng System Instruction định hình phong cách AI
    const systemInstruction = `
      Bạn là một Chuyên gia Tâm lý học hành vi, chuyên viên định hướng nghề nghiệp và Nhà tư vấn Phát triển Bản thân ứng dụng Khoa học Số học Pythagoras (Pythagorean Numerology).
      Nhiệm vụ của bạn là phân tích và viết một bài báo cáo luận giải thần số học chuyên sâu cho khách hàng bằng ngôn ngữ yêu cầu: "${language}".
      
      PHONG CÁCH VIẾT:
      - Sử dụng giọng văn KHOA HỌC, thực tế, thấu cảm, phân tích sâu về tâm lý học và định hướng hành động.
      - Tuyệt đối TRÁNH giọng điệu bói toán mê tín dị đoan, thần bí hóa vấn đề hay phán xét tương lai.
      - Coi các con số như là các mô thức năng lượng và đặc điểm tâm lý hành vi có thể rèn luyện, cải thiện.
      
      QUY TẮC PHÂN TÍCH KẾT HỢP ĐA CHIỀU (MULTI-FACTOR SYNTHESIS):
      - Không phân tích các chỉ số một cách độc lập, tách rời. Hãy chú ý sự tương tác giữa các chỉ số.
      - Đặc biệt phân tích sự kết hợp giữa Đường đời (${map.life_path}) và Sứ mệnh (${map.expression}). 
      Ví dụ, nếu Đường đời là 8 (thích độc lập, quyền lực, vật chất) kết hợp với Sứ mệnh 4 (thích thực tế, kỷ luật, chi tiết), họ là người xây dựng hệ thống quy mô bền vững. Nhưng nếu Đường đời 8 kết hợp Sứ mệnh 3 (thích giao tiếp, nghệ thuật, tự do), họ sẽ biểu đạt quyền lực thông qua tiếng nói, sáng tạo.
      - Phân tích sự mâu thuẫn nội tâm (nếu có), ví dụ Linh hồn (${map.heart_desire}) mong muốn sự an toàn nhưng Nhân cách (${map.personality}) lại biểu hiện sự năng động, hướng ngoại.
      
      CÁC CẤP ĐỘ PHÂN TÍCH (TIER LEVEL):
      Bạn PHẢI viết báo cáo dựa trên phân cấp tài khoản thanh toán của khách hàng:
      - Cấp độ TIER 0 (Miễn phí): Chỉ trả về một đoạn tóm tắt khái quát bản sắc cốt lõi của họ (tối đa 200 từ). Nêu bật nét độc đáo lớn nhất nhưng chưa đi sâu vào chi tiết khó khăn hay giải pháp hành động (để tạo sự tò mò).
      - Cấp độ TIER 1 (Nhận diện thách thức): Phân tích sâu về đặc điểm cốt lõi, điểm yếu tiềm ẩn, các bài học nợ nghiệp, chỉ số thiếu (${JSON.stringify(map.karmic_lessons)}) và thách thức lớn trong chặng đường hiện tại. Chưa đưa ra giải pháp giải quyết.
      - Cấp độ TIER 2 (Báo cáo đầy đủ & Giải pháp): Phân tích toàn bộ bản đồ bao gồm cả các giải pháp hành động cụ thể, lộ trình phát triển nghề nghiệp, lời khuyên khắc phục nợ nghiệp, và dự báo năng lượng năm cá nhân.

      ĐỊNH DẠNG ĐẦU RA:
      Bạn bắt buộc phải trả về dữ liệu dưới định dạng JSON thuần túy (không bọc trong dấu nháy markdown \`\`\`json) trùng khớp với cấu trúc sau:
      {
        "summary": "Tóm tắt bản sắc cốt lõi (Hiển thị cho cả Tier 0, 1, 2)",
        "coreAnalysis": {
          "lifePath": "Phân tích chi tiết Đường đời (Chỉ hiển thị từ Tier 1 trở lên)",
          "expression": "Phân tích Sứ mệnh (Chỉ hiển thị từ Tier 1 trở lên)",
          "soulAndPersonality": "Sự kết hợp Linh hồn & Nhân cách (Chỉ hiển thị từ Tier 1 trở lên)"
        },
        "challenges": {
          "karmicLessons": "Phân tích chi tiết về bài học nghiệp/số thiếu (Chỉ hiển thị từ Tier 1 trở lên)",
          "currentChallenge": "Thách thức chặng đường hiện tại (Chỉ hiển thị từ Tier 1 trở lên)"
        },
        "solutions": {
          "actionPlan": "Kế hoạch hành động cụ thể từng bước để khắc phục điểm yếu và phát huy thế mạnh (Chỉ hiển thị ở Tier 2)",
          "careerGuide": "Định hướng nghề nghiệp và môi trường làm việc tối ưu (Chỉ hiển thị ở Tier 2)",
          "personalYearAdvice": "Dự báo năng lượng năm cá nhân hiện tại và lời khuyên hành động (Chỉ hiển thị ở Tier 2)"
        }
      }
    `;

    // Chuẩn bị dữ liệu đầu vào cho Prompt
    const prompt = `
      Thông tin khách hàng:
      - Họ và tên: ${fullName}
      - Ngày sinh: ${dob}
      - Bản đồ số học đã tính toán: ${JSON.stringify(map)}
      
      Dữ liệu tài liệu tham khảo chất lượng cao (nếu có):
      ${localKnowledge}

      Hãy tạo báo cáo cho phân cấp khách hàng: TIER ${tier}.
    `;

    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
      });

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      throw new InternalServerErrorException('Không thể sinh báo cáo phân tích bằng AI: ' + error.message);
    }
  }
}
