'use client';

import React from 'react';

export interface IndicatorCardItem {
  id: string;
  title: string;
  number: number | string;
  breakdown?: string;
  desc: string;
}

export interface CoreIdentityBlockProps {
  items: IndicatorCardItem[];
}

export const CoreIdentityBlock: React.FC<CoreIdentityBlockProps> = ({ items }) => {
  return (
    <div className="bg-[#FFFFFF] border-2 border-[#013E37]/30 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFEFB3]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center font-bold text-xl shadow-sm">
          🌟
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#267D71]">Khối 1: Căn Cước Năng Lượng</div>
          <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Hạt Nhân Bản Sắc (Core Identity)</h3>
        </div>
      </div>
      <p className="text-sm text-[#5F736E] mb-5 leading-relaxed">
        Trả lời câu hỏi cốt lõi: <em>"Tôi là ai? Tôi đến cuộc đời này để làm gì? Đâu là khát khao thầm kín và hình ảnh đại diện của tôi?"</em>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#E2E8E5] hover:border-[#013E37] transition-all flex flex-col justify-between text-center">
            <div>
              <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#013E37]">{item.number}</span>
                {item.breakdown && (
                  <span className="text-xs sm:text-sm font-bold text-[#267D71]">{item.breakdown}</span>
                )}
              </div>
              <div className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0D2B26] font-heading mb-2">{item.title}</div>
              <div className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed line-clamp-3">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
