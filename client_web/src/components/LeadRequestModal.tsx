'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { X, UserCheck, MapPin, Phone, Mail, Sparkles, CheckCircle2, Loader2, Award } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface LeadRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
  defaultFullName?: string;
}

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Khánh Hòa', 'Lâm Đồng',
  'Quảng Ninh', 'Bắc Ninh', 'Nghệ An', 'Thanh Hóa', 'Thừa Thiên Huế',
  'Khác / Nước Ngoài'
];

export const LeadRequestModal: React.FC<LeadRequestModalProps> = ({
  isOpen,
  onClose,
  customerId,
  defaultFullName = '',
}) => {
  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [interest, setInterest] = useState<'career' | 'relationship' | 'family' | 'coach_training'>('career');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Vui lòng điền Họ tên và Số điện thoại liên hệ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/api/v1/coaches/leads/request`, {
        customerId,
        fullName,
        phone,
        email,
        city,
        interest,
        note,
      });

      setSuccessResult(response.data);
      canvasConfetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Lỗi gửi yêu cầu kết nối:', err);
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2B26]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#E2E8E5] p-7 shadow-2xl text-[#2D3E3A] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5F736E] hover:text-[#0D2B26] hover:bg-[#EEF5F3] transition-all"
        >
          <X size={20} />
        </button>

        {successResult ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EEF5F3] text-[#267D71] flex items-center justify-center mx-auto border border-[#267D71]/30">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-[#013E37] font-heading">Kết Nối Thành Công!</h3>
            <div className="p-4 rounded-2xl bg-[#EEF5F3] border border-[#E2E8E5] text-sm text-[#2D3E3A] leading-relaxed text-left">
              <p className="font-bold text-[#013E37] mb-1 flex items-center gap-1.5">
                <Award size={16} className="text-[#267D71]" /> Chuyên Gia Phụ Trách: {successResult.assignedCoachName}
              </p>
              <p className="text-xs text-[#5F736E] mt-1">
                {successResult.message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm shadow-md transition-all"
            >
              Hoàn Tất & Quay Lại Bản Đồ
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFB3] border border-[#F9E79F] text-xs font-bold text-[#013E37] mb-2 shadow-sm">
                <Sparkles size={14} className="text-[#013E37]" />
                Mạng Lưới Chuyên Gia Life Maps & Khai Vấn
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#0D2B26]">
                Kết Nối Life Coach 1-1
              </h3>
              <p className="text-xs text-[#5F736E] mt-1 leading-relaxed">
                Hệ thống sẽ tự động ghép nối bạn với Life Coach uy tín phù hợp nhất tại khu vực của bạn để đồng hành chuyển hóa.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0D2B26] font-semibold mb-1.5">Họ và Tên của bạn *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Hoàng Vy"
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3.5 py-2.5 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0D2B26] font-semibold mb-1.5 flex items-center gap-1">
                    <Phone size={12} className="text-[#267D71]" /> Số Điện Thoại / Zalo *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0988xxxxxx"
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3.5 py-2.5 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#0D2B26] font-semibold mb-1.5 flex items-center gap-1">
                    <MapPin size={12} className="text-[#267D71]" /> Tỉnh / Thành Phố
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3 py-2.5 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p} className="bg-white text-[#2D3E3A]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#0D2B26] font-semibold mb-1.5 flex items-center gap-1">
                  <Mail size={12} className="text-[#267D71]" /> Email (Không bắt buộc)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3.5 py-2.5 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#0D2B26] font-semibold mb-1.5">Nhu Cầu Tư Vấn Chính Của Bạn</label>
                <select
                  value={interest}
                  onChange={(e: any) => setInterest(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3 py-2.5 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                >
                  <option value="career">🎯 Định hướng Sự nghiệp & Tài chính trong năm cá nhân</option>
                  <option value="relationship">❤️ Tháo gỡ Tình duyên, Hôn nhân & Mối quan hệ</option>
                  <option value="family">👨‍👩‍👧 Nuôi dạy con cái & Thấu hiểu bản đồ con</option>
                  <option value="coach_training">🎓 Học nghề & Đào tạo trở thành Life Maps Coach</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0D2B26] font-semibold mb-1.5">Lời nhắn / Câu hỏi dành cho Coach</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm về vấn đề bạn đang gặp phải..."
                  className="w-full bg-[#FAF8F5] border border-[#E2E8E5] rounded-xl px-3.5 py-2 text-sm text-[#2D3E3A] focus:outline-none focus:border-[#267D71] focus:ring-1 focus:ring-[#267D71] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                {loading ? 'Đang Ghép Nối Chuyên Gia...' : 'Gửi Yêu Cầu Ghép Nối Chuyên Gia'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

