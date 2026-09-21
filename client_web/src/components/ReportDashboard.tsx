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
import { CheckoutModal } from './CheckoutModal';
import { GoldenTriangleTab } from './report/GoldenTriangleTab';
import { CoreIdentityBlock } from './report/CoreIdentityBlock';
import { BehavioralToolsBlock } from './report/BehavioralToolsBlock';
import { ShadowGrowthBlock } from './report/ShadowGrowthBlock';
import { DiamondPyramidBlock } from './report/DiamondPyramidBlock';
import { 
  ReadingProfileId, 
  READING_PROFILES, 
  recommendReadingProfile 
} from '@/lib/adaptiveReadingProfiles';
import { fetchAIReport, getApiBaseUrl, AIReportData } from '@/lib/aiReportService';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Sparkles, Printer, UserCheck, Lock, Unlock, Headphones, 
  Compass, ShieldAlert, Award, ArrowRight, Check, AlertCircle, 
  FileText, UserPlus, HelpCircle, LayoutGrid, Zap, Calendar, ArrowLeftRight, SlidersHorizontal, Plus
} from 'lucide-react';

export interface ReportDashboardProps {
  customer?: any;
  initialCustomer?: any;
  isExistingRecord?: boolean;
  onRefresh?: () => void;
}

export function ReportDashboard({ customer, initialCustomer, isExistingRecord, onRefresh }: ReportDashboardProps) {
  const currentCustomer = customer || initialCustomer;
  const { user, credits, loginWithGoogle } = useAuth();
  
  // 3 main tabs: 'triangle' (Bộ số tam giác vàng), 'lifemap' (Life Map 21 chỉ số), 'layer3' (Luận giải đa chiều)
  const [activeTab, setActiveTab] = useState<'triangle' | 'lifemap' | 'layer3'>('triangle');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAdaptiveModalOpen, setIsAdaptiveModalOpen] = useState(false);

  // In-app Direct Checkout & Topic Expansion Addon states
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);
  const [directCheckoutPlan, setDirectCheckoutPlan] = useState<{ id: string; name: string; amount: number; features?: string[] }>({
    id: 'b2c_single_discovery',
    name: 'Gói Cá Nhân Khám Phá',
    amount: 39000,
  });
  const [isTopicExpansionModalOpen, setIsTopicExpansionModalOpen] = useState(false);
  const [tempAddonTopics, setTempAddonTopics] = useState<string[]>([]);
  const [isLocal, setIsLocal] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

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
  const [isPaid, setIsPaid] = useState<boolean>(() => {
    return Boolean(
      currentCustomer?.is_paid === true || 
      currentCustomer?.tier === 'paid' || 
      currentCustomer?.tier === 'coach' ||
      (typeof currentCustomer?.unlockedTier === 'number' && currentCustomer.unlockedTier >= 3)
    );
  });

  // Quản lý trạng thái bài luận giải AI Độc Bản từ Backend
  const [aiReport, setAiReport] = useState<AIReportData | null>(() => {
    if (currentCustomer?.reports) {
      const cacheKey = `${isPaid ? 3 : 0}_vi_${readingProfile}`;
      return currentCustomer.reports[cacheKey] || null;
    }
    return null;
  });
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAIReport = React.useCallback(async () => {
    if (!currentCustomer?.map) return;
    setIsLoadingAI(true);
    setAiError(null);
    try {
      const report = await fetchAIReport({
        fullName,
        dob: currentCustomer?.dob || '',
        map: currentCustomer?.map,
        tier: isPaid ? 3 : 0,
        language: 'vi',
        readingProfile,
        customerId: currentCustomer?.id !== 'local_guest' ? currentCustomer?.id : undefined,
      });
      setAiReport(report);
    } catch (err: any) {
      console.error('Lỗi khi gọi AI Synthesis Engine:', err);
      setAiError(err.message || 'Không thể kết nối với dịch vụ AI. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingAI(false);
    }
  }, [currentCustomer, fullName, isPaid, readingProfile]);

  // Tự động kích hoạt gọi AI khi người dùng mở Tab Luận giải đa chiều (layer3) và đã thanh toán
  React.useEffect(() => {
    if (activeTab === 'layer3' && isPaid && !aiReport && !isLoadingAI && !aiError) {
      handleGenerateAIReport();
    }
  }, [activeTab, isPaid, aiReport, isLoadingAI, aiError, handleGenerateAIReport]);

  // Reset aiReport khi người dùng đổi phong cách đọc để AI tái tổng hòa theo phong cách mới
  const handleChangeReadingProfile = (newProfile: ReadingProfileId) => {
    setReadingProfile(newProfile);
    setAiReport(null);
    setAiError(null);
  };

  // Credits count for user: Lấy thời gian thực từ AuthContext (Firestore users/{uid}.credits)
  const userCredits = typeof credits === 'number' ? credits : 0;

  // Đồng bộ lại khi dữ liệu customer thay đổi
  React.useEffect(() => {
    const paid = Boolean(
      currentCustomer?.is_paid === true || 
      currentCustomer?.tier === 'paid' || 
      currentCustomer?.tier === 'coach' ||
      (typeof currentCustomer?.unlockedTier === 'number' && currentCustomer.unlockedTier >= 3)
    );
    setIsPaid(paid);
  }, [currentCustomer]);

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

  // Handle deduct credit action for Coach / Multi-package / Registered users
  const handleConfirmDeductCredit = async () => {
    if (!user) {
      loginWithGoogle();
      return;
    }

    if (userCredits < 1) {
      alert('Tài khoản của bạn hiện không còn lượt mở bài. Vui lòng nạp thêm lượt để tiếp tục.');
      return;
    }

    setIsDeductingCredit(true);
    try {
      let targetCustomerId = currentCustomer?.id;

      // Nếu khách hàng chưa có ID trên Firestore (hồ sơ vãng lai / local)
      if (!targetCustomerId || targetCustomerId.startsWith('local_')) {
        const newRecordData = {
          ...currentCustomer,
          userId: user.uid,
          email: user.email || '',
          unlockedTier: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        delete newRecordData.id;
        const docRef = await addDoc(collection(db, 'customers'), newRecordData);
        targetCustomerId = docRef.id;
        if (currentCustomer) {
          currentCustomer.id = targetCustomerId;
        }
      }

      // Lấy Firebase ID Token để xác thực với Backend
      const token = await user.getIdToken();
      const baseUrl = getApiBaseUrl();

      // Gọi API Backend an toàn trừ 1 credit và kích hoạt Tier 3
      const res = await fetch(`${baseUrl}/api/v1/customers/${targetCustomerId}/unlock-with-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData?.message || 'Không thể trừ lượt lúc này. Vui lòng thử lại.');
      }

      // Đánh dấu đã mở khóa thành công
      setIsPaid(true);

      if (currentCustomer) {
        currentCustomer.is_paid = true;
        currentCustomer.tier = 'paid';
        currentCustomer.unlockedTier = 3;
        localStorage.setItem('lifemaps_current_report', JSON.stringify({
          ...currentCustomer,
          is_paid: true,
          tier: 'paid',
          unlockedTier: 3
        }));
      }

      if (onRefresh) onRefresh();

      // Tự động kích hoạt gọi AI sinh bài độc bản
      handleGenerateAIReport();

    } catch (err: any) {
      console.error('Lỗi khi trừ lượt:', err);
      alert(err.message || 'Có lỗi xảy ra khi dùng lượt. Vui lòng thử lại.');
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
        <GoldenTriangleTab
          fullName={fullName}
          layer1={layer1}
          layer2IndicatorsCount={layer2.indicatorsGrid.length}
          user={user}
          loginWithGoogle={loginWithGoogle}
          onViewLifeMap={() => setActiveTab('lifemap')}
        />
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
                  href={`/report/print?id=${currentCustomer?.id || 'local_guest'}&scope=tab2&name=${encodeURIComponent(fullName)}&dob=${encodeURIComponent(currentCustomer?.dob || '')}&gender=${encodeURIComponent(currentCustomer?.gender || 'male')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-4 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Printer size={15} />
                  <span>Xuất PDF Life Map 21 Chỉ Số</span>
                </a>
              </div>

              {/* KHỐI 1: HẠT NHÂN BẢN SẮC */}
              <CoreIdentityBlock items={pillar1_Core} />

              {/* KHỐI 2: BỘ CÔNG CỤ & PHẢN XẠ HÀNH VI */}
              <BehavioralToolsBlock items={pillar2_Tools} />

              {/* KHỐI 3: VÙNG TRŨNG & PHÁT TRIỂN (THIẾU, BÀI HỌC, TRƯỞNG THÀNH, THẾ HỆ) */}
              <ShadowGrowthBlock items={pillar3_ShadowAndGrowth} />

              {/* KHỐI 4: DÒNG CHẢY ĐỊNH MỆNH (TIMELINE NGẮN HẠN & KIM TỰ THÁP ĐỈNH CAO) */}
              <DiamondPyramidBlock timeline={timeline} pyramid={pyramid} />

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
                  Bản luận giải độc bản không dùng các đoạn văn mẫu cố định mà phân tích tổng hòa giữa <strong className="text-[#013E37]">toàn bộ {layer2.indicatorsGrid.length} chỉ số</strong>, yếu tố <strong className="text-[#267D71]">Giới tính ({layer3.genderAgeAnalysis.gender})</strong>, <strong className="text-[#8C6A81]">{layer3.genderAgeAnalysis.ageGroupText}</strong> và chu kỳ Năm Thế Giới {layer3.worldCycleAnalysis.worldYearNumber}.
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

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setDirectCheckoutPlan({
                        id: 'b2c_single_discovery',
                        name: 'Gói Cá Nhân Khám Phá',
                        amount: 39000,
                        features: [
                          'Mở khóa trọn vẹn 3 Tầng Luận Giải Độc Bản',
                          'Đầy đủ 21 chỉ số Pythagoras & Sơ đồ Kim Tự Tháp',
                          'Kèm 3 Trọng tâm cuộc sống ưu tiên ban đầu',
                          'Lưu trữ hồ sơ vĩnh viễn, xem lại MIỄN PHÍ TRỌN ĐỜI',
                          'Xuất bản Ebook PDF 30+ trang chuẩn in ấn cao cấp'
                        ]
                      });
                      setIsDirectCheckoutOpen(true);
                    }}
                    className="px-8 py-4 rounded-2xl btn-primary text-base font-bold shadow-lg transition-all inline-flex items-center gap-3 cursor-pointer"
                  >
                    <span>🚀 Mở Khóa Luận Giải Đa Chiều - 39.000 đ (~1.5€)</span>
                  </button>
                  <div className="text-xs text-[#5F736E] flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <span>Thanh toán 1 lần duy nhất • Mở khóa vĩnh viễn • Xuất Ebook PDF</span>
                    <span className="hidden sm:inline">•</span>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="text-[#267D71] font-bold hover:underline cursor-pointer"
                    >
                      Hoặc xem Gói Gia Đình & Chuyên Gia
                    </button>
                  </div>
                  {isLocal && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setDirectCheckoutPlan({
                            id: 'test_plan_2k',
                            name: 'Gói Test Sandbox (2.000đ)',
                            amount: 2000,
                            features: [
                              'Quét mã QR app ngân hàng thật (ACB)',
                              'Số tiền chuyển khoản siêu nhỏ: 2.000 VNĐ',
                              'Tự động kích hoạt mở khóa toàn bộ báo cáo Tầng 3',
                              'Kiểm thử Webhook SePay bắt biến động số dư thực'
                            ]
                          });
                          setIsDirectCheckoutOpen(true);
                        }}
                        className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer border border-amber-400"
                      >
                        <span>🧪 Quét QR Test Thật 2.000đ (Chỉ Hiện Trên Localhost)</span>
                      </button>
                    </div>
                  )}
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
                  Bạn có muốn dùng <strong>1 lượt</strong> để mở khóa bản Luận Giải Đa Chiều độc bản chuyên sâu (5 Chương chuẩn Life Coach ICF) cho <strong className="text-[#0D2B26]">{fullName}</strong> ({currentCustomer?.dob}) không?
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
              {/* VIP HEADER BANNER - PREMIUM EDITORIAL DESIGN */}
              <div className="bg-[#013E37] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-[#267D71]/40">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#FFEFB3]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
                      BẢN ĐỒ KHAI VẤN ĐỘC BẢN VIP
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-[#E2E8E5] text-xs font-medium border border-white/10">
                      Tiêu Chuẩn Khoa Học Thực Chứng
                    </span>
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight"
                    style={{ color: '#FFEFB3' }}
                  >
                    Luận Giải Đa Chiều Độc Bản Của {fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#E2E8E5]/90 leading-relaxed font-sans">
                    Bản tổng hòa hợp nhất 21 chỉ số Pythagoras, bối cảnh nhân khẩu học ({layer3.genderAgeAnalysis.gender}, {layer3.genderAgeAnalysis.ageGroupText}) và phân tích điểm mù hành vi giúp bạn thấu hiểu bản thân và chuyển hóa vượt bậc.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsFocusModalOpen(true)}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 flex items-center gap-2 backdrop-blur-sm cursor-pointer shadow-xs"
                    title="Thay đổi trọng tâm phân tích (Tài chính, Sự nghiệp, Mối quan hệ)"
                  >
                    <SlidersHorizontal size={15} className="text-[#FFEFB3]" />
                    <span>Trọng Tâm ({selectedFocusTopics.length}/3)</span>
                  </button>

                  <button
                    onClick={() => setIsCalendarModalOpen(true)}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 flex items-center gap-2 backdrop-blur-sm cursor-pointer shadow-xs"
                    title="Xem lịch năng lượng cá nhân hóa theo từng ngày"
                  >
                    <Calendar size={15} className="text-[#FFEFB3]" />
                    <span>Lịch Năng Lượng</span>
                  </button>

                  <a
                    href={`/report/print?id=${currentCustomer?.id || 'local_guest'}&scope=tab3&profile=${readingProfile}&name=${encodeURIComponent(fullName)}&dob=${encodeURIComponent(currentCustomer?.dob || '')}&gender=${encodeURIComponent(currentCustomer?.gender || 'male')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Printer size={16} />
                    <span>Xuất Ebook PDF</span>
                  </a>
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

              {/* BỨC TRANH TỔNG HÒA ĐỘC BẢN DO AI ENGINE SINH ĐÍCH THỰC */}
              <section id="synthesis" className="bg-[#FFFFFF] border-2 border-[#8C6A81]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#8C6A81] text-white flex items-center justify-center text-xl font-extrabold shadow-sm shrink-0">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6A81]">
                          MULTI-FACTOR SYNTHESIS ENGINE (CẤP ĐỘ 3)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF5FF] border border-[#8C6A81]/30 text-[#8C6A81] text-[10px] font-bold">
                          Độc Bản Cá Nhân Hóa 100%
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                        {aiReport?.identitySynthesis?.title || `Bức Tranh Tổng Hòa Bản Thân Của ${fullName}`}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5F736E]">
                        Phân tích sự giao thoa, tương tác và mâu thuẫn nội tâm giữa 21 chỉ số theo chuẩn Khoa Học Thực Chứng & Khai Vấn ICF.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateAIReport}
                    disabled={isLoadingAI}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8C6A81] border border-[#8C6A81]/40 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs disabled:opacity-60"
                  >
                    <span>{isLoadingAI ? '🌀 Đang Luận Giải...' : '🔄 Khởi Tạo Lại Luận Giải AI'}</span>
                  </button>
                </div>

                {/* 1. TRẠNG THÁI ĐANG XỬ LÝ (LOADING) */}
                {isLoadingAI && (
                  <div className="p-8 sm:p-12 bg-[#FAF8F5] rounded-3xl border-2 border-dashed border-[#8C6A81]/40 text-center space-y-4 animate-pulse">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#013E37] text-[#FFEFB3] flex items-center justify-center text-2xl shadow-md">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg sm:text-xl font-bold font-heading text-[#013E37]">
                        Hệ Thống Đang Đối Sánh & Tổng Hòa Ma Trận Số Học Của Bạn...
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5F736E] max-w-lg mx-auto leading-relaxed">
                        Phân tích sự tương tác giữa Đường Đời, Sứ Mệnh, Linh Hồn và Nợ Nghiệp để kiến tạo bài luận giải độc bản riêng cho {fullName}. Quá trình này mất khoảng 5–10 giây.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. TRẠNG THÁI LỖI MINH BẠCH (ERROR STATE - TUYỆT ĐỐI KHÔNG FALLBACK MẪU) */}
                {!isLoadingAI && aiError && (
                  <div className="p-6 sm:p-8 bg-amber-50 rounded-3xl border-2 border-amber-300 text-center space-y-4 shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
                      ⚠️
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-amber-900 font-heading">
                        Dịch Vụ AI Sinh Luận Giải Độc Bản Đang Cần Kiểm Tra
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-800 max-w-lg mx-auto leading-relaxed">
                        {aiError}
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateAIReport}
                      className="px-6 py-2.5 rounded-xl bg-[#013E37] hover:bg-[#0D2B26] text-[#FFEFB3] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                    >
                      <span>🔄 Thử Lại Kết Nối AI</span>
                    </button>
                  </div>
                )}

                {/* 3. TRẠNG THÁI HIỂN THỊ DỮ LIỆU ĐỘC BẢN THỰC SỰ TỪ AI */}
                {!isLoadingAI && !aiError && aiReport && (
                  <div className="space-y-8">
                    {/* KHỐI 1: HẠT NHÂN BẢN SẮC & NỘI TÂM */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#013E37] text-[#FFEFB3] rounded-lg text-xs font-bold">1</span>
                        <span>Bản Sắc Độc Bản & Động Lực Nội Tại:</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2.5">
                          <span className="px-2.5 py-1 bg-[#EEF5F3] text-[#013E37] text-xs font-bold rounded-lg inline-block">
                            Đường Đời × Sứ Mệnh
                          </span>
                          <h5 className="font-bold text-sm sm:text-base text-[#013E37] font-heading">
                            Trục Năng Lượng Cốt Lõi
                          </h5>
                          <p className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed">
                            {aiReport.identitySynthesis.coreDynamic}
                          </p>
                        </div>

                        <div className="p-5 bg-[#FAF5FF] rounded-2xl border border-[#8C6A81]/20 space-y-2.5">
                          <span className="px-2.5 py-1 bg-white text-[#8C6A81] text-xs font-bold rounded-lg inline-block border border-[#8C6A81]/30">
                            Linh Hồn × Nhân Cách
                          </span>
                          <h5 className="font-bold text-sm sm:text-base text-[#8C6A81] font-heading">
                            Bên Trong vs Biểu Đạt Bên Ngoài
                          </h5>
                          <p className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed">
                            {aiReport.identitySynthesis.innerVsOuter}
                          </p>
                        </div>

                        <div className="p-5 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] space-y-2.5">
                          <span className="px-2.5 py-1 bg-[#013E37] text-[#FFEFB3] text-xs font-bold rounded-lg inline-block">
                            Tư Duy × Ngày Sinh
                          </span>
                          <h5 className="font-bold text-sm sm:text-base text-[#013E37] font-heading">
                            Bộ Công Cụ Thực Thi
                          </h5>
                          <p className="text-xs sm:text-sm text-[#4A5D58] leading-relaxed">
                            {aiReport.identitySynthesis.executionPower}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* KHỐI 2: VÙNG TỐI & CHÌA KHÓA CHUYỂN HÓA BÀI HỌC */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-base sm:text-lg text-[#8C6A81] font-heading flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#8C6A81] text-white rounded-lg text-xs font-bold">2</span>
                        <span>Vùng Tối & Chìa Khóa Chuyển Hóa Bài Học (Shadow & Growth):</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
                          <div className="font-bold text-xs uppercase tracking-wider text-amber-900">
                            ⚠️ Mô Thức Rào Cản Lặp Lại:
                          </div>
                          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                            {aiReport.shadowAndGrowth.karmicPattern}
                          </p>
                        </div>

                        <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2">
                          <div className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                            🔑 Chìa Khóa Hóa Giải & Bứt Phá:
                          </div>
                          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                            {aiReport.shadowAndGrowth.transformationKey}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* KHỐI 3: LỘ TRÌNH HÀNH ĐỘNG CHIẾN LƯỢC */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-base sm:text-lg text-[#013E37] font-heading flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#013E37] text-[#FFEFB3] rounded-lg text-xs font-bold">3</span>
                        <span>Lộ Trình Hành Động Chiến Lược (Strategic Roadmap):</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/30 space-y-2">
                          <div className="text-[11px] font-extrabold uppercase text-[#013E37]">Năm Cá Nhân Hiện Tại:</div>
                          <p className="text-xs text-[#2D3E3A] leading-relaxed">
                            {aiReport.strategicRoadmap.personalYearFocus}
                          </p>
                        </div>

                        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2">
                          <div className="text-[11px] font-extrabold uppercase text-[#013E37]">Hành Động 6 Tháng Tới:</div>
                          <p className="text-xs text-[#2D3E3A] leading-relaxed">
                            {aiReport.strategicRoadmap.shortTerm0to6m}
                          </p>
                        </div>

                        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2">
                          <div className="text-[11px] font-extrabold uppercase text-[#013E37]">Mục Tiêu 1–3 Năm:</div>
                          <p className="text-xs text-[#2D3E3A] leading-relaxed">
                            {aiReport.strategicRoadmap.midTerm1to3y}
                          </p>
                        </div>

                        <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] space-y-2">
                          <div className="text-[11px] font-extrabold uppercase text-[#013E37]">Đỉnh Cao Dài Hạn:</div>
                          <p className="text-xs text-[#013E37] leading-relaxed">
                            {aiReport.strategicRoadmap.longTermPinnacle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* KHỐI 4: CÂU HỎI KHAI VẤN ĐỘC BẢN */}
                    {aiReport.coachingQuestions?.length > 0 && (
                      <div className="p-6 bg-[#FAF5FF] rounded-2xl border border-[#8C6A81]/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎯</span>
                          <h5 className="font-bold text-sm sm:text-base text-[#8C6A81] font-heading">
                            3 Câu Hỏi Khai Vấn Đánh Thức Tiềm Năng Dành Riêng Cho Bạn:
                          </h5>
                        </div>
                        <div className="space-y-2">
                          {aiReport.coachingQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-[#8C6A81]/20 text-xs sm:text-sm text-[#013E37] flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#8C6A81] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="italic font-medium">{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TRẠNG THÁI CHƯA GỌI AI */}
                {!isLoadingAI && !aiError && !aiReport && (
                  <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-[#E2E8E5] text-center space-y-3">
                    <div className="text-2xl">✨</div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-[#013E37]">
                        Khởi Tạo Bài Luận Giải Đa Chiều Độc Bản
                      </h4>
                      <p className="text-xs text-[#5F736E] max-w-md mx-auto">
                        Bấm nút bên dưới để hệ thống AI phân tích sự tương tác giữa 21 chỉ số của {fullName} và sinh bài phân tích độc bản theo thời gian thực.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateAIReport}
                      className="px-6 py-2.5 rounded-xl bg-[#013E37] hover:bg-[#0D2B26] text-[#FFEFB3] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      <span>Tổng Hòa Bản Sắc Bằng AI Ngay</span>
                    </button>
                  </div>
                )}
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

                  {/* KHỐI CTA MỞ RỘNG THÊM VẤN ĐỀ QUAN TÂM (+15.000Đ/CHỦ ĐỀ) */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-[#EEF5F3] to-[#FAF8F5] border-2 border-dashed border-[#267D71]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#267D71]">
                        <Sparkles size={16} />
                        <span>Bạn muốn khám phá thêm các khía cạnh khác của cuộc sống?</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-[#0D2B26] font-heading">
                        Mở Rộng Thêm Vấn Đề Quan Tâm (+15.000 đ / Chủ Đề)
                      </h4>
                      <p className="text-xs text-[#5F736E]">
                        Bổ sung thêm các chương luận giải chuyên sâu (Sức khỏe, Nhà đất, Con cái, Vận hạn, Xuất ngoại...) nối tiếp trực tiếp vào báo cáo của bạn.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTempAddonTopics([]);
                        setIsTopicExpansionModalOpen(true);
                      }}
                      className="px-6 py-3.5 rounded-2xl btn-primary text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer shrink-0 transition-all"
                    >
                      <Plus size={16} />
                      <span>➕ Mở Rộng Thêm Chủ Đề</span>
                    </button>
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

              {/* STRATEGIC CONVERSION & UPSELL CARDS (HƯỚNG TỚI HÀNH ĐỘNG & TĂNG TRƯỞNG) */}
              <section className="pt-6 border-t-2 border-[#E2E8E5] space-y-6">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#267D71]">
                    HÀNH TRÌNH CHUYỂN HÓA TIẾP THEO
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#013E37]">
                    Biến Nhận Thức Thành Kết Quả Thực Tế
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed">
                    Bản đồ số học là tấm gương soi chiếu bản thân. Để tạo ra bước nhảy vọt trong sự nghiệp và cuộc sống, hãy lựa chọn bước đi tiếp theo của bạn:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CARD 1: COACHING 1:1 VỚI MASTER COACH */}
                  <div className="bg-[#013E37] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden border border-[#267D71]/40">
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#FFEFB3]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-3 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl font-extrabold shadow-sm">
                        🤝
                      </div>
                      <span className="px-3 py-0.5 rounded-full bg-white/10 text-[#FFEFB3] text-[11px] font-bold uppercase tracking-wider inline-block">
                        Tham Vấn Chuyên Sâu 1:1
                      </span>
                      <h4 
                        className="text-xl sm:text-2xl font-bold font-heading"
                        style={{ color: '#FFEFB3' }}
                      >
                        Gỡ Bỏ Điểm Nghẽn Cùng Master Coach
                      </h4>
                      <p className="text-xs sm:text-sm text-[#E2E8E5]/90 leading-relaxed font-sans">
                        Buổi làm việc riêng tư 60–90 phút giúp bạn phân tích sâu điểm mù tâm lý, thiết lập kế hoạch chuyển hóa sự nghiệp và tài chính phù hợp với chu kỳ năm hiện tại của riêng bạn.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsLeadModalOpen(true)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10"
                    >
                      <UserCheck size={18} />
                      <span>Đặt Lịch Tham Vấn 1:1 Ngay</span>
                    </button>
                  </div>

                  {/* CARD 2: BẢN ĐỒ NGƯỜI THÂN & TƯƠNG HỢP (VIRAL LOOP / TẬN DỤNG LƯỢT) */}
                  <div className="bg-[#FFFFFF] border-2 border-[#267D71]/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEF5F3] text-[#013E37] flex items-center justify-center text-xl font-extrabold shadow-sm border border-[#267D71]/20">
                        👥
                      </div>
                      <span className="px-3 py-0.5 rounded-full bg-[#EEF5F3] text-[#013E37] text-[11px] font-bold uppercase tracking-wider inline-block border border-[#267D71]/20">
                        Bản Đồ Thấu Cảm & Tương Hợp
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold font-heading text-[#013E37]">
                        Giải Mã Bản Đồ Cho Người Thân & Đối Tác
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed font-sans">
                        Một mối quan hệ bền vững bắt đầu từ sự thấu cảm sâu sắc. Khám phá bản đồ của Vợ/Chồng, Con cái hoặc Đối tác kinh doanh để hòa hợp năng lượng và cùng nhau bứt phá.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <a
                        href="/"
                        className="w-full py-3.5 px-6 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] font-extrabold text-xs sm:text-sm border border-[#267D71]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Sparkles size={16} className="text-[#267D71]" />
                        <span>Tra Cứu Bản Đồ Cho Người Khác</span>
                      </a>
                      <p className="text-[11px] text-center text-[#93A39F]">
                        {userCredits > 0 ? `Bạn đang có ${userCredits} lượt khả dụng trong tài khoản` : 'Nhận đầy đủ 21 chỉ số và phân tích tương tác'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* LIFE FOCUS SELECTION MODAL (1-3 TOPICS) */}
      {isFocusModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D2B26]/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-6">
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D2B26]/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5F736E] hover:text-[#0D2B26] rounded-full transition-all text-xl cursor-pointer"
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

      {/* TOPIC EXPANSION MODAL (MỞ RỘNG THÊM VẤN ĐỀ QUAN TÂM +15.000Đ/CHỦ ĐỀ) */}
      {isTopicExpansionModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D2B26]/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#0D2B26]">
                    Mở Rộng Thêm Vấn Đề Quan Tâm
                  </h3>
                  <p className="text-xs text-[#5F736E]">Phí vi mô: 15.000 đ / mỗi chủ đề bổ sung</p>
                </div>
              </div>
              <button
                onClick={() => setIsTopicExpansionModalOpen(false)}
                className="p-2 text-[#5F736E] hover:text-[#0D2B26] rounded-full transition-all cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed">
              Chọn thêm các chủ đề mới để hệ thống bổ sung các chương luận giải chuyên sâu và checklist hành động nối tiếp vào hồ sơ của <strong>{fullName}</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
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
                const isAlreadyInReport = selectedFocusTopics.includes(item.id);
                const isTempSelected = tempAddonTopics.includes(item.id);

                if (isAlreadyInReport) {
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-left flex items-start gap-3 opacity-90"
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-emerald-950 font-heading">{item.title}</span>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            ✓ Đang có trong bài
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (isTempSelected) {
                        setTempAddonTopics(tempAddonTopics.filter(id => id !== item.id));
                      } else {
                        setTempAddonTopics([...tempAddonTopics, item.id]);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isTempSelected
                        ? 'bg-[#EEF5F3] border-[#267D71] shadow-sm ring-1 ring-[#267D71]'
                        : 'bg-[#FAF8F5] border-[#E2E8E5] hover:border-[#267D71]/40'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-[#0D2B26] font-heading">{item.title}</span>
                        <span className={`text-xs font-bold ${isTempSelected ? 'text-[#267D71]' : 'text-[#5F736E]'}`}>
                          {isTempSelected ? '✓ Đã chọn (+15k)' : '+ Thêm'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5F736E] mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* TOTAL CALCULATION & ACTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8E5]">
              <div>
                <div className="text-xs text-[#5F736E]">
                  Đang có: <strong className="text-[#013E37]">{selectedFocusTopics.length}</strong> • Chọn thêm:{' '}
                  <strong className="text-[#267D71] font-bold">+{tempAddonTopics.length} chủ đề</strong>
                </div>
                <div className="text-sm font-extrabold text-[#013E37]">
                  Tổng phụ phí:{' '}
                  <span className="text-base text-[#267D71]">
                    {(tempAddonTopics.length * 15000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={tempAddonTopics.length === 0}
                onClick={() => {
                  setDirectCheckoutPlan({
                    id: 'b2c_topic_addon_15k',
                    name: `Mở Rộng ${tempAddonTopics.length} Trọng Tâm Cuộc Sống`,
                    amount: tempAddonTopics.length * 15000,
                    features: [
                      `Bổ sung thêm ${tempAddonTopics.length} góc nhìn luận giải chuyên sâu`,
                      'Nối tiếp trực tiếp vào bài báo cáo hiện có',
                      'Cập nhật Ebook PDF trọn vẹn phiên bản mới nhất'
                    ]
                  });
                  setIsTopicExpansionModalOpen(false);
                  setIsDirectCheckoutOpen(true);
                }}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tempAddonTopics.length > 0
                    ? 'btn-primary'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>🚀 Mở Khóa {tempAddonTopics.length > 0 ? `(${ (tempAddonTopics.length * 15000).toLocaleString('vi-VN') } đ)` : ''}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CHECKOUT MODAL CHO GÓI 39K VÀ ADDON 15K */}
      {isDirectCheckoutOpen && (
        <CheckoutModal
          isOpen={isDirectCheckoutOpen}
          onClose={() => setIsDirectCheckoutOpen(false)}
          planId={directCheckoutPlan.id}
          planName={directCheckoutPlan.name}
          amount={directCheckoutPlan.amount}
          features={directCheckoutPlan.features}
          customerId={currentCustomer?.id}
          userId={user?.uid}
          userEmail={user?.email || ''}
          userName={user?.displayName || 'Khách hàng'}
          onSuccess={() => {
            setIsDirectCheckoutOpen(false);
            if (directCheckoutPlan.id === 'b2c_single_discovery' || directCheckoutPlan.id === 'test_plan_2k') {
              setIsPaid(true);
              setIsFocusModalOpen(true);
            } else if (directCheckoutPlan.id === 'b2c_topic_addon_15k') {
              const updatedTopics = Array.from(new Set([...selectedFocusTopics, ...tempAddonTopics]));
              setSelectedFocusTopics(updatedTopics);
              if (currentCustomer) {
                currentCustomer.life_focus = updatedTopics;
                localStorage.setItem('lifemaps_current_report', JSON.stringify(currentCustomer));
              }
            }
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}

export default ReportDashboard;
