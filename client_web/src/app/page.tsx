'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateNumerologyMap, formatTitleCase } from '@/lib/numerologyReportGenerator';
import { Sparkles, Compass, Briefcase, User, Calendar, ShieldCheck, Heart, Baby, Globe, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();

  const [lastNameInput, setLastNameInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [genderInput, setGenderInput] = useState<string>('');

  const [isCalculating, setIsCalculating] = useState(false);
  const [userRecentReports, setUserRecentReports] = useState<any[]>([]);

  // Load recent reports if user logged in
  useEffect(() => {
    async function loadUserReports() {
      if (!user) {
        setUserRecentReports([]);
        return;
      }
      try {
        const q = query(
          collection(db, 'customers'),
          where('user_id', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => {
          const tA = a.created_at?.seconds || 0;
          const tB = b.created_at?.seconds || 0;
          return tB - tA;
        });
        setUserRecentReports(docs);
      } catch (err) {
        console.error('Lỗi khi tải danh sách hồ sơ:', err);
      }
    }
    loadUserReports();
  }, [user]);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);

    let formatted = '';
    if (val.length > 4) {
      formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.slice(0, 2)}/${val.slice(2)}`;
    } else {
      formatted = val;
    }
    setDobInput(formatted);
  };

  const isValidDate = (str: string) => {
    const parts = str.split('/');
    if (parts.length !== 3) return false;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    const currentYear = new Date().getFullYear();
    if (y < 1900 || y > currentYear) return false;

    const dateObj = new Date(y, m - 1, d);
    return dateObj.getFullYear() === y && dateObj.getMonth() === m - 1 && dateObj.getDate() === d;
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const lastName = formatTitleCase(lastNameInput);
    const firstName = formatTitleCase(firstNameInput);
    const dobFormatted = dobInput.trim();

    if (!lastName || !firstName || !dobFormatted || !genderInput) {
      alert('Vui lòng nhập đầy đủ Họ và chữ lót, Tên, Ngày sinh và Giới tính!');
      return;
    }

    if (!isValidDate(dobFormatted)) {
      alert('Ngày sinh không hợp lệ! Vui lòng nhập đúng định dạng DD/MM/YYYY (Ví dụ: 15/11/1980).');
      return;
    }

    setIsCalculating(true);

    try {
      const fullName = `${lastName} ${firstName}`;
      const numerologyMap = calculateNumerologyMap(fullName, dobFormatted);

      // 1. NẾU ĐÃ ĐĂNG NHẬP: KIỂM TRA TRÙNG LẶP & LƯU FIRESTORE
      if (user) {
        const dupQuery = query(
          collection(db, 'customers'),
          where('user_id', '==', user.uid),
          where('first_name', '==', firstName),
          where('last_name', '==', lastName),
          where('dob', '==', dobFormatted)
        );

        const dupSnap = await getDocs(dupQuery);
        if (!dupSnap.empty) {
          const existingDoc = dupSnap.docs[0];
          const existingData = { id: existingDoc.id, ...existingDoc.data() };
          localStorage.setItem('lifemaps_current_report', JSON.stringify(existingData));
          setIsCalculating(false);
          router.push(`/map?id=${encodeURIComponent(existingDoc.id)}&existing=1`);
          return;
        }

        const newCustomerData: any = {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          dob: dobFormatted,
          gender: genderInput,
          email: user?.email || '',
          phone: '',
          user_id: user.uid,
          tier: 'free',
          is_paid: false,
          map: numerologyMap,
          created_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'customers'), newCustomerData);
        const fullCustomer = { id: docRef.id, ...newCustomerData };
        localStorage.setItem('lifemaps_current_report', JSON.stringify(fullCustomer));
        setUserRecentReports(prev => [fullCustomer, ...prev]);

        setIsCalculating(false);
        router.push(`/map?id=${encodeURIComponent(docRef.id)}`);
        return;
      }

      // 2. NẾU CHƯA ĐĂNG NHẬP (GUEST): CHỈ LƯU LOCALSTORAGE (KHÔNG GHI FIRESTORE)
      const guestCustomerData = {
        id: `local_guest`,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        dob: dobFormatted,
        gender: genderInput,
        email: '',
        phone: '',
        user_id: null,
        tier: 'free',
        is_paid: false,
        map: numerologyMap,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('lifemaps_current_report', JSON.stringify(guestCustomerData));
      setIsCalculating(false);
      router.push(`/map?id=local_guest`);
    } catch (error) {
      console.error('Lỗi tính toán thần số học:', error);
      alert('Có lỗi xảy ra khi tính toán bản đồ. Vui lòng thử lại!');
      setIsCalculating(false);
    }
  };

  const handleSelectRecent = (c: any) => {
    localStorage.setItem('lifemaps_current_report', JSON.stringify(c));
    router.push(`/map?id=${encodeURIComponent(c.id)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans relative overflow-x-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#FFEFB3]/35 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/3" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#EEF5F3]/70 rounded-full blur-3xl pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav className="border-b border-[#E2E8E5] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-heading text-[#013E37] tracking-tight flex items-center gap-2">
              <span>🔮</span>
              <span>Life Maps</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-butter">
              SPECIAL EDITIONS
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/pricing"
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles size={15} className="text-[#267D71]" />
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
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E2E8E5] rounded-2xl shadow-sm">
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
                <span>Đăng Nhập Google</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION & CALCULATOR FORM */}
      <section className="relative pt-14 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading text-[#0D2B26] tracking-tight leading-tight">
            Mở LifeMaps –
            <span className="text-[#013E37]">
              Thấu đường đời
            </span>
          </h1>

          <p className="text-[#5F736E] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Nhập chính xác Họ tên và Ngày tháng năm sinh trên giấy tờ <br />để giải mã 17 chỉ số, nợ nghiệp và lộ trình thành công.
          </p>

          {/* CALCULATOR FORM CARD */}
          <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl p-7 sm:p-9 shadow-xl text-left max-w-2xl mx-auto mt-8">
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B26] mb-1.5">
                    Họ Và Chữ Lót <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: NGUYEN VAN"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all uppercase placeholder:normal-case placeholder:text-[#93A39F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B26] mb-1.5">
                    Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: AN"
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all uppercase placeholder:normal-case placeholder:text-[#93A39F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B26] mb-1.5">
                    Ngày Tháng Năm Sinh (Dương Lịch) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      placeholder="DD/MM/YYYY (Ví dụ: 15/11/1980)"
                      value={dobInput}
                      onChange={handleDobChange}
                      className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all placeholder:text-[#93A39F] tracking-wide"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#93A39F] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B26] mb-1.5">
                    Giới Tính <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                  >
                    <option value="" disabled>-- Chọn Giới Tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-4 rounded-2xl btn-primary text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isCalculating ? (
                  <>
                    <span className="animate-spin">🌀</span>
                    <span>Đang Giải Mã Ma Trận Pythagoras...</span>
                  </>
                ) : (
                  <span>Tra Cứu</span>
                )}
              </button>
            </form>
          </div>

          {/* USER RECENT CALCULATIONS */}
          {user && userRecentReports.length > 0 && (
            <div className="pt-6 max-w-2xl mx-auto text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5F736E] mb-3 flex items-center gap-2">
                <span>📁 Hồ Sơ Đã Tra Cứu Của Bạn:</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {userRecentReports.slice(0, 5).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRecent(r)}
                    className="shrink-0 px-4 py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-xs font-medium text-[#2D3E3A] transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span>👤</span>
                    <span className="font-bold text-[#0D2B26]">{r.full_name || `${r.last_name} ${r.first_name}`}</span>
                    <span className="text-[11px] text-[#013E37] bg-[#FFEFB3] px-2 py-0.5 rounded-md font-bold">ĐĐ {r.map?.life_path}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ECOSYSTEM ROADMAP SECTION */}
      <section className="py-16 px-4 bg-[#FFFFFF] border-t border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="badge-butter px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
            Lộ Trình Phát Triển
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26] mb-3">
            Hệ Sinh Thái Tính Năng Đang Mở Rộng
          </h2>
          <p className="text-xs sm:text-sm text-[#5F736E] max-w-xl mx-auto mb-10 leading-relaxed">
            Chúng tôi liên tục hoàn thiện và bổ sung các phân hệ số học chuyên sâu giúp bạn kết nối năng lượng và kiến tạo cuộc sống thăng hoa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="card-surface p-6 rounded-3xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#013E37] flex items-center justify-center mb-4 border border-[#267D71]/20">
                <Baby size={20} className="text-[#267D71]" />
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-sm mb-1.5">Chọn Ngày Sinh Cho Con</h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">Phân tích tần số năng lượng ngày dự sinh định hình tố chất tốt đẹp cho bé.</p>
            </div>

            <div className="card-surface p-6 rounded-3xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mb-4 border border-[#F9E79F]">
                <Heart size={20} className="text-[#013E37]" />
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-sm mb-1.5">Tương Hợp Phối Ngẫu</h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">Đối chiếu bản đồ hai người để thấu hiểu điểm chạm và cách hòa hợp tình duyên.</p>
            </div>

            <div className="card-surface p-6 rounded-3xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5F3] text-[#013E37] flex items-center justify-center mb-4 border border-[#267D71]/20">
                <Calendar size={20} className="text-[#267D71]" />
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-sm mb-1.5">Lịch Cá Nhân 365 Ngày</h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">Theo dõi năng lượng theo từng ngày để đón đầu cơ hội kinh doanh và ký kết.</p>
            </div>

            <div className="card-surface p-6 rounded-3xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6A81] flex items-center justify-center mb-4 border border-[#8C6A81]/20">
                <Globe size={20} className="text-[#8C6A81]" />
              </div>
              <h3 className="font-bold text-[#0D2B26] font-heading text-sm mb-1.5">Năng Lượng Thế Giới</h3>
              <p className="text-xs text-[#5F736E] leading-relaxed">Tổng hòa dịch chuyển chu kỳ năm toàn cầu giúp bạn định hướng dài hạn.</p>
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

