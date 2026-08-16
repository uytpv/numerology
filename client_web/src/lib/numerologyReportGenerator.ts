/**
 * KIẾN TRÚC PHÂN TẦNG 3 LỚP LUẬN GIẢI THẦN SỐ HỌC (3-LAYERED INTERPRETATION FUNNEL)
 * Tầng 1: Ý nghĩa bản thân chỉ số (Concept Definition - Hook cho Khách vãng lai / Guest)
 * Tầng 2: Ý nghĩa con số cụ thể (Specific Number Analysis - Dành cho Free User đã Login Google)
 * Tầng 3: Luận giải đa chiều cá nhân hóa độc bản (Dynamic Synthesis - Dành cho Paid User)
 */

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

  // 21 INDICATOR ITEMS DÀNH CHO TAB 2 (GRID 21 THẺ VỚI BREAKDOWN HỢP THÀNH)
  const grid21Indicators = [
    { id: 'lp', number: `${lp}`, breakdown: breakdowns.life_path, title: 'ĐƯỜNG ĐỜI', desc: 'Số phận, sức mạnh và nét đặc biệt trong tính cách của bạn. Những trở ngại bạn có thể gặp phải để hoàn thành bài học.' },
    { id: 'bal', number: `${balance}`, breakdown: breakdowns.balance, title: 'CÂN BẰNG', desc: 'Cách bạn đối diện với vấn đề và nghịch cảnh.' },
    { id: 'exp', number: `${exp}`, breakdown: breakdowns.expression, title: 'SỨ MỆNH', desc: 'La bàn dẫn lối giúp bạn hoàn thành sứ mệnh và mang lại những giá trị to lớn cho cuộc đời.' },
    { id: 'lpe', number: `${calculatedMap.lpe_bridge || 2}`, breakdown: '', title: 'LIÊN KẾT ĐƯỜNG ĐỜI – SỨ MỆNH', desc: 'Việc bạn cần làm để tốt nghiệp bài học cuộc đời và thực hiện sứ mệnh.' },
    { id: 'hd', number: `${hd}`, breakdown: breakdowns.heart_desire, title: 'LINH HỒN', desc: 'Khao khát ẩn giấu trong tâm hồn, lý do phía sau mọi hành động của bạn.' },
    { id: 'dob', number: `${birthday}`, breakdown: breakdowns.birthday, title: 'NGÀY SINH', desc: 'Những đặc điểm, lĩnh vực chuyên môn hoặc kỹ năng bạn cần phát triển và sẽ thành công nếu muốn gắn bó cả đời với chúng.' },
    { id: 'per', number: `${personality}`, breakdown: breakdowns.personality, title: 'NHÂN CÁCH', desc: 'Cá tính, thế giới quan, các mối quan hệ và các vấn đề trong cách bạn đối nhân xử thế.' },
    { id: 'hdp', number: `${calculatedMap.hdp_bridge || 1}`, breakdown: '', title: 'LIÊN KẾT LINH HỒN – NHÂN CÁCH', desc: 'Cầu nối liên kết cách nhìn của bạn về bản thân và hình ảnh của bạn trong mắt người khác.' },
    { id: 'mat', number: `${maturity}`, breakdown: breakdowns.maturity, title: 'TRƯỞNG THÀNH', desc: 'Con người, giá trị, khát vọng, mục tiêu của bạn trong thời kỳ "vàng son" từ 30 – 40 tuổi.' },
    { id: 'att', number: `${attitude}`, breakdown: breakdowns.attitude, title: 'THÁI ĐỘ', desc: 'Mô tả thái độ và cách bạn nhìn nhận các tình huống hằng ngày.' },
    { id: 'kar', number: calculatedMap.karmic_lessons?.length > 0 ? calculatedMap.karmic_lessons.join(',') : '2,4,9', breakdown: '', title: 'THIẾU', desc: 'Điểm yếu bạn cần khắc phục.' },
    { id: 'les', number: '-', breakdown: '', title: 'BÀI HỌC', desc: 'Những bài học bạn cần chinh phục để hoàn thiện bản thân.' },
    { id: 'rat', number: `${rationalThought}`, breakdown: breakdowns.rational_thought, title: 'TƯ DUY LÝ TRÍ', desc: 'Lối tư duy và hướng ra quyết định của bạn.' },
    { id: 'sub', number: `${subconsciousConfidence}`, breakdown: '', title: 'SỨC MẠNH TIỀM THỨC', desc: 'Đặc điểm tính cách mà bạn cần phát triển để ứng phó và giải quyết vấn đề.' },
    { id: 'pas', number: '5', breakdown: '', title: 'ĐAM MÊ', desc: 'Kỹ năng đặc biệt, sở thích, đam mê, những hoạt động mang đến sự nhận thức và niềm vui cho bạn.' },
    { id: 'py', number: `${calculatedMap.personal_year_current || '6'}`, breakdown: '', title: 'NĂM CÁ NHÂN', desc: 'Những thay đổi sẽ xảy ra trong những năm tới và cách bạn ứng xử.' },
    { id: 'pm', number: `${((calculatedMap.personal_year_current + new Date().getMonth()) % 9) + 1 || '7'}`, breakdown: '', title: 'THÁNG CÁ NHÂN', desc: 'Những thay đổi sẽ xảy ra trong những tháng tới và cách bạn ứng xử.' },
    { id: 'pin', number: '5,8,4,9', breakdown: '', title: 'CHẶNG', desc: 'Mức độ trưởng thành, trách nhiệm, khả năng lĩnh hội, các sự kiện quan trọng trong mỗi giai đoạn cuộc đời.' },
    { id: 'pd', number: `${((calculatedMap.personal_year_current + 2) % 9) || 8}`, breakdown: '', title: 'NGÀY CÁ NHÂN', desc: 'Gợi ý những hành động phù hợp cho một ngày hiệu quả của bạn.' },
    { id: 'gen', number: `${reduceNumber(yearFromDob(customer?.dob) || 6, false)}`, breakdown: '', title: 'THẾ HỆ', desc: 'Giúp bạn nhận biết những yêu cầu và kỳ vọng bạn cần làm để phù hợp với thời đại của mình.' },
    { id: 'cha', number: '1,4,3,3', breakdown: '', title: 'THÁCH THỨC', desc: 'Vấn đề lớn bạn sẽ đối mặt trong các giai đoạn và cách bạn nên làm để vượt qua.' }
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

  // TẦNG 3: LUẬN GIẢI ĐA CHIỀU ĐỘC BẢN (AI DYNAMIC SYNTHESIS)
  const currentWorldYear = new Date().getFullYear();
  const worldYearNumber = reduceNumber(currentWorldYear, false);
  const currentWorldMonth = new Date().getMonth() + 1;
  const worldMonthNumber = reduceNumber(worldYearNumber + currentWorldMonth, false);

  const layer3 = {
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
      forecast: `Năm Thế Giới ${worldYearNumber} & Tháng Thế Giới ${worldMonthNumber} mang năng lượng chuyển động chung. Kết hợp với Năm Cá Nhân ${py} của bạn, đây là thời điểm chiến lược để bạn đón đầu cơ hội, tái cấu trúc mục tiêu và bứt phá mạnh mẽ.`
    },
    crossSynthesis: `Phân Tích Tương Tác Ma Trận Đa Chiều:\n• Trường năng lượng chủ đạo: ${fullName} mang Đường Đời ${lp}${breakdowns.life_path ? ` (hợp thành từ ngày/tháng/năm: ${breakdowns.life_path})` : ''} kết hợp cùng Sứ Mệnh ${exp}${breakdowns.expression ? ` (hợp thành từ các từ: ${breakdowns.expression})` : ''}.${
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

  // TÍNH TOÁN SƠ ĐỒ KIM TỰ THÁP (4 ĐỈNH CAO & 4 THÁCH THỨC)
  const pyramidData = calculatePyramidDetails(customer?.dob || '01/01/1990', lp);

  // TÍNH TOÁN TIMELINE NGẮN HẠN (NĂM, THÁNG & 7 NGÀY CÁ NHÂN)
  const shortTermTimeline = calculateTimelineDetails(customer?.dob || '01/01/1990', py);

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


