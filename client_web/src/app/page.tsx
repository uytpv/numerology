'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { ReportDashboard } from '../components/ReportDashboard';
import { calculateNumerologyMap } from '../lib/numerology';
import axios from 'axios';
import { Sparkles, Globe, LogOut, Loader2, ArrowRight, User, Key, Info, HelpCircle, Baby, Heart, Calendar } from 'lucide-react';

const validateName = (name: string): boolean => {
  const cleanName = name.trim();
  if (cleanName.length < 2) return false;
  if (/\d/.test(cleanName)) return false;
  
  // Không chứa các ký tự đặc biệt đáng ngờ
  const specialChars = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\/;`~]/;
  if (specialChars.test(cleanName)) return false;
  
  return true;
};

const validateDob = (dob: string): boolean => {
  if (dob.length !== 10) return false;
  const parts = dob.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  
  const daysInMonth = [
    31,
    (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];
  
  if (day < 1 || day > daysInMonth[month - 1]) return false;
  return true;
};

export default function Home() {
  const { t, locale, setLocale } = useTranslation();
  const { user, isAdmin, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();

  // Các trường nhập liệu tính toán
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  
  // Các trường đăng nhập bằng email (dành riêng cho Dev)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);

  // Kết quả sau khi nhấn Tra cứu (Cho user đã đăng nhập)
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<any | null>(null);

  // Trạng thái tính toán Offline cho Guest (Chưa đăng nhập)
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestInput, setGuestInput] = useState<any | null>(null);
  const [guestResult, setGuestResult] = useState<any | null>(null);

  // Xử lý tự động định dạng ngày sinh DD/MM/YYYY khi người dùng gõ
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Chỉ lấy số
    if (input.length > 8) input = input.substring(0, 8);
    
    let formatted = input;
    if (input.length > 4) {
      formatted = `${input.substring(0, 2)}/${input.substring(2, 4)}/${input.substring(4)}`;
    } else if (input.length > 2) {
      formatted = `${input.substring(0, 2)}/${input.substring(2)}`;
    }
    setDob(formatted);
  };

  // Tự động đồng bộ thông tin tra cứu tạm từ localStorage sau khi đăng nhập thành công
  useEffect(() => {
    const syncPendingCalculation = async () => {
      if (!user) return;
      
      const pendingDataStr = localStorage.getItem('pending_calculation');
      if (!pendingDataStr) return;

      setCalculating(true);
      setCalcError(null);

      try {
        const pendingData = JSON.parse(pendingDataStr);
        const idToken = await user.getIdToken();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        
        console.log('--- ĐỒNG BỘ DỮ LIỆU TRA CỨU TẠM LÊN FIREBASE ---');
        const response = await axios.post(`${backendUrl}/api/v1/customers`, {
          first_name: pendingData.first_name,
          last_name: pendingData.last_name,
          dob: pendingData.dob
        }, {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        // Đồng bộ thành công -> xóa khỏi localStorage
        localStorage.removeItem('pending_calculation');
        
        // Thiết lập khách hàng hoạt động và tắt chế độ Guest
        setActiveCustomer(response.data);
        setIsGuestMode(false);
        setGuestResult(null);
      } catch (err: any) {
        console.error('Lỗi đồng bộ dữ liệu sau đăng nhập:', err);
        // Fallback: Đổ lại dữ liệu cũ vào Form để người dùng có thể gửi lại thủ công nếu cần
        try {
          const pendingData = JSON.parse(pendingDataStr);
          setFirstName(pendingData.first_name || '');
          setLastName(pendingData.last_name || '');
          setDob(pendingData.dob || '');
        } catch (_) {}
      } finally {
        setCalculating(false);
      }
    };

    syncPendingCalculation();
  }, [user]);

  // Submit form tính toán thần số học
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || dob.length !== 10) return;

    if (!validateName(lastName)) {
      setCalcError(t('validation.invalidLastName'));
      return;
    }
    if (!validateName(firstName)) {
      setCalcError(t('validation.invalidFirstName'));
      return;
    }
    if (!validateDob(dob)) {
      setCalcError(t('validation.invalidDob'));
      return;
    }

    setCalculating(true);
    setCalcError(null);

    if (user) {
      // ĐÃ ĐĂNG NHẬP -> Gửi API lên backend lưu Firestore và gọi Gemini AI
      try {
        const idToken = await user.getIdToken();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        
        const response = await axios.post(`${backendUrl}/api/v1/customers`, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          dob: dob
        }, {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        setActiveCustomer(response.data);
      } catch (err: any) {
        console.error('Lỗi tính toán thần số học (API):', err);
        setCalcError(err.response?.data?.message || 'Không thể kết nối API tính toán. Vui lòng kiểm tra lại backend.');
      } finally {
        setCalculating(false);
      }
    } else {
      // CHƯA ĐĂNG NHẬP -> Tính toán offline 3 chỉ số chính ngay tại Client
      try {
        const input = {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          dob: dob
        };
        
        // Tính toán Pythagoras offline
        const localMap = calculateNumerologyMap(input);
        
        setGuestInput(input);
        setGuestResult(localMap);
        setIsGuestMode(true);
        
        // Lưu tạm vào localStorage để tự động tạo tài khoản Free sau khi login
        localStorage.setItem('pending_calculation', JSON.stringify(input));
      } catch (err: any) {
        console.error('Lỗi tính toán Pythagoras offline:', err);
        setCalcError(t('validation.generalError'));
      } finally {
        setCalculating(false);
      }
    }
  };

  // Submit form đăng nhập bằng Email (Chỉ cho Dev môi trường localhost)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Đã có lỗi xảy ra khi xác thực');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06040A]">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      {/* Thanh Header Điều hướng */}
      <header className="w-full max-w-6xl mx-auto px-4 py-4 flex justify-between items-center no-print z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveCustomer(null); setIsGuestMode(false); }}>
          <Sparkles className="text-amber-400" size={24} />
          <span className="font-extrabold text-lg bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent font-serif">
            Pythagoras.ai
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Menu Chọn ngôn ngữ */}
          <div className="flex items-center gap-1 bg-purple-950/40 border border-purple-500/20 px-3 py-1.5 rounded-lg text-sm">
            <Globe size={14} className="text-purple-300" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="bg-transparent text-purple-200 outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="vi" className="bg-[#06040A] text-white">Tiếng Việt</option>
              <option value="en" className="bg-[#06040A] text-white">English</option>
              <option value="fi" className="bg-[#06040A] text-white">Suomi</option>
            </select>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Profile Info (Chỉ hiện trên màn hình lớn) */}
              <div className="hidden sm:flex items-center gap-2 bg-purple-950/20 border border-purple-500/10 px-3 py-1.5 rounded-lg text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                ) : (
                  <User size={14} className="text-purple-300" />
                )}
                <span className="text-purple-200 font-medium max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
                {isAdmin && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Admin
                  </span>
                )}
              </div>

              {/* Nút vào trang quản trị nếu là Admin */}
              {isAdmin && (
                <a
                  href="/admin"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-purple-950 text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-amber-500/10"
                >
                  CMS Admin
                </a>
              )}

              {/* Nút Đăng xuất */}
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-purple-950/20 hover:bg-rose-950/20 border border-purple-500/10 hover:border-rose-500/20 text-purple-300 hover:text-rose-400 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t('common.logout')}</span>
              </button>
            </div>
          ) : (
            /* Nút Đăng nhập cho Guest */
            <button
              onClick={loginWithGoogle}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/10"
            >
              <span>{t('common.login')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 z-10">
        
        {/* TRƯỜNG HỢP 1: HIỂN THỊ BẢN ĐỒ CHI TIẾT ĐÃ ĐĂNG NHẬP */}
        {user && activeCustomer ? (
          <div className="w-full">
            {/* Nút quay lại Form Tra cứu */}
            <div className="max-w-6xl mx-auto px-4 mb-4 no-print">
              <button
                onClick={() => setActiveCustomer(null)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-all flex items-center gap-1"
              >
                ← Quay lại Tra cứu mới
              </button>
            </div>
            <ReportDashboard initialCustomer={activeCustomer} />
          </div>
        ) : isGuestMode && guestResult ? (
          
          /* TRƯỜNG HỢP 2: HIỂN THỊ BẢN XEM TRƯỚC OFFLINE (GUEST MODE) */
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="glass-card p-6 md:p-8 rounded-2xl border-purple-500/20">
              {/* Nút quay lại */}
              <button
                onClick={() => setIsGuestMode(false)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-all mb-6 flex items-center gap-1 no-print"
              >
                ← Nhập lại thông tin
              </button>

              <div className="text-center mb-8">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Bản xem trước cơ bản (Guest Preview)
                </span>
                <h2 className="text-3xl font-extrabold font-serif text-purple-100 mt-3 mb-1">
                  Bản Đồ Thần Số Học Pythagoras
                </h2>
                <p className="text-purple-300 text-sm">
                  Dành cho: <span className="text-amber-400 font-bold">{guestInput?.last_name} {guestInput?.first_name}</span> | Ngày sinh: <span className="text-amber-400 font-bold">{guestInput?.dob}</span>
                </p>
              </div>

              {/* Grid 3 chỉ số cốt lõi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* 1. Chỉ số Đường Đời */}
                <div className="glass-card p-6 rounded-xl border border-amber-500/20 text-center flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-all">
                    <Sparkles size={48} className="text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block mb-3">
                      {t('indicators.life_path')}
                    </span>
                    <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 bg-amber-500/5 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
                      <span className="text-4xl font-extrabold font-serif text-amber-400">{guestResult.life_path}</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed text-justify">
                    <strong className="text-amber-300">Ý nghĩa:</strong> Phản ánh con đường học tập, phát triển bản thân, những bài học và tiềm năng vượt trội mà bạn sẽ đi qua trong suốt hành trình cuộc đời này.
                  </p>
                </div>

                {/* 2. Chỉ số Sứ Mệnh */}
                <div className="glass-card p-6 rounded-xl border border-purple-500/20 text-center flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-all">
                    <Sparkles size={48} className="text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 block mb-3">
                      {t('indicators.expression')}
                    </span>
                    <div className="w-20 h-20 rounded-full border-2 border-purple-500/40 bg-purple-500/5 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/10">
                      <span className="text-4xl font-extrabold font-serif text-purple-300">{guestResult.expression}</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed text-justify">
                    <strong className="text-purple-300">Ý nghĩa:</strong> Thể hiện vai trò, mục tiêu lớn, năng lực hành động và cách bạn bộc lộ sức mạnh trí tuệ của mình ra ngoài thế giới để đạt được thành tựu.
                  </p>
                </div>

                {/* 3. Chỉ số Linh Hồn */}
                <div className="glass-card p-6 rounded-xl border border-rose-500/20 text-center flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-all">
                    <Sparkles size={48} className="text-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300 block mb-3">
                      {t('indicators.heart_desire')}
                    </span>
                    <div className="w-20 h-20 rounded-full border-2 border-rose-500/40 bg-rose-500/5 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/10">
                      <span className="text-4xl font-extrabold font-serif text-rose-300">{guestResult.heart_desire}</span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed text-justify">
                    <strong className="text-rose-300">Ý nghĩa:</strong> Đại diện cho những động lực thầm kín, khao khát sâu thẳm nhất bên trong nội tâm và những điều giúp linh hồn bạn cảm thấy thực sự trọn vẹn.
                  </p>
                </div>
              </div>

              {/* KHỐI CTA ĐĂNG NHẬP ĐỂ MỞ KHÓA USER FREE */}
              <div className="p-6 md:p-8 rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-black/40 text-center no-print">
                <h3 className="text-xl font-bold text-amber-300 mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="animate-pulse text-amber-400" size={20} />
                  Nhận Báo Cáo Phân Tích AI Miễn Phí
                </h3>
                <p className="text-purple-200 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                  Đăng nhập bằng tài khoản Google để **trở thành Free User**, lưu bản đồ này vĩnh viễn và nhận bài **luận giải AI tổng quan chi tiết** phân tích chuyên sâu về sự liên kết giữa các chỉ số của bạn.
                </p>

                {/* Button Google Login */}
                <button
                  onClick={loginWithGoogle}
                  className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-600/30 cursor-pointer mx-auto max-w-xs w-full"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.58 0-6.49-2.91-6.49-6.49s2.91-6.49 6.49-6.49c1.644 0 3.13.616 4.27 1.623L21.43 3.9C19.04 1.7 15.9 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.8 0 12.24-5.44 12.24-12.24 0-.82-.07-1.61-.22-2.38H12.24z"/>
                  </svg>
                  Đăng nhập Google ngay
                </button>

                {/* Dev mode email login (chỉ mở ra khi click) */}
                <div className="mt-6">
                  <button 
                    onClick={() => setShowDevLogin(!showDevLogin)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline transition-all bg-transparent border-none cursor-pointer"
                  >
                    {showDevLogin ? 'Ẩn bảng thử nghiệm (Dev Mode)' : 'Đăng nhập thử nghiệm (Dev Mode)'}
                  </button>

                  {showDevLogin && (
                    <div className="max-w-sm mx-auto mt-4 p-4 rounded-lg bg-black/50 border border-purple-500/10 text-left">
                      <span className="text-[10px] font-bold tracking-wider text-purple-400 uppercase block mb-3 flex items-center gap-1">
                        <Key size={10} /> Môi trường Lập trình viên
                      </span>
                      
                      <form onSubmit={handleEmailAuth} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-semibold text-purple-300 block mb-0.5">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="su@gmail.com"
                            className="w-full bg-black/60 border border-purple-500/10 rounded px-2.5 py-1.5 text-xs text-purple-100 outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-purple-300 block mb-0.5">Mật khẩu</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            className="w-full bg-black/60 border border-purple-500/10 rounded px-2.5 py-1.5 text-xs text-purple-100 outline-none focus:border-purple-500"
                          />
                        </div>

                        {authError && (
                          <p className="text-[10px] text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-500/10">
                            {authError}
                          </p>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            onClick={() => setIsRegister(false)}
                            className="flex-1 py-1.5 rounded bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 text-purple-200 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            {authLoading ? '...' : 'Đăng Nhập'}
                          </button>
                          <button
                            type="submit"
                            onClick={() => setIsRegister(true)}
                            className="flex-1 py-1.5 rounded bg-purple-950/20 hover:bg-purple-900/20 border border-purple-500/5 text-purple-300 text-[10px] font-semibold transition-all cursor-pointer"
                          >
                            {authLoading ? '...' : 'Đăng Ký Test'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* TRƯỜNG HỢP 3: HIỂN THỊ FORM NHẬP THÔNG TIN TRA CỨU BAN ĐẦU + THỰC ĐƠN TÍNH NĂNG TƯƠNG LAI */
          <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center gap-16 py-8">
            {/* Form tra cứu chính */}
            <div className="w-full max-w-lg">
              <div className="glass-card p-8 rounded-2xl border-purple-500/20 relative overflow-hidden">
                <h3 className="text-2xl font-serif font-bold text-amber-400 mb-2 text-center">
                  {t('common.title')}
                </h3>
                <p className="text-xs text-purple-300/80 text-center mb-6 leading-relaxed">
                  {t('common.calculateDescription')}
                </p>

                <form onSubmit={handleCalculate} className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-purple-200 block mb-1.5">
                      {t('common.lastName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('placeholder.lastName')}
                      className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 block mb-1.5">
                      {t('common.firstName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('placeholder.firstName')}
                      className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-200 block mb-1.5">
                      {t('common.dob')} (DD/MM/YYYY)
                    </label>
                    <input
                      type="text"
                      required
                      value={dob}
                      onChange={handleDobChange}
                      placeholder={t('placeholder.dob')}
                      className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500 transition-all font-medium tracking-wide"
                    />
                  </div>

                  {calcError && (
                    <p className="text-sm text-rose-400 bg-rose-950/20 p-3 rounded-xl border border-rose-500/10">
                      {calcError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={calculating || !firstName.trim() || !lastName.trim() || dob.length !== 10}
                    className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('common.calculateBtn')}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                {/* Info text cho user biết không cần đăng nhập */}
                <div className="mt-6 text-center text-[11px] text-purple-400/60 flex items-center justify-center gap-1">
                  <Info size={12} className="text-purple-400/80" />
                  <span>{t('common.guestDisclaimer')}</span>
                </div>
              </div>
            </div>

            {/* Hệ sinh thái tính năng tương lai */}
            <div className="w-full border-t border-purple-500/5 pt-12 no-print">
              <div className="text-center mb-8">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Lộ trình phát triển
                </span>
                <h4 className="text-2xl font-bold font-serif text-purple-100 mt-3 mb-2">
                  Hệ Sinh Thái Tính Năng Sắp Ra Mắt
                </h4>
                <p className="text-xs text-purple-300/60 max-w-lg mx-auto leading-relaxed">
                  Chúng tôi không ngừng nghiên cứu và mở rộng các công cụ số học chuyên sâu nhằm giúp bạn thấu hiểu bản thân và đón đầu tần số năng lượng thời đại.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tính năng 1 */}
                <div className="glass-card p-6 rounded-xl border border-purple-500/10 hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-[220px]">
                  <span className="absolute top-3 right-3 text-[9px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Coming Soon
                  </span>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 shadow-md shadow-amber-500/5">
                      <Baby className="text-amber-400" size={20} />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-2 group-hover:text-amber-300 transition-colors">
                      Chọn Ngày Sinh Cho Con
                    </h5>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed text-justify">
                      Hỗ trợ phân tích tần số số học của các ngày dự sinh, giúp bố mẹ lựa chọn thời điểm tốt lành định hình tố chất tốt nhất cho bé.
                    </p>
                  </div>
                </div>

                {/* Tính năng 2 */}
                <div className="glass-card p-6 rounded-xl border border-purple-500/10 hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-[220px]">
                  <span className="absolute top-3 right-3 text-[9px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Coming Soon
                  </span>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 shadow-md shadow-rose-500/5">
                      <Heart className="text-rose-400" size={20} />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-2 group-hover:text-rose-300 transition-colors">
                      Tương Hợp Phối Ngẫu
                    </h5>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed text-justify">
                      Đối chiếu 2 bản đồ Pythagoras giữa hai người nhằm đo lường mức độ thấu hiểu, các điểm nghẽn giao tiếp và cách hòa hợp trong tình duyên.
                    </p>
                  </div>
                </div>

                {/* Tính năng 3 */}
                <div className="glass-card p-6 rounded-xl border border-purple-500/10 hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-[220px]">
                  <span className="absolute top-3 right-3 text-[9px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Coming Soon
                  </span>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 shadow-md shadow-purple-500/5">
                      <Calendar className="text-purple-400" size={20} />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-2 group-hover:text-purple-300 transition-colors">
                      Lịch Cá Nhân 365 Ngày
                    </h5>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed text-justify">
                      Xem chi tiết chu kỳ năng lượng cá nhân theo ngày/tháng cụ thể, giúp bạn lập kế hoạch kinh doanh, ký kết hợp đồng đúng thời cơ.
                    </p>
                  </div>
                </div>

                {/* Tính năng 4 */}
                <div className="glass-card p-6 rounded-xl border border-purple-500/10 hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-[220px]">
                  <span className="absolute top-3 right-3 text-[9px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Coming Soon
                  </span>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 shadow-md shadow-teal-500/5">
                      <Globe className="text-teal-400" size={20} />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-2 group-hover:text-teal-300 transition-colors">
                      Năng Lượng Thế Giới
                    </h5>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed text-justify">
                      Tổng hợp phân tích xu hướng dịch chuyển năng lượng toàn cầu theo chu kỳ năm thế giới, giúp bạn định hướng cuộc sống hài hòa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-purple-500/5 py-4 text-center text-xs text-purple-400/50 no-print z-10">
        © 2026 Pythagoras Numerology. All rights reserved. Built with UyFullStack architecture.
      </footer>
    </div>
  );
}

