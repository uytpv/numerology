import knowledgeData from './knowledge/knowledge_base_252.json';
import {
  cleanVerbatimText,
  BRIDGE_LPE_GUIDANCE,
  KARMIC_DEBT_GUIDANCE,
  KARMIC_LESSON_GUIDANCE,
  DOMAIN_DUE_DILIGENCE_CHECKLISTS
} from './refinedIndicatorAnalysis';
import { convertViToEn } from './numerology';

export function getIndicatorKnowledge(code: string, num: number) {
  const key = `${code}_${num}`;
  const rawRecord = (knowledgeData as any)[key];

  // THƯ VIỆN NỘI DUNG ĐỘC BẢN CHO TỪNG CON SỐ (KHÔNG LẶP TỪ, NGÔN NGỮ KHAI VẤN AN TOÀN)
  const NUMBER_TRAITS: Record<number, any> = {
    1: {
      core: 'Năng lượng Tiên phong, Lãnh đạo, Độc lập và Tự chủ cao độ.',
      positive: ['Ý chí kiên cường, dám nghĩ dám làm và không ngại thử thách mới', 'Khả năng ra quyết định nhanh, quyết đoán và chịu trách nhiệm 100%', 'Tinh thần tự lập, tự tạo động lực nội tại mạnh mẽ'],
      shadow: ['Dễ bảo thủ, độc đoán hoặc áp đặt ý kiến lên người khác', 'Thiếu kiên nhẫn khi người khác không theo kịp tốc độ của mình', 'Dễ căng thẳng khi phải làm việc dưới sự kiểm soát của người khác'],
      career: 'Có thể phát huy tốt trong các môi trường cần tính tự chủ cao, điều hành dự án, khởi xướng mô hình mới hoặc nghiên cứu độc lập. (Cần kiểm chứng bằng kỹ năng và đào tạo thực tế).',
      relationships: 'Cần học cách lắng nghe thấu cảm và hạ bớt cái tôi; tôn trọng ý kiến và không gian của đối phương.',
      decisionMaking: 'Quyết đoán, trực tiếp, tập trung vào kết quả nhưng cần lắng nghe thêm góc nhìn của cộng sự.',
      money: 'Năng lực tạo ra dòng tiền độc lập tốt; cần chú trọng quản trị rủi ro và duy trì quỹ dự phòng.',
      growth: ['Tập ủy quyền và tin tưởng vào năng lực của đội ngũ', 'Thực hành lắng nghe trọn vẹn 3 phút trước khi phản bác'],
      question: 'Cái tôi của bạn đang bảo vệ bạn hay đang ngăn cản bạn kết nối sâu sắc với người khác?'
    },
    2: {
      core: 'Năng lượng Lắng nghe, Hòa giải, Kết nối và Trực giác thấu cảm.',
      positive: ['Khả năng thấu cảm tinh tế, nhận biết cảm xúc và nhu cầu của người khác', 'Nghệ thuật ngoại giao khéo léo, hóa giải xung đột xuất sắc', 'Lòng trung thành và tinh thần đồng đội bền vững'],
      shadow: ['Dễ nhạy cảm thái quá, hay suy diễn và lo sợ bị từ chối', 'Khó đưa ra quyết định dứt khoát vì sợ làm mất lòng người khác', 'Có xu hướng phụ thuộc cảm xúc vào người xung quanh'],
      career: 'Có thể thấy hứng thú với các môi trường hợp tác, điều phối quan hệ đối tác, dịch vụ khách hàng, quản trị nhân sự hoặc tư vấn hỗ trợ. (Cần kiểm chứng bằng kinh nghiệm thực tế).',
      relationships: 'Đề cao sự hòa hợp, gắn kết chân thành; là chỗ dựa tinh thần ấm áp cho bạn đời.',
      decisionMaking: 'Cân nhắc nhiều chiều, tìm kiếm giải pháp dung hòa và luôn hướng tới sự đồng thuận.',
      money: 'Quản trị tài chính an toàn, thận trọng, phù hợp tích lũy và hợp tác đầu tư cùng người đáng tin cậy.',
      growth: ['Rèn luyện thói quen tự ra quyết định độc lập cho những việc nhỏ mỗi ngày', 'Học cách từ chối lịch sự khi vượt quá giới hạn của mình'],
      question: 'Bạn có đang vì muốn làm hài lòng người khác mà bỏ quên nhu cầu thật của chính mình?'
    },
    3: {
      core: 'Năng lượng Sáng tạo, Truyền cảm hứng, Giao tiếp và Tỏa sáng.',
      positive: ['Năng khiếu ngôn từ, hoạt ngôn và truyền cảm hứng tự nhiên', 'Trí tưởng tượng phong phú, luôn có nhiều ý tưởng đột phá', 'Lạc quan, hóm hỉnh và mang lại năng lượng tích cực cho tập thể'],
      shadow: ['Dễ phân tán năng lượng, làm nhiều việc cùng lúc nhưng khó hoàn tất', 'Cảm xúc thất thường, dễ nản khi gặp việc chi tiết lặp lại', 'Đôi khi dùng lời nói bộc phát gây tổn thương người khác'],
      career: 'Phù hợp với truyền thông, sáng tạo nội dung, đào tạo, quan hệ công chúng hoặc nghệ thuật biểu đạt. (Cần rèn luyện tính kỷ luật thực thi).',
      relationships: 'Thích sự vui vẻ, tương tác cởi mở; cần người bạn đời biết lắng nghe và khích lệ.',
      decisionMaking: 'Ra quyết định dựa trên cảm hứng và trực giác sáng tạo; cần thêm dữ liệu thực tế kiểm chứng.',
      money: 'Kiếm tiền tốt nhờ tài năng và mối quan hệ; cần có kế hoạch ngân sách kỷ luật để tránh chi tiêu ngẫu hứng.',
      growth: ['Chọn 1 mục tiêu duy nhất và kiên trì hoàn thành đến cùng trước khi bắt đầu việc mới', 'Ghi nhật ký cảm xúc mỗi ngày'],
      question: 'Bạn đang dùng năng khiếu ngôn từ để xây dựng giá trị hay để né tránh kỷ luật thực thi?'
    },
    4: {
      core: 'Năng lượng Kỷ luật, Thực tế, Trật tự và Xây dựng nền tảng vững chắc.',
      positive: ['Tính kỷ luật cao độ, trung thực và đáng tin cậy', 'Tư duy logic, chặt chẽ, giỏi tổ chức quy trình và quản trị chi tiết', 'Sự kiên trì, bền bỉ làm đến cùng mọi việc được giao'],
      shadow: ['Dễ cứng nhắc, bảo thủ và khó thích nghi với sự thay đổi', 'Quá chú trọng chi tiết dẫn đến bỏ lỡ bức tranh tổng thể', 'Có xu hướng lo âu thái quá về sự an toàn tài chính'],
      career: 'Có thể phát huy tốt trong quản trị vận hành, tài chính, kiểm soát chất lượng, kỹ thuật hệ thống hoặc xây dựng quy trình.',
      relationships: 'Thể hiện tình cảm qua hành động thực tế và sự chu toàn; cần học cách bày tỏ cảm xúc mềm mại hơn.',
      decisionMaking: 'Cẩn trọng, dựa trên dữ liệu và quy trình kiểm chứng rõ ràng; không bao giờ quyết định vội vàng.',
      money: 'Quản trị dòng tiền cực kỳ chặt chẽ, ưu tiên tích lũy an toàn và bảo toàn vốn.',
      growth: ['Chủ động thử nghiệm 1 cách làm mới mỗi tuần để mở rộng tính linh hoạt', 'Học cách thả lỏng và nghỉ ngơi khi hoàn tất công việc'],
      question: 'Sự an toàn mà bạn đang cố gìn giữ có đang biến thành chiếc lồng giới hạn sự bứt phá của bạn?'
    },
    5: {
      core: 'Năng lượng Tự do, Khám phá, Đổi mới và Thích ứng linh hoạt.',
      positive: ['Khả năng thích ứng nhanh nhạy với biến động môi trường', 'Tư duy cởi mở, nhanh nhạy nắm bắt các xu hướng mới', 'Dũng cảm bứt phá khỏi những khuôn mẫu cũ kỹ'],
      shadow: ['Dễ bồn chồn, thiếu kiên nhẫn và nhanh chán nản', 'Dễ thay đổi mục tiêu liên tục khi gặp khó khăn ban đầu', 'Khó duy trì các cam kết dài hạn nếu thiếu kỷ luật'],
      career: 'Phù hợp với kinh doanh, thương mại, truyền thông số, tư vấn chiến lược hoặc các lĩnh vực đòi hỏi tính linh động cao.',
      relationships: 'Cần sự tự do và tôn trọng không gian riêng; hòa hợp với người bạn đời cùng chí hướng phát triển.',
      decisionMaking: 'Nhanh, quyết đoán và sẵn sàng chấp nhận rủi ro có tính toán để đón đầu cơ hội.',
      money: 'Dòng tiền vào tốt nhờ tính nhạy bén cơ hội; cần thiết lập quỹ dự phòng tự động để tránh chi tiêu ngẫu hứng.',
      growth: ['Thiết lập 3 nguyên tắc bất di bất dịch mà bạn cam kết không bao giờ phá vỡ', 'Rèn luyện thói quen hoàn thành 100% dự án trước khi chuyển hướng'],
      question: 'Bạn đang thực sự tự do hay chỉ đang né tránh các cam kết và kỷ luật cần thiết?'
    },
    6: {
      core: 'Năng lượng Trách nhiệm, Yêu thương, Nuôi dưỡng và Phụng sự gia đình.',
      positive: ['Trái tim ấm áp, giàu lòng nhân ái và tinh thần trách nhiệm cao', 'Khả năng chăm sóc, đồng hành và hỗ trợ người khác một cách chu đáo', 'Gu thẩm mỹ tinh tế, tạo dựng môi trường sống ấm cúng và hòa hợp'],
      shadow: ['Dễ ôm đồm, can thiệp sâu vào chuyện của người khác (bao đồng)', 'Hay lo lắng thái quá và tự tạo áp lực vô hình cho bản thân', 'Khó từ chối người khác dẫn đến kiệt sức cảm xúc'],
      career: 'Có thể phát huy tốt trong giáo dục, chăm sóc sức khỏe, quản trị nhân sự, thiết kế không gian hoặc dịch vụ cộng đồng.',
      relationships: 'Gia đình là ưu tiên hàng đầu; chu đáo và chăm sóc bạn đời nhưng cần tôn trọng ranh giới riêng của mỗi người.',
      decisionMaking: 'Lấy yếu tố con người và sự hòa thuận làm trung tâm khi đưa ra mọi quyết định.',
      money: 'Ưu tiên chi tiêu cho gia đình và tổ ấm; cần học cách đầu tư cho sự phát triển của bản thân.',
      growth: ['Học cách yêu thương chính mình và đặt ranh giới: "Giúp đỡ có trí tuệ là trao quyền, không làm thay"', 'Dành thời gian nghỉ ngơi riêng biệt mỗi tuần'],
      question: 'Bạn có đang dùng sự chăm sóc để mong cầu sự công nhận và kiểm soát người khác?'
    },
    7: {
      core: 'Năng lượng Trí tuệ, Chiêm nghiệm, Phân tích sâu sắc và Tìm tòi chân lý.',
      positive: ['Tư duy phân tích logic độc lập kết hợp khả năng tự nghiên cứu sâu', 'Khả năng tự học và đào sâu bản chất vấn đề đạt tầm chuyên sâu', 'Điềm tĩnh, sâu sắc, nhìn thấu các mối liên hệ ẩn giấu'],
      shadow: ['Dễ hoài nghi, khép kín và tự cô lập khỏi tập thể', 'Có xu hướng phán xét người khác bằng tiêu chuẩn trí tuệ khắt khe', 'Dễ rơi vào trạng thái suy nghĩ quá nhiều (overthinking) dẫn đến trì hoãn'],
      career: 'Phù hợp với nghiên cứu, phân tích dữ liệu, công nghệ thông tin, hoạch định chiến lược hoặc học thuật chuyên sâu.',
      relationships: 'Cần không gian riêng tĩnh lặng để nạp lại năng lượng; chọn lọc bạn bè và người đồng hành kỹ lưỡng.',
      decisionMaking: 'Phân tích kỹ lưỡng dựa trên dữ liệu kiểm chứng và logic độc lập; không bị cuốn theo đám đông.',
      money: 'Quản trị tài chính cẩn trọng; phù hợp đầu tư vào tri thức, công nghệ và các tài sản có giá trị thực.',
      growth: ['Chủ động mở lòng chia sẻ suy nghĩ với đồng nghiệp đáng tin cậy', 'Hạn chế overthinking bằng cách chia nhỏ kế hoạch thành hành động vi mô'],
      question: 'Sự tĩnh lặng của bạn là để tích lũy trí tuệ hay đang là vỏ bọc để trốn tránh kết nối thực tế?'
    },
    8: {
      core: 'Năng lượng Lãnh đạo, Điều hành, Chiến lược và Quản trị dòng tiền.',
      positive: ['Tầm nhìn chiến lược sắc bén, năng lực tổ chức và điều hành bài bản', 'Bản lĩnh kiên cường, bền bỉ vượt qua khó khăn', 'Khả năng làm chủ dòng tiền và quản trị nguồn lực hiệu quả'],
      shadow: ['Dễ bị cuốn vào áp lực thành tích và công việc mà bỏ quên sức khỏe tinh thần', 'Đôi khi quá thực tế, lạnh lùng hoặc thiếu kiên nhẫn với người chậm tiến độ', 'Áp lực tự thân lớn dẫn đến căng thẳng kéo dài'],
      career: 'Phù hợp với quản lý điều hành, tài chính doanh nghiệp, đầu tư, phát triển kinh doanh hoặc quản trị dự án quy mô.',
      relationships: 'Thể hiện sự quan tâm qua hành động chu toàn thực tế; cần rèn luyện sự lắng nghe dịu dàng và bày tỏ tình cảm chân thành.',
      decisionMaking: 'Nhanh nhạy, quyết đoán, nhìn rõ cán cân chi phí - lợi ích và tính toán rủi ro thực tế.',
      money: 'Năng lực kiếm tiền và tích lũy tài sản tốt; cần duy trì đạo đức kinh doanh và quản trị rủi ro dòng tiền.',
      growth: ['Học cách ủy quyền cho cấp dưới và ghi nhận nỗ lực của tập thể', 'Duy trì thói quen tập thể dục hàng ngày để giải tỏa áp lực công việc'],
      question: 'Bạn đang làm chủ mục tiêu và công việc, hay đang để áp lực thành tích chi phối cảm xúc cuộc sống?'
    },
    9: {
      core: 'Năng lượng Nhân đạo, Bao dung, Khai sáng và Phụng sự cộng đồng.',
      positive: ['Trái tim nhân ái, tinh thần vị tha và trách nhiệm xã hội cao', 'Khả năng truyền cảm hứng, dẫn dắt và nâng đỡ tinh thần cho người khác', 'Tầm nhìn bao quát, tư duy vì lợi ích chung của tập thể'],
      shadow: ['Dễ thất vọng khi thực tế không hoàn hảo như kỳ vọng lý tưởng', 'Khó buông bỏ quá khứ hoặc những tổn thương cũ', 'Đôi khi quá rộng lượng đến mức bị người khác lợi dụng sự hỗ trợ'],
      career: 'Phù hợp với giáo dục, đào tạo, công tác xã hội, y tế, văn hóa nghệ thuật hoặc các dự án mang lại giá trị cộng đồng.',
      relationships: 'Bao dung, chân thành và thấu hiểu; cần học cách bảo vệ ranh giới cá nhân và năng lượng của mình.',
      decisionMaking: 'Lấy giá trị nhân văn và lợi ích lâu dài của tập thể làm kim chỉ nam.',
      money: 'Kiếm tiền để phục vụ cho các mục tiêu ý nghĩa; cần học cách quản trị tài chính cá nhân thực tế.',
      growth: ['Thực hành tha thứ và buông bỏ những điều bất như ý trong quá khứ', 'Chuyển hóa lý tưởng thành những hành động thiết thực hàng ngày'],
      question: 'Bạn có đang gánh vác quá nhiều kỳ vọng mà quên mất việc chăm sóc chính bản thân mình?'
    },
    11: {
      core: 'Năng lượng Master 11: Trực giác sâu sắc, Kết nối con người và Truyền cảm hứng.',
      positive: ['Trực giác nhạy bén, khả năng cảm nhận nhanh các xu hướng phát triển', 'Năng lực truyền đạt ý tưởng mạch lạc, khích lệ và đánh thức tiềm năng của người khác', 'Tinh thần hướng thiện, chú trọng các giá trị nhân văn và ý nghĩa xã hội'],
      shadow: ['Dễ bị quá tải cảm xúc khi làm việc trong môi trường căng thẳng, ồn ào', 'Có lúc tự nghi ngờ năng lực trước những mục tiêu lớn', 'Cần nỗ lực cân bằng giữa ý tưởng lý tưởng và tính khả thi thực tế'],
      career: 'Có thể thấy hứng thú với các môi trường cần truyền đạt ý tưởng, kết nối con người, nghiên cứu, sáng tạo hoặc dẫn dắt thay đổi. Việc chọn nghề cần kiểm chứng bằng kỹ năng, kinh nghiệm, đào tạo và phản hồi thị trường.',
      relationships: 'Tìm kiếm sự gắn kết sâu sắc và chân thành; phù hợp với người bạn đời biết lắng nghe và đồng cảm.',
      decisionMaking: 'Kết hợp trực giác nhạy bén và phân tích thực tế; các quyết định mang tính đổi mới.',
      money: 'Tài chính phát triển thuận lợi khi bạn tập trung tạo ra giá trị thực chất; cần có kế hoạch quản lý chi tiêu rõ ràng.',
      growth: ['Duy trì các khoảng lặng thư giãn, đi dạo thiên nhiên để tái tạo năng lượng', 'Kiểm chứng trực giác bằng dữ liệu và phản hồi thực tế trước khi hành động'],
      question: 'Bạn có đang cân bằng tốt giữa trực giác và các dữ liệu thực tế khi ra quyết định?'
    },
    22: {
      core: 'Năng lượng Master 22: Tư duy hệ thống, Tầm nhìn chiến lược và Năng lực hiện thực hóa.',
      positive: ['Tầm nhìn chiến lược dài hạn kết hợp khả năng tổ chức bài bản', 'Năng lực chuyển hóa các ý tưởng phức tạp thành quy trình thực thi cụ thể', 'Sự kiên trì và tinh thần trách nhiệm cao trước các dự án lớn'],
      shadow: ['Áp lực trách nhiệm lớn dễ dẫn đến quá tải nếu không biết chia nhỏ công việc', 'Dễ mất kiên nhẫn khi người khác chưa theo kịp tiến độ', 'Nỗi sợ rủi ro có thể làm chậm thời điểm ra quyết định'],
      career: 'Có thể phát huy tốt trong quản lý dự án quy mô, hoạch định chiến lược, kiến trúc hệ thống hoặc điều hành tổ chức. (Cần chứng minh qua năng lực thực tế).',
      relationships: 'Cần sự đồng hành và thấu hiểu sâu sắc từ người bạn đời trước những trọng trách công việc.',
      decisionMaking: 'Tư duy hệ thống nhiều bước, tính toán chiến lược cho tương lai dài hạn.',
      money: 'Kiến tạo và quản trị dòng tiền bài bản; tiền bạc là công cụ để xây dựng các giá trị bền vững.',
      growth: ['Học cách chia nhỏ các dự án lớn thành các cột mốc tuần tự để giảm tải áp lực', 'Xây dựng đội ngũ cộng sự cốt lõi đáng tin cậy'],
      question: 'Bạn đang xây dựng thành tựu vì áp lực chứng tỏ bản thân hay vì giá trị bền vững lâu dài?'
    },
    33: {
      core: 'Năng lượng Master 33: Tinh thần phụng sự, Lòng trắc ẩn và Nâng đỡ tha nhân.',
      positive: ['Lòng trắc ẩn sâu sắc, tinh thần cống hiến vì sự phát triển của con người', 'Khả năng lắng nghe, thấu cảm và chuyển hóa nhận thức cho cộng sự', 'Sự kiên định với các giá trị đạo đức và sự chính trực'],
      shadow: ['Dễ gánh vác việc của người khác dẫn đến kiệt sức thể chất và tinh thần', 'Khó từ chối những lời nhờ vả vượt quá khả năng', 'Đôi khi đặt tiêu chuẩn đạo đức quá cao lên người xung quanh'],
      career: 'Có thể phát huy tốt trong đào tạo, phát triển con người, công tác xã hội, chăm sóc sức khỏe hoặc cố vấn hướng nghiệp.',
      relationships: 'Yêu thương chân thành, bao dung và luôn tôn trọng sự tự do của bạn đời.',
      decisionMaking: 'Lấy sự chính trực, lòng trắc ẩn và tính bền vững làm thước đo cốt lõi.',
      money: 'Nhìn nhận tài chính như phương tiện để phụng sự và nâng cao chất lượng cuộc sống cho cộng đồng.',
      growth: ['Thiết lập ranh giới rõ ràng: Biết nói lời từ chối để bảo vệ sức khỏe của chính mình', 'Dành thời gian chăm sóc thân - tâm mỗi ngày'],
      question: 'Bạn có đang giúp đỡ người khác bằng sự hy sinh làm tổn hại đến sức khỏe và sự bình an của mình?'
    }
  };

  const traitInfo = NUMBER_TRAITS[num] || NUMBER_TRAITS[1];
  const cleanedDesc = rawRecord?.full_description ? cleanVerbatimText(rawRecord.full_description) : '';

  // Xử lý riêng cho cầu nối LPE / HDP
  if (code === 'soul_bridge' || code === 'personality_bridge') {
    const bridgeGuidance = BRIDGE_LPE_GUIDANCE[num] || BRIDGE_LPE_GUIDANCE[1];
    return {
      indicator_code: code,
      indicator_name: code === 'soul_bridge' ? 'Liên kết Đường đời – Sứ mệnh' : 'Liên kết Linh hồn – Nhân cách',
      number: num,
      core_energy: bridgeGuidance.meaning,
      positive_traits: [
        'Năng lực hợp nhất và cân bằng giữa hai trường năng lượng cốt lõi.',
        'Tháo gỡ điểm nghẽn nội tâm để tập trung nguồn lực hành động hiệu quả.'
      ],
      shadow_traits: [
        `Nút thắt điểm nghẽn: ${bridgeGuidance.whyBottleneck}`
      ],
      career_guidance: `Kích hoạt bài học số ${num} sẽ giúp bạn giải phóng các rào cản trì hoãn và tối ưu hóa hiệu suất làm việc.`,
      relationships: `Giúp bạn thấu hiểu và gắn kết chân thật với đồng nghiệp, đối tác và người thân.`,
      decision_making: `Ra quyết định sáng suốt khi không còn bị giằng xé giữa hai luồng suy nghĩ.`,
      money_management: `Quản trị dòng tiền minh bạch, kiên định với các mục tiêu tài chính dài hạn.`,
      growth_actions: bridgeGuidance.howToActivate,
      power_questions: [
        `Bài tập thực hành cụ thể: ${bridgeGuidance.exercise}`,
        `Bạn đã sẵn sàng vượt qua điểm nghẽn của Cầu Nối ${num} ngay hôm nay chưa?`
      ],
      full_description: cleanedDesc || bridgeGuidance.meaning
    };
  }

  // Xử lý riêng cho Nợ Bài Học (Karmic Debt 13/4, 14/5, 16/7, 19/1)
  if (code === 'karmic_debt') {
    if (!num || num === 0) {
      return {
        indicator_code: code,
        indicator_name: 'Nợ Bài Học (Karmic Debt)',
        number: 0,
        core_energy: rawRecord?.core_energy || 'Biểu đồ của bạn không xuất hiện các cấu phần Nợ bài học đặc biệt (13/4, 14/5, 16/7, 19/1). Năng lượng hành động của bạn diễn ra thuận lợi theo đúng dòng chảy tự nhiên của Đường Đời và Sứ Mệnh.',
        positive_traits: rawRecord?.positive_traits || [
          'Dòng năng lượng thực thi thông suốt, ít bị cản trở bởi các mô thức tắc nghẽn đặc biệt.',
          'Thuận lợi tập trung 100% nguồn lực vào việc phát triển thế mạnh cốt lõi.'
        ],
        shadow_traits: rawRecord?.shadow_traits || [
          'Vẫn cần duy trì tính kỷ luật và sự kiên trì trong công việc hàng ngày.'
        ],
        career_guidance: rawRecord?.career_guidance || 'Tập trung phát huy tối đa sở trường của Đường Đời và Sứ Mệnh để gặt hái thành tựu bền vững.',
        relationships: rawRecord?.relationships || 'Chân thành, minh bạch và tôn trọng các cam kết.',
        decision_making: rawRecord?.decision_making || 'Dựa trên phân tích khách quan và mục tiêu phát triển rõ ràng.',
        money_management: rawRecord?.money_management || 'Quản trị dòng tiền kỷ luật, tích lũy an toàn và đầu tư dài hạn.',
        growth_actions: rawRecord?.growth_actions || [
          'Thiết lập mục tiêu quý rõ ràng và duy trì thói quen rà soát tiến độ định kỳ.'
        ],
        power_questions: rawRecord?.power_questions || [
          'Bạn đang tận dụng tối đa lợi thế năng lượng thông suốt của mình như thế nào?'
        ],
        full_description: rawRecord?.full_description || 'Biểu đồ không xuất hiện nợ bài học lớn. Bạn hoàn toàn có thể yên tâm tập trung phát triển sự nghiệp và cuộc sống một cách chủ động, tích cực.'
      };
    }

    const debtGuidance = KARMIC_DEBT_GUIDANCE[num] || KARMIC_DEBT_GUIDANCE[13];
    return {
      indicator_code: code,
      indicator_name: rawRecord?.indicator_name || debtGuidance.name,
      number: num,
      core_energy: rawRecord?.core_energy || debtGuidance.meaning,
      positive_traits: rawRecord?.positive_traits || [
        debtGuidance.focusTheme,
        'Cơ hội tôi luyện bản lĩnh vững chãi và năng lực thực thi xuất chúng.'
      ],
      shadow_traits: rawRecord?.shadow_traits || [
        'Xu hướng muốn đi đường tắt hoặc nản lòng trước các quy trình chi tiết.'
      ],
      career_guidance: rawRecord?.career_guidance || debtGuidance.whyItMatters,
      relationships: rawRecord?.relationships || 'Duy trì sự trung thực, uy tín và trách nhiệm cao với các cam kết.',
      decision_making: rawRecord?.decision_making || 'Dựa trên kế hoạch có cấu trúc và tính pháp lý minh bạch.',
      money_management: rawRecord?.money_management || 'Tập trung xây dựng tài sản bền vững, nói không với đầu cơ rủi ro cao.',
      growth_actions: rawRecord?.growth_actions || debtGuidance.growthAction,
      power_questions: rawRecord?.power_questions || [
        debtGuidance.disclaimer,
        'Bạn có đang kiên trì xây dựng nền móng vững chắc cho từng bước đi của mình?'
      ],
      full_description: rawRecord?.full_description || (debtGuidance.meaning + '\n\n' + debtGuidance.whyItMatters)
    };
  }

  // Xử lý riêng cho Chỉ Số Thiếu (Karmic Lessons 1..9)
  if (code === 'karmic_lessons') {
    const lessonGuidance = KARMIC_LESSON_GUIDANCE[num] || KARMIC_LESSON_GUIDANCE[6];
    return {
      indicator_code: code,
      indicator_name: rawRecord?.indicator_name || lessonGuidance.name,
      number: num,
      core_energy: rawRecord?.core_energy || lessonGuidance.explanation,
      positive_traits: rawRecord?.positive_traits || [
        `Trọng tâm vun bồi: ${lessonGuidance.cultivationArea}`,
        'Cơ hội rèn luyện chủ đích để hoàn thiện bản thân đa diện.'
      ],
      shadow_traits: rawRecord?.shadow_traits || [
        'Vùng năng lượng ít được sử dụng tự nhiên, cần sự chú tâm rèn luyện.'
      ],
      career_guidance: rawRecord?.career_guidance || `Bổ sung kỹ năng số ${num} giúp bạn thích ứng linh hoạt hơn trong môi trường làm việc.`,
      relationships: rawRecord?.relationships || 'Thấu hiểu sự khác biệt và tôn trọng không gian của người khác.',
      decision_making: rawRecord?.decision_making || 'Cân nhắc thêm các yếu tố thuộc bài học số ' + num,
      money_management: rawRecord?.money_management || 'Quản trị nguồn lực cẩn trọng và có mục tiêu rõ ràng.',
      growth_actions: rawRecord?.growth_actions || [
        `Thực hành hàng ngày: ${lessonGuidance.dailyPractice}`
      ],
      power_questions: rawRecord?.power_questions || [
        'Lưu ý: Chỉ số thiếu phản ánh tần số vắng mặt trong tên, KHÔNG phản ánh tuổi thơ hay mức độ được yêu thương.',
        `Hôm nay bạn có thể rèn luyện bài học số ${num} qua hành động nhỏ nào?`
      ],
      full_description: rawRecord?.full_description || (lessonGuidance.explanation + '\n\nTrọng tâm vun bồi: ' + lessonGuidance.cultivationArea + '\n\nThực hành hàng ngày: ' + lessonGuidance.dailyPractice)
    };
  }

  // Xử lý riêng cho Sức Mạnh Tiềm Thức
  if (code === 'subconscious_confidence') {
    return {
      indicator_code: code,
      indicator_name: `Sức Mạnh Tiềm Thức (Điểm Số ${num}/9)`,
      number: num,
      core_energy: `Bạn sở hữu ${num} trên 9 con số xuất hiện trong ma trận họ tên, phản ánh độ đa dạng của các nguồn lực phản xạ vô thức khi đối diện với biến cố bất ngờ.`,
      positive_traits: [
        'Khả năng tự phục hồi và phản xạ linh hoạt trong các tình huống áp lực.',
        'Độ nhạy bén tự nhiên khi xử lý vấn đề dựa trên kinh nghiệm tích lũy.'
      ],
      shadow_traits: [
        'Cần tránh phản ứng quá nhanh theo thói quen vô thức mà thiếu kiểm chứng dữ liệu.'
      ],
      career_guidance: 'Dựa vào kinh nghiệm và sự tự tin để dẫn dắt công việc qua giai đoạn khủng hoảng.',
      relationships: 'Giao tiếp chân thành, sử dụng sự cuốn hút tự nhiên để gắn kết mọi người.',
      decision_making: 'Kết hợp trực giác vô thức với tư duy logic và bằng chứng thực tế.',
      money_management: 'Bình tĩnh kiểm soát cảm xúc trước các biến động thị trường tài chính.',
      growth_actions: [
        'Dành 5 phút quan sát lại phản xạ cảm xúc của mình sau mỗi tình huống căng thẳng.'
      ],
      power_questions: [
        'Lưu ý: Điểm số ' + num + '/9 là tỷ lệ hiện diện chữ số trong tên, không phải con số đơn lẻ.',
        'Bạn có đang tin tưởng vào năng lực tự phục hồi bên trong mình?'
      ],
      full_description: `Chỉ số Sức mạnh tiềm thức đạt ${num}/9 cho thấy bạn có nền tảng phản xạ đa dạng. Khi gặp khó khăn, hãy bình tĩnh lắng nghe trực giác và vận dụng các nguồn lực đã có để giải quyết.`
    };
  }

  let roleContextPrefix = '';
  if (code === 'life_path') {
    roleContextPrefix = `[Vai trò: Trục Xương Sống & Bài Học Cuộc Đời] Với tư cách là Chỉ Số Đường Đời mang năng lượng số ${num}: `;
  } else if (code === 'expression') {
    roleContextPrefix = `[Vai trò: Kho Tàng Năng Lực & Phương Tiện Hành Động] Với tư cách là Chỉ Số Sứ Mệnh mang năng lượng số ${num}: `;
  } else if (code === 'heart_desire') {
    roleContextPrefix = `[Vai trò: Động Lực Nội Tâm & Nhu Cầu Cảm Xúc] Với tư cách là Chỉ Số Linh Hồn mang năng lượng số ${num}: `;
  } else if (code === 'personality') {
    roleContextPrefix = `[Vai trò: Phong Thái Xã Hội & Ấn Tượng Ngoại Giao] Với tư cách là Chỉ Số Nhân Cách mang năng lượng số ${num}: `;
  } else if (code === 'attitude') {
    roleContextPrefix = `[Vai trò: Phản Xạ Tự Nhiên Khi Đối Diện Biến Cố] Với tư cách là Chỉ Số Thái Độ mang năng lượng số ${num}: `;
  } else if (code === 'rational_thought') {
    roleContextPrefix = `[Vai trò: Cơ Chế Ra Quyết Định & Phong Cách Tư Duy] Với tư cách là Chỉ Số Tư Duy Lý Trí mang năng lượng số ${num}: `;
  } else if (code === 'balance') {
    roleContextPrefix = `[Vai trò: Mỏ Neo Phục Hồi & Giữ Vững Tâm Trí] Với tư cách là Chỉ Số Cân Bằng mang năng lượng số ${num}: `;
  } else if (code === 'maturity') {
    roleContextPrefix = `[Vai trò: Năng Lực Chín Muồi Sau Tuổi 35–40] Với tư cách là Chỉ Số Trưởng Thành mang năng lượng số ${num}: `;
  }

  return {
    indicator_code: code,
    indicator_name: rawRecord?.indicator_name || code,
    number: num,
    core_energy: roleContextPrefix ? `${roleContextPrefix}${traitInfo.core}` : traitInfo.core,
    positive_traits: traitInfo.positive,
    shadow_traits: traitInfo.shadow,
    career_guidance: traitInfo.career,
    relationships: traitInfo.relationships,
    decision_making: traitInfo.decisionMaking,
    money_management: traitInfo.money,
    growth_actions: traitInfo.growth,
    power_questions: [traitInfo.question],
    full_description: cleanedDesc ? `${roleContextPrefix}${cleanedDesc}` : traitInfo.core
  };
}

export function formatTitleCase(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

export interface IndicatorDefinition {
  name: string;
  code: string;
  definition: string;
  whyItMatters: string;
  hookQuestion: string;
}

export const INDICATOR_DEFINITIONS: Record<string, IndicatorDefinition> = {
  life_path: {
    name: 'Chỉ Số Đường Đời (Life Path)',
    code: 'life_path',
    definition: 'Chỉ số Đường Đời là con số trung tâm trong hệ thống Thần số học Pythagoras. Nó đại diện cho định hướng phát triển chủ đạo, các bài học thử thách và cơ hội rèn luyện cốt lõi trong tiến trình trưởng thành của mỗi cá nhân.',
    whyItMatters: 'Hiểu được Đường Đời giúp bạn nhận diện các xu hướng hành vi tự nhiên, từ đó đưa ra các lựa chọn học tập, sự nghiệp và phong cách sống phù hợp với thế mạnh nội tại.',
    hookQuestion: 'Con số Đường Đời của bạn gợi mở chủ đề rèn luyện cốt lõi nào?'
  },
  expression: {
    name: 'Chỉ Số Sứ Mệnh (Destiny / Expression)',
    code: 'expression',
    definition: 'Chỉ số Sứ Mệnh đại diện cho kho tàng năng lực tự nhiên, công cụ và phương tiện biểu đạt mạnh mẽ nhất mà bạn sở hữu để hiện thực hóa các mục tiêu cuộc sống.',
    whyItMatters: 'Nắm vững Sứ Mệnh giúp bạn phát huy tối đa sở trường chuyên môn và định hình phong cách hành động hiệu quả.',
    hookQuestion: 'Thế mạnh hành động và công cụ cốt lõi bạn đang sở hữu là gì?'
  },
  heart_desire: {
    name: 'Chỉ Số Linh Hồn (Soul Urge / Heart\'s Desire)',
    code: 'heart_desire',
    definition: 'Chỉ số Linh Hồn đại diện cho những khát khao nội tâm, động lực sâu kín và điều gì thực sự mang lại cảm giác thỏa nguyện, bình an tinh thần cho bạn.',
    whyItMatters: 'Nuôi dưỡng đúng nhu cầu của con số Linh Hồn giúp bạn duy trì năng lượng tích cực và tránh cảm giác trống rỗng trong cuộc sống.',
    hookQuestion: 'Nội tâm bạn thực sự tìm kiếm những giá trị tinh thần nào?'
  }
};

export const NUMBER_SPECIFIC_MEANINGS: Record<number, {
  title: string;
  shortHook: string;
  lifePathMeaning: string;
  expressionMeaning: string;
  soulMeaning: string;
  strengths: string[];
  weaknesses: string[];
}> = {
  1: {
    title: 'Số 1 - Nhà Tiên Phong, Lãnh Đạo & Tự Chủ',
    shortHook: 'Năng lượng mạnh mẽ của sự khởi đầu, ý chí độc lập và khát vọng dẫn đầu.',
    lifePathMeaning: 'Đường Đời 1 mang sứ mệnh trở thành người mở đường độc lập, dám tiên phong dấn thân vào những lĩnh vực mới và tự chịu trách nhiệm hoàn toàn về cuộc đời mình.',
    expressionMeaning: 'Sứ Mệnh 1 trang bị cho bạn tư duy sáng tạo độc đáo, năng lực chỉ huy, ra quyết định dứt khoát và khả năng tự thúc đẩy bản thân phi thường.',
    soulMeaning: 'Linh Hồn 1 khát khao được tự do tự chủ, được tôn trọng vị thế cá nhân và được công nhận như một người dẫn đầu có năng lực vượt trội.',
    strengths: ['Tự tin, quyết đoán, kiên định', 'Năng lực dẫn dắt và truyền cảm hứng hành động', 'Dám chấp nhận rủi ro để đổi mới'],
    weaknesses: ['Đôi khi độc đoán, bảo thủ', 'Thiếu kiên nhẫn khi người khác chậm tiến độ', 'Áp lực phải luôn chứng tỏ mình đúng']
  },
  2: {
    title: 'Số 2 - Nhà Ngoại Giao, Hòa Giải & Trực Giác',
    shortHook: 'Năng lượng của sự gắn kết, hòa bình, thấu cảm và trực giác tinh tế.',
    lifePathMeaning: 'Đường Đời 2 mang bài học lớn về sự hợp tác, kết nối con người, lắng nghe sâu sắc và kiến tạo sự hòa hợp cho các mối quan hệ.',
    expressionMeaning: 'Sứ Mệnh 2 ban cho bạn tài ngoại giao khéo léo, khả năng hòa giải xung đột và trực giác nhạy bén trong việc đọc vị cảm xúc đối phương.',
    soulMeaning: 'Linh Hồn 2 khao khát tình yêu thương chân thành, sự bình an nội tâm và một môi trường sống hòa thuận, không tranh chấp.',
    strengths: ['Khả năng lắng nghe và đồng cảm xuất sắc', 'Khéo léo, tinh tế trong đàm phán', 'Trực giác nhạy bén, nhận biết cảm xúc nhanh'],
    weaknesses: ['Dễ bị tổn thương bởi lời chỉ trích', 'Hay do dự, thiếu quyết đoán', 'Xu hướng hy sinh quá mức dẫn đến kiệt sức']
  },
  3: {
    title: 'Số 3 - Người Truyền Cảm Hứng & Nghệ Thuật Biểu Đạt',
    shortHook: 'Năng lượng rực rỡ của niềm vui sống, khiếu hài hước và tài năng ngôn từ.',
    lifePathMeaning: 'Đường Đời 3 có đích đến là lan tỏa niềm lạc quan, truyền cảm hứng sống tích cực và đánh thức cảm xúc của mọi người xung quanh.',
    expressionMeaning: 'Sứ Mệnh 3 sở hữu năng khiếu ăn nói, viết lách, thuyết trình hoặc sáng tạo nghệ thuật cuốn hút bẩm sinh.',
    soulMeaning: 'Linh Hồn 3 khao khát được tự do thể hiện bản thân, được sáng tạo và sống trong bầu không khí vui tươi, ngập tràn tiếng cười.',
    strengths: ['Tài năng ngôn từ và biểu đạt xuất sắc', 'Trí tưởng tượng phong phú, thẩm mỹ cao', 'Tinh thần lạc quan, truyền lửa tự nhiên'],
    weaknesses: ['Dễ phân tán năng lượng, làm nhiều việc dở dang', 'Cảm xúc thất thường, bốc đồng', 'Nhạy cảm trước sự thờ ơ của người khác']
  },
  4: {
    title: 'Số 4 - Nhà Xây Dựng Kỷ Luật & Trụ Cột Vững Vàng',
    shortHook: 'Năng lượng của sự thực tiễn, quy chuẩn, bài bản và độ tin cậy tuyệt đối.',
    lifePathMeaning: 'Đường Đời 4 là con đường kiến tạo nền tảng vững chắc, biến các ý tưởng trừu tượng thành hệ thống quy chuẩn có tính ứng dụng thực tế cao.',
    expressionMeaning: 'Sứ Mệnh 4 mang năng lực tổ chức, quản lý quy trình, phân tích số liệu tỉ mỉ và khả năng thực thi bền bỉ đáng tin cậy.',
    soulMeaning: 'Linh Hồn 4 mong muốn sự ổn định, an toàn rõ ràng về cấu trúc và lộ trình minh bạch trong cả công việc lẫn cuộc sống.',
    strengths: ['Tỉ mỉ, kỷ luật, trách nhiệm cao', 'Khả năng quản trị vận hành xuất sắc', 'Trung thực, kiên trì và bền bỉ'],
    weaknesses: ['Dễ cứng nhắc, bảo thủ, ngại đổi mới', 'Hay lo lắng về an toàn tài chính', 'Quá khắt khe với chính mình và người khác']
  },
  5: {
    title: 'Số 5 - Nhà Thám Hiểm Tự Do & Đổi Mới Đa Tài',
    shortHook: 'Năng lượng linh hoạt, khao khát khám phá, phá vỡ giới hạn cũ và thích nghi vượt trội.',
    lifePathMeaning: 'Đường Đời 5 là hành trình trải nghiệm đa dạng, mở rộng tầm nhìn, thích ứng với mọi biến động và dẫn đầu xu hướng mới.',
    expressionMeaning: 'Sứ Mệnh 5 có khả năng học hỏi thần tốc, ứng biến linh hoạt trong mọi tình huống và kết nối các nền văn hóa đa dạng.',
    soulMeaning: 'Linh Hồn 5 khao khát sự tự do không giới hạn, được phiêu lưu, dịch chuyển và trải nghiệm những điều mới lạ mỗi ngày.',
    strengths: ['Thích ứng thần tốc, xử lý khủng hoảng tốt', 'Tư duy tiến bộ, sáng tạo không giới hạn', 'Năng lượng cuốn hút, dám chấp nhận rủi ro'],
    weaknesses: ['Cả thèm chóng chán, thiếu kiên nhẫn', 'Dễ sa đà vào sự bốc đồng nhất thời', 'Khó cam kết lâu dài nếu bị gò bó']
  },
  6: {
    title: 'Số 6 - Người Nuôi Dưỡng, Trách Nhiệm & Tình Yêu Vô Điều Kiện',
    shortHook: 'Năng lượng ấm áp của sự chở che, phụng sự gia đình và khả năng chữa lành tâm hồn.',
    lifePathMeaning: 'Đường Đời 6 có sứ mệnh xây dựng mái ấm, chăm sóc người thân và mang lại sự an lành, chữa lành cho cộng đồng.',
    expressionMeaning: 'Sứ Mệnh 6 là chuyên gia tư vấn, cố vấn tâm lý, thiết kế không gian sống hài hòa và quản lý nhân sự bằng tình yêu thương.',
    soulMeaning: 'Linh Hồn 6 chỉ thực sự hạnh phúc khi những người thân yêu được bình an, khỏe mạnh và sống trong sự hòa thuận trọn vẹn.',
    strengths: ['Trái tim giàu lòng vị tha, nhân hậu', 'Khả năng tư vấn và chăm sóc tự nhiên', 'Gu thẩm mỹ tinh tế, tạo dựng sự ấm cúng'],
    weaknesses: ['Xu hướng ôm đồm, lo lắng thái quá', 'Dễ kiểm soát người khác vì nghĩ "tốt cho họ"', 'Hay quên đi ước mơ của chính bản thân']
  },
  7: {
    title: 'Số 7 - Nhà Triết Học Chiêm Nghiệm & Trí Tuệ Sâu Sắc',
    shortHook: 'Năng lượng của sự tìm tòi chân lý, trực giác sắc bén và chiều sâu nội tâm uyên bác.',
    lifePathMeaning: 'Đường Đời 7 là hành trình chiêm nghiệm chân lý, đào sâu bản chất vạn vật thông qua trải nghiệm thực tế và trí tuệ tâm linh.',
    expressionMeaning: 'Sứ Mệnh 7 sở hữu tư duy phân tích logic độc lập, năng lực nghiên cứu khoa học chuyên sâu và trực giác sắc sảo.',
    soulMeaning: 'Linh Hồn 7 khao khát không gian riêng tĩnh lặng để suy ngẫm, đọc sách và kết nối với thế giới tri thức vô tận.',
    strengths: ['Tư duy phân tích logic kết hợp trực giác sâu', 'Khả năng nghiên cứu độc lập chuyên sâu', 'Điềm tĩnh, nhìn thấu bản chất vấn đề'],
    weaknesses: ['Khép kín, khó mở lòng chia sẻ cảm xúc', 'Dễ hoài nghi, cô độc và xa cách', 'Đôi khi quá lý trí dẫn đến phán xét']
  },
  8: {
    title: 'Số 8 - Nhà Điều Hành Chiến Lược & Thịnh Vượng Vật Chất',
    shortHook: 'Năng lượng uy quyền của người kiến tạo thành tựu lớn, làm chủ tài chính và quản trị tổ chức.',
    lifePathMeaning: 'Đường Đời 8 là hành trình làm chủ sức mạnh cá nhân, quản trị nguồn lực tài chính và kiến tạo sự thịnh vượng bền vững cho xã hội.',
    expressionMeaning: 'Sứ Mệnh 8 có tầm nhìn kinh doanh sắc bén, tư duy chiến lược quy mô lớn và bản lĩnh vượt qua mọi áp lực cạnh tranh.',
    soulMeaning: 'Linh Hồn 8 khao khát thành tựu vượt bậc, tự do tài chính hoàn toàn và được nắm quyền kiểm soát vận mệnh của chính mình.',
    strengths: ['Tầm nhìn kinh doanh sắc bén, tư duy tài chính', 'Bản lĩnh kiên cường, không gục ngã trước thất bại', 'Khả năng điều phối và lãnh đạo tổ chức lớn'],
    weaknesses: ['Dễ bị cuốn vào vòng xoáy vật chất danh vọng', 'Đôi khi thực dụng và lạnh lùng', 'Căng thẳng cao độ do áp lực thành công']
  },
  9: {
    title: 'Số 9 - Người Khai Sáng & Phụng Sự Nhân Đạo Toàn Cầu',
    shortHook: 'Năng lượng của lòng trắc ẩn bao la, tinh thần nhân văn và sứ mệnh cống hiến cho nhân loại.',
    lifePathMeaning: 'Đường Đời 9 có mục đích phụng sự cộng đồng, lan tỏa tình yêu thương nhân loại và dẫn dắt sự tiến hóa nhận thức xã hội.',
    expressionMeaning: 'Sứ Mệnh 9 mang tầm nhìn nhân văn vĩ đại, năng khiếu giáo dục, truyền cảm hứng và sáng tạo nghệ thuật tầm cỡ.',
    soulMeaning: 'Linh Hồn 9 tìm kiếm ý nghĩa cuộc sống qua việc cống hiến, giúp đỡ người yếu thế và để lại di sản tốt đẹp cho thế hệ mai sau.',
    strengths: ['Trái tim nhân hậu, vị tha, không phân biệt', 'Tầm nhìn rộng lớn, truyền cảm hứng mạnh mẽ', 'Tài năng nghệ thuật và giáo dục nhân bản'],
    weaknesses: ['Dễ thất vọng khi thực tế không như lý tưởng', 'Khó buông bỏ những tổn thương quá khứ', 'Đôi khi quá rộng lượng đến mức bị lợi dụng']
  },
  11: {
    title: 'Số Master 11 - Bậc Thầy Trực Giác & Ngọn Hải Đăng Soi Đường',
    shortHook: 'Tần số rung động tâm linh cao quý, trực giác thiên phú và năng lực khai mở tâm thức.',
    lifePathMeaning: 'Đường Đời 11 là cây cầu kết nối giữa thế giới tinh thần và thực tại, có sứ mệnh truyền cảm hứng thức tỉnh cho tha nhân.',
    expressionMeaning: 'Sứ Mệnh 11 sở hữu trực giác nhạy bén xuất chúng, khả năng cảm nhận trước các quy luật vô hình và tài năng nghệ thuật biểu cảm cao.',
    soulMeaning: 'Linh Hồn 11 khao khát chân lý tâm linh thuần khiết, sự hòa hợp tâm thức và hướng về những giá trị thánh thiện cao đẹp.',
    strengths: ['Trực giác tâm linh siêu nhạy bén', 'Khả năng đánh thức tiềm năng con người', 'Tâm hồn trong sáng, hướng thiện'],
    weaknesses: ['Dễ căng thẳng thần kinh và quá tải cảm xúc', 'Hay tự nghi ngờ bản thân', 'Khó hòa nhập với cuộc sống thực tế']
  },
  22: {
    title: 'Số Master 22 - Bậc Thầy Kiến Tạo & Hiện Thực Hóa Giấc Mơ Vĩ Đại',
    shortHook: 'Sự kết hợp phi thường giữa tầm nhìn toàn cầu và năng lực thực thi quy mô khổng lồ.',
    lifePathMeaning: 'Đường Đời 22 sinh ra để xây dựng những công trình, hệ thống, tổ chức vĩ đại phục vụ cho sự phát triển của hàng triệu người.',
    expressionMeaning: 'Sứ Mệnh 22 biến những giấc mơ không tưởng thành hiện thực nhờ khả năng quản trị chiến lược và năng lực tổ chức xuất chúng.',
    soulMeaning: 'Linh Hồn 22 khát khao để lại một công trình trường tồn cùng thời gian mang lại lợi ích thiết thực cho nhân loại.',
    strengths: ['Tầm nhìn vĩ đại kết hợp thực thi xuất sắc', 'Khả năng quản trị dự án quy mô khổng lồ', 'Tinh thần cống hiến bền bỉ phi thường'],
    weaknesses: ['Áp lực trách nhiệm đè nặng lên vai', 'Dễ độc đoán khi mọi việc chậm tiến độ', 'Khó tìm người cộng sự cùng tần số']
  },
  33: {
    title: 'Số Master 33 - Bậc Thầy Chữa Lành & Tình Yêu Vô Điều Kiện',
    shortHook: 'Tần số rung động đỉnh cao của tình yêu thương thuần khiết, chữa lành và nâng tầm ý thức cộng đồng.',
    lifePathMeaning: 'Đường Đời 33 mang sứ mệnh nâng đỡ những tâm hồn đau khổ, phụng sự nhân sinh bằng lòng từ bi và trí tuệ bao la.',
    expressionMeaning: 'Sứ Mệnh 33 sở hữu năng lực chuyển hóa nỗi đau qua lời nói, giáo dục nhân bản và khả năng chữa lành tâm lý sâu sắc.',
    soulMeaning: 'Linh Hồn 33 tìm thấy sự viên mãn tuyệt đối khi được hy sinh, cống hiến và lan tỏa tình yêu thương vô điều kiện đến muôn loài.',
    strengths: ['Năng lượng chữa lành tâm hồn mạnh mẽ', 'Sự hy sinh và cống hiến vô tư', 'Lời nói có sức mạnh xoa dịu nỗi đau'],
    weaknesses: ['Dễ bị kiệt quệ do gánh vác nỗi đau thế gian', 'Khó chấp nhận sự bất công thực tế', 'Hay quên đi nhu cầu bản thân']
  }
};

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

function reduceNumber(num: number, keepMaster = true): number {
  if (keepMaster && (num === 11 || num === 22 || num === 33)) return num;
  let current = num;
  while (current > 9) {
    if (keepMaster && (current === 11 || current === 22 || current === 33)) return current;
    current = current.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (keepMaster && (current === 11 || current === 22 || current === 33)) return current;
  }
  return current;
}

function getFinalTwoDigitBreakdown(rawSum: number, keepMaster = true): { value: number; breakdown: string } {
  // Số Master 11, 22, 33: KHÔNG hiển thị tổng 2 số ở lượt cộng cuối
  if (keepMaster && (rawSum === 11 || rawSum === 22 || rawSum === 33)) {
    return { value: rawSum, breakdown: '' };
  }

  let current = rawSum;
  if (current < 10) {
    return { value: current, breakdown: '' };
  }

  let lastAddition = '';
  while (current > 9) {
    if (keepMaster && (current === 11 || current === 22 || current === 33)) {
      return { value: current, breakdown: '' };
    }
    const digits = current.toString().split('').map(d => parseInt(d, 10));
    
    // Nếu phép cộng chứa số 0 (ví dụ 10 -> 1+0, 20 -> 2+0, 30 -> 3+0...) thì KHÔNG hiển thị breakdown
    if (digits.includes(0)) {
      lastAddition = '';
    } else {
      lastAddition = digits.join('+');
    }

    current = digits.reduce((sum, d) => sum + d, 0);
  }

  if (keepMaster && (current === 11 || current === 22 || current === 33)) {
    return { value: current, breakdown: '' };
  }

  return {
    value: current,
    breakdown: lastAddition ? `(${lastAddition})` : '',
  };
}

function getWordBreakdown(word: string): { totalSum: number; reduced: number; vowelSum: number; vowelReduced: number; consonantSum: number; consonantReduced: number } {
  const cleanWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  let totalSum = 0;
  let vowelSum = 0;
  let consonantSum = 0;

  for (let i = 0; i < cleanWord.length; i++) {
    const char = cleanWord[i];
    const val = PYTHAGOREAN_MAP[char] || 0;
    totalSum += val;

    let isVowel = VOWELS.has(char);
    // Special treatment for Y
    if (char === 'Y') {
      if (i === 0) isVowel = false;
      else {
        const prevChar = cleanWord[i - 1];
        isVowel = !VOWELS.has(prevChar);
      }
    }

    if (isVowel) {
      vowelSum += val;
    } else {
      consonantSum += val;
    }
  }

  return {
    totalSum,
    reduced: reduceNumber(totalSum, true),
    vowelSum,
    vowelReduced: reduceNumber(vowelSum, true),
    consonantSum,
    consonantReduced: reduceNumber(consonantSum, true),
  };
}

export function generateDynamicBreakdowns(fullName: string, dob: string) {
  let day = 1, month = 1, year = 1990;
  if (dob.includes('-')) {
    const p = dob.split('-');
    if (p[0].length === 4) {
      year = parseInt(p[0], 10);
      month = parseInt(p[1], 10);
      day = parseInt(p[2], 10);
    } else {
      day = parseInt(p[0], 10);
      month = parseInt(p[1], 10);
      year = parseInt(p[2], 10);
    }
  } else if (dob.includes('/')) {
    const p = dob.split('/');
    day = parseInt(p[0], 10);
    month = parseInt(p[1], 10);
    year = parseInt(p[2], 10);
  }

  const dR = reduceNumber(day, true);
  const mR = reduceNumber(month, true);
  const yR = reduceNumber(year, true);
  const rawLp = dR + mR + yR;
  const lpVal = reduceNumber(rawLp, true);

  // Life Path step breakdown string
  const dayStr = day > 9 ? `${day} (${day.toString().split('').join('+')}=${dR})` : `${day}`;
  const monthStr = month < 10 ? `0${month} (${month})` : `${month} (${mR})`;
  const yearSum1 = year.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const yearStr = `${year} (${year.toString().split('').join('+')}=${yearSum1}${yearSum1 > 9 ? '->' + yR : ''})`;
  const lpBreakdownStr = `Ngày sinh ${dob} -> Ngày ${dayStr} + Tháng ${monthStr} + Năm ${yearStr} => ${dR} + ${mR} + ${yR} = ${rawLp}${rawLp !== lpVal ? ' -> ' + lpVal : ''}`;

  // Words breakdown for Expression
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const wordCalculations = words.map(w => {
    const info = getWordBreakdown(w);
    return {
      word: w,
      reduced: info.reduced,
      totalSum: info.totalSum,
      vowelReduced: info.vowelReduced,
      consonantReduced: info.consonantReduced,
    };
  });

  const wordsExprStr = wordCalculations.map(w => `${w.word} (${w.reduced})`).join(' + ');
  const wordsSums = wordCalculations.map(w => w.reduced).join(' + ');
  const rawExpSum = wordCalculations.reduce((a, b) => a + b.reduced, 0);
  const expVal = reduceNumber(rawExpSum, true);
  const expBreakdownStr = `Họ tên ${convertViToEn(fullName).toUpperCase()} -> Phân tích từng từ: ${wordsExprStr} => ${wordsSums} = ${rawExpSum}${rawExpSum !== expVal ? ' -> ' + expVal : ''}`;

  // Rational thought breakdown: Birthday reduced (dR) + First Name reduced
  const firstNameCalc = wordCalculations[wordCalculations.length - 1] || { word: 'Tên', reduced: 1 };
  const rawRat = dR + firstNameCalc.reduced;
  const ratVal = reduceNumber(rawRat, true);
  const ratBreakdownStr = `Ngày sinh rút gọn (${dR}) + Tên gọi "${firstNameCalc.word}" (${firstNameCalc.reduced}) => ${dR} + ${firstNameCalc.reduced} = ${rawRat}${rawRat !== ratVal ? ' -> ' + ratVal : ''}`;

  // Challenges & Pinnacles calculations
  const r_three = reduceNumber(year, false);
  const r_one = reduceNumber(month, false);
  const r_two = reduceNumber(day, false);
  const lpIgnoreMaster = reduceNumber(r_three + r_one + r_two, false);

  const c1 = Math.abs(r_one - r_two);
  const c2 = Math.abs(r_two - r_three);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(r_three - r_one);

  const p1 = reduceNumber(r_one + r_two, false);
  const p2 = reduceNumber(r_two + r_three, false);
  const p3 = reduceNumber(p1 + p2, false);
  const p4 = reduceNumber(reduceNumber(month, false) + reduceNumber(year, false), true);

  const age1 = 36 - lpIgnoreMaster;
  const age2 = age1 + 9;
  const age3 = age2 + 9;
  const age4 = age3 + 9;

  // Karmic debt detection:
  const debtNumbers = [13, 14, 16, 19];
  const detectedDebts: number[] = [];
  if (debtNumbers.includes(day)) detectedDebts.push(day);
  if (debtNumbers.includes(rawLp)) detectedDebts.push(rawLp);
  if (debtNumbers.includes(rawExpSum)) detectedDebts.push(rawExpSum);

  const uniqueDebts = Array.from(new Set(detectedDebts));

  return {
    day, month, year, dR, mR, yR,
    lpVal,
    expVal,
    lpBreakdownStr,
    expBreakdownStr,
    ratBreakdownStr,
    uniqueDebts,
    pinnacles: [p1, p2, p3, p4],
    challenges: [c1, c2, c3, c4],
    ages: [age1, age2, age3, age4],
    pyramidSummary: `Đỉnh 1 (Tháng+Ngày: ${r_one}+${r_two}=${p1}, tuổi ${age1}) → Đỉnh 2 (Ngày+Năm: ${r_two}+${r_three}=${p2}, tuổi ${age2}) → Đỉnh 3 (Đỉnh1+Đỉnh2: ${p1}+${p2}=${p3}, tuổi ${age3}) → Đỉnh 4 (Tháng+Năm: ${r_one}+${r_three}=${p4}, tuổi ${age4}+)`
  };
}

export function calculateNumerologyMap(fullName: string, dob: string) {
  let day = 1, month = 1, year = 1990;
  if (dob.includes('-')) {
    const p = dob.split('-');
    if (p[0].length === 4) {
      year = parseInt(p[0], 10);
      month = parseInt(p[1], 10);
      day = parseInt(p[2], 10);
    } else {
      day = parseInt(p[0], 10);
      month = parseInt(p[1], 10);
      year = parseInt(p[2], 10);
    }
  } else if (dob.includes('/')) {
    const p = dob.split('/');
    day = parseInt(p[0], 10);
    month = parseInt(p[1], 10);
    year = parseInt(p[2], 10);
  }

  // 1. ĐƯỜNG ĐỜI (LIFE PATH)
  const dR = reduceNumber(day, true);
  const mR = reduceNumber(month, true);
  const yR = reduceNumber(year, true);
  const rawLp = dR + mR + yR;
  const lpObj = getFinalTwoDigitBreakdown(rawLp, true);

  // 2. SỨ MỆNH (EXPRESSION), LINH HỒN, NHÂN CÁCH
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const wordDetails = words.map(getWordBreakdown);

  // Expression: Tổng các từ rút gọn
  const expComponents = wordDetails.map(w => w.reduced);
  const expSum = expComponents.reduce((a, b) => a + b, 0);
  const expObj = getFinalTwoDigitBreakdown(expSum, true);

  // Heart Desire: Tổng nguyên âm
  const hdComponents = wordDetails.map(w => w.vowelReduced).filter(v => v > 0);
  const hdSum = hdComponents.reduce((a, b) => a + b, 0);
  const hdObj = getFinalTwoDigitBreakdown(hdSum, true);

  // Personality: Tổng phụ âm
  const perComponents = wordDetails.map(w => w.consonantReduced).filter(v => v > 0);
  const perSum = perComponents.reduce((a, b) => a + b, 0);
  const perObj = getFinalTwoDigitBreakdown(perSum, true);

  // Balance (Cân bằng)
  const firstLetters = words.map(w => {
    const clean = w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
    return clean[0] || '';
  }).filter(Boolean);
  const balComponents = firstLetters.map(c => PYTHAGOREAN_MAP[c] || 0);
  const balSum = balComponents.reduce((a, b) => a + b, 0);
  const balObj = getFinalTwoDigitBreakdown(balSum, true);

  // Ngày sinh, Thái độ, Trưởng thành, Tư duy lý trí
  const birthdayObj = getFinalTwoDigitBreakdown(day, true);
  const attObj = getFinalTwoDigitBreakdown(dR + mR, true);

  const firstNameDetails = wordDetails[wordDetails.length - 1] || { reduced: 1 };
  const ratObj = getFinalTwoDigitBreakdown(dR + firstNameDetails.reduced, true);

  const matObj = getFinalTwoDigitBreakdown(lpObj.value + expObj.value, true);

  const currentYear = new Date().getFullYear();
  const personalYear = reduceNumber(dR + mR + reduceNumber(currentYear, false), false);

  // Karmic lessons
  const cleanAllChars = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  const presentDigits = new Set(cleanAllChars.split('').map(c => PYTHAGOREAN_MAP[c]));
  const missingDigits: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!presentDigits.has(d)) missingDigits.push(d);
  }

  // Karmic debts detection: 13, 14, 16, 19
  const debtNumbers = [13, 14, 16, 19];
  const detectedDebts: number[] = [];
  if (debtNumbers.includes(day)) detectedDebts.push(day);
  if (debtNumbers.includes(rawLp)) detectedDebts.push(rawLp);
  if (debtNumbers.includes(expSum)) detectedDebts.push(expSum);
  if (debtNumbers.includes(hdSum)) detectedDebts.push(hdSum);
  if (debtNumbers.includes(perSum)) detectedDebts.push(perSum);
  const uniqueDebts = Array.from(new Set(detectedDebts));

  return {
    life_path: lpObj.value,
    expression: expObj.value,
    heart_desire: hdObj.value,
    personality: perObj.value,
    birthday: birthdayObj.value,
    attitude: attObj.value,
    balance: balObj.value,
    maturity: matObj.value,
    rational_thought: ratObj.value,
    personal_year_current: personalYear,
    karmic_lessons: missingDigits,
    karmic_debts: uniqueDebts,
    lpe_bridge: Math.abs(reduceNumber(lpObj.value, false) - reduceNumber(expObj.value, false)),
    hdp_bridge: Math.abs(reduceNumber(hdObj.value, false) - reduceNumber(perObj.value, false)),
    breakdowns: {
      life_path: lpObj.breakdown,
      expression: expObj.breakdown,
      heart_desire: hdObj.breakdown,
      personality: perObj.breakdown,
      attitude: attObj.breakdown,
      balance: balObj.breakdown,
      maturity: matObj.breakdown,
      rational_thought: ratObj.breakdown,
      birthday: birthdayObj.breakdown,
    }
  };
}

export function generate3LayerNumerologyData(customer: any) {
  const firstName = customer?.first_name || '';
  const lastName = customer?.last_name || '';
  let rawFullName = `${lastName} ${firstName}`.trim();
  if (!rawFullName) {
    rawFullName = customer?.full_name || customer?.name || 'Bạn';
  }
  const fullName = formatTitleCase(rawFullName);
  const dob = customer?.dob || '01/01/1990';

  // Luôn tính toán bản đồ chính xác thời gian thực theo chuẩn Pythagorean Indicator
  const calculatedMap = calculateNumerologyMap(fullName, dob);

  const lp = calculatedMap.life_path;
  const exp = calculatedMap.expression;
  const hd = calculatedMap.heart_desire;
  const personality = calculatedMap.personality;
  const balance = calculatedMap.balance;
  const birthday = calculatedMap.birthday;
  const maturity = calculatedMap.maturity;
  const attitude = calculatedMap.attitude;
  const rationalThought = calculatedMap.rational_thought;
  const subconsciousConfidence = 9 - (calculatedMap.karmic_lessons?.length || 0);
  const py = calculatedMap.personal_year_current;

  const breakdowns = calculatedMap.breakdowns;
  const gender = customer?.gender === 'female' ? 'Nữ' : customer?.gender === 'male' ? 'Nam' : 'Khác';

  // TÍNH TOÁN DYNAMIC BREAKDOWN 100% CHO HỌ TÊN VÀ NGÀY SINH CỤ THỂ
  const dynamicBreakdowns = generateDynamicBreakdowns(fullName, dob);

  // TÍNH TOÁN SƠ ĐỒ KIM TỰ THÁP (4 ĐỈNH CAO & 4 THÁCH THỨC)
  const pyramidData = calculatePyramidDetails(customer?.dob || '01/01/1990', lp);

  // TÍNH TOÁN TIMELINE NGẮN HẠN (NĂM, THÁNG & 7 NGÀY CÁ NHÂN)
  const shortTermTimeline = calculateTimelineDetails(customer?.dob || '01/01/1990', py);

  // Calculate age group
  let age = 30;
  if (dob) {
    const parts = dob.replace(/-/g, '/').split('/');
    if (parts.length === 3) {
      const birthYear = parseInt(parts[2], 10);
      if (!isNaN(birthYear)) {
        age = new Date().getFullYear() - birthYear;
      }
    }
  }

  let ageGroupText = '';
  let ageGroupRole = '';
  if (age < 15) {
    ageGroupText = `Giai đoạn thiếu nhi (${age} tuổi)`;
    ageGroupRole = `Giúp cha mẹ thấu hiểu sâu sắc tố chất, tâm lý và định hướng nuôi dạy tiềm năng cho bé.`;
  } else if (age <= 25) {
    ageGroupText = `Giai đoạn tuổi trẻ & Học tập (${age} tuổi)`;
    ageGroupRole = `Tập trung vào phát triển năng khiếu, học vấn, khám phá bản sắc cá nhân và định hướng sự nghiệp khởi đầu.`;
  } else if (age <= 55) {
    ageGroupText = `Giai đoạn Trưởng thành & Sự nghiệp (${age} tuổi)`;
    ageGroupRole = `Tập trung bứt phá công việc, quản trị tài chính, gắn kết mối quan hệ tình cảm, gia đình và thấu hiểu cha mẹ.`;
  } else {
    ageGroupText = `Giai đoạn Chiêm nghiệm & Hoàn thiện (${age} tuổi)`;
    ageGroupRole = `Tập trung giải tỏa các điểm nghẽn cuộc sống, chuyển hóa bài học quá khứ, truyền dạy di sản và hướng về sự bình an nội tâm.`;
  }

  const lpData = NUMBER_SPECIFIC_MEANINGS[lp] || NUMBER_SPECIFIC_MEANINGS[1];
  const expData = NUMBER_SPECIFIC_MEANINGS[exp] || NUMBER_SPECIFIC_MEANINGS[1];
  const hdData = NUMBER_SPECIFIC_MEANINGS[hd] || NUMBER_SPECIFIC_MEANINGS[1];

  // TẦNG 1: Ý nghĩa 3 con số dẫn đường (Tam Giác Vàng - Guest)
  const layer1 = {
    life_path: {
      ...INDICATOR_DEFINITIONS.life_path,
      userNumber: lp,
      breakdown: breakdowns.life_path,
      hook: lpData.shortHook,
    },
    expression: {
      ...INDICATOR_DEFINITIONS.expression,
      userNumber: exp,
      breakdown: breakdowns.expression,
      hook: expData.shortHook,
    },
    heart_desire: {
      ...INDICATOR_DEFINITIONS.heart_desire,
      userNumber: hd,
      breakdown: breakdowns.heart_desire,
      hook: hdData.shortHook,
    }
  };

  // Hidden passion calculation: find digit 1..9 with maximum occurrences in name
  const nameDigits = convertViToEn(fullName).toUpperCase().replace(/[^A-Z]/g, '').split('').map(c => PYTHAGOREAN_MAP[c]).filter(Boolean);
  const digitCounts: Record<number, number> = {};
  nameDigits.forEach(d => { digitCounts[d] = (digitCounts[d] || 0) + 1; });
  let maxCount = 0;
  let hiddenPassionDigit = 1;
  for (let d = 1; d <= 9; d++) {
    if ((digitCounts[d] || 0) > maxCount) {
      maxCount = digitCounts[d];
      hiddenPassionDigit = d;
    }
  }

  // 21 INDICATOR ITEMS DÀNH CHO TAB 2 (GRID 21 THẺ VỚI BREAKDOWN HỢP THÀNH)
  const grid21Indicators = [
    { id: 'lp', number: `${lp}`, breakdown: breakdowns.life_path, title: 'ĐƯỜNG ĐỜI', desc: 'Số phận, sức mạnh và nét đặc biệt trong tính cách của bạn. Những trở ngại bạn có thể gặp phải để hoàn thành bài học.' },
    { id: 'bal', number: `${balance}`, breakdown: breakdowns.balance, title: 'CÂN BẰNG', desc: 'Cách bạn đối diện với vấn đề và nghịch cảnh.' },
    { id: 'exp', number: `${exp}`, breakdown: breakdowns.expression, title: 'SỨ MỆNH', desc: 'La bàn dẫn lối giúp bạn hoàn thành sứ mệnh và mang lại những giá trị to lớn cho cuộc đời.' },
    { id: 'lpe', number: `${calculatedMap.lpe_bridge}`, breakdown: '', title: 'LIÊN KẾT ĐƯỜNG ĐỜI – SỨ MỆNH', desc: 'Việc bạn cần làm để tốt nghiệp bài học cuộc đời và thực hiện sứ mệnh.' },
    { id: 'hd', number: `${hd}`, breakdown: breakdowns.heart_desire, title: 'LINH HỒN', desc: 'Khao khát ẩn giấu trong tâm hồn, lý do phía sau mọi hành động của bạn.' },
    { id: 'dob', number: `${birthday}`, breakdown: breakdowns.birthday, title: 'NGÀY SINH', desc: 'Những đặc điểm, lĩnh vực chuyên môn hoặc kỹ năng bạn cần phát triển và sẽ thành công nếu muốn gắn bó cả đời với chúng.' },
    { id: 'per', number: `${personality}`, breakdown: breakdowns.personality, title: 'NHÂN CÁCH', desc: 'Cá tính, thế giới quan, các mối quan hệ và các vấn đề trong cách bạn đối nhân xử thế.' },
    { id: 'hdp', number: `${calculatedMap.hdp_bridge}`, breakdown: '', title: 'LIÊN KẾT LINH HỒN – NHÂN CÁCH', desc: 'Cầu nối liên kết cách nhìn của bạn về bản thân và hình ảnh của bạn trong mắt người khác.' },
    { id: 'mat', number: `${maturity}`, breakdown: breakdowns.maturity, title: 'TRƯỞNG THÀNH', desc: 'Con người, giá trị, khát vọng, mục tiêu của bạn trong thời kỳ "vàng son" từ 30 – 40 tuổi.' },
    { id: 'att', number: `${attitude}`, breakdown: breakdowns.attitude, title: 'THÁI ĐỘ', desc: 'Mô tả thái độ và cách bạn nhìn nhận các tình huống hằng ngày.' },
    { id: 'kar', number: (calculatedMap.karmic_lessons && calculatedMap.karmic_lessons.length > 0) ? calculatedMap.karmic_lessons.join(', ') : 'Không khuyết', breakdown: '', title: 'THIẾU', desc: 'Nhóm số không xuất hiện trong chuỗi chữ cái họ tên (kỹ năng mềm cần chú tâm rèn luyện).' },
    { id: 'les', number: (calculatedMap.karmic_debts && calculatedMap.karmic_debts.length > 0) ? calculatedMap.karmic_debts.join(', ') : 'Không có', breakdown: '', title: 'BÀI HỌC NỢ', desc: 'Các bài học thử thách kỷ luật và bản lĩnh thực thi cần vượt qua.' },
    { id: 'rat', number: `${rationalThought}`, breakdown: breakdowns.rational_thought, title: 'TƯ DUY LÝ TRÍ', desc: 'Lối tư duy và hướng ra quyết định của bạn.' },
    { id: 'sub', number: `${subconsciousConfidence}/9`, breakdown: '', title: 'SỨC MẠNH TIỀM THỨC', desc: 'Độ đa dạng của nguồn lực phản xạ vô thức khi đối diện áp lực.' },
    { id: 'pas', number: `${hiddenPassionDigit}`, breakdown: '', title: 'ĐAM MÊ', desc: 'Con số xuất hiện nhiều nhất trong tên, nguồn cảm hứng và niềm vui tự nhiên.' },
    { id: 'py', number: `${calculatedMap.personal_year_current || '6'}`, breakdown: '', title: 'NĂM CÁ NHÂN', desc: 'Dòng chảy năng lượng năm hiện tại và nhịp điệu phát triển.' },
    { id: 'pm', number: `${((calculatedMap.personal_year_current + new Date().getMonth()) % 9) + 1 || '7'}`, breakdown: '', title: 'THÁNG CÁ NHÂN', desc: 'Trọng tâm công việc trong tháng hiện tại.' },
    { id: 'pin', number: pyramidData.pinnacle.join(', '), breakdown: '', title: 'CHẶNG', desc: '4 đỉnh cao thành tựu tương ứng với 4 chặng trưởng thành.' },
    { id: 'pd', number: `${((calculatedMap.personal_year_current + 2) % 9) || 8}`, breakdown: '', title: 'NGÀY CÁ NHÂN', desc: 'Nhịp thở hành vi trong ngày tham chiếu.' },
    { id: 'gen', number: `${reduceNumber(yearFromDob(customer?.dob) || 6, false)}`, breakdown: '', title: 'THẾ HỆ', desc: 'Bối cảnh thời đại và xu hướng phát triển chung.' },
    { id: 'cha', number: pyramidData.challenge.join(', '), breakdown: '', title: 'THÁCH THỨC', desc: '4 bài học thử thách cần vượt qua ở từng chặng kim tự tháp.' }
  ];


  // TẦNG 2: Ý nghĩa chi tiết 21 con số
  const layer2 = {
    overviewTitle: `Life Map 21 Chỉ Số Của ${fullName}`,
    lifePathAnalysis: {
      number: lp,
      title: lpData.title,
      content: lpData.lifePathMeaning,
      strengths: lpData.strengths,
      weaknesses: lpData.weaknesses,
    },
    expressionAnalysis: {
      number: exp,
      title: expData.title,
      content: expData.expressionMeaning,
    },
    heartDesireAnalysis: {
      number: hd,
      title: hdData.title,
      content: hdData.soulMeaning,
    },
    indicatorsGrid: grid21Indicators
  };

  // 10 CHỦ ĐỀ CUỘC SỐNG (LIFE FOCUS TOPICS)
  const LIFE_FOCUS_DEFINITIONS: Record<string, { title: string; icon: string; coreConcern: string; coachGuidance: (num: number, lp: number) => string }> = {
    money: {
      title: 'Tiền Bạc & Quản Trị Tài Chính',
      icon: '💰',
      coreConcern: 'Làm chủ dòng tiền, khai mở tiềm năng kiếm tiền độc lập, hóa giải các lỗ hổng tài chính và đầu tư bền vững.',
      coachGuidance: (num, lp) => `Với Đường Đời ${lp} và năng lượng tài chính của bạn, chìa khóa thịnh vượng nằm ở việc thiết lập kỷ luật dòng tiền, không chạy theo các cơ hội làm giàu nhanh nhiều rủi ro. Hãy ưu tiên gia tăng giá trị chuyên môn cốt lõi và tích lũy tài sản mang tính dòng tiền ổn định.`
    },
    love: {
      title: 'Tình Yêu & Hôn Nhân',
      icon: '❤️',
      coreConcern: 'Hóa giải xung đột cảm xúc, nâng cao sự thấu cảm, tìm kiếm đối tác tương hợp và xây dựng hôn nhân hòa hợp.',
      coachGuidance: (num, lp) => `Trong tình yêu, Đường Đời ${lp} cần học cách hạ bớt kỳ vọng áp đặt lên người bạn đời và mở lòng chia sẻ những tổn thương nội tâm. Sự lắng nghe tích cực và tôn trọng không gian riêng của nhau chính là liều thuốc chữa lành mọi khoảng cách.`
    },
    career: {
      title: 'Công Việc & Thăng Tiến Sự Nghiệp',
      icon: '💼',
      coreConcern: 'Tìm kiếm môi trường làm việc đúng sở trường, định vị thương hiệu cá nhân, bứt phá lên vị trí quản trị lãnh đạo.',
      coachGuidance: (num, lp) => `Môi trường nghề nghiệp lý tưởng cho Đường Đời ${lp} là nơi tôn trọng sự tự chủ, sáng tạo và trao quyền thực thi. Bạn hãy tập trung xây dựng năng lực chuyên gia độc bản và rèn luyện kỹ năng truyền cảm hứng dẫn dắt đội ngũ.`
    },
    family: {
      title: 'Gia Đình & Con Cái',
      icon: '🏡',
      coreConcern: 'Gắn kết các thế hệ trong gia đình, đồng hành nuôi dạy con cái thuận theo tố chất tự nhiên và giữ lửa mái ấm.',
      coachGuidance: (num, lp) => `Gia đình là điểm tựa tinh thần quan trọng nhất của bạn. Hãy kiên nhẫn đồng hành cùng con cái theo đúng thiên hướng bẩm sinh của con thay vì áp đặt khuôn mẫu của cha mẹ. Dành thời gian chất lượng hàng tuần để trò chuyện sâu cùng người thân.`
    },
    health: {
      title: 'Sức Khỏe & Cân Bằng Thân - Tâm',
      icon: '🌿',
      coreConcern: 'Giải tỏa căng thẳng thần kinh, kiểm soát áp lực công việc, tái tạo năng lượng và cân bằng thể chất - tinh thần.',
      coachGuidance: (num, lp) => `Năng lượng số ${lp} rất dễ bị quá tải thần kinh khi đặt mục tiêu quá cao. Bạn cần thiết lập ranh giới rõ ràng giữa công việc và thời gian nghỉ ngơi, duy trì thói quen tập thể thao nhẹ, thư giãn hoặc hòa mình vào thiên nhiên mỗi ngày.`
    },
    destiny: {
      title: 'Vận Hạn & Đón Đầu Cơ Hội',
      icon: '🔮',
      coreConcern: 'Dự báo các khúc quanh vận mệnh, phòng ngừa rủi ro bất ngờ và chủ động đón đầu cơ hội phát triển.',
      coachGuidance: (num, lp) => `Vận trình của bạn trong chu kỳ hiện tại đòi hỏi tư duy chủ động thích ứng và quản trị nguồn lực linh hoạt. Khi gặp chặng thử thách, hãy xem đó là cơ hội để tôi luyện bản lĩnh; khi gặp đỉnh cao, hãy khiêm nhường nắm bắt và chia sẻ thành quả với cộng đồng.`
    },
    property: {
      title: 'Nhà Cửa & Tài Sản Bất Động Sản',
      icon: '🏛️',
      coreConcern: 'An cư lạc nghiệp, gia tăng tài sản cố định, chọn thời điểm mua bán nhà đất thuận lợi và tạo dựng không gian sống an lành.',
      coachGuidance: (num, lp) => `Quyết định nhà cửa của bạn nên được thực hiện vào các năm cá nhân có tính tích lũy nền tảng (như Năm cá nhân 4 hoặc 8). Chú trọng tính pháp lý minh bạch và công năng thực tế hơn là yếu tố phô trương.`
    },
    learning: {
      title: 'Học Hành, Thi Cử & Phát Triển Bản Thân',
      icon: '📚',
      coreConcern: 'Nâng cao năng lực chuyên môn, vượt qua các kỳ thi sát hạch quan trọng, mở rộng vốn tri thức và khai sáng tư duy.',
      coachGuidance: (num, lp) => `Bạn sở hữu khả năng tự học và đào sâu vấn đề rất tốt. Hãy lập kế hoạch học tập có trọng tâm, chọn lọc các khóa học chuyên sâu từ những người thầy thực chiến thay vì phân tán vào nhiều lĩnh vực cùng lúc.`
    },
    overseas: {
      title: 'Xuất Ngoại, Định Cư & Đi Xa',
      icon: '✈️',
      coreConcern: 'Mở rộng cơ hội ra thị trường quốc tế, du học, định cư nước ngoài, thích nghi môi trường đa văn hóa.',
      coachGuidance: (num, lp) => `Năng lượng số của bạn có sự nhạy bén với các nền văn hóa mới. Khi đi xa hoặc xuất ngoại, hãy chuẩn bị kỹ lưỡng về ngoại ngữ, tìm hiểu pháp luật bản địa và giữ vững bản sắc văn hóa cội nguồn để tự tin hội nhập.`
    },
    legacy: {
      title: 'Hậu Vận & An Yên Tuổi Già',
      icon: '🌅',
      coreConcern: 'Lập kế hoạch tài chính hưu trí, chăm sóc sức khỏe dài hạn, nơi an cư và duy trì cuộc sống an nhiên, tự chủ.',
      coachGuidance: (num, lp) => `Giai đoạn hậu vận và tuổi già đòi hỏi sự chuẩn bị chu đáo về cả ba trụ cột: tài chính hưu trí độc lập, quỹ y tế dự phòng và mạng lưới gắn kết tình cảm gia đình. Hãy chủ động lập kế hoạch từ sớm để duy trì sự an tâm, tự chủ và an nhiên.`
    }
  };

  // TẦNG 3: BÁO CÁO LUẬN GIẢI ĐA CHIỀU 5 CHƯƠNG CHUẨN LIFE COACH ICF (DYNAMIC SYNTHESIS)
  const currentWorldYear = new Date().getFullYear();
  const worldYearNumber = reduceNumber(currentWorldYear, false);
  const currentWorldMonth = new Date().getMonth() + 1;
  const worldMonthNumber = reduceNumber(worldYearNumber + currentWorldMonth, false);

  // Đọc danh sách focus topics người dùng chọn (mặc định lấy Tiền bạc, Sự nghiệp, Tình cảm nếu chưa chọn)
  const selectedFocusKeys: string[] = (customer?.life_focus && Array.isArray(customer.life_focus) && customer.life_focus.length > 0)
    ? customer.life_focus.slice(0, 3)
    : ['career', 'money', 'love'];

  const focusedTopicDetails = selectedFocusKeys.map(key => {
    const def = LIFE_FOCUS_DEFINITIONS[key] || LIFE_FOCUS_DEFINITIONS.career;
    return {
      key,
      title: def.title,
      icon: def.icon,
      coreConcern: def.coreConcern,
      guidance: def.coachGuidance(exp, lp),
    };
  });

  // TRÍCH XUẤT ĐẦY ĐỦ DỮ LIỆU TẦNG 2 TỪ KNOWLEDGE BASE 252 BẢN GHI
  const lifePathKnowledge = getIndicatorKnowledge('life_path', lp);
  const expressionKnowledge = getIndicatorKnowledge('expression', exp);
  const lpeKnowledge = getIndicatorKnowledge('soul_bridge', calculatedMap.lpe_bridge || 2);
  const heartDesireKnowledge = getIndicatorKnowledge('heart_desire', hd);
  const personalityKnowledge = getIndicatorKnowledge('personality', personality);
  const hdpKnowledge = getIndicatorKnowledge('personality_bridge', calculatedMap.hdp_bridge || 1);
  const birthdayKnowledge = getIndicatorKnowledge('birthday', birthday);
  const rationalThoughtKnowledge = getIndicatorKnowledge('rational_thought', rationalThought);
  const attitudeKnowledge = getIndicatorKnowledge('attitude', attitude);
  const balanceKnowledge = getIndicatorKnowledge('balance', balance);
  const maturityKnowledge = getIndicatorKnowledge('maturity', maturity);
  const subconsciousKnowledge = getIndicatorKnowledge('subconscious_confidence', subconsciousConfidence);
  const generationKnowledge = getIndicatorKnowledge('generation', reduceNumber(yearFromDob(customer?.dob) || 6, false));
  const currentCalMonth = new Date().getMonth() + 1;
  const currentCalDay = new Date().getDate();
  const pMonth = reduceNumber(py + currentCalMonth, false);
  const pDay = reduceNumber(pMonth + currentCalDay, false);
  const personalYearKnowledge = getIndicatorKnowledge('personal_year', py);
  const personalMonthKnowledge = getIndicatorKnowledge('personal_month', pMonth);
  const personalDayKnowledge = getIndicatorKnowledge('personal_day', pDay);
  const karmicLessonsKnowledge = getIndicatorKnowledge('karmic_lessons', (calculatedMap.karmic_lessons && calculatedMap.karmic_lessons[0]) || 1);
  const hasKarmicDebt = dynamicBreakdowns.uniqueDebts && dynamicBreakdowns.uniqueDebts.length > 0;
  const karmicDebtKnowledge = hasKarmicDebt
    ? getIndicatorKnowledge('karmic_debt', dynamicBreakdowns.uniqueDebts[0])
    : null;
  const challengesKnowledge = getIndicatorKnowledge('challenges', pyramidData.challenge[0] || 1);
  const pinnaclesKnowledge = getIndicatorKnowledge('pinnacles', pyramidData.pinnacle[0] || 1);

  // TỔNG HỢP THEO BỐ CỤC CHUẨN DOCS/PROMPT.MD
  const promptStructuredReport: any = {
    // # BỨC TRANH TỔNG QUAN
    overview: {
      title: 'Bức Tranh Tổng Quan Vận Mệnh',
      highlights: [
        `Trường năng lượng chủ đạo: Đường Đời ${lp} kết hợp cùng Sứ Mệnh ${exp} tạo nên bản sắc độc bản của ${fullName}.`,
        `Thế giới nội tâm: Linh Hồn ${hd} thôi thúc khát vọng sâu kín, được biểu đạt ra bên ngoài qua Nhân Cách ${personality}.`,
        `Năng lực hành động: Ngày Sinh ${birthday} và Tư Duy Lý Trí ${rationalThought} giúp bạn ra quyết định độc lập, thực tế.`,
        `Giai đoạn hiện tại: Năm Cá Nhân ${py} trong dòng chảy Năm Thế Giới ${worldYearNumber} là thời điểm vàng để tái định hình mục tiêu.`
      ],
      basisIndicators: `Căn cứ phân tích: Đường Đời (${lp}), Sứ Mệnh (${exp}), Linh Hồn (${hd}), Nhân Cách (${personality}), Năm Cá Nhân (${py}), Kim Tự Tháp 4 Đỉnh Cao.`,
      centralStrength: `Điểm mạnh trung tâm của bạn là khả năng kết hợp giữa tầm nhìn sứ mệnh (${expData.title}) và sự kiên trì vượt khó (${lpData.title}).`,
      tensionToHarmonize: `Sự căng kéo cần dung hòa: Nhu cầu an toàn nội tâm của Linh Hồn ${hd} và yêu cầu bứt phá, gánh vác trách nhiệm bên ngoài của Đường Đời ${lp}.`
    },

    // # BẢN ĐỒ BẢN THÂN
    selfMap: {
      title: 'Bản Đồ Bản Thân',
      // ## Con đường và sứ mệnh
      pathAndDestiny: {
        title: 'Con Đường Và Sứ Mệnh',
        synthesis: `Đường Đời ${lp} và Sứ Mệnh ${exp} là trục xương sống của toàn bộ biểu đồ. Nếu Đường Đời ${lp} cho bạn biết bài học lớn nhất cần vượt qua và môi trường lý tưởng để phát triển, thì Sứ Mệnh ${exp} chính là công cụ và phương thức hành động để bạn tạo ra giá trị bền vững cho xã hội. Cầu nối Liên kết Đường Đời – Sứ Mệnh (${calculatedMap.lpe_bridge || 2}) giúp bạn hóa giải mọi mâu thuẫn giữa "điều cuộc đời đòi hỏi" và "khả năng tự nhiên của bạn".`,
        lifePath: lifePathKnowledge,
        expression: expressionKnowledge,
        bridge: lpeKnowledge,
      },
      // ## Nhu cầu bên trong và hình ảnh bên ngoài
      innerAndOuter: {
        title: 'Nhu Cầu Bên Trong Và Hình Ảnh Bên Ngoài',
        synthesis: `Linh Hồn ${hd} là tiếng nói thầm kín bên trong tâm khảm—lý do thực sự đằng sau mọi quyết định và cảm xúc thỏa mãn hay bất an của bạn. Trong khi đó, Nhân Cách ${personality} là tấm áo giáp và phong thái xã hội mà mọi người xung quanh nhìn nhận về bạn. Cầu nối Linh Hồn – Nhân Cách (${calculatedMap.hdp_bridge || 1}) là kim chỉ nam giúp bạn thể hiện chân thật con người mình mà không bị hiểu lầm hay kiệt sức tâm lý.`,
        heartDesire: heartDesireKnowledge,
        personality: personalityKnowledge,
        bridge: hdpKnowledge,
      },
      // ## Năng lực vận hành
      operatingCapacity: {
        title: 'Năng Lực Vận Hành & Phản Xạ Hành Vi',
        synthesis: `Tập hợp Ngày Sinh ${birthday}, Tư Duy Lý Trí ${rationalThought}, Đam Mê 5, Thái Độ ${attitude}, Sức Mạnh Tiềm Thức ${subconsciousConfidence}/9 và Thế Hệ ${reduceNumber(yearFromDob(customer?.dob) || 6, false)} tạo nên bộ công cụ vận hành hàng ngày của bạn. Đây là cách bạn xử lý áp lực, phong cách làm việc, tốc độ tiếp thu kiến thức và khả năng thích nghi với bối cảnh xã hội.`,
        birthday: birthdayKnowledge,
        rationalThought: rationalThoughtKnowledge,
        attitude: attitudeKnowledge,
        subconscious: subconsciousKnowledge,
        generation: generationKnowledge,
      }
    },

    // # BÀI HỌC PHÁT TRIỂN
    growthLessons: {
      title: 'Bài Học Phát Triển',
      // ## Điểm cần rèn luyện
      pointsToTrain: {
        title: 'Điểm Cần Rèn Luyện & Cơ Chế Phục Hồi',
        synthesis: `Chỉ số thiếu, Nợ bài học, Chỉ số Cân bằng ${balance} và các Thử thách không phải là khiếm khuyết vĩnh viễn, mà là những cơ hội rèn luyện có chủ đích. Khi gặp áp lực hay biến cố bất ngờ, Chỉ Số Cân Bằng ${balance} chính là chiếc mỏ neo giúp bạn giữ vững sự sáng suốt để tìm ra giải pháp tối ưu.`,
        karmicLessons: karmicLessonsKnowledge,
        karmicDebt: karmicDebtKnowledge,
        balance: balanceKnowledge,
        challenges: challengesKnowledge,
      },
      // ## Hướng trưởng thành dài hạn
      longTermGrowth: {
        title: 'Hướng Trưởng Thành Dài Hạn & Đỉnh Cao Vận Trình',
        synthesis: `Chỉ số Trưởng Thành ${maturity} là con số kết tinh những bài học lớn, bắt đầu phát huy mạnh mẽ từ độ tuổi 30-40. Kết hợp cùng sơ đồ Kim Tự Tháp 4 đỉnh cao thành tựu, đây là lộ trình giúp bạn định vị di sản lâu dài và gặt hái thành công bền vững.`,
        maturity: maturityKnowledge,
        pinnacles: pinnaclesKnowledge,
        pyramidData,
      }
    },

    // # TRỌNG TÂM HIỆN TẠI
    currentFocus: {
      title: 'Trọng Tâm Hiện Tại & Nhịp Điệu Thời Gian',
      synthesis: `Năm Cá Nhân ${py}, Tháng Cá Nhân ${((py + new Date().getMonth()) % 9) + 1} và Ngày Cá Nhân ${((py + 2) % 9) || 8} cùng dòng chảy Năm Thế Giới ${worldYearNumber} tạo nên nhịp thở hành động ở hiện tại. Đây là khung tham chiếu giúp bạn tổ chức công việc và phân bổ năng lượng hợp lý, không phải là dự báo chắc chắn về sự kiện cố định.`,
      personalYear: personalYearKnowledge,
      personalMonth: personalMonthKnowledge,
      personalDay: personalDayKnowledge,
      worldYear: worldYearNumber,
      worldMonth: worldMonthNumber,
    },

    // # MINH BẠCH CÔNG THỨC & DỮ LIỆU ĐẦU VÀO (TRANSPARENCY TABLE)
    transparencyTable: {
      title: 'Bảng Minh Bạch Dữ Liệu Đầu Vào & Công Thức Tính Toán 21 Chỉ Số',
      fullName,
      normalizedName: convertViToEn(fullName).toUpperCase(),
      dob: dob,
      gender: gender || 'Nam',
      referenceDate: '17/08/2026',
      pythagoreanRule: 'Bảng quy đổi chữ cái Pythagoras Quốc tế: A,J,S=1 | B,K,T=2 | C,L,U=3 | D,M,V=4 | E,N,W=5 | F,O,X=6 | G,P,Y=7 | H,Q,Z=8 | I,R=9',
      lifePathBreakdown: dynamicBreakdowns.lpBreakdownStr,
      expressionBreakdown: dynamicBreakdowns.expBreakdownStr,
      indicators: [
        { name: 'Đường Đời (Life Path)', value: lp, formula: 'Rút gọn (Ngày + Tháng + Năm sinh)', source: 'Ngày sinh', meaning: 'Con đường vận mệnh và bài học lớn nhất' },
        { name: 'Sứ Mệnh (Expression)', value: exp, formula: 'Tổng tất cả chữ cái họ tên quy đổi', source: 'Họ tên khai sinh', meaning: 'Kho tàng năng lực và phương tiện hành động' },
        { name: 'Linh Hồn (Soul Urge)', value: hd, formula: 'Tổng các nguyên âm trong họ tên', source: 'Họ tên khai sinh', meaning: 'Động lực thầm kín và nhu cầu thỏa nguyện nội tâm' },
        { name: 'Nhân Cách (Personality)', value: personality, formula: 'Tổng các phụ âm trong họ tên', source: 'Họ tên khai sinh', meaning: 'Hình ảnh xã hội và phong thái bên ngoài' },
        { name: 'Cầu Nối ĐĐ – SM (LPE Bridge)', value: calculatedMap.lpe_bridge, formula: '|Đường Đời - Sứ Mệnh|', source: 'ĐĐ & SM', meaning: 'Hóa giải xung đột giữa bổn phận và sở trường' },
        { name: 'Cầu Nối LH – NC (HDP Bridge)', value: calculatedMap.hdp_bridge, formula: '|Linh Hồn - Nhân Cách|', source: 'LH & NC', meaning: 'Hợp nhất thế giới nội tâm và biểu hiện xã hội' },
        { name: 'Ngày Sinh (Birthday)', value: birthday, formula: 'Rút gọn ngày sinh', source: 'Ngày sinh', meaning: 'Tài năng thực chiến và phẩm chất thiên bẩm' },
        { name: 'Tư Duy Lý Trí (Rational Thought)', value: rationalThought, formula: dynamicBreakdowns.ratBreakdownStr, source: 'Ngày sinh & Tên', meaning: 'Phong cách tư duy và cơ chế ra quyết định' },
        { name: 'Thái Độ (Attitude)', value: attitude, formula: 'Rút gọn (Ngày + Tháng sinh)', source: 'Ngày & Tháng sinh', meaning: 'Phản xạ tức thì khi đối diện với biến cố' },
        { name: 'Cân Bằng (Balance)', value: balance, formula: 'Tổng chữ cái đầu mỗi từ trong tên', source: 'Họ tên', meaning: 'Điểm tựa phục hồi và lấy lại bình tĩnh' },
        { name: 'Sức Mạnh Tiềm Thức (Subconscious)', value: `${subconsciousConfidence}/9`, formula: '9 - (Số lượng chỉ số thiếu)', source: 'Họ tên', meaning: 'Độ đa dạng nguồn lực phản xạ vô thức' },
        { name: 'Chỉ Số Thiếu (Nhóm số không xuất hiện trong họ tên)', value: (calculatedMap.karmic_lessons && calculatedMap.karmic_lessons.length > 0) ? calculatedMap.karmic_lessons.join(', ') : 'Không khuyết', formula: 'Các số 1-9 không có trong chuỗi chữ cái họ tên', source: 'Họ tên khai sinh', meaning: 'Kỹ năng mềm cần chú tâm rèn luyện có chủ đích (Không suy ra từ ngày sinh và không phủ định các chỉ số khác)' },
        { name: 'Nợ Bài Học (Karmic Debt)', value: dynamicBreakdowns.uniqueDebts.length > 0 ? dynamicBreakdowns.uniqueDebts.map(d => d + '/' + (d === 13 ? 4 : d === 14 ? 5 : d === 16 ? 7 : 1)).join(', ') : 'Không có nợ bài học', formula: 'Cấu phần tổng hợp số 13, 14, 16, 19 trong ngày sinh và họ tên', source: 'Ngày sinh & Họ tên', meaning: dynamicBreakdowns.uniqueDebts.length > 0 ? 'Bài học tôi luyện tính kỷ luật và kiên trì' : 'Biểu đồ không xuất hiện cấu phần nợ bài học (13/4, 14/5, 16/7, 19/1)' },
        { name: 'Trưởng Thành (Maturity)', value: maturity, formula: 'Rút gọn (Đường Đời + Sứ Mệnh)', source: 'ĐĐ & SM', meaning: 'Năng lực chín muồi phát huy mạnh mẽ sau tuổi 35–40' },
        { name: 'Đam Mê Ẩn Giấu (Hidden Passion)', value: grid21Indicators.find(i=>i.id==='pas')?.number || '5', formula: 'Số xuất hiện nhiều nhất trong tên', source: 'Họ tên', meaning: 'Nguồn cảm hứng và năng lượng nhiệt huyết tự nhiên' },
        { name: 'Thế Hệ (Generation)', value: reduceNumber(yearFromDob(customer?.dob) || 6, false), formula: 'Rút gọn năm sinh', source: 'Năm sinh', meaning: 'Bối cảnh thời đại và xu hướng phát triển chung' },
        { name: 'Năm Cá Nhân (Personal Year)', value: py, formula: `Rút gọn (Ngày + Tháng sinh + Năm ${currentWorldYear})`, source: `Năm ${currentWorldYear}`, meaning: `Dòng chảy năng lượng năm hiện tại (Tham chiếu ${currentWorldYear})` },
        { name: 'Chu Kỳ Lịch Cá Nhân (Tháng & Ngày)', value: 'Tích hợp gói Coach', formula: 'Lịch Năng Lượng 30 Ngày chuyên sâu', source: 'Module Coach VIP', meaning: 'Chu kỳ Tháng & Ngày Cá Nhân được tối ưu riêng trong tính năng Lịch Năng Lượng Cá Nhân' },
        { name: '4 Đỉnh Cao Kim Tự Tháp (Pinnacles)', value: dynamicBreakdowns.pinnacles.join(' → '), formula: dynamicBreakdowns.pyramidSummary, source: 'Ngày sinh', meaning: `Cột mốc thành tựu 4 chặng: 0–${pyramidData.age[0]}, ${pyramidData.age[0]+1}–${pyramidData.age[1]}, ${pyramidData.age[1]+1}–${pyramidData.age[2]}, ${pyramidData.age[2]+1}+ tuổi` },
        { name: '4 Thách Thức Kim Tự Tháp (Challenges)', value: dynamicBreakdowns.challenges.join(' → '), formula: 'Thách thức 1 (|Tháng-Ngày|) → TT 2 (|Ngày-Năm|) → TT 3 (|TT1-TT2|) → TT 4 (|Tháng-Năm|)', source: 'Ngày sinh', meaning: 'Bài học thử thách cần vượt qua ở từng chặng kim tự tháp' },
      ]
    },

    // # GIẢI PHÁP CHO VẤN ĐỀ QUAN TÂM
    solutionsForConcerns: {
      title: 'Giải Pháp Chuyên Sâu Cho Các Vấn Đề Trọng Tâm',
      topics: selectedFocusKeys.map(key => {
        const def = LIFE_FOCUS_DEFINITIONS[key] || LIFE_FOCUS_DEFINITIONS.career;
        const dueDiligence = (key === 'legacy' || key === 'retirement')
          ? DOMAIN_DUE_DILIGENCE_CHECKLISTS.retirement
          : (key === 'property' || key === 'home')
          ? DOMAIN_DUE_DILIGENCE_CHECKLISTS.real_estate
          : (key === 'health')
          ? DOMAIN_DUE_DILIGENCE_CHECKLISTS.health
          : (key === 'love' || key === 'family')
          ? DOMAIN_DUE_DILIGENCE_CHECKLISTS.relationships
          : (key === 'career' || key === 'learning')
          ? DOMAIN_DUE_DILIGENCE_CHECKLISTS.career
          : DOMAIN_DUE_DILIGENCE_CHECKLISTS.money;

        return {
          id: key,
          title: def.title,
          icon: def.icon,
          coreConcern: def.coreConcern,
          disclaimer: dueDiligence.disclaimer,
          checklist: dueDiligence.checklist,
          quantitativeMetrics: dueDiligence.quantitativeMetrics,
          trendFromChart: `Xu hướng từ biểu đồ: Năng lượng Đường Đời ${lp} và Sứ Mệnh ${exp} cho thấy bạn thường có xu hướng xử lý vấn đề ${def.title.toLowerCase()} theo hướng tự chủ, đòi hỏi tính minh bạch và kết quả thực tế cao.`,
          internalResources: `Nguồn lực nội tại: Khả năng phân tích độc lập từ Tư Duy Lý Trí ${rationalThought} và điểm tựa phục hồi từ Cân Bằng ${balance}.`,
          blindSpotsAndRisks: `Rủi ro & điểm mù: Tránh phản ứng vội vã khi mất kiên nhẫn hoặc tự tạo áp lực cầu toàn quá mức lên bản thân và cộng sự.`,
          action7Days: `Kế hoạch 7 ngày: Dành 20 phút rà soát thực trạng hiện tại của ${def.title.toLowerCase()}, hoàn thành ít nhất 2 mục trong checklist thẩm định thực tế.`,
          action30Days: `Kế hoạch 30 ngày: ${def.coachGuidance(exp, lp)}`,
          action90Days: `Kế hoạch 90 ngày: Thiết lập hệ thống theo dõi tiến độ định kỳ mỗi tuần, đánh giá theo các chỉ số định lượng cụ thể và điều chỉnh chiến lược linh hoạt.`,
          progressMetric: `Chỉ số đo lường định lượng: ${dueDiligence.quantitativeMetrics.join(' • ')}`,
          whenToSeekExpert: `Khi nào nên tìm chuyên gia: Nếu bạn nhận thấy bản thân rơi vào trạng thái bế tắc kéo dài trên 60 ngày hoặc các quyết định có tính chất pháp lý/tài chính lớn, hãy chủ động tham vấn luật sư, chuyên gia tài chính hoặc bác sĩ/chuyên gia tâm lý có chứng chỉ chuyên môn.`
        };
      })
    },

    // # KẾ HOẠCH ƯU TIÊN
    priorityPlan: {
      title: 'Kế Hoạch Ưu Tiên Chuyển Hóa',
      priorities: [
        {
          action: `Tối ưu hóa năng lực lãnh đạo và tự chủ của Đường Đời ${lp}.`,
          frequencyOrDeadline: 'Thực hiện hàng ngày trong 30 ngày tới.',
          completionCriteria: 'Hoàn tất ít nhất 1 mục tiêu chiến lược tồn đọng lâu ngày.',
          recoveryStrategy: 'Nếu bị gián đoạn, quay lại với bài tập tĩnh tâm 10 phút và chia nhỏ mục tiêu thành các bước vi mô.'
        },
        {
          action: `Rèn luyện kỹ năng truyền thông và hợp tác theo Sứ Mệnh ${exp}.`,
          frequencyOrDeadline: '2-3 lần mỗi tuần trong các buổi họp hoặc giao tiếp quan trọng.',
          completionCriteria: 'Lắng nghe chủ động và nhận được phản hồi tích cực từ đồng nghiệp/đối tác.',
          recoveryStrategy: 'Ghi lại nhật ký giao tiếp sau mỗi sự cố để rút ra bài học cải thiện.'
        },
        {
          action: `Duy trì kỷ luật phục hồi cảm xúc theo Chỉ Số Cân Bằng ${balance}.`,
          frequencyOrDeadline: 'Mỗi tối trước khi đi ngủ (15 phút).',
          completionCriteria: 'Ghi nhận 3 điều biết ơn và đánh giá chỉ số năng lượng thân - tâm.',
          recoveryStrategy: 'Thiết lập chuông báo cố định trên điện thoại để duy trì thói quen.'
        }
      ]
    },

    // # LỜI KẾT
    closingRemark: {
      title: 'Lời Kết: Khai Phóng Bản Lĩnh Vận Mệnh',
      content: `Bản đồ 21 chỉ số Thần số học Pythagoras là tấm gương phản chiếu những tần số rung động và tiềm năng bẩm sinh bên trong bạn, không phải là một bản án định sẵn. Tương lai của bạn được tạo nên từ những lựa chọn tỉnh thức, môi trường bạn rèn luyện và những hành động kỷ luật lặp lại mỗi ngày. Bạn là người kiến tạo duy nhất và vĩ đại nhất của cuộc đời mình!`
    },

    // # CÂU HỎI LÀM RÕ
    clarifyingQuestions: [
      `1. Quyết định can đảm nhất mà bạn cần thực hiện ngay trong 7 ngày tới là gì?`,
      `2. Thói quen vô thức nào đang âm thầm tiêu tốn năng lượng và thời gian của bạn nhiều nhất?`,
      `3. Môi trường làm việc hiện tại đã tạo điều kiện tối đa cho bạn phát huy năng lượng Đường Đời ${lp} và Sứ Mệnh ${exp} chưa?`,
      `4. Bạn mong muốn đạt được thành tựu đột phá nào nhất trong chu kỳ Năm Cá Nhân ${py} này?`,
      `5. Điều gì khiến bạn cảm thấy bình an và tự hào nhất về bản thân trong giai đoạn này?`
    ]
  };

  const layer3 = {
    // THÔNG TIN BỐI CẢNH NHÂN KHẨU HỌC
    genderAgeAnalysis: {
      gender,
      ageGroupText,
      ageGroupRole,
      insights: `Với giới tính ${gender} ở ${ageGroupText}, góc nhìn suy nghĩ và cách phản ứng cảm xúc của ${fullName} được chi phối bởi trường năng lượng Đường Đời ${lp} kết hợp cùng Sứ Mệnh ${exp}. ${
        gender === 'Nữ'
          ? 'Năng lượng Nữ tính giúp bạn phát huy sự tinh tế, nuôi dưỡng mối quan hệ và trực giác nhạy bén.'
          : 'Năng lượng Nam tính giúp bạn gia tăng ý chí tiên phong, bản lĩnh gánh vác trách nhiệm và tư duy chiến lược.'
      } ${ageGroupRole}`
    },
    worldCycleAnalysis: {
      worldYearNumber,
      worldMonthNumber,
      personalYear: py,
      forecast: `Năm Thế Giới ${worldYearNumber} & Tháng Thế Giới ${worldMonthNumber} mang năng lượng chuyển dịch toàn cầu. Kết hợp với Năm Cá Nhân ${py} của bạn, đây là thời điểm chiến lược để bạn đón đầu cơ hội, tái cấu trúc mục tiêu và bứt phá mạnh mẽ.`
    },

    // BÁO CÁO CẤU TRÚC CHUẨN DOCS/PROMPT.MD
    structuredReport: promptStructuredReport,

    // TỔ HỢP 5 CHƯƠNG GIAO DIỆN
    chapters: {
      chapter1: {
        number: 1,
        title: 'Bức Tranh Tổng Quan & Hạt Nhân Bản Sắc (Core Identity)',
        subtitle: 'Giải mã bản đồ linh hồn, sứ mệnh vận mệnh và những xung đột nội tâm sâu kín nhất',
        sections: [
          {
            heading: '1.1. Ma Trận Hợp Nhất Đường Đời & Sứ Mệnh',
            content: `Bạn sở hữu Đường Đời ${lp}${breakdowns.life_path ? ` (tổng hòa từ cấu phần: ${breakdowns.life_path})` : ''} kết hợp cùng Sứ Mệnh ${exp}${breakdowns.expression ? ` (hợp thành từ các từ: ${breakdowns.expression})` : ''}.\n\nNếu Đường Đời ${lp} là môi trường và định hướng rèn luyện chính để bạn hoàn thiện năng lực bản thân, thì Sứ Mệnh ${exp} đại diện cho phương tiện hành động và bộ công cụ tự nhiên giúp bạn tạo ra kết quả thiết thực. ${
              (lp === 11 || lp === 22 || lp === 33 || exp === 11 || exp === 22 || exp === 33)
                ? `Sự xuất hiện của con số Master (${lp === 11 || exp === 11 ? '11' : lp === 22 || exp === 22 ? '22' : '33'}) mang đến tiềm năng phát triển tầm nhìn rộng mở, kết nối con người và khả năng tạo ảnh hưởng tích cực đến cộng đồng khi bạn kiên trì rèn luyện kỹ năng thực tế.`
                : `Sự kết hợp giữa ${lpData.title} và ${expData.title} tạo nên thế kiềng vững chắc giữa định hướng mục tiêu và năng lực thực thi bền bỉ.`
            }`
          },
          {
            heading: '1.2. Cầu Nối Đường Đời – Sứ Mệnh (LPE Bridge)',
            content: `Chỉ số Cầu Nối Đường Đời – Sứ Mệnh của bạn mang năng lượng số ${calculatedMap.lpe_bridge}. Đây là mắt xích then chốt giúp bạn tháo gỡ các xung đột giữa "yêu cầu của hoàn cảnh" và "sở trường tự nhiên của bạn". Khi bạn kích hoạt bài học của Cầu Nối ${calculatedMap.lpe_bridge}, các rào cản trì hoãn sẽ được giải phóng để bạn tối ưu hóa hiệu suất hành động.`
          },
          {
            heading: '1.3. Nhu Cầu Nội Tâm vs Phong Thái Bên Ngoài',
            content: `Chỉ số Linh Hồn ${hd}${breakdowns.heart_desire ? ` (${breakdowns.heart_desire})` : ''} thể hiện nhu cầu thỏa nguyện nội tâm: ${hdData.soulMeaning}.\n\nTrong khi đó, chỉ số Nhân Cách ${personality}${breakdowns.personality ? ` (${breakdowns.personality})` : ''} định hình phong thái xã hội mà mọi người xung quanh tiếp nhận về bạn. Cầu nối Linh Hồn – Nhân Cách (HDP Bridge: ${calculatedMap.hdp_bridge}) là kim chỉ nam giúp bạn thể hiện chân thật con người mình, giữ vững sự hài hòa giữa thế giới nội tâm và phong cách giao tiếp bên ngoài mà không bị áp lực cảm xúc.`
          }
        ],
        coachQuote: `“Thành công bền vững đến từ sự hiểu mình sâu sắc và can đảm kiên định phát triển thế mạnh độc bản của chính bạn.”`
      },

      chapter2: {
        number: 2,
        title: 'Bộ Công Cụ & Phản Xạ Hành Vi (Behavioral Arsenal)',
        subtitle: 'Khai phóng năng khiếu bẩm sinh, phương thức ra quyết định và nguồn lực phản xạ',
        sections: [
          {
            heading: '2.1. Năng Lực Bẩm Sinh Ngày Sinh & Tư Duy Lý Trí',
            content: `Ngày Sinh ${birthday}${breakdowns.birthday ? ` (${breakdowns.birthday})` : ''} trang bị cho bạn kỹ năng thực chiến sắc bén.\n\nKết hợp với Tư Duy Lý Trí ${rationalThought}${breakdowns.rational_thought ? ` (${breakdowns.rational_thought})` : ''}, bạn có phong cách phân tích dữ liệu một cách độc lập trước khi đưa ra quyết định quan trọng. Bạn luôn tìm kiếm những luận cứ thực tế thay vì cuốn theo cảm xúc nhất thời.`
          },
          {
            heading: '2.2. Phản Ứng Nghịch Cảnh: Thái Độ & Điểm Tựa Cân Bằng',
            content: `Thái Độ ${attitude} định hình phản xạ ban đầu của bạn trước các tình huống bất ngờ. Khi gặp áp lực, Chỉ Số Cân Bằng ${balance}${breakdowns.balance ? ` (${breakdowns.balance})` : ''} chính là điểm tựa giúp bạn giữ được sự bình tĩnh, sáng suốt và lấy lại thế chủ động để xử lý vấn đề hiệu quả.`
          },
          {
            heading: '2.3. Đam Mê Ẩn Giấu & Sức Mạnh Tiềm Thức',
            content: `Sức Mạnh Tiềm Thức đạt điểm số ${subconsciousConfidence}/9 (dựa trên mức độ đa dạng của các chữ số trong ma trận họ tên). Nguồn lực phản xạ vô thức này kết hợp với Đam Mê ${grid21Indicators.find(i=>i.id==='pas')?.number || '5'} là nguồn cảm hứng giúp bạn duy trì năng lượng và sự hứng khởi trong công việc.`
          }
        ],
        coachQuote: `“Khi bạn thấu hiểu cơ chế tư duy của chính mình, mọi thách thức đều trở thành cơ hội tôi luyện bản lĩnh vững vàng.”`
      },

      chapter3: {
        number: 3,
        title: 'Điểm Mù, Vùng Trũng & Nợ Bài Học (Shadow & Growth)',
        subtitle: 'Nhận diện các khuôn mẫu lặp lại, vùng cần hoàn thiện và chìa khóa chuyển hóa',
        sections: [
          {
            heading: '3.1. Nhóm Số Khuyết Trong Họ Tên (Chỉ Số Thiếu - Karmic Lessons)',
            content: calculatedMap.karmic_lessons && calculatedMap.karmic_lessons.length > 0
              ? `Họ tên khai sinh của bạn không chứa các chữ cái mang giá trị [${calculatedMap.karmic_lessons.join(', ')}]. Trong hệ quy chiếu Thần số học Pythagoras, đây là nhóm kỹ năng mềm cần sự chú tâm rèn luyện có chủ đích qua học tập và trải nghiệm thực tế. Chỉ số này phản ánh chủ đề cần vun bồi, hoàn toàn không suy ra từ ngày sinh và không mâu thuẫn hay phủ định các chỉ số khác.`
              : `Tuyệt vời! Chuỗi chữ cái họ tên của bạn bao quát đầy đủ các số từ 1 đến 9, mang lại sự đa dạng tự nhiên trong các phản xạ thích ứng. Bạn thuận lợi tập trung phát triển sâu thế mạnh cốt lõi của Đường Đời ${lp}.`
          },
          {
            heading: '3.2. Kiểm Tra Cấu Phần Nợ Bài Học (Karmic Debt 13/4, 14/5, 16/7, 19/1)',
            content: hasKarmicDebt
              ? `Bản đồ của bạn xuất hiện cấu phần Nợ Bài Học [${dynamicBreakdowns.uniqueDebts.map((d: number) => d + '/' + (d === 13 ? 4 : d === 14 ? 5 : d === 16 ? 7 : 1)).join(', ')}]. Đây là lời nhắc nhở về việc duy trì tính kỷ luật tự thân, sự kiên trì và tránh đi đường tắt để xây dựng thành tựu bền vững.`
              : `Bản đồ của bạn KHÔNG xuất hiện các cấu phần Nợ Bài Học trọng yếu (13/4, 14/5, 16/7, 19/1). Dòng năng lượng thực thi của bạn diễn ra thông suốt, không bị cản trở bởi các mô thức tắc nghẽn quá khứ. Hãy tập trung 100% nguồn lực vào việc rèn luyện các kỹ năng trong Chỉ Số Thiếu.`
          },
          {
            heading: '3.3. Năng Lượng Trưởng Thành (Maturity Number)',
            content: `Chỉ số Trưởng Thành ${maturity}${breakdowns.maturity ? ` (${breakdowns.maturity})` : ''} là năng lực chín muồi phát huy mạnh mẽ sau độ tuổi 35–40. Đây là giai đoạn bạn định hình rõ nét phong cách làm việc, giá trị cống hiến và những di sản bền vững muốn xây dựng.`
          },
          {
            heading: '3.4. Tần Số Thế Hệ (Generation Number)',
            content: `Con số Thế Hệ ${reduceNumber(yearFromDob(customer?.dob) || 6, false)} phản ánh bối cảnh thời đại và xu hướng phát triển chung. Hiểu được năng lượng này giúp bạn định vị bản thân phù hợp trước những chuyển dịch công nghệ và nghề nghiệp mới.`
          }
        ],
        coachQuote: `“Điểm mù không phải là hạn chế vĩnh viễn, mà là lời mời gọi để bạn hoàn thiện bản thân một cách trọn vẹn hơn.”`
      },

      chapter4: {
        number: 4,
        title: 'Vận Trình Chu Kỳ & Sơ Đồ Kim Tự Tháp Cuộc Đời',
        subtitle: 'Khám phá 4 đỉnh cao thành tựu, thách thức chặng đời và nhịp điệu thời gian',
        sections: [
          {
            heading: '4.1. Sơ Đồ Kim Tự Tháp 4 Đỉnh Cao & 4 Thách Thức',
            content: `Sơ đồ Kim Tự Tháp xác định 4 chặng thành tựu và bài học thử thách trong cuộc đời:\n• Đỉnh 1 (0 – ${pyramidData.age[0]} tuổi): Đỉnh cao số ${pyramidData.pinnacle[0]} (Thách thức ${pyramidData.challenge[0]})\n• Đỉnh 2 (${pyramidData.age[0] + 1} – ${pyramidData.age[1]} tuổi): Đỉnh cao số ${pyramidData.pinnacle[1]} (Thách thức ${pyramidData.challenge[1]})\n• Đỉnh 3 (${pyramidData.age[1] + 1} – ${pyramidData.age[2]} tuổi): Đỉnh cao số ${pyramidData.pinnacle[2]} (Thách thức ${pyramidData.challenge[2]})\n• Đỉnh 4 (${pyramidData.age[2] + 1}+ tuổi): Đỉnh cao số ${pyramidData.pinnacle[3]} (Thách thức ${pyramidData.challenge[3]})\n\nMỗi đỉnh cao mang lại cơ hội phát triển năng lực tương ứng khi bạn chủ động vượt qua bài học thử thách của từng giai đoạn.`
          },
          {
            heading: '4.2. Năm Cá Nhân Hiện Tại: Quản Trị Nhịp Điệu Phát Triển',
            content: `Năm nay bạn đang bước vào Năm Cá Nhân số ${py}. Đây là giai đoạn ${
              py === 1 ? 'Khởi đầu chu kỳ 9 năm mới, chủ động thiết lập những mục tiêu trọng tâm.'
              : py === 2 ? 'Hợp tác, lắng nghe, phát triển mối quan hệ và kiên nhẫn tích lũy nền tảng.'
              : py === 3 ? 'Mở rộng giao lưu, truyền cảm hứng, sáng tạo và nâng cao kỹ năng giao tiếp.'
              : py === 4 ? 'Xây dựng tính kỷ luật, củng cố quy trình làm việc và chăm sóc sức khỏe.'
              : py === 5 ? 'Thích ứng linh hoạt, mở rộng tầm nhìn và đón nhận cơ hội đổi mới.'
              : py === 6 ? 'Dành sự quan tâm cho gia đình, trách nhiệm và gắn kết người thân.'
              : py === 7 ? 'Nghiên cứu chuyên sâu, chiêm nghiệm và nâng cao năng lực chuyên môn.'
              : py === 8 ? 'Tập trung tối ưu hóa hiệu quả tài chính, khẳng định năng lực điều hành.'
              : 'Đánh giá, tinh gọn những quy trình không còn phù hợp và chuẩn bị cho chu kỳ phát triển mới.'
            }`
          },
          {
            heading: '4.3. Nhịp Thở Vi Mô: Tháng & 7 Ngày Cá Nhân',
            content: `Tháng cá nhân hiện tại kết hợp cùng chuỗi 7 ngày cá nhân giúp bạn tối ưu hóa năng suất làm việc: chọn ngày phù hợp để đàm phán, ký hợp đồng hoặc ngày thích hợp để nghỉ ngơi tái tạo năng lượng.`
          }
        ],
        coachQuote: `“Người thức thời là người biết khi nào nên tiến như vũ bão, khi nào nên dừng lại để mài sắc thanh gươm trí tuệ.”`
      },

      chapter5: {
        number: 5,
        title: 'Khai Vấn Trọng Tâm & Kế Hoạch Hành Động 30 Ngày',
        subtitle: 'Giải pháp chuyên sâu cho các vấn đề bạn đang trăn trở nhất và lộ trình thực thi chuyển hóa',
        focusedTopics: focusedTopicDetails,
        powerQuestions: [
          `1. Quyết định can đảm nhất mà bạn cần thực hiện ngay trong tuần này là gì?`,
          `2. Thói quen vô thức nào đang âm thầm tiêu tốn năng lượng và tiền bạc của bạn nhiều nhất?`,
          `3. Nếu không có nỗi sợ thất bại, bạn sẽ bắt tay vào dự án lớn nào ngay hôm nay?`
        ],
        thirtyDayRoadmap: [
          { week: 'Tuần 1: Nhận Diện & Thiết Lập Ranh Giới', focus: 'Tự quan sát các phản xạ vô thức, thanh lọc các mối quan hệ độc hại và ghi nhận nhật ký cảm xúc mỗi tối.' },
          { week: 'Tuần 2: Tối Ưu Hóa Nguồn Lực & Công Cụ', focus: `Ứng dụng triệt để thế mạnh Sứ Mệnh ${exp} vào công việc hàng ngày, tái cấu trúc bảng chi tiêu và thời gian biểu.` },
          { week: 'Tuần 3: Hóa Giải Điểm Nghẽn & Thách Thức', focus: 'Thực hành bài tập đối thoại thấu cảm, vượt qua sự trì hoãn và hoàn tất một mục tiêu tồn đọng lâu ngày.' },
          { week: 'Tuần 4: Thiết Lập Thói Quen Thịnh Vượng', focus: 'Đo lường các chỉ số tiến bộ, neo lại cảm xúc chiến thắng và xây dựng kế hoạch bứt phá cho 90 ngày tiếp theo.' }
        ],
        dailyMicroHabits: [
          `Dành 10 phút đầu ngày để tĩnh tâm, thiền định và hình dung rõ ràng mục tiêu trong ngày.`,
          `Ghi nhận ít nhất 3 điều biết ơn và 1 bài học tiến bộ trước khi đi ngủ.`,
          `Chủ động nói lời khích lệ chân thành với ít nhất 1 người đồng nghiệp hoặc người thân.`
        ],
        coachQuote: `“Mọi tri thức chỉ thực sự có giá trị khi được chuyển hóa thành hành động kỷ luật mỗi ngày. Cuộc đời bạn là một kiệt tác, hãy tự tay vẽ nên nó!”`
      }
    },

    // MA TRẬN TỔNG HỢP VÀ LỜI KHUYÊN HÀNH ĐỘNG
    crossSynthesis: `Phân Tích Tương Tác Ma Trận Đa Chiều:\n• Trường năng lượng chủ đạo: ${fullName} mang Đường Đời ${lp}${breakdowns.life_path ? ` (${breakdowns.life_path})` : ''} kết hợp cùng Sứ Mệnh ${exp}${breakdowns.expression ? ` (${breakdowns.expression})` : ''}.${
      (lp === 11 || lp === 22 || lp === 33 || exp === 11 || exp === 22 || exp === 33)
        ? ` Bạn sở hữu con số Master bậc thầy mang tần số rung động tâm thức cao, trách nhiệm xã hội và tầm nhìn kiến tạo vĩ mô vượt trội.`
        : ''
    }\n• Phân rã năng lượng cấu phần: Các con số thành phần [${breakdowns.expression || ''}] của họ tên bổ trợ nguồn lực đa dạng, giúp bạn linh hoạt kết hợp giữa trực giác và tư duy thực tế khi hành động.\n• Tiếng nói nội tâm: Chỉ số Linh Hồn ${hd}${breakdowns.heart_desire ? ` (${breakdowns.heart_desire})` : ''} nhắc nhở bạn rằng thành công bên ngoài chỉ thực sự trọn vẹn khi bạn thỏa mãn được khát khao bình an và ý nghĩa bên trong.`,
    challenges: {
      obstacles: `Thách thức chủ đạo: Cần vượt qua điểm yếu cố hữu của con số ${lp}, đặc biệt là: ${lpData.weaknesses.join(', ')}.`,
      karmicLessons: calculatedMap.karmic_lessons && calculatedMap.karmic_lessons.length > 0
        ? `Bài học nợ nghiệp cần hoàn tất: Con số [${calculatedMap.karmic_lessons.join(', ')}]. Hãy chú trọng rèn luyện tính kiên trì và kỷ luật tự thân.`
        : `Bản đồ của bạn không có Nợ nghiệp lớn, đây là một thuận duyên lớn giúp bạn phát triển bứt phá khi đi đúng hướng.`
    },
    actionRoadmap: {
      actionPlan: `1. Xác lập mục tiêu rõ ràng phù hợp với trường năng lượng số ${lp}.\n2. Tận dụng tối đa thế mạnh ngoại giao và công cụ của Sứ Mệnh ${exp}.\n3. Dành thời gian nuôi dưỡng tâm hồn theo nhu cầu số ${hd}.`,
      careerGuide: `Môi trường nghề nghiệp đỉnh cao dành cho ${fullName} là nơi tôn trọng sự tự chủ, sáng tạo và có lộ trình phát triển minh bạch.`,
      personalYear: `Năm Cá Nhân ${py}: Đây là giai đoạn chiến lược để bạn tái cấu trúc và đón đầu những vận hội mới!`
    }
  };

  return { layer1, layer2: { ...layer2, pyramidData, shortTermTimeline }, layer3 };
}

function reduceIgnoreMaster(num: number): number {
  let val = Math.floor(Number(num));
  if (isNaN(val)) return 0;
  let r = 0;
  for (const char of val.toString().split('')) {
    r += parseInt(char, 10);
  }
  while (r > 9) {
    const temp = r.toString().split('');
    r = 0;
    for (const char of temp) {
      r += parseInt(char, 10);
    }
  }
  return r;
}

function calculatePyramidDetails(dob: string, lifePath: number) {
  let day = 1, month = 1, year = 1990;
  const cleanDob = dob.replace(/-/g, '/');
  const parts = cleanDob.split('/');
  if (parts.length === 3) {
    day = parseInt(parts[0], 10) || 1;
    month = parseInt(parts[1], 10) || 1;
    year = parseInt(parts[2], 10) || 1990;
  }

  const r_month = reduceIgnoreMaster(month); // Root 1: Tháng
  const r_day = reduceIgnoreMaster(day);     // Root 2: Ngày
  const r_year = reduceIgnoreMaster(year);   // Root 3: Năm

  const lpReduced = reduceIgnoreMaster(r_month + r_day + r_year);

  // 4 Đỉnh Cao (Pinnacles)
  const p1 = reduceIgnoreMaster(r_month + r_day);
  const p2 = reduceIgnoreMaster(r_day + r_year);
  const p3 = reduceIgnoreMaster(p1 + p2);
  const p4 = reduceNumber(r_month + r_year, true);

  // 4 Thách Thức (Challenges)
  const c1 = Math.abs(r_month - r_day);
  const c2 = Math.abs(r_day - r_year);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(r_year - r_month);

  // 4 Tuổi chuyển chặng
  const age1 = 36 - lpReduced;
  const age2 = age1 + 9;
  const age3 = age2 + 9;
  const age4 = age3 + 9;

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;

  return {
    root: [r_month, r_day, r_year],
    pinnacle: [p1, p2, p3, p4],
    challenge: [c1, c2, c3, c4],
    age: [age1, age2, age3, age4],
    currentAge,
  };
}

function calculateTimelineDetails(dob: string, personalYear: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Tháng cá nhân hiện tại
  const personalMonth = reduceIgnoreMaster(personalYear + currentMonth);

  // 7 ngày quanh ngày hiện tại (-3 đến +3)
  const days = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const d = new Date(now.getTime() + offset * 86400000);
    const dNum = d.getDate();
    const mNum = d.getMonth() + 1;
    const isToday = offset === 0;

    // Ngày cá nhân cho ngày d
    const pDay = reduceIgnoreMaster(personalMonth + dNum);

    const weekdaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayOfWeek = isToday ? 'Hôm nay' : weekdaysVi[d.getDay()];

    return {
      offset,
      dayOfWeek,
      dateFormatted: `${dNum < 10 ? '0' + dNum : dNum}/${mNum < 10 ? '0' + mNum : mNum}`,
      dateNumber: dNum,
      monthNumber: mNum,
      personalDay: pDay,
      isToday,
    };
  });

  return {
    currentYear,
    personalYear,
    currentMonth,
    personalMonth,
    currentDay,
    personalDayToday: reduceIgnoreMaster(personalMonth + currentDay),
    days,
  };
}

function yearFromDob(dob?: string): number {
  if (!dob) return 1990;
  const parts = dob.replace(/-/g, '/').split('/');
  if (parts.length === 3) {
    const y = parseInt(parts[2], 10);
    return isNaN(y) ? 1990 : y;
  }
  return 1990;
}


