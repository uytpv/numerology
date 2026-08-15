/**
 * Thư viện tính toán Thần số học Pythagoras (Backend Utility)
 * Đảm bảo 100% đồng bộ với Client Web
 */

export interface CustomerInput {
  first_name: string;
  last_name: string;
  dob: string;
}

export function total(s: number | string): number {
  let val = Math.floor(Number(s));
  if (isNaN(val)) return 0;
  if (val < 10 || val === 11 || val === 22 || val === 33) return val;
  let r = 0;
  for (const char of val.toString().split('')) {
    r += parseInt(char, 10);
  }
  while (r > 9 && r !== 11 && r !== 22 && r !== 33) {
    const temp = r.toString().split('');
    r = 0;
    for (const char of temp) {
      r += parseInt(char, 10);
    }
  }
  return r;
}

export function totalIgnoreMaster(s: number | string): number {
  let val = Math.floor(Number(s));
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

export function getVowelAndConsonant(word: string): { vowel: string; consonant: string } {
  const vowelsList = ['a', 'e', 'i', 'o', 'u', 'y', 'A', 'E', 'I', 'O', 'U', 'Y'];
  const result = { vowel: '', consonant: '' };

  if (!word) return result;
  if (word.length === 1 && word.toLowerCase() === 'y') {
    result.vowel += word;
    return result;
  }

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const lowerChar = char.toLowerCase();

    if (vowelsList.includes(char)) {
      if (lowerChar === 'y') {
        if (i === 0) {
          result.consonant += char;
        } else {
          const prevChar = word[i - 1];
          if (!vowelsList.includes(prevChar)) {
            result.vowel += char;
          } else {
            result.consonant += char;
          }
        }
      } else {
        result.vowel += char;
      }
    } else {
      result.consonant += char;
    }
  }
  return result;
}

export function getFirstOfWord(str: string): string {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  let res = '';
  for (const word of words) {
    if (word.length > 0) res += word[0];
  }
  return res;
}

export function parseDob(dob: string): { day: number; month: number; year: number } {
  const cleanDob = dob.replace(/-/g, '/');
  const parts = cleanDob.split('/');
  if (parts.length !== 3) {
    return { day: 1, month: 1, year: 1970 };
  }
  return {
    day: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    year: parseInt(parts[2], 10)
  };
}

export function calculateNumerologyMap(customer: CustomerInput) {
  const { day, month, year } = parseDob(customer.dob);
  
  // 1. Life Path
  const yr = total(year);
  const mon = total(month);
  const date = total(day);
  const life_path = total(yr + mon + date);

  // 2. Expression
  const cleanFirst = convertViToEn(customer.first_name.trim());
  const cleanLast = convertViToEn(customer.last_name.trim());
  const fn = total(textToNumber(cleanFirst));
  const lastWords = cleanLast.split(/\s+/).filter(Boolean);
  let total_ln = 0;
  for (const word of lastWords) {
    total_ln += total(textToNumber(word));
  }
  const expression = total(fn + total_ln);

  // 3. Heart's Desire
  const fullName = `${lastNamePart(cleanLast)} ${cleanFirst}`.trim();
  const words = fullName.split(/\s+/).filter(Boolean);
  let vowels = '';
  for (const w of words) {
    vowels += getVowelAndConsonant(w).vowel;
  }
  const heart_desire = total(textToNumber(vowels));

  // 4. Personality
  let consonants = '';
  for (const w of words) {
    consonants += getVowelAndConsonant(w).consonant;
  }
  const personality = total(textToNumber(consonants));

  // Bridges
  const lpe_bridge = Math.abs(totalIgnoreMaster(life_path) - totalIgnoreMaster(expression));
  const hdp_bridge = Math.abs(totalIgnoreMaster(heart_desire) - totalIgnoreMaster(personality));

  // Balance
  const firstLetters = getFirstOfWord(fullName);
  const balance = total(textToNumber(firstLetters));

  // Birthday
  const birthday = total(day);

  // Maturity
  const maturity = total(life_path + expression);

  // Karmic Lessons
  let combinedNumbers = textToNumber(cleanFirst);
  for (const word of lastWords) {
    combinedNumbers += textToNumber(word);
  }
  const karmic_lessons: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!combinedNumbers.includes(i.toString())) {
      karmic_lessons.push(i);
    }
  }

  // Rational Thought
  const rational_thought = total(fn + total(day));

  // Subconscious Confidence
  const subconscious_confidence = 9 - karmic_lessons.length;

  // Hidden Passion
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (let i = 0; i < combinedNumbers.length; i++) {
    const dVal = parseInt(combinedNumbers[i], 10);
    if (dVal >= 1 && dVal <= 9) counts[dVal]++;
  }
  let maxCount = 0;
  for (let i = 1; i <= 9; i++) {
    if (counts[i] > maxCount) maxCount = counts[i];
  }
  const hidden_passion: number[] = [];
  if (maxCount > 0) {
    for (let i = 1; i <= 9; i++) {
      if (counts[i] === maxCount) hidden_passion.push(i);
    }
  }

  // Pinnacles and Challenges
  const r_three = totalIgnoreMaster(year);
  const r_one = totalIgnoreMaster(month);
  const r_two = totalIgnoreMaster(day);
  const lpIgnore = totalIgnoreMaster(r_three + r_one + r_two);

  const c_one = Math.abs(r_one - r_two);
  const c_two = Math.abs(r_two - r_three);
  const c_three = Math.abs(c_one - c_two);
  const c_four = Math.abs(r_three - r_one);

  const p_one = totalIgnoreMaster(r_one + r_two);
  const p_two = totalIgnoreMaster(r_two + r_three);
  const p_three = totalIgnoreMaster(p_one + p_two);
  const p_four = total(totalIgnoreMaster(month) + totalIgnoreMaster(year));

  const age_one = 36 - lpIgnore;
  const age_two = age_one + 9;
  const age_three = age_two + 9;
  const age_four = age_three + 9;

  // Personal Year and Months
  const thisYearRed = total(new Date().getFullYear());
  const personalYearsAndMonths: Record<number, number[]> = {};
  for (let i = 0; i < 9; i++) {
    const py = totalIgnoreMaster(total(day) + total(month) + thisYearRed + i);
    personalYearsAndMonths[py] = [];
    for (let j = 1; j <= 12; j++) {
      personalYearsAndMonths[py].push(totalIgnoreMaster(py + j));
    }
  }

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
    challenge: [c_one, c_two, c_three, c_four],
    pinnacle: [p_one, p_two, p_three, p_four],
    age: [age_one, age_two, age_three, age_four],
    root: [r_one, r_two, r_three],
    year: personalYearsAndMonths
  };
}

function lastNamePart(last: string): string {
  return last ? last.trim() : '';
}
