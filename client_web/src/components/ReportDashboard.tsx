'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { generate3LayerNumerologyData, formatTitleCase } from '@/lib/numerologyReportGenerator';
import { generateMultiIndicatorSynthesis } from '@/lib/multiIndicatorSynthesis';
import { validateAndSanitizeReportData } from '@/lib/reportSemanticValidator';
import { NameAuditAppendix } from './NameAuditAppendix';
import PricingSection from './PricingSection';
import { LeadRequestModal } from './LeadRequestModal';
import { SupportChatPopup } from './SupportChatPopup';
import { IndicatorKnowledgeCard } from './IndicatorKnowledgeCard';
import { PersonalCalendarModal } from './PersonalCalendarModal';
import { AdaptiveProfileModal } from './AdaptiveProfileModal';
import { 
  ReadingProfileId, 
  READING_PROFILES, 
  recommendReadingProfile 
} from '@/lib/adaptiveReadingProfiles';
import { 
  Sparkles, Printer, UserCheck, Lock, Unlock, Headphones, 
  Compass, ShieldAlert, Award, ArrowRight, Check, AlertCircle, 
  FileText, UserPlus, HelpCircle, LayoutGrid, Zap, Calendar, ArrowLeftRight, SlidersHorizontal
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
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAdaptiveModalOpen, setIsAdaptiveModalOpen] = useState(false);

  // Khởi tạo phong cách đọc tối ưu theo AI recommendation từ bộ số
  const [readingProfile, setReadingProfile] = useState<ReadingProfileId>(() => {
    const lp = currentCustomer?.map?.life_path || 8;
    const soul = currentCustomer?.map?.soul_urge || 7;
    const personality = currentCustomer?.map?.personality || 8;
    const rationalThought = currentCustomer?.map?.rational_thought || 1;
    return recommendReadingProfile(lp, soul, personality, rationalThought).recommendedProfile.id;
  });

  // Danh sách 1-3 trọng tâm khai vấn được người dùng chọn
  const [selectedFocusTopics, setSelectedFocusTopics] = useState<string[]>(() => {
    if (currentCustomer?.life_focus && Array.isArray(currentCustomer.life_focus)) {
      return currentCustomer.life_focus;
    }
    return ['career', 'money', 'love'];
  });

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
    life_focus: selectedFocusTopics,
  });

  const { sanitizedReport } = validateAndSanitizeReportData({ userInfo: currentCustomer, layer1, layer2, layer3 });

  // 4 THEMATIC PILLARS
  const pillar1_Core = layer2.indicatorsGrid.filter(i => ['lp', 'exp', 'hd', 'per', 'lpe', 'hdp'].includes(i.id));
  const pillar2_Tools = layer2.indicatorsGrid.filter(i => ['dob', 'rat', 'att', 'bal', 'pas', 'sub'].includes(i.id));
  const pillar3_ShadowAndGrowth = layer2.indicatorsGrid.filter(i => ['kar', 'les', 'mat', 'gen'].includes(i.id));

  const pyramid = layer2.pyramidData;
  const timeline = layer2.shortTermTimeline;

  const getIndNum = (id: string, fallback: number): number => {
    const item = layer2.indicatorsGrid.find(i => i.id === id);
    if (!item) return fallback;
    const num = parseInt(item.number, 10);
    return isNaN(num) ? fallback : num;
  };

  // BỨC TRANH TỔNG HÒA ĐA CHIỀU (MULTI-INDICATOR SYNTHESIS)
  const synthesis = generateMultiIndicatorSynthesis({
    fullName,
    birthDate: currentCustomer?.dob || '27/08/1980',
    lifePath: getIndNum('lp', 8),
    expression: getIndNum('exp', 6),
    soul: getIndNum('hd', 7),
    personality: getIndNum('per', 8),
    attitude: getIndNum('att', 8),
    karmicLessons: currentCustomer?.map?.missing_numbers || [6],
    challenges: [1, 1, 0, 0],
    personalYear: timeline.personalYear || 9,
    rationalThought: getIndNum('rat', 1),
    balance: getIndNum('bal', 7),
    hiddenPassion: getIndNum('pas', 3),
    maturity: getIndNum('mat', 5),
  });

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
                  {pillar1_Core.map((item) => (
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

              {/* KHỐI 2: BỘ CÔNG CỤ & PHẢN XẠ HÀNH VI */}
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
                  {pillar2_Tools.map((item) => (
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

              {/* KHỐI 3: VÙNG TRŨNG & PHÁT TRIỂN (THIẾU, BÀI HỌC, TRƯỞNG THÀNH, THẾ HỆ) */}
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
                  {pillar3_ShadowAndGrowth.map((item) => (
                    <div key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#8C6A81]/30 hover:border-[#8C6A81] transition-all flex flex-col justify-between text-center">
                      <div>
                        <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#8C6A81]" style={{ color: '#8C6A81' }}>{item.number}</span>
                          {item.breakdown && (
                            <span className="text-xs sm:text-sm font-bold text-[#8C6A81]">{item.breakdown}</span>
                          )}
                        </div>
                        <div className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0D2B26] font-heading mb-2">{item.title}</div>
                        <div className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed line-clamp-3">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 4: DÒNG CHẢY ĐỊNH MỆNH (TIMELINE NGẮN HẠN & KIM TỰ THÁP ĐỈNH CAO) */}
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
                      <span className="text-xs sm:text-sm font-bold text-[#013E37] uppercase tracking-wider mb-1.5">
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
                Xác Nhận Dùng 1 Lượt Xem Luận Giải Đa Chiều VIP
              </h2>
              <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/30 text-xs sm:text-sm text-[#013E37] text-left leading-relaxed space-y-2">
                <div className="flex justify-between items-center">
                  <span>Số dư lượt trong tài khoản của bạn:</span>
                  <strong className="text-base text-[#013E37] font-extrabold">{userCredits} lượt</strong>
                </div>
                <div className="h-px bg-[#267D71]/20 my-1" />
                <div>
                  Bạn có muốn dùng <strong>1 lượt</strong> để mở khóa bản Luận Giải Đa Chiều AI chuyên sâu (5 Chương chuẩn Life Coach ICF) cho <strong className="text-[#0D2B26]">{fullName}</strong> ({currentCustomer?.dob}) không?
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleConfirmDeductCredit();
                    setIsFocusModalOpen(true);
                  }}
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
                      <span>Xác Nhận Dùng 1 Lượt & Chọn Trọng Tâm</span>
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

          {/* CASE C: ALREADY PAID / UNLOCKED -> RENDER FULL 5-CHAPTER VIP LIFE COACH REPORT */}
          {isPaid && (
            <div className="space-y-8">
              {/* VIP HEADER BANNER */}
              <div className="bg-[#013E37] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#FFEFB3]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                      BÁO CÁO LUẬN GIẢI CHUYÊN SÂU (2.000+ TỪ)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                      Cấu Trúc Khai Vấn & Kế Hoạch Hành Động
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#FFEFB3]">
                    Luận Giải Đa Chiều Độc Bản Của {fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#E2E8E5] max-w-2xl leading-relaxed">
                    Bản phân tích hợp nhất 21 chỉ số, 6 cặp liên kết tương tác, bối cảnh nhân khẩu học ({layer3.genderAgeAnalysis.gender}, {layer3.genderAgeAnalysis.ageGroupText}) và giải pháp chuyên sâu cho các vấn đề bạn quan tâm.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsAdaptiveModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-[#FFEFB3] text-xs font-bold transition-all border border-[#FFEFB3]/40 flex items-center gap-2 shadow-sm"
                  >
                    <SlidersHorizontal size={15} />
                    <span>🎨 Phong Cách: {READING_PROFILES[readingProfile].shortName}</span>
                  </button>
                  <button
                    onClick={() => setIsCalendarModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-[#FFEFB3] text-xs font-bold transition-all border border-[#FFEFB3]/40 flex items-center gap-2 shadow-sm"
                  >
                    <Calendar size={15} />
                    <span>📅 Lịch Năng Lượng (Coach)</span>
                  </button>
                  <button
                    onClick={() => setIsFocusModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2 shadow-sm"
                  >
                    <span>🎯 Đổi Trọng Tâm ({selectedFocusTopics.length}/3)</span>
                  </button>
                  <a
                    href={`/report/print?id=${currentCustomer?.id || 'demo'}&scope=tab3&profile=${readingProfile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
                  >
                    <Printer size={15} />
                    <span>Xuất Ebook PDF ({READING_PROFILES[readingProfile].pageCount})</span>
                  </a>
                </div>
              </div>

              {/* ADAPTIVE PROFILE QUICK SELECTOR BAR */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2E8E5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#267D71]">Chế Độ Đọc:</span>
                  <strong className="text-[#013E37]">{READING_PROFILES[readingProfile].name}</strong>
                  <span className="text-[#5F736E]">({READING_PROFILES[readingProfile].pageCount})</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['executive', 'dynamic', 'deep', 'empathic'] as ReadingProfileId[]).map((pId) => {
                    const p = READING_PROFILES[pId];
                    const isActive = readingProfile === pId;
                    return (
                      <button
                        key={pId}
                        onClick={() => setReadingProfile(pId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#013E37] text-[#FFEFB3] shadow-sm'
                            : 'bg-white text-[#4A5D58] hover:bg-[#EEF5F3] border border-[#E2E8E5]'
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span>{p.shortName}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setIsAdaptiveModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EEF5F3] text-[#267D71] border border-[#E2E8E5] text-xs font-bold transition-all"
                    title="Xem chi tiết & Tùy chỉnh phong cách"
                  >
                    ⚙️ Tùy chỉnh
                  </button>
                </div>
              </div>

              {/* QUICK CHAPTER NAVIGATION PILLS */}
              <div className="sticky top-4 z-20 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-[#E2E8E5] shadow-sm flex items-center gap-2 overflow-x-auto">
                <a href="#transparency" className="px-3.5 py-2 rounded-xl bg-[#013E37] text-[#FFEFB3] font-extrabold text-xs whitespace-nowrap transition-all shadow-sm">
                  🔍 Minh Bạch Công Thức
                </a>
                <a href="#synthesis" className="px-3.5 py-2 rounded-xl bg-[#FAF5FF] border border-[#8C6A81]/30 font-bold text-[#8C6A81] whitespace-nowrap transition-all shadow-sm">
                  ✨ Bức Tranh Tổng Hòa
                </a>
                <a href="#ch1" className="px-3.5 py-2 rounded-xl bg-[#EEF5F3] hover:bg-[#267D71] hover:text-white font-bold text-[#013E37] whitespace-nowrap transition-all shadow-sm">
                  Chương 1: Bản Đồ Bản Thân
                </a>
                <a href="#ch2" className="px-3.5 py-2 rounded-xl bg-[#EEF5F3] hover:bg-[#267D71] hover:text-white font-bold text-[#013E37] whitespace-nowrap transition-all shadow-sm">
                  Chương 2: Bộ Công Cụ
                </a>
                <a href="#ch3" className="px-3.5 py-2 rounded-xl bg-[#EEF5F3] hover:bg-[#267D71] hover:text-white font-bold text-[#013E37] whitespace-nowrap transition-all shadow-sm">
                  Chương 3: Vùng Trũng
                </a>
                <a href="#ch4" className="px-3.5 py-2 rounded-xl bg-[#EEF5F3] hover:bg-[#267D71] hover:text-white font-bold text-[#013E37] whitespace-nowrap transition-all shadow-sm">
                  Chương 4: Kim Tự Tháp
                </a>
                <a href="#ch5" className="px-3.5 py-2 rounded-xl bg-[#FFEFB3] hover:bg-[#F9E79F] font-extrabold text-[#013E37] whitespace-nowrap transition-all shadow-md">
                  Chương 5: Khai Vấn Trọng Tâm
                </a>
                <a href="#appendix" className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2E8E5] font-bold text-[#013E37] whitespace-nowrap transition-all shadow-sm">
                  📑 Phụ Lục Kiểm Toán
                </a>
              </div>

              {/* EXECUTIVE SUMMARY 1-PAGE CORE MAP */}
              <section className="bg-[#FAF8F5] border-2 border-[#013E37]/20 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E5] pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#267D71]">Executive Summary</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#013E37]">Bản Đồ Cốt Lõi (Core Map) Của {fullName}</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#013E37] text-[#FFEFB3] rounded-full text-xs font-bold font-mono self-start sm:self-auto shadow-sm">
                    LM-PY-2026.02
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 space-y-2 shadow-xs">
                    <div className="font-bold text-[#013E37] text-xs uppercase flex items-center gap-1.5">
                      <span>🌟 3 Trục Năng Lực Cốt Lõi:</span>
                    </div>
                    <ul className="space-y-1.5 text-[#2D3E3A]">
                      {synthesis.executiveSummary.coreStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-bold text-[#267D71]">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-purple-100 space-y-2 shadow-xs">
                    <div className="font-bold text-[#8C6A81] text-xs uppercase flex items-center gap-1.5">
                      <span>⚖️ 2 Điểm Căng Kéo Cần Điều Hòa:</span>
                    </div>
                    <ul className="space-y-1.5 text-[#2D3E3A]">
                      {synthesis.executiveSummary.internalTensions.map((ten, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-bold text-[#8C6A81]">•</span>
                          <span>{ten}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20 space-y-1">
                    <div className="font-bold text-[#013E37] uppercase text-[11px]">🌱 Chủ Đề Rèn Luyện & Vun Bồi:</div>
                    <p className="text-[#2D3E3A] font-medium">{synthesis.executiveSummary.growthTheme}</p>
                  </div>
                  <div className="p-3.5 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] space-y-1">
                    <div className="font-bold text-[#013E37] uppercase text-[11px]">⏳ Chu Kỳ & Trọng Tâm Năm Hiện Tại:</div>
                    <p className="text-[#013E37] font-medium">{synthesis.executiveSummary.currentCycleStrategy}</p>
                  </div>
                </div>
              </section>

              {/* BẢNG MINH BẠCH DỮ LIỆU ĐẦU VÀO & CÔNG THỨC TÍNH TOÁN (TRANSPARENCY TABLE) */}
              <section id="transparency" className="bg-[#FFFFFF] border border-[#267D71]/40 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center text-xl font-extrabold shadow-sm shrink-0">
                      📐
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#267D71]">
                        DATA & METHODOLOGY TRANSPARENCY
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                        {layer3.structuredReport.transparencyTable.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5F736E]">
                        Công khai nguồn dữ liệu, quy chuẩn quy đổi Pythagoras Quốc tế và chi tiết phép tính từng chỉ số.
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#EEF5F3] text-[#013E37] text-xs font-bold self-start sm:self-auto border border-[#267D71]/30">
                    Ngày tham chiếu: {layer3.structuredReport.transparencyTable.referenceDate}
                  </div>
                </div>

                {/* THÔNG TIN CHUẨN HÓA ĐẦU VÀO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2">
                    <div className="font-bold text-[#013E37] uppercase text-xs sm:text-sm tracking-wider">Hồ Sơ & Chuẩn Hóa Họ Tên:</div>
                    <div className="text-[#2D3E3A]">Họ tên khai sinh: <strong>{layer3.structuredReport.transparencyTable.fullName}</strong></div>
                    <div className="text-[#2D3E3A]">Chuẩn hóa không dấu: <strong>{layer3.structuredReport.transparencyTable.normalizedName}</strong></div>
                    <div className="text-xs sm:text-sm text-[#5F736E] italic pt-1.5 border-t border-[#E2E8E5]">
                      {layer3.structuredReport.transparencyTable.expressionBreakdown}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2">
                    <div className="font-bold text-[#013E37] uppercase text-xs sm:text-sm tracking-wider">Dữ Liệu Ngày Sinh & Vận Mệnh:</div>
                    <div className="text-[#2D3E3A]">Ngày tháng năm sinh: <strong>{layer3.structuredReport.transparencyTable.dob}</strong> (Giới tính: {layer3.structuredReport.transparencyTable.gender})</div>
                    <div className="text-xs sm:text-sm text-[#5F736E] italic pt-1.5 border-t border-[#E2E8E5]">
                      {layer3.structuredReport.transparencyTable.lifePathBreakdown}
                    </div>
                  </div>
                </div>

                {/* BẢNG 21 CHỈ SỐ MINH BẠCH */}
                <div className="overflow-x-auto rounded-2xl border border-[#E2E8E5]">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#EEF5F3] text-[#013E37] font-bold border-b border-[#E2E8E5]">
                        <th className="p-3.5">Tên Chỉ Số</th>
                        <th className="p-3.5 text-center">Giá Trị</th>
                        <th className="p-3.5">Công Thức Phép Tính</th>
                        <th className="p-3.5">Nguồn Dữ Liệu</th>
                        <th className="p-3.5">Ý Nghĩa Cốt Lõi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8E5] text-[#2D3E3A]">
                      {layer3.structuredReport.transparencyTable.indicators.map((ind: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="p-3.5 font-semibold text-[#0D2B26]">{ind.name}</td>
                          <td className="p-3.5 text-center font-bold text-[#013E37]">
                            <span className="px-2.5 py-1 bg-[#EEF5F3] rounded-lg border border-[#267D71]/30">
                              {ind.value}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#5F736E] font-mono text-xs">{ind.formula}</td>
                          <td className="p-3.5 text-[#5F736E]">{ind.source}</td>
                          <td className="p-3.5 text-[#2D3E3A]">{ind.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* GHI CHÚ PHƯƠNG PHÁP LUẬN BẢO TOÀN TÍNH NHẤT QUÁN */}
                <div className="p-4 sm:p-5 bg-[#EEF5F3]/50 rounded-2xl border border-[#267D71]/20 flex items-start gap-3 text-sm text-[#2D3E3A] leading-relaxed">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong className="text-[#013E37]">Lưu ý phương pháp luận Pythagoras:</strong> Chỉ số Thiếu (Karmic Lessons) là danh sách các chữ số từ 1 đến 9 không xuất hiện trong chuỗi chữ cái họ tên khai sinh. Chỉ số này phản ánh nhóm kỹ năng cần chú tâm rèn luyện có chủ đích, hoàn toàn không suy ra từ ngày sinh và không mâu thuẫn hay phủ định các chỉ số khác (như Đường Đời, Sứ Mệnh, Ngày Sinh) có giá trị rút gọn bằng 1.
                  </div>
                </div>
              </section>

              {/* BỨC TRANH TỔNG HÒA BẢN THÂN (MULTI-INDICATOR SYNTHESIS FRAMEWORK) */}
              <section id="synthesis" className="bg-[#FFFFFF] border-2 border-[#8C6A81]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#8C6A81] text-white flex items-center justify-center text-xl font-extrabold shadow-sm shrink-0">
                      ✨
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6A81]">
                        MULTI-INDICATOR SYNTHESIS
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                        Bức Tranh Tổng Hòa Bản Thân & Ma Trận Đa Chiều
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5F736E]">
                        Phân tích liên kết tương tác giữa 21 chỉ số: 3 Thế mạnh vượt trội, 2 Căng kéo nội tại, 2 Vùng rèn luyện chủ đích và 1 Trọng tâm năm hiện tại.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 1. 3 THẾ MẠNH NỔI BẬT */}
                <div className="space-y-3">
                  <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#013E37] text-[#FFEFB3] rounded-lg text-xs font-bold">1</span>
                    <span>3 Thế Mạnh Nổi Bật (Tổ Hợp Năng Lượng Cốt Lõi):</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {synthesis.strengths.map((item, idx) => (
                      <div key={idx} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="inline-block px-2.5 py-1 bg-[#EEF5F3] text-[#013E37] text-xs font-bold rounded-lg border border-[#267D71]/20">
                            {item.indicators}
                          </div>
                          <h5 className="font-bold text-sm sm:text-base text-[#013E37] font-heading leading-snug">
                            {item.title}
                          </h5>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 2 CĂNG KÉO NỘI TẠI */}
                <div className="space-y-3">
                  <h4 className="font-bold text-base sm:text-lg text-[#8C6A81] font-heading flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#8C6A81] text-white rounded-lg text-xs font-bold">2</span>
                    <span>2 Căng Kéo Nội Tại Cần Dung Hòa (Internal Tensions):</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {synthesis.tensions.map((item, idx) => (
                      <div key={idx} className="p-5 bg-[#FAF5FF] rounded-2xl border border-[#8C6A81]/25 space-y-3">
                        <div className="inline-block px-2.5 py-1 bg-white text-[#8C6A81] text-xs font-bold rounded-lg border border-[#8C6A81]/30">
                          {item.indicators}
                        </div>
                        <h5 className="font-bold text-sm sm:text-base text-[#8C6A81] font-heading">
                          {item.title}
                        </h5>
                        <p className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed">
                          {item.description}
                        </p>
                        <div className="p-3.5 bg-white rounded-xl border border-[#8C6A81]/20 text-xs sm:text-sm text-[#013E37] leading-relaxed">
                          <strong>💡 Giải pháp dung hòa:</strong> {item.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 2 VÙNG RÈN LUYỆN CHỦ ĐÍCH & 1 TRỌNG TÂM NĂM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2 Vùng rèn luyện */}
                  <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-3">
                    <h4 className="font-bold text-base text-[#013E37] font-heading flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#013E37] text-white rounded-md text-xs font-bold">3</span>
                      <span>2 Vùng Rèn Luyện Chủ Đích:</span>
                    </h4>
                    <div className="space-y-3">
                      {synthesis.growthFocuses.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#E2E8E5] space-y-1 text-xs sm:text-sm leading-relaxed">
                          <div className="font-bold text-[#013E37]">{item.title} ({item.indicator})</div>
                          <p className="text-[#4A5D58]">{item.guidance}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1 Trọng tâm năm hiện tại */}
                  <div className="p-5 bg-[#FFFDF5] rounded-2xl border-2 border-[#FFEFB3] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-[#013E37] text-[#FFEFB3] font-bold text-xs rounded-lg">
                          TRỌNG TÂM CHIẾN LƯỢC
                        </span>
                        <span className="text-xs font-semibold text-[#5F736E]">Năm hiện tại</span>
                      </div>
                      <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading">
                        {synthesis.currentYearFocus.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4A5D58]">
                        3 Hành động ưu tiên trong năm nay:
                      </p>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#2D3E3A]">
                      {synthesis.currentYearFocus.actionPriorities.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#FFEFB3]">
                          <span className="font-bold text-[#267D71] shrink-0">✓</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* CHƯƠNG 1: TRỤC XƯƠNG SỐNG & BẢN ĐỒ BẢN THÂN */}
              <section id="ch1" className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
                <div className="flex items-center gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center text-xl font-extrabold shadow-sm shrink-0">
                    1
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#267D71]">BẢN ĐỒ BẢN THÂN</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                      {layer3.chapters.chapter1.title}
                    </h3>
                    <p className="text-sm text-[#5F736E] mt-0.5">{layer3.chapters.chapter1.subtitle}</p>
                  </div>
                </div>

                {/* OVERVIEW EDITORIAL CALLOUT */}
                <div className="space-y-4">
                  {layer3.chapters.chapter1.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E2E8E5] space-y-2.5">
                      <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#267D71]"></span>
                        <span>{sec.heading}</span>
                      </h4>
                      <p className="text-sm sm:text-base text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TẦNG 2 SEAMLESS READING FLOW */}
                <div className="space-y-6 pt-4 border-t border-[#E2E8E5]">
                  <div className="text-sm font-extrabold uppercase tracking-wider text-[#267D71] flex items-center gap-2">
                    <Sparkles size={18} />
                    <span>Hồ Sơ Luận Giải Chi Tiết Từng Chỉ Số Cốt Lõi:</span>
                  </div>

                  {/* 1-COLUMN FLOW FOR INDICATORS */}
                  <div className="space-y-6">
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.pathAndDestiny.lifePath}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.pathAndDestiny.expression}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.pathAndDestiny.bridge}
                      accentColor="amber"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.innerAndOuter.heartDesire}
                      accentColor="purple"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.innerAndOuter.personality}
                      accentColor="purple"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.innerAndOuter.bridge}
                      accentColor="amber"
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-[#EEF5F3] rounded-2xl border-l-4 border-[#267D71] text-sm sm:text-base text-[#013E37] italic font-medium leading-relaxed">
                  {layer3.chapters.chapter1.coachQuote}
                </div>
              </section>

              {/* CHƯƠNG 2: BỘ CÔNG CỤ & NĂNG LỰC VẬN HÀNH */}
              <section id="ch2" className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
                <div className="flex items-center gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center text-xl border border-[#267D71]/30 font-extrabold shrink-0">
                    2
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#267D71]">NĂNG LỰC VẬN HÀNH</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                      {layer3.chapters.chapter2.title}
                    </h3>
                    <p className="text-sm text-[#5F736E] mt-0.5">{layer3.chapters.chapter2.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {layer3.chapters.chapter2.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E2E8E5] space-y-2.5">
                      <h4 className="font-bold text-base sm:text-lg text-[#267D71] font-heading flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#267D71]"></span>
                        <span>{sec.heading}</span>
                      </h4>
                      <p className="text-sm sm:text-base text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TẦNG 2 SEAMLESS READING FLOW */}
                <div className="space-y-6 pt-4 border-t border-[#E2E8E5]">
                  <div className="text-sm font-extrabold uppercase tracking-wider text-[#267D71] flex items-center gap-2">
                    <Sparkles size={18} />
                    <span>Chi Tiết Năng Lực Vận Hành & Phản Xạ Đời Thực:</span>
                  </div>

                  <div className="space-y-6">
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.operatingCapacity.birthday}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.operatingCapacity.rationalThought}
                      accentColor="blue"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.operatingCapacity.attitude}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.operatingCapacity.subconscious}
                      accentColor="purple"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.selfMap.operatingCapacity.generation}
                      accentColor="blue"
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-[#EEF5F3] rounded-2xl border-l-4 border-[#267D71] text-sm sm:text-base text-[#013E37] italic font-medium leading-relaxed">
                  {layer3.chapters.chapter2.coachQuote}
                </div>
              </section>

              {/* CHƯƠNG 3: VÙNG TRŨNG & NỢ BÀI HỌC */}
              <section id="ch3" className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
                <div className="flex items-center gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] text-[#8C6A81] flex items-center justify-center text-xl border border-[#8C6A81]/30 font-extrabold shrink-0">
                    3
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8C6A81]">BÀI HỌC TIẾN HÓA</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                      {layer3.chapters.chapter3.title}
                    </h3>
                    <p className="text-sm text-[#5F736E] mt-0.5">{layer3.chapters.chapter3.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {layer3.chapters.chapter3.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E2E8E5] space-y-2.5">
                      <h4 className="font-bold text-base sm:text-lg text-[#8C6A81] font-heading flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8C6A81]"></span>
                        <span>{sec.heading}</span>
                      </h4>
                      <p className="text-sm sm:text-base text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TẦNG 2 SEAMLESS READING FLOW */}
                <div className="space-y-6 pt-4 border-t border-[#E2E8E5]">
                  <div className="text-sm font-extrabold uppercase tracking-wider text-[#8C6A81] flex items-center gap-2">
                    <Sparkles size={18} />
                    <span>Chi Tiết Điểm Cần Rèn Luyện & Nợ Bài Học:</span>
                  </div>

                  <div className="space-y-6">
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.growthLessons.pointsToTrain.karmicLessons}
                      accentColor="amber"
                    />
                    {layer3.structuredReport.growthLessons.pointsToTrain.karmicDebt && (
                      <IndicatorKnowledgeCard
                        knowledge={layer3.structuredReport.growthLessons.pointsToTrain.karmicDebt}
                        accentColor="amber"
                      />
                    )}
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.growthLessons.pointsToTrain.balance}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.growthLessons.pointsToTrain.challenges}
                      accentColor="amber"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.growthLessons.longTermGrowth.maturity}
                      accentColor="purple"
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-[#FAF8F5] rounded-2xl border-l-4 border-[#8C6A81] text-sm sm:text-base text-[#8C6A81] italic font-medium leading-relaxed">
                  {layer3.chapters.chapter3.coachQuote}
                </div>
              </section>

              {/* CHƯƠNG 4: KIM TỰ THÁP & CHU KỲ THỜI GIAN */}
              <section id="ch4" className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
                <div className="flex items-center gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl border border-[#F9E79F] font-extrabold shrink-0">
                    4
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#013E37]">TRỌNG TÂM THỜI GIAN</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                      {layer3.chapters.chapter4.title}
                    </h3>
                    <p className="text-sm text-[#5F736E] mt-0.5">{layer3.chapters.chapter4.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {layer3.chapters.chapter4.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E2E8E5] space-y-2.5">
                      <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#013E37]"></span>
                        <span>{sec.heading}</span>
                      </h4>
                      <p className="text-sm sm:text-base text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TẦNG 2 SEAMLESS READING FLOW */}
                <div className="space-y-6 pt-4 border-t border-[#E2E8E5]">
                  <div className="text-sm font-extrabold uppercase tracking-wider text-[#013E37] flex items-center gap-2">
                    <Sparkles size={18} />
                    <span>Dòng Chảy Thời Gian (Năm, Tháng, Ngày Cá Nhân):</span>
                  </div>

                  <div className="space-y-6">
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.currentFocus.personalYear}
                      accentColor="amber"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.currentFocus.personalMonth}
                      accentColor="emerald"
                    />
                    <IndicatorKnowledgeCard
                      knowledge={layer3.structuredReport.currentFocus.personalDay}
                      accentColor="blue"
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-[#FFEFB3] rounded-2xl border-l-4 border-[#013E37] text-sm sm:text-base text-[#013E37] italic font-medium leading-relaxed">
                  {layer3.chapters.chapter4.coachQuote}
                </div>
              </section>

              {/* CHƯƠNG 5: KHAI VẤN TRỌNG TÂM & 30 NGÀY HÀNH ĐỘNG */}
              <section id="ch5" className="bg-[#FFFFFF] border-2 border-[#267D71] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center text-2xl font-extrabold shadow-md shrink-0">
                      5
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#267D71]">
                        ACTIONABLE LIFE COACHING
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#013E37]">
                        {layer3.chapters.chapter5.title}
                      </h3>
                      <p className="text-sm text-[#5F736E]">{layer3.chapters.chapter5.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFocusModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#EEF5F3] hover:bg-[#267D71] hover:text-white text-[#013E37] text-xs sm:text-sm font-bold transition-all self-start sm:self-auto border border-[#267D71]/30"
                  >
                    Tùy Chỉnh 1-3 Vấn Đề
                  </button>
                </div>

                {/* 1-3 FOCUSED TOPICS CARDS WITH DUE DILIGENCE CHECKLISTS */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#267D71] font-heading">
                    🎯 Giải Pháp Khai Vấn & Checklist Thẩm Định Thực Tế Cho Trọng Tâm Đã Chọn:
                  </h4>
                  <div className="space-y-6">
                    {layer3.structuredReport.solutionsForConcerns.topics.map((topic: any, idx: number) => (
                      <div key={idx} className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#267D71]/30 space-y-5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{topic.icon}</span>
                            <div>
                              <h5 className="font-bold text-lg sm:text-xl text-[#0D2B26] font-heading">{topic.title}</h5>
                              <p className="text-sm text-[#5F736E] italic">Nỗi đau trăn trở: {topic.coreConcern}</p>
                            </div>
                          </div>
                        </div>

                        {/* DISCLAIMER CALLOUT */}
                        {topic.disclaimer && (
                          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-sm text-blue-950 italic leading-relaxed">
                            {topic.disclaimer}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                          <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E2E8E5] space-y-1.5">
                            <div className="font-bold text-[#013E37]">1. Xu hướng từ biểu đồ:</div>
                            <p className="text-[#4A5D58] leading-relaxed">{topic.trendFromChart}</p>
                          </div>
                          <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E2E8E5] space-y-1.5">
                            <div className="font-bold text-[#267D71]">2. Nguồn lực nội tại:</div>
                            <p className="text-[#4A5D58] leading-relaxed">{topic.internalResources}</p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 bg-amber-50/60 rounded-xl border border-amber-200 text-sm sm:text-base space-y-1.5">
                          <div className="font-bold text-amber-900">3. Điểm mù & Rủi ro cần phòng tránh:</div>
                          <p className="text-amber-950 leading-relaxed">{topic.blindSpotsAndRisks}</p>
                        </div>

                        {/* DUE DILIGENCE CHECKLIST */}
                        {topic.checklist && topic.checklist.length > 0 && (
                          <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E2E8E5] space-y-2.5">
                            <div className="font-bold text-[#013E37] text-sm uppercase tracking-wider">
                              📋 Checklist Thẩm Định & Hành Động Thực Tế:
                            </div>
                            <ul className="space-y-2 text-sm sm:text-base text-[#2D3E3A] pl-5 list-disc leading-relaxed">
                              {topic.checklist.map((item: string, cIdx: number) => (
                                <li key={cIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 7, 30, 90 DAYS PLAN */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-sm">
                          <div className="p-4 bg-[#EEF5F3] rounded-xl border border-[#267D71]/20 space-y-1.5">
                            <div className="font-bold text-[#013E37]">7 Ngày Tới:</div>
                            <p className="text-[#2D3E3A] leading-relaxed">{topic.action7Days}</p>
                          </div>
                          <div className="p-4 bg-[#EEF5F3] rounded-xl border border-[#267D71]/20 space-y-1.5">
                            <div className="font-bold text-[#013E37]">30 Ngày Tới:</div>
                            <p className="text-[#2D3E3A] leading-relaxed">{topic.action30Days}</p>
                          </div>
                          <div className="p-4 bg-[#EEF5F3] rounded-xl border border-[#267D71]/20 space-y-1.5">
                            <div className="font-bold text-[#013E37]">90 Ngày Tới:</div>
                            <p className="text-[#2D3E3A] leading-relaxed">{topic.action90Days}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-[#E2E8E5] text-sm text-[#5F736E] space-y-1.5">
                          <div><strong>Chỉ số đo lường định lượng:</strong> {topic.progressMetric}</div>
                          <div><strong>Khi nào cần tìm chuyên gia:</strong> {topic.whenToSeekExpert}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KẾ HOẠCH ƯU TIÊN CHUYỂN HÓA (PRIORITY ACTION TABLE) */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-base text-[#0D2B26] font-heading flex items-center gap-2">
                    <span>⚡</span> Kế Hoạch Ưu Tiên Chuyển Hóa (Top 3 Nhiệm Vụ Tác Động Lớn Nhất):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {layer3.structuredReport.priorityPlan.priorities.map((item: any, idx: number) => (
                      <div key={idx} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5] space-y-2.5 text-sm">
                        <div className="font-bold text-sm text-[#013E37] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#013E37] text-white flex items-center justify-center text-xs font-extrabold">
                            {idx + 1}
                          </span>
                          <span>{item.action}</span>
                        </div>
                        <div className="text-[11px] text-[#5F736E]">
                          <strong>Tần suất / Thời hạn:</strong> {item.frequencyOrDeadline}
                        </div>
                        <div className="text-[11px] text-[#267D71]">
                          <strong>Tiêu chí hoàn thành:</strong> {item.completionCriteria}
                        </div>
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100">
                          <strong>Khi bị gián đoạn:</strong> {item.recoveryStrategy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POWER QUESTIONS (ICF COACHING) */}
                <div className="bg-[#EEF5F3] p-5 rounded-2xl border border-[#267D71]/30 space-y-3">
                  <h4 className="font-bold text-sm text-[#013E37] font-heading flex items-center gap-2">
                    <span>💡</span> Câu Hỏi Tự Vấn Quyền Năng (Power Questions):
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#2D3E3A]">
                    {layer3.structuredReport.clarifyingQuestions.map((q: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E2E8E5]">
                        <span className="text-[#267D71] font-bold shrink-0">✦</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3 DAILY MICRO HABITS */}
                <div className="bg-[#FFEFB3] p-5 rounded-2xl border border-[#F9E79F] space-y-3">
                  <h4 className="font-bold text-sm text-[#013E37] font-heading flex items-center gap-2">
                    <span>🌱</span> 3 Thói Quen Vi Mô Mỗi Ngày (Daily Micro-Habits):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {layer3.chapters.chapter5.dailyMicroHabits.map((habit: string, idx: number) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-[#F9E79F] text-xs text-[#013E37] font-medium flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#013E37] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span>{habit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LỜI KẾT */}
                <div className="p-5 bg-[#013E37] text-white rounded-2xl space-y-2">
                  <div className="font-bold text-sm font-heading text-[#FFEFB3]">
                    {layer3.structuredReport.closingRemark.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#E2E8E5] leading-relaxed">
                    {layer3.structuredReport.closingRemark.content}
                  </p>
                </div>

                <div className="p-4 bg-[#EEF5F3] text-[#013E37] rounded-2xl text-xs sm:text-sm italic font-medium text-center border border-[#267D71]/30">
                  {layer3.chapters.chapter5.coachQuote}
                </div>
              </section>

              {/* PHỤ LỤC KIỂM TOÁN HỌ TÊN & MINH BẠCH PHƯƠNG PHÁP PYTHAGORAS */}
              <section id="appendix">
                <NameAuditAppendix
                  fullName={fullName}
                  birthDate={currentCustomer?.dob || '27/08/1980'}
                  lifePath={getIndNum('lp', 8)}
                  expression={getIndNum('exp', 6)}
                  soul={getIndNum('hd', 7)}
                  personality={getIndNum('per', 8)}
                  hiddenPassion={getIndNum('pas', 3)}
                  karmicLessons={currentCustomer?.map?.missing_numbers || [6]}
                  rationalThought={getIndNum('rat', 1)}
                />
              </section>
            </div>
          )}
        </div>
      )}

      {/* LIFE FOCUS SELECTION MODAL (1-3 TOPICS) */}
      {isFocusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#267D71] font-heading">
                  CÁ NHÂN HÓA KHAI VẤN
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26] mt-1">
                  Chọn 1 Đến 3 Trọng Tâm Cuộc Đời
                </h3>
              </div>
              <button
                onClick={() => setIsFocusModalOpen(false)}
                className="p-2 text-[#5F736E] hover:text-[#0D2B26] rounded-full transition-all text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed">
              Hãy chọn tối đa <strong>3 vấn đề bạn đang trăn trở nhất</strong> để bản Luận Giải Đa Chiều tập trung đào sâu phân tích nguyên nhân gốc rễ và đưa ra lộ trình chuyển hóa cụ thể cho bạn:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'money', title: 'Tiền Bạc & Tài Chính', icon: '💰', desc: 'Dòng tiền, tích lũy, đầu tư' },
                { id: 'love', title: 'Tình Yêu & Hôn Nhân', icon: '❤️', desc: 'Hòa hợp, thấu cảm, gắn kết' },
                { id: 'career', title: 'Công Việc & Thăng Tiến', icon: '💼', desc: 'Sở trường, lãnh đạo, bứt phá' },
                { id: 'family', title: 'Gia Đình & Con Cái', icon: '🏡', desc: 'Nuôi dạy con, gắn kết mái ấm' },
                { id: 'health', title: 'Sức Khỏe & Thân - Tâm', icon: '🌿', desc: 'Cân bằng, giải tỏa áp lực' },
                { id: 'destiny', title: 'Vận Hạn & Đón Đầu Cơ Hội', icon: '🔮', desc: 'Thiên thời, phòng ngừa rủi ro' },
                { id: 'property', title: 'Nhà Cửa & Bất Động Sản', icon: '🏛️', desc: 'An cư, gia tăng tài sản' },
                { id: 'learning', title: 'Học Hành & Phát Triển', icon: '📚', desc: 'Nâng cao chuyên môn, tự học' },
                { id: 'overseas', title: 'Xuất Ngoại & Định Cư', icon: '✈️', desc: 'Mở rộng quốc tế, đi xa' },
                { id: 'legacy', title: 'Hậu Vận & An Yên Tuổi Già', icon: '🌅', desc: 'Di sản, phước đức, an nhiên' },
              ].map((item) => {
                const isSelected = selectedFocusTopics.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedFocusTopics.length > 1) {
                          setSelectedFocusTopics(selectedFocusTopics.filter(id => id !== item.id));
                        }
                      } else {
                        if (selectedFocusTopics.length < 3) {
                          setSelectedFocusTopics([...selectedFocusTopics, item.id]);
                        }
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-[#EEF5F3] border-[#267D71] shadow-sm ring-1 ring-[#267D71]'
                        : 'bg-[#FAF8F5] border-[#E2E8E5] hover:border-[#267D71]/40'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-[#0D2B26] font-heading">{item.title}</span>
                        {isSelected && <span className="text-[#267D71] text-xs font-extrabold">✓</span>}
                      </div>
                      <p className="text-[11px] text-[#5F736E] mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8E5]">
              <div className="text-xs text-[#5F736E]">
                Đã chọn: <strong className="text-[#013E37] font-bold">{selectedFocusTopics.length}/3</strong> vấn đề
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFocusModalOpen(false);
                  if (currentCustomer) {
                    currentCustomer.life_focus = selectedFocusTopics;
                    localStorage.setItem('lifemaps_current_report', JSON.stringify(currentCustomer));
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Xác Nhận & Xem Báo Cáo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
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
                setIsFocusModalOpen(true);
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

      {/* PERSONAL ENERGY CALENDAR MODAL FOR COACH */}
      <PersonalCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        customerName={fullName}
        birthDate={currentCustomer?.dob || '27/08/1980'}
        isCoachOrSubscribed={true}
      />

      {/* ADAPTIVE READING PROFILE MODAL */}
      <AdaptiveProfileModal
        isOpen={isAdaptiveModalOpen}
        onClose={() => setIsAdaptiveModalOpen(false)}
        currentProfile={readingProfile}
        onSelectProfile={(newProfile) => setReadingProfile(newProfile)}
        customerName={fullName}
        lifePath={currentCustomer?.map?.life_path || 8}
        soul={currentCustomer?.map?.soul_urge || 7}
        personality={currentCustomer?.map?.personality || 8}
        rationalThought={currentCustomer?.map?.rational_thought || 1}
      />
    </div>
  );
}

export default ReportDashboard;
