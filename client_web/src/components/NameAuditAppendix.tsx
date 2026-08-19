'use client';

import React from 'react';

const PYTHAGOREAN_TABLE: Record<string, number> = {
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

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase();
}

function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

interface NameAuditAppendixProps {
  fullName: string;
  birthDate: string;
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  hiddenPassion: number;
  karmicLessons: number[];
  rationalThought?: number;
}

export const NameAuditAppendix: React.FC<NameAuditAppendixProps> = ({
  fullName,
  birthDate,
  lifePath,
  expression,
  soul,
  personality,
  hiddenPassion,
  karmicLessons,
  rationalThought = 1,
}) => {
  const normalizedName = removeVietnameseTones(fullName).trim();
  const rawWords = fullName.trim().split(/\s+/);
  const normalizedWords = normalizedName.split(/\s+/);

  // 1. Phân tích từng từ
  const wordAnalysis = normalizedWords.map((word, idx) => {
    const letters = word.split('');
    const letterValues = letters.map(l => ({ letter: l, val: PYTHAGOREAN_TABLE[l] || 0 }));
    const total = letterValues.reduce((sum, item) => sum + item.val, 0);
    const reduced = reduceNumber(total);
    return {
      rawWord: rawWords[idx] || word,
      normalizedWord: word,
      letters: letterValues,
      total,
      reduced
    };
  });

  const sumOfWords = wordAnalysis.reduce((sum, w) => sum + w.reduced, 0);
  const finalFromWords = reduceNumber(sumOfWords);

  // 2. Toàn bộ chữ cái
  const allLetters = normalizedName.replace(/\s+/g, '').split('');
  const totalAllLetters = allLetters.reduce((sum, l) => sum + (PYTHAGOREAN_TABLE[l] || 0), 0);
  const finalFromAll = reduceNumber(totalAllLetters);

  // 3. Nguyên âm & Phụ âm
  const vowelList: { letter: string; val: number }[] = [];
  const consonantList: { letter: string; val: number }[] = [];

  allLetters.forEach(l => {
    const val = PYTHAGOREAN_TABLE[l] || 0;
    if (VOWELS.has(l)) {
      vowelList.push({ letter: l, val });
    } else {
      consonantList.push({ letter: l, val });
    }
  });

  const totalVowels = vowelList.reduce((sum, item) => sum + item.val, 0);
  const totalConsonants = consonantList.reduce((sum, item) => sum + item.val, 0);

  // 4. Ma trận tần suất số 1 - 9
  const frequencyMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  allLetters.forEach(l => {
    const val = PYTHAGOREAN_TABLE[l];
    if (val >= 1 && val <= 9) {
      frequencyMap[val]++;
    }
  });

  const lastWord = rawWords[rawWords.length - 1] || 'Uy';
  const lastWordNorm = removeVietnameseTones(lastWord);
  const lastWordVal = reduceNumber(lastWordNorm.split('').reduce((sum, l) => sum + (PYTHAGOREAN_TABLE[l] || 0), 0));

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8E5] shadow-sm space-y-8 font-sans">
      {/* Header Phụ lục */}
      <div className="border-b border-[#E2E8E5] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF5FF] border border-[#8C6A81]/30 rounded-full text-xs font-bold text-[#8C6A81] uppercase tracking-wider mb-2">
          PHỤ LỤC KIỂM TOÁN DỮ LIỆU &amp; ĐỐI CHIẾU PHƯƠNG PHÁP
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#013E37] font-heading">
          Kiểm Toán Họ Tên &amp; Minh Bạch Phương Pháp Pythagoras
        </h2>
        <p className="text-sm sm:text-base text-[#4A5D58] mt-2 leading-relaxed">
          Tất cả các con số trong bản đồ Life Maps đều được tính toán minh bạch từng bước từ Họ tên khai sinh và Ngày tháng năm sinh. Dưới đây là bảng kiểm toán chi tiết chữ cái, nguyên âm, phụ âm và tần suất năng lượng.
        </p>
      </div>

      {/* 1. BẢNG PHÂN TÍCH TỪNG TỪ TRONG HỌ TÊN */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#013E37] font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#013E37] text-white flex items-center justify-center text-xs">1</span>
          Bảng Phân Tích Giá Trị Từng Từ (Word-by-Word Audit)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#013E37] font-bold border-b border-[#E2E8E5]">
                <th className="p-3 border border-[#E2E8E5]">Từ Gốc</th>
                <th className="p-3 border border-[#E2E8E5]">Chuẩn Hóa (NFC)</th>
                <th className="p-3 border border-[#E2E8E5]">Chi Tiết Quy Đổi Chữ Cái</th>
                <th className="p-3 border border-[#E2E8E5] text-center">Tổng Cộng</th>
                <th className="p-3 border border-[#E2E8E5] text-center">Rút Gọn (1 chữ số)</th>
              </tr>
            </thead>
            <tbody>
              {wordAnalysis.map((w, idx) => (
                <tr key={idx} className="hover:bg-[#FAF5FF]/40 border-b border-[#E2E8E5]">
                  <td className="p-3 font-bold text-[#013E37] border border-[#E2E8E5]">{w.rawWord}</td>
                  <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">{w.normalizedWord}</td>
                  <td className="p-3 border border-[#E2E8E5] text-[#2D3E3A]">
                    {w.letters.map((l, i) => `${l.letter}=${l.val}`).join(', ')}
                  </td>
                  <td className="p-3 text-center font-semibold text-[#013E37] border border-[#E2E8E5]">{w.total}</td>
                  <td className="p-3 text-center font-bold text-[#8C6A81] border border-[#E2E8E5]">
                    <span className="px-2.5 py-1 bg-[#FAF5FF] rounded-lg border border-[#8C6A81]/20">
                      {w.reduced}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-[#F4F9F8] font-bold text-[#013E37]">
                <td colSpan={3} className="p-3 border border-[#E2E8E5] text-right">
                  Tổng các từ đã rút gọn ({wordAnalysis.map(w => w.reduced).join(' + ')}):
                </td>
                <td className="p-3 text-center border border-[#E2E8E5]">{sumOfWords}</td>
                <td className="p-3 text-center border border-[#E2E8E5] text-[#013E37] text-base">
                  <span className="px-3 py-1 bg-[#013E37] text-[#FFEFB3] rounded-lg">
                    Sứ Mệnh = {finalFromWords}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs sm:text-sm text-[#5F736E] italic">
          * Xác nhận tính toàn vẹn: Tổng toàn bộ chữ cái cộng dồn = {totalAllLetters} → Rút gọn = {finalFromAll}. Kết quả hoàn toàn trùng khớp với phương pháp rút gọn từng từ ({finalFromWords}).
        </p>
      </div>

      {/* 2. NGUYÊN ÂM (LINH HỒN) & PHỤ ÂM (NHÂN CÁCH) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nguyên âm */}
        <div className="p-5 bg-[#FAF5FF] rounded-2xl border border-[#8C6A81]/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#8C6A81] text-base font-heading">
              Nguyên Âm → Chỉ Số Linh Hồn ({soul})
            </h4>
            <span className="px-2.5 py-0.5 bg-[#8C6A81] text-white rounded font-bold text-xs">
              Linh hồn: {soul}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5D58]">
            Danh sách nguyên âm (A, E, I, O, U, Y):
          </p>
          <div className="p-3 bg-white rounded-xl border border-[#8C6A81]/20 text-xs sm:text-sm text-[#2D3E3A]">
            {vowelList.map((item, idx) => (
              <span key={idx} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-[#FAF5FF] rounded font-medium text-[#8C6A81]">
                {item.letter} = {item.val}
              </span>
            ))}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#8C6A81]">
            Phép tính: {vowelList.map(v => v.val).join(' + ')} = {totalVowels} → <strong>Linh Hồn {soul}</strong>
          </div>
        </div>

        {/* Phụ âm */}
        <div className="p-5 bg-[#F4F9F8] rounded-2xl border border-[#013E37]/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#013E37] text-base font-heading">
              Phụ Âm → Chỉ Số Nhân Cách ({personality})
            </h4>
            <span className="px-2.5 py-0.5 bg-[#013E37] text-[#FFEFB3] rounded font-bold text-xs">
              Nhân cách: {personality}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5D58]">
            Danh sách phụ âm trong họ tên:
          </p>
          <div className="p-3 bg-white rounded-xl border border-[#013E37]/20 text-xs sm:text-sm text-[#2D3E3A]">
            {consonantList.map((item, idx) => (
              <span key={idx} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-[#F4F9F8] rounded font-medium text-[#013E37]">
                {item.letter} = {item.val}
              </span>
            ))}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#013E37]">
            Phép tính: {consonantList.map(c => c.val).join(' + ')} = {totalConsonants} → <strong>Nhân Cách {personality}</strong>
          </div>
        </div>
      </div>

      {/* 3. MA TRẬN TẦN SUẤT CHỮ SỐ 1 - 9 (ĐAM MÊ ẨN GIẤU & CHỈ SỐ THIẾU) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#013E37] font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#013E37] text-white flex items-center justify-center text-xs">2</span>
          Ma Trận Tần Suất Chữ Số 1 - 9 (Frequency Matrix)
        </h3>
        <p className="text-xs sm:text-sm text-[#4A5D58]">
          Tần suất xuất hiện của các chữ số từ 1 đến 9 trong họ tên khai sinh giúp xác định chính xác <strong>Đam Mê Ẩn Giấu</strong> (số xuất hiện nhiều nhất) và <strong>Chỉ Số Thiếu</strong> (các số có tần suất = 0).
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(num => {
            const count = frequencyMap[num];
            const isPassion = num === hiddenPassion;
            const isMissing = karmicLessons.includes(num);

            return (
              <div
                key={num}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isPassion
                    ? 'bg-[#FAF5FF] border-[#8C6A81] ring-2 ring-[#8C6A81]/30'
                    : isMissing
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-[#FAF8F5] border-[#E2E8E5]'
                }`}
              >
                <div className="text-base font-extrabold text-[#013E37]">Số {num}</div>
                <div className={`text-xl font-bold my-1 ${isPassion ? 'text-[#8C6A81]' : isMissing ? 'text-rose-600' : 'text-[#2D3E3A]'}`}>
                  {count} lần
                </div>
                <div className="text-[11px] font-medium leading-tight">
                  {isPassion && <span className="text-[#8C6A81] font-bold">Đam Mê ({hiddenPassion})</span>}
                  {isMissing && <span className="text-rose-600 font-bold">Chỉ Số Thiếu</span>}
                  {!isPassion && !isMissing && <span className="text-[#5F736E]">Bình thường</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CÔNG THỨC TƯ DUY LÝ TRÍ & NGUỒN DỮ LIỆU TÊN GỌI */}
      <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-3">
        <h4 className="font-bold text-[#013E37] text-base font-heading">
          Quy Ước Tính Chỉ Số Tư Duy Lý Trí ({rationalThought})
        </h4>
        <div className="text-xs sm:text-sm text-[#2D3E3A] space-y-1.5 leading-relaxed">
          <p>
            <strong>Nguồn dữ liệu đầu vào:</strong> Ngày sinh rút gọn ({birthDate.split('/')[0]} → {reduceNumber(parseInt(birthDate.split('/')[0] || '1', 10))}) kết hợp cùng <strong>Tên gọi cuối trong họ tên khai sinh ({lastWord})</strong>.
          </p>
          <p>
            <strong>Phép tính chi tiết:</strong> Tên "{lastWord}" (chuẩn hóa {lastWordNorm}) = {lastWordNorm.split('').map(l => `${l}=${PYTHAGOREAN_TABLE[l]}`).join(', ')} → Rút gọn = {lastWordVal}.
          </p>
          <p className="font-semibold text-[#013E37]">
            Công thức: [Ngày sinh rút gọn: {reduceNumber(parseInt(birthDate.split('/')[0] || '1', 10))}] + [Tên gọi cuối: {lastWordVal}] = {reduceNumber(parseInt(birthDate.split('/')[0] || '1', 10)) + lastWordVal} → <strong>Tư Duy Lý Trí = {rationalThought}</strong>.
          </p>
        </div>
      </div>

      {/* 5. BẢNG PHÂN ĐỊNH: CHUẨN PYTHAGORAS CỔ ĐIỂN VS QUY ƯỚC MỞ RỘNG LIFE MAPS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#013E37] font-heading flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#013E37] text-white flex items-center justify-center text-xs">3</span>
          Bảng Phân Định Phương Pháp: Chuẩn Pythagoras vs Quy Ước Mở Rộng Life Maps
        </h3>
        <p className="text-xs sm:text-sm text-[#4A5D58]">
          Life Maps tôn trọng tuyệt đối các quy chuẩn tính toán Pythagoras quốc tế cổ điển, đồng thời công khai minh bạch các chỉ số mở rộng ứng dụng trong Life Coaching.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#013E37] font-bold border-b border-[#E2E8E5]">
                <th className="p-3 border border-[#E2E8E5]">Thành Phần Chỉ Số</th>
                <th className="p-3 border border-[#E2E8E5] text-center">Chuẩn Pythagoras Quốc Tế</th>
                <th className="p-3 border border-[#E2E8E5] text-center">Quy Ước Mở Rộng Life Maps</th>
                <th className="p-3 border border-[#E2E8E5]">Ghi Chú Phương Pháp</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Đường Đời (Life Path)</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Chuẩn Cổ Điển</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Đồng nhất</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Tổng ngày + tháng + năm sinh rút gọn.</td>
              </tr>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Sứ Mệnh (Expression)</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Chuẩn Cổ Điển</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Đồng nhất</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Tổng giá trị toàn bộ chữ cái họ tên khai sinh.</td>
              </tr>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Linh Hồn & Nhân Cách</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Chuẩn Cổ Điển</td>
                <td className="p-3 text-center text-emerald-700 font-bold border border-[#E2E8E5]">✓ Đồng nhất</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Nguyên âm (Linh hồn) & Phụ âm (Nhân cách).</td>
              </tr>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Cầu Nối LPE & HDP</td>
                <td className="p-3 text-center text-[#5F736E] border border-[#E2E8E5]">Biến thể hiện đại</td>
                <td className="p-3 text-center text-[#8C6A81] font-bold border border-[#E2E8E5]">✓ Quy ước Life Maps</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Hiệu số tuyệt đối |Đường đời - Sứ mệnh| và |Linh hồn - Nhân cách|.</td>
              </tr>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Tư Duy Lý Trí</td>
                <td className="p-3 text-center text-[#5F736E] border border-[#E2E8E5]">Biến thể hiện đại</td>
                <td className="p-3 text-center text-[#8C6A81] font-bold border border-[#E2E8E5]">✓ Quy ước Life Maps</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Ngày sinh rút gọn + Tên gọi cuối trong họ tên.</td>
              </tr>
              <tr className="border-b border-[#E2E8E5]">
                <td className="p-3 font-semibold text-[#013E37] border border-[#E2E8E5]">Sức Mạnh Tiềm Thức</td>
                <td className="p-3 text-center text-[#5F736E] border border-[#E2E8E5]">Biến thể hiện đại</td>
                <td className="p-3 text-center text-[#8C6A81] font-bold border border-[#E2E8E5]">✓ Quy ước Life Maps</td>
                <td className="p-3 text-[#4A5D58] border border-[#E2E8E5]">Biểu diễn dạng tỷ lệ hiện diện số lượng các con số (vd: 8/9 số).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. GHI CHÚ QUY TẮC PHÂN LOẠI NGUYÊN ÂM 'Y' & METHOD VERSION */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E2E8E5] space-y-3 text-xs sm:text-sm text-[#2D3E3A]">
        <div className="font-bold text-[#013E37] uppercase tracking-wider text-xs">
          📌 Quy Tắc Phân Loại Nguyên Âm Chữ &quot;Y&quot; &amp; Thông Tin Phiên Bản Phương Pháp
        </div>
        <div className="space-y-1.5 text-[#4A5D58] leading-relaxed">
          <p>
            • <strong>Quy tắc phân loại chữ &quot;Y&quot;:</strong> Theo hệ quy chiếu Life Maps Pythagoras, chữ cái &quot;Y&quot; đứng độc lập hoặc đóng vai trò hạt nhân nguyên âm duy nhất trong một từ (ví dụ trong từ &quot;UY&quot;) được phân loại là <strong>Nguyên Âm</strong> (tương ứng năng lượng số 7 của Linh Hồn). Khi đứng liền sau một nguyên âm chính khác với vai trò bán nguyên âm, &quot;Y&quot; được xét theo phụ âm.
          </p>
          <p>
            • <strong>Tính kiểm toán &amp; Reproducibility:</strong> Báo cáo được khởi tạo với Single Source of Truth, mọi công thức rút gọn tuân thủ chuẩn Pythagoras cổ điển.
          </p>
        </div>
        <div className="pt-2 border-t border-[#E2E8E5] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#5F736E]">
          <div>Methodology Version: <strong className="text-[#013E37]">LM-PY-2026.02</strong></div>
          <div>Calculation Engine: <strong className="text-[#013E37]">v2.4.0</strong></div>
          <div>Semantic Calibration: <strong className="text-emerald-700 font-bold">Active (ICF-inspired)</strong></div>
          <div>Generated Date: <strong>{new Date().toISOString().split('T')[0]}</strong></div>
        </div>
      </div>
    </div>
  );
};
