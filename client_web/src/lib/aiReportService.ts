/**
 * Service gọi Backend AI Engine để sinh bài luận giải Cấp độ 3 độc bản
 * Tuân thủ Hiến pháp: Không giả mạo dữ liệu, không fallback về template tĩnh
 */
export interface AIReportData {
  identitySynthesis: {
    title: string;
    coreDynamic: string;
    innerVsOuter: string;
    executionPower: string;
  };
  shadowAndGrowth: {
    karmicPattern: string;
    transformationKey: string;
  };
  strategicRoadmap: {
    personalYearFocus: string;
    shortTerm0to6m: string;
    midTerm1to3y: string;
    longTermPinnacle: string;
  };
  coachingQuestions: string[];
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://lifemaps-backend-314221772516.asia-southeast1.run.app'
  );
}

export async function fetchAIReport(payload: {
  fullName: string;
  dob: string;
  map: any;
  tier?: number;
  language?: string;
  readingProfile?: string;
  customerId?: string;
}): Promise<AIReportData> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/customers/generate-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetail = '';
    try {
      const errJson = await res.json();
      errorDetail = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(errorDetail || `Lỗi máy chủ (${res.status})`);
  }

  return res.json();
}
