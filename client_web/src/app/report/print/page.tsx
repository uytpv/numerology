'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generate3LayerNumerologyData } from '@/lib/numerologyReportGenerator';
import { Printer, Sparkles, Compass, ShieldAlert, Award } from 'lucide-react';

function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id || id === 'demo') {
        setCustomer({
          full_name: 'NGUYỄN VĂN AN',
          dob: '1990-08-18',
          gender: 'male',
          tier: 'paid',
          map: {
            life_path: 8,
            expression: 1,
            heart_desire: 6,
            personality: 4,
            birthday: 9,
            attitude: 8,
            personal_year_current: 9,
          },
        });
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'customers', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCustomer({ id: snap.id, ...snap.data() });
        } else {
          // Fallback to demo data
          setCustomer({
            full_name: 'NGUYỄN VĂN AN',
            dob: '1990-08-18',
            gender: 'male',
            tier: 'paid',
            map: { life_path: 8, expression: 1, heart_desire: 6, personal_year_current: 9 },
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-[#5F736E]">Đang chuẩn bị bản in...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-[#5F736E]">Không tìm thấy hồ sơ!</div>;
  }

  const { layer1, layer2, layer3 } = generate3LayerNumerologyData(customer);
  const fullName = customer.full_name || `${customer.last_name || ''} ${customer.first_name || ''}`.trim() || 'Người Dùng';

  return (
    <div className="bg-[#FFFFFF] text-[#2D3E3A] p-8 sm:p-12 max-w-4xl mx-auto print:p-0 font-sans">
      {/* Print action header (hidden during printing) */}
      <div className="print:hidden flex items-center justify-between bg-[#EEF5F3] p-4 rounded-2xl mb-8 border border-[#267D71]/30">
        <div>
          <h2 className="font-bold font-heading text-[#013E37]">Xem Trước Bản Báo Cáo In / PDF</h2>
          <p className="text-xs text-[#5F736E]">Nhấn nút bên phải hoặc phím Ctrl+P để xuất file PDF chất lượng cao.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 btn-primary text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <Printer size={15} />
          <span>In / Tải PDF</span>
        </button>
      </div>

      {/* COVER / HEADER */}
      <div className="border-b-2 border-[#013E37] pb-6 mb-8 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[#267D71] mb-1">
          HỌC VIỆN LIFE MAPS VIỆT NAM
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26] uppercase tracking-tight">
          Bản Đồ Luận Giải Vận Mệnh Life Maps
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#5F736E]">
          <span>Họ và tên: <strong className="text-[#0D2B26] font-heading">{fullName}</strong></span>
          <span>•</span>
          <span>Ngày sinh: <strong className="text-[#0D2B26]">{customer.dob}</strong></span>
          <span>•</span>
          <span>Năm cá nhân: <strong className="text-[#013E37] font-bold">Số {customer.map?.personal_year_current || 9}</strong></span>
        </div>
      </div>

      {/* CORE 3 NUMBERS SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#267D71]/30 rounded-2xl p-4 text-center bg-[#EEF5F3]">
          <div className="text-xs font-bold text-[#013E37] uppercase">Chỉ Số Đường Đời</div>
          <div className="text-3xl font-bold font-heading text-[#013E37] my-1">{customer.map?.life_path}</div>
          <div className="text-[11px] text-[#5F736E]">{layer2.lifePathAnalysis.title}</div>
        </div>
        <div className="border border-[#8C6A81]/30 rounded-2xl p-4 text-center bg-[#FAF8F5]">
          <div className="text-xs font-bold text-[#8C6A81] uppercase">Chỉ Số Sứ Mệnh</div>
          <div className="text-3xl font-bold font-heading text-[#8C6A81] my-1">{customer.map?.expression}</div>
          <div className="text-[11px] text-[#5F736E]">{layer2.expressionAnalysis.title}</div>
        </div>
        <div className="border border-[#F9E79F] rounded-2xl p-4 text-center bg-[#FFEFB3]/40">
          <div className="text-xs font-bold text-[#013E37] uppercase">Chỉ Số Linh Hồn</div>
          <div className="text-3xl font-bold font-heading text-[#013E37] my-1">{customer.map?.heart_desire}</div>
          <div className="text-[11px] text-[#5F736E]">{layer2.heartDesireAnalysis.title}</div>
        </div>
      </div>

      {/* TẦNG 2: CHI TIẾT CON SỐ */}
      <div className="space-y-6 mb-8">
        <div className="border-l-4 border-[#013E37] pl-3">
          <h3 className="text-base font-bold font-heading text-[#0D2B26] uppercase">
            I. Bản Sắc & Năng Lực Nền Tảng (Tầng 2)
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
            <h4 className="font-bold font-heading text-[#0D2B26] mb-1">1. Ý nghĩa Đường Đời {customer.map?.life_path}:</h4>
            <p>{layer2.lifePathAnalysis.content}</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="text-[#013E37]">
                <strong>Thế mạnh:</strong> {layer2.lifePathAnalysis.strengths.join(', ')}
              </div>
              <div className="text-rose-700">
                <strong>Cần rèn luyện:</strong> {layer2.lifePathAnalysis.weaknesses.join(', ')}
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
            <h4 className="font-bold font-heading text-[#0D2B26] mb-1">2. Ý nghĩa Sứ Mệnh {customer.map?.expression}:</h4>
            <p>{layer2.expressionAnalysis.content}</p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E2E8E5]">
            <h4 className="font-bold font-heading text-[#0D2B26] mb-1">3. Ý nghĩa Linh Hồn {customer.map?.heart_desire}:</h4>
            <p>{layer2.heartDesireAnalysis.content}</p>
          </div>
        </div>
      </div>

      {/* TẦNG 3: LUẬN GIẢI ĐA CHIỀU */}
      <div className="space-y-6 mb-8">
        <div className="border-l-4 border-[#267D71] pl-3">
          <h3 className="text-base font-bold font-heading text-[#0D2B26] uppercase">
            II. Luận Giải Đa Chiều & Lộ Trình Chuyển Hóa (Tầng 3)
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
          <div className="p-5 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20">
            <h4 className="font-bold font-heading text-[#013E37] mb-1">1. Ma trận tương tác chéo giữa các chỉ số:</h4>
            <p className="whitespace-pre-line">{layer3.crossSynthesis}</p>
          </div>

          <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200">
            <h4 className="font-bold font-heading text-rose-900 mb-1">2. Điểm nghẽn thách thức & Nợ nghiệp:</h4>
            <p>{layer3.challenges.obstacles}</p>
            <p className="mt-2 text-xs font-semibold text-rose-800">{layer3.challenges.karmicLessons}</p>
          </div>

          <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
            <h4 className="font-bold font-heading text-[#013E37] mb-1">3. Lộ trình hành động 3 bước:</h4>
            <p className="whitespace-pre-line">{layer3.actionRoadmap.actionPlan}</p>
            <div className="mt-3 pt-3 border-t border-[#E2E8E5] text-xs">
              <strong>Định hướng môi trường:</strong> {layer3.actionRoadmap.careerGuide}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER OF PRINT */}
      <div className="border-t border-[#E2E8E5] pt-6 mt-12 text-center text-xs text-[#5F736E] space-y-1">
        <div className="font-bold text-[#013E37] font-heading">TRUNG TÂM KHAI VẤN & PHÂN TÍCH LIFE MAPS</div>
        <div>Hotline: 0912.345.678 • Email: support@lifemaps.vn • Website: https://lifemaps.web.app</div>
        <div className="text-[10px] text-[#93A39F]">© Bản quyền thuộc về Hệ Thống Life Maps.</div>
      </div>
    </div>
  );
}

export default function PrintReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#5F736E]">Đang tải báo cáo...</div>}>
      <PrintContent />
    </Suspense>
  );
}

