'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { CheckoutModal } from './CheckoutModal';
import { Check, ShieldCheck, Zap, Sparkles, Award } from 'lucide-react';

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  period?: string;
  targetAudience: string;
  features: string[];
  isPopular?: boolean;
  type: 'b2c' | 'family' | 'coach_batch' | 'coach_sub';
  credits?: number;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'b2c_single_200k',
    name: 'Gói Cá Nhân Chuyên Sâu',
    badge: 'B2C Bán Chạy',
    price: 200000,
    originalPrice: 499000,
    period: 'bài báo cáo độc bản',
    targetAudience: 'Dành cho cá nhân muốn thấu hiểu tường tận bản thân',
    features: [
      'Mở khóa trọn vẹn Tầng 3 Luận Giải Đa Chiều Chuyên Sâu',
      'Đầy đủ 17 chỉ số Pythagoras chuyên sâu',
      'Phân tích Ma trận Nợ nghiệp & Điểm nghẽn cuộc đời',
      'Lộ trình hành động chuyển hóa & Định hướng sự nghiệp',
      'Dự báo vận hạn 12 tháng & 4 đỉnh cao kim tự tháp',
      'Hỗ trợ kỹ thuật & Kênh CSKH trực tuyến 24/7',
      'Xuất bản Ebook PDF 30+ trang chuẩn in ấn'
    ],
    isPopular: true,
    type: 'b2c',
    credits: 1,
  },
  {
    id: 'b2c_family_10_890k',
    name: 'Gói Gia Đình Gắn Kết',
    badge: 'Tiết Kiệm 55%',
    price: 890000,
    originalPrice: 2000000,
    period: '10 bài luận giải (89k/bài)',
    targetAudience: 'Dành cho gia đình, nhóm bạn & cha mẹ thấu hiểu con cái',
    features: [
      '10 lượt luận giải chuyên sâu trọn vẹn 3 tầng',
      'Tính năng độc quyền: Phân tích Tương hợp vợ chồng / con cái',
      'Phân tích tiềm năng & thiên hướng giáo dục cho trẻ nhỏ',
      'Không giới hạn thời gian sử dụng 10 lượt',
      'Xuất 10 file PDF chuyên biệt cho từng thành viên',
      'Ưu tiên tốc độ xử lý & Xuất bản báo cáo tức thì'
    ],
    type: 'family',
    credits: 10,
  },
  {
    id: 'coach_starter_100_4900k',
    name: 'Coach Khởi Nghiệp (100 bài)',
    price: 4900000,
    originalPrice: 20000000,
    period: '100 lượt báo cáo (49k/bài)',
    targetAudience: 'Dành cho Life Coach, Chuyên viên Nhân sự, Sinh trắc học',
    features: [
      '100 lượt xuất báo cáo chuyên sâu Tầng 3',
      'Tùy biến Logo & Thương hiệu chuyên gia trên báo cáo PDF',
      'Cổng quản lý danh sách khách hàng CRM thông minh',
      'Ghi chú hồ sơ tư vấn khách hàng bảo mật',
      'Tham gia Mạng Lưới Chuyên Gia Toàn Quốc'
    ],
    type: 'coach_batch',
    credits: 100,
  },
  {
    id: 'coach_scale_200_7900k',
    name: 'Coach Tăng Tốc (200 bài)',
    badge: 'Chuyên Gia Lựa Chọn',
    price: 7900000,
    originalPrice: 40000000,
    period: '200 lượt báo cáo (39k/bài)',
    targetAudience: 'Dành cho Coach thực chiến có tệp khách hàng đều đặn',
    features: [
      '200 lượt xuất báo cáo chuyên sâu (Giá vốn siêu tối ưu 39k)',
      'Đầy đủ tính năng White-label thương hiệu riêng',
      'Hỗ trợ tích hợp Form khảo sát tự động cho khách hàng',
      'Bộ tài liệu biểu mẫu kịch bản tư vấn chuẩn quốc tế',
      'Cấp quyền truy cập Mạng Lưới Chuyên Gia VIP'
    ],
    isPopular: true,
    type: 'coach_batch',
    credits: 200,
  },
  {
    id: 'coach_pro_500_14900k',
    name: 'Coach Quy Mô Lớn (500 bài)',
    price: 14900000,
    originalPrice: 100000000,
    period: '500 lượt báo cáo (29k/bài)',
    targetAudience: 'Dành cho Học viện đào tạo, Đội nhóm tư vấn lớn',
    features: [
      '500 lượt xuất báo cáo chuyên sâu (Giá vốn chỉ 29k/bài)',
      'Hệ thống quản lý phân quyền cộng tác viên',
      'Hỗ trợ kỹ thuật VIP 24/7 & Thiết kế template PDF riêng',
      'Chia sẻ cơ hội kết nối khách hàng từ nền tảng'
    ],
    type: 'coach_batch',
    credits: 500,
  },
  {
    id: 'coach_annual_vip_4990k',
    name: 'Coach VIP Hội Viên Năm',
    badge: 'Doanh Nhân & Viện Đào Tạo',
    price: 4990000,
    originalPrice: 12000000,
    period: 'năm hội viên cao cấp',
    targetAudience: 'Dành cho Doanh nghiệp & Chuyên gia muốn xây dựng đế chế riêng',
    features: [
      'Không giới hạn tính năng nền tảng trong 365 ngày',
      'Tặng kèm 50 lượt báo cáo chuyên sâu VIP',
      'Hưởng mức giá nạp sỉ báo cáo ưu đãi nhất hệ thống (25k/bài)',
      'Huy hiệu Chuyên Gia Xác Thực (Verified Life Coach)',
      'Hiển thị nổi bật trên Danh bạ Mạng Lưới Chuyên Gia toàn quốc',
      'Cố vấn chiến lược phát triển thương hiệu cá nhân 1-1'
    ],
    type: 'coach_sub',
    credits: 50,
  }
];

export default function PricingSection({ customerId, onPaymentSuccess }: { customerId?: string; onPaymentSuccess?: () => void }) {
  const { user, loginWithGoogle } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'b2c' | 'coach'>('all');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const filteredPlans = PRICING_PLANS.filter(plan => {
    if (selectedCategory === 'b2c') return plan.type === 'b2c' || plan.type === 'family';
    if (selectedCategory === 'coach') return plan.type === 'coach_batch' || plan.type === 'coach_sub';
    return true;
  });

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
    <section id="pricing" className="py-20 px-4 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFEFB3]/40 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#EEF5F3]/80 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEFB3] border border-[#F9E79F] text-[#013E37] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} className="text-[#013E37]" />
            <span>Bảng Giá Minh Bạch - Tối Đa Giá Trị</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-[#0D2B26] tracking-tight">
            Chọn Gói Luận Giải Phù Hợp Với Bạn
          </h2>
          <p className="text-[#5F736E] mt-4 text-base sm:text-lg leading-relaxed">
            Mở khóa trọn vẹn Tầng 3 Luận Giải Đa Chiều độc bản hoặc trang bị công cụ chuyên sâu cho sự nghiệp Life Coach.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#EEF5F3] border border-[#E2E8E5] mt-8 shadow-inner">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#013E37] text-white shadow-md'
                  : 'text-[#5F736E] hover:text-[#013E37]'
              }`}
            >
              Tất Cả Gói
            </button>
            <button
              onClick={() => setSelectedCategory('b2c')}
              className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'b2c'
                  ? 'bg-[#013E37] text-white shadow-md'
                  : 'text-[#5F736E] hover:text-[#013E37]'
              }`}
            >
              Cá Nhân & Gia Đình
            </button>
            <button
              onClick={() => setSelectedCategory('coach')}
              className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'coach'
                  ? 'bg-[#013E37] text-white shadow-md'
                  : 'text-[#5F736E] hover:text-[#013E37]'
              }`}
            >
              Dành Cho Life Coach
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-[#FFFFFF] border-2 border-[#267D71] shadow-2xl shadow-[#013E37]/10 scale-[1.03] z-10'
                  : 'bg-[#FFFFFF] border border-[#E2E8E5] hover:border-[#267D71]/40 hover:shadow-xl shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFEFB3] border border-[#F9E79F] text-[#013E37] text-xs font-extrabold uppercase px-4 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="text-[#5F736E] text-xs font-semibold uppercase tracking-wider mb-2">
                  {plan.targetAudience}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0D2B26] font-heading mb-4">{plan.name}</h3>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
                    {plan.price.toLocaleString('vi-VN')} đ
                  </span>
                  {plan.period && (
                    <span className="text-xs text-[#5F736E]">/ {plan.period}</span>
                  )}
                </div>

                {plan.originalPrice && (
                  <div className="text-xs text-[#93A39F] line-through mb-6">
                    Giá gốc: {plan.originalPrice.toLocaleString('vi-VN')} đ
                  </div>
                )}

                <div className="h-px bg-[#E2E8E5] my-6" />

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#2D3E3A] leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-[#EEF5F3] flex items-center justify-center text-[#267D71] shrink-0 mt-0.5 border border-[#267D71]/20">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  plan.isPopular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {user ? '🚀 Nâng Cấp Ngay' : '🔑 Đăng Nhập Để Mua'}
              </button>
            </div>
          ))}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-16 text-center border-t border-[#E2E8E5] pt-8 max-w-2xl mx-auto text-xs text-[#5F736E] flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#267D71]" />
            <span>Bảo mật dữ liệu chuẩn AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#013E37]" />
            <span>Kích hoạt tự động qua VietQR ACB</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#8C6A81]" />
            <span>Chuẩn Luận Giải Pythagoras Quốc Tế</span>
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
