'use client';

import React from 'react';
import { Sparkles, AlertCircle, Briefcase, Heart, Compass, DollarSign, HelpCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { getAdaptivePillarsForNumber } from '@/lib/multiIndicatorSynthesis';

interface IndicatorKnowledgeCardProps {
  knowledge: any;
  accentColor?: 'emerald' | 'amber' | 'purple' | 'blue';
}

export function IndicatorKnowledgeCard({
  knowledge,
  accentColor = 'emerald'
}: IndicatorKnowledgeCardProps) {
  if (!knowledge) return null;

  const colorStyles = {
    emerald: {
      border: 'border-[#267D71]/30 hover:border-[#267D71]',
      bgHeader: 'bg-[#EEF5F3]',
      badge: 'bg-[#013E37] text-[#FFEFB3]',
      accentText: 'text-[#013E37]',
      subtleBg: 'bg-[#FAF8F5]',
    },
    amber: {
      border: 'border-[#FFEFB3] hover:border-[#F9E79F]',
      bgHeader: 'bg-[#FFEFB3]/30',
      badge: 'bg-[#013E37] text-[#FFEFB3]',
      accentText: 'text-[#013E37]',
      subtleBg: 'bg-[#FAF8F5]',
    },
    purple: {
      border: 'border-[#8C6A81]/30 hover:border-[#8C6A81]',
      bgHeader: 'bg-[#FAF5FF]',
      badge: 'bg-[#8C6A81] text-white',
      accentText: 'text-[#8C6A81]',
      subtleBg: 'bg-[#FAF8F5]',
    },
    blue: {
      border: 'border-blue-200 hover:border-blue-400',
      bgHeader: 'bg-blue-50/60',
      badge: 'bg-blue-900 text-blue-100',
      accentText: 'text-blue-900',
      subtleBg: 'bg-[#FAF8F5]',
    },
  }[accentColor];

  return (
    <div className={`rounded-2xl border transition-all shadow-sm bg-white overflow-hidden ${colorStyles.border}`}>
      {/* HEADER ROW */}
      <div className={`p-4 sm:p-5 flex items-center justify-between gap-3 ${colorStyles.bgHeader} border-b border-[#E2E8E5]/60`}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-12 h-12 rounded-xl ${colorStyles.badge} flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-sm`}>
            {knowledge.number}
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-[#5F736E]">
              {knowledge.indicator_name || knowledge.indicator_code}
            </span>
            <h4 className={`text-base sm:text-xl font-bold font-heading ${colorStyles.accentText} truncate`}>
              Ý Nghĩa Năng Lượng Con Số {knowledge.number}
            </h4>
          </div>
        </div>
      </div>

      {/* BODY CONTENT (ALWAYS VISIBLE & SEAMLESS) */}
      <div className="p-5 sm:p-7 space-y-6 bg-white text-sm sm:text-base text-[#2D3E3A]">
        {/* CORE ENERGY SUMMARY */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] leading-relaxed">
          <div className="font-bold text-[#0D2B26] mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Sparkles size={16} className="text-[#267D71]" />
            <span>Năng Lượng Cốt Lõi:</span>
          </div>
          <p className="text-[#2D3E3A] font-medium text-sm sm:text-base leading-relaxed">{knowledge.core_energy}</p>
        </div>

        {/* POSITIVE & SHADOW TRAITS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive */}
          <div className="p-4 sm:p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2.5">
            <div className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>Mặt Phát Huy (Khi Ở Trạng Thái Cân Bằng):</span>
            </div>
            <ul className="space-y-2 text-emerald-950 text-sm pl-5 list-disc leading-relaxed">
              {knowledge.positive_traits?.map((t: string, idx: number) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Shadow */}
          <div className="p-4 sm:p-5 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2.5">
            <div className="font-bold text-amber-900 flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-amber-700 shrink-0" />
              <span>Mặt Bóng / Điểm Mù Cần Nhận Diện:</span>
            </div>
            <ul className="space-y-2 text-amber-950 text-sm pl-5 list-disc leading-relaxed">
              {knowledge.shadow_traits?.map((t: string, idx: number) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ADAPTIVE PILLARS INSTEAD OF GENERIC DOMAINS */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-4">
          <div className="font-bold text-[#013E37] text-sm uppercase tracking-wider flex items-center justify-between">
            <span>4 Trụ Cột Phát Triển &amp; Hành Động Đặc Thù:</span>
            <span className="text-[11px] font-normal text-[#5F736E] italic">Adaptive Pillars</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {getAdaptivePillarsForNumber(knowledge.number, knowledge.indicator_name || '').map((pillar, pIdx) => (
              <div key={pIdx} className="p-4 bg-white rounded-xl border border-[#E2E8E5] space-y-2 shadow-xs">
                <div className="font-bold text-[#0D2B26] text-sm flex items-center gap-2 border-b border-[#E2E8E5]/60 pb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#013E37] text-white flex items-center justify-center text-[11px] font-mono shrink-0">
                    {pIdx + 1}
                  </span>
                  <span>{pillar.title}</span>
                </div>
                <p className="text-[#2D3E3A] text-xs leading-relaxed font-medium">
                  {pillar.keyInsight}
                </p>
                <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E2E8E5]/60 text-[11px] text-[#013E37]">
                  🎯 <strong>Hành động:</strong> {pillar.actionGuidance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GROWTH ACTIONS & POWER QUESTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knowledge.growth_actions && knowledge.growth_actions.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20 space-y-2.5">
              <div className="font-bold text-[#013E37] text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#267D71]" />
                <span>Phương Pháp Kích Hoạt & Hành Động Cụ Thể:</span>
              </div>
              <ul className="space-y-2 text-sm text-[#2D3E3A] pl-5 list-disc leading-relaxed">
                {knowledge.growth_actions.map((act: string, idx: number) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          {knowledge.power_questions && knowledge.power_questions.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] space-y-2.5">
              <div className="font-bold text-[#013E37] text-sm flex items-center gap-2">
                <HelpCircle size={16} className="text-amber-700" />
                <span>Câu Hỏi Tự Vấn & Bài Tập Thực Hành:</span>
              </div>
              <ul className="space-y-2 text-sm text-[#2D3E3A] pl-5 list-disc leading-relaxed">
                {knowledge.power_questions.map((q: string, idx: number) => (
                  <li key={idx} className="italic">{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* DETAILED INSIGHT READING */}
        {knowledge.full_description && (
          <div className="p-5 sm:p-7 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-4">
            <div className="font-bold text-[#0D2B26] flex items-center gap-2 text-sm sm:text-base uppercase tracking-wider">
              <BookOpen size={16} className="text-[#267D71]" />
              <span>Phân Tích Chuyên Sâu Tầng 2:</span>
            </div>
            <div className="space-y-3.5 text-sm sm:text-base text-[#2D3E3A] leading-relaxed">
              {knowledge.full_description.split('\n\n').map((paragraph: string, pIdx: number) => {
                const cleanParagraph = paragraph.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*\*/g, '');
                const trimmed = cleanParagraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h5 key={pIdx} className="font-bold text-[#013E37] text-sm sm:text-base pt-3 border-b border-[#E2E8E5] pb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#267D71]" />
                      {trimmed.replace(/^###\s*/, '')}
                    </h5>
                  );
                }

                if (trimmed.startsWith('• ') || trimmed.includes('\n• ')) {
                  const bulletLines = trimmed.split('\n').filter(Boolean);
                  return (
                    <ul key={pIdx} className="space-y-2 pl-5 list-disc text-[#2D3E3A]">
                      {bulletLines.map((line: string, bIdx: number) => (
                        <li key={bIdx} className="leading-relaxed">
                          {line.replace(/^[•\-\*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={pIdx} className="leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
