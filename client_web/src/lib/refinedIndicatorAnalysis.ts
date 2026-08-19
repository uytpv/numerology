/**
 * THƯ VIỆN LUẬN GIẢI CHUYÊN SÂU 21 CHỈ SỐ, CẦU NỐI & NỢ BÀI HỌC THẦN SỐ HỌC PYTHAGORAS
 * Chuẩn Khai Vấn Tâm Lý Học Hành Vi & Life Coach ICF
 * Tuyệt đối không dùng câu từ sáo rỗng, loại bỏ ngôn ngữ định mệnh, đảm bảo an toàn ngữ nghĩa.
 */

export interface IndicatorAnalysisItem {
  code: string;
  name: string;
  number: number;
  coreEssence: string;
  deepAnalysis: string;
  positiveTraits: string[];
  shadowTraits: string[];
  practicalApplication: {
    career: string;
    relationships: string;
    decisionMaking: string;
    money: string;
  };
  activationAndHabits: string[];
  powerQuestions: string[];
}

// 1. HƯỚNG DẪN KÍCH HOẠT CẦU NỐI (LPE & HDP BRIDGES - ĐỘC BẢN CHO TỪNG CON SỐ)
export const BRIDGE_LPE_GUIDANCE: Record<number, { meaning: string; whyBottleneck: string; howToActivate: string[]; exercise: string }> = {
  0: {
    meaning: 'Đồng điệu tự nhiên: Hai trường năng lượng cốt lõi của bạn có cùng tần số rung động hoặc tương hỗ trực tiếp.',
    whyBottleneck: 'Bạn có động lực tự thân rất mạnh nhưng dễ rơi vào trạng thái chủ quan, thiếu tính linh hoạt khi gặp môi trường đòi hỏi các kỹ năng mềm khác biệt.',
    howToActivate: [
      'Đa dạng hóa góc nhìn bằng cách lắng nghe phản biện từ những người có trường năng lượng đối lập.',
      'Không chủ quan với những công việc mang tính chi tiết hoặc đòi hỏi sự kiên nhẫn dài hạn.'
    ],
    exercise: 'Mỗi tuần hãy chủ động nhờ một người đồng nghiệp đáng tin cậy chỉ ra 1 điểm mù trong cách bạn ra quyết định.'
  },
  1: {
    meaning: 'Bài học kích hoạt: Tính Tự Chủ, Quyết Đoán & Can Đảm Tiên Phong.',
    whyBottleneck: 'Bạn thường biết rõ mình muốn gì nhưng lại chần chừ vì sợ phán xét hoặc chờ đợi sự cho phép/công nhận từ người khác, dẫn đến đánh mất thời cơ bứt phá.',
    howToActivate: [
      'Rèn thói quen ra quyết định độc lập trong vòng 24 giờ đối với các vấn đề thuộc thẩm quyền của mình.',
      'Chịu trách nhiệm 100% về kết quả mà không tìm lý do biện minh hay đổ lỗi cho hoàn cảnh.',
      'Học cách nói "Không" một cách dứt khoát với những yêu cầu làm chệch hướng mục tiêu ưu tiên số 1.'
    ],
    exercise: 'Thực hành "Nguyên tắc 5 giây": Khi có một ý tưởng quan trọng cần triển khai, hãy đếm ngược 5-4-3-2-1 và hành động ngay một bước nhỏ đầu tiên trước khi nỗi sợ kịp kéo bạn lại.'
  },
  2: {
    meaning: 'Bài học kích hoạt: Lắng Nghe Không Phán Xét, Hòa Giải & Thấu Cảm.',
    whyBottleneck: 'Cái tôi quá lớn, xu hướng thích áp đặt giải pháp của mình hoặc phản xạ tranh cãi thắng - thua khiến bạn dễ làm rạn nứt các mối quan hệ đối tác và cộng sự.',
    howToActivate: [
      'Thực hành kỹ thuật "Dừng 3 giây": Dành 3 giây tĩnh lặng trước khi phản hồi bất kỳ câu hỏi hoặc ý kiến trái chiều nào.',
      'Chuyển từ tâm thế "Tôi đúng - Bạn sai" sang tư duy "Win - Win" (Cùng thắng): Luôn tìm ra điểm chung mà cả hai bên đều được hưởng lợi.',
      'Đặt câu hỏi mở chân thành thay vì ra lệnh: "Góc nhìn của bạn về vấn đề này thế nào?" hoặc "Làm sao để chúng ta phối hợp tốt hơn?".'
    ],
    exercise: 'Trong cuộc họp tiếp theo, hãy đặt mục tiêu lắng nghe trọn vẹn và ghi chép lại ít nhất 3 ý kiến đóng góp của người khác trước khi bạn đưa ra phát biểu của mình.'
  },
  3: {
    meaning: 'Bài học kích hoạt: Nghệ Thuật Biểu Đạt Cảm Xúc & Truyền Cảm Hứng Bằng Ngôn Từ.',
    whyBottleneck: 'Bạn dễ giữ ấm ức trong lòng cho đến khi bùng nổ, hoặc ngược lại là dùng từ ngữ quá gay gắt, châm biếm khi gặp áp lực, khiến người khác e ngại tiếp cận.',
    howToActivate: [
      'Học cách diễn đạt cảm xúc và mong muốn một cách trực tiếp, văn minh và mang tính xây dựng.',
      'Sử dụng ngôn từ tích cực, khích lệ và biến các ý tưởng phức tạp thành những câu chuyện dễ hiểu, truyền cảm hứng.',
      'Viết nhật ký cảm xúc mỗi tối để giải phóng các năng lượng tắc nghẽn trong tâm trí.'
    ],
    exercise: 'Mỗi ngày hãy gửi ít nhất 1 lời khen ngợi hoặc tin nhắn cảm ơn chân thành, cụ thể đến một người cộng sự hoặc người thân.'
  },
  4: {
    meaning: 'Bài học kích hoạt: Kỷ Luật Thực Thi, Đóng Gói Quy Trình & Quản Trị Chi Tiết.',
    whyBottleneck: 'Bạn có tầm nhìn lớn nhưng dễ chán nản trước các công việc lặp đi lặp lại hoặc thiếu sự kiên nhẫn trong khâu tổ chức, dẫn đến tình trạng "đầu voi đuôi chuột".',
    howToActivate: [
      'Thiết lập danh sách 3 việc quan trọng nhất (Top 3 Priority) vào mỗi buổi sáng và cam kết hoàn thành trước 12h trưa.',
      'Đóng gói công việc thành các biểu mẫu hoặc quy trình chuẩn (SOP) để giảm thiểu sai sót cá nhân.',
      'Ứng dụng phương pháp quản trị thời gian Pomodoro (25 phút tập trung cao độ, 5 phút nghỉ).'
    ],
    exercise: 'Dành 30 phút chiều Chủ Nhật để lập kế hoạch chi tiết cho cả tuần tới và dọn dẹp bàn làm việc gọn gàng ngăn nắp.'
  },
  5: {
    meaning: 'Bài học kích hoạt: Sự Thích Nghi Linh Hoạt, Đổi Mới Sáng Tạo & Đón Nhận Cơ Hội.',
    whyBottleneck: 'Bạn dễ rơi vào hai thái cực: hoặc bám chặt vào vùng an toàn cũ kỹ vì sợ rủi ro, hoặc thay đổi quá nhanh chóng mặt khiến công việc thiếu tính tích lũy chiều sâu.',
    howToActivate: [
      'Dành 20% thời gian và nguồn lực cho các thử nghiệm mới, trong khi 80% vẫn tập trung tối ưu hóa giá trị cốt lõi.',
      'Rèn luyện tinh thần cởi mở, xem các sự cố bất ngờ là cơ hội để tôi luyện năng lực giải quyết vấn đề.',
      'Học cách buông bỏ những quy trình, mối quan hệ hoặc dự án đã lỗi thời và không còn mang lại giá trị.'
    ],
    exercise: 'Thực hiện 1 trải nghiệm hoàn toàn mới trong tuần này (đọc một cuốn sách khác thể loại, đi làm theo một cung đường mới, hoặc trò chuyện với một người ngoài ngành).'
  },
  6: {
    meaning: 'Bài học kích hoạt: Trách Nhiệm Chân Thành, Yêu Thương Bản Thân & Thiết Lập Ranh Giới.',
    whyBottleneck: 'Bạn dễ có xu hướng "bao đồng", gánh vác mọi việc thay người khác rồi sau đó cảm thấy kiệt sức, ấm ức hoặc có xu hướng kiểm soát vì nghĩ mình làm tốt hơn họ.',
    howToActivate: [
      'Thấu hiểu nguyên lý: "Giúp đỡ có trí tuệ là trao quyền để người khác tự trưởng thành, chứ không phải làm thay họ".',
      'Thiết lập ranh giới cảm xúc rõ ràng: Dành thời gian chăm sóc sức khỏe và giấc ngủ của bản thân trước khi phục vụ người khác.',
      'Dành thời gian chất lượng trọn vẹn bên gia đình mà không để công việc xen vào.'
    ],
    exercise: 'Hãy từ chối một yêu cầu nhờ vả không thuộc phạm vi trách nhiệm của bạn mà bạn cảm thấy đang làm quá tải năng lượng của mình.'
  },
  7: {
    meaning: 'Bài học kích hoạt: Đào Sâu Bản Chất, Chiêm Nghiệm & Xây Dựng Đức Tin Vững Vàng.',
    whyBottleneck: 'Bạn dễ hoài nghi mọi thứ, phán xét dựa trên bề nổi hoặc ngược lại là trốn tránh thực tại bằng việc khép kín, cô lập bản thân trong tháp ngà lý thuyết.',
    howToActivate: [
      'Dành ít nhất 30 phút mỗi ngày trong không gian yên tĩnh để đọc tài liệu chuyên môn sâu và tự phản tỉnh.',
      'Trước khi đưa ra kết luận về một vấn đề lớn, hãy thu thập ít nhất 3 nguồn dữ liệu kiểm chứng độc lập.',
      'Thực hành các khoảng lặng thư giãn hòa mình vào thiên nhiên để làm lắng đọng tâm trí.'
    ],
    exercise: 'Viết ra một niềm tin giới hạn đang kìm hãm bạn và tìm 3 bằng chứng thực tế chứng minh niềm tin đó không còn đúng nữa.'
  },
  8: {
    meaning: 'Bài học kích hoạt: Cân Bằng Giá Trị Nội Tâm & Quyền Lực Thực Thi, Định Giá Bản Thân & Quản Trị Ranh Giới Nguồn Lực.',
    whyBottleneck: 'Bạn dễ rơi vào trạng thái e ngại đàm phán về quyền lợi tài chính xứng đáng, hoặc ngược lại là biểu đạt tham vọng quá gay gắt làm mất kết nối chân thành với các cộng sự.',
    howToActivate: [
      'Cân bằng giữa lý tưởng nội tâm và thành tựu vật chất thực tế: Nhìn nhận tiền bạc và quyền lực như công cụ tạo ra ảnh hưởng tích cực.',
      'Tự tin định giá năng lực bản thân dựa trên giá trị và kết quả đóng góp thực tế đo lường được.',
      'Quản trị nguồn lực và ranh giới rõ ràng: Biết cách phân bổ ngân sách, thời gian và quyền hạn một cách minh bạch, công bằng.',
      'Biểu đạt tham vọng và mục tiêu phát triển một cách chân thành, truyền cảm hứng mà không tạo cảm giác áp đặt lên người khác.'
    ],
    exercise: 'Rà soát lại một dự án hoặc mối quan hệ hợp tác hiện tại: Liệt kê rõ ràng quyền lợi, trách nhiệm của đôi bên trên văn bản và tự tin đề xuất điều chỉnh để đạt trạng thái cân bằng, minh bạch.'
  },
  9: {
    meaning: 'Bài học kích hoạt: Lòng Bao Dung, Phụng Sự Cộng Đồng & Buông Bỏ Chấp Niệm.',
    whyBottleneck: 'Bạn dễ mang tâm lý nặng nề, chấp niệm những điều không như ý trong quá khứ hoặc kỳ vọng người khác phải đền đáp sự cống hiến của mình.',
    howToActivate: [
      'Thực hành bao dung: Hiểu rằng tha thứ và buông bỏ là để giải phóng chính tâm trí mình.',
      'Chuyển tâm thái làm việc từ "Tôi sẽ nhận lại được gì ngay?" sang "Dự án này mang lại giá trị thiết thực gì cho người dùng và cộng đồng?".',
      'Tham gia hoặc khởi xướng các hoạt động chia sẻ tri thức, hỗ trợ cộng đồng.'
    ],
    exercise: 'Viết một lá thư cảm ơn (hoặc tự tha thứ) đối với một trải nghiệm khó khăn trong quá khứ, rút ra 1 bài học trưởng thành và khép lại trang cũ.'
  }
};

// 2. HƯỚNG DẪN NỢ BÀI HỌC (KARMIC DEBT NUMBERS: 13/4, 14/5, 16/7, 19/1)
export const KARMIC_DEBT_GUIDANCE: Record<number, {
  name: string;
  meaning: string;
  focusTheme: string;
  whyItMatters: string;
  growthAction: string[];
  disclaimer: string;
}> = {
  13: {
    name: 'Nợ Bài Học 13/4 (Karmic Debt 13/4) - Chủ Đề Kỷ Luật & Xây Nền Móng',
    meaning: 'Trong trường phái Pythagoras, 13/4 là một chủ đề phát triển liên quan đến tính kỷ luật, lao động kiên trì, xây dựng nền tảng vững chắc và nói không với tư duy đi đường tắt.',
    focusTheme: 'Kiên trì thực thi, đóng gói quy trình, làm việc đều đặn và trách nhiệm cao.',
    whyItMatters: 'Người có bài học 13/4 có thể cảm thấy các thành tựu của mình đòi hỏi nhiều công sức và sự tôi luyện hơn. Khi vượt qua bài học này bằng sự kỷ luật, bạn sẽ xây dựng được sự nghiệp vô cùng vững chãi.',
    growthAction: [
      'Thiết lập thói quen làm việc có cấu trúc: Chia nhỏ mục tiêu lớn thành các bước vi mô hàng ngày.',
      'Tuyệt đối tránh các cơ hội "làm giàu nhanh" hoặc các dự án thiếu tính pháp lý và nền tảng thực tế.',
      'Tập trung tối ưu hóa 1 chuyên môn cốt lõi đến mức xuất sắc trước khi mở rộng quy mô.'
    ],
    disclaimer: 'Lưu ý: 13/4 là bài học rèn luyện tính cách, không phải hình phạt hay định mệnh xui xẻo. Kết quả thực tế phụ thuộc hoàn toàn vào nỗ lực và sự kiên trì của bạn.'
  },
  14: {
    name: 'Nợ Bài Học 14/5 (Karmic Debt 14/5) - Chủ Đề Tự Do Có Trách Nhiệm & Tiết Chế',
    meaning: 'Bài học 14/5 nhắc nhở về sự cân bằng giữa khao khát tự do trải nghiệm và việc duy trì các cam kết, ranh giới đạo đức và kỷ luật bản thân.',
    focusTheme: 'Tiết chế cảm xúc, quản trị sự thay đổi và giữ vững cam kết dài hạn.',
    whyItMatters: 'Giúp bạn tránh rơi vào bẫy nghiện ngập tự do, thay đổi mục tiêu liên tục hoặc sa đà vào các thú vui nhất thời làm tiêu hao năng lượng.',
    growthAction: [
      'Thiết lập 3 nguyên tắc sống bất di bất dịch.',
      'Rèn luyện sự kiên định: Hoàn thành 100% dự án trước khi chuyển hướng sang thử nghiệm mới.'
    ],
    disclaimer: 'Đây là lời nhắc nhở về sự điều độ và tự chủ, không phải giới hạn cho sự sáng tạo của bạn.'
  },
  16: {
    name: 'Nợ Bài Học 16/7 (Karmic Debt 16/7) - Chủ Đề Thức Tỉnh & Giá Trị Chân Thật',
    meaning: 'Bài học 16/7 hướng tới việc buông bỏ cái tôi ảo tưởng, sống thành thật với chính mình và xây dựng các mối quan hệ dựa trên sự chân thành thay vì vỏ bọc bên ngoài.',
    focusTheme: 'Trực giác sâu sắc, tĩnh tâm, buông bỏ kiêu hãnh và phát triển trí tuệ nội tâm.',
    whyItMatters: 'Nếu bạn xây dựng sự nghiệp dựa trên sự giả tạo hoặc cái tôi quá lớn, bạn có thể phải trải qua các cú va đập để thức tỉnh và tìm về giá trị cốt lõi bền vững.',
    growthAction: [
      'Dành thời gian tĩnh lặng mỗi ngày để soi chiếu nội tâm.',
      'Xây dựng uy tín cá nhân bằng năng lực thực chất và sự chính trực.'
    ],
    disclaimer: '16/7 mở ra cơ hội chuyển hóa nhận thức sâu sắc nhất nếu bạn dũng cảm đối diện với sự thật.'
  },
  19: {
    name: 'Nợ Bài Học 19/1 (Karmic Debt 19/1) - Chủ Đề Độc Lập & Tinh Thần Hợp Tác',
    meaning: 'Bài học 19/1 dạy về sự tự lập chân chính: Biết tự đứng trên đôi chân mình nhưng đồng thời biết mở lòng đón nhận sự giúp đỡ và thấu hiểu người khác.',
    focusTheme: 'Lãnh đạo bằng sự phục vụ, hạ bớt tính độc đoán và xây dựng tinh thần đồng đội.',
    whyItMatters: 'Tránh rơi vào trạng thái cô độc trên đỉnh cao hoặc từ chối mọi sự hỗ trợ vì cái tôi phòng thủ.',
    growthAction: [
      'Học cách nói lời cảm ơn và chủ động nhờ sự trợ giúp khi cần.',
      'Lắng nghe ý kiến của tập thể trước khi ra quyết định then chốt.'
    ],
    disclaimer: 'Sức mạnh lãnh đạo lớn nhất là khả năng truyền cảm hứng và nâng đỡ những người xung quanh.'
  }
};

// 3. HƯỚNG DẪN CHỈ SỐ THIẾU (KARMIC LESSONS) - GIẢI NGHĨA KHOA HỌC, KHÔNG MÊ TÍN
export const KARMIC_LESSON_GUIDANCE: Record<number, {
  name: string;
  missingNumber: number;
  explanation: string;
  cultivationArea: string;
  dailyPractice: string;
}> = {
  1: {
    name: 'Nhóm số 1 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 1,
    explanation: 'Họ tên khai sinh của bạn không chứa các ký tự mang tần số số 1 (A, J, S). Điều này gợi ý rằng tính quyết đoán, khả năng tự chủ ra quyết định độc lập và lòng can đảm tiên phong là những kỹ năng mềm cần được rèn luyện có chủ đích.',
    cultivationArea: 'Tự chủ ra quyết định, dám chịu trách nhiệm và thiết lập mục tiêu cá nhân rõ ràng.',
    dailyPractice: 'Tập đưa ra lựa chọn nhanh trong các tình huống nhỏ hàng ngày mà không cần hỏi ý kiến người khác.'
  },
  2: {
    name: 'Nhóm số 2 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 2,
    explanation: 'Họ tên khai sinh không chứa các ký tự B, K, T. Đây là lời gợi ý về việc bồi đắp kỹ năng lắng nghe thấu cảm, ngoại giao khéo léo và kiên nhẫn trong phối hợp làm việc nhóm.',
    cultivationArea: 'Nghệ thuật thấu hiểu, hòa giải xung đột và làm việc nhóm.',
    dailyPractice: 'Tập trung lắng nghe người đối diện trong 3 phút mà không ngắt lời hay phán xét.'
  },
  3: {
    name: 'Nhóm số 3 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 3,
    explanation: 'Họ tên không chứa các ký tự C, L, U. Bạn có thể cần rèn luyện thêm về khả năng biểu đạt cảm xúc, sự tự tin trước đám đông và tinh thần lạc quan.',
    cultivationArea: 'Kỹ năng giao tiếp, viết lách, thuyết trình và giải tỏa năng lượng sáng tạo.',
    dailyPractice: 'Viết nhật ký cảm xúc hoặc chia sẻ một câu chuyện vui với đồng nghiệp mỗi ngày.'
  },
  4: {
    name: 'Nhóm số 4 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 4,
    explanation: 'Họ tên không chứa các ký tự D, M, V. Bạn có xu hướng thích ý tưởng lớn nhưng cần rèn luyện tính kỷ luật, quản lý chi tiết và phương pháp làm việc có hệ thống.',
    cultivationArea: 'Lập kế hoạch, quản lý tài chính chặt chẽ và xây dựng quy trình chuẩn.',
    dailyPractice: 'Sử dụng checklist công việc và hoàn thành đúng thời hạn cam kết.'
  },
  5: {
    name: 'Nhóm số 5 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 5,
    explanation: 'Họ tên không chứa các ký tự E, N, W. Bạn có thể có xu hướng bám vào vùng an toàn, cần rèn luyện thêm sự linh hoạt, cởi mở đón nhận sự đổi mới và thay đổi.',
    cultivationArea: 'Thích ứng với biến động, mở rộng vùng an toàn và tinh thần phiêu lưu lành mạnh.',
    dailyPractice: 'Thử một trải nghiệm hoặc lộ trình di chuyển mới mỗi tuần.'
  },
  6: {
    name: 'Nhóm số 6 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 6,
    explanation: 'Họ tên của bạn không chứa các ký tự mang tần số số 6 (F, O, X). Điều này cho thấy các chủ đề như sự chăm sóc chu đáo, trách nhiệm gia đình và nghệ thuật thiết lập ranh giới cho - nhận cần được bạn chú tâm vun bồi có chủ đích.',
    cultivationArea: 'Chăm sóc người thân chân thành, lắng nghe nhu cầu thực tế của đối phương và học cách yêu thương chính mình.',
    dailyPractice: 'Dành 1 khoảng thời gian chất lượng không điện thoại bên gia đình và hỏi thăm một người thân mỗi tuần.'
  },
  7: {
    name: 'Nhóm số 7 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 7,
    explanation: 'Họ tên không chứa các ký tự G, P, Y. Gợi ý bạn cần dành thời gian chiêm nghiệm sâu sắc hơn, học cách tự nghiên cứu độc lập và phát triển đời sống tinh thần.',
    cultivationArea: 'Đọc sách chuyên sâu, phân tích bản chất vấn đề và thực hành tĩnh tâm.',
    dailyPractice: 'Dành 20 phút mỗi ngày để đọc tài liệu chuyên môn trong tĩnh lặng.'
  },
  8: {
    name: 'Nhóm số 8 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 8,
    explanation: 'Họ tên không chứa các ký tự H, Q, Z. Bạn có thể cần rèn luyện thêm về tư duy tài chính thực tế, khả năng quản trị dòng tiền và sự tự tin về quyền lực cá nhân.',
    cultivationArea: 'Kỹ năng quản lý tài chính, đàm phán quyền lợi và tư duy kinh doanh.',
    dailyPractice: 'Theo dõi chi tiêu hàng ngày và lập bảng kế hoạch ngân sách cá nhân hàng tháng.'
  },
  9: {
    name: 'Nhóm số 9 không xuất hiện trong chuỗi chữ cái họ tên',
    missingNumber: 9,
    explanation: 'Họ tên không chứa các ký tự I, R. Gợi ý bạn cần mở rộng lòng trắc ẩn, học cách tha thứ và hướng tới các giá trị phụng sự cộng đồng lớn hơn cái tôi cá nhân.',
    cultivationArea: 'Bao dung, tinh thần nhân văn, buông bỏ định kiến và đóng góp xã hội.',
    dailyPractice: 'Thực hiện 1 hành động giúp đỡ vô tư không vụ lợi mỗi tuần.'
  }
};

// 4. CHECKLIST THẨM ĐỊNH THỰC TẾ CHO TỪNG LĨNH VỰC TRỌNG TÂM (DUE DILIGENCE CHECKLISTS)
export const DOMAIN_DUE_DILIGENCE_CHECKLISTS: Record<string, {
  title: string;
  disclaimer: string;
  checklist: string[];
  quantitativeMetrics: string[];
}> = {
  money: {
    title: 'Checklist Quản Trị Tài Chính & Dòng Tiền Thực Chiến',
    disclaimer: 'Tuyên bố miễn trừ: Thần số học cung cấp khung tự phản tỉnh về xu hướng tâm lý chi tiêu và quản trị nguồn lực. Đây KHÔNG phải là lời khuyên tài chính, đầu tư hay đảm bảo lợi nhuận. Mọi quyết định tiền bạc cần dựa trên số liệu thực tế và tư vấn chuyên gia tài chính độc lập.',
    checklist: [
      'Thiết lập Quỹ dự phòng khẩn cấp tối thiểu 3 - 6 tháng chi phí sinh hoạt thiết yếu.',
      'Duy trì Tỷ lệ Nợ trên Thu nhập (DTI - Debt to Income) dưới mức an toàn 30 - 40% (Lưu ý: Mốc tham khảo; cần điều chỉnh theo thu nhập, nợ, quốc gia, chi phí sinh hoạt, người phụ thuộc và mức độ ổn định việc làm).',
      'Định kỳ ghi chép dòng tiền Thu - Chi hàng tuần để phát hiện rò rỉ tài chính.',
      'Phân bổ danh mục đầu tư đa dạng, không dồn 100% vốn vào kênh rủi ro cao.',
      'Mua bảo hiểm nhân thọ / y tế phù hợp để bảo vệ dòng tiền trước rủi ro sức khỏe.'
    ],
    quantitativeMetrics: [
      'Tỷ lệ tiết kiệm / đầu tư định kỳ hàng tháng (Mục tiêu tham khảo: 15 - 30% thu nhập).',
      'Số ngày liên tiếp ghi chép chi tiêu trong tháng (Mục tiêu: > 25 ngày).',
      'Số tháng chi tiêu thiết yếu có thể duy trì trong quỹ dự phòng.'
    ]
  },
  real_estate: {
    title: 'Checklist Thẩm Định Pháp Lý & Tài Chính Mua Bán Bất Động Sản',
    disclaimer: 'Tuyên bố miễn trừ: Năm cá nhân chỉ là công cụ hỗ trợ lập kế hoạch nhịp độ tâm lý cá nhân. Quyết định mua bán, vay vốn hoặc đầu tư bất động sản BẮT BUỘC phải dựa trên khảo sát thực địa, kiểm tra pháp lý và tư vấn từ luật sư/ngân hàng chuyên môn.',
    checklist: [
      'Kiểm tra tính pháp lý: Sổ hồng/sổ đỏ chính chủ, không tranh chấp, không vướng thế chấp xấu.',
      'Kiểm tra quy hoạch đô thị tại cơ quan tài nguyên môi trường hoặc cổng thông tin quy hoạch.',
      'Tính toán khả năng trả nợ vay: Số tiền trả gốc + lãi hàng tháng không vượt quá 40% thu nhập ổn định.',
      'Khảo sát thực địa kỹ thuật: Địa chất, phong thủy môi trường xung quanh, ngập nước, hạ tầng giao thông.',
      'Thẩm định giá thị trường: So sánh ít nhất 3 - 5 bất động sản tương đồng trong cùng khu vực.',
      'Tham vấn luật sư hoặc chuyên viên công chứng trước khi đặt cọc và ký hợp đồng mua bán.'
    ],
    quantitativeMetrics: [
      'Tỷ lệ vốn tự có trên tổng giá trị tài sản (Khuyến nghị: >= 50%).',
      'Số nguồn dữ liệu quy hoạch và pháp lý độc lập đã được đối chiếu kiểm tra (Mục tiêu: >= 3 nguồn).'
    ]
  },
  career: {
    title: 'Checklist Phát Triển Sự Nghiệp & Năng Lực Lãnh Đạo',
    disclaimer: 'Thần số học mô tả thiên hướng năng lượng bẩm sinh. Sự thành công nghề nghiệp thực tế đòi hỏi kỹ năng chuyên môn được chứng minh, kinh nghiệm tích lũy, bằng cấp và nhu cầu của thị trường lao động.',
    checklist: [
      'Xác định 1 - 2 kỹ năng cốt lõi (Core Competencies) tạo ra 80% giá trị vượt trội của bạn.',
      'Thực hành ủy quyền có kiểm soát cho cấp dưới để giải phóng thời gian cho tư duy chiến lược.',
      'Xây dựng mạng lưới quan hệ chất lượng (Networking) dựa trên giá trị hỗ trợ đôi bên.',
      'Lập kế hoạch mục tiêu quý (OKR / KPI) rõ ràng và rà soát tiến độ mỗi 2 tuần.',
      'Định kỳ lấy phản hồi 360 độ từ đồng nghiệp, cấp trên và khách hàng.'
    ],
    quantitativeMetrics: [
      'Số giờ làm việc tập trung cao độ (Deep Work) mỗi ngày (Mục tiêu tham khảo: 3 - 4 giờ, điều chỉnh theo đặc thù công việc).',
      'Số mục tiêu chiến lược cốt lõi hoàn tất đúng hạn trong quý (Mục tiêu: >= 80%).'
    ]
  },
  relationships: {
    title: 'Checklist Giao Tiếp & Xây Dựng Mối Quan Hệ Bền Vững',
    disclaimer: 'Tuyên bố: Các gợi ý mối quan hệ mang tính chất trung tính và tôn trọng sự bình đẳng. Không suy diễn vai trò giới hay gán ghép định kiến.',
    checklist: [
      'Thực hành lắng nghe tích cực: Không ngắt lời, phản ánh lại cảm xúc của đối phương.',
      'Tách biệt giữa "sự việc khách quan" và "cảm xúc/phán xét chủ quan" khi trao đổi.',
      'Thiết lập ranh giới cảm xúc tôn trọng lẫn nhau: Giúp đỡ nhưng không kiểm soát hay làm thay.',
      'Dành thời gian chất lượng trọn vẹn (Quality Time) cho người thân mà không bị công việc gián đoạn.',
      'Chủ động ghi nhận và khen ngợi những nỗ lực dù là nhỏ nhất của người đồng hành.'
    ],
    quantitativeMetrics: [
      'Số cuộc trò chuyện sâu (Deep Talk > 30 phút) mỗi tuần.',
      'Điểm tự đánh giá mức độ thấu hiểu và hòa hợp từ cả hai phía (thang điểm 1 - 10).'
    ]
  },
  health: {
    title: 'Checklist Cân Bằng Nhịp Sống & Tái Tạo Năng Lượng',
    disclaimer: 'Tuyên bố miễn trừ: Thần số học chỉ gợi ý các thói quen lối sống lành mạnh. Báo cáo này KHÔNG thay thế cho chẩn đoán, điều trị y khoa hoặc tham vấn tâm lý trị liệu chuyên nghiệp. Khi có vấn đề sức khỏe, hãy thăm khám tại các cơ sở y tế được cấp phép.',
    checklist: [
      'Duy trì giấc ngủ chất lượng: 7 - 8 tiếng mỗi đêm, hạn chế màn hình xanh 45 phút trước khi ngủ.',
      'Vận động thể chất vừa sức tối thiểu 30 phút mỗi ngày (đi bộ, chạy bộ, yoga, thể thao).',
      'Thực hành bài tập thở sâu hoặc thiền tĩnh tâm 10 - 15 phút để hạ mức hormone căng thẳng (Cortisol).',
      'Uống đủ nước (40ml/kg trọng lượng cơ thể) và duy trì chế độ dinh dưỡng cân bằng.',
      'Khám sức khỏe tổng quát định kỳ ít nhất 1 lần mỗi năm.'
    ],
    quantitativeMetrics: [
      'Số ngày tập thể dục trong tuần (Mục tiêu: >= 4 ngày).',
      'Thời lượng giấc ngủ sâu trung bình mỗi đêm (Mục tiêu: >= 1.5 giờ).'
    ]
  },
  retirement: {
    title: 'Checklist Kế Hoạch Hậu Vận, Hưu Trí & An Yên Tuổi Già',
    disclaimer: 'Tuyên bố: Thần số học mô tả giai đoạn trưởng thành tâm lý sau 40 tuổi. Các kế hoạch tài chính hưu trí, y tế và di chúc bắt buộc phải tuân thủ pháp luật hiện hành và tham vấn chuyên gia tài chính/luật sư.',
    checklist: [
      'Xác lập Mục tiêu tài chính hưu trí: Tính toán chi phí sinh hoạt dự kiến hàng tháng và nguồn thu nhập thụ động sau nghỉ hưu.',
      'Dự phòng chi phí y tế & Chăm sóc sức khỏe dài hạn: Chuẩn bị gói bảo hiểm sức khỏe/y tế người cao tuổi và quỹ y tế chuyên biệt.',
      'Kế hoạch nơi cư trú & Không gian sống: Lựa chọn môi trường sống an lành, thuận tiện tiếp cận dịch vụ y tế và gần gũi thiên nhiên.',
      'Gắn kết Mạng lưới hỗ trợ & Quan hệ gia đình: Duy trì kết nối thân thiết với con cháu, bạn bè cùng trang lứa và cộng đồng.',
      'Kế hoạch Di chúc & Ủy quyền hợp pháp: Lập văn bản di chúc, chỉ định người giám hộ/ủy quyền y tế rõ ràng theo đúng quy định pháp luật địa phương.',
      'Duy trì Sự tự chủ thể chất & Tinh thần: Tham gia các hoạt động xã hội, câu lạc bộ, thiện nguyện hoặc chia sẻ tri thức cho thế hệ kế cận.'
    ],
    quantitativeMetrics: [
      'Tỷ lệ đạt được của Quỹ tài chính hưu trí mục tiêu (Thang % hoàn thành).',
      'Số ngày tham gia hoạt động thể chất nhẹ nhàng hoặc giao lưu xã hội mỗi tuần (Mục tiêu: >= 3 ngày).'
    ]
  }
};

export function cleanVerbatimText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^\d+[\.\s]+Chỉ số [^\n\r]+/gmi, '')
    .replace(/Ngườitruyềnđộnglực/g, 'Người truyền động lực')
    .replace(/nhữngquanđiểm/g, 'những quan điểm')
    .replace(/khảnăng/g, 'khả năng')
    .replace(/đượchoàn/g, 'được hoàn')
    .replace(/nhàlãnhđạo/g, 'nhà lãnh đạo')
    .replace(/địnhhướng/g, 'định hướng')
    .replace(/củamình/g, 'của mình')
    .replace(/pháttriển/g, 'phát triển')
    .replace(/thànhcông/g, 'thành công')
    .replace(/nănglượng/g, 'năng lượng')
    .replace(/cách -0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
