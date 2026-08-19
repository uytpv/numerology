'use client';

import React, { useState } from 'react';
import { 
  READING_PROFILES, 
  ReadingProfileId, 
  recommendReadingProfile 
} from '@/lib/adaptiveReadingProfiles';
import { Sparkles, Check, ArrowRight, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface AdaptiveProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ReadingProfileId;
  onSelectProfile: (profileId: ReadingProfileId) => void;
  customerName: string;
  lifePath: number;
  soul: number;
  personality: number;
  rationalThought?: number;
}

export function AdaptiveProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
  customerName,
  lifePath,
  soul,
  personality,
  rationalThought = 1
}: AdaptiveProfileModalProps) {
  const [selectedId, setSelectedId] = useState<ReadingProfileId>(currentProfile);

  if (!isOpen) return null;

  const recommendation = recommendReadingProfile(lifePath, soul, personality, rationalThought);
  const recommendedId = recommendation.recommendedProfile.id;

  const handleApply = () => {
    onSelectProfile(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E2E8E5] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-6 sm:p-8 bg-[#013E37] text-white relative overflow-hidden shrink-0">
          <div className="absolute -right-12 -top-12 w-60 h-60 bg-[#FFEFB3]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Cá Nhân Hóa Trải Nghiệm Tiếp Nhận</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#FFEFB3]">
                Chọn Phong Cách Báo Cáo Phù Hợp Với Bạn
              </h2>
              <p className="text-xs sm:text-sm text-[#E2E8E5] max-w-2xl leading-relaxed">
                Mỗi người có một cách tiếp nhận thông tin khác nhau. Hãy chọn phong cách và độ dài báo cáo phù hợp nhất với quỹ thời gian và mục tiêu của bạn.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shrink-0 text-xl"
            >
              ✕
            </button>
          </div>

          {/* AI RECOMMENDATION BANNER */}
          <div className="mt-4 p-4 rounded-2xl bg-white/10 border border-[#FFEFB3]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#FFEFB3]">
                <span>🤖 AI Đề Xuất Thông Minh:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFEFB3] text-[#013E37] font-extrabold text-[11px]">
                  {recommendation.recommendedProfile.name} ({recommendation.confidence}% Tương thích)
                </span>
              </div>
              <p className="text-[#E2E8E5] leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
            
            {selectedId !== recommendedId && (
              <button
                onClick={() => setSelectedId(recommendedId)}
                className="px-3 py-1.5 rounded-xl bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] font-extrabold text-xs shrink-0 transition-all shadow-sm"
              >
                Chọn Theo AI Đề Xuất
              </button>
            )}
          </div>
        </div>

        {/* PROFILE CARDS GRID */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(READING_PROFILES) as ReadingProfileId[]).map((pId) => {
              const profile = READING_PROFILES[pId];
              const isSelected = selectedId === pId;
              const isRecommended = recommendedId === pId;

              return (
                <div
                  key={pId}
                  onClick={() => setSelectedId(pId)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative space-y-3 ${
                    isSelected
                      ? `${profile.borderColor} ${profile.accentBg} shadow-md`
                      : 'border-[#E2E8E5] bg-white hover:border-[#267D71]/40'
                  }`}
                >
                  {/* TOP BADGES */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{profile.icon}</span>
                      <div>
                        <h4 className="font-bold text-[#0D2B26] text-base font-heading">
                          {profile.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#5F736E]">
                          <span className="flex items-center gap-1 font-semibold text-[#013E37]">
                            <FileText size={12} />
                            <span>{profile.pageCount}</span>
                          </span>
                          <span>•</span>
                          <span>{profile.tagline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isRecommended && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEFB3] text-[#013E37] text-[10px] font-extrabold border border-[#013E37]/20">
                          AI GỢI Ý
                        </span>
                      )}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#013E37] text-[#FFEFB3] border-[#013E37]' : 'border-[#CBD5E1]'
                      }`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-[#4A5D58] leading-relaxed">
                    {profile.description}
                  </p>

                  {/* KEY HIGHLIGHTS */}
                  <div className="pt-2 border-t border-[#E2E8E5]/60 space-y-1">
                    <div className="text-[11px] font-bold text-[#013E37] uppercase">Khối nội dung trọng tâm:</div>
                    <ul className="space-y-0.5 text-[11px] text-[#2D3E3A]">
                      {profile.keyHighlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={11} className="text-[#267D71] shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TONE STYLE */}
                  <div className="p-2 rounded-xl bg-white/80 border border-[#E2E8E5]/60 text-[11px] text-[#5F736E] italic">
                    ✍️ <strong>Văn phong:</strong> {profile.toneStyle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-5 sm:p-6 bg-[#FAF8F5] border-t border-[#E2E8E5] flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#5F736E]">
            Đang chọn: <strong className="text-[#013E37] font-bold">{READING_PROFILES[selectedId].name}</strong> ({READING_PROFILES[selectedId].pageCount})
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#5F736E] hover:text-[#0D2B26] transition-all"
            >
              Để Sau
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-[#013E37] hover:bg-[#084D44] text-[#FFEFB3] text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
            >
              <span>Áp Dụng Phong Cách Này</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
