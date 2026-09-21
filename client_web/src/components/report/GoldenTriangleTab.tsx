'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export interface GoldenTriangleTabProps {
  fullName: string;
  layer1: {
    life_path: any;
    expression: any;
    heart_desire: any;
  };
  layer2IndicatorsCount: number;
  user: any;
  loginWithGoogle: () => Promise<void>;
  onViewLifeMap: () => void;
}

export const GoldenTriangleTab: React.FC<GoldenTriangleTabProps> = ({
  fullName,
  layer1,
  layer2IndicatorsCount,
  user,
  loginWithGoogle,
  onViewLifeMap,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8E5]">
          <div>
            <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
              Bộ 3 Con Số Nền Tảng Dẫn Đường
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
              Bộ Số Tam Giác Vàng Dành Cho {fullName}
            </h2>
            <p className="text-xs sm:text-sm text-[#5F736E] mt-1 leading-relaxed">
              Mỗi chỉ số trong bản đồ Thần số học Pythagoras nắm giữ một vai trò đại diện thiêng liêng. Dưới đây là 3 con số nền tảng dẫn dắt toàn bộ cuộc đời bạn.
            </p>
          </div>

          {/* TAB 1 CTA DẪN ĐĂNG NHẬP / XEM 21 CHỈ SỐ */}
          {!user ? (
            <button
              onClick={loginWithGoogle}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#013E37] hover:bg-[#0D2B26] text-[#FFEFB3] text-xs font-extrabold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto border border-[#267D71]/40 hover:scale-[1.02]"
            >
              <Sparkles size={15} className="text-[#FFEFB3]" />
              <span>Đăng Nhập Nhận 21 Chỉ Số (Miễn Phí) ➔</span>
            </button>
          ) : (
            <button
              onClick={onViewLifeMap}
              className="shrink-0 px-4 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <span>Xem Trọn Bộ 21 Chỉ Số ➔</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Life Path */}
          <div className="card-surface rounded-3xl p-6 border-2 border-[#267D71]/20 hover:border-[#267D71] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#267D71]">Đường Đời (Life Path)</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-extrabold text-lg border border-[#F9E79F] shadow-sm">
                    {layer1.life_path.userNumber}
                  </span>
                  {layer1.life_path.breakdown && (
                    <span className="text-xs font-bold text-[#267D71]">
                      {layer1.life_path.breakdown}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-lg mb-2">
                {layer1.life_path.name}
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed mb-4">
                {layer1.life_path.definition}
              </p>
            </div>
            <div className="bg-[#EEF5F3] p-3 rounded-2xl text-xs text-[#013E37] border border-[#267D71]/20 font-medium">
              💡 {layer1.life_path.hookQuestion}
            </div>
          </div>

          {/* Card 2: Expression */}
          <div className="card-surface rounded-3xl p-6 border border-[#E2E8E5] hover:border-[#267D71]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#267D71]">Sứ Mệnh (Destiny)</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center font-extrabold text-lg border border-[#267D71]/20 shadow-sm">
                    {layer1.expression.userNumber}
                  </span>
                  {layer1.expression.breakdown && (
                    <span className="text-xs font-bold text-[#267D71]">
                      {layer1.expression.breakdown}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-lg mb-2">
                {layer1.expression.name}
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed mb-4">
                {layer1.expression.definition}
              </p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-2xl text-xs text-[#5F736E] border border-[#E2E8E5]">
              💡 {layer1.expression.hookQuestion}
            </div>
          </div>

          {/* Card 3: Soul Urge */}
          <div className="card-surface rounded-3xl p-6 border border-[#E2E8E5] hover:border-[#267D71]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6A81]">Linh Hồn (Soul Urge)</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center font-extrabold text-lg border border-[#8C6A81]/30 shadow-sm">
                    {layer1.heart_desire.userNumber}
                  </span>
                  {layer1.heart_desire.breakdown && (
                    <span className="text-xs font-bold text-[#8C6A81]">
                      {layer1.heart_desire.breakdown}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-lg mb-2">
                {layer1.heart_desire.name}
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed mb-4">
                {layer1.heart_desire.definition}
              </p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-2xl text-xs text-[#5F736E] border border-[#E2E8E5]">
              💡 {layer1.heart_desire.hookQuestion}
            </div>
          </div>
        </div>

        {/* CONTEXTUAL CTA TO TAB 2 */}
        <div className="mt-8 p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl">
              {!user ? '🎁' : '🔓'}
            </div>
            <div>
              <div className="text-sm font-bold text-[#0D2B26] font-heading">
                Khám Phá Trọn Bộ Life Map {layer2IndicatorsCount} Chỉ Số Của Bạn
              </div>
              <div className="text-xs text-[#5F736E]">
                {!user 
                  ? 'Đăng nhập Google miễn phí ngay để nhận toàn bộ 21 chỉ số, ma trận năng lượng và 4 đỉnh cao Kim Tự Tháp.'
                  : 'Chuyển sang Tab "Life Map 21 chỉ số" để xem bản đồ năng lượng chi tiết nhất.'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (!user) {
                loginWithGoogle();
              } else {
                onViewLifeMap();
              }
            }}
            className="px-5 py-2.5 rounded-xl btn-primary text-xs whitespace-nowrap shadow-sm font-bold flex items-center gap-2 cursor-pointer"
          >
            {!user ? (
              <>
                <Sparkles size={14} />
                <span>Đăng Nhập Nhận 21 Chỉ Số ➔</span>
              </>
            ) : (
              <span>Khám Phá {layer2IndicatorsCount} Chỉ Số ➔</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
