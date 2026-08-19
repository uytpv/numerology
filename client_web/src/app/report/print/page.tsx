'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { generate3LayerNumerologyData, formatTitleCase } from '@/lib/numerologyReportGenerator';
import { generateMultiIndicatorSynthesis } from '@/lib/multiIndicatorSynthesis';
import { validateAndSanitizeReportData } from '@/lib/reportSemanticValidator';
import { NameAuditAppendix } from '@/components/NameAuditAppendix';
import { ReadingProfileId, READING_PROFILES } from '@/lib/adaptiveReadingProfiles';
import { Printer, CheckCircle2 } from 'lucide-react';

function PrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const scope = searchParams.get('scope') || 'all'; // 'tab1' | 'tab2' | 'tab3' | 'all'
  const profileParam = (searchParams.get('profile') as ReadingProfileId) || 'executive';
  const currentProfileConfig = READING_PROFILES[profileParam] || READING_PROFILES.executive;

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
  const { sanitizedReport } = validateAndSanitizeReportData({ userInfo: customer, layer1, layer2, layer3 });

  const rawName = customer.full_name || `${customer.last_name || ''} ${customer.first_name || ''}`.trim() || 'Người Dùng';
  const fullName = formatTitleCase(rawName);

  const getIndNum = (id: string, fallback: number): number => {
    const item = layer2.indicatorsGrid.find(i => i.id === id);
    if (!item) return fallback;
    const num = parseInt(item.number, 10);
    return isNaN(num) ? fallback : num;
  };

  const synthesis = generateMultiIndicatorSynthesis({
    fullName,
    birthDate: customer.dob || '27/08/1980',
    lifePath: getIndNum('lp', 8),
    expression: getIndNum('exp', 6),
    soul: getIndNum('hd', 7),
    personality: getIndNum('per', 8),
    attitude: getIndNum('att', 8),
    karmicLessons: customer.map?.missing_numbers || [6],
    challenges: [1, 1, 0, 0],
    personalYear: customer.map?.personal_year_current || 9,
    rationalThought: getIndNum('rat', 1),
    balance: getIndNum('bal', 7),
    hiddenPassion: getIndNum('pas', 3),
    maturity: getIndNum('mat', 5),
  });

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
      <style jsx global>{`
        @page {
          margin: 12mm 15mm;
          size: A4 portrait;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            color: #2D3E3A !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

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
          HỆ THỐNG THẦN SỐ HỌC PYTHAGORAS VIỆT NAM
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#0D2B26] uppercase tracking-tight">
          {scopeTitle}
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#267D71]/30 text-xs font-bold text-[#013E37]">
          <span>{currentProfileConfig.icon}</span>
          <span>Định Dạng: {currentProfileConfig.name}</span>
          <span>•</span>
          <span className="text-[#5F736E]">{currentProfileConfig.pageCount}</span>
        </div>
        <div className="mt-2 text-xs text-[#5F736E] italic max-w-xl mx-auto">
          {currentProfileConfig.tagline}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#5F736E]">
          <span>Họ và tên: <strong className="text-[#0D2B26] font-heading">{fullName}</strong></span>
          <span>•</span>
          <span>Ngày sinh: <strong className="text-[#0D2B26]">{customer.dob}</strong></span>
          <span>•</span>
          <span>Năm cá nhân: <strong className="text-[#013E37] font-bold">Số {customer.map?.personal_year_current || 9}</strong></span>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY 1-PAGE CORE MAP */}
      {(scope === 'tab3' || scope === 'all') && (
        <div className="mb-8 p-6 bg-[#FAF8F5] rounded-3xl border-2 border-[#013E37]/20 print:break-after-page space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#267D71]">Executive Summary</span>
              <h2 className="text-xl font-bold font-heading text-[#013E37]">Bản Đồ Cốt Lõi (Core Map) Của {fullName}</h2>
            </div>
            <span className="px-3 py-1 bg-[#013E37] text-[#FFEFB3] rounded-full text-xs font-bold font-mono">
              LM-PY-2026.02
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-emerald-100 space-y-2">
              <div className="font-bold text-[#013E37] text-xs uppercase flex items-center gap-1.5">
                <span>🌟 3 Trục Năng Lực Cốt Lõi:</span>
              </div>
              <ul className="space-y-1.5 text-[#2D3E3A]">
                {synthesis.executiveSummary.coreStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-[#267D71]">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 space-y-2">
              <div className="font-bold text-[#8C6A81] text-xs uppercase flex items-center gap-1.5">
                <span>⚖️ 2 Điểm Căng Kéo Cần Điều Hòa:</span>
              </div>
              <ul className="space-y-1.5 text-[#2D3E3A]">
                {synthesis.executiveSummary.internalTensions.map((ten, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-[#8C6A81]">•</span>
                    <span>{ten}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/20 space-y-1">
              <div className="font-bold text-[#013E37] uppercase text-[11px]">🌱 Chủ Đề Rèn Luyện & Vun Bồi:</div>
              <p className="text-[#2D3E3A] font-medium">{synthesis.executiveSummary.growthTheme}</p>
            </div>
            <div className="p-3.5 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] space-y-1">
              <div className="font-bold text-[#013E37] uppercase text-[11px]">⏳ Chu Kỳ & Trọng Tâm Năm Hiện Tại:</div>
              <p className="text-[#013E37] font-medium">{synthesis.executiveSummary.currentCycleStrategy}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* TAB 3 CONTENT: 30+ PAGE VIP NUMEROLOGY MASTER BOOK */}
      {(scope === 'tab3' || scope === 'all') && (
        <div className="space-y-10 mb-8">
          {/* TRANG BÌA SÁCH (COVER PAGE) */}
          <div className="p-12 sm:p-16 rounded-3xl bg-[#013E37] text-white text-center space-y-6 shadow-2xl relative overflow-hidden print:break-after-page print:min-h-[90vh] print:flex print:flex-col print:justify-between">
            <div className="space-y-3">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFEFB3] text-[#013E37] text-xs font-extrabold uppercase tracking-widest shadow-md">
                BẢN ĐỒ VẬN MỆNH ĐỘC BẢN VIP • LIFE MAP FOR SUCCESS
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#FFEFB3] tracking-tight">
                CUỐN SÁCH VẬN MỆNH & KHAI VẤN CHUYỂN HÓA
              </h1>
              <p className="text-sm sm:text-base text-[#E2E8E5] max-w-xl mx-auto italic">
                “Thấu suốt bản thân • Làm chủ vận mệnh • Kiến tạo thịnh vượng bền vững”
              </p>
            </div>

            <div className="my-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-md mx-auto space-y-2 text-left">
              <div className="text-xs text-[#FFEFB3] uppercase tracking-wider font-bold">Hồ sơ người đọc:</div>
              <div className="text-lg font-bold text-white">{fullName}</div>
              <div className="text-xs text-[#E2E8E5] flex justify-between">
                <span>Ngày sinh: <strong>{customer?.dob || '18/08/1990'}</strong></span>
                <span>Giới tính: <strong>{layer3.genderAgeAnalysis.gender}</strong></span>
              </div>
              <div className="text-xs text-[#E2E8E5] flex justify-between pt-1 border-t border-white/20">
                <span>Đường Đời: <strong>{layer2.lifePathAnalysis.number}</strong></span>
                <span>Sứ Mệnh: <strong>{layer2.expressionAnalysis.number}</strong></span>
                <span>Linh Hồn: <strong>{layer2.heartDesireAnalysis.number}</strong></span>
              </div>
            </div>

            <div className="text-xs text-[#E2E8E5]/70 space-y-1">
              <div>Hệ Thần Số Học: <strong>Pythagoras Cổ Điển & Khai Vấn Tâm Lý ICF</strong></div>
              <div>Bản quyền tài liệu thuộc về Hệ Thống Life Maps © 2026</div>
            </div>
          </div>

          {/* MỤC LỤC SÁCH */}
          <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E2E8E5] space-y-4 print:break-after-page">
            <h3 className="text-lg font-bold font-heading text-[#013E37] uppercase border-b border-[#E2E8E5] pb-2">
              Mục Lục Cuốn Sách Vận Mệnh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#2D3E3A]">
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Bảng Tra Cứu:</strong> Minh Bạch Dữ Liệu & Công Thức 21 Chỉ Số
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần I:</strong> Bức Tranh Tổng Quan Vận Mệnh
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần II:</strong> Bản Đồ Bản Thân (Con đường & Sứ mệnh)
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần III:</strong> Nhu Cầu Bên Trong & Hình Ảnh Bên Ngoài
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần IV:</strong> Bộ Công Cụ & Năng Lực Vận Hành
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần V:</strong> Bài Học Phát Triển & Vùng Trũng
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần VI:</strong> Kim Tự Tháp 4 Đỉnh Cao & Trưởng Thành
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần VII:</strong> Trọng Tâm Hiện Tại & Nhịp Thời Gian
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần VIII:</strong> Giải Pháp Khai Vấn Cho Trọng Tâm Đã Chọn
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2E8E5]">
                <strong>Phần IX:</strong> Kế Hoạch Ưu Tiên Chuyển Hóa & Lời Kết
              </div>
            </div>
          </div>

          {/* BẢNG MINH BẠCH DỮ LIỆU & CÔNG THỨC 21 CHỈ SỐ */}
          <div className="p-6 rounded-2xl bg-white border border-[#267D71]/40 space-y-4 print:break-after-page">
            <div className="flex justify-between items-center border-b border-[#E2E8E5] pb-2">
              <h3 className="text-base font-bold font-heading text-[#013E37] uppercase">
                Bảng Minh Bạch Dữ Liệu Đầu Vào & Công Thức Tính Toán
              </h3>
              <span className="text-xs text-[#5F736E]">Tham chiếu: {layer3.structuredReport.transparencyTable.referenceDate}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#E2E8E5]">
              <div>
                <strong>Họ tên:</strong> {layer3.structuredReport.transparencyTable.fullName} ({layer3.structuredReport.transparencyTable.normalizedName})
                <div className="text-[10px] text-[#5F736E] mt-0.5">{layer3.structuredReport.transparencyTable.expressionBreakdown}</div>
              </div>
              <div>
                <strong>Ngày sinh:</strong> {layer3.structuredReport.transparencyTable.dob} (Giới tính: {layer3.structuredReport.transparencyTable.gender})
                <div className="text-[10px] text-[#5F736E] mt-0.5">{layer3.structuredReport.transparencyTable.lifePathBreakdown}</div>
              </div>
            </div>

            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#EEF5F3] text-[#013E37] font-bold border-b border-[#E2E8E5]">
                  <th className="p-1.5">Chỉ Số</th>
                  <th className="p-1.5 text-center">Số</th>
                  <th className="p-1.5">Công Thức</th>
                  <th className="p-1.5">Nguồn</th>
                  <th className="p-1.5">Ý Nghĩa Ngắn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5]">
                {layer3.structuredReport.transparencyTable.indicators.map((ind: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-1.5 font-semibold text-[#0D2B26]">{ind.name}</td>
                    <td className="p-1.5 text-center font-bold text-[#013E37]">{ind.value}</td>
                    <td className="p-1.5 text-[#5F736E] font-mono text-[10px]">{ind.formula}</td>
                    <td className="p-1.5 text-[#5F736E]">{ind.source}</td>
                    <td className="p-1.5 text-[#2D3E3A]">{ind.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GHI CHÚ PHƯƠNG PHÁP LUẬN BẢO TOÀN TÍNH NHẤT QUÁN */}
            <div className="p-3 bg-[#EEF5F3]/60 rounded-xl border border-[#267D71]/20 text-[10px] text-[#2D3E3A]">
              <strong className="text-[#013E37]">Lưu ý phương pháp luận Pythagoras:</strong> Chỉ số Thiếu (Karmic Lessons) là danh sách các chữ số từ 1 đến 9 không xuất hiện trong chuỗi chữ cái họ tên khai sinh. Chỉ số này phản ánh nhóm kỹ năng cần chú tâm rèn luyện có chủ đích, hoàn toàn không suy ra từ ngày sinh và không mâu thuẫn hay phủ định các chỉ số khác có giá trị rút gọn bằng 1.
            </div>
          </div>

          {/* PHẦN I: BỨC TRANH TỔNG QUAN & TỔNG HÒA ĐA CHIỀU */}
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="text-base sm:text-lg font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#8C6A81] pl-3">
              Phần I: Bức Tranh Tổng Hòa Bản Thân & Ma Trận Đa Chiều
            </h3>

            {/* 3 THẾ MẠNH */}
            <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-3 text-xs sm:text-sm leading-relaxed">
              <div className="font-bold text-[#013E37] uppercase text-xs tracking-wider">
                1. 3 Thế Mạnh Nổi Bật (Tổ Hợp Năng Lượng Cốt Lõi):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {synthesis.strengths.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#E2E8E5] space-y-1.5">
                    <div className="font-bold text-[#013E37] text-xs">{item.title}</div>
                    <div className="text-[11px] text-[#267D71] font-semibold">{item.indicators}</div>
                    <p className="text-[11px] text-[#4A5D58]">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* 2 CĂNG KÉO */}
              <div className="font-bold text-[#8C6A81] uppercase text-xs tracking-wider pt-2 border-t border-[#E2E8E5]">
                2. 2 Căng Kéo Nội Tại Cần Dung Hòa:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {synthesis.tensions.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF5FF] rounded-xl border border-[#8C6A81]/30 space-y-1.5">
                    <div className="font-bold text-[#8C6A81] text-xs">{item.title}</div>
                    <p className="text-[11px] text-[#4A5D58]">{item.description}</p>
                    <div className="text-[11px] text-[#013E37] bg-white p-2 rounded-lg border border-[#8C6A81]/20">
                      <strong>Giải pháp:</strong> {item.solution}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2 VÙNG RÈN & 1 TRỌNG TÂM NĂM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8E5]">
                <div className="p-3 bg-white rounded-xl border border-[#E2E8E5] space-y-2">
                  <div className="font-bold text-[#013E37] text-xs uppercase">3. 2 Vùng Rèn Luyện Chủ Đích:</div>
                  {synthesis.growthFocuses.map((item, idx) => (
                    <div key={idx} className="text-[11px] text-[#4A5D58]">
                      <strong>• {item.title}:</strong> {item.guidance}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#FFEFB3] space-y-1.5">
                  <div className="font-bold text-[#013E37] text-xs uppercase">4. Trọng Tâm Chiến Lược Năm Hiện Tại:</div>
                  <div className="text-xs font-bold text-[#013E37]">{synthesis.currentYearFocus.title}</div>
                  <ul className="list-disc pl-4 text-[11px] text-[#2D3E3A] space-y-0.5">
                    {synthesis.currentYearFocus.actionPriorities.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN II: CON ĐƯỜNG VÀ SỨ MỆNH */}
          <div className="space-y-4 print:break-after-page">
            <h3 className="text-base font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#267D71] pl-3">
              Phần II: Con Đường & Sứ Mệnh (Life Path & Expression)
            </h3>
            <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/30 text-xs text-[#013E37] leading-relaxed">
              {layer3.structuredReport.selfMap.pathAndDestiny.synthesis}
            </div>

            {/* FULL DETAIL CARDS: LIFE PATH, EXPRESSION, BRIDGE */}
            <div className="space-y-4">
              {[
                layer3.structuredReport.selfMap.pathAndDestiny.lifePath,
                layer3.structuredReport.selfMap.pathAndDestiny.expression,
                layer3.structuredReport.selfMap.pathAndDestiny.bridge,
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-3 text-[13px] sm:text-sm leading-relaxed">
                  <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-2.5">
                    <span className="font-bold text-base text-[#013E37] font-heading">
                      {item.indicator_name} - Năng Lượng Số {item.number}
                    </span>
                    <span className="px-2.5 py-1 bg-[#013E37] text-[#FFEFB3] rounded-lg font-bold text-xs">
                      Con số {item.number}
                    </span>
                  </div>
                  <p><strong>Năng lượng cốt lõi:</strong> {item.core_energy}</p>
                  <p className="whitespace-pre-line text-[#2D3E3A]">{item.full_description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8E5]">
                      <strong className="text-emerald-900">Mặt phát huy:</strong> {item.positive_traits?.join(', ')}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8E5]">
                      <strong className="text-amber-900">Mặt bóng / Lưu ý:</strong> {item.shadow_traits?.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN III: NHU CẦU BÊN TRONG VÀ HÌNH ẢNH BÊN NGOÀI */}
          <div className="space-y-4 print:break-after-page">
            <h3 className="text-lg font-bold font-heading text-[#8C6A81] uppercase border-l-4 border-[#8C6A81] pl-3">
              Phần III: Nhu Cầu Bên Trong & Hình Ảnh Bên Ngoài (Soul & Personality)
            </h3>
            <div className="p-4 sm:p-5 bg-[#FAF5FF] rounded-2xl border border-[#8C6A81]/30 text-sm text-[#8C6A81] leading-relaxed">
              {layer3.structuredReport.selfMap.innerAndOuter.synthesis}
            </div>

            <div className="space-y-4">
              {[
                layer3.structuredReport.selfMap.innerAndOuter.heartDesire,
                layer3.structuredReport.selfMap.innerAndOuter.personality,
                layer3.structuredReport.selfMap.innerAndOuter.bridge,
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-3 text-[13px] sm:text-sm leading-relaxed">
                  <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-2.5">
                    <span className="font-bold text-base text-[#8C6A81] font-heading">
                      {item.indicator_name} - Năng Lượng Số {item.number}
                    </span>
                    <span className="px-2.5 py-1 bg-[#8C6A81] text-white rounded-lg font-bold text-xs">
                      Con số {item.number}
                    </span>
                  </div>
                  <p><strong>Năng lượng cốt lõi:</strong> {item.core_energy}</p>
                  <p className="whitespace-pre-line text-[#2D3E3A]">{item.full_description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8E5]">
                      <strong className="text-emerald-900">Mặt phát huy:</strong> {item.positive_traits?.join(', ')}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8E5]">
                      <strong className="text-amber-900">Mặt bóng:</strong> {item.shadow_traits?.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN IV: BỘ CÔNG CỤ & NĂNG LỰC VẬN HÀNH */}
          <div className="space-y-4 print:break-after-page">
            <h3 className="text-lg font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#013E37] pl-3">
              Phần IV: Năng Lực Vận Hành & Phản Xạ Hành Vi
            </h3>
            <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] text-sm text-[#2D3E3A] leading-relaxed">
              {layer3.structuredReport.selfMap.operatingCapacity.synthesis}
            </div>

            <div className="space-y-4">
              {[
                layer3.structuredReport.selfMap.operatingCapacity.birthday,
                layer3.structuredReport.selfMap.operatingCapacity.rationalThought,
                layer3.structuredReport.selfMap.operatingCapacity.attitude,
                layer3.structuredReport.selfMap.operatingCapacity.subconscious,
                layer3.structuredReport.selfMap.operatingCapacity.generation,
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2.5 text-[13px] sm:text-sm leading-relaxed">
                  <div className="font-bold text-[#013E37] text-sm uppercase border-b border-[#E2E8E5] pb-1.5">
                    Chỉ số {item.indicator_name} (Số {item.number})
                  </div>
                  <p className="text-[#2D3E3A] whitespace-pre-line">{item.full_description}</p>
                  <div className="p-3 bg-white rounded-xl text-xs sm:text-sm text-[#2D3E3A] border border-[#E2E8E5]">
                    <strong>Ứng dụng thực tế:</strong> {item.career_guidance || item.decision_making || item.money_management}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN V & VI: BÀI HỌC PHÁT TRIỂN & KIM TỰ THÁP */}
          <div className="space-y-4 print:break-after-page">
            <h3 className="text-lg font-bold font-heading text-[#8C6A81] uppercase border-l-4 border-[#8C6A81] pl-3">
              Phần V & VI: Bài Học Phát Triển & Sơ Đồ Kim Tự Tháp 4 Đỉnh Cao
            </h3>
            <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] text-sm text-[#2D3E3A] leading-relaxed space-y-2">
              <p>{layer3.structuredReport.growthLessons.pointsToTrain.synthesis}</p>
              <p>{layer3.structuredReport.growthLessons.longTermGrowth.synthesis}</p>
            </div>

            <div className="space-y-3">
              {[
                layer3.structuredReport.growthLessons.pointsToTrain.karmicLessons,
                ...(layer3.structuredReport.growthLessons.pointsToTrain.karmicDebt ? [layer3.structuredReport.growthLessons.pointsToTrain.karmicDebt] : []),
                layer3.structuredReport.growthLessons.pointsToTrain.balance,
                layer3.structuredReport.growthLessons.longTermGrowth.maturity,
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E2E8E5] space-y-2.5 text-[13px] sm:text-sm leading-relaxed">
                  <div className="font-bold text-[#8C6A81] text-sm uppercase border-b border-[#E2E8E5] pb-1.5">
                    {item.indicator_name} - Năng Lượng Số {item.number}
                  </div>
                  <p className="text-[#2D3E3A] whitespace-pre-line">{item.full_description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN VII: TRỌNG TÂM HIỆN TẠI */}
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="text-lg font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#FFEFB3] pl-3">
              Phần VII: Trọng Tâm Hiện Tại & Nhịp Thời Gian (Năm Cá Nhân & Chu Kỳ Phát Triển)
            </h3>
            <div className="p-4 sm:p-5 bg-[#FFFDF5] rounded-2xl border border-[#FFEFB3] text-sm text-[#013E37] leading-relaxed">
              {layer3.structuredReport.currentFocus.synthesis}
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2E8E5] space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-[#013E37]">
                Năm Cá Nhân Số {layer3.structuredReport.currentFocus.personalYear.number}:
              </div>
              <p className="text-[#4A5D58] leading-relaxed">
                {layer3.structuredReport.currentFocus.personalYear.core_energy}
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#267D71]/20 text-xs text-[#013E37]">
                💡 <em>Lưu ý: Chuỗi chu kỳ Tháng & Ngày Cá Nhân được tích hợp chi tiết trong module Lịch Năng Lượng Cá Nhân dành cho chuyên gia và tài khoản Coach.</em>
              </div>
            </div>
          </div>

          {/* PHẦN VIII: GIẢI PHÁP CHO CÁC VẤN ĐỀ TRỌNG TÂM */}
          <div className="space-y-4 print:break-after-page">
            <h3 className="text-base font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#267D71] pl-3">
              Phần VIII: Giải Pháp Khai Vấn Cho Trọng Tâm Đã Chọn & Checklist Thẩm Định
            </h3>

            <div className="space-y-4">
              {layer3.structuredReport.solutionsForConcerns.topics.map((topic: any, idx: number) => (
                <div key={idx} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#267D71]/30 space-y-3 text-xs">
                  <div className="font-bold text-sm text-[#013E37] flex items-center gap-2 border-b border-[#E2E8E5] pb-2">
                    <span>{topic.icon}</span>
                    <span>{topic.title}</span>
                  </div>
                  <p className="italic text-[#5F736E]">Nỗi đau trăn trở: {topic.coreConcern}</p>
                  
                  {topic.disclaimer && (
                    <div className="p-2.5 bg-blue-50 text-blue-950 rounded-lg border border-blue-200 text-[11px] italic">
                      {topic.disclaimer}
                    </div>
                  )}

                  <p><strong>Xu hướng từ biểu đồ:</strong> {topic.trendFromChart}</p>
                  <p><strong>Nguồn lực nội tại:</strong> {topic.internalResources}</p>
                  <p className="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <strong>Rủi ro & điểm mù:</strong> {topic.blindSpotsAndRisks}
                  </p>

                  {topic.checklist && topic.checklist.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8E5] space-y-1">
                      <div className="font-bold text-[#013E37] text-[11px]">📋 Checklist Thẩm Định Thực Tế:</div>
                      <ul className="list-disc pl-4 text-[11px] text-[#2D3E3A] space-y-0.5">
                        {topic.checklist.map((item: string, cIdx: number) => (
                          <li key={cIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-white rounded border border-[#E2E8E5]">
                      <strong>7 ngày:</strong> {topic.action7Days}
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E2E8E5]">
                      <strong>30 ngày:</strong> {topic.action30Days}
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E2E8E5]">
                      <strong>90 ngày:</strong> {topic.action90Days}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#5F736E]">
                    <span>Đo lường: <strong>{topic.progressMetric}</strong> • Chuyên gia: <strong>{topic.whenToSeekExpert}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN IX: KẾ HOẠCH ƯU TIÊN, LỜI KẾT & CÂU HỎI LÀM RÕ */}
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="text-base font-bold font-heading text-[#013E37] uppercase border-l-4 border-[#013E37] pl-3">
              Phần IX: Kế Hoạch Ưu Tiên Chuyển Hóa & Lời Kết
            </h3>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#013E37]">Top 3 Nhiệm Vụ Ưu Tiên:</div>
              {layer3.structuredReport.priorityPlan.priorities.map((p: any, idx: number) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-[#E2E8E5] space-y-1">
                  <div className="font-bold text-[#267D71]">{idx + 1}. {p.action}</div>
                  <div className="text-[11px] text-[#5F736E]">Thời hạn: {p.frequencyOrDeadline} • Tiêu chí: {p.completionCriteria}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#EEF5F3] rounded-2xl border border-[#267D71]/30 text-xs text-[#013E37] space-y-2">
              <div className="font-bold">5 Câu Hỏi Tự Vấn Khai Sáng:</div>
              <ul className="list-disc pl-5 space-y-1">
                {layer3.structuredReport.clarifyingQuestions.map((q: string, idx: number) => (
                  <li key={idx} className="italic">{q}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-[#013E37] text-[#FFEFB3] rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2">
              <div className="font-bold text-sm uppercase">{layer3.structuredReport.closingRemark.title}</div>
              <p className="text-white/90">{layer3.structuredReport.closingRemark.content}</p>
            </div>
          </div>

          {/* PHỤ LỤC KIỂM TOÁN HỌ TÊN PYTHAGORAS */}
          <div className="print:break-before-page">
            <NameAuditAppendix
              fullName={fullName}
              birthDate={customer.dob || '27/08/1980'}
              lifePath={getIndNum('lp', 8)}
              expression={getIndNum('exp', 6)}
              soul={getIndNum('hd', 7)}
              personality={getIndNum('per', 8)}
              hiddenPassion={getIndNum('pas', 3)}
              karmicLessons={customer.map?.missing_numbers || [6]}
              rationalThought={getIndNum('rat', 1)}
            />
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
