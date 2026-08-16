'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import ReportDashboard from '@/components/ReportDashboard';
import { ArrowLeft, Home, Sparkles, User, LogOut, Compass } from 'lucide-react';

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();

  const id = searchParams.get('id');
  const isExisting = searchParams.get('existing') === '1';

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      setLoading(true);
      try {
        // 1. Try loading from Firestore if valid ID
        if (id && !id.startsWith('local_')) {
          const docRef = doc(db, 'customers', id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setCustomer({ id: snap.id, ...snap.data() });
            setLoading(false);
            return;
          }
        }

        // 2. Fallback to localStorage
        const localData = localStorage.getItem('lifemaps_current_report');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (!id || parsed.id === id || id.startsWith('local_')) {
            setCustomer(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải bản đồ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [id]);

  // Tự động liên kết (Claim) hồ sơ vãng lai vào tài khoản Google khi người dùng đăng nhập
  useEffect(() => {
    async function claimGuestReport() {
      if (!user || !customer) return;
      if (customer.user_id && customer.user_id === user.uid) return;

      try {
        const dupQuery = query(
          collection(db, 'customers'),
          where('user_id', '==', user.uid),
          where('first_name', '==', customer.first_name),
          where('last_name', '==', customer.last_name),
          where('dob', '==', customer.dob)
        );

        const dupSnap = await getDocs(dupQuery);
        if (!dupSnap.empty) {
          const existingDoc = dupSnap.docs[0];
          const existingData = { id: existingDoc.id, ...existingDoc.data() };
          setCustomer(existingData);
          localStorage.setItem('lifemaps_current_report', JSON.stringify(existingData));
        } else {
          // Lưu hồ sơ mới vào tài khoản
          const newRecordData = {
            ...customer,
            user_id: user.uid,
            email: user.email || '',
            created_at: serverTimestamp(),
          };
          delete newRecordData.id;
          const docRef = await addDoc(collection(db, 'customers'), newRecordData);
          const savedCustomer = { id: docRef.id, ...newRecordData };
          setCustomer(savedCustomer);
          localStorage.setItem('lifemaps_current_report', JSON.stringify(savedCustomer));
        }
      } catch (err) {
        console.error('Lỗi liên kết hồ sơ vào tài khoản:', err);
      }
    }

    claimGuestReport();
  }, [user, customer?.id]);

  const handleRefresh = () => {
    setCustomer((prev: any) => {
      const updated = { ...prev, tier: 'paid', is_paid: true };
      localStorage.setItem('lifemaps_current_report', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Background ambient radial glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#FFEFB3]/40 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#EEF5F3]/80 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40 z-0" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-2xl font-bold font-heading text-[#013E37] tracking-tight flex items-center gap-2">
              <span>🔮</span>
              <span>Life Maps</span>
            </a>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-butter">
              SPECIAL EDITIONS
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              className="px-4 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ArrowLeft size={16} className="text-[#267D71]" />
              <span>Tra Cứu Khác</span>
            </a>

            <a
              href="/pricing"
              className="px-4 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={16} className="text-[#267D71]" />
              <span>Bảng Giá</span>
            </a>

            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#E2E8E5] animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#013E37] font-bold hidden md:inline px-3 py-1 bg-[#EEF5F3] rounded-xl border border-[#E2E8E5]">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-2xl bg-[#FFFFFF] hover:bg-[#EEF5F3] text-[#5F736E] text-xs font-medium border border-[#E2E8E5] transition-all flex items-center gap-1"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Đăng Xuất</span>
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
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-2xl animate-spin">
              🌀
            </div>
            <h2 className="text-xl font-bold font-heading text-[#0D2B26]">
              Đang Tải Bản Đồ Số Học...
            </h2>
            <p className="text-xs sm:text-sm text-[#5F736E]">
              Vui lòng đợi giây lát trong khi hệ thống kết nối dữ liệu hồ sơ của bạn.
            </p>
          </div>
        ) : customer ? (
          <ReportDashboard
            customer={customer}
            isExistingRecord={isExisting}
            onRefresh={handleRefresh}
          />
        ) : (
          <div className="max-w-lg mx-auto card-surface rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-[#E2E8E5] shadow-lg my-12">
            <div className="w-16 h-16 rounded-3xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto text-3xl shadow-sm">
              🧭
            </div>
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">
              Chưa Có Thông Tin Bản Đồ
            </h2>
            <p className="text-sm text-[#5F736E] leading-relaxed">
              Không tìm thấy dữ liệu bản đồ hoặc phiên làm việc đã kết thúc. Vui lòng quay về trang chủ để nhập thông tin và tra cứu.
            </p>
            <div className="pt-2">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl btn-primary font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Home size={16} />
                <span>Về Trang Chủ Tra Cứu Ngay</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E8E5] py-12 px-4 bg-[#FFFFFF] text-center text-xs text-[#5F736E] relative z-10">
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

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-8 text-[#5F736E]">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center text-xl animate-spin mb-3">
            🌀
          </div>
          <div>Đang khởi tạo bản đồ...</div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
