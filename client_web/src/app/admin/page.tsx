'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useTranslation } from '../../lib/i18n';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy } from 'firebase/firestore';
import { ReportDashboard } from '../../components/ReportDashboard';
import { 
  Users, Key, Settings, Loader2, Lock, Unlock, Eye, FileText, 
  Search, Edit, Save, ArrowLeft, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useTranslation();

  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'indicators' | 'keywords'>('customers');
  
  // State quản lý khách hàng
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerForMap, setSelectedCustomerForMap] = useState<any | null>(null);

  // State quản lý 17 chỉ số
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [selectedIndicatorForEdit, setSelectedIndicatorForEdit] = useState<string>('life_path');
  const [indicatorDesc, setIndicatorDesc] = useState('');
  const [savingIndicator, setSavingIndicator] = useState(false);
  const [indicatorStatus, setIndicatorStatus] = useState<string | null>(null);

  // State quản lý Từ khóa & Luận giải
  const [selectedIndicator, setSelectedIndicator] = useState('life_path');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [keywords, setKeywords] = useState('');
  const [principles, setPrinciples] = useState('');
  const [description, setDescription] = useState('');
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [savingKeywords, setSavingKeywords] = useState(false);
  const [keywordStatus, setKeywordStatus] = useState<string | null>(null);

  // Tải danh sách khách hàng từ Firestore
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(list);
    } catch (err) {
      console.error('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Tải 17 chỉ số từ Firestore
  const fetchIndicators = async () => {
    setLoadingIndicators(true);
    try {
      const snapshot = await getDocs(collection(db, 'indicators'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIndicators(list);
    } catch (err) {
      console.error('Lỗi tải danh sách chỉ số:', err);
    } finally {
      setLoadingIndicators(false);
    }
  };

  // Tải từ khóa và nguyên lý từ Firestore
  const fetchKeywords = async () => {
    setLoadingKeywords(true);
    setKeywordStatus(null);
    try {
      const docId = `${selectedIndicator}_${selectedNumber}`;
      const docRef = doc(db, 'indicator_numbers', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setKeywords(data.keywords || '');
        setPrinciples(data.principles || '');
        setDescription(data.description || '');
      } else {
        setKeywords('');
        setPrinciples('');
        setDescription('');
      }
    } catch (err) {
      console.error('Lỗi tải từ khóa:', err);
    } finally {
      setLoadingKeywords(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeSubTab === 'customers') {
        fetchCustomers();
      } else if (activeSubTab === 'indicators') {
        fetchIndicators();
      } else if (activeSubTab === 'keywords') {
        fetchIndicators(); // Load 17 chỉ số cho select box
        fetchKeywords();
      }
    }
  }, [isAdmin, activeSubTab]);

  useEffect(() => {
    if (activeSubTab === 'keywords') {
      fetchKeywords();
    }
  }, [selectedIndicator, selectedNumber]);

  useEffect(() => {
    const current = indicators.find(i => i.id === selectedIndicatorForEdit);
    if (current) {
      setIndicatorDesc(current.description || '');
    } else {
      setIndicatorDesc('');
    }
  }, [selectedIndicatorForEdit, indicators]);

  // Cập nhật mô tả chỉ số
  const handleSaveIndicator = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingIndicator(true);
    setIndicatorStatus(null);
    try {
      const docRef = doc(db, 'indicators', selectedIndicatorForEdit);
      await updateDoc(docRef, {
        description: indicatorDesc,
        updatedAt: new Date().toISOString()
      });
      setIndicatorStatus('Lưu thành công!');
      // Cập nhật state local
      setIndicators(prev => prev.map(ind => 
        ind.id === selectedIndicatorForEdit ? { ...ind, description: indicatorDesc } : ind
      ));
    } catch (err: any) {
      console.error('Lỗi lưu chỉ số:', err);
      setIndicatorStatus('Lỗi: ' + err.message);
    } finally {
      setSavingIndicator(false);
    }
  };

  // Cập nhật từ khóa và nguyên lý số học
  const handleSaveKeywords = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeywords(true);
    setKeywordStatus(null);
    try {
      const docId = `${selectedIndicator}_${selectedNumber}`;
      const docRef = doc(db, 'indicator_numbers', docId);
      
      await setDoc(docRef, {
        indicator: selectedIndicator,
        number: parseInt(selectedNumber, 10),
        keywords: keywords,
        principles: principles,
        description: description,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setKeywordStatus('Lưu thành công!');
    } catch (err: any) {
      console.error('Lỗi lưu từ khóa:', err);
      setKeywordStatus('Lỗi: ' + err.message);
    } finally {
      setSavingKeywords(false);
    }
  };

  // Mở khóa thủ công cấp độ báo cáo (Tier) cho khách hàng
  const handleToggleTier = async (customerId: string, currentTier: number) => {
    const nextTier = currentTier >= 2 ? 0 : currentTier + 1;
    try {
      const docRef = doc(db, 'customers', customerId);
      await updateDoc(docRef, {
        unlockedTier: nextTier,
        updatedAt: new Date().toISOString()
      });
      
      // Cập nhật state local
      setCustomers(prev => prev.map(c => 
        c.id === customerId ? { ...c, unlockedTier: nextTier } : c
      ));
    } catch (err) {
      console.error('Lỗi cập nhật phân cấp khách hàng:', err);
      alert('Không thể cập nhật phân cấp');
    }
  };

  // Lọc danh sách khách hàng
  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.last_name} ${c.first_name}`.toLowerCase();
    const dob = (c.dob || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || dob.includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#267D71]" size={48} />
      </div>
    );
  }

  // TỪ CHỐI TRUY CẬP NẾU KHÔNG PHẢI ADMIN
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
        <div className="card-surface p-8 rounded-3xl text-center max-w-sm border-rose-300 shadow-xl">
          <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold font-heading text-rose-600 mb-2">Từ Chối Truy Cập</h2>
          <p className="text-[#5F736E] text-sm mb-6">
            Bạn không có quyền hạn Admin để truy cập trang quản trị này.
          </p>
          <a href="/" className="px-5 py-2.5 rounded-2xl btn-primary text-sm font-bold transition-all inline-block shadow-sm">
            Quay về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  // NẾU CHỌN XEM BẢN ĐỒ CHI TIẾT CỦA KHÁCH HÀNG
  if (selectedCustomerForMap) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-8">
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <button 
            onClick={() => setSelectedCustomerForMap(null)}
            className="text-sm font-bold text-[#013E37] hover:text-[#267D71] flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft size={16} />
            Quay lại Danh sách Quản trị
          </button>
        </div>
        <ReportDashboard initialCustomer={selectedCustomerForMap} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F5] text-[#2D3E3A]">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-[#FFFFFF] border-r border-[#E2E8E5] p-6 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Settings className="text-[#267D71]" size={24} />
          <span className="font-bold text-lg text-[#013E37] font-heading">Life Maps CMS</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`w-full text-left py-3 px-4 rounded-2xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'customers' 
                ? 'btn-primary shadow-sm' 
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Users size={18} />
            <span>Khách Hàng</span>
          </button>

          <button
            onClick={() => setActiveSubTab('indicators')}
            className={`w-full text-left py-3 px-4 rounded-2xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'indicators' 
                ? 'btn-primary shadow-sm' 
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <FileText size={18} />
            <span>17 Chỉ Số</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('keywords')}
            className={`w-full text-left py-3 px-4 rounded-2xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'keywords' 
                ? 'btn-primary shadow-sm' 
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Key size={18} />
            <span>Từ Khóa & Luận Giải</span>
          </button>

          <a
            href="/"
            className="w-full text-left py-3 px-4 rounded-2xl flex items-center gap-3 font-semibold text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3] mt-10 border-t border-[#E2E8E5] pt-6 transition-all"
          >
            <ArrowLeft size={18} />
            <span>Quay về Web</span>
          </a>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-8">
        
        {/* TẢN KHÁCH HÀNG */}
        {activeSubTab === 'customers' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold font-heading text-[#0D2B26] flex items-center gap-2">
                <Users className="text-[#267D71]" />
                <span>Danh Sách Khách Hàng ({filteredCustomers.length})</span>
              </h2>

              {/* Tìm kiếm */}
              <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E2E8E5] px-3.5 py-2.5 rounded-2xl w-full sm:max-w-xs shadow-sm">
                <Search size={16} className="text-[#93A39F]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên hoặc ngày sinh..."
                  className="bg-transparent border-none outline-none text-xs text-[#2D3E3A] w-full"
                />
              </div>
            </div>

            {/* Bảng Danh Sách */}
            {loadingCustomers ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#267D71]" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto card-surface rounded-3xl border-[#E2E8E5] shadow-sm">
                <table className="w-full border-collapse text-left text-sm text-[#2D3E3A]">
                  <thead className="bg-[#EEF5F3] text-xs font-bold uppercase tracking-wider text-[#013E37] border-b border-[#E2E8E5]">
                    <tr>
                      <th className="px-6 py-4">Tên Khách Hàng</th>
                      <th className="px-6 py-4">Ngày Sinh</th>
                      <th className="px-6 py-4 text-center">ĐĐ</th>
                      <th className="px-6 py-4 text-center">SM</th>
                      <th className="px-6 py-4 text-center">LH</th>
                      <th className="px-6 py-4 text-center">Trạng Thái Tier</th>
                      <th className="px-6 py-4 text-center">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-[#93A39F] italic">
                          Không tìm thấy khách hàng nào khớp.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAF8F5] transition-all">
                          <td className="px-6 py-4 font-bold text-[#0D2B26]">
                            {c.last_name} {c.first_name}
                          </td>
                          <td className="px-6 py-4 text-[#5F736E]">{c.dob}</td>
                          <td className="px-6 py-4 text-center text-[#013E37] font-bold font-mono">{c.map?.life_path}</td>
                          <td className="px-6 py-4 text-center text-[#267D71] font-bold font-mono">{c.map?.expression}</td>
                          <td className="px-6 py-4 text-center text-[#8C6A81] font-bold font-mono">{c.map?.heart_desire}</td>
                          
                          {/* Phân cấp thanh toán (Nhấn để thay đổi thủ công) */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleTier(c.id, c.unlockedTier || 0)}
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                                c.unlockedTier === 2 
                                  ? 'bg-[#FFEFB3] border border-[#F9E79F] text-[#013E37]'
                                  : c.unlockedTier === 1
                                  ? 'bg-[#EEF5F3] border border-[#267D71]/30 text-[#267D71]'
                                  : 'bg-[#FAF8F5] border border-[#E2E8E5] text-[#93A39F]'
                              }`}
                            >
                              {c.unlockedTier === 2 ? (
                                <><Unlock size={10} /> Tier 2 (Full)</>
                              ) : c.unlockedTier === 1 ? (
                                <><Unlock size={10} /> Tier 1 (Challenges)</>
                              ) : (
                                <><Lock size={10} /> Tier 0 (Free)</>
                              )}
                            </button>
                          </td>
                          
                          {/* Hành động */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setSelectedCustomerForMap(c)}
                              className="p-2 rounded-xl bg-[#EEF5F3] border border-[#267D71]/20 text-[#013E37] hover:bg-[#E2EFEA] transition-all"
                              title="Xem chi tiết Bản đồ"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TẢN 17 CHỈ SỐ */}
        {activeSubTab === 'indicators' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26] mb-6 flex items-center gap-2">
              <FileText className="text-[#267D71]" />
              <span>Quản Lý Định Nghĩa 17 Chỉ Số</span>
            </h2>

            <form onSubmit={handleSaveIndicator} className="card-surface p-7 rounded-3xl border-[#E2E8E5] space-y-6 shadow-sm">
              <div>
                <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">Chọn Chỉ số biên tập</label>
                <select
                  value={selectedIndicatorForEdit}
                  onChange={(e) => setSelectedIndicatorForEdit(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-2.5 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                >
                  {indicators.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>

              {loadingIndicators ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#267D71]" size={24} />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">
                    Định nghĩa chung của Chỉ số
                  </label>
                  <textarea
                    required
                    value={indicatorDesc}
                    onChange={(e) => setIndicatorDesc(e.target.value)}
                    rows={6}
                    placeholder="Mô tả định nghĩa chung của chỉ số..."
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                  />
                </div>
              )}

              {indicatorStatus && (
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                  indicatorStatus.includes('thành công') 
                    ? 'bg-[#EEF5F3] border-[#267D71]/30 text-[#013E37]' 
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}>
                  <AlertCircle size={16} />
                  {indicatorStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={savingIndicator || loadingIndicators}
                className="px-6 py-3.5 rounded-2xl btn-primary font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Save size={16} />
                <span>{savingIndicator ? 'Đang lưu...' : 'Lưu Định Nghĩa'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TẢN TỪ KHÓA & LUẬN GIẢI CON SỐ */}
        {activeSubTab === 'keywords' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26] mb-6 flex items-center gap-2">
              <Key className="text-[#267D71]" />
              <span>Biên Tập Từ Khóa & Luận Giải Cho Từng Con Số</span>
            </h2>

            <form onSubmit={handleSaveKeywords} className="card-surface p-7 rounded-3xl border-[#E2E8E5] space-y-6 shadow-sm">
              
              {/* Chọn Chỉ số và Con số */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">Chỉ số</label>
                  <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-2.5 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                  >
                    {indicators.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">Con số</label>
                  <select
                    value={selectedNumber}
                    onChange={(e) => setSelectedNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-2.5 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loadingKeywords ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#267D71]" size={24} />
                </div>
              ) : (
                <>
                  {/* Từ khóa cốt lõi */}
                  <div>
                    <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">
                      Các từ khóa tính cách cốt lõi (Phân tách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      required
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Ví dụ: Độc lập, tiên phong, quyết đoán, cái tôi lớn"
                      className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                    />
                  </div>

                  {/* Nguyên lý hành động */}
                  <div>
                    <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">
                      Nguyên lý hành động & Bài học phát triển
                    </label>
                    <textarea
                      required
                      value={principles}
                      onChange={(e) => setPrinciples(e.target.value)}
                      rows={3}
                      placeholder="Mô tả nguyên lý cốt lõi của con số này dưới góc độ tâm lý hành vi..."
                      className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71]"
                    />
                  </div>

                  {/* Bài luận giải chi tiết */}
                  <div>
                    <label className="text-xs font-bold text-[#0D2B26] block mb-1.5">
                      Bài luận giải chi tiết (Dữ liệu nội dung tra cứu chuẩn)
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={12}
                      placeholder="Nội dung bài luận giải chi tiết đầy đủ của con số..."
                      className="w-full bg-[#FFFFFF] border border-[#E2E8E5] rounded-2xl px-4 py-3 text-xs text-[#2D3E3A] outline-none focus:border-[#267D71] font-sans leading-relaxed"
                    />
                  </div>
                </>
              )}

              {keywordStatus && (
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                  keywordStatus.includes('thành công') 
                    ? 'bg-[#EEF5F3] border-[#267D71]/30 text-[#013E37]' 
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}>
                  <AlertCircle size={16} />
                  {keywordStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={savingKeywords || loadingKeywords}
                className="px-6 py-3.5 rounded-2xl btn-primary font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Save size={16} />
                <span>{savingKeywords ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
              </button>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}

