'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { generate3LayerNumerologyData } from '@/lib/numerologyReportGenerator';
import PricingSection from './PricingSection';
import { LeadRequestModal } from './LeadRequestModal';
import { 
  Sparkles, Printer, UserCheck, Lock, Unlock, Headphones, 
  Compass, ShieldAlert, Award, ArrowRight, Check, AlertCircle, 
  FileText, UserPlus, HelpCircle 
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
  const [activeTab, setActiveTab] = useState<'map' | 'layer2' | 'layer3' | 'support_chat' | 'pricing'>('map');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const fullName = `${currentCustomer?.last_name || ''} ${currentCustomer?.first_name || ''}`.trim() || 'Người Dùng';
  const isPaid = currentCustomer?.tier === 'paid' || currentCustomer?.tier === 'coach' || currentCustomer?.is_paid;

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'support' | 'user'; text: string; showCoachButton?: boolean }>>([
    {
      sender: 'support',
      text: `Xin chào ${currentCustomer?.first_name || 'bạn'}! Tôi là Trợ Lý Hỗ Trợ Life Maps. Tôi có thể hỗ trợ bạn:\n\n1. 📖 Tra cứu định nghĩa & ý nghĩa cơ bản của các con số (Đường Đời, Sứ Mệnh, Linh Hồn...)\n2. 💳 Hướng dẫn thanh toán VietQR & mở khóa gói dịch vụ\n3. 📄 Hướng dẫn xem, in và xuất file báo cáo PDF\n4. 🤝 Hướng dẫn kết nối trực tiếp với Chuyên Gia Life Coach 1-1\n\nBạn cần hỗ trợ điều gì hôm nay?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSupportTyping, setIsSupportTyping] = useState(false);

  const { layer1, layer2, layer3 } = generate3LayerNumerologyData(currentCustomer);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSupportTyping) return;

    const userText = inputMessage.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsSupportTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let replyText = '';
      let showCoachBtn = false;

      if (lower.includes('thanh toán') || lower.includes('mua gói') || lower.includes('nạp') || lower.includes('giá') || lower.includes('vietqr')) {
        replyText = `💳 Hướng dẫn thanh toán & Kích hoạt gói:\n\n1. Bạn vui lòng chuyển sang tab "Gói Nâng Cấp" hoặc truy cập trang /pricing.\n2. Chọn gói phù hợp (Gói Cá Nhân 200k, Gói Gia Đình 890k, hoặc các gói Coach).\n3. Quét mã VietQR trên màn hình. Hệ thống sẽ tự động đối soát và mở khóa trọn vẹn quyền lợi chỉ sau 3-5 giây.`;
      } else if (lower.includes('in') || lower.includes('pdf') || lower.includes('tải')) {
        replyText = `📄 Hướng dẫn in & tải file báo cáo:\n\nBạn có thể bấm vào nút "In Bản Đồ / Xuất PDF" ở góc phải trang hồ sơ để mở giao diện chuẩn A4. Sau đó chọn "In" hoặc "Lưu dưới dạng PDF" trên trình duyệt.`;
      } else if (lower.includes('đường đời') || lower.includes('life path')) {
        replyText = `📖 Định nghĩa Chỉ Số Đường Đời (Tầng 1):\n\nChỉ số Đường Đời (${currentCustomer?.map?.life_path || 'chủ đạo'}) đại diện cho con đường vận mệnh, bài học phát triển cốt lõi và mục tiêu tối thượng mà bạn trải nghiệm trong kiếp sống này. Đây là con số nền tảng dẫn dắt toàn bộ năng lượng của bạn.`;
        showCoachBtn = true;
      } else if (lower.includes('sứ mệnh') || lower.includes('expression')) {
        replyText = `📖 Định nghĩa Chỉ Số Sứ Mệnh (Tầng 1):\n\nChỉ số Sứ Mệnh (${currentCustomer?.map?.expression || 'chủ đạo'}) đại diện cho công cụ, thế mạnh bẩm sinh và cách thức bạn hành động để hoàn thành con đường vận mệnh của mình.`;
        showCoachBtn = true;
      } else if (lower.includes('linh hồn') || lower.includes('heart')) {
        replyText = `📖 Định nghĩa Chỉ Số Linh Hồn (Tầng 1):\n\nChỉ số Linh Hồn (${currentCustomer?.map?.heart_desire || 'chủ đạo'}) phản ánh khát khao thầm kín, giá trị tinh thần bên trong và điều thực sự mang lại cho bạn cảm giác bình an và hạnh phúc.`;
        showCoachBtn = true;
      } else {
        // Tư vấn chuyên sâu / gỡ rối / câu hỏi mở
        replyText = `📖 Về mặt nguyên lý số học nền tảng:\nBản đồ của bạn sở hữu bộ ba cốt lõi Đường Đời ${currentCustomer?.map?.life_path || '-'}, Sứ Mệnh ${currentCustomer?.map?.expression || '-'}, Linh Hồn ${currentCustomer?.map?.heart_desire || '-'}.\n\n💡 Để được phân tích chuyên sâu đa chiều, thấu hiểu điểm nghẽn cá nhân và xây dựng lộ trình chuyển hóa thực tế cho riêng bạn, bạn nên trao đổi trực tiếp 1-1 cùng Chuyên Gia Life Coach.`;
        showCoachBtn = true;
      }

      setChatMessages(prev => [...prev, { sender: 'support', text: replyText, showCoachButton: showCoachBtn }]);
      setIsSupportTyping(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-[#2D3E3A]">
      {/* 1. DEDUPLICATION BANNER */}
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
              <span className="text-2xl">✨</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#267D71]">
                Bản Đồ Vận Mệnh Pythagoras
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPaid ? 'badge-butter' : user ? 'badge-emerald' : 'bg-[#EEF5F3] text-[#5F736E] border border-[#E2E8E5]'
              }`}>
                {isPaid ? 'VIP B2C Unlocked' : user ? 'Free Member' : 'Khách Vãng Lai (Guest)'}
              </span>
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
            <a
              href={`/report/print?id=${currentCustomer?.id || 'demo'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl btn-primary text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
            >
              <Printer size={16} />
              <span>In Bản Đồ / Xuất PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8E5]">
        <div className="bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E2E8E5] flex items-center gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'map' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Compass size={14} />
            <span>Tầng 1: Chỉ Số Cốt Lõi</span>
          </button>
          <button
            onClick={() => setActiveTab('layer2')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'layer2' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <span>Tầng 2: Chi Tiết Con Số</span>
            {user ? <Unlock size={14} className="text-emerald-500" /> : <Lock size={14} className="text-amber-500" />}
          </button>
          <button
            onClick={() => setActiveTab('layer3')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'layer3' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <span>Tầng 3: Luận Giải Đa Chiều</span>
            {isPaid ? <Unlock size={14} className="text-emerald-500" /> : <Lock size={14} className="text-amber-500" />}
          </button>
          <button
            onClick={() => setActiveTab('support_chat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'support_chat' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Headphones size={14} />
            <span>Hỗ Trợ & CSKH</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing' ? 'bg-[#013E37] text-white shadow-md' : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Sparkles size={14} className="text-[#267D71]" />
            <span>Gói Nâng Cấp</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TẦNG 1 - 3 CHỈ SỐ CỐT LÕI */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="max-w-3xl mb-6">
              <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
                Tầng 1: Định Nghĩa Nền Tảng
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
                Bộ 3 Con Số Dẫn Đường Cho Cuộc Đời Bạn
              </h2>
              <p className="text-xs sm:text-sm text-[#5F736E] mt-1 leading-relaxed">
                Mỗi chỉ số trong bản đồ Thần số học Pythagoras nắm giữ một vai trò đại diện thiêng liêng. Dưới đây là 3 con số nền tảng dẫn dắt toàn bộ cuộc đời bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Life Path */}
              <div className="card-surface rounded-3xl p-6 border-2 border-[#267D71]/20 hover:border-[#267D71] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#267D71]">Đường Đời (Life Path)</span>
                    <span className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-extrabold text-lg border border-[#F9E79F]">
                      {currentCustomer?.map?.life_path}
                    </span>
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
                    <span className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center font-extrabold text-lg border border-[#267D71]/20">
                      {currentCustomer?.map?.expression}
                    </span>
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
                    <span className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center font-extrabold text-lg border border-[#8C6A81]/30">
                      {currentCustomer?.map?.heart_desire}
                    </span>
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

            {/* Transition CTA to Layer 2 */}
            <div className="mt-8 p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl">
                  🔓
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0D2B26] font-heading">
                    Khám Phá Chi Tiết Điểm Mạnh, Điểm Yếu & Lời Khuyên Cụ Thể
                  </div>
                  <div className="text-xs text-[#5F736E]">
                    Chuyển sang Tầng 2 để xem phân tích cụ thể các con số của bạn.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('layer2')}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs whitespace-nowrap shadow-sm font-bold"
              >
                Xem Tầng 2 ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TẦNG 2 - PHÂN TÍCH CHI TIẾT CON SỐ */}
      {activeTab === 'layer2' && (
        <div className="space-y-6">
          {!user ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-8 sm:p-12 text-center shadow-md">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto text-2xl">
                  🔒
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
                  Đăng Nhập Miễn Phí Để Mở Khóa Tầng 2
                </h2>
                <p className="text-xs sm:text-sm text-[#5F736E] leading-relaxed">
                  Đăng nhập bằng tài khoản Google để xem toàn bộ phân tích chuyên sâu về ưu điểm, bài học phát triển và cơ hội nghề nghiệp của từng chỉ số.
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
              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-1">
                      Tầng 2: Luận Giải Chi Tiết
                    </span>
                    <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
                      Bản Sắc & Năng Lực Con Số Của Bạn
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Detailed Life Path */}
                  <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2E8E5]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-xl bg-[#013E37] text-white flex items-center justify-center text-sm font-bold font-heading">
                        {currentCustomer?.map?.life_path}
                      </span>
                      <h3 className="text-lg font-bold font-heading text-[#0D2B26]">
                        {layer2.lifePathAnalysis.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#2D3E3A] leading-relaxed mb-4">
                      {layer2.lifePathAnalysis.content}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-[#E2E8E5]">
                        <div className="text-xs font-bold text-[#267D71] uppercase mb-2">Thế Mạnh Nổi Bật</div>
                        <ul className="space-y-1 text-xs text-[#5F736E]">
                          {layer2.lifePathAnalysis.strengths.map((s: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check size={14} className="text-[#267D71]" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-[#E2E8E5]">
                        <div className="text-xs font-bold text-amber-700 uppercase mb-2">Bài Học Cần Rèn Luyện</div>
                        <ul className="space-y-1 text-xs text-[#5F736E]">
                          {layer2.lifePathAnalysis.weaknesses.map((w: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <AlertCircle size={14} className="text-amber-600" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Expression & Soul Urge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2E8E5]">
                      <div className="text-xs font-bold uppercase text-[#267D71] mb-1">
                        Sứ Mệnh Số {currentCustomer?.map?.expression}
                      </div>
                      <h4 className="font-bold text-[#0D2B26] font-heading text-base mb-2">
                        {layer2.expressionAnalysis.title}
                      </h4>
                      <p className="text-xs text-[#5F736E] leading-relaxed">
                        {layer2.expressionAnalysis.content}
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E2E8E5]">
                      <div className="text-xs font-bold uppercase text-[#8C6A81] mb-1">
                        Linh Hồn Số {currentCustomer?.map?.heart_desire}
                      </div>
                      <h4 className="font-bold text-[#0D2B26] font-heading text-base mb-2">
                        {layer2.heartDesireAnalysis.title}
                      </h4>
                      <p className="text-xs text-[#5F736E] leading-relaxed">
                        {layer2.heartDesireAnalysis.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transition to Layer 3 */}
              <div className="bg-[#FFEFB3] border border-[#F9E79F] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-sm font-bold text-[#013E37] font-heading">
                    Muốn biết các con số trên tương tác với nhau như thế nào?
                  </div>
                  <div className="text-xs text-[#5F736E] mt-0.5">
                    Mở khóa Tầng 3 để hệ thống phân tích ma trận chéo, nợ nghiệp và lộ trình hành động độc bản của bạn!
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('layer3')}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs whitespace-nowrap shadow-sm font-bold"
                >
                  Khám Phá Tầng 3 ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TẦNG 3 - LUẬN GIẢI ĐA CHIỀU (DÀNH CHO PAID USER) */}
      {activeTab === 'layer3' && (
        <div className="space-y-6">
          {!isPaid ? (
            <div className="relative rounded-3xl overflow-hidden border border-[#E2E8E5] bg-[#FFFFFF] p-8 sm:p-12 text-center shadow-md">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex p-3.5 rounded-2xl bg-[#FFEFB3] text-[#013E37] text-3xl shadow-sm">
                  ✨
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-heading text-[#0D2B26]">
                  Tầng 3: Luận Giải Đa Chiều Độc Bản
                </h2>
                <p className="text-[#5F736E] text-sm sm:text-base leading-relaxed">
                  Tầng 3 không dùng các đoạn văn mẫu cố định mà kết nối chéo giữa <strong className="text-[#013E37]">Đường đời {currentCustomer?.map?.life_path}</strong>, <strong className="text-[#267D71]">Sứ mệnh {currentCustomer?.map?.expression}</strong>, và <strong className="text-[#8C6A81]">Linh hồn {currentCustomer?.map?.heart_desire}</strong> để giải mã điểm nghẽn, nợ nghiệp và chiến lược thành công độc nhất cho bạn.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#267D71] text-xl mb-1.5">🧩</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Ma Trận Tương Tác</div>
                    <div className="text-xs text-[#5F736E] mt-1">Phân tích sự phối hợp giữa khao khát bên trong và năng lực bên ngoài.</div>
                  </div>
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#8C6A81] text-xl mb-1.5">⚖️</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Nợ Nghiệp & Thử Thách</div>
                    <div className="text-xs text-[#5F736E] mt-1">Chỉ rõ bài học quá khứ cần hoàn thành để bứt phá tài chính và công danh.</div>
                  </div>
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
                    <div className="text-[#013E37] text-xl mb-1.5">🗺️</div>
                    <div className="font-bold text-xs text-[#0D2B26] font-heading">Lộ Trình Hành Động</div>
                    <div className="text-xs text-[#5F736E] mt-1">Kế hoạch 3 bước cụ thể và dự báo chiến lược cho từng tháng.</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="px-8 py-4 rounded-2xl btn-primary text-base font-bold shadow-lg transition-all inline-flex items-center gap-3"
                  >
                    <span>🚀 Mở Khóa Tầng 3 Ngay - 200.000 đ</span>
                  </button>
                  <div className="text-xs text-[#93A39F] mt-2.5">
                    Thanh toán 1 lần duy nhất • Mở khóa vĩnh viễn • Xuất Ebook PDF 30+ trang
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#EEF5F3] border border-[#267D71]/30 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[#267D71] text-xs font-bold uppercase tracking-wider font-heading">TẦNG 3: LUẬN GIẢI ĐA CHIỀU CHUYÊN SÂU (VIP UNLOCKED)</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26] mt-1">Bản Báo Cáo Chuyên Sâu Của {fullName}</h2>
                </div>
                <a
                  href={`/report/print?id=${currentCustomer?.id || 'demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
                >
                  <Printer size={14} />
                  <span>Xem Bản In Chuẩn A4</span>
                </a>
              </div>

              {/* 3 Blocks of Layer 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center text-xl mb-4 border border-[#267D71]/20">
                    🧩
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">1. Ma Trận Năng Lượng Đa Chiều</h3>
                  <p className="text-xs sm:text-sm text-[#2D3E3A] whitespace-pre-line leading-relaxed">
                    {layer3.crossSynthesis}
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center text-xl mb-4 border border-[#8C6A81]/30">
                    ⚖️
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">2. Nợ Nghiệp & Điểm Nghẽn Tiến Hóa</h3>
                  <div className="space-y-3 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                    <p>{layer3.challenges.obstacles}</p>
                    <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] text-[#8C6A81] font-medium">
                      {layer3.challenges.karmicLessons}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl mb-4 border border-[#F9E79F]">
                  🗺️
                </div>
                <h3 className="text-lg font-bold font-heading text-[#0D2B26] mb-3">3. Lộ Trình Hành Động Chuyển Hóa</h3>
                <div className="space-y-4 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
                    <strong className="text-[#013E37]">Kế hoạch hành động 3 bước:</strong>
                    <p className="whitespace-pre-line mt-1">{layer3.actionRoadmap.actionPlan}</p>
                  </div>
                  <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20">
                    <strong className="text-[#0D2B26]">Định hướng nghề nghiệp đỉnh cao:</strong> {layer3.actionRoadmap.careerGuide}
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

      {/* TAB 4: HỖ TRỢ & CSKH (TUÂN THỦ HIẾN PHÁP DỰ ÁN) */}
      {activeTab === 'support_chat' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-md flex flex-col h-[580px]">
          <div className="border-b border-[#E2E8E5] pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#013E37] flex items-center justify-center text-xl shadow-sm border border-[#267D71]/20">
                <Headphones size={20} className="text-[#267D71]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0D2B26] font-heading text-base">Bộ Phận Hỗ Trợ Khách Hàng Life Maps</h3>
                <p className="text-xs text-[#5F736E]">Hỗ trợ kỹ thuật, hướng dẫn thao tác & kết nối chuyên gia</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#EEF5F3] text-[#267D71] text-xs rounded-full border border-[#267D71]/30 font-bold">
              ● Trực Tuyến 24/7
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#013E37] text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-[#FAF8F5] text-[#2D3E3A] border border-[#E2E8E5] rounded-bl-none shadow-sm whitespace-pre-line'
                  }`}
                >
                  <div>{msg.text}</div>
                  
                  {/* Chuyển giao Chuyên gia Life Coach */}
                  {msg.showCoachButton && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8E5]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-xs text-[#5F736E] italic">Cần khai vấn 1-1 chuyên sâu?</span>
                      <button
                        type="button"
                        onClick={() => setIsLeadModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <UserPlus size={13} />
                        <span>Đặt Lịch Cùng Chuyên Gia 1-1</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSupportTyping && (
              <div className="flex justify-start">
                <div className="bg-[#FAF8F5] p-3 rounded-2xl text-xs text-[#5F736E] italic flex items-center gap-2 border border-[#E2E8E5]">
                  <span className="animate-spin">🌀</span> Đang tra cứu cơ sở dữ liệu hướng dẫn...
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 pt-3 border-t border-[#E2E8E5]">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Hỏi về cách thanh toán, xuất file PDF, hoặc định nghĩa các con số..."
              className="flex-1 bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
            />
            <button
              type="submit"
              disabled={isSupportTyping || !inputMessage.trim()}
              className="px-6 py-3 btn-primary disabled:opacity-50 text-sm rounded-2xl transition-all shadow-sm font-bold"
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: PRICING SECTION */}
      {activeTab === 'pricing' && (
        <PricingSection
          customerId={currentCustomer?.id}
          onPaymentSuccess={() => {
            if (onRefresh) onRefresh();
            setActiveTab('layer3');
          }}
        />
      )}

      {/* LEAD REQUEST MODAL */}
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
