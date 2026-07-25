import { CountryCode, CountryInfo } from '../types';

export const COUNTRIES: Record<CountryCode, CountryInfo> = {
  JO: {
    code: 'JO',
    nameAr: 'الأردن',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    dialCode: '+962',
    crFormatAr: 'رقم السجل التجاري / الرقم الوطني للشركات (مثال: 202488120)',
    crFormatEn: 'Commercial Reg / National ID (e.g. 202488120)'
  },
  UAE: {
    code: 'UAE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    dialCode: '+971',
    crFormatAr: 'رقم الرخصة التجارية (DED / DED License)',
    crFormatEn: 'Commercial License No (DED)'
  },
  KSA: {
    code: 'KSA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    dialCode: '+966',
    crFormatAr: 'رقم السجل التجاري أو موثوق (CR / Mawthooq)',
    crFormatEn: 'Commercial Registration (CR / Mawthooq)'
  },
  KW: {
    code: 'KW',
    nameAr: 'الكويت',
    nameEn: 'Kuwait',
    flag: '🇰🇼',
    dialCode: '+965',
    crFormatAr: 'رقم السجل التجاري / وزارة التجارة',
    crFormatEn: 'Commercial Registry No'
  },
  BH: {
    code: 'BH',
    nameAr: 'البحرين',
    nameEn: 'Bahrain',
    flag: '🇧🇭',
    dialCode: '+973',
    crFormatAr: 'رقم السجل التجاري (CR)',
    crFormatEn: 'Commercial Registration (CR)'
  },
  QA: {
    code: 'QA',
    nameAr: 'قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    dialCode: '+974',
    crFormatAr: 'رقم السجل التجاري / الرخصة',
    crFormatEn: 'Commercial Registry No'
  }
};
