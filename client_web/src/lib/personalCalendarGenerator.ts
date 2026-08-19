// ============================================================================
// PERSONAL ENERGY CALENDAR GENERATOR
// Module tính toán Lịch Năng Lượng Cá Nhân chuyên sâu cho gói Coach (Subscription)
// ============================================================================

export interface PersonalDayForecast {
  dateStr: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: string;
  personalDay: number;
  personalMonth: number;
  personalYear: number;
  theme: string;
  actionGuidance: string;
  doList: string[];
  dontList: string[];
}

export interface MonthEnergyReport {
  month: number;
  year: number;
  personalYear: number;
  personalMonth: number;
  monthTheme: string;
  monthStrategy: string;
  days: PersonalDayForecast[];
}

const DAY_THEMES: Record<number, { theme: string; guidance: string; do: string[]; dont: string[] }> = {
  1: {
    theme: 'Khởi Đầu & Độc Lập',
    guidance: 'Ngày thuận lợi để bắt đầu dự án mới, ra quyết định tự chủ và thiết lập mục tiêu cá nhân.',
    do: ['Bắt đầu thói quen mới', 'Đề xuất sáng kiến', 'Ra quyết định độc lập'],
    dont: ['Trì hoãn', 'Chờ đợi người khác phê duyệt', 'Ngại thử thách mới']
  },
  2: {
    theme: 'Hợp Tác & Lắng Nghe',
    guidance: 'Ngày ưu tiên sự kiên nhẫn, thương lượng, kết nối quan hệ và hòa giải mâu thuẫn.',
    do: ['Gặp gỡ đối tác', 'Lắng nghe phản hồi', 'Xử lý chi tiết tỉ mỉ'],
    dont: ['Tranh cãi nóng vội', 'Độc đoán', 'Thúc ép tiến độ quá mức']
  },
  3: {
    theme: 'Sáng Tạo & Truyền Cảm Hứng',
    guidance: 'Ngày dồi dào năng lượng giao tiếp, trình bày ý tưởng, viết lách và kết nối mạng lưới.',
    do: ['Thuyết trình', 'Chia sẻ ý tưởng', 'Tham gia sự kiện xã hội'],
    dont: ['Phân tán năng lượng', 'Nói quá nhiều mà thiếu hành động', 'Tiêu cực hóa cảm xúc']
  },
  4: {
    theme: 'Kỷ Luật & Tối Ưu Hệ Thống',
    guidance: 'Ngày tập trung vào việc quản trị quy trình, rà soát sổ sách tài chính và hoàn thành công việc cụ thể.',
    do: ['Lập kế hoạch chi tiết', 'Tổ chức lại không gian làm việc', 'Rà soát tài chính'],
    dont: ['Tìm đường tắt', 'Bỏ qua chi tiết quan trọng', 'Phá vỡ cam kết']
  },
  5: {
    theme: 'Linh Hoạt & Đổi Mới',
    guidance: 'Ngày đón nhận cơ hội mới, thích ứng với thay đổi, đi lại hoặc khám phá góc nhìn mới.',
    do: ['Thử nghiệm phương pháp mới', 'Gặp gỡ người mới', 'Thích ứng linh hoạt'],
    dont: ['Cố chấp theo lối mòn', 'Bốc đồng thiếu kiểm soát', 'Cam kết vượt quá khả năng']
  },
  6: {
    theme: 'Trách Nhiệm & Chăm Sóc',
    guidance: 'Ngày dành sự quan tâm cho gia đình, đồng đội, nâng cao chất lượng dịch vụ và không gian sống.',
    do: ['Chăm sóc người thân', 'Hỗ trợ đồng nghiệp', 'Tạo sự ấm cúng'],
    dont: ['Áp đặt kỳ vọng', 'Bỏ quên chăm sóc bản thân', 'Can thiệp việc không phải của mình']
  },
  7: {
    theme: 'Chiêm Nghiệm & Phân Tích Sâu',
    guidance: 'Ngày lý tưởng cho việc học tập chuyên sâu, nghiên cứu, thiền định và tự kiểm chứng chiến lược.',
    do: ['Đọc sách chuyên sâu', 'Đánh giá lại chiến lược', 'Dành thời gian tĩnh lặng'],
    dont: ['Ký kết vội vàng ngoài thương trường', 'Quyết định cảm tính', 'Ồn ào náo nhiệt']
  },
  8: {
    theme: 'Thực Thi & Quản Trị Dòng Tiền',
    guidance: 'Ngày mạnh mẽ để đàm phán thương mại, chốt hợp đồng, quản trị nguồn lực và hiện thực hóa kết quả.',
    do: ['Đàm phán tài chính', 'Điều phối nhân sự', 'Tập trung vào KPI và kết quả'],
    dont: ['Lạm quyền', 'Quá khắt khe', 'Chi tiêu mạo hiểm']
  },
  9: {
    theme: 'Hoàn Tất & Buông Bỏ',
    guidance: 'Ngày thích hợp để đóng gói các công việc dở dang, thanh lý điều cũ và làm việc thiện nguyện.',
    do: ['Hoàn thành việc tồn đọng', 'Dọn dẹp và tinh gọn', 'Hỗ trợ cộng đồng'],
    dont: ['Bắt đầu dự án lớn dài hạn mới', 'Cố chấp giữ điều đã lỗi thời', 'Bi quan']
  }
};

const MONTH_THEMES: Record<number, { theme: string; strategy: string }> = {
  1: { theme: 'Tháng Khởi Động Kế Hoạch', strategy: 'Tập trung gieo mầm dự án mới, tái cấu trúc mục tiêu và dấn thân chủ động.' },
  2: { theme: 'Tháng Hợp Tác & Nuôi Dưỡng', strategy: 'Xây dựng mối quan hệ tin cậy, lắng nghe và hoàn thiện các chi tiết liên kết.' },
  3: { theme: 'Tháng Mở Rộng & Truyền Thông', strategy: 'Đẩy mạnh marketing, giao lưu, quảng bá và kích hoạt sự sáng tạo.' },
  4: { theme: 'Tháng Củng Cố & Chuẩn Hóa', strategy: 'Tập trung xây dựng nền tảng vững chắc, quản trị rủi ro và tối ưu vận hành.' },
  5: { theme: 'Tháng Đổi Mới & Thích Ứng', strategy: 'Linh hoạt trước biến động thị trường, thử nghiệm mô hình mới và mở rộng vùng an toàn.' },
  6: { theme: 'Tháng Gia Đình & Trách Nhiệm', strategy: 'Cân bằng giữa công việc và đời sống riêng, phụng sự khách hàng bằng sự tận tâm.' },
  7: { theme: 'Tháng Nâng Cao Năng Lực & Tĩnh Lặng', strategy: 'Đầu tư cho trí tuệ, nghiên cứu công nghệ, rà soát cốt lõi nội tại.' },
  8: { theme: 'Tháng Thu Hoạch & Tăng Tốc Tài Chính', strategy: 'Quyết liệt trong đàm phán, tối ưu hóa lợi nhuận và mở rộng quy mô thực thi.' },
  9: { theme: 'Tháng Tinh Gọn & Hoàn Tất Chu Kỳ', strategy: 'Đóng gói các kết quả, buông bỏ những tồn đọng và chuẩn bị cho giai đoạn tiếp theo.' }
};

export function generatePersonalMonthCalendar(
  birthDateStr: string, // DD/MM/YYYY
  targetMonth: number,  // 1-12
  targetYear: number    // YYYY
): MonthEnergyReport {
  // 1. Phân tích ngày sinh
  const parts = birthDateStr.split('/');
  const bDay = parseInt(parts[0] || '27', 10);
  const bMonth = parseInt(parts[1] || '8', 10);

  // Rút gọn ngày + tháng sinh
  const reduceNum = (n: number): number => {
    let sum = n;
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum > 9 ? sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0) : sum;
  };

  const dayReduced = reduceNum(bDay);
  const monthReduced = reduceNum(bMonth);
  const targetYearReduced = reduceNum(targetYear);

  // Năm cá nhân = Ngày sinh rút gọn + Tháng sinh rút gọn + Năm hiện tại rút gọn
  const rawPY = dayReduced + monthReduced + targetYearReduced;
  const personalYear = reduceNum(rawPY);

  // Tháng cá nhân = Năm cá nhân + Tháng mục tiêu
  const rawPM = personalYear + targetMonth;
  const personalMonth = reduceNum(rawPM);

  // 2. Tính số ngày trong tháng mục tiêu
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const dayForecasts: PersonalDayForecast[] = [];

  const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(targetYear, targetMonth - 1, d);
    const dayOfWeek = dayOfWeekNames[curDate.getDay()];

    // Ngày cá nhân = Tháng cá nhân + Ngày lịch (d)
    const rawPD = personalMonth + d;
    const personalDay = reduceNum(rawPD);

    const themeData = DAY_THEMES[personalDay] || DAY_THEMES[1];
    const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    dayForecasts.push({
      dateStr,
      dayOfMonth: d,
      dayOfWeek,
      personalDay,
      personalMonth,
      personalYear,
      theme: themeData.theme,
      actionGuidance: themeData.guidance,
      doList: themeData.do,
      dontList: themeData.dont
    });
  }

  const monthThemeData = MONTH_THEMES[personalMonth] || MONTH_THEMES[1];

  return {
    month: targetMonth,
    year: targetYear,
    personalYear,
    personalMonth,
    monthTheme: monthThemeData.theme,
    monthStrategy: monthThemeData.strategy,
    days: dayForecasts
  };
}
