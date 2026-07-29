export type Language = 'ar' | 'en';

export type StoreCategory = 
  | 'fashion' 
  | 'electronics' 
  | 'crafts' 
  | 'beauty' 
  | 'food' 
  | 'services'
  | 'general';

export type CountryCode = 'JO' | 'UAE' | 'KSA' | 'KW' | 'BH' | 'QA' | 'EG' | 'MA' | 'TN' | 'DZ' | 'OM' | 'IQ' | 'LB';

export interface CountryInfo {
  code: CountryCode;
  nameAr: string;
  nameEn: string;
  flag: string;
  dialCode: string;
  crFormatAr: string;
  crFormatEn: string;
}

export type BadgeStyleOption = 'footer-gov' | 'ribbon-gold' | 'ribbon-silver' | 'accredited-box' | 'floating-pill';

export interface MerchantStore {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  websiteUrl: string;
  phone: string;
  commercialReg: string; // رقم السجل التجاري / الرقم الوطني
  sellerType?: 'individual' | 'business';
  taxNumber?: string; // الرقم الضريبي
  category: StoreCategory;
  country: CountryCode;
  logoUrl?: string;
  verifiedAt: string;
  verificationBadgeId: string;
  domainVerified: boolean;
  whatsappVerified: boolean;
  crVerified: boolean;
  clickCount: number;
  reportCount: number;
  ownerName?: string;
  isSample?: boolean;
  verificationStatus?: 'pending' | 'active' | 'rejected';
  tier?: string;
  badgeStyle?: BadgeStyleOption;
  createdAt?: string;
}

export interface DisputeReport {
  id: string;
  storeSlug: string;
  storeName: string;
  reporterName: string;
  reporterPhone: string;
  orderNumber: string;
  issueType: 'fraud' | 'non_delivery' | 'counterfeit' | 'bad_service' | 'other';
  description: string;
  createdAt: string;
  status: 'pending' | 'reviewing' | 'resolved';
}

export type ViewTab = 'home' | 'register' | 'directory' | 'verify' | 'about' | 'admin' | 'terms' | 'privacy' | 'disclaimer';
