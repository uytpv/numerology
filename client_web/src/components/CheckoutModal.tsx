'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  X, QrCode, Copy, Check, Sparkles, ShieldCheck, AlertCircle, 
  Loader2, ExternalLink, ArrowRight, Clock, HelpCircle, CheckCircle2,
  MessageCircle, Phone
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName?: string;
  amount?: number;
  features?: string[];
  customerId?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  existingOrder?: any;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  planId,
  planName,
  amount: initialAmount,
  features: initialFeatures,
  customerId,
  userId: propUserId,
  userEmail: propUserEmail,
  userName: propUserName,
  existingOrder,
  onSuccess,
}) => {
  const router = useRouter();
  const { user, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSupportGuide, setShowSupportGuide] = useState(false);
  const [supportCopied, setSupportCopied] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 phút

  const currentUserId = user?.uid || propUserId || 'guest_user';
  const currentUserEmail = user?.email || propUserEmail || '';
  const currentUserName = user?.displayName || propUserName || 'Khách hàng';

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const initiatingRef = useRef<string | null>(null);

  // Khởi tạo mã thanh toán VietQR khi modal mở (chỉ gọi 1 lần duy nhất cho mỗi phiên)
  useEffect(() => {
    if (!isOpen) {
      initiatingRef.current = null;
      return;
    }

    if (!planId) return;

    // 1. Nếu mở lại đơn hàng PENDING đã có sẵn, dùng trực tiếp thông tin đơn cũ không tạo mới
    if (existingOrder?.orderCode) {
      const memo = existingOrder.orderCode;
      const orderAmount = existingOrder.amount || initialAmount || 200000;
      const quickLink = `https://api.vietqr.io/image/970416-12688937-hjTz6tf.jpg?amount=${orderAmount}&addInfo=${memo}&accountName=${encodeURIComponent('TRA PHUC VINH UY')}`;
      
      setPaymentSuccess(false);
      setError(null);
      setShowSupportGuide(false);
      setCountdown(600);
      setOrderData({
        orderCode: existingOrder.orderCode,
        plan: {
          id: existingOrder.planId || planId,
          nameVi: existingOrder.planName || planName || 'Gói Dịch Vụ Life Maps',
          priceVnd: orderAmount,
          features: existingOrder.features || initialFeatures || [
            'Mở khóa báo cáo chuyên sâu Tầng 3',
            'Luận giải đầy đủ 17 chỉ số Pythagoras',
            'Xuất bản file PDF 30+ trang chất lượng cao'
          ]
        },
        vietqr: {
          bin: '970416',
          bankName: 'Ngân hàng TMCP Á Châu (ACB)',
          accountNumber: '12688937',
          accountName: 'TRA PHUC VINH UY',
          amount: orderAmount,
          description: memo,
          orderCode: existingOrder.orderCode,
          qrDataURL: quickLink,
          quickLinkUrl: quickLink,
        }
      });
      return;
    }

    // 2. Chống duplicate call do React StrictMode hoặc re-render
    const sessionKey = `${planId}_${currentUserId}_${initialAmount}`;
    if (initiatingRef.current === sessionKey) return;
    initiatingRef.current = sessionKey;

    setPaymentSuccess(false);
    setError(null);
    setShowSupportGuide(false);
    setOrderData(null);
    setCountdown(600);

    const initPayment = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/v1/payments/vietqr/create-link`, {
          planId,
          customerId,
          userId: currentUserId,
          userEmail: currentUserEmail,
          userName: currentUserName,
        });

        setOrderData(response.data);
      } catch (err: any) {
        console.warn('Lỗi gọi backend API tạo mã VietQR, chuyển sang khởi tạo trực tiếp:', err);
        // Fallback: Khởi tạo trực tiếp phía Client nếu Backend chưa khởi động
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const orderCode = `TSH${randomSuffix}`;
        const amount = initialAmount || 200000;
        const memo = orderCode;
        const quickLink = `https://api.vietqr.io/image/970416-12688937-hjTz6tf.jpg?amount=${amount}&addInfo=${memo}&accountName=${encodeURIComponent('TRA PHUC VINH UY')}`;

        setOrderData({
          orderCode,
          plan: {
            id: planId,
            nameVi: planName || 'Gói Dịch Vụ Life Maps',
            priceVnd: amount,
            features: initialFeatures || [
              'Mở khóa báo cáo chuyên sâu Tầng 3',
              'Luận giải đầy đủ 17 chỉ số Pythagoras',
              'Xuất bản file PDF 30+ trang chất lượng cao'
            ]
          },
          vietqr: {
            bin: '970416',
            bankName: 'Ngân hàng TMCP Á Châu (ACB)',
            accountNumber: '12688937',
            accountName: 'TRA PHUC VINH UY',
            amount,
            description: memo,
            orderCode,
            qrDataURL: quickLink,
            quickLinkUrl: quickLink,
          }
        });
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [isOpen, planId, customerId, currentUserId, currentUserEmail, currentUserName, backendUrl, initialAmount, initialFeatures, planName, existingOrder]);

  // Bộ đếm ngược thời gian thanh toán (10 phút)
  useEffect(() => {
    if (!isOpen || paymentSuccess) return;
    if (countdown <= 0) {
      setShowSupportGuide(true);
      if (orderData?.orderCode) {
        updateDoc(doc(db, 'orders', orderData.orderCode.toString()), {
          status: 'EXPIRED',
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      }
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentSuccess, countdown, orderData?.orderCode]);

  // Realtime Polling kiểm tra trạng thái đơn hàng mỗi 3 giây
  useEffect(() => {
    if (!isOpen || !orderData?.orderCode || paymentSuccess) return;

    // 1. Polling qua backend API
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/payments/order-status/${orderData.orderCode}`);
        if (res.data?.status === 'PAID') {
          triggerSuccess();
        }
      } catch (e) {
        // bỏ qua lỗi polling
      }
    }, 3000);

    // 2. Realtime Listener từ Firestore nếu có kết nối trực tiếp
    let unsubscribeFirestore: any = null;
    try {
      const docRef = doc(db, 'orders', orderData.orderCode.toString());
      unsubscribeFirestore = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'PAID') {
            triggerSuccess();
          }
        }
      });
    } catch (fsErr) {
      // Bỏ qua nếu lỗi listener
    }

    return () => {
      clearInterval(interval);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [isOpen, orderData?.orderCode, paymentSuccess, backendUrl]);

  const triggerSuccess = () => {
    setPaymentSuccess(true);
    try {
      canvasConfetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // Confetti fallback
    }
    if (onSuccess) onSuccess();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Sao chép thông tin đối soát để gửi CSKH
  const handleCopySupportInfo = () => {
    const text = `Hỗ trợ kích hoạt đơn hàng Life Maps:\n- Mã đơn hàng: #${orderData?.orderCode}\n- Gói dịch vụ: ${orderData?.plan?.nameVi || planName || 'Gói Dịch Vụ'}\n- Số tiền: ${(orderData?.vietqr?.amount || initialAmount || 200000).toLocaleString('vi-VN')} đ\n- Tài khoản: ${currentUserEmail || currentUserName}\n(Tôi đã chuyển khoản thành công, gửi kèm ảnh chụp biên lai nhờ admin đối soát kích hoạt giúp)`;
    navigator.clipboard.writeText(text);
    setSupportCopied(true);
    setTimeout(() => setSupportCopied(false), 2500);
  };

  // Kiểm tra trạng thái thanh toán từ Ngân hàng / Backend (An toàn, không cấp quyền ảo)
  const handleCheckPaymentStatus = async () => {
    if (!orderData?.orderCode) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Kiểm tra trạng thái trực tiếp từ Firestore doc 'orders'
      const orderRef = doc(db, 'orders', orderData.orderCode.toString());
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists() && orderSnap.data()?.status === 'PAID') {
        triggerSuccess();
        return;
      }

      // 2. Gọi backend kiểm tra nếu Firestore chưa cập nhật
      try {
        const res = await axios.get(`${backendUrl}/api/v1/payments/order-status/${orderData.orderCode}`);
        if (res.data?.status === 'PAID') {
          triggerSuccess();
          return;
        }
      } catch (apiErr) {
        // bỏ qua lỗi backend
      }

      // 3. Nếu chưa ghi nhận PAID: hiển thị hướng dẫn CSKH gửi biên lai
      setShowSupportGuide(true);
      setError('Hệ thống chưa ghi nhận biến động số dư từ ngân hàng (thường mất 1 - 2 phút). Nếu bạn đã chuyển khoản thành công và bị trừ tiền, vui lòng gửi biên lai qua Zalo CSKH bên dưới để được mở khóa ngay!');
    } catch (err: any) {
      console.error('Lỗi kiểm tra thanh toán:', err);
      setShowSupportGuide(true);
      setError('Tạm thời chưa thể đối soát tự động với ngân hàng. Quý khách vui lòng gửi biên lai qua kênh CSKH bên dưới để được kích hoạt thủ công.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const qrImageSrc = orderData?.vietqr?.qrDataURL || orderData?.vietqr?.quickLinkUrl || `https://api.vietqr.io/image/970416-12688937-hjTz6tf.jpg?amount=${initialAmount || 200000}&addInfo=${orderData?.orderCode || 'TSH123456'}&accountName=${encodeURIComponent('TRA PHUC VINH UY')}`;

  const planFeatures: string[] = orderData?.plan?.features || initialFeatures || [
    'Mở khóa trọn vẹn Tầng 3 Luận Giải Đa Chiều Chuyên Sâu',
    'Đầy đủ 17 chỉ số Pythagoras chuyên sâu',
    'Phân tích Ma trận Nợ nghiệp & Điểm nghẽn cuộc đời',
    'Xuất bản Ebook PDF 30+ trang chuẩn in ấn'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0D2B26]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 sm:p-8 shadow-2xl text-[#2D3E3A] max-h-[92vh] overflow-y-auto">
        
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5F736E] hover:text-[#0D2B26] hover:bg-[#EEF5F3] transition-all cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* 1. MÀN HÌNH NẾU CHƯA ĐĂNG NHẬP */}
        {!user && currentUserId === 'guest_user' && !paymentSuccess ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto border border-[#F9E79F] shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-heading text-[#0D2B26]">Vui Lòng Đăng Nhập</h3>
              <p className="text-xs text-[#5F736E] max-w-sm mx-auto leading-relaxed">
                Đăng nhập tài khoản để hệ thống tự động lưu trữ quyền lợi, số lượt tra cứu và gửi email xác nhận cho bạn.
              </p>
            </div>

            <button
              onClick={async () => {
                await loginWithGoogle();
              }}
              className="w-full py-4 rounded-2xl btn-primary text-sm font-bold flex items-center justify-center gap-3 shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Đăng Nhập Bằng Google Để Tiếp Tục</span>
            </button>
          </div>
        ) : paymentSuccess ? (
          /* 2. MÀN HÌNH THANH TOÁN THÀNH CÔNG */
          <div className="text-center py-6 space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-[#EEF5F3] text-[#267D71] flex items-center justify-center mx-auto border-2 border-[#267D71]/40 shadow-xl">
              <Sparkles size={40} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-extrabold uppercase border border-[#F9E79F]">
                ✓ KÍCH HOẠT THÀNH CÔNG
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#013E37]">
                Thanh Toán Thành Công!
              </h3>
              <p className="text-xs sm:text-sm text-[#5F736E] max-w-sm mx-auto leading-relaxed">
                Đơn hàng <strong className="font-mono text-[#013E37]">#{orderData?.orderCode}</strong> đã được hệ thống xác nhận. Toàn bộ quyền lợi của gói <strong className="text-[#0D2B26]">[{orderData?.plan?.nameVi || planName}]</strong> đã được kích hoạt.
              </p>
            </div>

            {/* Thẻ tóm tắt đơn hàng thành công */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-[#E2E8E5]">
                <span className="text-[#5F736E]">Gói dịch vụ:</span>
                <span className="font-bold text-[#0D2B26]">{orderData?.plan?.nameVi || planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8E5]">
                <span className="text-[#5F736E]">Số tiền:</span>
                <span className="font-bold text-[#013E37]">
                  {(orderData?.vietqr?.amount || initialAmount || 200000).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8E5]">
                <span className="text-[#5F736E]">Email nhận biên lai:</span>
                <span className="font-mono text-[#0D2B26]">{currentUserEmail || 'Tài khoản đăng nhập'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5F736E]">Trạng thái:</span>
                <span className="font-bold text-[#267D71] flex items-center gap-1">
                  <CheckCircle2 size={13} /> Đã thanh toán & Mở khóa
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/account');
                }}
                className="flex-1 py-3.5 px-4 rounded-2xl btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>🚀 Quản Lý Gói & Tra Cứu Ngay</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={onClose}
                className="py-3.5 px-5 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2E8E5] text-[#013E37] text-xs font-bold border border-[#E2E8E5] transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          /* 3. MÀN HÌNH QUÉT MÃ QR VIETQR (ACB) & CHỜ THANH TOÁN */
          <div className="space-y-5">
            {/* Header Modal */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFB3] border border-[#F9E79F] text-[11px] font-bold text-[#013E37] shadow-sm">
                <ShieldCheck size={14} className="text-[#013E37]" />
                <span>Cổng Thanh Toán VietQR Tự Động 24/7</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">
                {orderData?.plan?.nameVi || planName || 'Mở Khóa Dịch Vụ Life Maps'}
              </h3>
              <p className="text-xs text-[#5F736E]">
                Quét mã QR bằng App Ngân hàng bất kỳ để kích hoạt tự động sau 3 giây.
              </p>
            </div>

            {loading && !orderData ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 size={36} className="mx-auto text-[#267D71] animate-spin" />
                <p className="text-sm text-[#5F736E]">Đang khởi tạo mã QR thanh toán VietQR...</p>
              </div>
            ) : !orderData ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center text-xs space-y-3">
                <AlertCircle size={24} className="mx-auto text-red-500" />
                <p>{error || 'Không thể khởi tạo mã thanh toán. Vui lòng thử lại sau.'}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* KHUNG MÃ QR VIETQR ACB */}
                <div className="p-4 rounded-3xl bg-[#FAF8F5] text-[#2D3E3A] text-center border border-[#E2E8E5] shadow-inner relative">
                  <div className="text-[11px] font-bold text-[#013E37] mb-2.5 uppercase tracking-wide flex items-center justify-center gap-1.5">
                    <QrCode size={15} className="text-[#267D71]" />
                    <span>Mã VietQR Ngân Hàng ACB (Napas247)</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl inline-block border border-[#E2E8E5] shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrImageSrc}
                      alt="VietQR Payment Code"
                      className="w-52 h-52 sm:w-56 sm:h-56 mx-auto object-contain rounded-xl"
                    />
                  </div>

                  <div className="text-xs text-[#5F736E] mt-3 flex items-center justify-center gap-2">
                    <Clock size={14} className="text-[#267D71]" />
                    <span>Thời gian giữ mã:</span>
                    <span className="font-mono font-bold text-[#013E37] bg-[#FFEFB3] px-2.5 py-0.5 rounded-lg border border-[#F9E79F]">
                      {formatTime(countdown)}
                    </span>
                  </div>
                </div>

                {/* THÔNG TIN CHUYỂN KHOẢN CHI TIẾT */}
                <div className="p-4 rounded-2xl bg-[#EEF5F3] border border-[#E2E8E5] space-y-2 text-xs text-[#2D3E3A]">
                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]/80">
                    <span className="text-[#5F736E]">Ngân hàng nhận:</span>
                    <span className="font-bold text-[#013E37]">Ngân hàng TMCP Á Châu (ACB)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]/80">
                    <span className="text-[#5F736E]">Chủ tài khoản:</span>
                    <span className="font-bold text-[#0D2B26]">TRÀ PHÚC VĨNH UY</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]/80">
                    <span className="text-[#5F736E]">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-[#0D2B26] text-sm">12688937</span>
                      <button
                        onClick={() => copyToClipboard('12688937', 'acc')}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5] cursor-pointer shadow-xs transition-all"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'acc' ? <Check size={13} className="text-[#267D71]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]/80">
                    <span className="text-[#5F736E]">Số tiền cần chuyển:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-[#013E37] text-sm">
                        {(orderData?.vietqr?.amount || initialAmount || 200000).toLocaleString('vi-VN')} đ
                      </span>
                      <button
                        onClick={() => copyToClipboard((orderData?.vietqr?.amount || initialAmount || 200000).toString(), 'amount')}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5] cursor-pointer shadow-xs transition-all"
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'amount' ? <Check size={13} className="text-[#267D71]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5F736E]">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#013E37] bg-[#FFEFB3] px-2.5 py-0.5 rounded-md border border-[#F9E79F]">
                        {orderData?.orderCode || 'TSH123456'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(orderData?.orderCode || 'TSH123456', 'memo')}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5] cursor-pointer shadow-xs transition-all"
                        title="Sao chép nội dung"
                      >
                        {copiedField === 'memo' ? <Check size={13} className="text-[#267D71]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* QUYỀN LỢI NHẬN ĐƯỢC */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#0D2B26] uppercase tracking-wide">
                    Quyền Lợi Gói Sẽ Kích Hoạt Ngay:
                  </div>
                  <ul className="space-y-1 text-xs text-[#5F736E]">
                    {planFeatures.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={12} className="text-[#267D71] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* NÚT KIỂM TRA TRẠNG THÁI THANH TOÁN & HỖ TRỢ CSKH */}
                <div className="pt-2 flex flex-col gap-3">
                  {error && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF8E6] border border-[#F9E79F] text-[#8C6B1C] text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                      <p className="leading-relaxed">{error}</p>
                    </div>
                  )}

                  {/* KHUNG HỖ TRỢ CSKH KÍCH HOẠT NHANH */}
                  {showSupportGuide && (
                    <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#0D2B26] space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                          <MessageCircle size={18} />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h4 className="font-bold text-xs sm:text-sm text-[#0D2B26]">
                            Kênh Hỗ Trợ Kích Hoạt Thủ Công 24/7
                          </h4>
                          <p className="text-[11px] text-[#5F736E] leading-relaxed">
                            Nếu tài khoản đã bị trừ tiền nhưng hệ thống chưa tự kích hoạt, bạn hãy yên tâm 100%! Chỉ cần gửi ảnh <strong>Biên lai chuyển tiền</strong> kèm mã đơn để được duyệt ngay:
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#DCFCE7] flex items-center justify-between font-mono text-xs">
                        <span className="text-[#5F736E]">Mã đơn: <strong className="text-[#013E37]">#{orderData?.orderCode}</strong></span>
                        <span className="text-[#5F736E]">Số tiền: <strong className="text-[#013E37]">{(orderData?.vietqr?.amount || initialAmount || 200000).toLocaleString('vi-VN')} đ</strong></span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://zalo.me/0912345678`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-[#0068FF] hover:bg-[#0058DD] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <MessageCircle size={14} />
                          <span>Gửi Biên Lai Qua Zalo</span>
                          <ExternalLink size={12} />
                        </a>

                        <button
                          type="button"
                          onClick={handleCopySupportInfo}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#0D2B26] border border-[#E2E8E5] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          {supportCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          <span>{supportCopied ? 'Đã sao chép nội dung!' : 'Sao Chép Thông Tin'}</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-center text-[#5F736E]">
                        Hotline CSKH: <strong className="text-[#0D2B26]">0912.345.678</strong> (Phục vụ 8h00 - 22h00)
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCheckPaymentStatus}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {loading ? 'Đang kết nối kiểm tra ngân hàng...' : '⚡ Tôi Đã Chuyển Khoản / Kiểm Tra Kích Hoạt'}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#5F736E] px-1">
                    <span>* Tự động duyệt qua SePay Webhook</span>
                    {!showSupportGuide && (
                      <button
                        type="button"
                        onClick={() => setShowSupportGuide(true)}
                        className="text-[#267D71] hover:underline font-medium cursor-pointer"
                      >
                        Gặp sự cố chuyển tiền?
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
