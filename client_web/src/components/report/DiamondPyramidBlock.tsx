'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export interface TimelineDay {
  dayOfWeek: string;
  dateFormatted: string;
  personalDay: number;
  isToday: boolean;
}

export interface TimelineData {
  currentYear: number;
  personalYear: number;
  currentMonth: number;
  personalMonth: number;
  days: TimelineDay[];
}

export interface PyramidData {
  currentAge: number;
  age: number[];
  pinnacle: number[];
  root: number[];
  challenge: number[];
}

export interface DiamondPyramidBlockProps {
  timeline: TimelineData;
  pyramid: PyramidData;
}

export const DiamondPyramidBlock: React.FC<DiamondPyramidBlockProps> = ({ timeline, pyramid }) => {
  return (
    <div className="bg-[#FFFFFF] border-2 border-[#F9E79F] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-bold text-xl border border-[#F9E79F]">
          ⏳
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#013E37]">Khối 4: Dòng Chảy Định Mệnh</div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">Vận Trình Chu Kỳ & Sơ Đồ Kim Tự Tháp Cuộc Đời</h3>
        </div>
      </div>

      {/* 1. TIMELINE NGẮN HẠN (NĂM, THÁNG, 7 NGÀY CÁ NHÂN) */}
      <div className="p-5 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#E2E8E5] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8E5]">
          <div className="flex items-center gap-2 text-base font-bold text-[#0D2B26] font-heading">
            <Calendar size={18} className="text-[#267D71]" />
            <span>Dòng Chảy Năng Lượng Ngắn Hạn</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="px-3 py-1.5 bg-[#EEF5F3] text-[#013E37] font-bold rounded-xl border border-[#267D71]/20">
              Năm {timeline.currentYear} (Năm CN {timeline.personalYear})
            </span>
            <span className="px-3 py-1.5 bg-[#FFEFB3] text-[#013E37] font-bold rounded-xl border border-[#F9E79F]">
              Tháng {timeline.currentMonth} (Tháng CN {timeline.personalMonth})
            </span>
          </div>
        </div>

        {/* 7 DAYS STRIP (3 DAYS BEFORE, TODAY IN CENTER, 3 DAYS AFTER) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center pt-2">
          {timeline.days.map((d, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-2.5 sm:p-3.5 transition-all flex flex-col items-center justify-between ${
                d.isToday
                  ? 'bg-[#013E37] text-white shadow-md scale-105 border-2 border-[#FFEFB3]'
                  : 'bg-white border border-[#E2E8E5] text-[#2D3E3A] hover:border-[#267D71]'
              }`}
            >
              <div className={`text-xs sm:text-sm font-bold uppercase ${d.isToday ? 'text-[#FFEFB3]' : 'text-[#5F736E]'}`}>
                {d.dayOfWeek}
              </div>
              <div className={`text-sm sm:text-base font-semibold my-0.5 ${d.isToday ? 'text-white font-extrabold' : 'text-[#0D2B26]'}`}>
                {d.dateFormatted}
              </div>
              <div className="mt-1">
                <span className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-md font-bold ${
                  d.isToday ? 'bg-[#FFEFB3] text-[#013E37]' : 'bg-[#EEF5F3] text-[#267D71]'
                }`}>
                  Số {d.personalDay}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SƠ ĐỒ KIM TỰ THÁP 4 ĐỈNH CAO & THÁCH THỨC (DIAMOND PYRAMID ARCHITECTURE) */}
      <div className="p-6 sm:p-8 bg-[#FFFFFF] rounded-3xl border-2 border-[#267D71]/30 text-center space-y-6">
        <div>
          <span className="badge-butter px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-1.5">
            Mô Hình Kim Cương Đa Chiều
          </span>
          <h4 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
            Sơ Đồ Chặng | Thách Thức | 4 Đỉnh Cao Cuộc Đời ({pyramid.currentAge} tuổi)
          </h4>
          <p className="text-sm text-[#5F736E] mt-1.5 max-w-xl mx-auto">
            Hệ thống 4 đỉnh cao kim tự tháp kết hợp 4 thử thách nghiệp lực tương ứng theo từng giai đoạn tuổi.
          </p>
        </div>

        {/* VISUAL PYRAMID BUILDINGS */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4 max-w-lg mx-auto">
          {/* ROW 1: PINNACLE 4 (TOP) */}
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-extrabold text-[#013E37] uppercase tracking-wider mb-1.5">
              Đỉnh 4 (Tuổi {pyramid.age[2]}+)
            </span>
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-[#013E37] flex flex-col items-center justify-center border-2 border-[#FFEFB3] shadow-xl ring-4 ring-[#FFEFB3]/40 transition-transform hover:scale-105">
              <span 
                className="text-3xl sm:text-4xl font-extrabold drop-shadow-sm tracking-tight"
                style={{ color: '#FFEFB3' }}
              >
                {pyramid.pinnacle[3]}
              </span>
            </div>
          </div>

          {/* ROW 2: PINNACLE 3 */}
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-[#013E37] uppercase tracking-wider mb-1.5">
              Đỉnh 3 (Tuổi {pyramid.age[1]} - {pyramid.age[2]})
            </span>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#013E37] flex flex-col items-center justify-center border-2 border-[#FFEFB3] shadow-md transition-transform hover:scale-105">
              <span 
                className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm"
                style={{ color: '#FFEFB3' }}
              >
                {pyramid.pinnacle[2]}
              </span>
            </div>
          </div>

          {/* ROW 3: PINNACLE 1 & 2 */}
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#013E37] uppercase tracking-wider mb-1.5">
                Đỉnh 1 (Tuổi 0 - {pyramid.age[0]})
              </span>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#013E37] flex flex-col items-center justify-center border-2 border-[#FFEFB3] shadow-md transition-transform hover:scale-105">
                <span 
                  className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm"
                  style={{ color: '#FFEFB3' }}
                >
                  {pyramid.pinnacle[0]}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#013E37] uppercase tracking-wider mb-1.5">
                Đỉnh 2 (Tuổi {pyramid.age[0]} - {pyramid.age[1]})
              </span>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#013E37] flex flex-col items-center justify-center border-2 border-[#FFEFB3] shadow-md transition-transform hover:scale-105">
                <span 
                  className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm"
                  style={{ color: '#FFEFB3' }}
                >
                  {pyramid.pinnacle[1]}
                </span>
              </div>
            </div>
          </div>

          {/* ROW 4: ROOTS (CHÂN ĐẾ KIM TỰ THÁP: THÁNG, NGÀY, NĂM) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-3 border-y-2 border-dashed border-[#E2E8E5] w-full">
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#5F736E] uppercase mb-1">Tháng sinh</span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-xl text-[#0D2B26] shadow-inner">
                {pyramid.root[0]}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#5F736E] uppercase mb-1">Ngày sinh</span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-xl text-[#0D2B26] shadow-inner">
                {pyramid.root[1]}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#5F736E] uppercase mb-1">Năm sinh</span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-xl text-[#0D2B26] shadow-inner">
                {pyramid.root[2]}
              </div>
            </div>
          </div>

          {/* ROW 5: CHALLENGE 1 & 2 */}
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-sm">
                <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[0]}</span>
              </div>
              <span className="text-xs font-bold text-[#8C6A81] uppercase mt-1.5">Thách Thức 1</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-sm">
                <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[1]}</span>
              </div>
              <span className="text-xs font-bold text-[#8C6A81] uppercase mt-1.5">Thách Thức 2</span>
            </div>
          </div>

          {/* ROW 6: CHALLENGE 3 */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-sm">
              <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[2]}</span>
            </div>
            <span className="text-xs font-bold text-[#8C6A81] uppercase mt-1.5">Thách Thức 3</span>
          </div>

          {/* ROW 7: CHALLENGE 4 (BOTTOM) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF5FF] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-md">
              <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[3]}</span>
            </div>
            <span className="text-xs font-bold text-[#8C6A81] uppercase mt-1.5">Thách Thức 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
