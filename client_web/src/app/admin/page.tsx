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
    const dob = c.dob.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || dob.includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06040A]">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  // TỪ CHỐI TRUY CẬP NẾU KHÔNG PHẢI ADMIN
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06040A] px-4">
        <div className="glass-card p-8 rounded-2xl text-center max-w-sm border-rose-500/20">
          <AlertCircle className="text-rose-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-rose-300 mb-2">Từ Chối Truy Cập</h2>
          <p className="text-purple-300 text-sm mb-6">
            Bạn không có quyền hạn Admin để truy cập trang quản trị này.
          </p>
          <a href="/" className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all inline-block">
            Quay về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  // NẾU CHỌN XEM BẢN ĐỒ CHI TIẾT CỦA KHÁCH HÀNG
  if (selectedCustomerForMap) {
    return (
      <div className="min-h-screen bg-[#06040A] py-8">
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <button 
            onClick={() => setSelectedCustomerForMap(null)}
            className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-all"
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#06040A]">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-purple-950/20 border-r border-purple-500/10 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Settings className="text-amber-400" size={24} />
          <span className="font-extrabold text-lg text-white font-serif">CMS Pythagoras</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'customers' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15' 
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Users size={18} />
            Khách Hàng
          </button>

          <button
            onClick={() => setActiveSubTab('indicators')}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'indicators' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15' 
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <FileText size={18} />
            17 Chỉ Số
          </button>
          
          <button
            onClick={() => setActiveSubTab('keywords')}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 font-semibold transition-all ${
              activeSubTab === 'keywords' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/15' 
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Key size={18} />
            Từ Khóa & Luận Giải
          </button>

          <a
            href="/"
            className="w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 font-semibold text-purple-300 hover:text-white hover:bg-purple-950/40 mt-10 border-t border-purple-500/5 pt-6"
          >
            <ArrowLeft size={18} />
            Quay về Web
          </a>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-8">
        
        {/* TẢN KHÁCH HÀNG */}
        {activeSubTab === 'customers' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                <Users className="text-purple-400" />
                Danh Sách Khách Hàng ({filteredCustomers.length})
              </h2>

              {/* Tìm kiếm */}
              <div className="flex items-center gap-2 bg-black/40 border border-purple-500/10 px-3 py-2 rounded-xl w-full sm:max-w-xs">
                <Search size={16} className="text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên hoặc ngày sinh..."
                  className="bg-transparent border-none outline-none text-sm text-purple-200 w-full"
                />
              </div>
            </div>

            {/* Bảng Danh Sách */}
            {loadingCustomers ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-purple-500" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto glass-card rounded-2xl border-purple-500/10">
                <table className="w-full border-collapse text-left text-sm text-purple-200">
                  <thead className="bg-purple-950/30 text-xs font-bold uppercase tracking-wider text-purple-300 border-b border-purple-500/10">
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
                  <tbody className="divide-y divide-purple-500/5">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-purple-400/50 italic">
                          Không tìm thấy khách hàng nào khớp.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-purple-950/10 transition-all">
                          <td className="px-6 py-4 font-bold text-white">
                            {c.last_name} {c.first_name}
                          </td>
                          <td className="px-6 py-4">{c.dob}</td>
                          <td className="px-6 py-4 text-center text-amber-400 font-bold">{c.map?.life_path}</td>
                          <td className="px-6 py-4 text-center text-purple-300 font-bold">{c.map?.expression}</td>
                          <td className="px-6 py-4 text-center text-rose-300 font-bold">{c.map?.heart_desire}</td>
                          
                          {/* Phân cấp thanh toán (Nhấn để thay đổi thủ công) */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleTier(c.id, c.unlockedTier || 0)}
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                                c.unlockedTier === 2 
                                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                                  : c.unlockedTier === 1
                                  ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
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
                              className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all"
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
            <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
              <FileText className="text-purple-400" />
              Quản Lý Định Nghĩa 17 Chỉ Số
            </h2>

            <form onSubmit={handleSaveIndicator} className="glass-card p-6 rounded-2xl border-purple-500/10 space-y-6">
              <div>
                <label className="text-xs font-semibold text-purple-300 block mb-1">Chọn Chỉ số biên tập</label>
                <select
                  value={selectedIndicatorForEdit}
                  onChange={(e) => setSelectedIndicatorForEdit(e.target.value)}
                  className="w-full bg-black/60 border border-purple-500/10 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none"
                >
                  {indicators.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>

              {loadingIndicators ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-purple-500" size={24} />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-purple-300 block mb-1">
                    Định nghĩa chung của Chỉ số
                  </label>
                  <textarea
                    required
                    value={indicatorDesc}
                    onChange={(e) => setIndicatorDesc(e.target.value)}
                    rows={6}
                    placeholder="Mô tả định nghĩa chung của chỉ số..."
                    className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {indicatorStatus && (
                <div className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${
                  indicatorStatus.includes('thành công') 
                    ? 'bg-emerald-950/20 border-emerald-500/10 text-emerald-400' 
                    : 'bg-rose-950/20 border-rose-500/10 text-rose-400'
                }`}>
                  <AlertCircle size={16} />
                  {indicatorStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={savingIndicator || loadingIndicators}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save size={18} />
                {savingIndicator ? 'Đang lưu...' : 'Lưu Định Nghĩa'}
              </button>
            </form>
          </div>
        )}

        {/* TẢN TỪ KHÓA & LUẬN GIẢI CON SỐ */}
        {activeSubTab === 'keywords' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
              <Key className="text-purple-400" />
              Biên Tập Từ Khóa & Luận Giải Cho Từng Con Số
            </h2>

            <form onSubmit={handleSaveKeywords} className="glass-card p-6 rounded-2xl border-purple-500/10 space-y-6">
              
              {/* Chọn Chỉ số và Con số */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-purple-300 block mb-1">Chỉ số</label>
                  <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className="w-full bg-black/60 border border-purple-500/10 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none"
                  >
                    {indicators.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-purple-300 block mb-1">Con số</label>
                  <select
                    value={selectedNumber}
                    onChange={(e) => setSelectedNumber(e.target.value)}
                    className="w-full bg-black/60 border border-purple-500/10 rounded-xl px-3 py-2 text-sm text-purple-100 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loadingKeywords ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-purple-500" size={24} />
                </div>
              ) : (
                <>
                  {/* Từ khóa cốt lõi */}
                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1">
                      Các từ khóa tính cách cốt lõi (Phân tách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      required
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Ví dụ: Độc lập, tiên phong, quyết đoán, cái tôi lớn"
                      className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Nguyên lý hành động */}
                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1">
                      Nguyên lý hành động & Bài học phát triển
                    </label>
                    <textarea
                      required
                      value={principles}
                      onChange={(e) => setPrinciples(e.target.value)}
                      rows={3}
                      placeholder="Mô tả nguyên lý cốt lõi của con số này dưới góc độ tâm lý hành vi..."
                      className="w-full bg-black/40 border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Bài luận giải chi tiết */}
                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1">
                      Bài luận giải chi tiết (Nội dung RAG cho AI tham chiếu)
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={12}
                      placeholder="Nội dung bài luận giải chi tiết đầy đủ của con số..."
                      className="w-full bg-[#0d0914] border border-purple-500/15 rounded-xl px-4 py-3 text-sm text-purple-200 outline-none focus:border-purple-500 font-sans leading-relaxed"
                    />
                  </div>
                </>
              )}

              {keywordStatus && (
                <div className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${
                  keywordStatus.includes('thành công') 
                    ? 'bg-emerald-950/20 border-emerald-500/10 text-emerald-400' 
                    : 'bg-rose-950/20 border-rose-500/10 text-rose-400'
                }`}>
                  <AlertCircle size={16} />
                  {keywordStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={savingKeywords || loadingKeywords}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save size={18} />
                {savingKeywords ? 'Đang lưu...' : 'Lưu Cấu Hình'}
              </button>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}
