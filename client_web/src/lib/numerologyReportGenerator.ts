/**
 * KIẾN TRÚC PHÂN TẦNG 3 LỚP LUẬN GIẢI THẦN SỐ HỌC (3-LAYERED INTERPRETATION FUNNEL)
 * Tầng 1: Ý nghĩa bản thân chỉ số (Concept Definition - Hook cho Khách vãng lai / Guest)
 * Tầng 2: Ý nghĩa con số cụ thể (Specific Number Analysis - Dành cho Free User đã Login Google)
 * Tầng 3: Luận giải đa chiều cá nhân hóa độc bản (Dynamic Synthesis - Dành cho Paid User)
 */

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
    definition: 'Chỉ số Đường Đời là con số quan trọng nhất trong bản đồ Thần số học Pythagoras. Nó đại diện cho con đường vận mệnh, bài học tiến hóa chủ đạo và mục đích tối thượng mà linh hồn bạn lựa chọn để trải nghiệm trong kiếp sống này.',
    whyItMatters: 'Hiểu được Đường Đời giúp bạn nhận diện dòng chảy năng lượng tự nhiên của cuộc đời, từ đó đưa ra các lựa chọn học tập, sự nghiệp và phong cách sống thuận theo tự nhiên thay vì đi ngược lại dòng chảy.',
    hookQuestion: 'Con số Đường Đời của bạn mang năng lượng dẫn đường nào và ẩn chứa bài học thử thách gì?'
  },
  expression: {
    name: 'Chỉ Số Sứ Mệnh (Destiny / Expression)',
    code: 'expression',
    definition: 'Chỉ số Sứ Mệnh đại diện cho kho tàng năng lực tự nhiên, công cụ và phương tiện mạnh mẽ nhất mà bạn sở hữu để đạt được thành tựu và hiện thực hóa mục tiêu cuộc đời.',
    whyItMatters: 'Nếu Đường Đời là đích đến, thì Sứ Mệnh chính là cỗ xe giúp bạn đi tới đích. Nắm vững Sứ Mệnh giúp bạn phát huy tối đa 100% sở trường nghề nghiệp.',
    hookQuestion: 'Bạn sinh ra để làm gì và công cụ mạnh mẽ nhất bạn đang sở hữu là gì?'
  },
  heart_desire: {
    name: 'Chỉ Số Linh Hồn (Soul Urge / Heart\'s Desire)',
    code: 'heart_desire',
    definition: 'Chỉ số Linh Hồn đại diện cho những khát khao thầm kín, động lực sâu thẳm trong tâm hồn và điều gì thực sự mang lại cảm giác bình an, thỏa nguyện và hạnh phúc trọn vẹn cho bạn.',
    whyItMatters: 'Có những người đạt được thành công vật chất bên ngoài nhưng vẫn cảm thấy trống rỗng bởi vì họ chưa nuôi dưỡng đúng nhu cầu của con số Linh Hồn.',
    hookQuestion: 'Tâm hồn bạn thực sự khao khát điều gì để cảm thấy hạnh phúc đích thực?'
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
  while (num > 9) {
    if (keepMaster && (num === 11 || num === 22 || num === 33)) return num;
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
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

  const dR = reduceNumber(day, true);
  const mR = reduceNumber(month, true);
  const yR = reduceNumber(year, true);
  const lifePath = reduceNumber(dR + mR + yR, true);

  const cleanName = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');

  let expressionSum = 0;
  let soulSum = 0;
  let personalitySum = 0;

  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    const val = PYTHAGOREAN_MAP[char] || 0;
    expressionSum += val;
    if (VOWELS.has(char)) {
      soulSum += val;
    } else {
      personalitySum += val;
    }
  }

  const expression = reduceNumber(expressionSum, true);
  const heartDesire = reduceNumber(soulSum, true);
  const personality = reduceNumber(personalitySum, true);
  const birthday = reduceNumber(day, false);
  const attitude = reduceNumber(day + month, false);
  const currentYear = new Date().getFullYear();
  const personalYear = reduceNumber(day + month + reduceNumber(currentYear, false), false);

  return {
    life_path: lifePath,
    expression,
    heart_desire: heartDesire,
    personality,
    birthday,
    attitude,
    personal_year_current: personalYear,
    karmic_lessons: [13, 14, 16, 19].filter(n => n === lifePath || n === expression),
  };
}

/**
 * Sinh bộ dữ liệu 3 tầng cho giao diện và báo cáo
 */
export function generate3LayerNumerologyData(customer: any) {
  const map = customer?.map || {};
  const lp = map.life_path || 1;
  const exp = map.expression || 1;
  const hd = map.heart_desire || 1;
  const py = map.personal_year_current || ((new Date().getFullYear() % 9) || 9);

  const fullName = `${customer?.last_name || ''} ${customer?.first_name || ''}`.trim() || 'Bạn';

  const lpData = NUMBER_SPECIFIC_MEANINGS[lp] || NUMBER_SPECIFIC_MEANINGS[1];
  const expData = NUMBER_SPECIFIC_MEANINGS[exp] || NUMBER_SPECIFIC_MEANINGS[1];
  const hdData = NUMBER_SPECIFIC_MEANINGS[hd] || NUMBER_SPECIFIC_MEANINGS[1];

  // TẦNG 1: Ý nghĩa bản thân chỉ số (Guest Hook)
  const layer1 = {
    life_path: {
      ...INDICATOR_DEFINITIONS.life_path,
      userNumber: lp,
      hook: lpData.shortHook,
    },
    expression: {
      ...INDICATOR_DEFINITIONS.expression,
      userNumber: exp,
      hook: expData.shortHook,
    },
    heart_desire: {
      ...INDICATOR_DEFINITIONS.heart_desire,
      userNumber: hd,
      hook: hdData.shortHook,
    }
  };

  // TẦNG 2: Ý nghĩa con số cụ thể của người dùng (Free User sau khi Login Google)
  const layer2 = {
    overviewTitle: `Bản Sắc Năng Lượng Con Số Của ${fullName}`,
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
    }
  };

  // TẦNG 3: Luận giải đa chiều độc bản (Paid User 17 chỉ số)
  const layer3 = {
    crossSynthesis: `Phân Tích Tương Tác Ma Trận Đa Chiều:\n• Điểm hội tụ: Bạn sở hữu Con số Đường Đời ${lp} kết hợp cùng Sứ Mệnh ${exp}. Năng lượng của số ${lp} giúp bạn xác định phương hướng rõ ràng, trong khi số ${exp} cung cấp bộ công cụ sắc bén để hiện thực hóa.\n• Tiếng nói nội tâm: Chỉ số Linh Hồn ${hd} nhắc nhở bạn rằng thành công bên ngoài chỉ thực sự trọn vẹn khi bạn thỏa mãn được khát khao bình an và ý nghĩa bên trong.`,
    challenges: {
      obstacles: `Thách thức chủ đạo: Cần vượt qua điểm yếu cố hữu của con số ${lp}, đặc biệt là: ${lpData.weaknesses.join(', ')}.`,
      karmicLessons: map.karmic_lessons && map.karmic_lessons.length > 0
        ? `Bài học nợ nghiệp cần hoàn tất: Con số [${map.karmic_lessons.join(', ')}]. Hãy chú trọng rèn luyện tính kiên trì và kỷ luật tự thân.`
        : `Bản đồ của bạn không có Nợ nghiệp lớn, đây là một thuận duyên lớn giúp bạn phát triển bứt phá khi đi đúng hướng.`
    },
    actionRoadmap: {
      actionPlan: `1. Xác lập mục tiêu rõ ràng phù hợp với trường năng lượng số ${lp}.\n2. Tận dụng tối đa thế mạnh ngoại giao và công cụ của Sứ Mệnh ${exp}.\n3. Dành thời gian nuôi dưỡng tâm hồn theo nhu cầu số ${hd}.`,
      careerGuide: `Môi trường nghề nghiệp đỉnh cao dành cho bạn là nơi tôn trọng sự tự chủ, sáng tạo và có lộ trình phát triển minh bạch.`,
      personalYear: `Năm Cá Nhân ${py}: Đây là giai đoạn chiến lược để bạn tái cấu trúc và đón đầu những vận hội mới!`
    }
  };

  return { layer1, layer2, layer3 };
}
