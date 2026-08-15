'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import axios from 'axios';
import canvasConfetti from 'canvas-confetti';
import { 
  Sparkles, Lock, Unlock, Printer, Send, MessageCircle, AlertTriangle, 
  HelpCircle, CheckCircle, ArrowRight, BookOpen, Star, RefreshCw 
} from 'lucide-react';

interface ReportDashboardProps {
  initialCustomer: any;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ initialCustomer }) => {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  
  const [customer, setCustomer] = useState(initialCustomer);
  const [activeTab, setActiveTab] = useState<'free' | 'tier1' | 'tier2'>('free');
  
  const [aiReports, setAiReports] = useState<Record<number, any>>({});
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Trò chuyện với AI (Tier 2)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Lắng nghe Firestore thời gian thực để tự động mở khóa khi thanh toán thành công
  useEffect(() => {
    if (!customer?.id) return;

    const docRef = doc(db, 'customers', customer.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedData = docSnap.data();
        
        // Nếu vừa được mở khóa, bắn confetti chúc mừng
        if (updatedData.unlockedTier > customer.unlockedTier) {
          canvasConfetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
        
        setCustomer({ id: docSnap.id, ...updatedData });
      }
    });

    return () => unsubscribe();
  }, [customer?.id, customer?.unlockedTier]);

  // Tải báo cáo AI từ backend dựa theo Tab được chọn
  const loadAIReport = async (tier: number) => {
    if (customer.unlockedTier < tier) return; // Chưa mua thì không tải

    const cacheKey = `${tier}_${locale}`;
    if (aiReports[tier]) return; // Đã load rồi

    setLoadingAI(true);
    setAiError(null);

    try {
      const idToken = await user?.getIdToken();
      // Gọi API NestJS Backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/v1/customers/${customer.id}/report`, {
        params: { tier, lang: locale },
        headers: { Authorization: `Bearer ${idToken}` }
      });

      setAiReports(prev => ({
        ...prev,
        [tier]: response.data
      }));
    } catch (error: any) {
      console.error('Lỗi tải báo cáo AI:', error);
      setAiError(error.response?.data?.message || 'Không thể kết nối đến máy chủ AI');
    } finally {
      setLoadingAI(false);
    }
  };

  // Tự động tải báo cáo tương ứng khi chuyển Tab hoặc đổi ngôn ngữ
  useEffect(() => {
    if (activeTab === 'free') {
      loadAIReport(0);
    } else if (activeTab === 'tier1') {
      loadAIReport(1);
    } else if (activeTab === 'tier2') {
      loadAIReport(2);
    }
  }, [activeTab, locale, customer?.unlockedTier]);

  // Luồng thanh toán Sandbox (Lemon Squeezy)
  const handlePayment = (targetTier: number) => {
    // Tạo link thanh toán giả lập sandbox
    // Truyền customer_id và targetTier qua custom_data để Webhook backend bắt
    const sandboxCheckoutUrl = `https://numerology-sandbox-checkout.lemonsqueezy.com/mock-checkout?customer_id=${customer.id}&tier=${targetTier}`;
    
    // Mở hộp thoại thông báo giả lập thanh toán (Trong môi trường dev)
    alert(`[Giả Lập Thanh Toán Sandbox]
Hệ thống sẽ chuyển hướng bạn đến cổng Lemon Squeezy.
* Đối với môi trường dev, chúng tôi sẽ kích hoạt webhook trực tiếp sau 3 giây để mở khóa ngay lập tức!`);
    
    // Gọi API giả lập webhook trên môi trường dev
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    axios.post(`${backendUrl}/api/v1/payments/webhook/lemonsqueezy`, {
      meta: {
        event_name: 'order_created',
        custom_data: {
          customer_id: customer.id,
          tier: targetTier
        }
      }
    }).then(() => {
      console.log('Webhook test triggered');
    }).catch(err => {
      console.error('Webhook error:', err);
    });
  };

  // Gửi tin nhắn chat với AI Coach (Tier 2)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingChat) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setSendingChat(true);

    try {
      const idToken = await user?.getIdToken();
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Gửi tin nhắn kèm theo bản đồ số học làm context
      const response = await axios.post(`${backendUrl}/api/v1/customers/${customer.id}/chat`, {
        message: userText,
        chatHistory: chatMessages,
        lang: locale
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      setChatMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Xin lỗi, tôi gặp sự cố kết nối. Hãy thử lại sau.' }]);
    } finally {
      setSendingChat(false);
    }
  };

  const map = customer.map;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Bản đồ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-purple-500/10">
        <div>
          <h1 className="text-3xl font-extrabold gold-glow text-amber-400 font-serif mb-2">
            {customer.last_name} {customer.first_name}
          </h1>
          <p className="text-purple-300 font-medium">
            {t('common.dob')}: {customer.dob} | ID: {customer.id}
          </p>
        </div>
        <div className="flex gap-3 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:bg-purple-800/50 hover:text-white transition-all"
          >
            <Printer size={18} />
            {t('common.printBtn')}
          </button>
        </div>
      </div>

      {/* Grid Hiển thị Các Số Chủ Đạo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { key: 'life_path', val: map.life_path, label: t('indicators.life_path'), color: 'border-amber-500/30 text-amber-400' },
          { key: 'expression', val: map.expression, label: t('indicators.expression'), color: 'border-purple-500/30 text-purple-300' },
          { key: 'heart_desire', val: map.heart_desire, label: t('indicators.heart_desire'), color: 'border-rose-500/30 text-rose-300' },
          { key: 'personality', val: map.personality, label: t('indicators.personality'), color: 'border-teal-500/30 text-teal-300' },
          { key: 'birthday', val: map.birthday, label: t('indicators.birthday'), color: 'border-blue-500/30 text-blue-300' },
          { key: 'maturity', val: map.maturity, label: t('indicators.maturity'), color: 'border-pink-500/30 text-pink-300' },
          { key: 'balance', val: map.balance, label: t('indicators.balance'), color: 'border-emerald-500/30 text-emerald-300' },
          { key: 'subconscious_confidence', val: map.subconscious_confidence, label: t('indicators.subconscious_confidence'), color: 'border-indigo-500/30 text-indigo-300' },
        ].map((item) => (
          <div key={item.key} className={`glass-card p-5 rounded-xl border text-center flex flex-col justify-between ${item.color}`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">{item.label}</span>
            <span className="text-4xl font-extrabold font-serif py-2">{item.val}</span>
          </div>
        ))}
      </div>

      {/* Khối Tabs Luận Giải */}
      <div className="mb-8 border-b border-purple-500/10 no-print">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-5 py-3 font-semibold rounded-t-lg transition-all ${
              activeTab === 'free'
                ? 'bg-purple-900/30 text-amber-400 border-b-2 border-amber-400'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/20'
            }`}
          >
            {t('common.freeTier')}
          </button>
          <button
            onClick={() => setActiveTab('tier1')}
            className={`px-5 py-3 font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'tier1'
                ? 'bg-purple-900/30 text-amber-400 border-b-2 border-amber-400'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/20'
            }`}
          >
            {customer.unlockedTier >= 1 ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} />}
            {t('common.tier1')}
          </button>
          <button
            onClick={() => setActiveTab('tier2')}
            className={`px-5 py-3 font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'tier2'
                ? 'bg-purple-900/30 text-amber-400 border-b-2 border-amber-400'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/20'
            }`}
          >
            {customer.unlockedTier >= 2 ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} />}
            {t('common.tier2')}
          </button>
        </div>
      </div>

      {/* Vùng Hiển Thị Nội Dung Luận Giải */}
      <div className="glass-card p-6 md:p-8 rounded-2xl mb-8">
        
        {/* TẢI BÁO CÁO AI */}
        {loadingAI && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="animate-spin text-amber-400" size={32} />
            <p className="text-purple-200 animate-pulse">{t('common.loading')}</p>
          </div>
        )}

        {aiError && !loadingAI && (
          <div className="bg-rose-950/30 border border-rose-500/20 p-4 rounded-xl text-rose-300 flex items-center gap-3">
            <AlertTriangle />
            <p>{aiError}</p>
          </div>
        )}

        {!loadingAI && !aiError && (
          <div>
            {/* TAB MIỄN PHÍ */}
            {activeTab === 'free' && aiReports[0] && (
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles size={20} />
                  {t('tiers.freeTitle')}
                </h3>
                <p className="text-lg leading-relaxed text-purple-100/90 whitespace-pre-line">
                  {aiReports[0].summary}
                </p>
                
                {/* Paywall CTA */}
                {customer.unlockedTier < 1 && (
                  <div className="mt-8 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center no-print">
                    <h4 className="text-xl font-bold text-amber-300 mb-2 flex items-center justify-center gap-2">
                      <Lock size={18} />
                      {t('common.lockText')} (Tier 1)
                    </h4>
                    <p className="text-purple-200 max-w-lg mx-auto mb-4">
                      Khám phá những chướng ngại vật tiềm tàng, các nợ nghiệp tiêu cực và cách thức tháo gỡ điểm nghẽn trong cuộc sống của bạn.
                    </p>
                    <button 
                      onClick={() => handlePayment(1)}
                      className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold transition-all flex items-center gap-2 mx-auto"
                    >
                      Mở khóa Tier 1 ($4.99)
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB TIER 1 - CHALLENGES */}
            {activeTab === 'tier1' && (
              customer.unlockedTier >= 1 ? (
                aiReports[1] && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                      <AlertTriangle size={20} className="text-rose-400" />
                      {t('tiers.tier1Title')}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/10">
                        <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                          <CheckCircle size={16} className="text-purple-400" />
                          Phân Tích Cốt Lõi
                        </h4>
                        <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                          {aiReports[1].coreAnalysis?.lifePath}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/10">
                        <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-rose-400" />
                          Thách Thức Hiện Tại
                        </h4>
                        <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                          {aiReports[1].challenges?.currentChallenge}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-rose-950/10 border border-rose-500/10">
                      <h4 className="text-lg font-bold text-rose-300 mb-3 flex items-center gap-2">
                        Bài Học Nghiệp (Nợ nghiệp {map.karmic_lessons.join(', ')})
                      </h4>
                      <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                        {aiReports[1].challenges?.karmicLessons}
                      </p>
                    </div>

                    {/* Paywall CTA to Tier 2 */}
                    {customer.unlockedTier < 2 && (
                      <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center no-print">
                        <h4 className="text-xl font-bold text-amber-300 mb-2 flex items-center justify-center gap-2">
                          <Lock size={18} />
                          Nâng cấp lên Tier 2 - Nhận Giải Pháp Hoàn Chỉnh
                        </h4>
                        <p className="text-purple-200 max-w-lg mx-auto mb-4">
                          Nhận kế hoạch hành động chi tiết từ AI, định hướng nghề nghiệp lý tưởng và mở khóa chức năng trò chuyện trực tiếp với Trợ lý AI Coach.
                        </p>
                        <button 
                          onClick={() => handlePayment(2)}
                          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold transition-all flex items-center gap-2 mx-auto"
                        >
                          Nâng Cấp Lên Tier 2 ($14.99)
                          <Sparkles size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-16 no-print">
                  <Lock size={48} className="mx-auto text-purple-400 mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold text-purple-200 mb-2">{t('common.lockText')}</h3>
                  <p className="text-purple-300/70 max-w-md mx-auto mb-6">
                    Báo cáo phân tích thách thức lớn và nợ nghiệp hiện đang bị khóa. Mở khóa ngay để nhận diện vấn đề.
                  </p>
                  <button 
                    onClick={() => handlePayment(1)}
                    className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
                  >
                    Mở khóa ngay ($4.99)
                  </button>
                </div>
              )
            )}

            {/* TAB TIER 2 - SOLUTIONS & AI CHAT */}
            {activeTab === 'tier2' && (
              customer.unlockedTier >= 2 ? (
                aiReports[2] && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-400" />
                      {t('tiers.tier2Title')}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/10">
                        <h4 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                          <CheckCircle size={16} className="text-amber-400" />
                          Kế Hoạch Hành Động
                        </h4>
                        <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                          {aiReports[2].solutions?.actionPlan}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/10">
                        <h4 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                          <BookOpen size={16} className="text-amber-400" />
                          Định Hướng Sự Nghiệp
                        </h4>
                        <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                          {aiReports[2].solutions?.careerGuide}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/10">
                      <h4 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
                        Dự báo năm cá nhân và Lời khuyên
                      </h4>
                      <p className="text-purple-100/80 leading-relaxed whitespace-pre-line">
                        {aiReports[2].solutions?.personalYearAdvice}
                      </p>
                    </div>

                    {/* Khung Chat Trợ Lý AI (AI Coach Chat) */}
                    <div className="mt-10 border-t border-purple-500/10 pt-8 no-print">
                      <h4 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                        <MessageCircle className="text-purple-400" />
                        Trò Chuyện Trực Tiếp Với Trợ Lý Số Học AI của Bạn
                      </h4>
                      <p className="text-xs text-purple-300/70 mb-4">
                        Đặt các câu hỏi như: "Làm sao để tôi phát huy tối đa Sứ mệnh 4?", "Năm nay tôi nên làm gì?", hay "Khắc phục nợ nghiệp 8 bằng cách nào?".
                      </p>
                      
                      {/* Box tin nhắn */}
                      <div className="bg-black/40 border border-purple-500/10 rounded-xl h-80 flex flex-col justify-between overflow-hidden">
                        <div className="p-4 overflow-y-auto space-y-4 flex-1">
                          {chatMessages.length === 0 && (
                            <p className="text-center text-purple-300/50 my-auto text-sm italic">
                              Hộp thư trống. Hãy bắt đầu câu hỏi đầu tiên của bạn...
                            </p>
                          )}
                          {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3 rounded-xl max-w-md text-sm ${
                                msg.sender === 'user' 
                                  ? 'bg-purple-600 text-white rounded-tr-none' 
                                  : 'bg-purple-950/50 border border-purple-500/20 text-purple-100 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {sendingChat && (
                            <div className="flex justify-start">
                              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/20 text-purple-300 text-sm animate-pulse rounded-tl-none">
                                AI Coach đang phân tích dữ liệu...
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Input chat */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-purple-500/10 bg-purple-950/20 flex gap-2">
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn tại đây..."
                            className="flex-1 bg-black/50 border border-purple-500/20 rounded-lg px-4 py-2 text-sm text-purple-100 focus:outline-none focus:border-purple-500"
                            disabled={sendingChat}
                          />
                          <button
                            type="submit"
                            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50"
                            disabled={sendingChat || !inputMessage.trim()}
                          >
                            <Send size={16} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-16 no-print">
                  <Lock size={48} className="mx-auto text-purple-400 mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold text-purple-200 mb-2">Chưa Mở Khóa Giải Pháp (Tier 2)</h3>
                  <p className="text-purple-300/70 max-w-md mx-auto mb-6">
                    Báo cáo kế hoạch giải pháp chi tiết và tính năng trò chuyện trực tuyến với AI Coach hiện đang bị khóa.
                  </p>
                  <button 
                    onClick={() => handlePayment(2)}
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold transition-all"
                  >
                    Mở khóa trọn gói ($14.99)
                  </button>
                </div>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
};
