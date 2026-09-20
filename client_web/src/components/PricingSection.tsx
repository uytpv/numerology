'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { CheckoutModal } from './CheckoutModal';
import { Check, ShieldCheck, Zap, Sparkles, Award, Star, Users, Briefcase, Crown, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { PricingPlan, getPricingPlans, DEFAULT_PRICING_PLANS, TEST_PLAN_2K } from '@/lib/pricingEngine';

export default function PricingSection({ customerId, onPaymentSuccess }: { customerId?: string; onPaymentSuccess?: () => void }) {
  const { user, loginWithGoogle } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING_PLANS);
  const [selectedCategory, setSelectedCategory] = useState<'b2c' | 'coach'>('b2c');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const local = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocal(local);
    }
  }, []);

  // Tải bảng giá động từ Firestore
  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const fetched = await getPricingPlans();
        const activeOnly = fetched.filter(p => p.isActive !== false);
        setPlans(activeOnly.length > 0 ? activeOnly : DEFAULT_PRICING_PLANS);
      } catch (err) {
        console.warn('Lỗi tải bảng giá động, dùng mặc định:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  // Lọc gói cho từng phân khúc
  const b2cPlans = plans.filter(p => (p.type === 'b2c_single' || p.type === 'family') && p.id !== 'test_plan_2k' && p.id !== 'b2c_topic_addon_15k');
  const coachMainPlans = plans.filter(p => 
    (p.type === 'coach_wholesale' || p.type === 'coach_subscription') && 
    p.id !== 'coach_wholesale_500'
  );
  const academyPlan = plans.find(p => p.id === 'coach_wholesale_500') || DEFAULT_PRICING_PLANS.find(p => p.id === 'coach_wholesale_500');

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      await loginWithGoogle();
      return;
    }
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  const handleModalSuccess = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <section id="pricing" className="py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* BANNER TEST SANDBOX CHO LOCALHOST */}
        {isLocal && (
          <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl shrink-0 font-bold">
                🧪
              </div>
              <div>
                <div className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>Môi Trường Thử Nghiệm Thanh Toán Localhost</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
                    Sandbox ACB
                  </span>
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  Quét mã VietQR chuyển khoản thật <strong>2.000 VNĐ</strong> để kiểm tra luồng SePay Webhook và tự động kích hoạt Tầng 3.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSelectPlan(TEST_PLAN_2K)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Quét QR Test 2.000đ</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* 2 MAIN SEGMENT SWITCHER TABS */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#EEF5F3] border border-[#E2E8E5] shadow-inner gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('b2c')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'b2c'
                  ? 'bg-[#013E37] text-white shadow-md'
                  : 'text-[#5F736E] hover:text-[#013E37]'
              }`}
            >
              <Users size={16} />
              <span>Cá Nhân & Gia Đình</span>
            </button>
            <button
              onClick={() => setSelectedCategory('coach')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'coach'
                  ? 'bg-[#013E37] text-white shadow-md'
                  : 'text-[#5F736E] hover:text-[#013E37]'
              }`}
            >
              <Briefcase size={16} />
              <span>Chuyên Gia & Học Viện</span>
            </button>
          </div>
          <p className="text-xs text-[#5F736E] mt-3">
            {selectedCategory === 'b2c' 
              ? 'Thấu hiểu bản thân trọn đời hoặc mở khóa bản đồ cho các thành viên trong gia đình'
              : 'Nạp sỉ lượt bài giá gốc, mở khóa CRM khách hàng và gắn thương hiệu chuyên gia White-Label'
            }
          </p>
        </div>

        {/* ======================================================================= */}
        {/* PHÂN KHÚC 1: B2C (CÁ NHÂN & GIA ĐÌNH) - 2 CARDS BALANCED LAYOUT        */}
        {/* ======================================================================= */}
        {selectedCategory === 'b2c' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {b2cPlans.map((plan) => {
              const isFamily = plan.type === 'family';
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                    isFamily
                      ? 'bg-white border-2 border-[#267D71] shadow-xl shadow-[#013E37]/10'
                      : 'bg-white border border-[#E2E8E5] hover:border-[#267D71]/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className={`absolute -top-3.5 left-8 text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap ${
                      isFamily 
                        ? 'bg-[#013E37] text-[#FFEFB3] border border-[#013E37]' 
                        : 'bg-[#FFEFB3] text-[#013E37] border border-[#F9E79F]'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {/* Audience Tag */}
                    <div className="text-[#5F736E] text-xs font-semibold uppercase tracking-wider mb-2 min-h-[20px] flex items-center">
                      {plan.targetAudience}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#0D2B26] font-heading mb-4">
                      {plan.name}
                    </h3>

                    {/* Price Block */}
                    <div className="my-4 pb-4 border-b border-[#E2E8E5]">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-3xl sm:text-4xl font-black text-[#013E37] tracking-tight font-sans whitespace-nowrap">
                          {plan.price.toLocaleString('vi-VN')}
                          <span className="text-xl sm:text-2xl font-bold ml-1">đ</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {plan.periodLabel && (
                          <span className="text-xs font-bold text-[#267D71] bg-[#EEF5F3] px-2.5 py-0.5 rounded-md">
                            {plan.periodLabel}
                          </span>
                        )}
                        {plan.originalPrice && (
                          <span className="text-xs text-[#93A39F] line-through">
                            Giá gốc: {plan.originalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                          <div className="w-5 h-5 rounded-full bg-[#EEF5F3] flex items-center justify-center text-[#267D71] shrink-0 mt-0.5 border border-[#267D71]/20">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        isFamily ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      {user ? (
                        <>
                          <span>🚀 Mở Khóa Ngay ({plan.price.toLocaleString('vi-VN')}đ)</span>
                          <ArrowRight size={16} />
                        </>
                      ) : (
                        <span>🔑 Đăng Nhập Để Mua</span>
                      )}
                    </button>
                    <div className="text-[11px] text-center text-[#5F736E] mt-2.5 flex items-center justify-center gap-2">
                      <span>✓ Thanh toán 1 lần</span>
                      <span>•</span>
                      <span>✓ Mở khóa vĩnh viễn</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================================= */}
        {/* PHÂN KHÚC 2: CHUYÊN GIA & LIFE COACH (3 CARDS + 1 ENTERPRISE BANNER)  */}
        {/* ======================================================================= */}
        {selectedCategory === 'coach' && (
          <div className="space-y-8">
            {/* 3 Core Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
              {coachMainPlans.map((plan) => {
                const isPopular = plan.isPopular;
                const isAnnual = plan.type === 'coach_subscription';

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                      isPopular
                        ? 'bg-white border-2 border-[#267D71] shadow-2xl shadow-[#013E37]/15 md:-translate-y-2 z-10'
                        : 'bg-white border border-[#E2E8E5] hover:border-[#267D71]/40 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-extrabold uppercase px-4 py-1 rounded-full shadow-sm whitespace-nowrap ${
                        isPopular
                          ? 'bg-[#013E37] text-[#FFEFB3] border border-[#013E37]'
                          : isAnnual
                            ? 'bg-[#FFEFB3] text-[#013E37] border border-[#F9E79F]'
                            : 'bg-[#EEF5F3] text-[#267D71] border border-[#267D71]/30'
                      }`}>
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      {/* Target Audience */}
                      <div className="text-[#5F736E] text-xs font-semibold mb-2 min-h-[36px] flex items-center leading-snug">
                        {plan.targetAudience}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0D2B26] font-heading mb-3 min-h-[32px] flex items-center">
                        {plan.name}
                      </h3>

                      {/* Price Block */}
                      <div className="my-4 pb-4 border-b border-[#E2E8E5]">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-3xl sm:text-4xl font-black text-[#013E37] tracking-tight font-sans whitespace-nowrap">
                            {plan.price.toLocaleString('vi-VN')}
                            <span className="text-xl sm:text-2xl font-bold ml-1">đ</span>
                          </span>
                        </div>

                        <div className="mt-1.5 space-y-1">
                          {plan.periodLabel && (
                            <div className="text-xs font-bold text-[#267D71] bg-[#EEF5F3] inline-block px-2.5 py-0.5 rounded-md">
                              {plan.periodLabel}
                            </div>
                          )}
                          {plan.originalPrice && (
                            <div className="text-xs text-[#93A39F] line-through">
                              Giá gốc: {plan.originalPrice.toLocaleString('vi-VN')} đ
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
                            <div className="w-5 h-5 rounded-full bg-[#EEF5F3] flex items-center justify-center text-[#267D71] shrink-0 mt-0.5 border border-[#267D71]/20">
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          isPopular ? 'btn-primary' : 'btn-secondary'
                        }`}
                      >
                        {user ? (
                          <>
                            <span>Nâng Cấp Gói ({plan.price.toLocaleString('vi-VN')}đ)</span>
                            <ArrowRight size={14} />
                          </>
                        ) : (
                          <span>🔑 Đăng Nhập Để Nạp</span>
                        )}
                      </button>
                      <div className="text-[11px] text-center text-[#5F736E] mt-2 flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={12} className="text-[#267D71]" />
                        <span>Kích hoạt tự động qua ACB VietQR</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enterprise / Academy 500-pack Full-Width Banner */}
            {academyPlan && (
              <div className="max-w-6xl mx-auto rounded-3xl p-7 sm:p-9 bg-gradient-to-r from-[#013E37] via-[#044D44] to-[#0D2B26] text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-[#267D71]/30">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-extrabold uppercase tracking-wider">
                    <Building2 size={14} />
                    <span>Dành Cho Học Viện & Đội Nhóm Tư Vấn Lớn</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#FFEFB3]">
                    {academyPlan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E2E8E5] leading-relaxed">
                    Giải pháp tối ưu nhất cho học viện đào tạo thần số học & đội nhóm tư vấn. Sở hữu <strong>500 lượt báo cáo Tầng 3</strong> với mức giá vốn thấp nhất hệ thống: <strong>15.000 đ / bài</strong>. Hỗ trợ phân quyền trợ lý và cấu hình mẫu báo cáo riêng theo nhận diện thương hiệu.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#FFEFB3]">
                    <span className="flex items-center gap-1.5">✓ Phân quyền tài khoản Cộng tác viên</span>
                    <span className="flex items-center gap-1.5">✓ Template PDF độc quyền</span>
                    <span className="flex items-center gap-1.5">✓ Bảo trợ kỹ thuật 24/7</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/15">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-[#A3C7C2]">Giá vốn chỉ 15k / bài</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#FFEFB3] tracking-tight font-sans whitespace-nowrap">
                      {academyPlan.price.toLocaleString('vi-VN')} đ
                    </div>
                    {academyPlan.originalPrice && (
                      <div className="text-xs text-[#A3C7C2] line-through">
                        Giá gốc: {academyPlan.originalPrice.toLocaleString('vi-VN')} đ
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelectPlan(academyPlan)}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🚀 Nạp Gói Học Viện</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Guarantee Note */}
        <div className="mt-14 text-center border-t border-[#E2E8E5] pt-8 max-w-2xl mx-auto text-xs text-[#5F736E] flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#267D71]" />
            <span>Thanh toán tự động qua VietQR ACB & SePay</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#267D71]" />
            <span>Kích hoạt tài khoản và mở khóa bài tức thì</span>
          </div>
        </div>
      </div>

      {/* MODAL THANH TOÁN VIETQR */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          features={selectedPlan.features}
          customerId={customerId}
          userId={user?.uid}
          userEmail={user?.email || ''}
          userName={user?.displayName || 'Khách hàng'}
          onSuccess={handleModalSuccess}
        />
      )}
    </section>
  );
}
