'use client';

import React from 'react';
import { IndicatorCardItem } from './CoreIdentityBlock';

export interface ShadowGrowthBlockProps {
  items: IndicatorCardItem[];
}

export const ShadowGrowthBlock: React.FC<ShadowGrowthBlockProps> = ({ items }) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#8C6A81]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center font-bold text-xl border border-[#8C6A81]/30">
          ⚖️
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8C6A81]">Khối 3: Vùng Trũng & Phát Triển</div>
          <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Điểm Mù, Trưởng Thành & Thế Hệ (Shadow & Growth)</h3>
        </div>
      </div>
      <p className="text-sm text-[#5F736E] mb-5 leading-relaxed">
        Trả lời câu hỏi: <em>"Điểm mù nào đang cản trở tôi? Giai đoạn trưởng thành hoàng kim đòi hỏi bài học gì và thời đại kỳ vọng điều gì ở tôi?"</em>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#8C6A81]/30 hover:border-[#8C6A81] transition-all flex flex-col justify-between text-center">
            <div>
              <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>
                  {item.number}
                </span>
                {item.breakdown && (
                  <span className="text-xs sm:text-sm font-bold text-[#8C6A81]">
                    {item.breakdown}
                  </span>
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
