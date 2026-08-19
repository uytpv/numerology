// ============================================================================
// BỨC TRANH TỔNG HÒA BẢN THÂN (MULTI-INDICATOR SYNTHESIS ENGINE)
// Phân tích ma trận tương tác đa chiều giữa 21 chỉ số theo chuẩn Life Coach ICF
// ============================================================================

export interface MultiIndicatorSynthesis {
  executiveSummary: {
    coreStrengths: string[];
    internalTensions: string[];
    growthTheme: string;
    currentCycleStrategy: string;
  };
  strengths: {
    title: string;
    indicators: string;
    description: string;
  }[];
  tensions: {
    title: string;
    indicators: string;
    description: string;
    solution: string;
  }[];
  growthFocuses: {
    title: string;
    indicator: string;
    guidance: string;
  }[];
  currentYearFocus: {
    yearNumber: number;
    title: string;
    strategicTheme: string;
    actionPriorities: string[];
  };
}

// CẤU TRÚC TRỤ CỘT THÍCH ỨNG (ADAPTIVE PILLARS) CHO TỪNG NĂNG LƯỢNG SỐ
export interface AdaptivePillar {
  title: string;
  focus: string;
  keyInsight: string;
  actionGuidance: string;
}

export function getAdaptivePillarsForNumber(num: number, role: string): AdaptivePillar[] {
  switch (num) {
    case 8:
      return [
        {
          title: 'Lãnh Đạo & Tầm Nhìn Chiến Lược',
          focus: 'Khả năng bao quát bức tranh lớn và điều phối hệ thống',
          keyInsight: 'Thiên hướng nhìn nhận mọi vấn đề dưới góc độ quy mô, hiệu quả và tính khả thi dài hạn.',
          actionGuidance: 'Thiết lập mục tiêu theo quý với OKRs/KPIs rõ ràng; trao quyền thực thi chi tiết cho đội ngũ.'
        },
        {
          title: 'Quản Trị Nguồn Lực & Dòng Tiền',
          focus: 'Tối ưu hóa tài chính và đòn bẩy kinh doanh',
          keyInsight: 'Sự nhạy bén với các con số tài chính và khả năng định giá giá trị thương mại.',
          actionGuidance: 'Duy trì quỹ dự phòng 3–6 tháng chi phí vận hành; kiểm soát tỷ lệ nợ/thu nhập (DTI) dưới 35%.'
        },
        {
          title: 'Năng Lực Hiện Thực Hóa & Thực Thi',
          focus: 'Chuyển hóa kế hoạch thành kết quả thực tế',
          keyInsight: 'Sức bền và ý chí kiên định vượt qua các trở ngại trên thương trường.',
          actionGuidance: 'Ưu tiên giải quyết 20% đầu việc tạo ra 80% giá trị kết quả (Nguyên lý Pareto).'
        },
        {
          title: 'Quản Trị Áp Lực & Điểm Mù Quyền Lực',
          focus: 'Giữ cân bằng tâm lý và lắng nghe phản hồi',
          keyInsight: 'Nguy cơ quá tải hoặc độc đoán khi phải chịu trách nhiệm kết quả một mình.',
          actionGuidance: 'Dành 15 phút mỗi ngày đi bộ tĩnh tâm; duy trì cơ chế phản hồi 360 độ định kỳ từ cộng sự.'
        }
      ];
    case 7:
      return [
        {
          title: 'Thế Giới Nội Tâm & Chiêm Nghiệm',
          focus: 'Nhu cầu không gian riêng để tái tạo năng lượng',
          keyInsight: 'Xu hướng tự vấn, suy ngẫm sâu sắc và tìm kiếm ý nghĩa đằng sau mọi sự kiện.',
          actionGuidance: 'Bảo vệ các khối thời gian riêng tư (Time Blocking) 60–90 phút mỗi tuần để đọc sách và tĩnh tâm.'
        },
        {
          title: 'Khát Khao Tri Thức & Lập Luận Độc Lập',
          focus: 'Ưu tiên thông tin có thể kiểm chứng và nguyên lý cốt lõi',
          keyInsight: 'Không vội tin vào những bề nổi, chỉ hình thành niềm tin khi có căn cứ vững chắc.',
          actionGuidance: 'Đào sâu vào chuyên môn ngách; ghi chép nhật ký bài học sau mỗi dự án hoặc biến cố.'
        },
        {
          title: 'Xây Dựng Niềm Tin & Sự Gắn Kết',
          focus: 'Mở lòng và kết nối chân thành với vòng tròn tin cậy',
          keyInsight: 'Tiêu chuẩn cao có thể khiến bạn đôi khi giữ khoảng cách quá an toàn với người xung quanh.',
          actionGuidance: 'Chủ động chia sẻ suy nghĩ thật với 1–2 người đồng hành đáng tin cậy.'
        },
        {
          title: 'Chuyển Hóa Trí Tuệ Thành Hành Động Thực Tế',
          focus: 'Tránh rơi vào bẫy phân tích quá đà (Analysis Paralysis)',
          keyInsight: 'Nguy cơ trì hoãn hành động vì muốn mọi thứ phải đạt độ hoàn hảo về mặt lý thuyết.',
          actionGuidance: 'Áp dụng nguyên tắc "Thử nghiệm nhỏ - Hoàn thiện dần" (Agile Iteration).'
        }
      ];
    case 6:
      return [
        {
          title: 'Trách Nhiệm & Tâm Thế Phụng Sự',
          focus: 'Khát vọng che chở và mang lại bình an cho gia đình, cộng đồng',
          keyInsight: 'Động lực cống hiến lớn lao từ tình thương và tinh thần trách nhiệm với tập thể.',
          actionGuidance: 'Xác định rõ vai trò và phạm vi trách nhiệm; tránh gánh vác thay việc của người khác.'
        },
        {
          title: 'Xây Dựng Mái Ấm & Môi Trường Làm Việc Gắn Kết',
          focus: 'Kiến tạo không gian hài hòa, ấm áp và nâng đỡ tinh thần',
          keyInsight: 'Năng lực tạo dựng bầu không khí tin cậy và gắn kết nhân tâm xuất sắc.',
          actionGuidance: 'Tạo thói quen dùng bữa cơm gia đình không điện thoại ít nhất 4 buổi/tuần.'
        },
        {
          title: 'Nghệ Thuật Lắng Nghe & Ranh Giới Lành Mạnh',
          focus: 'Yêu thương đúng cách đi kèm sự tôn trọng quyền tự chủ của người khác',
          keyInsight: 'Nguy cơ áp đặt kỳ vọng hoàn hảo hoặc bao bọc quá mức dẫn đến mệt mỏi nội tâm.',
          actionGuidance: 'Thực hành lắng nghe 3 phút không phán xét; học cách từ chối khéo léo những yêu cầu vượt quá giới hạn.'
        },
        {
          title: 'Chăm Sóc Bản Thân (Self-Care) Để Nuôi Dưỡng Năng Lượng',
          focus: 'Duy trì sức khỏe thể chất và cảm xúc cá nhân',
          keyInsight: 'Bạn chỉ có thể chăm sóc người khác một cách bền vững khi chiếc bình năng lượng của chính mình đầy đủ.',
          actionGuidance: 'Lên lịch chăm sóc sức khỏe và giấc ngủ như một cam kết không thể hủy bỏ.'
        }
      ];
    default:
      return [
        {
          title: 'Định Hướng Chiến Lược & Bản Lĩnh Thực Thi',
          focus: `Phát huy tối đa thế mạnh năng lượng số ${num}`,
          keyInsight: `Khả năng tạo ra đột phá và định hình phong cách riêng theo vai trò ${role}.`,
          actionGuidance: 'Kiên trì theo đuổi các mục tiêu dài hạn với lộ trình rõ ràng.'
        },
        {
          title: 'Phát Triển Kỹ Năng Chuyên Môn & Mối Quan Hệ',
          focus: 'Nâng cao năng lực cạnh tranh cốt lõi',
          keyInsight: 'Sự phối hợp hài hòa giữa kiến thức và kỹ năng giao tiếp.',
          actionGuidance: 'Tham gia các khóa đào tạo nâng cao và mở rộng mạng lưới hợp tác.'
        },
        {
          title: 'Quản Trị Cảm Xúc & Cân Bằng Cuộc Sống',
          focus: 'Nuôi dưỡng trạng thái điềm tĩnh và chủ động',
          keyInsight: 'Nhận diện sớm các dấu hiệu căng thẳng để kịp thời điều chỉnh.',
          actionGuidance: 'Duy trì thói quen tập thể dục và nghỉ ngơi điều độ.'
        },
        {
          title: 'Kế Hoạch Rèn Luyện & Hành Động Trọng Tâm',
          focus: 'Chuyển hóa nhận thức thành thói quen hàng ngày',
          keyInsight: 'Sự tiến bộ bền vững đến từ kỷ luật thực thi mỗi ngày.',
          actionGuidance: 'Rà soát danh sách việc cần làm mỗi sáng và đánh giá kết quả vào cuối ngày.'
        }
      ];
  }
}

export function generateMultiIndicatorSynthesis(data: {
  fullName: string;
  birthDate: string;
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  attitude: number;
  karmicLessons: number[];
  challenges: number[];
  personalYear: number;
  rationalThought?: number;
  balance?: number;
  hiddenPassion?: number;
  maturity?: number;
}): MultiIndicatorSynthesis {
  const {
    lifePath,
    expression,
    soul,
    personality,
    attitude,
    karmicLessons = [],
    challenges = [],
    personalYear = 9,
    balance = soul,
    rationalThought = 1,
  } = data;

  // 1. TỔNG HÒA 3 THẾ MẠNH NỔI BẬT (INTERACTION MATRIX)
  const strengths = [];

  // Tổ hợp 1: Trục Thực Thi Chiến Lược (8 x 8 x 8 x 1)
  if ([8, 1, 4, 22].includes(lifePath) || [8, 1, 4, 22].includes(personality)) {
    strengths.push({
      title: 'Trục Thực Thi Chiến Lược & Bản Lĩnh Điều Hành (8 × 8 × 1)',
      indicators: `Đường Đời ${lifePath} + Nhân Cách ${personality} + Thái Độ ${attitude} + Tư Duy Lý Trí ${rationalThought}`,
      description: `Trong hệ quy chiếu Life Maps, sự hội tụ của số 8 ở Đường Đời, Nhân Cách và Thái Độ tạo nên một trục thực thi mạnh mẽ hiếm có: bạn có tầm nhìn chiến lược, phong thái ngoại giao đĩnh đạc và phản xạ chủ động gánh vác trách nhiệm khi có biến cố. Kết hợp cùng Tư Duy Lý Trí ${rationalThought}, bạn sở hữu năng lực ra quyết định tự chủ, độc lập và khả năng biến các ý tưởng trừu tượng thành kết quả thực tế đo lường được.`
    });
  } else {
    strengths.push({
      title: 'Khả Năng Thích Ứng & Tiên Phong Đổi Mới',
      indicators: `Đường Đời ${lifePath} + Nhân Cách ${personality}`,
      description: `Bạn sở hữu sự nhạy bén với cơ hội mới, phản xạ linh hoạt và tinh thần cầu tiến, giúp bạn luôn tìm ra giải pháp bứt phá trong những hoàn cảnh nhiều biến động.`
    });
  }

  // Tổ hợp 2: Trí Tuệ Chiêm Nghiệm & Phân Tích Bản Chất (7 x 7)
  if ([7, 11, 9].includes(soul) || [7, 11, 9].includes(balance)) {
    strengths.push({
      title: 'Trí Tuệ Chiêm Nghiệm & Trực Giác Phân Tích Bản Chất (7 × 7)',
      indicators: `Linh Hồn ${soul} + Cân Bằng ${balance}`,
      description: `Nhu cầu nội tâm sâu kín của bạn hướng về tri thức nguyên lý và chiều sâu ý nghĩa (Linh Hồn ${soul}). Khi gặp áp lực hay khủng hoảng, điểm tựa phục hồi của bạn cũng là năng lượng số 7 (Cân Bằng ${balance}) - giúp bạn tĩnh tâm, tách mình khỏi những ồn ào cảm xúc nhất thời để phân tích nguyên nhân gốc rễ một cách khách quan, điềm tĩnh.`
    });
  } else {
    strengths.push({
      title: 'Tâm Hồn Sáng Tạo & Khả Năng Biểu Đạt Truyền Cảm Hứng',
      indicators: `Linh Hồn ${soul} + Sứ Mệnh ${expression}`,
      description: `Khát khao bên trong của bạn luôn tìm kiếm sự kết nối và lan tỏa năng lượng tích cực thông qua khả năng biểu đạt, sự đồng cảm và lòng nhiệt thành cống hiến.`
    });
  }

  // Tổ hợp 3: Tâm Thế Phụng Sự & Trách Nhiệm (6)
  if ([6, 9, 2, 33].includes(expression)) {
    strengths.push({
      title: 'Tâm Thế Phụng Sự & Trách Nhiệm Với Gia Đình & Đội Ngũ (6)',
      indicators: `Sứ Mệnh ${expression}`,
      description: `Động lực cống hiến bền bỉ của bạn gắn liền với việc xây dựng mái ấm bình an, bảo bọc con người và lan tỏa những giá trị nhân văn bền vững cho cộng đồng.`
    });
  } else {
    strengths.push({
      title: 'Ý Chí Khai Mở & Năng Lực Dẫn Dắt Đội Ngũ',
      indicators: `Sứ Mệnh ${expression}`,
      description: `Sứ mệnh của bạn là trở thành người mở đường, thiết lập tiêu chuẩn chuyên môn cao và truyền cảm hứng hành động cho những người đồng hành.`
    });
  }

  // 2. NHẬN DIỆN 2 CĂNG KÉO NỘI TẠI (TENSIONS)
  const tensions = [];

  // Căng kéo giữa Chiêm nghiệm (7) vs Thực thi áp lực (8)
  if ((soul === 7 || soul === 9) && (lifePath === 8 || lifePath === 1)) {
    tensions.push({
      title: 'Căng Kéo Giữa Nhu Cầu Tĩnh Lặng Chiêm Nghiệm & Áp Lực Thực Tế Quyết Đoán (7 ↔ 8)',
      indicators: `Linh Hồn ${soul} (Nội tâm) ↔ Đường Đời ${lifePath} (Hành động thực tế)`,
      description: `Bên trong bạn khao khát sự yên tĩnh, tự do cá nhân và thời gian nghiên cứu chiều sâu (Linh Hồn ${soul}); nhưng vai trò Đường Đời (${lifePath}) lại đòi hỏi bạn phải liên tục điều phối, đối mặt với áp lực dòng tiền và sự cạnh tranh. Điểm cần quan sát là liệu tốc độ hành động có đang vượt quá thời gian cần thiết để kiểm chứng quyết định hay không.`,
      solution: `Áp dụng phương pháp phân bổ thời gian theo khối tập trung (Time Blocking): Dành các khoảng thời gian riêng tư cố định 60–90 phút mỗi tuần để tái tạo năng lượng trí tuệ, sau đó bước vào công việc với tâm thế một chiến lược gia điềm tĩnh.`
    });
  } else {
    tensions.push({
      title: 'Căng Kéo Giữa Khát Vọng Tự Do và Nhu Cầu Ổn Định Quy Trình',
      indicators: `Linh Hồn ${soul} ↔ Đường Đời ${lifePath}`,
      description: `Xung đột giữa mong muốn bứt phá tự do và đòi hỏi phải duy trì tính kỷ luật, cam kết dài hạn trong công việc.`,
      solution: `Áp dụng nguyên tắc "Tự do trong khuôn khổ": thiết lập các mốc mục tiêu cốt lõi không thể thỏa hiệp, đồng thời linh hoạt trong phương pháp triển khai.`
    });
  }

  // Căng kéo giữa Sứ Mệnh 6 vs Chỉ Số Thiếu 6
  if (expression === 6 && karmicLessons.includes(6)) {
    tensions.push({
      title: 'Căng Kéo Giữa Trách Nhiệm Yêu Thương Phụng Sự & Kỹ Năng Cần Rèn Luyện (6 ↔ Thiếu 6)',
      indicators: `Sứ Mệnh 6 (Đích đến) ↔ Chỉ Số Thiếu 6 (Bài học cần vun bồi)`,
      description: `Bạn mang thôi thúc cống hiến và chăm sóc cho người thân (Sứ Mệnh 6), nhưng trong chuỗi chữ cái họ tên lại thiếu con số 6. Điều này có thể khiến bạn đôi khi ôm đồm trách nhiệm của người khác hoặc quên chăm sóc chính mình, dễ dẫn đến trạng thái quá tải cảm xúc.`,
      solution: `Thực hành chăm sóc có ranh giới lành mạnh: Nuôi dưỡng sức khỏe và cảm xúc của chính mình trước, sau đó trao đi sự quan tâm cụ thể, giản dị mà không mang tâm lý kỳ vọng kiểm soát.`
    });
  } else if (karmicLessons.length > 0) {
    tensions.push({
      title: `Căng Kéo Giữa Mục Tiêu Sứ Mệnh ${expression} & Bài Học Kỹ Năng Thiếu (Số ${karmicLessons[0]})`,
      indicators: `Sứ Mệnh ${expression} ↔ Chỉ Số Thiếu ${karmicLessons[0]}`,
      description: `Năng lực thực thi sứ mệnh đòi hỏi bạn phải chủ động bổ khuyết các kỹ năng thuộc trường năng lượng số ${karmicLessons[0]} thông qua việc học hỏi và hợp tác với cộng sự.`,
      solution: `Xây dựng đội ngũ bổ khuyết hoặc lập kế hoạch rèn luyện kỷ luật cho kỹ năng còn thiếu.`
    });
  } else {
    tensions.push({
      title: 'Căng Kéo Giữa Kỳ Vọng Bản Thân & Giới Hạn Thời Gian Thực Tế',
      indicators: `Đường Đời ${lifePath} ↔ Sứ Mệnh ${expression}`,
      description: `Tiêu chuẩn cao của bạn có thể tạo ra áp lực tâm lý nếu kết quả thực tế chưa bắt kịp tiến độ mong muốn.`,
      solution: `Học cách ghi nhận các tiến bộ vi mô (Micro-wins) hàng tuần thay vì chỉ nhìn vào đích đến cuối cùng.`
    });
  }

  // 3. VÙNG RÈN LUYỆN CHỦ ĐÍCH
  const growthFocuses = [];
  if (karmicLessons.includes(6)) {
    growthFocuses.push({
      title: 'Vun Bồi Nghệ Thuật Chăm Sóc & Lắng Nghe Gia Đình',
      indicator: 'Chỉ Số Thiếu 6 Trong Họ Tên',
      guidance: 'Dành ít nhất 15 phút mỗi ngày trò chuyện không dùng điện thoại với người thân; chủ động lắng nghe 3 phút không phán xét.'
    });
  } else if (karmicLessons.length > 0) {
    growthFocuses.push({
      title: `Rèn Luyện Kỹ Năng Mềm Năng Lượng Số ${karmicLessons[0]}`,
      indicator: `Chỉ Số Thiếu ${karmicLessons[0]} Trong Họ Tên`,
      guidance: `Chủ động học tập và tìm kiếm người đồng hành để bù đắp các khoảng trống kỹ năng của số ${karmicLessons[0]}.`
    });
  }

  if (challenges.includes(1) || challenges[0] === 1) {
    growthFocuses.push({
      title: 'Làm Chủ Thử Thách Độc Lập & Lãnh Đạo Bằng Sự Thấu Cảm',
      indicator: 'Thử Thách 1 (Chặng Đời Chính)',
      guidance: 'Tập trung rèn luyện sự tự chủ lành mạnh: kiềm chế áp đặt cái tôi, chuyển từ quản lý vi mô sang trao quyền và lắng nghe đa chiều.'
    });
  } else {
    growthFocuses.push({
      title: `Vượt Qua Bài Kiểm Tra Thử Thách Số ${challenges[0] || 1}`,
      indicator: `Chỉ Số Thử Thách ${challenges[0] || 1}`,
      guidance: 'Nhận diện điểm mù tâm lý trong các mối quan hệ và kiên định hoàn thành các cam kết quan trọng.'
    });
  }

  // 4. TRỌNG TÂM NĂM CÁ NHÂN
  const yearThemes: Record<number, { theme: string; priorities: string[] }> = {
    1: {
      theme: 'Khởi Đầu Mới & Định Hình Chiến Lược 9 Năm',
      priorities: ['Xác lập mục tiêu lớn', 'Dám dấn thân thử nghiệm dự án mới', 'Tự chủ ra quyết định']
    },
    2: {
      theme: 'Hợp Tác, Nuôi Dưỡng Mối Quan Hệ & Kiên Nhẫn',
      priorities: ['Tìm kiếm đối tác chiến lược', 'Lắng nghe và hòa giải', 'Tích lũy nội lực']
    },
    3: {
      theme: 'Mở Rộng Truyền Thông, Sáng Tạo & Biểu Đạt',
      priorities: ['Quảng bá thương hiệu', 'Đổi mới sản phẩm/dịch vụ', 'Mở rộng vòng kết nối xã hội']
    },
    4: {
      theme: 'Củng Cố Nền Tảng, Quy Trình & Quản Trị Rủi Ro',
      priorities: ['Chuẩn hóa hệ thống vận hành', 'Quản trị dòng tiền chặt chẽ', 'Chăm sóc sức khỏe thể chất']
    },
    5: {
      theme: 'Bứt Phá, Đổi Mới & Thích Ứng Linh Hoạt',
      priorities: ['Nắm bắt cơ hội thị trường mới', 'Chuyển đổi số', 'Giải phóng các quy trình trì trệ']
    },
    6: {
      theme: 'Trách Nhiệm Gia Đình, Đội Ngũ & Gắn Kết Nhân Tâm',
      priorities: ['Vun đắp tổ ấm', 'Chăm sóc đời sống nội bộ nhân sự', 'Nâng cao chất lượng dịch vụ']
    },
    7: {
      theme: 'Nghiên Cứu Sâu, Nâng Cấp Tri Thức & Tĩnh Tâm',
      priorities: ['Đào sâu chuyên môn cốt lõi', 'Đánh giá lại triết lý sống', 'Tránh đầu tư mạo hiểm']
    },
    8: {
      theme: 'Gặt Hái Thành Tựu, Mở Rộng Quy Mô & Quản Trị Tài Chính',
      priorities: ['Tối ưu hóa doanh thu và dòng tiền', 'Khẳng định vị thế lãnh đạo', 'Tái cấu trúc nguồn lực']
    },
    9: {
      theme: 'Rà Soát Toàn Diện, Hoàn Tất & Tinh Gọn Hệ Thống',
      priorities: [
        'Đóng lại các dự án kém hiệu quả và thanh lọc nguồn lực',
        'Hoàn tất các nghĩa vụ tài chính và pháp lý còn tồn đọng',
        'Chuẩn bị tâm thế đón nhận chu kỳ 9 năm mới'
      ]
    }
  };

  const currentTheme = yearThemes[personalYear] || yearThemes[9];

  return {
    executiveSummary: {
      coreStrengths: strengths.map(s => s.title),
      internalTensions: tensions.map(t => t.title),
      growthTheme: growthFocuses[0]?.title || 'Rèn luyện kỹ năng mềm và kỷ luật tự thân',
      currentCycleStrategy: `Năm Cá Nhân ${personalYear}: ${currentTheme.theme}`
    },
    strengths,
    tensions,
    growthFocuses,
    currentYearFocus: {
      yearNumber: personalYear,
      title: `Năm Cá Nhân ${personalYear}: ${currentTheme.theme}`,
      strategicTheme: currentTheme.theme,
      actionPriorities: currentTheme.priorities
    }
  };
}
