'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { generatePersonalMonthCalendar, MonthEnergyReport, PersonalDayForecast } from '@/lib/personalCalendarGenerator';

interface PersonalCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  birthDate: string; // DD/MM/YYYY
  isCoachOrSubscribed: boolean;
}

export function PersonalCalendarModal({
  isOpen,
  onClose,
  customerName,
  birthDate,
  isCoachOrSubscribed
}: PersonalCalendarModalProps) {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedDayForecast, setSelectedDayForecast] = useState<PersonalDayForecast | null>(null);

  if (!isOpen) return null;

  const calendarData: MonthEnergyReport = generatePersonalMonthCalendar(
    birthDate || '27/08/1980',
    selectedMonth,
    selectedYear
  );

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
    setSelectedDayForecast(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
    setSelectedDayForecast(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-[#E2E8E5] rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl my-8 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#267D71]">TÍNH NĂNG CHUYÊN SÂU COACH VIP</span>
                <span className="px-2 py-0.5 bg-[#FFEFB3] text-[#013E37] text-[10px] font-bold rounded-full">Subscription</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[#0D2B26]">
                Lịch Năng Lượng Cá Nhân 30 Ngày – {customerName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5F736E] hover:bg-[#EEF5F3] hover:text-[#0D2B26] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* ACCESS CHECK */}
        {!isCoachOrSubscribed ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-3xl border border-[#E2E8E5] space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#013E37]/10 text-[#013E37] flex items-center justify-center">
              <Lock size={28} />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#013E37]">
              Tính Năng Dành Riêng Cho Gói Coach & Hội Viên Năm
            </h4>
            <p className="text-xs sm:text-sm text-[#5F736E] max-w-md mx-auto leading-relaxed">
              Lịch Năng Lượng Cá Nhân cung cấp chuỗi dự báo Ngày Cá Nhân và Tháng Cá Nhân chính xác theo chu kỳ năng lượng Pythagoras, giúp Coach đồng hành cùng thân chủ trong việc lập kế hoạch hành động và ra quyết định tối ưu.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#013E37] text-[#FFEFB3] font-bold text-xs rounded-2xl shadow-sm hover:bg-[#0D2B26] transition-all"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* MONTH SELECTOR & SUMMARY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-white border border-[#E2E8E5] hover:bg-[#EEF5F3] transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base text-[#013E37] font-heading">
                    Tháng {selectedMonth} Năm {selectedYear}
                  </div>
                  <div className="text-xs text-[#5F736E]">
                    Năm cá nhân số <strong>{calendarData.personalYear}</strong> • Tháng cá nhân số <strong>{calendarData.personalMonth}</strong>
                  </div>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-white border border-[#E2E8E5] hover:bg-[#EEF5F3] transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="text-xs sm:text-sm bg-white p-3 rounded-xl border border-[#E2E8E5] text-[#2D3E3A]">
                <strong className="text-[#267D71]">Chiến lược tháng:</strong> {calendarData.monthStrategy}
              </div>
            </div>

            {/* 30-DAY GRID */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#013E37] mb-2">
                Bảng Năng Lượng Từng Ngày Trong Tháng (Nhấn vào ngày để xem chi tiết):
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {calendarData.days.map((day) => {
                  const isSelected = selectedDayForecast?.dayOfMonth === day.dayOfMonth;
                  const isToday =
                    currentDate.getDate() === day.dayOfMonth &&
                    currentDate.getMonth() + 1 === selectedMonth &&
                    currentDate.getFullYear() === selectedYear;

                  return (
                    <button
                      key={day.dayOfMonth}
                      onClick={() => setSelectedDayForecast(day)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#013E37] bg-[#013E37] text-white shadow-md'
                          : isToday
                          ? 'border-[#267D71] bg-[#EEF5F3] text-[#013E37]'
                          : 'border-[#E2E8E5] bg-[#FFFFFF] hover:border-[#267D71]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#FFEFB3]' : 'text-[#0D2B26]'}`}>
                          {day.dayOfMonth}
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF5F3] text-[#013E37]'
                        }`}>
                          Số {day.personalDay}
                        </span>
                      </div>
                      <div className={`text-[10px] font-medium truncate mt-1 ${isSelected ? 'text-white/90' : 'text-[#5F736E]'}`}>
                        {day.theme.split('&')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED DAY DETAIL DRAWER */}
            {selectedDayForecast && (
              <div className="p-5 bg-[#FAF5FF] rounded-2xl border-2 border-[#8C6A81]/30 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#8C6A81]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#8C6A81] text-white font-bold text-xs rounded-lg">
                      Ngày {selectedDayForecast.dayOfMonth}/{selectedMonth} ({selectedDayForecast.dayOfWeek})
                    </span>
                    <span className="font-bold text-sm text-[#8C6A81]">
                      Ngày Cá Nhân Số {selectedDayForecast.personalDay}: {selectedDayForecast.theme}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5F736E] font-mono">
                    Công thức: {selectedDayForecast.personalMonth} (Tháng CN) + {selectedDayForecast.dayOfMonth} (Ngày) → {selectedDayForecast.personalDay}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                  {selectedDayForecast.actionGuidance}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      <span>Hành Động Khuyến Nghị Nên Làm:</span>
                    </div>
                    <ul className="list-disc pl-4 text-emerald-900 space-y-0.5">
                      {selectedDayForecast.doList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle size={15} />
                      <span>Nên Hạn Chế Hoặc Cẩn Trọng:</span>
                    </div>
                    <ul className="list-disc pl-4 text-amber-900 space-y-0.5">
                      {selectedDayForecast.dontList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
