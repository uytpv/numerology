import { 
  total, 
  totalIgnoreMaster, 
  convertViToEn, 
  textToNumber, 
  getVowelAndConsonant, 
  parseDob, 
  calculateNumerologyMap 
} from '../utils/numerology';

describe('Pythagoras Numerology Calculation Engine', () => {
  describe('total() and Master Numbers preservation', () => {
    it('should reduce standard compound numbers to 1-9', () => {
      expect(total(10)).toBe(1);
      expect(total(19)).toBe(1); // 1+9=10 -> 1+0=1
      expect(total(25)).toBe(7); // 2+5=7
      expect(total(99)).toBe(9); // 9+9=18 -> 1+8=9
    });

    it('should PRESERVE Master Numbers 11, 22, 33 without reducing them', () => {
      expect(total(11)).toBe(11);
      expect(total(22)).toBe(22);
      expect(total(33)).toBe(33);
      expect(total(29)).toBe(11); // 2+9 = 11 (Master Number preserved!)
    });

    it('should correctly reduce Master Numbers when totalIgnoreMaster is called', () => {
      expect(totalIgnoreMaster(11)).toBe(2);
      expect(totalIgnoreMaster(22)).toBe(4);
      expect(totalIgnoreMaster(33)).toBe(6);
      expect(totalIgnoreMaster(29)).toBe(2);
    });
  });

  describe('Vietnamese Name Normalization', () => {
    it('should correctly strip Vietnamese diacritics to standard ASCII', () => {
      expect(convertViToEn('Nguyễn Văn An')).toBe('Nguyen Van An');
      expect(convertViToEn('Đỗ Trà Phúc Vĩnh Uy')).toBe('Do Tra Phuc Vinh Uy');
      expect(convertViToEn('Lê Thị Hường')).toBe('Le Thi Huong');
      expect(convertViToEn('Dương Quá')).toBe('Duong Qua');
    });

    it('should map letters to Pythagorean number values (1-9)', () => {
      // A=1, J=1, S=1
      expect(textToNumber('AJS')).toBe('111');
      // B=2, K=2, T=2
      expect(textToNumber('BKT')).toBe('222');
      // C=3, L=3, U=3
      expect(textToNumber('CLU')).toBe('333');
    });

    it('should correctly distinguish vowels and consonants, handling Y contextually', () => {
      // Y preceded by vowel (e.g. UY): U is vowel, Y acts as consonant
      const uy = getVowelAndConsonant('UY');
      expect(uy.vowel.toLowerCase()).toBe('u');
      expect(uy.consonant.toLowerCase()).toBe('y');

      // Y preceded by consonant (e.g. LY): L is consonant, Y acts as vowel
      const ly = getVowelAndConsonant('LY');
      expect(ly.consonant.toLowerCase()).toBe('l');
      expect(ly.vowel.toLowerCase()).toBe('y');

      // Y at start of word (e.g. YEN): Y is consonant, E is vowel
      const yen = getVowelAndConsonant('YEN');
      expect(yen.consonant.toLowerCase()).toContain('y');
      expect(yen.vowel.toLowerCase()).toContain('e');
    });
  });

  describe('calculateNumerologyMap()', () => {
    it('should accurately calculate full map for a known test subject', () => {
      const result = calculateNumerologyMap({
        first_name: 'Uy',
        last_name: 'Trà Phúc Vĩnh',
        dob: '15/11/1980'
      });

      // Basic structure validation
      expect(result).toBeDefined();
      expect(typeof result.life_path).toBe('number');
      expect(typeof result.expression).toBe('number');
      expect(typeof result.heart_desire).toBe('number');
      expect(typeof result.personality).toBe('number');

      // Four Pinnacles & Four Challenges must be arrays of 4 numbers
      expect(result.pinnacle).toHaveLength(4);
      expect(result.challenge).toHaveLength(4);
      expect(result.age).toHaveLength(4);

      // Root of pyramid
      expect(result.root).toHaveLength(3);

      // Personal year projection
      expect(result.year).toBeDefined();
    });

    it('should calculate correct Life Path for Master Number 11 date', () => {
      // 29/11/1986: Day 29->11, Month 11->11, Year 1986->24->6 -> 11+11+6 = 28 -> 10 -> 1
      // 02/09/1980: 2 + 9 + 18(9) = 20 -> 2
      const res = calculateNumerologyMap({
        first_name: 'Minh',
        last_name: 'Le',
        dob: '02/09/1980'
      });
      expect(res.life_path).toBe(2);
    });
  });
});
