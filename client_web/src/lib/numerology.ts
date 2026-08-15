/**
 * Thư viện tính toán Thần số học Pythagoras (Pythagorean Numerology)
 * Chuyển đổi từ mã nguồn PHP (Indicator.php) sang TypeScript
 * Đảm bảo tính nhất quán 1:1 với logic cũ của hệ thống
 */

// Định nghĩa giao diện cho thông tin khách hàng đầu vào
export interface CustomerInput {
  first_name: string; // Tên của khách hàng (ví dụ: "Vy")
  last_name: string;  // Họ và chữ lót (ví dụ: "Nguyễn Hoàng Khánh")
  dob: string;        // Ngày sinh định dạng DD/MM/YYYY (ví dụ: "15/11/1980")
}

// Định nghĩa giao diện kết quả tính toán chi tiết của bản đồ
export interface NumerologyMap {
  life_path: number;
  expression: number;
  lpe_bridge: number;
  heart_desire: number;
  personality: number;
  hdp_bridge: number;
  balance: number;
  birthday: number;
  maturity: number;
  karmic_lessons: number[];
  rational_thought: number;
  subconscious_confidence: number;
  hidden_passion: number[];
  challenge: number[];
  pinnacle: number[];
  age: number[];
  root: number[];
  year: Record<number, number[]>;
}

/**
 * Hàm tính tổng các chữ số và rút gọn về 1 chữ số (1-9) hoặc giữ lại số Master (11, 22, 33).
 * Đây là hàm rút gọn số tiêu chuẩn của Pythagoras.
 */
export function total(s: number | string): number {
  let val = Math.floor(Number(s));
  if (isNaN(val)) return 0;

  // Nếu số nhỏ hơn 10 hoặc là số Master (11, 22, 33) thì giữ nguyên
  if (val < 10 || val === 11 || val === 22 || val === 33) {
    return val;
  }

  // Cộng dồn các chữ số
  let r = 0;
  const digits = val.toString().split('');
  for (const char of digits) {
    r += parseInt(char, 10);
  }

  // Tiếp tục rút gọn nếu kết quả lớn hơn 9 và không phải số Master
  while (r > 9 && r !== 11 && r !== 22 && r !== 33) {
    const temp = r.toString().split('');
    r = 0;
    for (const char of temp) {
      r += parseInt(char, 10);
    }
  }

  return r;
}

/**
 * Hàm rút gọn số nhưng bỏ qua số Master (rút gọn triệt để về 1 chữ số từ 1 đến 9).
 * Sử dụng cho các chỉ số chặng đường, thách thức, năm/tháng cá nhân.
 */
export function totalIgnoreMaster(s: number | string): number {
  let val = Math.floor(Number(s));
  if (isNaN(val)) return 0;

  let r = 0;
  const digits = val.toString().split('');
  for (const char of digits) {
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

/**
 * Loại bỏ dấu tiếng Việt để đưa chuỗi ký tự về dạng tiếng Anh chuẩn không dấu.
 */
export function convertViToEn(str: string): string {
  if (!str) return '';
  let res = str;
  res = res.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  res = res.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  res = res.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  res = res.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  res = res.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  res = res.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  res = res.replace(/(đ)/g, 'd');
  res = res.replace(/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/g, 'A');
  res = res.replace(/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/g, 'E');
  res = res.replace(/(Ì|Í|Ị|Ỉ|Ĩ)/g, 'I');
  res = res.replace(/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/g, 'O');
  res = res.replace(/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/g, 'U');
  res = res.replace(/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/g, 'Y');
  res = res.replace(/(Đ)/g, 'D');
  return res;
}

/**
 * Quy đổi các chữ cái không dấu sang các con số tương ứng từ 1 đến 9 theo hệ thống Pythagoras.
 */
export function textToNumber(s: string): string {
  const one = ['a', 'j', 's', 'A', 'J', 'S'];
  const two = ['b', 'k', 't', 'B', 'K', 'T'];
  const three = ['c', 'l', 'u', 'C', 'L', 'U'];
  const four = ['d', 'm', 'v', 'D', 'M', 'V'];
  const five = ['e', 'n', 'w', 'E', 'N', 'W'];
  const six = ['f', 'o', 'x', 'F', 'O', 'X'];
  const seven = ['g', 'p', 'y', 'G', 'P', 'Y'];
  const eight = ['h', 'q', 'z', 'H', 'Q', 'Z'];
  const nine = ['i', 'r', 'I', 'R'];

  let result = '';
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (one.includes(char)) result += '1';
    else if (two.includes(char)) result += '2';
    else if (three.includes(char)) result += '3';
    else if (four.includes(char)) result += '4';
    else if (five.includes(char)) result += '5';
    else if (six.includes(char)) result += '6';
    else if (seven.includes(char)) result += '7';
    else if (eight.includes(char)) result += '8';
    else if (nine.includes(char)) result += '9';
  }
  return result;
}

/**
 * Phân tách nguyên âm và phụ âm trong từ.
 * Chứa thuật toán xử lý đặc biệt cho chữ Y:
 * - Nếu từ chỉ có 1 ký tự duy nhất và là chữ Y -> Y là NGUYÊN ÂM.
 * - Nếu Y đứng đầu từ -> Y là PHỤ ÂM.
 * - Nếu trước Y là một phụ âm -> Y là NGUYÊN ÂM.
 * - Nếu trước Y là một nguyên âm -> Y là PHỤ ÂM.
 */
export function getVowelAndConsonant(word: string): { vowel: string; consonant: string } {
  const vowelsList = ['a', 'e', 'i', 'o', 'u', 'y', 'A', 'E', 'I', 'O', 'U', 'Y'];
  const standardVowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];

  const result = {
    vowel: '',
    consonant: ''
  };

  if (!word) return result;

  // Trường hợp từ chỉ dài 1 ký tự và là Y
  if (word.length === 1 && (word.toLowerCase() === 'y')) {
    result.vowel += word;
    return result;
  }

  // Duyệt qua từng ký tự trong từ
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const lowerChar = char.toLowerCase();

    if (vowelsList.includes(char)) {
      if (lowerChar === 'y') {
        if (i === 0) {
          // Y đứng đầu từ là phụ âm
          result.consonant += char;
        } else {
          // Kiểm tra chữ đứng trước Y
          const prevChar = word[i - 1];
          if (!vowelsList.includes(prevChar)) {
            // Chữ trước Y KHÔNG PHẢI là nguyên âm (tức là phụ âm) -> Y là nguyên âm
            result.vowel += char;
          } else {
            // Chữ trước Y là nguyên âm -> Y là phụ âm
            result.consonant += char;
          }
        }
      } else {
        // Nguyên âm tiêu chuẩn (a, e, i, o, u)
        result.vowel += char;
      }
    } else {
      // Phụ âm tiêu chuẩn
      result.consonant += char;
    }
  }

  return result;
}

/**
 * Trích xuất các chữ cái đầu tiên của từng từ trong chuỗi.
 */
export function getFirstOfWord(str: string): string {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  let res = '';
  for (const word of words) {
    if (word.length > 0) {
      res += word[0];
    }
  }
  return res;
}

/**
 * Phân tách ngày sinh từ chuỗi dạng DD/MM/YYYY thành ngày, tháng, năm số nguyên.
 */
export function parseDob(dob: string): { day: number; month: number; year: number } {
  // Chuẩn hóa định dạng ngày sinh, chấp nhận dấu gạch chéo hoặc gạch ngang
  const cleanDob = dob.replace(/-/g, '/');
  const parts = cleanDob.split('/');
  if (parts.length !== 3) {
    // Trả về ngày mặc định nếu sai định dạng
    return { day: 1, month: 1, year: 1970 };
  }
  return {
    day: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    year: parseInt(parts[2], 10)
  };
}

// ---------------------------------------------------------
// CÁC HÀM TÍNH TOÁN CHỈ SỐ CỤ THỂ
// ---------------------------------------------------------

/**
 * 1. Tính chỉ số Đường đời (Life Path)
 */
export function calculateLifePath(dob: string): number {
  const { day, month, year } = parseDob(dob);
  const yr = total(year);
  const mon = total(month);
  const date = total(day);
  return total(yr + mon + date);
}

/**
 * 2. Tính chỉ số Sứ mệnh / Biểu đạt (Expression)
 */
export function calculateExpression(firstName: string, lastName: string): number {
  const cleanFirst = convertViToEn(firstName.trim());
  const cleanLast = convertViToEn(lastName.trim());

  const fn = total(textToNumber(cleanFirst));
  
  const lastWords = cleanLast.split(/\s+/).filter(Boolean);
  let total_ln = 0;
  for (const word of lastWords) {
    total_ln += total(textToNumber(word));
  }

  return total(fn + total_ln);
}

/**
 * 3. Tính chỉ số Khao khát trái tim / Linh hồn (Heart Desire)
 */
export function calculateHeartDesire(firstName: string, lastName: string): number {
  const fullName = `${lastName.trim()} ${firstName.trim()}`;
  const cleanName = convertViToEn(fullName);
  const words = cleanName.split(/\s+/).filter(Boolean);

  let vowels = '';
  for (const w of words) {
    vowels += getVowelAndConsonant(w).vowel;
  }

  return total(textToNumber(vowels));
}

/**
 * 4. Tính chỉ số Nhân cách (Personality)
 */
export function calculatePersonality(firstName: string, lastName: string): number {
  const fullName = `${lastName.trim()} ${firstName.trim()}`;
  const cleanName = convertViToEn(fullName);
  const words = cleanName.split(/\s+/).filter(Boolean);

  let consonants = '';
  for (const w of words) {
    consonants += getVowelAndConsonant(w).consonant;
  }

  return total(textToNumber(consonants));
}

/**
 * 5. Tính chỉ số Cân bằng (Balance)
 */
export function calculateBalance(firstName: string, lastName: string): number {
  const fullName = `${lastName.trim()} ${firstName.trim()}`;
  const cleanName = convertViToEn(fullName);
  const firstLetters = getFirstOfWord(cleanName);
  return total(textToNumber(firstLetters));
}

/**
 * 6. Tính chỉ số Ngày sinh (Birthday)
 */
export function calculateBirthday(dob: string): number {
  const { day } = parseDob(dob);
  return total(day);
}

/**
 * 7. Tính chỉ số Bài học nghiệp / Chỉ số thiếu (Karmic Lessons)
 */
export function calculateKarmicLessons(firstName: string, lastName: string): number[] {
  const cleanFirst = textToNumber(convertViToEn(firstName.trim()));
  const lastWords = convertViToEn(lastName.trim()).split(/\s+/).filter(Boolean);
  
  let combinedNumbers = cleanFirst;
  for (const word of lastWords) {
    combinedNumbers += textToNumber(word);
  }

  const kl: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!combinedNumbers.includes(i.toString())) {
      kl.push(i);
    }
  }
  return kl;
}

/**
 * 8. Tính chỉ số Tư duy lý trí (Rational Thought)
 */
export function calculateRationalThought(firstName: string, dob: string): number {
  const cleanFirst = convertViToEn(firstName.trim());
  const fn = total(textToNumber(cleanFirst));
  
  const { day } = parseDob(dob);
  const date = total(day);

  return total(fn + date);
}

/**
 * 9. Tính chỉ số Đam mê ẩn giấu (Hidden Passion)
 */
export function calculateHiddenPassion(firstName: string, lastName: string): number[] {
  const cleanFirst = textToNumber(convertViToEn(firstName.trim()));
  const lastWords = convertViToEn(lastName.trim()).split(/\s+/).filter(Boolean);
  
  let combinedNumbers = cleanFirst;
  for (const word of lastWords) {
    combinedNumbers += textToNumber(word);
  }

  // Đếm tần suất xuất hiện của các chữ số từ 1 đến 9
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    counts[i] = 0;
  }

  for (let i = 0; i < combinedNumbers.length; i++) {
    const digit = parseInt(combinedNumbers[i], 10);
    if (digit >= 1 && digit <= 9) {
      counts[digit] = (counts[digit] || 0) + 1;
    }
  }

  // Tìm tần suất lớn nhất (chỉ xét những số có xuất hiện ít nhất 1 lần)
  let maxCount = 0;
  for (let i = 1; i <= 9; i++) {
    if (counts[i] > maxCount) {
      maxCount = counts[i];
    }
  }

  const hp: number[] = [];
  if (maxCount > 0) {
    for (let i = 1; i <= 9; i++) {
      if (counts[i] === maxCount) {
        hp.push(i);
      }
    }
  }

  return hp;
}

/**
 * 10. Tính các chặng đỉnh cao, tuổi tương ứng và thách thức (Challenges and Pinnacles)
 */
export function calculateChallengesAndPinnacles(dob: string): {
  root: number[];
  challenge: number[];
  pinnacle: number[];
  age: number[];
} {
  const { day, month, year } = parseDob(dob);

  const r_three = totalIgnoreMaster(year); // Tổng rút gọn năm
  const r_one = totalIgnoreMaster(month); // Tổng rút gọn tháng
  const r_two = totalIgnoreMaster(day);   // Tổng rút gọn ngày

  const lifePathIgnoreMaster = totalIgnoreMaster(r_three + r_one + r_two);

  // Tính 4 thử thách (Challenges)
  const c_one = Math.abs(r_one - r_two);
  const c_two = Math.abs(r_two - r_three);
  const c_three = Math.abs(c_one - c_two);
  const c_four = Math.abs(r_three - r_one);

  // Tính 4 chặng đỉnh cao (Pinnacles)
  const p_one = totalIgnoreMaster(r_one + r_two);
  const p_two = totalIgnoreMaster(r_two + r_three);
  const p_three = totalIgnoreMaster(p_one + p_two);
  // Riêng chặng 4 cuối cùng có thể giữ lại các số Master (11, 22, 33) theo đúng logic PHP
  const p_four = total(totalIgnoreMaster(month) + totalIgnoreMaster(year));

  // Tính các tuổi chuyển giao chặng
  const age_one = 36 - lifePathIgnoreMaster;
  const age_two = age_one + 9;
  const age_three = age_two + 9;
  const age_four = age_three + 9;

  return {
    root: [r_one, r_two, r_three],
    challenge: [c_one, c_two, c_three, c_four],
    pinnacle: [p_one, p_two, p_three, p_four],
    age: [age_one, age_two, age_three, age_four]
  };
}

/**
 * 11. Tính năm cá nhân và tháng cá nhân trong vòng chu kỳ 9 năm tiếp theo
 */
export function calculateYearAndMonth(dob: string, currentYear: number = new Date().getFullYear()): Record<number, number[]> {
  const { day, month } = parseDob(dob);
  const m = total(month);
  const d = total(day);
  const thisYearReduced = total(currentYear);

  const personalYearsAndMonths: Record<number, number[]> = {};

  for (let i = 0; i < 9; i++) {
    // Năm cá nhân tiếp theo
    const personalYear = totalIgnoreMaster(d + m + thisYearReduced + i);
    
    // Tạo 12 tháng cá nhân tương ứng cho năm đó
    personalYearsAndMonths[personalYear] = [];
    for (let j = 1; j <= 12; j++) {
      personalYearsAndMonths[personalYear].push(totalIgnoreMaster(personalYear + j));
    }
  }

  return personalYearsAndMonths;
}

// ---------------------------------------------------------
// HÀM TỔNG HỢP TOÀN BỘ BẢN ĐỒ
// ---------------------------------------------------------

/**
 * Hàm master tính toán đầy đủ tất cả các chỉ số thần số học từ họ tên và ngày sinh khách hàng.
 */
export function calculateNumerologyMap(customer: CustomerInput): NumerologyMap {
  const life_path = calculateLifePath(customer.dob);
  const expression = calculateExpression(customer.first_name, customer.last_name);
  
  // Tính cầu nối giữa Đường đời và Sứ mệnh
  const lpe_bridge = Math.abs(totalIgnoreMaster(life_path) - totalIgnoreMaster(expression));
  
  const heart_desire = calculateHeartDesire(customer.first_name, customer.last_name);
  const personality = calculatePersonality(customer.first_name, customer.last_name);
  
  // Tính cầu nối giữa Linh hồn và Nhân cách
  const hdp_bridge = Math.abs(totalIgnoreMaster(heart_desire) - totalIgnoreMaster(personality));
  
  const balance = calculateBalance(customer.first_name, customer.last_name);
  const birthday = calculateBirthday(customer.dob);
  
  // Trưởng thành = Rút gọn tổng của Đường đời và Sứ mệnh
  const maturity = total(life_path + expression);
  
  const karmic_lessons = calculateKarmicLessons(customer.first_name, customer.last_name);
  const rational_thought = calculateRationalThought(customer.first_name, customer.dob);
  
  // Năng lực tiềm thức = 9 trừ đi số lượng chỉ số thiếu
  const subconscious_confidence = 9 - karmic_lessons.length;
  
  const hidden_passion = calculateHiddenPassion(customer.first_name, customer.last_name);
  
  const cp = calculateChallengesAndPinnacles(customer.dob);
  const year = calculateYearAndMonth(customer.dob);

  return {
    life_path,
    expression,
    lpe_bridge,
    heart_desire,
    personality,
    hdp_bridge,
    balance,
    birthday,
    maturity,
    karmic_lessons,
    rational_thought,
    subconscious_confidence,
    hidden_passion,
    challenge: cp.challenge,
    pinnacle: cp.pinnacle,
    age: cp.age,
    root: cp.root,
    year
  };
}
