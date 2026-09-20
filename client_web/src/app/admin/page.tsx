'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { db } from '@/lib/firebase';
import { 
  collection, query, getDocs, doc, updateDoc, setDoc, getDoc, 
  deleteDoc, writeBatch 
} from 'firebase/firestore';
import { ReportDashboard } from '@/components/ReportDashboard';
import rawKnowledgeBase from '@/lib/knowledge/knowledge_base_252.json';
import { 
  Users, Key, Settings, Loader2, Lock, Unlock, Eye, FileText, 
  Search, Edit, Save, ArrowLeft, RefreshCw, AlertCircle, CreditCard, 
  CheckCircle2, Clock, XCircle, ShieldCheck, Home, Plus, Trash2, 
  Sparkles, DollarSign, TrendingUp, Filter, Check, Award, Database, 
  UploadCloud, CheckCheck, Package, Tag, Layers, ToggleLeft, ToggleRight,
  Gift, CheckSquare, Square, Crown, Briefcase, Star
} from 'lucide-react';
import { 
  PricingPlan, SYSTEM_FEATURES, DEFAULT_PRICING_PLANS, 
  getPricingPlans, savePricingPlan, deletePricingPlan, 
  initializeDefaultPricingPlans, FeatureKey 
} from '@/lib/pricingEngine';

const knowledgeBase = rawKnowledgeBase as Record<string, any>;

// DANH SÁCH MẶC ĐỊNH 17 CHỈ SỐ PYTHAGORAS ĐẦY ĐỦ VÀ CHUẨN XÁC
export const DEFAULT_INDICATORS = [
  { 
    id: 'life_path', 
    nameVi: 'Đường Đời (Số Chủ Đạo)', 
    nameEn: 'Life Path', 
    description: 'Chỉ số quan trọng nhất trong bản đồ, đại diện cho bài học lớn nhất, con đường phát triển cá nhân và sứ mệnh cốt lõi xuyên suốt cuộc đời bạn. Nó cho biết bạn sinh ra để trở thành ai và cần rèn luyện năng lực gì.' 
  },
  { 
    id: 'expression', 
    nameVi: 'Sứ Mệnh (Vận Mệnh)', 
    nameEn: 'Expression / Destiny', 
    description: 'Chỉ số biểu thị mục đích sống, năng lực bẩm sinh và cách thức bạn hiện thực hóa các mục tiêu lớn trong cuộc đời. Nó cho biết phương tiện bạn sử dụng để đi trên con đường đời.' 
  },
  { 
    id: 'heart_desire', 
    nameVi: 'Khát Khao Tâm Hồn (Linh Hồn)', 
    nameEn: 'Soul Urge / Heart Desire', 
    description: 'Đại diện cho động lực thầm kín, khao khát nội tâm sâu sắc nhất và những gì thực sự mang lại hạnh phúc, bình an và thỏa mãn cho tâm hồn bạn.' 
  },
  { 
    id: 'personality', 
    nameVi: 'Nhân Cách (Ấn Tượng)', 
    nameEn: 'Personality', 
    description: 'Cách thế giới bên ngoài nhìn nhận về bạn, phong thái đối nhân xử thế, vỏ bọc giao tiếp và ấn tượng đầu tiên bạn tạo dựng với mọi người.' 
  },
  { 
    id: 'birthday', 
    nameVi: 'Ngày Sinh (Tài Năng Thiên Bẩm)', 
    nameEn: 'Birthday Number', 
    description: 'Món quà năng lực đặc biệt và tài năng tự nhiên giúp hỗ trợ bạn trực tiếp trên hành trình đường đời và vượt qua các trở ngại công việc.' 
  },
  { 
    id: 'maturity', 
    nameVi: 'Trưởng Thành (Thành Tựu)', 
    nameEn: 'Maturity Number', 
    description: 'Năng lượng sẽ bộc lộ mạnh mẽ nhất từ sau tuổi 35-40, chỉ dẫn hướng đi vững chắc, đỉnh cao thành tựu cho nửa sau cuộc đời bạn.' 
  },
  { 
    id: 'balance', 
    nameVi: 'Cân Bằng', 
    nameEn: 'Balance Number', 
    description: 'Chỉ dẫn cách bạn lấy lại thăng bằng tâm lý và giải quyết xung đột khi đối mặt với khủng hoảng, căng thẳng hoặc biến cố bất ngờ.' 
  },
  { 
    id: 'rational_thought', 
    nameVi: 'Tư Duy Lý Trí', 
    nameEn: 'Rational Thought', 
    description: 'Cách thức bộ não bạn tiếp nhận thông tin, xử lý dữ liệu, phân tích tình huống và đưa ra các quyết định logic trong công việc.' 
  },
  { 
    id: 'subconscious_confidence', 
    nameVi: 'Sức Mạnh Tiềm Thức', 
    nameEn: 'Subconscious Confidence', 
    description: 'Mức độ tự tin nội tại và phản xạ tự nhiên của bạn khi đối mặt với những tình huống đột ngột, hiểm nguy hoặc áp lực bất ngờ.' 
  },
  { 
    id: 'lpe_bridge', 
    nameVi: 'Cầu Nối Đường Đời - Sứ Mệnh', 
    nameEn: 'LPE Bridge', 
    description: 'Chỉ số cầu nối giải tỏa nút thắt, giúp kết nối nhịp nhàng giữa bài học đường đời và mục tiêu sứ mệnh, tránh sự phân tâm mâu thuẫn.' 
  },
  { 
    id: 'hdp_bridge', 
    nameVi: 'Cầu Nối Tâm Hồn - Nhân Cách', 
    nameEn: 'HDP Bridge', 
    description: 'Cầu nối giúp dung hòa giữa khao khát nội tâm thầm kín và phong thái biểu hiện ra bên ngoài, giúp bạn sống chân thật và tự tin.' 
  },
  { 
    id: 'hidden_passion', 
    nameVi: 'Đam Mê Ẩn Giấu', 
    nameEn: 'Hidden Passion', 
    description: 'Những sở thích và đam mê tiềm ẩn có thể chuyển hóa thành tài năng vượt trội và thế mạnh cạnh tranh nếu được tôi luyện đúng cách.' 
  },
  { 
    id: 'karmic_lessons', 
    nameVi: 'Bài Học Nợ Nghiệp (Thiếu Hụt)', 
    nameEn: 'Karmic Lessons', 
    description: 'Các con số bài học thiếu hụt từ tiền kiếp hoặc thời thơ ấu cần được rèn luyện, bổ sung và bù đắp trong kiếp sống này.' 
  },
  { 
    id: 'challenge', 
    nameVi: 'Thách Thức 4 Giai Đoạn', 
    nameEn: 'Challenges', 
    description: 'Các rào cản và thử thách tâm lý cụ thể mà bạn cần rèn luyện vượt qua trong 4 chặng đường phát triển lớn của cuộc đời.' 
  },
  { 
    id: 'pinnacle', 
    nameVi: 'Đỉnh Cao 4 Kim Tự Tháp', 
    nameEn: 'Pinnacles', 
    description: 'Các cột mốc cơ hội và thành tựu vàng nở rộ trong 4 đỉnh cao cuộc đời theo chu kỳ 9 năm của Pythagoras.' 
  },
  { 
    id: 'year', 
    nameVi: 'Năm Cá Nhân (Vận Niên)', 
    nameEn: 'Personal Year', 
    description: 'Nhịp điệu năng lượng của từng năm giúp bạn hoạch định chiến lược đầu tư, mở rộng sự nghiệp, học tập hoặc thu hoạch phù hợp.' 
  },
  { 
    id: 'month', 
    nameVi: 'Tháng Cá Nhân', 
    nameEn: 'Personal Month', 
    description: 'Dự báo năng lượng vi mô từng tháng để tối ưu hóa kế hoạch hành động ngắn hạn, đàm phán và triển khai công việc hiệu quả.' 
  }
];

export default function AdminDashboard() {
  const { user, isAdmin, loading, loginWithGoogle, logout, grantAdminAccess } = useAuth();
  const { t } = useTranslation();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'customers' | 'users' | 'packages' | 'indicators' | 'keywords'>('orders');
  
  // State Quản lý Đơn hàng & Giao dịch
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'PAID' | 'PENDING' | 'CANCELLED'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // State Quản Lý Gói Dịch Vụ & Platform Builder
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(DEFAULT_PRICING_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planFormStatus, setPlanFormStatus] = useState<string | null>(null);

  // State Quản lý khách hàng
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomerForMap, setSelectedCustomerForMap] = useState<any | null>(null);

  // State Quản lý người dùng (Users)
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // State quản lý 17 chỉ số
  const [indicators, setIndicators] = useState<any[]>(DEFAULT_INDICATORS);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [selectedIndicatorForEdit, setSelectedIndicatorForEdit] = useState<string>('life_path');
  const [indicatorDesc, setIndicatorDesc] = useState('');
  const [savingIndicator, setSavingIndicator] = useState(false);
  const [indicatorStatus, setIndicatorStatus] = useState<string | null>(null);
  const [seedingIndicators, setSeedingIndicators] = useState(false);

  // State quản lý Từ khóa & Luận giải
  const [selectedIndicator, setSelectedIndicator] = useState('life_path');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [keywords, setKeywords] = useState('');
  const [principles, setPrinciples] = useState('');
  const [description, setDescription] = useState('');
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [savingKeywords, setSavingKeywords] = useState(false);
  const [keywordStatus, setKeywordStatus] = useState<string | null>(null);
  const [seedingKeywords, setSeedingKeywords] = useState(false);

  // Tải danh sách đơn hàng
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, 'orders'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => {
        const tA = new Date(a.createdAt || 0).getTime() || (a.created_at?.seconds * 1000) || 0;
        const tB = new Date(b.createdAt || 0).getTime() || (b.created_at?.seconds * 1000) || 0;
        return tB - tA;
      });
      setOrders(list);
    } catch (err) {
      console.error('Lỗi tải danh sách đơn hàng:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Tải danh sách khách hàng
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const q = query(collection(db, 'customers'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => {
        const tA = new Date(a.createdAt || 0).getTime() || (a.created_at?.seconds * 1000) || 0;
        const tB = new Date(b.createdAt || 0).getTime() || (b.created_at?.seconds * 1000) || 0;
        return tB - tA;
      });
      setCustomers(list);
    } catch (err) {
      console.error('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Tải danh sách Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsersList(list);
    } catch (err) {
      console.error('Lỗi tải danh sách users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Tải 17 chỉ số từ Firestore (Nếu Firestore trống thì tự nạp từ DEFAULT_INDICATORS)
  const fetchIndicators = async () => {
    setLoadingIndicators(true);
    try {
      const snapshot = await getDocs(collection(db, 'indicators'));
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Ghép giữa DEFAULT_INDICATORS và Firestore để luôn đầy đủ
        const merged = DEFAULT_INDICATORS.map(def => {
          const found = firestoreList.find(f => f.id === def.id);
          return found ? { ...def, ...found } : def;
        });
        setIndicators(merged);
      } else {
        setIndicators(DEFAULT_INDICATORS);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách chỉ số từ Firestore, sử dụng mặc định:', err);
      setIndicators(DEFAULT_INDICATORS);
    } finally {
      setLoadingIndicators(false);
    }
  };

  // Tải từ khóa và nguyên lý cho 1 con số cụ thể
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
        // Tra cứu dữ liệu từ knowledgeBase 252 số
        const kbItem = knowledgeBase[docId] || knowledgeBase[`${selectedIndicator}_${selectedNumber}`];
        if (kbItem) {
          const positiveKeywords = Array.isArray(kbItem.positive_traits) ? kbItem.positive_traits.join(', ') : '';
          const initialKeywords = positiveKeywords || kbItem.core_energy || `Năng lượng số ${selectedNumber}`;
          const initialPrinciples = kbItem.core_energy || (Array.isArray(kbItem.growth_actions) ? kbItem.growth_actions.join('\n') : '') || '';
          const initialDesc = kbItem.full_description || kbItem.career_guidance || kbItem.relationships || '';
          
          setKeywords(initialKeywords);
          setPrinciples(initialPrinciples);
          setDescription(initialDesc);
        } else {
          setKeywords(`Năng lượng số ${selectedNumber}, Tự chủ, Phát triển bản thân`);
          setPrinciples(`Nguyên lý vận hành của con số ${selectedNumber} trong chỉ số ${selectedIndicator}`);
          setDescription(`Luận giải chi tiết và bài học chuyển hóa cho con số ${selectedNumber}.`);
        }
      }
    } catch (err) {
      console.error('Lỗi tải từ khóa:', err);
    } finally {
      setLoadingKeywords(false);
    }
  };

  // NẠP TẤT CẢ 17 CHỈ SỐ LÊN FIRESTORE
  const handleSeedAllIndicators = async () => {
    if (!confirm('Khởi tạo và đồng bộ toàn bộ 17 chỉ số Pythagoras mặc định lên Firestore?')) return;
    setSeedingIndicators(true);
    try {
      const batch = writeBatch(db);
      for (const ind of DEFAULT_INDICATORS) {
        const ref = doc(db, 'indicators', ind.id);
        batch.set(ref, {
          nameVi: ind.nameVi,
          nameEn: ind.nameEn,
          description: ind.description,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      await batch.commit();
      alert('Đã đồng bộ thành công 17 chỉ số Pythagoras lên cơ sở dữ liệu!');
      fetchIndicators();
    } catch (err: any) {
      alert('Lỗi đồng bộ: ' + err.message);
    } finally {
      setSeedingIndicators(false);
    }
  };

  // NẠP TOÀN BỘ 252+ LUẬN GIẢI CON SỐ TỪ KNOWLEDGE BASE LÊN FIRESTORE
  const handleSeedAllKeywords = async () => {
    if (!confirm('Bạn có chắc muốn đồng bộ toàn bộ cơ sở tri thức 252+ luận giải con số lên Firestore?')) return;
    setSeedingKeywords(true);
    try {
      const entries = Object.entries(knowledgeBase);
      // Chia thành các đợt 400 docs để không vượt quá giới hạn batch Firestore 500
      let batch = writeBatch(db);
      let count = 0;
      for (const [key, item] of entries) {
        const ref = doc(db, 'indicator_numbers', key);
        const posKw = Array.isArray(item.positive_traits) ? item.positive_traits.join(', ') : '';
        batch.set(ref, {
          indicator: item.indicator_code || key.split('_')[0],
          number: item.number || parseInt(key.split('_')[1], 10) || 1,
          keywords: posKw || item.core_energy || '',
          principles: item.core_energy || '',
          description: item.full_description || item.career_guidance || '',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        count++;

        if (count % 400 === 0) {
          await batch.commit();
          batch = writeBatch(db);
        }
      }
      await batch.commit();
      alert(`Đã nạp thành công ${count} bộ luận giải con số lên Firestore!`);
      fetchKeywords();
    } catch (err: any) {
      alert('Lỗi nạp tri thức: ' + err.message);
    } finally {
      setSeedingKeywords(false);
    }
  };

  // Tải danh sách Gói dịch vụ từ Pricing Engine
  const fetchPricingPlans = async () => {
    setLoadingPlans(true);
    try {
      const list = await getPricingPlans();
      setPricingPlans(list);
    } catch (err) {
      console.error('Lỗi tải danh sách gói:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Lưu hoặc cập nhật Gói dịch vụ
  const handleSavePricingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      setPlanFormStatus('Đang lưu gói dịch vụ...');
      await savePricingPlan(editingPlan);
      setPlanFormStatus('✅ Đã lưu cấu hình gói thành công!');
      fetchPricingPlans();
      setTimeout(() => {
        setIsPlanModalOpen(false);
        setPlanFormStatus(null);
      }, 800);
    } catch (err) {
      console.error('Lỗi lưu gói:', err);
      setPlanFormStatus('❌ Lỗi khi lưu gói!');
    }
  };

  // Xóa Gói dịch vụ
  const handleDeletePricingPlan = async (planId: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa gói [${planId}] khỏi hệ thống?`)) return;
    try {
      await deletePricingPlan(planId);
      fetchPricingPlans();
    } catch (err) {
      console.error('Lỗi xóa gói:', err);
    }
  };

  // Khôi phục toàn bộ bảng giá chuẩn 3 trục
  const handleResetDefaultPricingPlans = async () => {
    if (!confirm('Khôi phục toàn bộ Bảng giá Chuẩn 3 Trục (Cá nhân 39k, Gia đình 149k, Nạp sỉ & Hội viên)? Toàn bộ cấu hình tùy biến sẽ được ghi đè.')) return;
    try {
      setLoadingPlans(true);
      await initializeDefaultPricingPlans();
      await fetchPricingPlans();
      alert('Đã khôi phục thành công bảng giá chuẩn 3 trục lên Firestore!');
    } catch (err) {
      console.error('Lỗi khôi phục bảng giá:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Bật/tắt trạng thái hiển thị của gói
  const handleTogglePlanActive = async (plan: PricingPlan) => {
    try {
      const updated = { ...plan, isActive: !plan.isActive };
      await savePricingPlan(updated);
      setPricingPlans(prev => prev.map(p => p.id === plan.id ? updated : p));
    } catch (err) {
      console.error('Lỗi đổi trạng thái gói:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeSubTab === 'orders') fetchOrders();
      else if (activeSubTab === 'customers') fetchCustomers();
      else if (activeSubTab === 'users') fetchUsers();
      else if (activeSubTab === 'packages') fetchPricingPlans();
      else if (activeSubTab === 'indicators') fetchIndicators();
      else if (activeSubTab === 'keywords') {
        fetchIndicators();
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

  // DUYỆT / KÍCH HOẠT NHANH ĐƠN HÀNG THỦ CÔNG
  const handleApproveOrder = async (order: any) => {
    if (!confirm(`Xác nhận kích hoạt đơn hàng #${order.orderCode || order.order_code} (${(order.amount || 0).toLocaleString('vi-VN')} đ)?`)) {
      return;
    }
    try {
      const orderRef = doc(db, 'orders', (order.orderCode || order.order_code || order.id).toString());
      const paidAt = new Date().toISOString();
      await updateDoc(orderRef, {
        status: 'PAID',
        completedAt: paidAt,
        updatedAt: paidAt,
        approvedBy: user?.email || 'admin',
      });

      // Mở khóa customer nếu có
      if (order.customerId || order.customer_id) {
        const custId = order.customerId || order.customer_id;
        const custRef = doc(db, 'customers', custId);
        await updateDoc(custRef, {
          unlockedTier: 3,
          updatedAt: paidAt,
        });
      }

      // Cộng credits / subscription cho user nếu có
      if (order.userId || order.user_id) {
        const uid = order.userId || order.user_id;
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        const curCredits = userSnap.exists() ? (userSnap.data()?.credits || 0) : 0;
        const addedCredits = order.creditsGranted || order.credits || 1;
        await setDoc(userRef, {
          credits: curCredits + addedCredits,
          updatedAt: paidAt,
        }, { merge: true });
      }

      alert(`Đã kích hoạt thành công đơn hàng #${order.orderCode || order.order_code}!`);
      fetchOrders();
    } catch (err: any) {
      console.error('Lỗi khi duyệt đơn hàng:', err);
      alert('Không thể duyệt đơn hàng: ' + err.message);
    }
  };

  // HỦY ĐƠN HÀNG
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang ĐÃ HỦY?`)) return;
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
      });
      fetchOrders();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // CẬP NHẬT CREDITS CHO USER
  const handleUpdateCredits = async (userId: string, newCredits: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        credits: newCredits,
        updatedAt: new Date().toISOString(),
      });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, credits: newCredits } : u));
    } catch (err: any) {
      alert('Lỗi cập nhật lượt: ' + err.message);
    }
  };

  // THAY ĐỔI VAI TRÒ USER (Role)
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`Đã đổi vai trò user thành: ${newRole}`);
    } catch (err: any) {
      alert('Lỗi đổi vai trò: ' + err.message);
    }
  };

  // Cập nhật mô tả chỉ số
  const handleSaveIndicator = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingIndicator(true);
    setIndicatorStatus(null);
    try {
      const docRef = doc(db, 'indicators', selectedIndicatorForEdit);
      const cur = indicators.find(i => i.id === selectedIndicatorForEdit);
      await setDoc(docRef, {
        nameVi: cur?.nameVi || selectedIndicatorForEdit,
        nameEn: cur?.nameEn || '',
        description: indicatorDesc,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setIndicatorStatus('Lưu thành công vào Firestore!');
      setIndicators(prev => prev.map(ind => 
        ind.id === selectedIndicatorForEdit ? { ...ind, description: indicatorDesc } : ind
      ));
    } catch (err: any) {
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
        keywords,
        principles,
        description,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setKeywordStatus('Lưu thành công vào Firestore!');
    } catch (err: any) {
      setKeywordStatus('Lỗi: ' + err.message);
    } finally {
      setSavingKeywords(false);
    }
  };

  // Mở khóa thủ công cấp độ báo cáo (Tier) cho khách hàng
  const handleToggleTier = async (customerId: string, currentTier: number) => {
    const nextTier = currentTier >= 3 ? 0 : currentTier + 1;
    try {
      const docRef = doc(db, 'customers', customerId);
      await updateDoc(docRef, {
        unlockedTier: nextTier,
        updatedAt: new Date().toISOString()
      });
      setCustomers(prev => prev.map(c => 
        c.id === customerId ? { ...c, unlockedTier: nextTier } : c
      ));
    } catch (err) {
      alert('Không thể cập nhật phân cấp');
    }
  };

  // Xóa khách hàng
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ khách hàng này khỏi hệ thống?')) return;
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (err: any) {
      alert('Lỗi xóa khách hàng: ' + err.message);
    }
  };

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter(o => {
    const isPaid = o.status === 'PAID' || o.status === 'completed';
    const isPending = o.status === 'PENDING' || o.status === 'pending';
    const isCancelled = o.status === 'CANCELLED' || o.status === 'cancelled';

    if (orderFilter === 'PAID' && !isPaid) return false;
    if (orderFilter === 'PENDING' && !isPending) return false;
    if (orderFilter === 'CANCELLED' && !isCancelled) return false;

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const code = (o.orderCode || o.order_code || o.id || '').toLowerCase();
      const email = (o.userEmail || o.user_email || '').toLowerCase();
      const name = (o.planName || o.plan_name || '').toLowerCase();
      return code.includes(q) || email.includes(q) || name.includes(q);
    }
    return true;
  });

  // Lọc danh sách khách hàng
  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.last_name || ''} ${c.first_name || ''} ${c.full_name || ''}`.toLowerCase();
    const dob = (c.dob || '').toLowerCase();
    const q = customerSearchQuery.toLowerCase();
    return fullName.includes(q) || dob.includes(q);
  });

  // Thống kê đơn hàng
  const totalRevenue = orders
    .filter(o => o.status === 'PAID' || o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalPaidOrders = orders.filter(o => o.status === 'PAID' || o.status === 'completed').length;
  const totalPendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#267D71]" size={48} />
      </div>
    );
  }

  // TỪ CHỐI TRUY CẬP NẾU CHƯA ĐĂNG NHẬP / CHƯA CÓ QUYỀN
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
        <div className="card-surface p-8 rounded-3xl text-center max-w-md border border-[#E2E8E5] shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center mx-auto border border-[#F9E79F]">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-[#0D2B26]">Cổng Quản Trị Hệ Thống</h2>
            <p className="text-xs text-[#5F736E] leading-relaxed">
              Khu vực dành riêng cho Quản trị viên điều hành toàn bộ dịch vụ, khách hàng và giao dịch VietQR của Life Maps.
            </p>
          </div>

          {!user ? (
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
              <span>Đăng Nhập Tài Khoản Admin</span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-rose-600 font-semibold">
                Tài khoản <strong className="font-mono">{user.email}</strong> chưa được kích hoạt quyền Admin.
              </p>
              <button
                onClick={async () => {
                  const ok = await grantAdminAccess();
                  if (ok) {
                    alert('Đã cấp quyền Quản trị viên thành công cho tài khoản!');
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-[#013E37] text-[#FFEFB3] text-xs font-bold border border-[#013E37] shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Key size={15} />
                <span>Kích Hoạt Quyền Admin Cho Tài Khoản Này</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <a href="/" className="text-xs text-[#5F736E] hover:text-[#013E37] inline-flex items-center gap-1.5">
              <Home size={14} /> Quay về Trang Chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  // NẾU ĐANG CHỌN XEM BẢN ĐỒ CHI TIẾT CỦA KHÁCH HÀNG
  if (selectedCustomerForMap) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-8">
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <button 
            onClick={() => setSelectedCustomerForMap(null)}
            className="text-sm font-bold text-[#013E37] hover:text-[#267D71] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Quay lại Danh sách Quản trị</span>
          </button>
        </div>
        <ReportDashboard initialCustomer={selectedCustomerForMap} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3E3A] font-sans pb-20">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-[#E2E8E5] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl sm:text-2xl font-bold font-heading text-[#013E37] tracking-tight flex items-center gap-2">
              <span>🔮</span>
              <span>Life Maps Admin</span>
            </a>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEFB3] text-[#013E37] text-[10px] font-extrabold border border-[#F9E79F]">
              MASTER CONTROL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Home size={14} className="text-[#267D71]" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </a>

            <a
              href="/pricing"
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-[#EEF5F3] border border-[#E2E8E5] text-[#2D3E3A] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles size={14} className="text-[#267D71]" />
              <span className="hidden sm:inline">Bảng Giá</span>
            </a>

            <a
              href="/account"
              className="px-3.5 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] border border-[#267D71]/30 text-[#013E37] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Users size={14} className="text-[#267D71]" />
              <span className="hidden sm:inline">Tài Khoản</span>
            </a>

            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-2xl bg-[#FAF8F5] hover:bg-red-50 hover:text-red-700 border border-[#E2E8E5] text-[#5F736E] text-xs font-medium transition-all cursor-pointer"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* STATS OVERVIEW HEADER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-6 rounded-3xl border border-[#E2E8E5] shadow-sm space-y-1">
            <div className="text-[11px] text-[#5F736E] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Doanh Thu VietQR</span>
              <DollarSign size={16} className="text-[#267D71]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#013E37] font-mono">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[11px] text-[#267D71] font-semibold flex items-center gap-1">
              <TrendingUp size={12} /> {totalPaidOrders} giao dịch thành công
            </div>
          </div>

          <div className="card-surface p-6 rounded-3xl border border-[#E2E8E5] shadow-sm space-y-1">
            <div className="text-[11px] text-[#5F736E] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Tổng Số Đơn Hàng</span>
              <CreditCard size={16} className="text-[#013E37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D2B26] font-mono">
              {orders.length}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <Clock size={12} /> {totalPendingOrders} đơn đang chờ thanh toán
            </div>
          </div>

          <div className="card-surface p-6 rounded-3xl border border-[#E2E8E5] shadow-sm space-y-1">
            <div className="text-[11px] text-[#5F736E] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Khách Hàng Tra Cứu</span>
              <FileText size={16} className="text-[#267D71]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D2B26] font-mono">
              {customers.length}
            </div>
            <div className="text-[11px] text-[#5F736E]">Hồ sơ lưu trữ trên hệ thống</div>
          </div>

          <div className="card-surface p-6 rounded-3xl border border-[#E2E8E5] shadow-sm space-y-1">
            <div className="text-[11px] text-[#5F736E] font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Tài Khoản Thành Viên</span>
              <Users size={16} className="text-[#8C6A81]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D2B26] font-mono">
              {usersList.length || '50+'}
            </div>
            <div className="text-[11px] text-[#267D71] font-semibold">Bao gồm Coach VIP & Khách hàng</div>
          </div>
        </div>

        {/* TABS MENU */}
        <div className="flex flex-wrap gap-2 border-b border-[#E2E8E5] pb-3">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'orders'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <CreditCard size={16} />
            <span>Quản Trị Đơn Hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('customers')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'customers'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Users size={16} />
            <span>Hồ Sơ Khách Hàng ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Award size={16} />
            <span>Người Dùng & Phân Quyền ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('packages')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'packages'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Package size={16} />
            <span>Quản Trị Gói Bán Hàng ({pricingPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('indicators')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'indicators'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Settings size={16} />
            <span>Cấu Hình 17 Chỉ Số ({indicators.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('keywords')}
            className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'keywords'
                ? 'bg-[#013E37] text-white shadow-md'
                : 'text-[#5F736E] hover:text-[#013E37] hover:bg-[#EEF5F3]'
            }`}
          >
            <Key size={16} />
            <span>Từ Khóa & Luận Giải</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: QUẢN TRỊ ĐƠN HÀNG & GIAO DỊCH VIETQR */}
        {/* ========================================================================= */}
        {activeSubTab === 'orders' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Danh Sách Giao Dịch & Đơn Hàng VietQR</h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Theo dõi, đối soát và duyệt kích hoạt thủ công các đơn nạp gói của khách hàng.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search box */}
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A39F]" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Tìm mã đơn, email, gói..."
                    className="pl-9 pr-4 py-2 bg-white border border-[#E2E8E5] rounded-xl text-xs focus:outline-none focus:border-[#267D71] w-56"
                  />
                </div>

                {/* Filter buttons */}
                <div className="inline-flex p-1 bg-[#EEF5F3] border border-[#E2E8E5] rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${orderFilter === 'all' ? 'bg-[#013E37] text-white shadow-xs' : 'text-[#5F736E]'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setOrderFilter('PAID')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${orderFilter === 'PAID' ? 'bg-[#013E37] text-white shadow-xs' : 'text-[#5F736E]'}`}
                  >
                    Đã Thu ({totalPaidOrders})
                  </button>
                  <button
                    onClick={() => setOrderFilter('PENDING')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${orderFilter === 'PENDING' ? 'bg-[#013E37] text-white shadow-xs' : 'text-[#5F736E]'}`}
                  >
                    Chờ Thu ({totalPendingOrders})
                  </button>
                </div>

                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EEF5F3] text-[#5F736E] border border-[#E2E8E5] cursor-pointer"
                  title="Tải lại đơn hàng"
                >
                  <RefreshCw size={15} className={loadingOrders ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-[#5F736E]">
                <Loader2 size={32} className="mx-auto animate-spin text-[#267D71] mb-2" />
                <p className="text-xs">Đang tải danh sách đơn hàng...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-[#5F736E] bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E2E8E5]">
                <p className="text-xs">Không tìm thấy đơn hàng nào phù hợp.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8E5] text-[#5F736E] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">Mã Đơn</th>
                      <th className="py-3 px-4">Gói Dịch Vụ</th>
                      <th className="py-3 px-4">Số Tiền</th>
                      <th className="py-3 px-4">Khách Hàng / Email</th>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {filteredOrders.map((o, idx) => {
                      const isPaid = o.status === 'PAID' || o.status === 'completed';
                      const isPending = o.status === 'PENDING' || o.status === 'pending';
                      const createdDate = o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : (o.created_at?.seconds ? new Date(o.created_at.seconds * 1000).toLocaleString('vi-VN') : 'Mới đây');

                      return (
                        <tr key={idx} className="hover:bg-[#EEF5F3]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#013E37]">
                            #{o.orderCode || o.order_code || o.id?.slice(0, 8)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#0D2B26]">
                            {o.planName || o.plan_name || 'Gói Dịch Vụ'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#013E37]">
                            {(o.amount || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0D2B26]">{o.userName || o.user_name || 'Khách hàng'}</div>
                            <div className="text-[11px] text-[#5F736E] font-mono">{o.userEmail || o.user_email || 'Chưa cung cấp'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#5F736E]">
                            {createdDate}
                          </td>
                          <td className="py-3.5 px-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                <CheckCircle2 size={12} /> Đã Thanh Toán
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                <Clock size={12} /> Chờ Thanh Toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                                <XCircle size={12} /> Đã Hủy
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {isPending && (
                              <button
                                onClick={() => handleApproveOrder(o)}
                                className="px-3 py-1.5 rounded-xl btn-primary text-[11px] font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Kích hoạt ngay đơn hàng cho khách"
                              >
                                <Check size={12} />
                                <span>Duyệt Giao Dịch</span>
                              </button>
                            )}
                            {isPending && (
                              <button
                                onClick={() => handleCancelOrder(o.id || o.orderCode)}
                                className="px-2 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold transition-all cursor-pointer"
                                title="Hủy đơn"
                              >
                                Hủy
                              </button>
                            )}
                            {isPaid && (
                              <span className="text-[#267D71] font-semibold text-xs inline-flex items-center gap-1">
                                <Check size={13} /> Hoàn tất
                              </span>
                            )}
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

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN TRỊ HỒ SƠ KHÁCH HÀNG */}
        {/* ========================================================================= */}
        {activeSubTab === 'customers' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Hồ Sơ Khách Hàng Tra Cứu</h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Danh sách khách hàng đã tra cứu thần số học và cấp độ mở khóa báo cáo.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A39F]" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder="Tìm tên, ngày sinh..."
                    className="pl-9 pr-4 py-2 bg-white border border-[#E2E8E5] rounded-xl text-xs focus:outline-none focus:border-[#267D71] w-56"
                  />
                </div>

                <button
                  onClick={fetchCustomers}
                  className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EEF5F3] text-[#5F736E] border border-[#E2E8E5] cursor-pointer"
                  title="Tải lại danh sách"
                >
                  <RefreshCw size={15} className={loadingCustomers ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {loadingCustomers ? (
              <div className="py-12 text-center text-[#5F736E]">
                <Loader2 size={32} className="mx-auto animate-spin text-[#267D71] mb-2" />
                <p className="text-xs">Đang tải danh sách hồ sơ...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-12 text-center text-[#5F736E] bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E2E8E5]">
                <p className="text-xs">Không tìm thấy hồ sơ khách hàng nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8E5] text-[#5F736E] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">Họ và Tên</th>
                      <th className="py-3 px-4">Ngày Sinh</th>
                      <th className="py-3 px-4">Số Chủ Đạo</th>
                      <th className="py-3 px-4">Cấp Độ Báo Cáo</th>
                      <th className="py-3 px-4">Thời Gian Tạo</th>
                      <th className="py-3 px-4 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {filteredCustomers.map((c, idx) => {
                      const tier = c.unlockedTier || 0;
                      const createdDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : (c.created_at?.seconds ? new Date(c.created_at.seconds * 1000).toLocaleDateString('vi-VN') : 'Mới đây');

                      return (
                        <tr key={idx} className="hover:bg-[#EEF5F3]/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0D2B26]">
                            {c.full_name || `${c.last_name || ''} ${c.first_name || ''}`}
                          </td>
                          <td className="py-3.5 px-4 text-[#5F736E] font-mono">
                            {c.dob}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#013E37]">
                            {c.map?.life_path || c.map?.rulingNumber || '7'}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleTier(c.id, tier)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                                tier >= 3 
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : tier === 2
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : tier === 1
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                              title="Bấm để chuyển đổi cấp độ mở khóa Tier"
                            >
                              {tier > 0 ? <Unlock size={11} /> : <Lock size={11} />}
                              <span>{tier >= 3 ? 'Tầng 3 (Toàn diện)' : tier === 2 ? 'Tầng 2 (VIP)' : tier === 1 ? 'Tầng 1 (Cơ bản)' : 'Tier 0 (Free)'}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-[#5F736E]">
                            {createdDate}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedCustomerForMap(c)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF5F3] text-[#013E37] border border-[#E2E8E5] font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            >
                              <Eye size={12} className="text-[#267D71]" />
                              <span>Xem Bản Đồ</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(c.id)}
                              className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 size={13} />
                            </button>
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

        {/* ========================================================================= */}
        {/* TAB 3: QUẢN TRỊ NGƯỜI DÙNG & PHÂN QUYỀN */}
        {/* ========================================================================= */}
        {activeSubTab === 'users' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Danh Sách Tài Khoản & Phân Quyền</h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Quản lý vai trò (Admin, Coach, User) và số lượt bài báo cáo khả dụng của thành viên.
                </p>
              </div>

              <button
                onClick={fetchUsers}
                className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EEF5F3] text-[#5F736E] border border-[#E2E8E5] cursor-pointer"
                title="Tải lại danh sách"
              >
                <RefreshCw size={15} className={loadingUsers ? 'animate-spin' : ''} />
              </button>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center text-[#5F736E]">
                <Loader2 size={32} className="mx-auto animate-spin text-[#267D71] mb-2" />
                <p className="text-xs">Đang tải danh sách tài khoản...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8E5] text-[#5F736E] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">Tài Khoản</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Vai Trò (Role)</th>
                      <th className="py-3 px-4">Số Lượt Báo Cáo (Credits)</th>
                      <th className="py-3 px-4 text-right">Điều Chỉnh Lượt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {usersList.map((u, idx) => (
                      <tr key={idx} className="hover:bg-[#EEF5F3]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0D2B26]">
                          {u.displayName || 'Thành viên'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#5F736E]">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role || 'user'}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="bg-white border border-[#E2E8E5] rounded-xl px-2.5 py-1 text-xs font-bold text-[#013E37] focus:outline-none focus:border-[#267D71]"
                          >
                            <option value="user">User (Khách thường)</option>
                            <option value="coach">Coach (Chuyên gia)</option>
                            <option value="admin">Admin (Quản trị viên)</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-[#013E37] text-sm">
                          {u.credits || 0} lượt
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleUpdateCredits(u.id, (u.credits || 0) + 10)}
                            className="px-2.5 py-1 rounded-lg bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] font-bold text-[11px] border border-[#267D71]/30 cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleUpdateCredits(u.id, (u.credits || 0) + 50)}
                            className="px-2.5 py-1 rounded-lg bg-[#FFEFB3] hover:bg-[#F9E79F] text-[#013E37] font-bold text-[11px] border border-[#F9E79F] cursor-pointer"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleUpdateCredits(u.id, Math.max(0, (u.credits || 0) - 10))}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] cursor-pointer"
                          >
                            -10
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CẤU HÌNH 17 CHỈ SỐ PYTHAGORAS */}
        {/* ========================================================================= */}
        {activeSubTab === 'indicators' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Cấu Hình Mô Tả 17 Chỉ Số Pythagoras</h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Chỉnh sửa định nghĩa học thuyết và nguyên lý vận hành của từng chỉ số trong bản đồ.
                </p>
              </div>

              <button
                onClick={handleSeedAllIndicators}
                disabled={seedingIndicators}
                className="px-4 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] border border-[#267D71]/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Đồng bộ 17 chỉ số mặc định lên Firestore"
              >
                <UploadCloud size={15} className="text-[#267D71]" />
                <span>{seedingIndicators ? 'Đang đồng bộ...' : 'Đồng Bộ 17 Chỉ Số Lên Firestore'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveIndicator} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                  Chọn chỉ số cần biên tập:
                </label>
                <select
                  value={selectedIndicatorForEdit}
                  onChange={(e) => setSelectedIndicatorForEdit(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-[#E2E8E5] text-xs font-semibold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                >
                  {indicators.map(ind => (
                    <option key={ind.id} value={ind.id}>
                      {ind.nameVi || ind.name || ind.id} ({ind.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                  Nội dung mô tả & nguyên lý:
                </label>
                <textarea
                  rows={6}
                  value={indicatorDesc}
                  onChange={(e) => setIndicatorDesc(e.target.value)}
                  placeholder="Nhập phần giải nghĩa tổng quan của chỉ số..."
                  className="w-full p-4 rounded-2xl bg-white border border-[#E2E8E5] text-xs leading-relaxed focus:outline-none focus:border-[#267D71]"
                />
              </div>

              {indicatorStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${indicatorStatus.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {indicatorStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={savingIndicator}
                className="py-3.5 px-6 rounded-2xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save size={15} />
                <span>{savingIndicator ? 'Đang lưu...' : 'Lưu Thay Đổi Chỉ Số'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TỪ KHÓA & LUẬN GIẢI CON SỐ */}
        {/* ========================================================================= */}
        {activeSubTab === 'keywords' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26]">Từ Khóa & Luận Giải Từng Con Số</h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Cập nhật bộ từ khóa năng lượng và nguyên lý số học theo từng con số cụ thể (1-9, 10, 11, 22, 33).
                </p>
              </div>

              <button
                onClick={handleSeedAllKeywords}
                disabled={seedingKeywords}
                className="px-4 py-2 rounded-2xl bg-[#EEF5F3] hover:bg-[#E2EFEA] text-[#013E37] border border-[#267D71]/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Khởi tạo toàn bộ 252+ luận giải con số lên cơ sở dữ liệu"
              >
                <Database size={15} className="text-[#267D71]" />
                <span>{seedingKeywords ? 'Đang nạp dữ liệu...' : 'Nạp Toàn Bộ 252 Luận Giải Lên Firestore'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                  Chỉ số:
                </label>
                <select
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-[#E2E8E5] text-xs font-semibold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                >
                  {indicators.map(ind => (
                    <option key={ind.id} value={ind.id}>
                      {ind.nameVi || ind.name || ind.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                  Con số năng lượng:
                </label>
                <select
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-[#E2E8E5] text-xs font-semibold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33].map(n => (
                    <option key={n} value={n.toString()}>
                      Con số {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingKeywords ? (
              <div className="py-8 text-center text-[#5F736E]">
                <Loader2 size={24} className="mx-auto animate-spin text-[#267D71] mb-2" />
                <p className="text-xs">Đang tải dữ liệu số {selectedNumber}...</p>
              </div>
            ) : (
              <form onSubmit={handleSaveKeywords} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                    Từ khóa trọng tâm (cách nhau bởi dấu phẩy):
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ví dụ: Độc lập, Tiên phong, Lãnh đạo, Tự chủ..."
                    className="w-full p-3 rounded-2xl bg-white border border-[#E2E8E5] text-xs font-semibold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                    Nguyên lý & Năng lượng cốt lõi:
                  </label>
                  <textarea
                    rows={4}
                    value={principles}
                    onChange={(e) => setPrinciples(e.target.value)}
                    placeholder="Nhập nguyên lý vận hành của con số này..."
                    className="w-full p-3.5 rounded-2xl bg-white border border-[#E2E8E5] text-xs leading-relaxed focus:outline-none focus:border-[#267D71]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1.5 uppercase tracking-wider">
                    Bài học & Lời khuyên chuyển hóa:
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập các bài học cuộc đời và lời khuyên ứng dụng thực tế..."
                    className="w-full p-3.5 rounded-2xl bg-white border border-[#E2E8E5] text-xs leading-relaxed focus:outline-none focus:border-[#267D71]"
                  />
                </div>

                {keywordStatus && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${keywordStatus.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {keywordStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingKeywords}
                  className="py-3.5 px-6 rounded-2xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save size={15} />
                  <span>{savingKeywords ? 'Đang lưu...' : 'Lưu Luận Giải Con Số'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: QUẢN TRỊ GÓI BÁN HÀNG & DYNAMIC PACKAGE BUILDER */}
        {/* ========================================================================= */}
        {activeSubTab === 'packages' && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 border border-[#E2E8E5] shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0D2B26] flex items-center gap-2">
                  <Package className="text-[#267D71]" size={22} />
                  <span>Quản Trị Bảng Giá & Nền Tảng Gói Bán Hàng</span>
                </h3>
                <p className="text-xs text-[#5F736E] mt-0.5">
                  Tự do thiết kế gói dịch vụ, gán quyền lợi, cấu hình số lượt bài và bật/tắt tính năng theo ma trận 3 trục.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleResetDefaultPricingPlans}
                  disabled={loadingPlans}
                  className="py-2.5 px-4 rounded-xl border border-[#E2E8E5] hover:bg-[#EEF5F3] text-xs font-bold text-[#5F736E] hover:text-[#0D2B26] flex items-center gap-2 transition-all cursor-pointer"
                  title="Khôi phục lại 7 gói chuẩn 3 trục"
                >
                  <RefreshCw size={14} className={loadingPlans ? 'animate-spin' : ''} />
                  <span>Khôi Phục Mặc Định</span>
                </button>

                <button
                  onClick={() => {
                    const newId = `custom_plan_${Date.now()}`;
                    setEditingPlan({
                      id: newId,
                      name: 'Gói Dịch Vụ Mới',
                      badge: 'Mới',
                      price: 99000,
                      originalPrice: 199000,
                      periodLabel: 'bài báo cáo độc bản',
                      targetAudience: 'Dành cho khách hàng mục tiêu',
                      type: 'b2c_single',
                      credits: 1,
                      isPopular: false,
                      isActive: true,
                      displayOrder: pricingPlans.length + 1,
                      features: [
                        'Mở khóa báo cáo độc bản Tầng 3',
                        'Xuất file PDF chuẩn in ấn cao cấp',
                        'Lưu trữ hồ sơ vĩnh viễn'
                      ],
                      featureFlags: {
                        report_quota: 1,
                        topic_expansion: 1,
                        synastry_map: false,
                        white_label: false,
                        coach_crm: false,
                        energy_calendar_365: false,
                        consulting_questions: 3,
                      }
                    });
                    setIsPlanModalOpen(true);
                  }}
                  className="py-2.5 px-5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Tạo Gói Mới</span>
                </button>
              </div>
            </div>

            {/* BẢNG TỔNG KẾT NHANH MA TRẬN GÓI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#EEF5F3] border border-[#267D71]/20 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#267D71] uppercase tracking-wider">Cá Nhân & Gia Đình (B2C)</div>
                  <div className="text-xl font-extrabold text-[#013E37]">
                    {pricingPlans.filter(p => p.type === 'b2c_single' || p.type === 'b2c_addon' || p.type === 'family').length} gói
                  </div>
                </div>
                <Star size={24} className="text-[#267D71] opacity-70" />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#5F736E] uppercase tracking-wider">Chuyên Gia Nạp Sỉ (Wholesale)</div>
                  <div className="text-xl font-extrabold text-[#0D2B26]">
                    {pricingPlans.filter(p => p.type === 'coach_wholesale').length} gói
                  </div>
                </div>
                <Briefcase size={24} className="text-[#0D2B26] opacity-70" />
              </div>

              <div className="p-4 rounded-2xl bg-[#FFEFB3]/40 border border-[#F9E79F] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#013E37] uppercase tracking-wider">Hội Viên Nền Tảng (SaaS)</div>
                  <div className="text-xl font-extrabold text-[#013E37]">
                    {pricingPlans.filter(p => p.type === 'coach_subscription').length} gói
                  </div>
                </div>
                <Crown size={24} className="text-[#013E37] opacity-70" />
              </div>
            </div>

            {/* DANH SÁCH CÁC GÓI ĐANG CÓ */}
            {loadingPlans ? (
              <div className="py-12 text-center text-[#5F736E]">
                <Loader2 size={24} className="mx-auto animate-spin text-[#267D71] mb-2" />
                <p className="text-xs">Đang đồng bộ bảng giá từ cơ sở dữ liệu...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8E5] text-[#5F736E] font-bold bg-[#FAF8F5]">
                      <th className="py-3.5 px-4">Tên Gói & ID</th>
                      <th className="py-3.5 px-3">Phân Loại</th>
                      <th className="py-3.5 px-3">Giá Bán / Gốc</th>
                      <th className="py-3.5 px-3">Lượt Bài (Credits)</th>
                      <th className="py-3.5 px-3">Tính Năng Bật</th>
                      <th className="py-3.5 px-3 text-center">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E5]">
                    {pricingPlans.map((plan) => {
                      const activeFeatureCount = Object.values(plan.featureFlags || {}).filter(v => v === true || (typeof v === 'number' && v > 0)).length;
                      return (
                        <tr key={plan.id} className="hover:bg-[#FAF8F5]/80 transition-all">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-sm text-[#0D2B26] flex items-center gap-1.5">
                              <span>{plan.name}</span>
                              {plan.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFEFB3] text-[#013E37] border border-[#F9E79F]">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-[#5F736E] mt-0.5">{plan.id}</div>
                            <div className="text-[11px] text-[#5F736E] line-clamp-1 mt-0.5">{plan.targetAudience}</div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              plan.type === 'b2c_single' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              plan.type === 'b2c_addon' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              plan.type === 'family' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              plan.type === 'coach_wholesale' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-amber-100 text-[#013E37] border border-[#F9E79F]'
                            }`}>
                              {plan.type === 'b2c_single' ? 'Cá Nhân' :
                               plan.type === 'b2c_addon' ? 'Addon Mở Rộng' :
                               plan.type === 'family' ? 'Gia Đình' :
                               plan.type === 'coach_wholesale' ? 'Nạp Sỉ' : 'Hội Viên Năm'}
                            </span>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="font-bold text-[#013E37] text-sm">
                              {plan.price.toLocaleString('vi-VN')} đ
                            </div>
                            {plan.originalPrice && (
                              <div className="text-[10px] text-[#93A39F] line-through">
                                {plan.originalPrice.toLocaleString('vi-VN')} đ
                              </div>
                            )}
                            <div className="text-[10px] text-[#5F736E]">/{plan.periodLabel}</div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="font-bold text-sm text-[#0D2B26] font-mono">
                              {plan.credits} bài
                            </span>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded-md bg-[#EEF5F3] text-[#267D71] font-bold text-[11px]">
                                {activeFeatureCount} / 7 tính năng
                              </span>
                            </div>
                            <div className="text-[10px] text-[#5F736E] mt-0.5">
                              {plan.featureFlags?.white_label ? '🏷️ White-label ' : ''}
                              {plan.featureFlags?.coach_crm ? '💼 CRM ' : ''}
                              {plan.featureFlags?.energy_calendar_365 ? '📅 Lịch 365 ' : ''}
                              {plan.featureFlags?.synastry_map ? '💞 Tương hợp' : ''}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => handleTogglePlanActive(plan)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto ${
                                plan.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {plan.isActive ? <ToggleRight size={14} className="text-emerald-700" /> : <ToggleLeft size={14} />}
                              <span>{plan.isActive ? 'Đang bán' : 'Tạm ẩn'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingPlan({ ...plan });
                                  setIsPlanModalOpen(true);
                                }}
                                className="p-2 rounded-xl bg-white hover:bg-[#EEF5F3] text-[#013E37] border border-[#E2E8E5] transition-all cursor-pointer shadow-xs"
                                title="Chỉnh sửa cấu hình gói"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeletePricingPlan(plan.id)}
                                className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-[#E2E8E5] transition-all cursor-pointer shadow-xs"
                                title="Xóa gói"
                              >
                                <Trash2 size={14} />
                              </button>
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

        {/* MODAL CHỈNH SỬA / TẠO MỚI GÓI DỊCH VỤ */}
        {isPlanModalOpen && editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#0D2B26]">
                    Cấu Hình Gói Dịch Vụ: {editingPlan.name}
                  </h3>
                  <p className="text-xs text-[#5F736E]">Mã định danh hệ thống: {editingPlan.id}</p>
                </div>
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-2 text-[#5F736E] hover:text-[#0D2B26] rounded-full transition-all cursor-pointer text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePricingPlan} className="space-y-6">
                {/* THÔNG TIN CƠ BẢN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Mã Gói (ID duy nhất):</label>
                    <input
                      type="text"
                      value={editingPlan.id}
                      onChange={(e) => setEditingPlan({ ...editingPlan, id: e.target.value })}
                      required
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs font-mono font-bold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Tên Gói Hiển Thị:</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      required
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs font-bold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Phân Loại Gói (Model Type):</label>
                    <select
                      value={editingPlan.type}
                      onChange={(e) => setEditingPlan({ ...editingPlan, type: e.target.value as any })}
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs font-bold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    >
                      <option value="b2c_single">Cá Nhân Khám Phá (1 bài Mass Adoption)</option>
                      <option value="b2c_addon">Addon Mở Rộng Trọng Tâm (Micro-Addon)</option>
                      <option value="family">Gia Đình Thấu Hiểu (Combo 5 bài)</option>
                      <option value="coach_wholesale">Chuyên Gia Nạp Sỉ (Wholesale Credits)</option>
                      <option value="coach_subscription">Hội Viên Nền Tảng Hàng Năm (SaaS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Huy Hiệu (Badge nổi bật):</label>
                    <input
                      type="text"
                      value={editingPlan.badge || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                      placeholder="Ví dụ: Phổ Biến Nhất, Tiết Kiệm 50%..."
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Giá Bán Thực Tế (VNĐ):</label>
                    <input
                      type="number"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                      required
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs font-bold text-[#013E37] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Giá Gốc Gạch Ngang (VNĐ):</label>
                    <input
                      type="number"
                      value={editingPlan.originalPrice || 0}
                      onChange={(e) => setEditingPlan({ ...editingPlan, originalPrice: Number(e.target.value) })}
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs text-[#5F736E] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Đơn Vị Thời Gian / Chu Kỳ:</label>
                    <input
                      type="text"
                      value={editingPlan.periodLabel}
                      onChange={(e) => setEditingPlan({ ...editingPlan, periodLabel: e.target.value })}
                      placeholder="Ví dụ: bài báo cáo độc bản, năm hội viên..."
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D2B26] mb-1">Số Bài Tặng Kèm (Credits):</label>
                    <input
                      type="number"
                      value={editingPlan.credits}
                      onChange={(e) => setEditingPlan({ ...editingPlan, credits: Number(e.target.value) })}
                      required
                      className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs font-bold text-[#0D2B26] focus:outline-none focus:border-[#267D71]"
                    />
                  </div>
                </div>

                {/* MA TRẬN 7 TÍNH NĂNG KỸ THUẬT */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] space-y-3">
                  <div className="text-xs font-bold text-[#0D2B26] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-[#267D71]" />
                    <span>Ma Trận Tính Năng & Hạn Mức Hệ Thống (Feature Matrix)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {SYSTEM_FEATURES.map((feat) => {
                      const currentVal = editingPlan.featureFlags?.[feat.key];
                      const isEnabled = typeof currentVal === 'boolean' ? currentVal : (typeof currentVal === 'number' && currentVal > 0);

                      return (
                        <div key={feat.key} className="p-3 bg-white rounded-xl border border-[#E2E8E5] flex items-center justify-between">
                          <div className="pr-2">
                            <div className="font-bold text-xs text-[#0D2B26]">{feat.label}</div>
                            <div className="text-[10px] text-[#5F736E] line-clamp-1">{feat.description}</div>
                          </div>

                          {feat.isNumeric ? (
                            <input
                              type="number"
                              value={typeof currentVal === 'number' ? currentVal : 0}
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                setEditingPlan({
                                  ...editingPlan,
                                  featureFlags: {
                                    ...editingPlan.featureFlags,
                                    [feat.key]: num
                                  }
                                });
                              }}
                              className="w-16 p-1.5 bg-[#FAF8F5] border border-[#E2E8E5] rounded-lg text-xs font-bold text-center text-[#013E37] focus:outline-none focus:border-[#267D71]"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={Boolean(currentVal)}
                              onChange={(e) => {
                                setEditingPlan({
                                  ...editingPlan,
                                  featureFlags: {
                                    ...editingPlan.featureFlags,
                                    [feat.key]: e.target.checked
                                  }
                                });
                              }}
                              className="w-5 h-5 accent-[#267D71] cursor-pointer"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DANH SÁCH QUYỀN LỢI HIỂN THỊ MARKETING */}
                <div>
                  <label className="block text-xs font-bold text-[#0D2B26] mb-1">
                    Quyền Lợi Hiển Thị Marketing (Mỗi dòng 1 gạch đầu dòng):
                  </label>
                  <textarea
                    rows={5}
                    value={editingPlan.features.join('\n')}
                    onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n').filter(s => s.trim()) })}
                    className="w-full p-3 bg-white border border-[#E2E8E5] rounded-xl text-xs leading-relaxed focus:outline-none focus:border-[#267D71]"
                  />
                </div>

                {planFormStatus && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${planFormStatus.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {planFormStatus}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8E5]">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-[#E2E8E5] text-xs font-bold text-[#5F736E] hover:bg-[#EEF5F3] cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Save size={15} />
                    <span>Lưu Cấu Hình Gói</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
