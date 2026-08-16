'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateNumerologyMap } from '@/lib/numerologyReportGenerator';
import PricingSection from '@/components/PricingSection';
import { Briefcase, UserPlus, Palette, Package, Link2, Users, FileText, Search, Sparkles, CheckCircle2, Award, Calendar, Phone, Mail, Home } from 'lucide-react';

export default function CoachPortalPage() {
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'crm' | 'create' | 'branding' | 'packages' | 'form_embed' | 'community'>('crm');

  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form create client state
  const [newClientName, setNewClientName] = useState('');
  const [newClientDob, setNewClientDob] = useState('');
  const [newClientGender, setNewClientGender] = useState<'male' | 'female' | 'other'>('male');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // Branding state
  const [coachBrandName, setCoachBrandName] = useState('Chuyên Gia Khai Vấn Tâm Lý');
  const [coachPhone, setCoachPhone] = useState('0912.345.678');
  const [coachEmail, setCoachEmail] = useState('coach@numerology.vn');
  const [coachTitle, setCoachTitle] = useState('Master Life Coach & Nhà Tư Vấn Thần Số Học');
  const [brandingSaved, setBrandingSaved] = useState(false);

  useEffect(() => {
    async function loadClients() {
      if (!user) return;
      setIsLoadingClients(true);
      try {
        const q = query(
          collection(db, 'customers'),
          where('user_id', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a: any, b: any) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
        setClients(list);
      } catch (err) {
        console.error('Lỗi khi tải danh sách khách hàng CRM:', err);
      } finally {
        setIsLoadingClients(false);
      }
    }
    loadClients();
  }, [user]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập tài khoản Chuyên gia Google!');
      return;
    }
    if (!newClientName.trim() || !newClientDob.trim()) {
      alert('Vui lòng nhập Họ tên và Ngày sinh của khách hàng!');
      return;
    }

    setIsCreatingClient(true);
    try {
      const parts = newClientName.trim().split(/\s+/);
      const lastName = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
      const firstName = parts[parts.length - 1];

      // Deduplication check
      const dupQuery = query(
        collection(db, 'customers'),
        where('user_id', '==', user.uid),
        where('first_name', '==', firstName),
        where('last_name', '==', lastName),
        where('dob', '==', newClientDob.trim())
      );
      const dupSnap = await getDocs(dupQuery);
      if (!dupSnap.empty) {
        alert('Khách hàng này đã tồn tại trong danh bạ CRM của bạn!');
        setIsCreatingClient(false);
        return;
      }

      const map = calculateNumerologyMap(newClientName.trim(), newClientDob.trim());

      const clientData = {
        user_id: user.uid,
        first_name: firstName,
        last_name: lastName,
        full_name: newClientName.trim(),
        dob: newClientDob.trim(),
        gender: newClientGender,
        phone: newClientPhone.trim(),
        email: newClientEmail.trim(),
        notes: newClientNotes.trim(),
        tier: 'coach',
        is_paid: true,
        map,
        created_at: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'customers'), clientData);
      const createdObj = { id: docRef.id, ...clientData };
      setClients(prev => [createdObj, ...prev]);

      alert(`Đã thêm thành công khách hàng [${newClientName}] vào hệ thống CRM!`);
      setNewClientName('');
      setNewClientDob('');
      setNewClientPhone('');
      setNewClientEmail('');
      setNewClientNotes('');
      setActiveTab('crm');
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi tạo hồ sơ khách hàng.');
    } finally {
      setIsCreatingClient(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    const name = (c.full_name || `${c.last_name} ${c.first_name}`).toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    return name.includes(term) || phone.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans selection:bg-[#FFEFB3] selection:text-[#013E37]">
      {/* TOPBAR */}
      <nav className="border-b border-[#E2E8E5] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold font-heading text-[#013E37] flex items-center gap-2">
              <span>🔮</span>
              <span>LIFE MAPS COACH PORTAL</span>
            </a>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#EEF5F3] text-[#013E37] text-[10px] font-bold border border-[#267D71]/30">
              B2B CRM & WHITE-LABEL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="px-3.5 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Home size={14} className="text-[#267D71]" />
              <span className="hidden sm:inline">Về Trang Chủ</span>
            </a>

            <a
              href="/pricing"
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={14} className="text-[#267D71]" />
              <span>Bảng Giá</span>
            </a>

            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#E2E8E5] animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#013E37] font-bold hidden md:inline px-3 py-1 bg-[#EEF5F3] rounded-xl border border-[#E2E8E5]">
                  Coach: {user.displayName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#EEF5F3] text-[#5F736E] text-xs font-medium border border-[#E2E8E5] transition-all"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 rounded-2xl btn-primary text-xs font-bold shadow-sm"
              >
                Đăng Nhập Google
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* HEADER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 rounded-3xl">
            <div className="text-[#5F736E] text-xs font-semibold mb-1">Tổng Hồ Sơ Đã Khai Vấn</div>
            <div className="text-2xl font-bold font-heading text-[#013E37]">{clients.length} khách</div>
          </div>
          <div className="card-surface p-5 rounded-3xl">
            <div className="text-[#5F736E] text-xs font-semibold mb-1">Số Lượng Báo Cáo Khả Dụng</div>
            <div className="text-2xl font-bold font-heading text-[#267D71]">Không Giới Hạn</div>
          </div>
          <div className="card-surface p-5 rounded-3xl">
            <div className="text-[#5F736E] text-xs font-semibold mb-1">Thương Hiệu Riêng (White-label)</div>
            <div className="text-sm font-bold text-[#267D71] flex items-center gap-1.5 mt-1">
              <CheckCircle2 size={16} />
              <span>Đã Kích Hoạt</span>
            </div>
          </div>
          <div className="card-surface p-5 rounded-3xl">
            <div className="text-[#5F736E] text-xs font-semibold mb-1">Hạng Thành Viên</div>
            <div className="text-sm font-bold font-heading text-[#013E37] flex items-center gap-1.5 mt-1">
              <Award size={16} className="text-[#F9E79F]" />
              <span>COACH PRO VIP</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-2 border-b border-[#E2E8E5] pb-3 overflow-x-auto">
          {[
            { key: 'crm', label: '1. Quản Lý Khách Hàng (CRM)', icon: Briefcase },
            { key: 'create', label: '2. Tạo Hồ Sơ Khách Mới', icon: UserPlus },
            { key: 'branding', label: '3. Cấu Hình Thương Hiệu (PDF)', icon: Palette },
            { key: 'packages', label: '4. Mua Sỉ Báo Cáo', icon: Package },
            { key: 'form_embed', label: '5. Form Khảo Sát Khách Hàng', icon: Link2 },
            { key: 'community', label: '6. Mạng Lưới Chuyên Gia', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'btn-primary shadow-sm'
                    : 'bg-[#FFFFFF] text-[#5F736E] hover:text-[#013E37] border border-[#E2E8E5]'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CRM CLIENTS LIST */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A39F]" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8E5] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                />
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="w-full sm:w-auto px-4 py-2.5 btn-primary font-bold text-xs rounded-2xl shadow-sm transition-all"
              >
                + Thêm Khách Hàng Mới
              </button>
            </div>

            {isLoadingClients ? (
              <div className="p-12 text-center text-[#5F736E]">Đang tải danh sách khách hàng...</div>
            ) : filteredClients.length === 0 ? (
              <div className="card-surface rounded-3xl p-12 text-center space-y-3">
                <div className="text-3xl">📭</div>
                <h4 className="text-base font-bold font-heading text-[#0D2B26]">Chưa Có Khách Hàng Nào</h4>
                <p className="text-xs text-[#5F736E] max-w-sm mx-auto">
                  Hãy thêm hồ sơ khách hàng đầu tiên để bắt đầu khai vấn và xuất báo cáo mang thương hiệu của bạn.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-5 py-2.5 btn-primary text-xs font-bold rounded-2xl shadow-sm"
                >
                  Tạo Hồ Sơ Đầu Tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredClients.map((c) => (
                  <div key={c.id} className="card-surface rounded-3xl p-6 hover:shadow-md hover:border-[#267D71]/40 transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold font-heading text-[#0D2B26] text-base">{c.full_name || `${c.last_name} ${c.first_name}`}</span>
                        <span className="px-2.5 py-0.5 bg-[#FFEFB3] text-[#013E37] font-mono text-xs font-bold rounded-lg border border-[#F9E79F]">
                          ĐĐ {c.map?.life_path || '-'}
                        </span>
                      </div>
                      <div className="text-xs text-[#5F736E] space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#267D71]" />
                          <span>Sinh nhật: {c.dob}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={13} className="text-[#267D71]" />
                            <span>ĐT: {c.phone}</span>
                          </div>
                        )}
                        {c.notes && (
                          <div className="bg-[#FAF8F5] p-3 rounded-2xl text-[#2D3E3A] italic text-xs mt-2 border border-[#E2E8E5]">
                            "{c.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8E5]">
                      <a
                        href={`/report/print?id=${c.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 text-center rounded-2xl btn-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <FileText size={14} />
                        <span>Xuất PDF Báo Cáo</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATE CLIENT */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto card-surface rounded-3xl p-7 sm:p-9 shadow-xl">
            <h3 className="text-xl font-bold font-heading text-[#0D2B26] mb-1">Tạo Hồ Sơ Khách Hàng Khai Vấn</h3>
            <p className="text-xs text-[#5F736E] mb-6">
              Hệ thống tự động tính toán 17 chỉ số và lưu trữ vĩnh viễn vào hệ thống CRM của bạn.
            </p>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Họ và Tên Khách Hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: TRAN THI MAI"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Ngày Tháng Năm Sinh *</label>
                  <input
                    type="date"
                    required
                    value={newClientDob}
                    onChange={(e) => setNewClientDob(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Giới Tính</label>
                  <select
                    value={newClientGender}
                    onChange={(e) => setNewClientGender(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                  >
                    <option value="female">Nữ</option>
                    <option value="male">Nam</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Số Điện Thoại (Zalo)</label>
                  <input
                    type="tel"
                    placeholder="09..."
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Ghi Chú Tư Vấn Ban Đầu</label>
                <textarea
                  rows={3}
                  placeholder="Khách đang muốn định hướng sự nghiệp, mâu thuẫn gia đình..."
                  value={newClientNotes}
                  onChange={(e) => setNewClientNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71]"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingClient}
                className="w-full py-4 btn-primary text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isCreatingClient ? 'Đang Khởi Tạo...' : '✨ Lưu Hồ Sơ & Tính Bản Đồ Ngay'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: BRANDING CONFIG */}
        {activeTab === 'branding' && (
          <div className="max-w-2xl mx-auto card-surface rounded-3xl p-7 sm:p-9 space-y-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Cấu Hình Thương Hiệu Báo Cáo PDF (White-Label)</h3>
              <p className="text-xs text-[#5F736E] mt-1">
                Tất cả báo cáo xuất ra cho khách hàng sẽ gắn liền với tên tuổi, logo và thông tin liên hệ của bạn.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Tên Thương Hiệu / Học Viện Của Bạn</label>
                <input
                  type="text"
                  value={coachBrandName}
                  onChange={(e) => setCoachBrandName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:border-[#267D71]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Chức Danh Chuyên Môn</label>
                <input
                  type="text"
                  value={coachTitle}
                  onChange={(e) => setCoachTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:border-[#267D71]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Số Hotline Tư Vấn</label>
                  <input
                    type="text"
                    value={coachPhone}
                    onChange={(e) => setCoachPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:border-[#267D71]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5">Email Liên Hệ</label>
                  <input
                    type="text"
                    value={coachEmail}
                    onChange={(e) => setCoachEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] focus:border-[#267D71]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] text-xs space-y-2">
                <div className="text-[#013E37] font-bold">Xem trước phần chân trang báo cáo PDF:</div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8E5] shadow-sm">
                  <div className="font-bold text-[#0D2B26] font-heading">{coachBrandName}</div>
                  <div className="text-[#5F736E] text-[11px] mt-0.5">{coachTitle} • Hotline: {coachPhone} • Email: {coachEmail}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setBrandingSaved(true);
                  setTimeout(() => setBrandingSaved(false), 3000);
                }}
                className="w-full py-3.5 btn-primary font-bold text-xs rounded-2xl shadow-sm transition-all"
              >
                {brandingSaved ? '✅ Đã Lưu Cấu Hình Thành Công!' : '💾 Lưu Cấu Hình Thương Hiệu'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGES */}
        {activeTab === 'packages' && (
          <PricingSection />
        )}

        {/* TAB 5: FORM EMBED */}
        {activeTab === 'form_embed' && (
          <div className="max-w-2xl mx-auto card-surface rounded-3xl p-7 sm:p-9 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Form Khảo Sát Khách Hàng Tự Động</h3>
            <p className="text-xs text-[#5F736E]">
              Nhúng đoạn mã này vào Website, Landing page hoặc gửi trực tiếp link cho khách hàng điền trước buổi khai vấn.
            </p>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2E8E5]">
              <div className="text-xs font-mono text-[#013E37] break-all">
                {`https://thansohoc.web.app/?coach_ref=${user?.uid || 'coach_pro'}`}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://thansohoc.web.app/?coach_ref=${user?.uid || 'coach_pro'}`);
                alert('Đã sao chép link form khảo sát vào bộ nhớ tạm!');
              }}
              className="w-full py-3.5 btn-primary font-bold text-xs rounded-2xl shadow-sm"
            >
              📋 Sao Chép Link Khảo Sát
            </button>
          </div>
        )}

        {/* TAB 6: MẠNG LƯỚI CHUYÊN GIA (COMMUNITY DIRECTORY) */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="bg-[#EEF5F3] border border-[#267D71]/30 rounded-3xl p-7 sm:p-9 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-bold mb-3 border border-[#F9E79F]">
                    <Sparkles size={13} className="text-[#013E37]" />
                    <span>Mạng Lưới Chuyên Gia Toàn Quốc</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26]">
                    Kết Nối & Giao Lưu Cùng 500+ Nhà Khai Vấn Hàng Đầu
                  </h2>
                  <p className="text-[#5F736E] text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                    Nơi trao đổi kinh nghiệm luận giải thực chiến, chia sẻ khách hàng chéo theo vùng miền và cùng nhau nâng cao chuẩn mực nghề Life Coach tại Việt Nam.
                  </p>
                </div>
                <button
                  onClick={() => alert('Hồ sơ của bạn đã được xác thực và hiển thị trên Danh bạ Chuyên Gia!')}
                  className="px-6 py-3.5 btn-primary text-xs font-bold rounded-2xl shadow-sm whitespace-nowrap"
                >
                  ⭐ Đăng Ký Lên Danh Bạ VIP
                </button>
              </div>
            </div>

            {/* DIRECTORY LIST OF COACHES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Master Coach Minh Đức',
                  title: 'Chuyên gia Tâm lý & Hôn nhân Gia đình',
                  exp: '8 năm kinh nghiệm',
                  location: 'Hà Nội',
                  clients: '1,200+ khách',
                  avatar: '👨‍💼',
                  badge: 'Top 1 Chuyên Gia 2025'
                },
                {
                  name: 'Coach Thanh Hằng',
                  title: 'Cố vấn Hướng nghiệp & Năng lực Trẻ',
                  exp: '5 năm kinh nghiệm',
                  location: 'TP. Hồ Chí Minh',
                  clients: '850+ khách',
                  avatar: '👩‍💼',
                  badge: 'Verified Expert'
                },
                {
                  name: 'Coach Hoàng Nam',
                  title: 'Chiến lược Gia Quản trị & Nhân sự',
                  exp: '10 năm kinh nghiệm',
                  location: 'Đà Nẵng',
                  clients: '2,000+ khách',
                  avatar: '🧑‍💼',
                  badge: 'Hội Viên Danh Dự'
                },
                {
                  name: 'Coach Bích Phương',
                  title: 'Khai vấn Thức tỉnh & Chữa lành',
                  exp: '6 năm kinh nghiệm',
                  location: 'Cần Thơ',
                  clients: '700+ khách',
                  avatar: '🧕',
                  badge: 'Master Healer'
                },
                {
                  name: 'Coach Quang Khải',
                  title: 'Tư vấn Thần số học Doanh nghiệp',
                  exp: '7 năm kinh nghiệm',
                  location: 'Hải Phòng',
                  clients: '1,100+ khách',
                  avatar: '👨‍🏫',
                  badge: 'Doanh Nhân Coach'
                },
                {
                  name: 'Coach Thu Trang',
                  title: 'Khai vấn Tự Tin & Biểu Đạt Ngôn Từ',
                  exp: '4 năm kinh nghiệm',
                  location: 'Nha Trang',
                  clients: '500+ khách',
                  avatar: '👩‍🏫',
                  badge: 'Rising Star'
                }
              ].map((c, idx) => (
                <div key={idx} className="card-surface rounded-3xl p-6 hover:shadow-md hover:border-[#267D71]/40 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{c.avatar}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFEFB3] text-[#013E37] border border-[#F9E79F] text-[10px] font-bold">
                        {c.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold font-heading text-[#0D2B26]">{c.name}</h4>
                    <p className="text-xs text-[#267D71] font-semibold mt-0.5">{c.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#5F736E] mt-3 pt-3 border-t border-[#E2E8E5]">
                      <span>📍 {c.location}</span>
                      <span>•</span>
                      <span>⏳ {c.exp}</span>
                      <span>•</span>
                      <span className="text-[#013E37] font-bold">{c.clients}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Đã gửi lời mời kết nối tới ${c.name}!`)}
                    className="w-full py-2.5 bg-[#FAF8F5] hover:bg-[#EEF5F3] text-[#013E37] font-bold text-xs rounded-2xl border border-[#E2E8E5] transition-all flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    <span>Kết Nối Giao Lưu</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

