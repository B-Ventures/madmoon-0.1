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
  KSA: {
    code: 'KSA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    dialCode: '+966',
    crFormatAr: 'رقم السجل التجاري أو موثوق (CR / Mawthooq)',
    crFormatEn: 'Commercial Registration (CR / Mawthooq)'
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
  EG: {
    code: 'EG',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    dialCode: '+20',
    crFormatAr: 'رقم السجل التجاري / البطاقة الضريبية',
    crFormatEn: 'Commercial Registry No / Tax ID'
  },
  MA: {
    code: 'MA',
    nameAr: 'المملكة المغربية',
    nameEn: 'Morocco',
    flag: '🇲🇦',
    dialCode: '+212',
    crFormatAr: 'رقم السجل التجاري (RC / Identifiant Fiscal)',
    crFormatEn: 'Commercial Registry (RC No)'
  },
  TN: {
    code: 'TN',
    nameAr: 'الجمهورية التونسية',
    nameEn: 'Tunisia',
    flag: '🇹🇳',
    dialCode: '+216',
    crFormatAr: 'المعرف الجبائي / السجل الوطني للمؤسسات (RNE)',
    crFormatEn: 'Tax ID / National Business Registry (RNE)'
  },
  DZ: {
    code: 'DZ',
    nameAr: 'الجمهورية الجزائرية',
    nameEn: 'Algeria',
    flag: '🇩🇿',
    dialCode: '+213',
    crFormatAr: 'رقم السجل التجاري (CNRC / NIF)',
    crFormatEn: 'Commercial Register (CNRC)'
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
  },
  OM: {
    code: 'OM',
    nameAr: 'سلطنة عمان',
    nameEn: 'Oman',
    flag: '🇴🇲',
    dialCode: '+968',
    crFormatAr: 'رقم السجل التجاري (CR / استثمر بنهولة)',
    crFormatEn: 'Commercial Registry No'
  },
  IQ: {
    code: 'IQ',
    nameAr: 'العراق',
    nameEn: 'Iraq',
    flag: '🇮🇶',
    dialCode: '+964',
    crFormatAr: 'رقم السجل التجاري / هويّة مسجّل الشركات',
    crFormatEn: 'Commercial Registry No'
  },
  LB: {
    code: 'LB',
    nameAr: 'لبنان',
    nameEn: 'Lebanon',
    flag: '🇱🇧',
    dialCode: '+961',
    crFormatAr: 'رقم السجل التجاري / الرقم الضريبي',
    crFormatEn: 'Commercial Registry No / Tax ID'
  }
};
