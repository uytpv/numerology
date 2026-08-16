export class CoachBrandingDto {
  brandName?: string;
  title?: string;
  logoUrl?: string;
  avatarUrl?: string;
  phone?: string;
  zalo?: string;
  facebook?: string;
  city?: string;
  bio?: string;
  customGreeting?: string;
}

export class LeadRequestDto {
  customerId?: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  interest: 'career' | 'relationship' | 'family' | 'coach_training';
  note?: string;
}
