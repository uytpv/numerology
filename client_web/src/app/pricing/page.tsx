'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import PricingSection from '@/components/PricingSection';
import { Sparkles, Briefcase, Home, ShieldCheck, Zap, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function PricingPage() {
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans relative overflow-x-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#FFEFB3]/35 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/3" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#EEF5F3]/70 rounded-full blur-3xl pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav className="border-b border-[#E2E8E5] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-2xl font-bold font-heading text-[#013E37] tracking-tight flex items-center gap-2">
              <span>🔮</span>
              <span>Life Maps</span>
            </a>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-butter">
              VIP EDITIONS
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Home size={15} className="text-[#267D71]" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </a>

            <a
              href="/pricing"
              className="px-3.5 py-2 rounded-2xl bg-[#013E37] text-white border border-[#013E37] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles size={15} className="text-[#FFEFB3]" />
              <span>Bảng Giá</span>
            </a>

            <a
              href="/coach"
              className="px-3.5 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] border border-[#267D71]/30 text-[#013E37] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Briefcase size={15} className="text-[#267D71]" />
              <span className="hidden sm:inline">Cổng Life Coach</span>
            </a>

            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#E2E8E5] animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E8E5] rounded-2xl shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xs font-bold border border-[#F9E79F]">
                      {user.displayName?.[0] || 'U'}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#0D2B26] hidden md:inline">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2E8E5] text-[#5F736E] text-xs font-medium border border-[#E2E8E5] transition-all"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 rounded-2xl btn-primary text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION FOR PRICING */}
      <section className="pt-12 pb-4 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEFB3] border border-[#F9E79F] text-[#013E37] text-xs font-bold shadow-sm">
            <Sparkles size={14} className="text-[#013E37]" />
            <span>Mở Khóa Toàn Diện Năng Lượng Pythagoras</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#0D2B26] tracking-tight">
            Bảng Giá Dịch Vụ Luận Giải & Khai Vấn
          </h1>

          <p className="text-[#5F736E] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Chọn gói báo cáo cá nhân chuyên sâu hoặc đăng ký giải pháp White-Label chuyên nghiệp dành riêng cho Life Coach.
          </p>
        </div>
      </section>

      {/* PRICING SECTION COMPONENT */}
      <PricingSection />

      {/* FAQ & COMMITMENT SECTION */}
      <section className="py-16 px-4 bg-[#FFFFFF] border-t border-[#E2E8E5]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block">
              Giải Đáp Thắc Mắc
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26]">
              Câu Hỏi Thường Gặp (FAQ)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="card-surface p-6 rounded-3xl space-y-2">
              <h3 className="font-bold text-[#0D2B26] text-sm font-heading flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#267D71]" />
                <span>Báo cáo có được lưu vĩnh viễn không?</span>
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">
                Có. Toàn bộ bản đồ số học và nội dung luận giải sau khi thanh toán được lưu trữ vĩnh viễn trong tài khoản của bạn, bạn có thể tra cứu và xuất PDF bất cứ lúc nào.
              </p>
            </div>

            <div className="card-surface p-6 rounded-3xl space-y-2">
              <h3 className="font-bold text-[#0D2B26] text-sm font-heading flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#267D71]" />
                <span>Thanh toán VietQR có tự động kích hoạt không?</span>
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">
                Hệ thống tích hợp cổng PayOS Napas247 tự động nhận diện giao dịch và mở khóa tài khoản ngay lập tức chỉ sau 3-5 giây kể từ khi chuyển khoản thành công.
              </p>
            </div>

            <div className="card-surface p-6 rounded-3xl space-y-2">
              <h3 className="font-bold text-[#0D2B26] text-sm font-heading flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#267D71]" />
                <span>Gói Life Coach B2B hoạt động như thế nào?</span>
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">
                Chuyên gia có thể nạp gói sỉ với chi phí ưu đãi chỉ từ 29k-49k/bài, gắn thương hiệu & logo riêng lên file PDF 30+ trang và quản lý CRM khách hàng bảo mật.
              </p>
            </div>

            <div className="card-surface p-6 rounded-3xl space-y-2">
              <h3 className="font-bold text-[#0D2B26] text-sm font-heading flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#267D71]" />
                <span>Tôi có được hỗ trợ kỹ thuật và kết nối chuyên gia không?</span>
              </h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">
                Hệ thống có kênh hỗ trợ trực tuyến 24/7 giải đáp kỹ thuật, đồng thời tích hợp cổng kết nối trực tiếp với Chuyên Gia Life Coach để đồng hành khai vấn 1-1 chuyên sâu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E8E5] py-12 px-4 bg-[#FFFFFF] text-center text-xs text-[#5F736E]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-base font-bold font-heading text-[#013E37]">🔮 Life Maps</div>
          <p className="max-w-md mx-auto leading-relaxed">
            Hệ thống giải mã bản đồ số học & tiềm năng con người theo trường phái Pythagoras. Giúp bạn thấu hiểu bản thân, dẫn lối thành công và kiến tạo cuộc đời hạnh phúc.
          </p>
          <div className="text-[#93A39F]">
            © {new Date().getFullYear()} Life Maps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
