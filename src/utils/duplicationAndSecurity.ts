import { MerchantStore, Language, CountryCode } from '../types';
import { COUNTRIES } from '../data/countries';

/**
 * Normalizes a URL to a canonical domain or handle string
 * Example: "https://www.AmmanArtisans.com/shop/" -> "ammanartisans.com"
 */
export function normalizeDomain(url: string): string {
  if (!url) return '';
  let clean = url.trim().toLowerCase();
  
  // Remove protocol
  clean = clean.replace(/^https?:\/\//i, '');
  
  // Remove www.
  clean = clean.replace(/^www\./i, '');
  
  // Remove trailing slashes and query strings
  clean = clean.split('?')[0].split('#')[0];
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  
  return clean;
}

/**
 * Normalizes Commercial Registration / Tax ID / License Number
 * Example: " CR - 2024 / 88120 " -> "202488120"
 */
export function normalizeCR(cr: string): string {
  if (!cr) return '';
  return cr.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Normalizes a phone number into full E.164 canonical format
 * Example: "079 123 4567", "JO" -> "+962791234567"
 */
export function normalizePhone(phone: string, countryCode: CountryCode): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const dialCode = COUNTRIES[countryCode]?.dialCode || '+962';
  
  // Strip leading zero if present
  const strippedDigits = digits.startsWith('0') ? digits.substring(1) : digits;
  
  return `${dialCode.replace('+', '')}${strippedDigits}`;
}

/**
 * Sanitizes user input string against HTML/XSS injection attempts
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export interface DuplicationCheckResult {
  isDuplicate: boolean;
  reason?: 'domain' | 'cr' | 'phone' | 'slug';
  messageAr?: string;
  messageEn?: string;
  existingStoreSlug?: string;
}

/**
 * Checks whether an incoming business registration collides with any existing entity in the system
 */
export function checkBusinessDuplication(
  input: {
    websiteUrl: string;
    commercialReg?: string;
    phone: string;
    country: CountryCode;
    sellerType: 'individual' | 'business';
  },
  existingStores: MerchantStore[],
  lang: Language
): DuplicationCheckResult {
  const normInputDomain = normalizeDomain(input.websiteUrl);
  const normInputCR = normalizeCR(input.commercialReg || '');
  const normInputPhone = normalizePhone(input.phone, input.country);

  for (const existing of existingStores) {
    // 1. Domain Check
    if (normInputDomain) {
      const normExistingDomain = normalizeDomain(existing.websiteUrl);
      if (normExistingDomain === normInputDomain) {
        return {
          isDuplicate: true,
          reason: 'domain',
          existingStoreSlug: existing.slug,
          messageAr: `الموقع أو الصفحة (${normInputDomain}) مسجلة بالفعل بالمنظومة باسم "${existing.nameAr}".`,
          messageEn: `The domain (${normInputDomain}) is already registered under "${existing.nameEn}".`
        };
      }
    }

    // 2. Commercial Registration Check (for business entities)
    if (input.sellerType === 'business' && normInputCR && existing.commercialReg) {
      const normExistingCR = normalizeCR(existing.commercialReg);
      if (normExistingCR && normExistingCR === normInputCR && existing.country === input.country) {
        return {
          isDuplicate: true,
          reason: 'cr',
          existingStoreSlug: existing.slug,
          messageAr: `رقم السجل التجاري (${input.commercialReg}) مسجل مسبقاً لمنشأة "${existing.nameAr}".`,
          messageEn: `Commercial registration number (${input.commercialReg}) is already registered under "${existing.nameEn}".`
        };
      }
    }

    // 3. Phone Number Check
    if (normInputPhone && existing.phone) {
      const normExistingPhone = normalizePhone(existing.phone, existing.country || input.country);
      if (normExistingPhone === normInputPhone) {
        // Count how many stores use this phone
        const countWithPhone = existingStores.filter(s => normalizePhone(s.phone, s.country) === normInputPhone).length;
        if (countWithPhone >= 3) {
          return {
            isDuplicate: true,
            reason: 'phone',
            existingStoreSlug: existing.slug,
            messageAr: `تم الوصول للحد الأقصى للربط برقم الهاتف (${input.phone}).`,
            messageEn: `Maximum business registrations reached for phone number (${input.phone}).`
          };
        }
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Generates a collision-safe URL slug for new business entities
 */
export function generateUniqueSlug(baseName: string, existingStores: MerchantStore[]): string {
  let raw = baseName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-')
    .replace(/-+/g, '-');
  
  if (!raw || raw === '-') {
    raw = 'biz-' + Math.floor(Math.random() * 89999 + 10000);
  }

  const existingSlugs = new Set(existingStores.map(s => s.slug));
  if (!existingSlugs.has(raw)) {
    return raw;
  }

  // Append a unique short random suffix if slug collision exists
  let counter = 1;
  let candidate = `${raw}-${Math.floor(Math.random() * 899 + 100)}`;
  while (existingSlugs.has(candidate)) {
    candidate = `${raw}-${Math.floor(Math.random() * 8999 + 1000)}-${counter}`;
    counter++;
  }

  return candidate;
}
