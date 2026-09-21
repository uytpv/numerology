'use client';

import React from 'react';
import { IndicatorCardItem } from './CoreIdentityBlock';

export interface BehavioralToolsBlockProps {
  items: IndicatorCardItem[];
}

export const BehavioralToolsBlock: React.FC<BehavioralToolsBlockProps> = ({ items }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#267D71]/30 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center font-bold text-xl border border-[#267D71]/20">
          🛠️
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#267D71]">Khối 2: Phương Tiện Thực Thi</div>
          <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Bộ Công Cụ & Phản Xạ Hành Vi (Behavioral Tools)</h3>
        </div>
      </div>
      <p className="text-sm text-[#5F736E] mb-5 leading-relaxed">
        Trả lời câu hỏi: <em>"Tôi dùng tố chất và vũ khí gì để hành động? Khi gặp biến cố hoặc khủng hoảng, cơ chế tự vệ và ra quyết định của tôi là gì?"</em>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#E2E8E5] hover:border-[#267D71] transition-all flex flex-col justify-between text-center">
            <div>
              <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#267D71]">{item.number}</span>
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
