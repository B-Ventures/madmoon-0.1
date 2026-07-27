import { MerchantStore } from '../types';
import { MadmoonLogoVariant } from '../components/MadmoonLogo';

export interface LayerInfo {
  layer: 1 | 2 | 3 | 4;
  variant: MadmoonLogoVariant;
  nameAr: string;
  nameEn: string;
  colorHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBgClass: string;
  badgeBorderClass: string;
}

export function getStoreLayerInfo(store: Partial<MerchantStore>): LayerInfo {
  const tierStr = (store.tier || '').toLowerCase();
  
  // Layer 4 check
  if (
    tierStr.includes('layer 4') || 
    tierStr.includes('tier 4') || 
    tierStr.includes('4')
  ) {
    return {
      layer: 4,
      variant: 'layer4',
      nameAr: 'المستوى الرابع - نطاق إلكتروني موثق',
      nameEn: 'Layer 4 - Official Verified Domain',
      colorHex: '#D97706',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-900',
      badgeBgClass: 'bg-amber-50',
      badgeBorderClass: 'border-amber-300'
    };
  }

  // Layer 3 check
  if (
    tierStr.includes('layer 3') || 
    tierStr.includes('tier 3') || 
    tierStr.includes('3')
  ) {
    return {
      layer: 3,
      variant: 'layer3',
      nameAr: 'المستوى الثالث - هاتف أعمال موثق',
      nameEn: 'Layer 3 - Verified Hotline Channel',
      colorHex: '#2563EB',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-300',
      textClass: 'text-blue-900',
      badgeBgClass: 'bg-blue-50',
      badgeBorderClass: 'border-blue-300'
    };
  }

  // Layer 2 check
  if (
    tierStr.includes('layer 2') || 
    tierStr.includes('tier 2') || 
    tierStr.includes('منشأة') || 
    store.sellerType === 'business' || 
    tierStr.includes('2')
  ) {
    return {
      layer: 2,
      variant: 'layer2',
      nameAr: 'المستوى الثاني - منشأة بسجل تجاري',
      nameEn: 'Layer 2 - Commercial Registry',
      colorHex: '#047857',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-300',
      textClass: 'text-emerald-900',
      badgeBgClass: 'bg-emerald-50',
      badgeBorderClass: 'border-emerald-300'
    };
  }

  // Layer 1 default
  return {
    layer: 1,
    variant: 'layer1',
    nameAr: 'المستوى الأول - هوية شخصية مؤكدة',
    nameEn: 'Layer 1 - Personal ID Identity',
    colorHex: '#64748B',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-800',
    badgeBgClass: 'bg-slate-100',
    badgeBorderClass: 'border-slate-300'
  };
}
