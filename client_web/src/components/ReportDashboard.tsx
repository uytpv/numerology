'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { generate3LayerNumerologyData, formatTitleCase } from '@/lib/numerologyReportGenerator';
import PricingSection from './PricingSection';
import { LeadRequestModal } from './LeadRequestModal';
import { SupportChatPopup } from './SupportChatPopup';
import { 
  Sparkles, Printer, UserCheck, Lock, Unlock, Headphones, 
  Compass, ShieldAlert, Award, ArrowRight, Check, AlertCircle, 
  FileText, UserPlus, HelpCircle, LayoutGrid, Zap, Calendar, ArrowLeftRight
} from 'lucide-react';

export interface ReportDashboardProps {
  customer?: any;
  initialCustomer?: any;
  isExistingRecord?: boolean;
  onRefresh?: () => void;
}

export function ReportDashboard({ customer, initialCustomer, isExistingRecord, onRefresh }: ReportDashboardProps) {
  const currentCustomer = customer || initialCustomer;
  const { user, loginWithGoogle } = useAuth();
  
  // 3 main tabs: 'triangle' (Bộ số tam giác vàng), 'lifemap' (Life Map 21 chỉ số), 'layer3' (Luận giải đa chiều)
  const [activeTab, setActiveTab] = useState<'triangle' | 'lifemap' | 'layer3'>('triangle');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Pre-unlock buffer confirm modal state for multi-credit / Coach users
  const [isDeductingCredit, setIsDeductingCredit] = useState(false);

  const rawFullName = `${currentCustomer?.last_name || ''} ${currentCustomer?.first_name || ''}`.trim() || 'Người Dùng';
  const fullName = formatTitleCase(rawFullName);
  
  // Is paid status
  const [isPaid, setIsPaid] = useState<boolean>(
    Boolean(currentCustomer?.tier === 'paid' || currentCustomer?.tier === 'coach' || currentCustomer?.is_paid)
  );

  // Credits count for user (e.g. from user profile or mock credits for coach/family packages)
  const [userCredits, setUserCredits] = useState<number>(() => {
    if ((user as any)?.credits !== undefined) return (user as any).credits;
    return 10;
  });

  const { layer1, layer2, layer3 } = generate3LayerNumerologyData({
    ...currentCustomer,
    first_name: currentCustomer?.first_name || '',
    last_name: currentCustomer?.last_name || '',
  });

  // 4 THEMATIC PILLARS
  const pillar1_Core = layer2.indicatorsGrid.filter(i => ['lp', 'exp', 'hd', 'per', 'lpe', 'hdp'].includes(i.id));
  const pillar2_Tools = layer2.indicatorsGrid.filter(i => ['dob', 'rat', 'att', 'bal', 'pas', 'sub'].includes(i.id));
  // Khối 3: Vùng Trũng & Phát Triển (Bao gồm Trưởng Thành và Thế Hệ)
  const pillar3_ShadowAndGrowth = layer2.indicatorsGrid.filter(i => ['kar', 'les', 'mat', 'gen'].includes(i.id));

  const pyramid = layer2.pyramidData;
  const timeline = layer2.shortTermTimeline;

  // Handle deduct credit action for Coach / Multi-package users
  const handleConfirmDeductCredit = async () => {
    setIsDeductingCredit(true);
    try {
      setUserCredits(prev => Math.max(0, prev - 1));
      setIsPaid(true);

      if (currentCustomer) {
        currentCustomer.is_paid = true;
        localStorage.setItem('lifemaps_current_report', JSON.stringify({ ...currentCustomer, is_paid: true }));
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Lỗi khi trừ lượt:', err);
    } finally {
      setIsDeductingCredit(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-[#2D3E3A] relative pb-16">
      {/* DEDUPLICATION BANNER */}
      {isExistingRecord && (
        <div className="bg-[#FFEFB3] border border-[#F9E79F] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white text-[#013E37] text-2xl border border-[#F9E79F]">
              📂
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#013E37] flex items-center gap-2 font-heading">
                Hồ Sơ Đã Tồn Tại Trong Tài Khoản Của Bạn
              </div>
              <div className="text-xs sm:text-sm text-[#5F736E]">
                Hệ thống tự động nhận diện và khôi phục hồ sơ của <strong className="text-[#013E37]">{fullName}</strong> ({currentCustomer?.dob}). Bạn không bị trừ thêm bất kỳ lượt phân tích nào!
              </div>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1.5 bg-[#013E37] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
            Miễn Phí Khôi Phục
          </span>
        </div>
      )}

      {/* HEADER PROFILE */}
      <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFEFB3]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#267D71]">
                Life Map của
              </span>
              {isPaid && (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold badge-butter">
                  VIP Unlocked
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#0D2B26] tracking-tight">
              {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#5F736E] mt-3">
              <span>Ngày sinh: <strong className="text-[#0D2B26]">{currentCustomer?.dob}</strong></span>
              <span>•</span>
              <span>Giới tính: <strong className="text-[#0D2B26]">{currentCustomer?.gender === 'female' ? 'Nữ' : 'Nam'}</strong></span>
              <span>•</span>
              <span>Năm cá nhân hiện tại: <strong className="text-[#013E37] font-bold">Số {currentCustomer?.map?.personal_year_current || 9}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] border border-[#267D71]/30 text-[#013E37] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <UserPlus size={16} className="text-[#267D71]" />
              <span>Kết Nối Chuyên Gia 1-1</span>
            </button>
          </div>
        </div>
      </div>

      {/* RESTRUCTURED NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8E5]">
        <div className="bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E2E8E5] flex items-center gap-1 shadow-sm">
          {/* TAB 1 */}
          <button
            onClick={() => setActiveTab('triangle')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'triangle' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Compass size={16} />
            <span>Bộ số tam giác vàng</span>
          </button>

          {/* TAB 2 */}
          <button
            onClick={() => setActiveTab('lifemap')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'lifemap' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <LayoutGrid size={16} />
            <span>Life Map {layer2.indicatorsGrid.length} chỉ số</span>
            {user ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} className="text-amber-500" />}
          </button>

          {/* TAB 3 */}
          <button
            onClick={() => setActiveTab('layer3')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'layer3' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Sparkles size={16} className="text-[#267D71]" />
            <span>Luận giải đa chiều</span>
            {isPaid ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} className="text-amber-500" />}
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: BỘ SỐ TAM GIÁC VÀNG (GUEST ACCESS - NO LOGIN REQUIRED)           */}
      {/* ======================================================================= */}
      {activeTab === 'triangle' && (
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

              {/* TAB 1 PDF EXPORT BUTTON */}
              <a
                href={`/report/print?id=${currentCustomer?.id || 'demo'}&scope=tab1`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <Printer size={15} />
                <span>Xuất PDF Tam Giác Vàng</span>
              </a>
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
                          ({layer1.life_path.breakdown})
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
                          ({layer1.expression.breakdown})
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
                          ({layer1.heart_desire.breakdown})
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
                  🔓
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0D2B26] font-heading">
                    Khám Phá Trọn Bộ Life Map {layer2.indicatorsGrid.length} Chỉ Số Của Bạn
                  </div>
                  <div className="text-xs text-[#5F736E]">
                    Chuyển sang Tab "Life Map {layer2.indicatorsGrid.length} chỉ số" để xem bản đồ năng lượng chi tiết nhất.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('lifemap')}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs whitespace-nowrap shadow-sm font-bold"
              >
                Khám Phá {layer2.indicatorsGrid.length} Chỉ Số ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: LIFE MAP 21 CHỈ SỐ (4 KHỐI KỂ CHUYỆN - KIM TỰ THÁP & TIMELINE)   */}
      {/* ======================================================================= */}
      {activeTab === 'lifemap' && (
        <div className="space-y-6">
          {!user ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-8 sm:p-12 text-center shadow-md">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto text-2xl">
                  🔒
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
                  Đăng Nhập Miễn Phí Để Mở Khóa Life Map {layer2.indicatorsGrid.length} Chỉ Số
                </h2>
                <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed">
                  Đăng nhập bằng tài khoản Google để xem toàn bộ 21 thẻ chỉ số thần số học, timeline ngắn hạn và sơ đồ Kim Tự Tháp 4 đỉnh cao.
                </p>
                <button
                  onClick={loginWithGoogle}
                  className="px-6 py-3 rounded-2xl btn-primary text-sm font-bold inline-flex items-center gap-2 shadow-md mt-2"
                >
                  <UserCheck size={18} />
                  <span>Đăng Nhập Ngay Bằng Google (Miễn Phí)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TOP HEADER & PDF EXPORT */}
              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="badge-butter px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block mb-1">
                    Bản Đồ Năng Lượng 4 Khối Kể Chuyện
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                    Life Map 21 Chỉ Số Của {fullName}
                  </h2>
                </div>

                <a
                  href={`/report/print?id=${currentCustomer?.id || 'demo'}&scope=tab2`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-4 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Printer size={15} />
                  <span>Xuất PDF Life Map 21 Chỉ Số</span>
                </a>
              </div>

              {/* KHỐI 1: HẠT NHÂN BẢN SẮC */}
              <div className="bg-[#FFFFFF] border-2 border-[#013E37]/30 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFEFB3]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center font-bold text-lg shadow-sm">
                    🌟
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#267D71]">Khối 1: Căn Cước Năng Lượng</div>
                    <h3 className="text-lg font-bold font-heading text-[#0D2B26]">Hạt Nhân Bản Sắc (Core Identity)</h3>
                  </div>
                </div>
                <p className="text-xs text-[#5F736E] mb-5 leading-relaxed">
                  Trả lời câu hỏi cốt lõi: <em>"Tôi là ai? Tôi đến cuộc đời này để làm gì? Đâu là khát khao thầm kín và hình ảnh đại diện của tôi?"</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pillar1_Core.map((item) => (
                    <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E2E8E5] hover:border-[#013E37] transition-all flex flex-col justify-between text-center">
                      <div>
                        <div className="flex items-baseline justify-center gap-1.5 mb-1">
                          <span className="text-3xl font-extrabold text-[#013E37]">{item.number}</span>
                          {item.breakdown && (
                            <span className="text-xs font-bold text-[#267D71]">{item.breakdown}</span>
                          )}
                        </div>
                        <div className="font-bold text-[11px] uppercase tracking-wider text-[#0D2B26] font-heading mb-1.5">{item.title}</div>
                        <div className="text-[11px] text-[#5F736E] leading-relaxed line-clamp-3">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 2: BỘ CÔNG CỤ & PHẢN XẠ HÀNH VI */}
              <div className="bg-[#FFFFFF] border border-[#267D71]/30 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center font-bold text-lg border border-[#267D71]/20">
                    🛠️
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#267D71]">Khối 2: Phương Tiện Thực Thi</div>
                    <h3 className="text-lg font-bold font-heading text-[#0D2B26]">Bộ Công Cụ & Phản Xạ Hành Vi (Behavioral Tools)</h3>
                  </div>
                </div>
                <p className="text-xs text-[#5F736E] mb-5 leading-relaxed">
                  Trả lời câu hỏi: <em>"Tôi dùng tố chất và vũ khí gì để hành động? Khi gặp biến cố hoặc khủng hoảng, cơ chế tự vệ và ra quyết định của tôi là gì?"</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pillar2_Tools.map((item) => (
                    <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E2E8E5] hover:border-[#267D71] transition-all flex flex-col justify-between text-center">
                      <div>
                        <div className="flex items-baseline justify-center gap-1.5 mb-1">
                          <span className="text-3xl font-extrabold text-[#267D71]">{item.number}</span>
                          {item.breakdown && (
                            <span className="text-xs font-bold text-[#267D71]">{item.breakdown}</span>
                          )}
                        </div>
                        <div className="font-bold text-[11px] uppercase tracking-wider text-[#0D2B26] font-heading mb-1.5">{item.title}</div>
                        <div className="text-[11px] text-[#5F736E] leading-relaxed line-clamp-3">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 3: VÙNG TRŨNG & PHÁT TRIỂN (THIẾU, BÀI HỌC, TRƯỞNG THÀNH, THẾ HỆ) */}
              <div className="bg-[#FFFFFF] border border-[#8C6A81]/40 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center font-bold text-lg border border-[#8C6A81]/30">
                    ⚖️
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#8C6A81]">Khối 3: Vùng Trũng & Phát Triển</div>
                    <h3 className="text-lg font-bold font-heading text-[#0D2B26]">Điểm Mù, Trưởng Thành & Thế Hệ (Shadow & Growth)</h3>
                  </div>
                </div>
                <p className="text-xs text-[#5F736E] mb-5 leading-relaxed">
                  Trả lời câu hỏi: <em>"Điểm mù nào đang cản trở tôi? Giai đoạn trưởng thành hoàng kim đòi hỏi bài học gì và thời đại kỳ vọng điều gì ở tôi?"</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {pillar3_ShadowAndGrowth.map((item) => (
                    <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#8C6A81]/30 hover:border-[#8C6A81] transition-all flex flex-col justify-between text-center">
                      <div>
                        <div className="flex items-baseline justify-center gap-1.5 mb-1">
                          <span className="text-3xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{item.number}</span>
                          {item.breakdown && (
                            <span className="text-xs font-bold text-[#8C6A81]">{item.breakdown}</span>
                          )}
                        </div>
                        <div className="font-bold text-[11px] uppercase tracking-wider text-[#0D2B26] font-heading mb-1.5">{item.title}</div>
                        <div className="text-[11px] text-[#5F736E] leading-relaxed line-clamp-3">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 4: DÒNG CHẢY ĐỊNH MỆNH (TIMELINE NGẮN HẠN & KIM TỰ THÁP ĐỈNH CAO) */}
              <div className="bg-[#FFFFFF] border-2 border-[#F9E79F] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-bold text-lg border border-[#F9E79F]">
                    ⏳
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#013E37]">Khối 4: Dòng Chảy Định Mệnh</div>
                    <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Vận Trình Chu Kỳ & Sơ Đồ Kim Tự Tháp Cuộc Đời</h3>
                  </div>
                </div>

                {/* 1. TIMELINE NGẮN HẠN (NĂM, THÁNG, 7 NGÀY CÁ NHÂN) */}
                <div className="p-5 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#E2E8E5] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8E5]">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0D2B26] font-heading">
                      <Calendar size={16} className="text-[#267D71]" />
                      <span>Dòng Chảy Năng Lượng Ngắn Hạn</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-[#EEF5F3] text-[#013E37] font-bold rounded-xl border border-[#267D71]/20">
                        Năm {timeline.currentYear} (Năm CN {timeline.personalYear})
                      </span>
                      <span className="px-3 py-1 bg-[#FFEFB3] text-[#013E37] font-bold rounded-xl border border-[#F9E79F]">
                        Tháng {timeline.currentMonth} (Tháng CN {timeline.personalMonth})
                      </span>
                    </div>
                  </div>

                  {/* 7 DAYS STRIP (3 DAYS BEFORE, TODAY IN CENTER, 3 DAYS AFTER) */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center pt-2">
                    {timeline.days.map((d, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl p-2 sm:p-3 transition-all flex flex-col items-center justify-between ${
                          d.isToday
                            ? 'bg-[#013E37] text-white shadow-md scale-105 border-2 border-[#FFEFB3]'
                            : 'bg-white border border-[#E2E8E5] text-[#2D3E3A] hover:border-[#267D71]'
                        }`}
                      >
                        <div className={`text-[10px] sm:text-xs font-bold uppercase ${d.isToday ? 'text-[#FFEFB3]' : 'text-[#5F736E]'}`}>
                          {d.dayOfWeek}
                        </div>
                        <div className={`text-xs sm:text-sm font-semibold my-0.5 ${d.isToday ? 'text-white font-extrabold' : 'text-[#0D2B26]'}`}>
                          {d.dateFormatted}
                        </div>
                        <div className="mt-1">
                          <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
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
                    <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-1">
                      Mô Hình Kim Cương Đa Chiều
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold font-heading text-[#0D2B26]">
                      Sơ Đồ Chặng | Thách Thức | 4 Đỉnh Cao Cuộc Đời ({pyramid.currentAge} tuổi)
                    </h4>
                    <p className="text-xs text-[#5F736E] mt-1">
                      Hệ thống 4 đỉnh cao kim tự tháp kết hợp 4 thử thách nghiệp lực tương ứng theo từng giai đoạn tuổi.
                    </p>
                  </div>

                  {/* VISUAL PYRAMID BUILDINGS */}
                  <div className="flex flex-col items-center justify-center py-4 space-y-3.5 max-w-lg mx-auto">
                    {/* ROW 1: PINNACLE 4 (TOP) */}
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-extrabold text-[#013E37] uppercase tracking-wider mb-1">
                        Đỉnh 4 (Tuổi {pyramid.age[3]}+)
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
                      <span className="text-[11px] font-bold text-[#013E37] uppercase tracking-wider mb-1">
                        Đỉnh 3 (Tuổi {pyramid.age[2]} - {pyramid.age[3]})
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
                        <span className="text-[10px] font-bold text-[#013E37] uppercase tracking-wider mb-1">
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
                        <span className="text-[10px] font-bold text-[#013E37] uppercase tracking-wider mb-1">
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
                    <div className="flex items-center justify-center gap-4 sm:gap-6 py-2.5 border-y-2 border-dashed border-[#E2E8E5] w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-[#5F736E] uppercase mb-0.5">Tháng sinh</span>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-lg text-[#0D2B26] shadow-inner">
                          {pyramid.root[0]}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-[#5F736E] uppercase mb-0.5">Ngày sinh</span>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-lg text-[#0D2B26] shadow-inner">
                          {pyramid.root[1]}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-[#5F736E] uppercase mb-0.5">Năm sinh</span>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-center font-extrabold text-lg text-[#0D2B26] shadow-inner">
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
                        <span className="text-[10px] font-bold text-[#8C6A81] uppercase mt-1">Thách Thức 1</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-sm">
                          <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[1]}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#8C6A81] uppercase mt-1">Thách Thức 2</span>
                      </div>
                    </div>

                    {/* ROW 6: CHALLENGE 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF8F5] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-sm">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[2]}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#8C6A81] uppercase mt-1">Thách Thức 3</span>
                    </div>

                    {/* ROW 7: CHALLENGE 4 (BOTTOM) */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FAF5FF] border-2 border-[#8C6A81] flex flex-col items-center justify-center shadow-md">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{pyramid.challenge[3]}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#8C6A81] uppercase mt-1">Thách Thức 4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTEXTUAL CTA TO TAB 3 */}
              <div className="bg-[#FFEFB3] border border-[#F9E79F] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-sm font-bold text-[#013E37] font-heading">
                    Muốn xem luận giải chuyên sâu AI kết hợp giới tính & độ tuổi?
                  </div>
                  <div className="text-xs text-[#5F736E] mt-0.5">
                    Mở khóa Tab "Luận giải đa chiều" để phân tích nợ nghiệp, ma trận tương tác và lộ trình thành công!
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('layer3')}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs whitespace-nowrap shadow-sm font-bold"
                >
                  Xem Luận Giải Đa Chiều ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: LUẬN GIẢI ĐA CHIỀU (PAID / CREDIT BUFFER CONFIRM / AI SYNTHESIS)   */}
      {/* ======================================================================= */}
      {activeTab === 'layer3' && (
        <div className="space-y-6">
          {/* CASE A: UNPAID AND NO CREDITS IN ACCOUNT */}
          {!isPaid && userCredits <= 0 && (
            <div className="relative rounded-3xl overflow-hidden border border-[#E2E8E5] bg-[#FFFFFF] p-8 sm:p-12 text-center shadow-md">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex p-3.5 rounded-2xl bg-[#FFEFB3] text-[#013E37] text-3xl shadow-sm">
                  ✨
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-heading text-[#0D2B26]">
                  Luận Giải Đa Chiều Độc Bản Dành Cho {fullName}
                </h2>
                <p className="text-[#5F736E] text-sm sm:text-base leading-relaxed">
                  Bản luận giải AI độc bản không dùng các đoạn văn mẫu cố định mà phân tích tổng hòa giữa <strong className="text-[#013E37]">toàn bộ {layer2.indicatorsGrid.length} chỉ số</strong>, yếu tố <strong className="text-[#267D71]">Giới tính ({layer3.genderAgeAnalysis.gender})</strong>, <strong className="text-[#8C6A81]">{layer3.genderAgeAnalysis.ageGroupText}</strong> và chu kỳ Năm Thế Giới {layer3.worldCycleAnalysis.worldYearNumber}.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#267D71] text-xl mb-1.5">👤</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Giới Tính & Độ Tuổi</div>
                    <div className="text-xs text-[#5F736E] mt-1">{layer3.genderAgeAnalysis.ageGroupRole}</div>
                  </div>
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#8C6A81] text-xl mb-1.5">⚖️</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Nợ Nghiệp & Thử Thách</div>
                    <div className="text-xs text-[#5F736E] mt-1">Chỉ rõ bài học quá khứ cần hoàn thành để bứt phá tài chính và công danh.</div>
                  </div>
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#013E37] text-xl mb-1.5">🗺️</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Năm Thế Giới & Lộ Trình</div>
                    <div className="text-xs text-[#5F736E] mt-1">Kế hoạch 3 bước cụ thể và dự báo chiến lược cho từng giai đoạn.</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-8 py-4 rounded-2xl btn-primary text-base font-bold shadow-lg transition-all inline-flex items-center gap-3"
                  >
                    <span>🚀 Mở Khóa Luận Giải Đa Chiều - 200.000 đ</span>
                  </button>
                  <div className="text-xs text-[#93A39F] mt-2.5">
                    Thanh toán 1 lần duy nhất • Mở khóa vĩnh viễn • Xuất Ebook PDF 30+ trang
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASE B: USER HAS CREDITS (COACH / MULTI-PACKAGE) -> BƯỚC ĐỆM XÁC NHẬN TRỪ LƯỢT */}
          {!isPaid && userCredits > 0 && (
            <div className="bg-[#FFFFFF] border-2 border-[#267D71] rounded-3xl p-8 sm:p-10 shadow-xl max-w-2xl mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto text-3xl shadow-sm border border-[#F9E79F]">
                🎟️
              </div>
              <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
                Xác Nhận Dùng 1 Lượt Xem Luận Giải Đa Chiều
              </h2>
              <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/30 text-xs sm:text-sm text-[#013E37] text-left leading-relaxed space-y-2">
                <div className="flex justify-between items-center">
                  <span>Số dư lượt trong tài khoản của bạn:</span>
                  <strong className="text-base text-[#013E37] font-extrabold">{userCredits} lượt</strong>
                </div>
                <div className="h-px bg-[#267D71]/20 my-1" />
                <div>
                  Bạn có muốn dùng <strong>1 lượt</strong> để mở khóa bản Luận Giải Đa Chiều AI chuyên sâu cho <strong className="text-[#0D2B26]">{fullName}</strong> ({currentCustomer?.dob}) không?
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleConfirmDeductCredit}
                  disabled={isDeductingCredit}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl btn-primary font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isDeductingCredit ? (
                    <>
                      <span className="animate-spin">🌀</span>
                      <span>Đang trừ lượt...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Xác Nhận Dùng 1 Lượt Để Mở Khóa</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('triangle')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2E8E5] text-[#5F736E] font-semibold text-sm transition-all"
                >
                  Để Sau (Quay Lại)
                </button>
              </div>
            </div>
          )}

          {/* CASE C: ALREADY PAID / UNLOCKED -> RENDER FULL AI MULTI-DIMENSIONAL ANALYSIS */}
          {isPaid && (
            <div className="space-y-6">
              <div className="bg-[#EEF5F3] border border-[#267D71]/30 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[#267D71] text-xs font-bold uppercase tracking-wider font-heading">LUẬN GIẢI ĐA CHIỀU CHUYÊN SÂU AI (VIP UNLOCKED)</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26] mt-1">Bản Báo Cáo Chuyên Sâu Của {fullName}</h2>
                </div>

                {/* TAB 3 PDF EXPORT BUTTON */}
                <a
                  href={`/report/print?id=${currentCustomer?.id || 'demo'}&scope=tab3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
                >
                  <Printer size={15} />
                  <span>Xuất PDF Luận Giải Đa Chiều VIP</span>
                </a>
              </div>

              {/* SECTION 1: GENDER & AGE ANALYSIS */}
              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#013E37] flex items-center justify-center text-xl mb-4 border border-[#267D71]/20">
                  👤
                </div>
                <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-2">1. Phân Tích Giới Tính & Độ Tuổi</h3>
                <p className="text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                  {layer3.genderAgeAnalysis.insights}
                </p>
              </div>

              {/* SECTION 2: WORLD CYCLE ANALYSIS */}
              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl mb-4 border border-[#F9E79F]">
                  🌐
                </div>
                <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-2">2. Dự Báo Năm Thế Giới & Tháng Thế Giới</h3>
                <p className="text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                  {layer3.worldCycleAnalysis.forecast}
                </p>
              </div>

              {/* SECTION 3: CROSS SYNTHESIS & KARMIC LESSONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center text-xl mb-4 border border-[#267D71]/20">
                    🧩
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">3. Ma Trận Năng Lượng Đa Chiều</h3>
                  <p className="text-xs sm:text-sm text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                    {layer3.crossSynthesis}
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center text-xl mb-4 border border-[#8C6A81]/30">
                    ⚖️
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">4. Nợ Nghiệp & Điểm Nghẽn Tiến Hóa</h3>
                  <div className="space-y-3 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                    <p>{layer3.challenges.obstacles}</p>
                    <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] text-[#8C6A81] font-medium">
                      {layer3.challenges.karmicLessons}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: ROADMAP */}
              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl mb-4 border border-[#F9E79F]">
                  🗺️
                </div>
                <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">5. Lộ Trình Hành Động Chuyển Hóa</h3>
                <div className="space-y-4 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
                    <strong className="text-[#013E37]">Kế hoạch hành động 3 bước:</strong>
                    <p className="whitespace-pre-line mt-1">{layer3.actionRoadmap.actionPlan}</p>
                  </div>
                  <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20">
                    <strong className="text-[#0D2B26]">Định hướng môi trường phát triển:</strong> {layer3.actionRoadmap.careerGuide}
                  </div>
                  <div className="bg-[#FFEFB3] p-4 rounded-2xl border border-[#F9E79F] text-[#013E37] font-semibold">
                    {layer3.actionRoadmap.personalYear}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FLOATING SUPPORT CHAT POPUP (BOTTOM RIGHT) */}
      <SupportChatPopup
        customerName={fullName}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
      />

      {/* PAYMENT / PRICING MODAL TRIGGERED FROM TAB 3 */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl my-8">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5F736E] hover:text-[#0D2B26] rounded-full transition-all text-xl"
            >
              ✕
            </button>
            <PricingSection
              customerId={currentCustomer?.id}
              onPaymentSuccess={() => {
                setIsPaid(true);
                setIsPaymentModalOpen(false);
                if (onRefresh) onRefresh();
              }}
            />
          </div>
        </div>
      )}

      {/* LEAD REQUEST MODAL FOR COACH BOOKING */}
      <LeadRequestModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        customerId={currentCustomer?.id}
        defaultFullName={fullName}
      />
    </div>
  );
}

export default ReportDashboard;
