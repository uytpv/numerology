'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generate3LayerNumerologyData, formatTitleCase } from '@/lib/numerologyReportGenerator';
import { Printer } from 'lucide-react';

function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const scope = searchParams.get('scope') || 'all'; // 'tab1' | 'tab2' | 'tab3' | 'all'

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id || id === 'demo') {
        setCustomer({
          full_name: 'Nguyễn Văn An',
          first_name: 'An',
          last_name: 'Nguyễn Văn',
          dob: '18/08/1990',
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
          // Local storage fallback
          const localData = localStorage.getItem('lifemaps_current_report');
          if (localData) {
            setCustomer(JSON.parse(localData));
          } else {
            setCustomer({
              full_name: 'Nguyễn Văn An',
              dob: '18/08/1990',
              gender: 'male',
              tier: 'paid',
              map: { life_path: 8, expression: 1, heart_desire: 6, personal_year_current: 9 },
            });
          }
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
    return <div className="p-8 text-center text-[#5F736E]">Đang chuẩn bị bản in PDF...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-[#5F736E]">Không tìm thấy hồ sơ!</div>;
  }

  const { layer1, layer2, layer3 } = generate3LayerNumerologyData(customer);
  const rawName = customer.full_name || `${customer.last_name || ''} ${customer.first_name || ''}`.trim() || 'Người Dùng';
  const fullName = formatTitleCase(rawName);

  const scopeTitle =
    scope === 'tab1'
      ? 'Báo Cáo Bộ Số Tam Giác Vàng'
      : scope === 'tab2'
      ? `Báo Cáo Life Map ${layer2.indicatorsGrid.length} Chỉ Số`
      : scope === 'tab3'
      ? 'Báo Cáo Luận Giải Đa Chiều AI VIP'
      : 'Bản Đồ Luận Giải Vận Mệnh Trọn Bộ';

  return (
    <div className="bg-[#FFFFFF] text-[#2D3E3A] p-8 sm:p-12 max-w-4xl mx-auto print:p-0 font-sans">
      {/* PRINT ACTION HEADER (HIDDEN DURING PRINTING) */}
      <div className="print:hidden flex items-center justify-between bg-[#EEF5F3] p-4 rounded-2xl mb-8 border border-[#267D71]/30">
        <div>
          <h2 className="font-bold font-heading text-[#013E37]">Xem Trước Bản PDF - {scopeTitle}</h2>
          <p className="text-xs text-[#5F736E]">Nhấn nút bên phải hoặc bấm phím Ctrl+P để tải file PDF chất lượng cao.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 btn-primary text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2"
        >
          <Printer size={15} />
          <span>In / Tải File PDF</span>
        </button>
      </div>

      {/* COVER / HEADER */}
      <div className="border-b-2 border-[#013E37] pb-6 mb-8 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[#267D71] mb-1">
          HỌC VIỆN LIFE MAPS VIỆT NAM
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26] uppercase tracking-tight">
          {scopeTitle}
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#5F736E]">
          <span>Họ và tên: <strong className="text-[#0D2B26] font-heading">{fullName}</strong></span>
          <span>•</span>
          <span>Ngày sinh: <strong className="text-[#0D2B26]">{customer.dob}</strong></span>
          <span>•</span>
          <span>Năm cá nhân: <strong className="text-[#013E37] font-bold">Số {customer.map?.personal_year_current || 9}</strong></span>
        </div>
      </div>

      {/* TAB 1 CONTENT: GOLDEN TRIANGLE */}
      {(scope === 'tab1' || scope === 'all') && (
        <div className="mb-10">
          <div className="border-l-4 border-[#013E37] pl-3 mb-4">
            <h3 className="text-base font-bold font-heading text-[#0D2B26] uppercase">
              Bộ Số Tam Giác Vàng Cốt Lõi
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border border-[#267D71]/30 rounded-2xl p-4 text-center bg-[#EEF5F3]">
              <div className="text-xs font-bold text-[#013E37] uppercase">Chỉ Số Đường Đời</div>
              <div className="text-3xl font-bold font-heading text-[#013E37] my-1">{customer.map?.life_path}</div>
              <div className="text-[11px] text-[#5F736E]">{layer1.life_path.name}</div>
            </div>
            <div className="border border-[#8C6A81]/30 rounded-2xl p-4 text-center bg-[#FAF8F5]">
              <div className="text-xs font-bold text-[#8C6A81] uppercase">Chỉ Số Sứ Mệnh</div>
              <div className="text-3xl font-bold font-heading text-[#8C6A81] my-1">{customer.map?.expression}</div>
              <div className="text-[11px] text-[#5F736E]">{layer1.expression.name}</div>
            </div>
            <div className="border border-[#F9E79F] rounded-2xl p-4 text-center bg-[#FFEFB3]/40">
              <div className="text-xs font-bold text-[#013E37] uppercase">Chỉ Số Linh Hồn</div>
              <div className="text-3xl font-bold font-heading text-[#013E37] my-1">{customer.map?.heart_desire}</div>
              <div className="text-[11px] text-[#5F736E]">{layer1.heart_desire.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 CONTENT: LIFE MAP 4 KHỐI KỂ CHUYỆN & KIM TỰ THÁP */}
      {(scope === 'tab2' || scope === 'all') && (
        <div className="mb-10 space-y-6">
          <div className="border-l-4 border-[#013E37] pl-3 mb-2">
            <h3 className="text-base font-bold font-heading text-[#0D2B26] uppercase">
              Bản Đồ Năng Lượng Life Map 4 Khối Kể Chuyện & Sơ Đồ Kim Tự Tháp
            </h3>
          </div>

          {/* KHỐI 1 */}
          <div className="border border-[#013E37]/30 rounded-2xl p-4 bg-[#FFFFFF]">
            <div className="text-xs font-bold text-[#267D71] uppercase mb-1">Khối 1: Căn Cước Năng Lượng (Hạt Nhân Bản Sắc)</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {layer2.indicatorsGrid.filter(i => ['lp', 'exp', 'hd', 'per', 'lpe', 'hdp'].includes(i.id)).map((item) => (
                <div key={item.id} className="border border-[#E2E8E5] rounded-xl p-2.5 bg-[#FAF8F5]">
                  <div className="text-xl font-bold font-heading text-[#013E37]">{item.number}</div>
                  <div className="text-[10px] font-bold uppercase text-[#0D2B26] font-heading mt-0.5">{item.title}</div>
                  <div className="text-[9px] text-[#5F736E] leading-tight mt-1 line-clamp-2">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI 2 */}
          <div className="border border-[#267D71]/30 rounded-2xl p-4 bg-[#FFFFFF]">
            <div className="text-xs font-bold text-[#267D71] uppercase mb-1">Khối 2: Bộ Công Cụ & Phản Xạ Hành Vi</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {layer2.indicatorsGrid.filter(i => ['dob', 'rat', 'att', 'bal', 'pas', 'sub'].includes(i.id)).map((item) => (
                <div key={item.id} className="border border-[#E2E8E5] rounded-xl p-2.5 bg-[#FAF8F5]">
                  <div className="text-xl font-bold font-heading text-[#267D71]">{item.number}</div>
                  <div className="text-[10px] font-bold uppercase text-[#0D2B26] font-heading mt-0.5">{item.title}</div>
                  <div className="text-[9px] text-[#5F736E] leading-tight mt-1 line-clamp-2">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI 3 */}
          <div className="border border-[#8C6A81]/40 rounded-2xl p-4 bg-[#FFFFFF]">
            <div className="text-xs font-bold text-[#8C6A81] uppercase mb-1">Khối 3: Vùng Trũng & Phát Triển (Thiếu, Bài Học, Trưởng Thành, Thế Hệ)</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {layer2.indicatorsGrid.filter(i => ['kar', 'les', 'mat', 'gen'].includes(i.id)).map((item) => (
                <div key={item.id} className="border border-[#8C6A81]/30 rounded-xl p-2.5 bg-[#FAF8F5]">
                  <div className="text-xl font-bold font-heading text-[#8C6A81]">{item.number}</div>
                  <div className="text-[10px] font-bold uppercase text-[#0D2B26] font-heading mt-0.5">{item.title}</div>
                  <div className="text-[9px] text-[#5F736E] leading-tight mt-1 line-clamp-2">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI 4: TIMELINE & KIM TỰ THÁP */}
          <div className="border border-[#F9E79F] rounded-2xl p-4 bg-[#FFFFFF] space-y-4">
            <div className="text-xs font-bold text-[#013E37] uppercase">Khối 4: Dòng Chảy Định Mệnh & Sơ Đồ Kim Tự Tháp 4 Đỉnh Cao</div>
            
            {/* Timeline */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E8E5]">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span>Năm {layer2.shortTermTimeline.currentYear} (Năm CN {layer2.shortTermTimeline.personalYear})</span>
                <span>Tháng {layer2.shortTermTimeline.currentMonth} (Tháng CN {layer2.shortTermTimeline.personalMonth})</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {layer2.shortTermTimeline.days.map((d: any, idx: number) => (
                  <div key={idx} className={`p-1.5 rounded-lg border text-xs ${d.isToday ? 'bg-[#013E37] text-white font-bold' : 'bg-white'}`}>
                    <div className="text-[9px]">{d.dayOfWeek}</div>
                    <div className="font-semibold text-[10px]">{d.dateFormatted}</div>
                    <div className={`text-[8px] mt-0.5 ${d.isToday ? 'text-[#FFEFB3]' : 'text-[#267D71]'}`}>Số {d.personalDay}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pyramid */}
            <div className="text-center py-2">
              <div className="text-xs font-bold text-[#0D2B26] mb-2">Sơ Đồ Kim Tự Tháp 4 Đỉnh Cao & Thách Thức</div>
              <div className="flex flex-col items-center space-y-2 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-xl bg-[#013E37] text-white flex flex-col items-center justify-center font-bold border border-[#FFEFB3]">
                  <span className="text-sm font-extrabold" style={{ color: '#FFEFB3' }}>{layer2.pyramidData.pinnacle[3]}</span>
                  <span className="text-[7px]" style={{ color: '#FFEFB3' }}>Đỉnh 4 ({layer2.pyramidData.age[3]}+)</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#013E37] text-white border border-[#FFEFB3] flex flex-col items-center justify-center font-bold">
                  <span className="text-sm font-extrabold" style={{ color: '#FFEFB3' }}>{layer2.pyramidData.pinnacle[2]}</span>
                  <span className="text-[7px]" style={{ color: '#FFEFB3' }}>Đỉnh 3 ({layer2.pyramidData.age[2]}-{layer2.pyramidData.age[3]})</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#013E37] text-white border border-[#FFEFB3] flex flex-col items-center justify-center font-bold">
                    <span className="text-sm font-extrabold" style={{ color: '#FFEFB3' }}>{layer2.pyramidData.pinnacle[0]}</span>
                    <span className="text-[7px]" style={{ color: '#FFEFB3' }}>Đỉnh 1 ({layer2.pyramidData.age[0]})</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#013E37] text-white border border-[#FFEFB3] flex flex-col items-center justify-center font-bold">
                    <span className="text-sm font-extrabold" style={{ color: '#FFEFB3' }}>{layer2.pyramidData.pinnacle[1]}</span>
                    <span className="text-[7px]" style={{ color: '#FFEFB3' }}>Đỉnh 2 ({layer2.pyramidData.age[1]})</span>
                  </div>
                </div>
                <div className="flex gap-2 py-1 text-xs text-[#5F736E] border-y border-dashed border-[#E2E8E5] w-full justify-center">
                  <span>Tháng: <strong>{layer2.pyramidData.root[0]}</strong></span>
                  <span>• Ngày: <strong>{layer2.pyramidData.root[1]}</strong></span>
                  <span>• Năm: <strong>{layer2.pyramidData.root[2]}</strong></span>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#8C6A81] text-[#8C6A81] flex flex-col items-center justify-center font-bold">
                    <span className="text-sm font-extrabold">{layer2.pyramidData.challenge[0]}</span>
                    <span className="text-[7px]">Thách Thức 1</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#8C6A81] text-[#8C6A81] flex flex-col items-center justify-center font-bold">
                    <span className="text-sm font-extrabold">{layer2.pyramidData.challenge[1]}</span>
                    <span className="text-[7px]">Thách Thức 2</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#8C6A81] text-[#8C6A81] flex flex-col items-center justify-center font-bold">
                  <span className="text-sm font-extrabold">{layer2.pyramidData.challenge[2]}</span>
                  <span className="text-[7px]">Thách Thức 3</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF5FF] border-2 border-[#8C6A81] text-[#8C6A81] flex flex-col items-center justify-center font-bold">
                  <span className="text-sm font-extrabold">{layer2.pyramidData.challenge[3]}</span>
                  <span className="text-[7px]">Thách Thức 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 CONTENT: DEEP MULTI-DIMENSIONAL AI ANALYSIS */}
      {(scope === 'tab3' || scope === 'all') && (
        <div className="space-y-6 mb-8">
          <div className="border-l-4 border-[#8C6A81] pl-3">
            <h3 className="text-base font-bold font-heading text-[#0D2B26] uppercase">
              Luận Giải Đa Chiều AI & Lộ Trình Chuyển Hóa
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#2D3E3A] leading-relaxed">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
              <h4 className="font-bold font-heading text-[#0D2B26] mb-1">1. Phân Tích Giới Tính & Độ Tuổi:</h4>
              <p>{layer3.genderAgeAnalysis.insights}</p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
              <h4 className="font-bold font-heading text-[#0D2B26] mb-1">2. Dự Báo Năm Thế Giới & Tháng Thế Giới:</h4>
              <p>{layer3.worldCycleAnalysis.forecast}</p>
            </div>

            <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20">
              <h4 className="font-bold font-heading text-[#013E37] mb-1">3. Ma trận tương tác chéo giữa các chỉ số:</h4>
              <p className="whitespace-pre-line">{layer3.crossSynthesis}</p>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200">
              <h4 className="font-bold font-heading text-rose-900 mb-1">4. Điểm nghẽn thách thức & Nợ nghiệp:</h4>
              <p>{layer3.challenges.obstacles}</p>
              <p className="mt-2 text-xs font-semibold text-rose-800">{layer3.challenges.karmicLessons}</p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5]">
              <h4 className="font-bold font-heading text-[#013E37] mb-1">5. Lộ trình hành động 3 bước:</h4>
              <p className="whitespace-pre-line">{layer3.actionRoadmap.actionPlan}</p>
              <div className="mt-3 pt-3 border-t border-[#E2E8E5] text-xs">
                <strong>Định hướng môi trường:</strong> {layer3.actionRoadmap.careerGuide}
              </div>
            </div>
          </div>
        </div>
      )}

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
