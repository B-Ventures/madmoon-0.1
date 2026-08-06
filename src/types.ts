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
  // Merchant's chosen embed-script customization from the registration
  // wizard (data-placement / data-theme / data-lang on badge.js). Persisted
  // so Admin Dashboard can regenerate the same snippet later instead of
  // silently falling back to defaults that may not match what the merchant
  // originally set up.
  badgePlacement?: 'bottom-right' | 'bottom-left' | 'inline';
  badgeTheme?: 'light' | 'dark';
  badgeLang?: 'ar' | 'en';
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
