import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export type FeatureKey =
  | 'report_quota'          // Số lượt xuất Báo Cáo Tầng 3
  | 'topic_expansion'       // Quyền mở rộng nhiều trọng tâm trên 1 hồ sơ
  | 'synastry_map'          // Bản đồ Tương Hợp 2 người (vợ chồng / con cái)
  | 'white_label'           // Gắn Logo & Thương hiệu chuyên gia lên PDF
  | 'coach_crm'             // Hệ thống Quản lý Khách hàng & Ghi chú tư vấn
  | 'energy_calendar_365'   // Lịch Vận Hạn & Năng Lượng 365 Ngày
  | 'consulting_questions'; // Lượt Tương Tác Cố Vấn Khai Vấn

export interface FeatureDefinition {
  key: FeatureKey;
  label: string;
  description: string;
  unit: string;
  isNumeric: boolean;
}

export const SYSTEM_FEATURES: FeatureDefinition[] = [
  {
    key: 'report_quota',
    label: 'Số Lượt Báo Cáo Độc Bản Tầng 3',
    description: 'Mở khóa trọn vẹn 3 tầng luận giải chuyên sâu và xuất bản file PDF chuẩn in ấn.',
    unit: 'bài',
    isNumeric: true,
  },
  {
    key: 'topic_expansion',
    label: 'Mở Rộng Đa Trọng Tâm Cuộc Sống',
    description: 'Mở khóa thêm các chủ đề chuyên biệt (Sự nghiệp, Tài chính, Tình duyên, Sức khỏe, Con cái) trên cùng hồ sơ.',
    unit: 'chủ đề',
    isNumeric: true,
  },
  {
    key: 'synastry_map',
    label: 'Bản Đồ Tương Hợp 2 Người (Synastry)',
    description: 'Phân tích mức độ gắn kết, điểm bổ trợ và thách thức giữa vợ chồng, cha mẹ - con cái hoặc đối tác.',
    unit: 'tính năng',
    isNumeric: false,
  },
  {
    key: 'white_label',
    label: 'White-Label: Thương Hiệu & Logo Riêng',
    description: 'Gắn Logo, tên chuyên gia, chức danh và thông tin liên hệ của Life Coach lên trang bìa và chân trang PDF.',
    unit: 'tính năng',
    isNumeric: false,
  },
  {
    key: 'coach_crm',
    label: 'Cổng Quản Lý Hồ Sơ Khách Hàng (CRM)',
    description: 'Lưu trữ, tra cứu nhanh hồ sơ khách hàng, bảo mật dữ liệu và ghi chú tiến trình cố vấn.',
    unit: 'tính năng',
    isNumeric: false,
  },
  {
    key: 'energy_calendar_365',
    label: 'Lịch Năng Lượng & Vận Hạn 365 Ngày',
    description: 'Hệ thống theo dõi năng lượng chu kỳ Năm/Tháng/Ngày cá nhân chuyên sâu dành cho hội viên.',
    unit: 'tính năng',
    isNumeric: false,
  },
  {
    key: 'consulting_questions',
    label: 'Lượt Tương Tác Cố Vấn Khai Vấn',
    description: 'Số câu hỏi tương tác chuyên sâu với Hệ Thống Khai Vấn Pythagoras cho mỗi hồ sơ.',
    unit: 'câu',
    isNumeric: true,
  },
];

export type PricingPlanType =
  | 'b2c_single'        // Gói lẻ 1 bài (Mass Adoption)
  | 'b2c_addon'         // Gói mở rộng vi mô (Thêm chủ đề)
  | 'family'            // Gói gia đình / nhóm
  | 'coach_wholesale'   // Gói nạp sỉ lượt bài
  | 'coach_subscription';// Gói hội viên nền tảng định kỳ (SaaS / Passive Income)

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  periodLabel: string;
  targetAudience: string;
  type: PricingPlanType;
  credits: number; // Số bài báo cáo tặng kèm hoặc quy đổi
  features: string[]; // Danh sách gạch đầu dòng hiển thị marketing
  featureFlags: Record<FeatureKey, boolean | number>; // Ma trận tính năng kỹ thuật
  isPopular?: boolean;
  isActive: boolean;
  isWorkflowOnly?: boolean; // Gói thuộc luồng xuất bài in-app, không hiển thị trên trang bảng giá chung
  displayOrder: number;
}

export interface UserEntitlements {
  userId: string;
  reportCredits: number;
  membershipPlanId?: string;
  membershipExpiresAt?: string | null;
  hasWhiteLabel: boolean;
  hasCrm: boolean;
  hasEnergyCalendar365: boolean;
  hasSynastry: boolean;
  consultingCredits: number;
}

export const TEST_PLAN_2K: PricingPlan = {
  id: 'test_plan_2k',
  name: 'Gói Test Sandbox (2.000đ)',
  badge: 'Test QR Thật 2K',
  price: 2000,
  originalPrice: 199000,
  periodLabel: 'lượt test chuyển khoản thật',
  targetAudience: 'Chỉ hiển thị khi truy cập localhost để kiểm thử quét mã QR ngân hàng thật 2.000đ',
  type: 'b2c_single',
  credits: 1,
  isPopular: true,
  isActive: true,
  displayOrder: 0,
  features: [
    'Quét mã QR app ngân hàng thật (ACB)',
    'Số tiền chuyển khoản siêu nhỏ: 2.000 VNĐ',
    'Tự động kích hoạt mở khóa toàn bộ báo cáo Tầng 3',
    'Kiểm thử Webhook SePay bắt biến động số dư thực'
  ],
  featureFlags: {
    report_quota: 1,
    topic_expansion: 3,
    synastry_map: false,
    white_label: false,
    coach_crm: false,
    energy_calendar_365: false,
    consulting_questions: 3,
  }
};

// Bảng giá mặc định 3 Trục chuẩn mực của Nền tảng Life Maps
export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  // TRỤC 1: B2C MASS ADOPTION & GIA ĐÌNH
  {
    id: 'b2c_single_discovery',
    name: 'Gói Cá Nhân Khám Phá',
    badge: 'Mở Khóa Nhanh',
    price: 39000,
    originalPrice: 199000,
    periodLabel: 'bài báo cáo độc bản',
    targetAudience: 'Mở khóa trực tiếp khi xem bài báo cáo cá nhân',
    type: 'b2c_single',
    credits: 1,
    isPopular: false,
    isActive: true,
    isWorkflowOnly: true,
    displayOrder: 1,
    features: [
      'Mở khóa trọn vẹn 3 Tầng Luận Giải Độc Bản',
      'Đầy đủ 21 chỉ số Pythagoras & Sơ đồ Kim Tự Tháp',
      'Kèm 3 Trọng tâm cuộc sống ưu tiên ban đầu',
      'Tặng kèm 3 lượt tương tác Cố vấn Khai vấn',
      'Lưu trữ hồ sơ vĩnh viễn, xem lại MIỄN PHÍ TRỌN ĐỜI',
      'Xuất bản Ebook PDF 30+ trang chuẩn in ấn cao cấp'
    ],
    featureFlags: {
      report_quota: 1,
      topic_expansion: 3,
      synastry_map: false,
      white_label: false,
      coach_crm: false,
      energy_calendar_365: false,
      consulting_questions: 3,
    }
  },
  {
    id: 'b2c_topic_addon_15k',
    name: 'Mở Rộng Thêm Trọng Tâm',
    badge: 'Mở Rộng +15k',
    price: 15000,
    originalPrice: 49000,
    periodLabel: 'thêm 1 chủ đề trên hồ sơ đã có',
    targetAudience: 'Mở thêm góc nhìn luận giải mới ngay trong bài',
    type: 'b2c_addon',
    credits: 0,
    isActive: true,
    isWorkflowOnly: true,
    displayOrder: 2,
    features: [
      'Mở khóa thêm 1 Trọng tâm (Sự nghiệp / Tài chính / Tình duyên / Con cái...)',
      'Nối tiếp trực tiếp vào bài báo cáo Tầng 3 hiện có',
      'Cập nhật Ebook PDF trọn vẹn phiên bản mới nhất',
      'Tặng thêm 2 lượt tương tác Cố vấn Khai vấn'
    ],
    featureFlags: {
      report_quota: 0,
      topic_expansion: 1,
      synastry_map: false,
      white_label: false,
      coach_crm: false,
      energy_calendar_365: false,
      consulting_questions: 2,
    }
  },
  {
    id: 'b2c_family_bundle_5',
    name: 'Gói Gia Đình Thấu Hiểu',
    badge: 'Tiết Kiệm 40%',
    price: 149000,
    originalPrice: 250000,
    periodLabel: '5 hồ sơ trọn vẹn (chỉ 29.8k/bài)',
    targetAudience: 'Dành cho gia đình, nhóm bạn & cha mẹ thấu hiểu con cái',
    type: 'family',
    credits: 5,
    isActive: true,
    displayOrder: 3,
    features: [
      '5 lượt xuất Báo cáo Độc bản Tầng 3 trọn vẹn',
      'Phân tích tiềm năng & thiên hướng giáo dục cho con trẻ',
      'Thấu hiểu tính cách và định hướng phát triển từng thành viên',
      'Không giới hạn thời hạn sử dụng lượt bài',
      'Xuất 5 file PDF độc lập chuẩn in ấn cao cấp'
    ],
    featureFlags: {
      report_quota: 5,
      topic_expansion: 5,
      synastry_map: true,
      white_label: false,
      coach_crm: false,
      energy_calendar_365: false,
      consulting_questions: 15,
    }
  },

  // TRỤC 2: CHUYÊN GIA / LIFE COACH NẠP SỈ (WHOLESALE CREDITS)
  {
    id: 'coach_wholesale_50',
    name: 'Coach Khởi Đầu (50 bài)',
    badge: '25.000đ / bài',
    price: 1250000,
    originalPrice: 2500000,
    periodLabel: '50 lượt báo cáo (25k/bài)',
    targetAudience: 'Dành cho Chuyên viên Tư vấn, Life Coach mới khởi sự hành nghề',
    type: 'coach_wholesale',
    credits: 50,
    isActive: true,
    displayOrder: 4,
    features: [
      '50 lượt xuất Báo Cáo Chuyên Sâu Tầng 3 (Giá vốn chỉ 25k)',
      'Gắn Thương Hiệu & Logo riêng lên trang bìa và chân trang PDF',
      'Cổng Quản Lý Khách Hàng CRM & Ghi chú hồ sơ tư vấn',
      'Không giới hạn thời hạn sử dụng số lượt bài',
      'Hỗ trợ kỹ thuật ưu tiên 24/7'
    ],
    featureFlags: {
      report_quota: 50,
      topic_expansion: 50,
      synastry_map: true,
      white_label: true,
      coach_crm: true,
      energy_calendar_365: false,
      consulting_questions: 150,
    }
  },
  {
    id: 'coach_wholesale_200',
    name: 'Coach Chuyên Nghiệp (200 bài)',
    badge: 'Chuyên Gia Lựa Chọn',
    price: 3800000,
    originalPrice: 8000000,
    periodLabel: '200 lượt báo cáo (19k/bài)',
    targetAudience: 'Dành cho Coach thực chiến có lượng khách hàng đều đặn mỗi tháng',
    type: 'coach_wholesale',
    credits: 200,
    isPopular: true,
    isActive: true,
    displayOrder: 5,
    features: [
      '200 lượt xuất Báo Cáo Chuyên Sâu Tầng 3 (Giá vốn siêu tối ưu 19k)',
      'Đầy đủ tính năng White-label thương hiệu chuyên gia riêng',
      'CRM quản lý khách hàng nâng cao & Phân loại tệp tư vấn',
      'Biểu mẫu khảo sát và kịch bản khai vấn chuẩn quốc tế',
      'Quyền kết nối Mạng Lưới Chuyên Gia Toàn Quốc'
    ],
    featureFlags: {
      report_quota: 200,
      topic_expansion: 200,
      synastry_map: true,
      white_label: true,
      coach_crm: true,
      energy_calendar_365: false,
      consulting_questions: 600,
    }
  },
  {
    id: 'coach_wholesale_500',
    name: 'Học Viện & Đội Nhóm (500 bài)',
    badge: 'Giá Vốn Tối Đa',
    price: 7500000,
    originalPrice: 20000000,
    periodLabel: '500 lượt báo cáo (15k/bài)',
    targetAudience: 'Dành cho Học viện Đào tạo, Doanh nghiệp & Đội nhóm tư vấn lớn',
    type: 'coach_wholesale',
    credits: 500,
    isActive: true,
    displayOrder: 6,
    features: [
      '500 lượt xuất Báo Cáo Chuyên Sâu Tầng 3 (Giá vốn thấp nhất 15k/bài)',
      'Phân quyền tài khoản Cộng tác viên & Trợ lý tư vấn',
      'Tùy biến mẫu màu sắc và cấu trúc báo cáo PDF theo học viện',
      'Được hỗ trợ thiết kế template riêng và bảo trợ kỹ thuật cao cấp'
    ],
    featureFlags: {
      report_quota: 500,
      topic_expansion: 500,
      synastry_map: true,
      white_label: true,
      coach_crm: true,
      energy_calendar_365: false,
      consulting_questions: 1500,
    }
  },

  // TRỤC 3: HỘI VIÊN NỀN TẢNG (RECURRING MEMBERSHIP / SAAS)
  {
    id: 'coach_subscription_annual',
    name: 'Coach Pro Hội Viên Năm',
    badge: 'Đặc Quyền Hội Viên',
    price: 1490000,
    originalPrice: 3600000,
    periodLabel: 'năm hội viên cao cấp (chỉ ~124k/tháng)',
    targetAudience: 'Dành cho Chuyên gia muốn duy trì nền tảng tư vấn chuyên nghiệp lâu dài',
    type: 'coach_subscription',
    credits: 10,
    isActive: true,
    displayOrder: 7,
    features: [
      'ĐẶC QUYỀN MUA SỈ BÀI VỚI GIÁ GỐC 15.000đ/bài không giới hạn',
      'Tặng kèm 10 lượt báo cáo Tầng 3 chuyên sâu ngay khi kích hoạt',
      'Mở khóa trọn bộ CRM, White-label & Lịch Vận Hạn 365 Ngày',
      'Huy hiệu Chuyên Gia Xác Thực (Verified Life Coach) trên nền tảng',
      'Hiển thị thông tin nổi bật trên Danh Bạ Cố Vấn Toàn Quốc',
      'Hưởng toàn bộ các nâng cấp tính năng mới nhất trong 365 ngày'
    ],
    featureFlags: {
      report_quota: 10,
      topic_expansion: 10,
      synastry_map: true,
      white_label: true,
      coach_crm: true,
      energy_calendar_365: true,
      consulting_questions: 50,
    }
  },
];

const PRICING_COLLECTION = 'pricing_plans';

// Lấy danh sách các gói từ Firestore (hoặc fallback về Default)
export async function getPricingPlans(): Promise<PricingPlan[]> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  let result: PricingPlan[] = [];

  try {
    const q = query(collection(db, PRICING_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPlan));
    } else {
      // Nếu chưa có trong Firestore, tự động khởi tạo mặc định
      await initializeDefaultPricingPlans();
      result = DEFAULT_PRICING_PLANS;
    }
  } catch (error) {
    console.warn('Không thể đọc bảng giá từ Firestore, sử dụng bảng giá mặc định:', error);
    result = DEFAULT_PRICING_PLANS;
  }

  // Tự động chèn gói TEST (2.000đ) khi và chỉ khi đang chạy trên localhost
  if (isLocal) {
    if (!result.some(p => p.id === 'test_plan_2k')) {
      result = [TEST_PLAN_2K, ...result];
    }
  } else {
    // Luôn ẩn gói test trên production
    result = result.filter(p => p.id !== 'test_plan_2k');
  }

  return result;
}

// Khởi tạo bảng giá mặc định vào Firestore
export async function initializeDefaultPricingPlans(): Promise<void> {
  try {
    for (const plan of DEFAULT_PRICING_PLANS) {
      await setDoc(doc(db, PRICING_COLLECTION, plan.id), plan, { merge: true });
    }
    console.log('✅ Đã khởi tạo bảng giá mặc định thành công trên Firestore.');
  } catch (error) {
    console.error('Lỗi khởi tạo bảng giá mặc định:', error);
  }
}

// Lưu hoặc cập nhật gói
export async function savePricingPlan(plan: PricingPlan): Promise<void> {
  await setDoc(doc(db, PRICING_COLLECTION, plan.id), plan, { merge: true });
}

// Xóa gói
export async function deletePricingPlan(planId: string): Promise<void> {
  await deleteDoc(doc(db, PRICING_COLLECTION, planId));
}

// Lấy quyền lợi & số dư của User
export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        userId,
        reportCredits: data.reportCredits ?? data.credits ?? 0,
        membershipPlanId: data.membershipPlanId,
        membershipExpiresAt: data.membershipExpiresAt,
        hasWhiteLabel: !!data.hasWhiteLabel || !!data.isCoach,
        hasCrm: !!data.hasCrm || !!data.isCoach,
        hasEnergyCalendar365: !!data.hasEnergyCalendar365 || (data.membershipExpiresAt && new Date(data.membershipExpiresAt) > new Date()),
        hasSynastry: !!data.hasSynastry,
        consultingCredits: data.consultingCredits ?? 0,
      };
    }
  } catch (error) {
    console.warn('Lỗi đọc quyền lợi người dùng:', error);
  }

  return {
    userId,
    reportCredits: 0,
    hasWhiteLabel: false,
    hasCrm: false,
    hasEnergyCalendar365: false,
    hasSynastry: false,
    consultingCredits: 0,
  };
}
