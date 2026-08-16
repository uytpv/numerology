'use client';

import React, { useState } from 'react';
import { Headphones, X, Send, UserPlus, Sparkles, MessageSquare } from 'lucide-react';

interface SupportChatPopupProps {
  customerName?: string;
  onOpenLeadModal?: () => void;
}

export function SupportChatPopup({ customerName = 'bạn', onOpenLeadModal }: SupportChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'support' | 'user'; text: string; showCoachButton?: boolean }>>([
    {
      sender: 'support',
      text: `Xin chào ${customerName}! Tôi là Trợ Lý Hỗ Trợ Life Maps 24/7. Tôi có thể giúp bạn:\n\n1. 💳 Hướng dẫn thanh toán VietQR & kích hoạt lượt luận giải\n2. 📄 Hướng dẫn xuất file PDF báo cáo chuẩn A4\n3. 📖 Giải thích định nghĩa các chỉ số Thần số học\n4. 🤝 Đặt lịch kết nối trực tiếp với Chuyên Gia Life Coach 1-1\n\nBạn cần hỗ trợ điều gì hôm nay?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let replyText = '';
      let showCoachBtn = false;

      if (lower.includes('thanh toán') || lower.includes('nạp') || lower.includes('giá') || lower.includes('vietqr') || lower.includes('gói')) {
        replyText = `💳 Hướng dẫn thanh toán VietQR Napas247:\n\n1. Bấm vào nút "Mở Khóa Luận Giải" hoặc nút "Nạp tiền" tại Tab Luận Giải Đa Chiều.\n2. Quét mã VietQR bằng ứng dụng ngân hàng của bạn.\n3. Hệ thống sẽ tự động đối soát nội dung chuyển khoản và kích hoạt lượt xem ngay tức thì sau 3-5 giây.`;
      } else if (lower.includes('in') || lower.includes('pdf') || lower.includes('tải') || lower.includes('xuất')) {
        replyText = `📄 Hướng dẫn in & xuất PDF:\n\nMỗi Tab (Tam Giác Vàng, Life Map 21 chỉ số, Luận Giải Đa Chiều) đều được trang bị nút "In / Xuất PDF" riêng biệt. Bạn hãy bấm vào nút PDF ở ngay trong Tab tương ứng để tải tệp PDF chuẩn định dạng A4.`;
      } else if (lower.includes('đường đời') || lower.includes('sứ mệnh') || lower.includes('linh hồn') || lower.includes('chỉ số')) {
        replyText = `📖 Thần số học Pythagoras gồm 21 chỉ số được phân loại chi tiết tại Tab "Life Map 21 chỉ số". Nếu bạn muốn biết sự tương tác chéo đa chiều giữa các con số, hãy mở khóa Tab "Luận Giải Đa Chiều" nhé!`;
        showCoachBtn = true;
      } else {
        replyText = `💡 Cảm ơn câu hỏi của bạn!\nĐể được giải mã chuyên sâu độc bản, vượt qua các điểm nghẽn tài chính/tình cảm và xây dựng kế hoạch bứt phá, bạn có thể tham gia phiên tư vấn 1-1 cùng Chuyên Gia Life Coach.`;
        showCoachBtn = true;
      }

      setChatMessages((prev) => [...prev, { sender: 'support', text: replyText, showCoachButton: showCoachBtn }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-[#013E37] hover:bg-[#0D2B26] text-white font-bold text-xs sm:text-sm shadow-2xl transition-all duration-300 flex items-center gap-2.5 hover:scale-105 border-2 border-[#FFEFB3]"
        >
          <div className="relative">
            <Headphones size={20} className="text-[#FFEFB3]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span>Hỗ Trợ & CSKH 24/7</span>
        </button>
      )}

      {/* POPUP CHAT WINDOW */}
      {isOpen && (
        <div className="bg-[#FFFFFF] border border-[#E2E8E5] rounded-3xl shadow-2xl w-80 sm:w-96 h-[520px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* HEADER */}
          <div className="bg-[#013E37] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FFEFB3] text-[#013E37] flex items-center justify-center font-bold">
                <Headphones size={18} />
              </div>
              <div>
                <div className="font-bold text-sm font-heading flex items-center gap-2">
                  <span>Hỗ Trợ Life Maps 24/7</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] text-[#FFEFB3]">Giải đáp & Kết nối Chuyên Gia</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#013E37] text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-[#FFFFFF] text-[#2D3E3A] border border-[#E2E8E5] rounded-bl-none shadow-sm whitespace-pre-line'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.showCoachButton && onOpenLeadModal && (
                    <div className="mt-3 pt-2.5 border-t border-[#E2E8E5] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#5F736E] italic">Cần tư vấn 1-1?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onOpenLeadModal();
                        }}
                        className="px-3 py-1.5 rounded-xl btn-primary text-[11px] font-bold flex items-center gap-1 shadow-sm"
                      >
                        <UserPlus size={12} />
                        <span>Đặt Lịch Coach</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#FFFFFF] p-2.5 rounded-2xl text-xs text-[#5F736E] italic border border-[#E2E8E5]">
                  🌀 Trợ lý đang phản hồi...
                </div>
              </div>
            )}
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#FFFFFF] border-t border-[#E2E8E5] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập thắc mắc của bạn..."
              className="flex-1 bg-[#FAF8F5] border border-[#E2E8E5] rounded-2xl px-3.5 py-2.5 text-xs text-[#2D3E3A] focus:outline-none focus:border-[#267D71]"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="p-2.5 btn-primary disabled:opacity-50 text-white rounded-2xl shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SupportChatPopup;
