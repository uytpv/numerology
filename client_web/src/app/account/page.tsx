'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { CheckoutModal } from '@/components/CheckoutModal';
import axios from 'axios';
import { 
  User, Sparkles, CreditCard, Clock, CheckCircle2, AlertCircle, 
  ArrowRight, Home, ShieldCheck, RefreshCw, FileText, Download, 
  Calendar, Layers, Zap, ExternalLink, QrCode, LogOut, ChevronRight, Check, Trash2
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports'>('overview');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [unlockedReports, setUnlockedReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal QR Code Thanh Toán lại cho đơn PENDING
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPendingOrder, setSelectedPendingOrder] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const loadAccountData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Tải thông tin User (Credits, Subscription, Role)
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      let uData = userSnap.exists() ? userSnap.data() : { credits: 0, role: 'user' };

      // 2. Tải danh sách giao dịch từ Firestore / Backend
      let orderList: any[] = [];
      try {
        const res = await axios.get(`${backendUrl}/api/v1/payments/user-transactions/${user.uid}`);
        if (res.data && Array.isArray(res.data)) {
          orderList = res.data;
        }
      } catch (apiErr) {
        // Fallback truy vấn Firestore trực tiếp
        const qOrders = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const orderSnap = await getDocs(qOrders);
        orderList = orderSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        orderList.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      setTransactions(orderList);

      // Tự sửa lỗi: Nếu tài khoản bị hiển thị nhầm 9999 (do rule hardcode cũ), tính lại theo đúng số đơn đã thanh toán (PAID)
      if (uData.credits === 9999) {
        const paidOrders = orderList.filter(o => o.status === 'PAID' || o.status === 'completed');
        const calculatedCredits = paidOrders.reduce((sum, o) => sum + (o.creditsGranted || 1), 0);
        uData = { ...uData, credits: calculatedCredits };
        await setDoc(userRef, { credits: calculatedCredits }, { merge: true });
      }
      setUserData(uData);

      // 3. Tải danh sách hồ sơ báo cáo của khách hàng
      const qCustomers = query(
        collection(db, 'customers'),
        where('user_id', '==', user.uid)
      );
      const custSnap = await getDocs(qCustomers);
      const custList = custSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      custList.sort((a: any, b: any) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
      setUnlockedReports(custList);

    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tài khoản:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAccountData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Nếu người dùng chưa đăng nhập
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full card-surface rounded-3xl p-8 text-center space-y-6 shadow-xl border border-[#E2E8E5]">
          <div className="w-16 h-16 rounded-3xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto border border-[#F9E79F]">
            <User size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">Đăng Nhập Tài Khoản</h2>
            <p className="text-xs text-[#5F736E] leading-relaxed">
              Vui lòng đăng nhập để xem thông tin gói đã mua, số lượt báo cáo còn lại và lịch sử giao dịch.
            </p>
          </div>
          <button
            onClick={loginWithGoogle}
            className="w-full py-4 rounded-2xl btn-primary text-sm font-bold flex items-center justify-center gap-3 shadow-md cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Đăng Nhập Bằng Google</span>
          </button>
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-[#5F736E] hover:text-[#013E37]">
            <Home size={14} /> Trở về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const creditsCount = userData?.credits || 0;
  const subscription = userData?.subscription;
  const isSubscriptionActive = subscription?.status === 'ACTIVE' && (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date());

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này khỏi danh sách?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setTransactions(prev => prev.filter(t => (t.orderCode || t.id) !== orderId));
    } catch (err) {
      console.error('Lỗi khi xóa đơn hàng:', err);
      alert('Không thể xóa đơn hàng này.');
    }
  };

  const handleClearExpiredOrders = async () => {
    const expiredOrders = transactions.filter(t => {
      const isPending = t.status === 'PENDING' || t.status === 'pending';
      const orderTime = t.createdAt ? new Date(t.createdAt).getTime() : (t.created_at?.seconds ? t.created_at.seconds * 1000 : 0);
      return isPending && (Date.now() - orderTime > 15 * 60 * 1000);
    });
    if (expiredOrders.length === 0) return;
    if (!confirm(`Bạn có muốn dọn dẹp ${expiredOrders.length} đơn hàng đã hết hạn hiệu lực (> 15 phút)?`)) return;

    try {
      for (const ord of expiredOrders) {
        const ordId = ord.orderCode || ord.id;
        if (ordId) {
          await deleteDoc(doc(db, 'orders', ordId));
        }
      }
      setTransactions(prev => prev.filter(t => !expiredOrders.some(e => (e.orderCode || e.id) === (t.orderCode || t.id))));
    } catch (err) {
      console.error('Lỗi khi dọn dẹp đơn hàng:', err);
    }
  };

  const expiredCount = transactions.filter(t => {
    const isPending = t.status === 'PENDING' || t.status === 'pending';
    const orderTime = t.createdAt ? new Date(t.createdAt).getTime() : (t.created_at?.seconds ? t.created_at.seconds * 1000 : 0);
    return isPending && (Date.now() - orderTime > 15 * 60 * 1000);
  }).length;

  const handlePayPendingOrder = (order: any) => {
    setSelectedPendingOrder(order);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans relative pb-20">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFEFB3]/35 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[#EEF5F3]/70 rounded-full blur-3xl pointer-events-none -ml-40" />

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#E2E8E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🔮</span>
              <span className="font-heading font-black text-lg tracking-tight text-[#0D2B26]">Life Maps</span>
            </a>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E2E8E5] text-[#5F736E] font-medium hidden sm:inline-block">
              Tài Khoản & Gói Mua
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8E5] hover:bg-[#FAF8F5] transition-colors text-[#0D2B26]"
            >
              <Home size={14} />
              <span>Trang Chủ</span>
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FFFDF5] text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-all shadow-sm"
            >
              <Sparkles size={14} />
              <span>Nâng Cấp Gói</span>
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 text-xs text-[#5F736E] hover:text-red-600 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8 relative z-10">
        
        {/* HERO PROFILE SUMMARY CARD */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#267D71]/20 shadow-md" />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#267D71] to-[#013E37] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'LM'}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#0D2B26]">{user?.displayName || 'Thành Viên Life Maps'}</h1>
                </div>
                <p className="text-xs sm:text-sm text-[#5F736E]">{user?.email}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#267D71] font-medium">
                  <ShieldCheck size={13} />
                  <span>Tài khoản xác thực Google</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl p-4 min-w-[130px] text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#5F736E] font-bold block mb-0.5">Số Lượt Báo Cáo</span>
                <span className="text-2xl sm:text-3xl font-black font-heading text-[#013E37]">
                  {creditsCount}
                </span>
                <span className="text-[11px] text-[#93A39F] block mt-0.5">Lượt có sẵn</span>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl p-4 min-w-[140px] text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#5F736E] font-bold block mb-0.5">Gói Hội Viên</span>
                <span className="text-sm font-black font-heading text-[#0D2B26] block truncate">
                  {isSubscriptionActive ? (subscription?.planName || 'Gói Chuyên Gia') : 'Gói Tiêu Chuẩn'}
                </span>
                <span className="text-[11px] text-[#267D71] font-medium block mt-0.5">
                  {isSubscriptionActive ? 'Đang hoạt động' : 'Vĩnh viễn'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-[#E2E8E5] pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#013E37] text-[#013E37]'
                : 'border-transparent text-[#5F736E] hover:text-[#0D2B26]'
            }`}
          >
            <Layers size={16} />
            <span>Tổng Quan & Gói Đang Dùng</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-[#013E37] text-[#013E37]'
                : 'border-transparent text-[#5F736E] hover:text-[#0D2B26]'
            }`}
          >
            <CreditCard size={16} />
            <span>Lịch Sử Giao Dịch ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-[#013E37] text-[#013E37]'
                : 'border-transparent text-[#5F736E] hover:text-[#0D2B26]'
            }`}
          >
            <FileText size={16} />
            <span>Hồ Sơ Đã Mở Khóa ({unlockedReports.length})</span>
          </button>
        </div>

        {/* TAB 1: TỔNG QUAN & QUYỀN LỢI */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            
            {/* Credit Wallet Card */}
            <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#267D71] flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Số Dư Lượt Mở Báo Cáo</h3>
                <p className="text-xs text-[#5F736E] leading-relaxed">
                  Mỗi lượt cho phép bạn mở khóa trọn vẹn Tầng 3 Luận Giải Đa Chiều và xuất trọn bộ Ebook PDF 35+ trang cho 1 khách hàng / người thân.
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-between">
                  <span className="text-xs text-[#5F736E]">Lượt hiện tại:</span>
                  <span className="text-2xl font-black font-heading text-[#013E37]">
                    {creditsCount} <span className="text-sm font-normal text-[#5F736E]">bài</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="/"
                  className="py-3 px-5 rounded-2xl btn-primary text-xs font-bold flex items-center justify-center gap-2 flex-1"
                >
                  <Zap size={14} />
                  <span>Dùng Lượt Tra Cứu Ngay</span>
                  <ArrowRight size={14} />
                </a>
                <a
                  href="/pricing"
                  className="py-3 px-5 rounded-2xl bg-white border border-[#E2E8E5] hover:bg-[#FAF8F5] text-xs font-bold text-[#0D2B26] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Nạp Thêm Lượt</span>
                </a>
              </div>
            </div>

            {/* Plan / Subscription Status Card */}
            <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFDF5] text-[#D97706] flex items-center justify-center font-bold border border-[#FDE68A]">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Gói Quyền Lợi Hệ Thống</h3>
                <p className="text-xs text-[#5F736E] leading-relaxed">
                  {isSubscriptionActive 
                    ? 'Bạn đang sở hữu đặc quyền Hội Viên Chuyên Gia. Toàn bộ tính năng CRM, gắn Brand riêng và luận giải chuyên sâu đã được kích hoạt.'
                    : 'Bạn đang ở gói dịch vụ tiêu chuẩn. Nâng cấp lên gói Chuyên gia để hưởng chiết khấu nạp sỉ chỉ từ 25k-49k/bài.'}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#E2E8E5]">
                    <span className="text-[#5F736E]">Loại tài khoản:</span>
                    <span className="font-bold text-[#0D2B26]">
                      {isSubscriptionActive ? 'Chuyên Gia (Coach Pro)' : 'Khách hàng cá nhân'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[#E2E8E5]">
                    <span className="text-[#5F736E]">Thời hạn sử dụng:</span>
                    <span className="font-bold text-[#0D2B26]">
                      {isSubscriptionActive && subscription?.expiresAt 
                        ? `Đến ${new Date(subscription.expiresAt).toLocaleDateString('vi-VN')}` 
                        : 'Vĩnh viễn'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="/pricing"
                  className="w-full py-3 px-5 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-xs font-bold text-[#0D2B26] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Xem Toàn Bộ Bảng Giá & Quyền Lợi</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LỊCH SỬ GIAO DỊCH (TRANSACTIONS) */}
        {activeTab === 'transactions' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Danh Sách Đơn Hàng & Giao Dịch</h3>
                <p className="text-xs text-[#5F736E] mt-1">
                  Toàn bộ lịch sử nạp gói qua chuyển khoản VietQR Ngân hàng ACB.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {expiredCount > 0 && (
                  <button
                    onClick={handleClearExpiredOrders}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 cursor-pointer transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Dọn {expiredCount} đơn hết hạn</span>
                  </button>
                )}
                <button
                  onClick={loadAccountData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EEF5F3] text-[#5F736E] text-xs font-medium border border-[#E2E8E5] cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-[#5F736E] space-y-2">
                <RefreshCw size={24} className="mx-auto animate-spin text-[#267D71]" />
                <p className="text-xs">Đang tải lịch sử giao dịch...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-[#5F736E] space-y-3 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E2E8E5]">
                <CreditCard size={36} className="mx-auto text-[#93A39F]" />
                <p className="text-xs">Bạn chưa có đơn hàng nào.</p>
                <a href="/pricing" className="inline-block py-2.5 px-5 rounded-xl btn-primary text-xs font-bold">
                  Mua Gói Dịch Vụ Đầu Tiên
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8E5] text-[#5F736E] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">Mã Đơn</th>
                      <th className="py-3 px-4">Gói Dịch Vụ</th>
                      <th className="py-3 px-4">Số Tiền</th>
                      <th className="py-3 px-4">Phương Thức</th>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {transactions.map((t, idx) => {
                      const isPaid = t.status === 'PAID' || t.status === 'completed';
                      const isCancelled = t.status === 'CANCELLED' || t.status === 'cancelled';
                      const isPending = (t.status === 'PENDING' || t.status === 'pending') && !isCancelled;
                      const orderTime = t.createdAt ? new Date(t.createdAt).getTime() : (t.created_at?.seconds ? t.created_at.seconds * 1000 : 0);
                      const isExpired = isPending && (Date.now() - orderTime > 15 * 60 * 1000);
                      const isTrulyPending = isPending && !isExpired;

                      const createdDate = t.createdAt ? new Date(t.createdAt).toLocaleString('vi-VN') : (t.created_at?.seconds ? new Date(t.created_at.seconds * 1000).toLocaleString('vi-VN') : 'Mới đây');

                      return (
                        <tr key={idx} className="hover:bg-[#EEF5F3]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#013E37]">
                            #{t.orderCode || t.order_code || t.id?.slice(0, 8)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#0D2B26]">
                            {t.planName || t.plan_name || 'Gói Dịch Vụ'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#013E37]">
                            {(t.amount || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-3.5 px-4 text-[#5F736E]">
                            VietQR (ACB)
                          </td>
                          <td className="py-3.5 px-4 text-[#5F736E]">
                            {createdDate}
                          </td>
                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                <CheckCircle2 size={12} /> Đã Thanh Toán
                              </span>
                            ) : isTrulyPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                <Clock size={12} /> Chờ Thanh Toán
                              </span>
                            ) : isExpired ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-medium">
                                <Clock size={12} /> Đã Hết Hạn
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                                <AlertCircle size={12} /> Đã Hủy
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isTrulyPending && (
                                <button
                                  onClick={() => handlePayPendingOrder(t)}
                                  className="px-3 py-1.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <QrCode size={13} />
                                  <span>Thanh toán</span>
                                </button>
                              )}
                              {(isTrulyPending || isExpired || isCancelled) && (
                                <button
                                  onClick={() => handleDeleteOrder(t.orderCode || t.id)}
                                  title="Xóa đơn hàng này"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              {isPaid && (
                                <span className="text-[#267D71] font-semibold text-xs flex items-center gap-1">
                                  <Check size={13} /> Hoàn tất
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HỒ SƠ BÁO CÁO ĐÃ MỞ KHÓA */}
        {activeTab === 'reports' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Hồ Sơ Luận Giải Đã Tra Cứu</h3>
              <p className="text-xs text-[#5F736E] mt-1">
                Danh sách các bản đồ số học đã tra cứu và lưu trữ trong tài khoản của bạn.
              </p>
            </div>

            {unlockedReports.length === 0 ? (
              <div className="py-12 text-center text-[#5F736E] space-y-3 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E2E8E5]">
                <FileText size={36} className="mx-auto text-[#93A39F]" />
                <p className="text-xs">Bạn chưa tra cứu hồ sơ nào.</p>
                <a href="/" className="inline-block py-2.5 px-5 rounded-xl btn-primary text-xs font-bold">
                  Tra Cứu Bản Đồ Mới
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedReports.map((c, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#E2E8E5] hover:border-[#267D71]/40 rounded-2xl p-4.5 space-y-3 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#0D2B26] truncate">
                          {c.full_name || `${c.last_name || ''} ${c.first_name || ''}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EEF5F3] text-[#267D71] text-[10px] font-bold">
                          Số Chủ Đạo: {c.map?.life_path || c.map?.rulingNumber || '7'}
                        </span>
                      </div>
                      <div className="text-xs text-[#5F736E] flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{c.dob}</span>
                      </div>
                    </div>

                    <a
                      href={`/report/print?id=${c.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EEF5F3] text-[#013E37] text-xs font-bold border border-[#E2E8E5] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileText size={13} className="text-[#267D71]" />
                      <span>Xem Báo Cáo PDF</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL MỞ LẠI THANH TOÁN CHO ĐƠN PENDING */}
      {selectedPendingOrder && (
        <CheckoutModal
          isOpen={checkoutModalOpen}
          existingOrder={selectedPendingOrder}
          onClose={() => {
            setCheckoutModalOpen(false);
            setSelectedPendingOrder(null);
            loadAccountData();
          }}
          planId={selectedPendingOrder.planId || selectedPendingOrder.plan_id || 'b2c_single_200k'}
          planName={selectedPendingOrder.planName || selectedPendingOrder.plan_name}
          amount={selectedPendingOrder.amount}
          userId={user?.uid}
          userEmail={user?.email || ''}
          userName={user?.displayName || 'Khách hàng'}
          onSuccess={() => {
            loadAccountData();
          }}
        />
      )}
    </div>
  );
}
