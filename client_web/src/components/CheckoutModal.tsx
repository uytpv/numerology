'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, QrCode, CreditCard, Copy, Check, Sparkles, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  customerId?: string;
  userId?: string;
  userEmail?: string;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  planId,
  customerId,
  userId,
  userEmail,
  onSuccess,
}) => {
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');
  const [loading, setLoading] = useState(false);
  const [payosData, setPayosData] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(600); // 10 phút

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Khởi tạo link thanh toán khi modal mở
  useEffect(() => {
    if (!isOpen || !planId) return;

    setPaymentSuccess(false);
    setError(null);
    setPayosData(null);
    setCountdown(600);

    const initPayment = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/v1/payments/payos/create-link`, {
          planId,
          customerId,
          userId: userId || 'guest_user',
          userEmail: userEmail || '',
        });

        setPayosData(response.data);
      } catch (err: any) {
        console.error('Lỗi khởi tạo thanh toán:', err);
        setError(err.response?.data?.message || 'Không thể khởi tạo cổng thanh toán');
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [isOpen, planId, customerId, userId, userEmail, backendUrl]);

  // Bộ đếm ngược thời gian chuyển khoản
  useEffect(() => {
    if (!isOpen || paymentSuccess || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentSuccess, countdown]);

  // Polling kiểm tra trạng thái đơn hàng mỗi 3 giây
  useEffect(() => {
    if (!isOpen || !payosData?.orderCode || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/payments/order-status/${payosData.orderCode}`);
        if (res.data?.status === 'PAID') {
          triggerSuccess();
        }
      } catch (e) {
        // bỏ qua lỗi polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, payosData?.orderCode, paymentSuccess, backendUrl]);

  const triggerSuccess = () => {
    setPaymentSuccess(true);
    canvasConfetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
    });
    if (onSuccess) onSuccess();
    setTimeout(() => {
      onClose();
    }, 3500);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Giả lập thanh toán nhanh cho môi trường Sandbox / Dev
  const handleDevMockPay = async () => {
    if (!payosData?.orderCode) return;
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/v1/payments/dev-mock-pay`, {
        orderCode: payosData.orderCode,
      });
      triggerSuccess();
    } catch (err) {
      console.error('Lỗi test payment:', err);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#E2E8E5] p-7 shadow-2xl text-[#2D3E3A] max-h-[90vh] overflow-y-auto">
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5F736E] hover:text-[#0D2B26] hover:bg-[#EEF5F3] transition-all"
        >
          <X size={20} />
        </button>

        {/* Trạng thái Thanh Toán Thành Công */}
        {paymentSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EEF5F3] text-[#267D71] flex items-center justify-center mx-auto border border-[#267D71]/30 animate-bounce">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#013E37] font-heading">Thanh Toán Thành Công!</h3>
            <p className="text-[#5F736E] text-sm max-w-sm mx-auto leading-relaxed">
              Hệ thống đã xác nhận giao dịch và tự động mở khóa toàn bộ quyền lợi của bạn. Đang chuyển hướng...
            </p>
          </div>
        ) : (
          <div>
            {/* Header Modal */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFB3] border border-[#F9E79F] text-xs font-bold text-[#013E37] mb-2 shadow-sm">
                <ShieldCheck size={14} className="text-[#013E37]" />
                Cổng Thanh Toán Bảo Mật Tức Thì
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#0D2B26]">
                {payosData?.plan?.nameVi || 'Mở Khóa Dịch Vụ Life Maps VIP'}
              </h3>
              <p className="text-xs text-[#5F736E] mt-1 leading-relaxed">
                Quét mã VietQR bằng bất kỳ ứng dụng Ngân hàng nào tại Việt Nam để kích hoạt ngay trong 3 giây.
              </p>
            </div>

            {/* Currency Switcher */}
            <div className="flex rounded-2xl bg-[#EEF5F3] p-1 border border-[#E2E8E5] mb-5">
              <button
                type="button"
                onClick={() => setCurrency('VND')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  currency === 'VND'
                    ? 'bg-[#013E37] text-white shadow-sm'
                    : 'text-[#5F736E] hover:text-[#013E37]'
                }`}
              >
                <QrCode size={14} />
                VietQR (Chuyển khoản VND)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  currency === 'USD'
                    ? 'bg-[#013E37] text-white shadow-sm'
                    : 'text-[#5F736E] hover:text-[#013E37]'
                }`}
              >
                <CreditCard size={14} />
                Quốc Tế (USD/Card)
              </button>
            </div>

            {loading && !payosData ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 size={36} className="mx-auto text-[#267D71] animate-spin" />
                <p className="text-sm text-[#5F736E]">Đang khởi tạo mã thanh toán VietQR...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center text-sm space-y-2">
                <AlertCircle size={24} className="mx-auto text-red-500" />
                <p>{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
                >
                  Đóng lại
                </button>
              </div>
            ) : currency === 'VND' && payosData ? (
              <div className="space-y-4">
                {/* Khung Mã QR VietQR */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] text-[#2D3E3A] text-center border border-[#E2E8E5] shadow-inner">
                  <div className="text-xs font-bold text-[#013E37] mb-2 uppercase tracking-wide">
                    Quét Mã VietQR Để Thanh Toán Tự Động
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={payosData.payos.qrCode || payosData.payos.checkoutUrl}
                    alt="VietQR Payment"
                    className="w-52 h-52 mx-auto rounded-xl object-contain border border-[#E2E8E5] bg-white p-2"
                  />
                  <div className="text-xs text-[#5F736E] mt-2.5 flex items-center justify-center gap-1.5">
                    <span>Thời gian giữ mã:</span>
                    <span className="font-mono font-bold text-[#013E37] bg-[#FFEFB3] px-2 py-0.5 rounded-md">{formatTime(countdown)}</span>
                  </div>
                </div>

                {/* Thông tin chuyển khoản thủ công */}
                <div className="p-4 rounded-2xl bg-[#EEF5F3] border border-[#E2E8E5] space-y-2.5 text-xs text-[#2D3E3A]">
                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]">
                    <span className="text-[#5F736E]">Ngân hàng:</span>
                    <span className="font-bold text-[#013E37]">{payosData.payos.accountName ? 'MBBank' : 'Ngân hàng'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]">
                    <span className="text-[#5F736E]">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#0D2B26]">{payosData.payos.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(payosData.payos.accountNumber, 'acc')}
                        className="p-1 rounded-md bg-[#FFFFFF] hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5]"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'acc' ? <Check size={12} className="text-[#267D71]" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E2E8E5]">
                    <span className="text-[#5F736E]">Số tiền:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-[#013E37] text-sm">
                        {payosData.payos.amount.toLocaleString('vi-VN')} đ
                      </span>
                      <button
                        onClick={() => copyToClipboard(payosData.payos.amount.toString(), 'amount')}
                        className="p-1 rounded-md bg-[#FFFFFF] hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5]"
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'amount' ? <Check size={12} className="text-[#267D71]" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5F736E]">Nội dung CK:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#013E37] bg-[#FFEFB3] px-2 py-0.5 rounded border border-[#F9E79F]">
                        {payosData.payos.description}
                      </span>
                      <button
                        onClick={() => copyToClipboard(payosData.payos.description, 'memo')}
                        className="p-1 rounded-md bg-[#FFFFFF] hover:bg-[#E2E8E5] text-[#013E37] border border-[#E2E8E5]"
                        title="Sao chép nội dung"
                      >
                        {copiedField === 'memo' ? <Check size={12} className="text-[#267D71]" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nút Test Dev Mock / Hỗ trợ */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleDevMockPay}
                    disabled={loading}
                    className="w-full py-3 rounded-xl btn-primary text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Sparkles size={14} />
                    {loading ? 'Đang kích hoạt...' : '⚡ Giả Lập Thanh Toán Tức Thì (Sandbox Dev)'}
                  </button>
                  <p className="text-[10px] text-center text-[#5F736E]">
                    * Trong môi trường thực tế, hệ thống sẽ tự động bắt Webhook ngay khi bạn chuyển tiền từ ứng dụng Ngân hàng.
                  </p>
                </div>
              </div>
            ) : (
              /* Tab USD - Lemon Squeezy */
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto border border-[#F9E79F]">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#0D2B26] font-heading">Thanh Toán Toàn Cầu (Lemon Squeezy)</h4>
                  <p className="text-xs text-[#5F736E] mt-1 max-w-xs mx-auto">
                    Hỗ trợ thẻ Visa, Mastercard, AMEX, Apple Pay, Google Pay và PayPal.
                  </p>
                </div>
                <div className="text-2xl font-extrabold text-[#013E37] font-mono">
                  ${payosData?.plan?.priceUsd || '9.99'} USD
                </div>
                <button
                  onClick={() => {
                    alert('Chuyển hướng đến cổng thanh toán bảo mật Lemon Squeezy...');
                    handleDevMockPay();
                  }}
                  className="w-full py-3.5 rounded-xl btn-primary text-sm font-bold shadow-md"
                >
                  Tiếp Tục Thanh Toán Quốc Tế ($)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

