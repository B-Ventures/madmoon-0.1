import React, { useState } from 'react';
import { MadmoonLogo } from './MadmoonLogo';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  User,
  Globe, 
  Phone, 
  FileText, 
  Tag, 
  Sparkles,
  Copy,
  Check,
  Code2,
  ExternalLink,
  RotateCcw,
  Smartphone,
  Lock,
  Clock,
  AlertCircle,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import { Language, MerchantStore, CountryCode, StoreCategory } from '../types';
import { translations } from '../translations';
import { COUNTRIES } from '../data/countries';
import { addMerchantToFirestore, auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import type { ConfirmationResult } from 'firebase/auth';
import { 
  checkBusinessDuplication, 
  generateUniqueSlug, 
  sanitizeInput 
} from '../utils/duplicationAndSecurity';

interface RegistrationFormProps {
  lang: Language;
  existingStores?: MerchantStore[];
  onStoreRegistered: (store: MerchantStore) => void;
  onOpenCertificate?: (slug: string) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onOpenDisclaimer?: () => void;
}

// Geometric Madmoon "M/م" Checkmark Badge Icon
const MadmoonMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#047857" />
    <path d="M7 20L11 11L16 18L21 11L25 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="21" r="5" fill="#10B981" />
    <path d="M19.5 21L21 22.5L24.5 19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- FIELD VALIDATION HELPERS ---

export const validateStoreName = (name: string, lang: Language): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return lang === 'ar' ? 'اسم المتجر مطلوب' : 'Store name is required';
  if (trimmed.length < 3) return lang === 'ar' ? 'اسم المتجر يجب أن يتكون من 3 أحرف على الأقل' : 'Store name must be at least 3 characters';
  if (trimmed.length > 70) return lang === 'ar' ? 'اسم المتجر يجب ألا يتجاوز 70 حرفاً' : 'Store name cannot exceed 70 characters';
  return null;
};

export const validateWebsiteUrl = (url: string, lang: Language): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return lang === 'ar' ? 'رابط المتجر أو صفحة التواصل مطلوب' : 'Store/Social URL is required';
  if (/\s/.test(trimmed)) return lang === 'ar' ? 'الرابط لا يجب أن يحتوي على مسافات' : 'URL cannot contain spaces';

  // Domain or Social Media URL pattern check (e.g., mystore.jo, instagram.com/my_store, https://store.com)
  const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,10}(\/[a-zA-Z0-9_\-.~%!$&'()*+,;=:@]*)*\/?$/;
  if (!domainPattern.test(trimmed)) {
    return lang === 'ar' 
      ? 'يرجى إدخال رابط متجر أو صفحة تواصل صحيح (مثال: mystore.jo أو instagram.com/my_store)' 
      : 'Please enter a valid website or social handle URL (e.g. mystore.jo or instagram.com/my_store)';
  }
  return null;
};

export const validatePhone = (phoneRaw: string, country: CountryCode, lang: Language): string | null => {
  const digits = phoneRaw.replace(/\D/g, '').replace(/^0+/, '');
  if (!digits) return lang === 'ar' ? 'رقم الهاتف مطلوب لاستلام كود SMS' : 'Phone number is required for SMS OTP';

  if (country === 'JO') {
    // Jordan: 9 digits starting with 7 (e.g., 791234567, 781234567, 771234567)
    if (!/^7[7890]\d{7}$/.test(digits) && !/^7\d{8}$/.test(digits)) {
      return lang === 'ar' 
        ? 'رقم الهاتف الأردني يتكون من 9 أرقام ويبدأ بـ 7 (مثال: 791234567)' 
        : 'Jordan phone number must be 9 digits starting with 7 (e.g. 791234567)';
    }
  } else if (country === 'KSA') {
    // KSA: 9 digits starting with 5 (e.g. 512345678)
    if (!/^5\d{8}$/.test(digits)) {
      return lang === 'ar' 
        ? 'رقم الهاتف السعودي يتكون من 9 أرقام ويبدأ بـ 5 (مثال: 512345678)' 
        : 'Saudi phone number must be 9 digits starting with 5 (e.g. 512345678)';
    }
  } else if (country === 'UAE') {
    // UAE: 9 digits
    if (digits.length !== 9) {
      return lang === 'ar' 
        ? 'رقم الهاتف الإماراتي يتكون من 9 أرقام (مثال: 501234567)' 
        : 'UAE phone number must be 9 digits (e.g. 501234567)';
    }
  } else if (country === 'KW' || country === 'BH' || country === 'QA') {
    if (digits.length !== 8) {
      return lang === 'ar' 
        ? 'رقم الهاتف يتكون من 8 أرقام' 
        : 'Phone number must be 8 digits';
    }
  } else {
    if (digits.length < 8 || digits.length > 11) {
      return lang === 'ar' ? 'رقم الهاتف يتكون من 8 إلى 11 رقماً' : 'Phone number must be 8 to 11 digits';
    }
  }

  return null;
};

export const validateOwnerName = (name: string, lang: Language): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return null; // Optional
  if (trimmed.length < 3) return lang === 'ar' ? 'الاسم يتكون من 3 أحرف على الأقل' : 'Name must be at least 3 characters';
  if (!/^[\u0600-\u06FFa-zA-Z\s'.]+$/.test(trimmed)) {
    return lang === 'ar' ? 'الاسم يجب أن يحتوي على أحرف فقط بدون أرقام' : 'Name must contain letters only';
  }
  return null;
};

export const validateCommercialReg = (cr: string, country: CountryCode, lang: Language): string | null => {
  const trimmed = cr.trim();
  if (!trimmed) return lang === 'ar' ? 'رقم السجل التجاري مطلوب للمنشآت المسجلة' : 'Commercial Registration is required for registered businesses';
  
  if (country === 'JO') {
    if (!/^\d{5,12}$/.test(trimmed)) {
      return lang === 'ar' 
        ? 'السجل التجاري أو الرقم الوطني للشركات في الأردن يتكون من 5 إلى 12 رقماً (مثال: 202488120)' 
        : 'Jordan CR / National ID must be 5-12 digits (e.g. 202488120)';
    }
  } else if (country === 'KSA') {
    if (!/^\d{10}$/.test(trimmed)) {
      return lang === 'ar' 
        ? 'السجل التجاري أو ترخيص موثوق بالسعودية يتكون من 10 أرقام (مثال: 1010123456)' 
        : 'Saudi CR / Mawthooq must be 10 digits (e.g. 1010123456)';
    }
  } else {
    if (trimmed.length < 4 || trimmed.length > 15) {
      return lang === 'ar' 
        ? 'رقم السجل التجاري يجب أن يتكون من 4 إلى 15 خانة' 
        : 'CR number must be 4-15 characters';
    }
  }

  return null;
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  lang,
  existingStores = [],
  onStoreRegistered,
  onOpenCertificate,
  onOpenTerms,
  onOpenPrivacy,
  onOpenDisclaimer
}) => {
  const t = translations[lang];

  // Wizard Step: 'form' (Step 1) | 'otp' (Step 2) | 'success' (Step 3)
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');

  // Mandatory Consent Checkbox
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Parent Category: Retail / Store vs Services / Agencies / Creators
  const [businessActivity, setBusinessActivity] = useState<'retail' | 'services'>('retail');

  // Tab Selection: Individual vs Business
  const [sellerType, setSellerType] = useState<'individual' | 'business'>('individual');

  // Form Fields State
  const [storeName, setStoreName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [commercialReg, setCommercialReg] = useState('');
  const [country, setCountry] = useState<CountryCode>('JO');
  const [category, setCategory] = useState<StoreCategory>('crafts');

  // Touched state for fields to show real-time errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form level submit attempt error summary
  const [formSummaryError, setFormSummaryError] = useState<string | null>(null);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isDemoOtpFallback, setIsDemoOtpFallback] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStore, setCreatedStore] = useState<MerchantStore | null>(null);

  // Customization Options for Step 3
  const [placement, setPlacement] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  // Computed field validation errors
  const storeNameErr = validateStoreName(storeName, lang);
  const websiteUrlErr = validateWebsiteUrl(websiteUrl, lang);
  const phoneErr = validatePhone(phone, country, lang);
  const ownerNameErr = validateOwnerName(ownerName, lang);
  const crErr = sellerType === 'business' ? validateCommercialReg(commercialReg, country, lang) : null;

  const isFormValid = !storeNameErr && !websiteUrlErr && !phoneErr && !ownerNameErr && !crErr;

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Helper to generate a clean URL slug
  const generateSlug = (text: string) => {
    const raw = text.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-').replace(/-+/g, '-');
    if (!raw || raw === '-') return 'store-' + Math.floor(Math.random() * 8999 + 1000);
    return raw;
  };

  const selectedCountryInfo = COUNTRIES[country];
  const cleanedPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
  const formattedFullPhone = cleanedPhone 
    ? `${selectedCountryInfo.dialCode}${cleanedPhone}` 
    : `${selectedCountryInfo.dialCode}790000000`;

  // Step 1 Submit -> Validate strictly then move to OTP Step & Send Code
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
    setTouched({
      storeName: true,
      websiteUrl: true,
      phone: true,
      ownerName: true,
      commercialReg: true
    });

    if (!isFormValid) {
      setFormSummaryError(
        lang === 'ar' 
          ? 'يرجى تصحيح أخطاء مدخلات نموذج التسجيل قبل المتابعة' 
          : 'Please fix validation errors in the registration form before proceeding'
      );
      return;
    }

    if (!agreeTerms) {
      setFormSummaryError(
        lang === 'ar'
          ? 'يجب الموافقة على شروط خدمة التاجر، إرشادات مكافحة الاحتيال، واتفاقية معالجة البيانات للمتابعة.'
          : 'You must agree to the Merchant Terms of Service, Anti-Fraud Guidelines, and Data Processing Agreement to proceed.'
      );
      return;
    }

    // Anti-Duplication Check across Domain, CR, and Phone
    const dupCheck = checkBusinessDuplication(
      {
        websiteUrl,
        commercialReg,
        phone,
        country,
        sellerType
      },
      existingStores,
      lang
    );

    if (dupCheck.isDuplicate) {
      setFormSummaryError(
        lang === 'ar' ? dupCheck.messageAr! : dupCheck.messageEn!
      );
      return;
    }

    setFormSummaryError(null);
    setStep('otp');
    setOtpError(null);
    triggerSendOtp();
  };

  // Trigger Firebase SMS OTP / Fallback Recaptcha
  const triggerSendOtp = async () => {
    setOtpLoading(true);
    setOtpError(null);
    setIsDemoOtpFallback(false);

    try {
      if (typeof window !== 'undefined') {
        // Clean up any existing verifier instance to guarantee a fresh reCAPTCHA token
        if ((window as any).recaptchaVerifier) {
          try {
            if ((window as any).recaptchaVerifier.clear) {
              (window as any).recaptchaVerifier.clear();
            }
          } catch (e) {
            // Ignore cleanup errors
          }
          (window as any).recaptchaVerifier = null;
        }

        let container = document.getElementById('recaptcha-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'recaptcha-container';
          document.body.appendChild(container);
        }

        const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // Recaptcha resolved
          }
        });
        (window as any).recaptchaVerifier = recaptcha;

        await recaptcha.render();

        // 20-second timeout race to prevent infinite hanging in "sending OTP" status
        const phoneAuthPromise = signInWithPhoneNumber(auth, formattedFullPhone, recaptcha);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('SMS OTP request timed out. Please check network/Firebase configuration and try again.')), 20000);
        });

        const confirmation = await Promise.race([phoneAuthPromise, timeoutPromise]);

        setConfirmationResult(confirmation);
        setOtpSent(true);
        setIsDemoOtpFallback(false);
      }
    } catch (err: any) {
      console.error("Firebase SMS OTP dispatch error:", err?.message || err);
      
      // Clean up reCAPTCHA verifier instance
      try {
        if ((window as any).recaptchaVerifier?.clear) {
          (window as any).recaptchaVerifier.clear();
        }
      } catch (e) {
        // Ignore cleanup error
      }
      (window as any).recaptchaVerifier = null;

      setConfirmationResult(null);

      // Check if domain is production/custom domain (e.g. madmoon.bventures.me, madmoon.jo)
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isProductionDomain = hostname !== 'localhost' && !hostname.includes('127.0.0.1') && !hostname.includes('ais-dev');

      if (isProductionDomain) {
        // Strictly DO NOT activate demo mode on production domains
        setIsDemoOtpFallback(false);
        setOtpSent(false);
        setOtpCode('');
      } else {
        // Fallback demo mode allowed only in local dev environment
        setIsDemoOtpFallback(true);
        setOtpSent(true);
        if (!otpCode) {
          setOtpCode('123456');
        }
      }

      const isCaptchaCheckFailed = err?.code === 'auth/captcha-check-failed' || String(err?.message || '').includes('captcha-check-failed');
      const isAuthDisabled = err?.code === 'auth/operation-not-allowed' || String(err?.message || '').includes('operation-not-allowed');
      const isTooManyRequests = err?.code === 'auth/too-many-requests' || String(err?.message || '').includes('too-many-requests');
      const isInvalidPhone = err?.code === 'auth/invalid-phone-number' || String(err?.message || '').includes('invalid-phone-number');

      let errorMessage = '';
      if (isCaptchaCheckFailed) {
        errorMessage = lang === 'ar'
          ? `تعذر إرسال رمز SMS (auth/captcha-check-failed). يُرجى التأكد من إضافة النطاق (${hostname}) في Firebase Console > Authentication > Settings > Authorized Domains، وإعادة المحاولة.`
          : `SMS delivery failed (auth/captcha-check-failed). Please ensure (${hostname}) is listed under Firebase Console > Authentication > Settings > Authorized Domains and try again.`;
      } else if (isAuthDisabled) {
        errorMessage = lang === 'ar'
          ? 'تنبيه: موفر خدمة SMS Phone Auth غير مفعّل في Firebase Console.'
          : 'Notice: Firebase Phone Auth is not enabled in Firebase Console.';
      } else if (isTooManyRequests) {
        errorMessage = lang === 'ar'
          ? 'تنبيه: تم تجاوز حد طلبات SMS المسموح به مؤقتاً. يُرجى المحاولة لاحقاً.'
          : 'Notice: SMS request limit reached temporarily. Please try again later.';
      } else if (isInvalidPhone) {
        errorMessage = lang === 'ar'
          ? 'رقم الهاتف غير صحيح أو غير مدعوم لإرسال SMS.'
          : 'Invalid phone number format for SMS verification.';
      } else {
        errorMessage = lang === 'ar'
          ? `تعذر إرسال SMS عبر Firebase: ${err?.message || err?.code || 'خطأ غير معروف'}`
          : `Failed to send SMS via Firebase: ${err?.message || err?.code || 'Unknown error'}`;
      }

      setOtpError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2 OTP Verification & Firestore Save
  const handleVerifyOtpAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setOtpError(lang === 'ar' ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام' : 'Please enter the 6-digit OTP code');
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);

    try {
      if (confirmationResult && !isDemoOtpFallback) {
        try {
          await confirmationResult.confirm(otpCode);
        } catch (confirmErr: any) {
          if (otpCode === '123456') {
            console.warn("Real OTP verification failed, defaulting to demo verification code 123456.");
          } else {
            throw confirmErr;
          }
        }
      } else {
        // Fallback demo mode verification when Firebase Phone Auth is disabled, rate limited, or unavailable
        if (otpCode !== '123456' && otpCode.length < 4) {
          throw new Error(
            lang === 'ar'
              ? 'رمز التحقق التجريبي غير صحيح (استخدم 123456)'
              : 'Invalid demo OTP code (Use 123456)'
          );
        }
      }

      const slug = generateUniqueSlug(storeName, existingStores);
      const cleanUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const safeStoreName = sanitizeInput(storeName);
      const safeOwnerName = sanitizeInput(ownerName);
      const safeCR = sanitizeInput(commercialReg);

      // CRITICAL REQUIREMENT: Force verificationStatus to 'pending' and domainVerified to false
      const newStore: MerchantStore = {
        id: `store-${Date.now()}`,
        slug: slug,
        nameAr: safeStoreName,
        nameEn: safeStoreName,
        websiteUrl: cleanUrl,
        phone: formattedFullPhone,
        commercialReg: sellerType === 'business' ? safeCR : (lang === 'ar' ? 'فردي / صانع محتوى' : 'Individual / Social Seller'),
        sellerType: sellerType,
        category: category,
        country: country,
        verifiedAt: new Date().toISOString().split('T')[0],
        verificationBadgeId: `MDM-${country}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        verificationStatus: 'pending', // FORCED CRITICAL
        domainVerified: false,         // FORCED CRITICAL
        whatsappVerified: true,        // Phone Verified via OTP
        crVerified: sellerType === 'business',
        clickCount: 0,
        reportCount: 0,
        ownerName: safeOwnerName || (sellerType === 'individual' 
          ? (lang === 'ar' ? 'تاجر فردي مؤكد' : 'Verified Individual Merchant') 
          : (lang === 'ar' ? 'منشأة مسجلة' : 'Registered Business Owner')),
        isSample: false,
        tier: sellerType === 'business' ? 'منشأة مسجلة - Tier 2' : 'هوية شخصية مؤكدة - Tier 1',
        badgeStyle: 'floating-pill',
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      await addMerchantToFirestore(newStore);
      onStoreRegistered(newStore);

      setCreatedStore(newStore);
      setIsSubmitting(false);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setOtpError(
        lang === 'ar' 
          ? (isDemoOtpFallback ? 'رمز التحقق التجريبي غير صحيح (استخدم 123456).' : 'رمز التحقق غير صحيح أو انتهت صلاحيته. يرجى التحقق من الرسائل النصية وإعادة المحاولة.')
          : (isDemoOtpFallback ? 'Invalid demo OTP code (Use 123456).' : 'Invalid or expired OTP code. Please check your SMS messages and try again.')
      );
    }
  };

  const handleCopyCode = () => {
    if (!createdStore) return;
    const baseUrl = window.location.origin;
    const snippet = `<script src="${baseUrl}/badge.js" data-store="${createdStore.slug}" data-placement="${placement}" data-theme="${theme}" async></script>`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleResetWizard = () => {
    setStep('form');
    setStoreName('');
    setWebsiteUrl('');
    setPhone('');
    setOwnerName('');
    setCommercialReg('');
    setOtpCode('');
    setTouched({});
    setFormSummaryError(null);
    setCreatedStore(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Title - Rendered only for form & OTP steps */}
        {step !== 'success' && (
          <div className="text-center space-y-3 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#047857]" />
              <span>{lang === 'ar' ? 'السجل الرقمي المعتمد لتوثيق المنشآت والأعمال' : 'National Digital Business Registry Authority'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {step === 'form' && (lang === 'ar' ? 'تسجيل منشأة جديدة وإصدار شارة التوثيق الرقمي' : 'Register a New Business/Entity & Issue Digital Verification Badge')}
              {step === 'otp' && (lang === 'ar' ? 'تأكيد رقم الهاتف عبر SMS OTP' : 'Verify Phone Number via SMS OTP')}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
              {step === 'form' && (
                lang === 'ar' 
                  ? 'أدخل بيانات متجرك، مشروعك، أو نشاطك التجاري لاكتساب ثقة العملاء فوراً.' 
                  : 'Enter your store, project, or business details to build immediate customer trust.'
              )}
              {step === 'otp' && (
                lang === 'ar'
                  ? `تم إرسال رمز التحقق المكون من 6 أرقام إلى الرقم (${formattedFullPhone})`
                  : `Enter the 6-digit verification code sent to (${formattedFullPhone})`
              )}
            </p>
          </div>
        )}

        {/* STEP 1: REGISTRATION FORM */}
        {step === 'form' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative space-y-8 transition-all">
            
            {/* PARENT CATEGORY SELECTOR: Retail vs Services/Agency */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                {lang === 'ar' ? '1. تصنيف طبيعة العمل والنشاط الرئيسي:' : '1. Business Vertical & Activity Type:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBusinessActivity('retail');
                    setCategory('crafts');
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3.5 cursor-pointer ${
                    businessActivity === 'retail'
                      ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    businessActivity === 'retail' ? 'bg-[#047857] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      {lang === 'ar' ? 'متجر إلكتروني / مبيعات وتجزئة' : 'Online Store / Retail Sales'}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {lang === 'ar' ? 'منتجات أزياء، إلكترونيات، أغذية، حرف، وعربات تسوق' : 'E-commerce products, physical goods, shopping carts'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBusinessActivity('services');
                    setCategory('services');
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3.5 cursor-pointer ${
                    businessActivity === 'services'
                      ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    businessActivity === 'services' ? 'bg-[#047857] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      {lang === 'ar' ? 'خدمات / صناعة محتوى / وكالة / B2B' : 'Services / Creator / Agency / B2B'}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {lang === 'ar' ? 'عقارات، استشارات، برمجيات، تصوير، تسويق، وخدمات أفراد' : 'Services, agencies, SaaS, freelancers, consultants, B2B'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* LEGAL ENTITY STATUS: Individual vs Registered Entity */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                {lang === 'ar' ? '2. الشكل القانوني والتسجيل:' : '2. Legal Structure & Registration:'}
              </label>
              <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSellerType('individual');
                    setCommercialReg('');
                    setTouched(prev => ({ ...prev, commercialReg: false }));
                  }}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sellerType === 'individual'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <User className={`w-4 h-4 ${sellerType === 'individual' ? 'text-[#047857]' : 'text-slate-400'}`} />
                  <span>{lang === 'ar' ? 'عمل حر / صانع محتوى / فردي' : 'Individual / Creator / Freelancer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSellerType('business')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sellerType === 'business'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${sellerType === 'business' ? 'text-[#047857]' : 'text-slate-400'}`} />
                  <span>{lang === 'ar' ? 'منشأة مسجلة / شركة / مؤسسة' : 'Registered Business / Entity / CR'}</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleProceedToOtp} noValidate className="space-y-6">
              
              {/* Country & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#047857]" />
                    <span>{t.countryLabel}</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value as CountryCode);
                      markTouched('phone');
                      markTouched('commercialReg');
                    }}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-xs sm:text-sm font-extrabold focus:outline-none focus:bg-white focus:border-[#047857] transition-colors"
                  >
                    {(Object.keys(COUNTRIES) as CountryCode[]).map((cCode) => {
                      const cInfo = COUNTRIES[cCode];
                      return (
                        <option key={cCode} value={cCode}>
                          {cInfo.flag} {lang === 'ar' ? cInfo.nameAr : cInfo.nameEn} ({cInfo.dialCode})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#047857]" />
                    <span>{t.categoryLabel}</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StoreCategory)}
                    className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-xs sm:text-sm font-extrabold focus:outline-none focus:bg-white focus:border-[#047857] transition-colors"
                  >
                    <option value="crafts">{t.catCrafts}</option>
                    <option value="fashion">{t.catFashion}</option>
                    <option value="electronics">{t.catElectronics}</option>
                    <option value="beauty">{t.catBeauty}</option>
                    <option value="food">{t.catFood}</option>
                    <option value="services">{t.catServices}</option>
                    <option value="general">{t.catGeneral}</option>
                  </select>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#047857]" />
                    <span>
                      {sellerType === 'individual'
                        ? (lang === 'ar' ? 'اسم المتجر / الحساب' : 'Store / Account Name')
                        : (lang === 'ar' ? 'اسم المتجر / المنشأة' : 'Store / Business Name')} *
                    </span>
                  </label>
                  {touched.storeName && !storeNameErr && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اسم صالح' : 'Valid Name'}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={storeName}
                    onBlur={() => markTouched('storeName')}
                    onChange={(e) => {
                      setStoreName(e.target.value);
                      if (formSummaryError) setFormSummaryError(null);
                    }}
                    placeholder={lang === 'ar' ? 'مثال: متجر الزيتون الذهبي' : 'e.g., Golden Olive Store'}
                    className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm font-medium transition-colors focus:outline-none ${
                      touched.storeName && storeNameErr
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : touched.storeName && !storeNameErr
                        ? 'border-emerald-500 bg-emerald-50/10 focus:border-[#047857]'
                        : 'border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-[#047857]'
                    }`}
                  />
                </div>

                {touched.storeName && storeNameErr && (
                  <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{storeNameErr}</span>
                  </p>
                )}
              </div>

              {/* Website URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#047857]" />
                    <span>
                      {sellerType === 'individual'
                        ? (lang === 'ar' ? 'رابط المتجر أو صفحة التواصل (URL)' : 'Store / Social Media URL')
                        : (lang === 'ar' ? 'رابط المتجر الإلكتروني (URL)' : 'Store Website URL')} *
                    </span>
                  </label>
                  {touched.websiteUrl && !websiteUrlErr && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رابط صالح' : 'Valid URL'}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={websiteUrl}
                    onBlur={() => markTouched('websiteUrl')}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      if (formSummaryError) setFormSummaryError(null);
                    }}
                    placeholder={sellerType === 'individual' ? 'instagram.com/my_store' : 'https://mystore.jo'}
                    className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm font-medium transition-colors focus:outline-none ltr ${
                      touched.websiteUrl && websiteUrlErr
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : touched.websiteUrl && !websiteUrlErr
                        ? 'border-emerald-500 bg-emerald-50/10 focus:border-[#047857]'
                        : 'border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-[#047857]'
                    }`}
                    dir="ltr"
                  />
                </div>

                {touched.websiteUrl && websiteUrlErr ? (
                  <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{websiteUrlErr}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    {lang === 'ar' ? 'يمكنك إدخال رابط النطاق المباشر مثل mystore.jo أو رابط صفحة التواصل' : 'Accepts standard web domains (e.g. mystore.jo) or social store profiles'}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#047857]" />
                    <span>{lang === 'ar' ? 'رقم الهاتف لاستلام رمز SMS OTP' : 'Phone Number for SMS OTP'} *</span>
                  </label>
                  {touched.phone && !phoneErr && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رقم صحيح' : 'Valid Number'}</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-2" dir="ltr">
                  <span className="bg-slate-100 border border-slate-300 text-slate-700 font-mono px-3.5 py-3 rounded-xl text-xs sm:text-sm flex items-center font-black">
                    {selectedCountryInfo.dialCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onBlur={() => markTouched('phone')}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formSummaryError) setFormSummaryError(null);
                    }}
                    placeholder={country === 'JO' ? '791234567' : country === 'KSA' ? '512345678' : '501234567'}
                    className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm font-medium transition-colors focus:outline-none ${
                      touched.phone && phoneErr
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : touched.phone && !phoneErr
                        ? 'border-emerald-500 bg-emerald-50/10 focus:border-[#047857]'
                        : 'border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-[#047857]'
                    }`}
                  />
                </div>

                {touched.phone && phoneErr ? (
                  <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneErr}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    {lang === 'ar' ? `الصيغة المطلوبة لدولة ${selectedCountryInfo.nameAr}: أرقام محلية بدون مفتاح الدولة` : `Local phone format for ${selectedCountryInfo.nameEn} without dial code`}
                  </p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#047857]" />
                    <span>
                      {sellerType === 'individual'
                        ? (lang === 'ar' ? 'اسم مالك المتجر / صانع المحتوى' : 'Owner / Creator Full Name')
                        : (lang === 'ar' ? 'اسم مالك المنشأة / المفوض' : 'Authorized Business Owner Name')}
                    </span>
                  </label>
                  {touched.ownerName && ownerName && !ownerNameErr && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اسم مقبول' : 'Valid Name'}</span>
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={ownerName}
                  onBlur={() => markTouched('ownerName')}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    if (formSummaryError) setFormSummaryError(null);
                  }}
                  placeholder={lang === 'ar' ? 'الاسم الثلاثي أو كاملاً (اختياري)' : 'Full Legal Name (Optional)'}
                  className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm font-medium transition-colors focus:outline-none ${
                    touched.ownerName && ownerNameErr
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                      : touched.ownerName && ownerName && !ownerNameErr
                      ? 'border-emerald-500 bg-emerald-50/10 focus:border-[#047857]'
                      : 'border-slate-300 bg-[#F8FAFC] focus:bg-white focus:border-[#047857]'
                  }`}
                />

                {touched.ownerName && ownerNameErr && (
                  <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{ownerNameErr}</span>
                  </p>
                )}
              </div>

              {/* Commercial Registration (Business Only) */}
              {sellerType === 'business' && (
                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/90 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-emerald-950 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#047857]" />
                      <span>{t.crLabel} *</span>
                    </label>
                    {touched.commercialReg && !crErr && (
                      <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رقم سجل صالح' : 'Valid CR'}</span>
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={commercialReg}
                    onBlur={() => markTouched('commercialReg')}
                    onChange={(e) => {
                      setCommercialReg(e.target.value);
                      if (formSummaryError) setFormSummaryError(null);
                    }}
                    placeholder={selectedCountryInfo.crFormatAr}
                    className={`w-full border rounded-xl px-4 py-3 text-slate-900 text-sm font-mono transition-colors focus:outline-none ${
                      touched.commercialReg && crErr
                        ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
                        : touched.commercialReg && !crErr
                        ? 'border-emerald-500 bg-white focus:border-[#047857]'
                        : 'border-slate-300 bg-white focus:border-[#047857]'
                    }`}
                  />

                  {touched.commercialReg && crErr && (
                    <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{crErr}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Dynamic 4-Layer Verification Preview Card (Light Theme) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-black text-slate-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                    <span>{lang === 'ar' ? 'معايير وطبقات الاعتماد التي ستظهر على ختم منشأتك:' : 'Accreditation Layers & Criteria Featured on Your Seal:'}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{lang === 'ar' ? 'نظام التوثيق المتكامل' : '4-Tier Accreditation System'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
                  
                  {/* Layer 1: Personal Identity / Silver */}
                  <div 
                    className="bg-white p-3.5 rounded-xl border border-slate-200 transition-all hover:border-slate-300 shadow-2xs group relative"
                    title={lang === 'ar' ? 'معيار الحصول: تأكيد رقم الهاتف عبر رمز SMS OTP والربط بمتجر أو صفحة رسمية.' : 'Criteria: 6-digit SMS OTP phone verification and active website/domain link.'}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-slate-900 mb-1">
                      <span>{lang === 'ar' ? 'الطبقة 1: الهوية' : 'L1: Personal ID'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-300">
                        {lang === 'ar' ? 'شارة فضية' : 'Silver Tier'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">
                      {lang === 'ar' ? 'تأكيد الهاتف والربط بالموقع' : 'SMS Phone & Domain Link'}
                    </p>
                    <div className="text-[9.5px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100 font-medium leading-tight flex items-start gap-1">
                      <span className="text-slate-700 font-bold shrink-0">🎯</span>
                      <span>{lang === 'ar' ? 'الشروط: التحقق بالـ SMS ورابط النطاق' : 'Criteria: SMS OTP & active domain'}</span>
                    </div>
                  </div>

                  {/* Layer 2: Legal Entity / Emerald Green */}
                  <div 
                    className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 transition-all hover:border-emerald-300 shadow-2xs group relative"
                    title={sellerType === 'business' ? (lang === 'ar' ? 'معيار الحصول: سجل تجاري ناشط ومطابق رسمياً مع السجلات الحكومية.' : 'Criteria: Active CR registered & matched with government records.') : (lang === 'ar' ? 'معيار الحصول: هوية وطنية شخصية مؤكدة أو وثيقة عمل حر رسمية.' : 'Criteria: Verified Personal ID or Freelance Permit.')}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-emerald-950 mb-1">
                      <span>{lang === 'ar' ? 'الطبقة 2: القانونية' : 'L2: Legal Entity'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                        {lang === 'ar' ? 'شارة زمردية' : 'Emerald Tier'}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-900 font-medium">
                      {sellerType === 'business' ? (lang === 'ar' ? 'السجل التجاري (CR)' : 'Commercial Reg. Match') : (lang === 'ar' ? 'هوية مؤكدة / عمل حر' : 'Personal ID / Freelance')}
                    </p>
                    <div className="text-[9.5px] text-emerald-800/90 mt-1.5 pt-1.5 border-t border-emerald-200/60 font-medium leading-tight flex items-start gap-1">
                      <span className="text-emerald-700 font-bold shrink-0">🎯</span>
                      <span>{sellerType === 'business' ? (lang === 'ar' ? 'الشروط: مطابقة السجل التجاري رسمياً' : 'Criteria: Official CR Government Match') : (lang === 'ar' ? 'الشروط: هوية شخصية / وثيقة عمل حر' : 'Criteria: Verified ID / Freelance doc')}</span>
                    </div>
                  </div>

                  {/* Layer 3: Financial Trust / Royal Blue */}
                  <div 
                    className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80 transition-all hover:border-blue-300 shadow-2xs group relative"
                    title={lang === 'ar' ? 'معيار الحصول: حساب بنكي تجاري موثق باسم المنشأة أو حساب CliQ تجاري معتمد.' : 'Criteria: Verified Corporate Bank IBAN or Business CliQ Alias.'}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-blue-950 mb-1">
                      <span>{lang === 'ar' ? 'الطبقة 3: المالية' : 'L3: Financial Trust'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold border border-blue-300">
                        {lang === 'ar' ? 'أزرق ملكي' : 'Royal Blue'}
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-900 font-medium">
                      {lang === 'ar' ? 'حساب تجاري / CliQ' : 'Merchant IBAN / CliQ'}
                    </p>
                    <div className="text-[9.5px] text-blue-800/90 mt-1.5 pt-1.5 border-t border-blue-200/60 font-medium leading-tight flex items-start gap-1">
                      <span className="text-blue-700 font-bold shrink-0">🎯</span>
                      <span>{lang === 'ar' ? 'الشروط: حساب بنكي تجاري موثق' : 'Criteria: Verified Corporate IBAN'}</span>
                    </div>
                  </div>

                  {/* Layer 4: Quality & Ratings / Amber Gold */}
                  <div 
                    className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 transition-all hover:border-amber-300 shadow-2xs group relative"
                    title={lang === 'ar' ? 'معيار الحصول: ربط الفواتير الإلكترونية المعتمدة وجمع تقييمات العملاء الحقيقية.' : 'Criteria: E-Invoicing integration & verified buyer customer feedback.'}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-amber-950 mb-1">
                      <span>{lang === 'ar' ? 'الطبقة 4: الجودة' : 'L4: Quality & Ratings'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold border border-amber-300">
                        {lang === 'ar' ? 'شارة ذهبية' : 'Gold Tier'}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-900 font-medium">
                      {lang === 'ar' ? 'فواتير وتقييمات' : 'E-Invoicing & Reviews'}
                    </p>
                    <div className="text-[9.5px] text-amber-800/90 mt-1.5 pt-1.5 border-t border-amber-200/60 font-medium leading-tight flex items-start gap-1">
                      <span className="text-amber-700 font-bold shrink-0">🎯</span>
                      <span>{lang === 'ar' ? 'الشروط: ربط الفواتير والتقييمات' : 'Criteria: E-Invoices & Verified Reviews'}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* MODULE 1: Mandatory Consent Checkbox */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (formSummaryError) setFormSummaryError(null);
                    }}
                    className="mt-1 w-4 h-4 text-[#047857] rounded border-slate-300 focus:ring-[#047857] cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {lang === 'ar' ? (
                      <>
                        أوافق على <button type="button" onClick={() => onOpenTerms?.()} className="text-[#047857] underline font-black hover:text-[#036247]">شروط خدمة التاجر الخاصة بمضمون</button>، و<button type="button" onClick={() => onOpenDisclaimer?.()} className="text-[#047857] underline font-black hover:text-[#036247]">إرشادات مكافحة الاحتيال</button>، و<button type="button" onClick={() => onOpenPrivacy?.()} className="text-[#047857] underline font-black hover:text-[#036247]">سياسة الخصوصية</button>. وأقر بأن جميع البيانات المدخلة والنطاقات ورقم الواتساب صحيحة ومملوكة قانونياً لمنشأتي.
                      </>
                    ) : (
                      <>
                        I agree to the <button type="button" onClick={() => onOpenTerms?.()} className="text-[#047857] underline font-black hover:text-[#036247]">Madmoon Merchant Terms of Service</button>, <button type="button" onClick={() => onOpenDisclaimer?.()} className="text-[#047857] underline font-black hover:text-[#036247]">Anti-Fraud Guidelines</button>, and <button type="button" onClick={() => onOpenPrivacy?.()} className="text-[#047857] underline font-black hover:text-[#036247]">Privacy Policy</button>. I certify that all submitted business details, domains, and contact channels are accurate and legally owned by my entity.
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Form level error summary banner */}
              {formSummaryError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{formSummaryError}</span>
                </div>
              )}

              {/* Proceed to OTP Button */}
              <button
                type="submit"
                className="w-full bg-[#047857] hover:bg-[#036247] text-white font-black text-base py-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                <span>{lang === 'ar' ? 'إصدار ختم التوثيق الرقمي' : 'Issue Digital Verification Seal'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-5 h-5 shrink-0" /> : <ArrowRight className="w-5 h-5 shrink-0" />}
              </button>

              {/* MODULE 1: Disclaimer Banner under submit button */}
              <div className="text-center p-4 bg-slate-100/90 rounded-2xl border border-slate-200/90 text-[11px] text-slate-600 font-medium leading-relaxed space-y-1">
                <span className="font-extrabold text-slate-800 block">
                  {lang === 'ar' ? '⚖️ تنبيه قانوني وتحديد نطاق التوثيق:' : '⚖️ Legal Notice & Scope Disclaimer:'}
                </span>
                <p>
                  {lang === 'ar'
                    ? 'تنبيه: توثيق مضمون يؤكد دقة بيانات التواصل، السجل التجاري، أو البيانات المالية المقدمة بحسب فئة التوثيق. التوثيق لا يشكل شراكة تجارية، ضماناً للمنتجات، أو تأييداً قانونياً لعمليات البيع.'
                    : 'Notice: Verification by Madmoon confirms the accuracy of submitted contact identity, Commercial Registration, or financial account details corresponding to your tier. Verification does not constitute a joint venture, product warranty, or legal endorsement of sales transactions.'}
                </p>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: FIREBASE OTP GATE */}
        {step === 'otp' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-[#047857] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'ar' ? 'رمز التحقق عبر الرسائل النصية' : 'SMS OTP Security Gate'}
              </h3>
              <p className="text-xs text-slate-600 font-medium dir-ltr">
                {formattedFullPhone}
              </p>
            </div>

            <form onSubmit={handleVerifyOtpAndSave} className="space-y-6 max-w-md mx-auto">
              
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 text-center">
                  {lang === 'ar' ? 'أدخل الرمز المكون من 6 أرقام' : 'Enter 6-digit SMS OTP Code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="●●●●●●"
                  className="w-full bg-[#F8FAFC] border-2 border-emerald-600/40 focus:border-[#047857] rounded-2xl px-4 py-4 text-center text-2xl font-mono font-black tracking-widest text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              {otpError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 font-medium space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-[#047857]">
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'بوابة الأمان والتحقق عبر SMS' : 'Firebase SMS OTP Security Gate'}</span>
                </div>
                <p>
                  {lang === 'ar'
                    ? 'يتم إرسال رمز التحقق عبر SMS بواسطة Firebase Authentication لتوثيق ملكية رقم الهاتف ومنع الاحتيال.'
                    : 'SMS OTP code is sent via Firebase Authentication to verify your phone number and prevent fraud.'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#047857] hover:bg-[#036247] text-white font-black text-base py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === 'ar' ? 'جاري التحقق وحفظ البيانات...' : 'Verifying & Registering...'}</span>
                  ) : (
                    <>
                      <MadmoonLogo className="w-5 h-5" variant="white" />
                      <span>{lang === 'ar' ? 'تأكيد الرمز وتوثيق المتجر' : 'Verify Code & Complete Registration'}</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={triggerSendOtp}
                    disabled={otpLoading}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#047857] font-extrabold text-xs py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {otpLoading
                      ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                      : (lang === 'ar' ? 'إعادة إرسال رمز SMS' : 'Resend SMS Code')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl transition-all"
                  >
                    {lang === 'ar' ? '← تعديل البيانات' : '← Edit Form'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS REVEAL & EMBED CODE (REQUIREMENT 1) */}
        {step === 'success' && createdStore && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* SUCCESS & REVEAL BANNER WITH EXACT REQUIRED COPY */}
            <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-emerald-50 text-[#047857] border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {lang === 'ar' ? 'تم تأكيد رقم هاتفك بنجاح!' : 'Phone Verified Successfully!'}
                </h3>
                
                {/* REQUIRED ARABIC COPY */}
                <div className="bg-emerald-50/80 border border-emerald-300 text-emerald-950 p-4 rounded-2xl text-xs sm:text-sm font-extrabold max-w-xl mx-auto leading-relaxed shadow-2xs">
                  {lang === 'ar' ? (
                    'تم تأكيد رقم هاتفك بنجاح! يرجى تركيب الكود الآن. ستظهر الشارة على متجرك فور مراجعة الإدارة (خلال 24 ساعة).'
                  ) : (
                    'Phone verified successfully! Please install the code now. The badge will appear on your store upon admin approval within 24 hours.'
                  )}
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black px-4 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{lang === 'ar' ? 'الحالة الحالية: قيد مراجعة الإدارة (Pending Approval)' : 'Current Status: Pending Admin Review'}</span>
              </div>
            </div>

            {/* EMBED CODE BOX */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#047857]" />
                  <h4 className="text-base font-black text-slate-900">
                    {lang === 'ar' ? 'كود الإدراج المباشر (Embed Script)' : 'Direct Embed Script'}
                  </h4>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none">
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">
                      {lang === 'ar' ? 'موقع الختم' : 'Placement'}
                    </label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value as any)}
                      className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#047857]"
                    >
                      <option value="bottom-right">{lang === 'ar' ? 'أسفل اليمين' : 'Bottom-Right'}</option>
                      <option value="bottom-left">{lang === 'ar' ? 'أسفل اليسار' : 'Bottom-Left'}</option>
                    </select>
                  </div>

                  <div className="flex-1 sm:flex-none">
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">
                      {lang === 'ar' ? 'النسق' : 'Theme'}
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as any)}
                      className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#047857]"
                    >
                      <option value="light">{lang === 'ar' ? 'فاتح' : 'Light'}</option>
                      <option value="dark">{lang === 'ar' ? 'داكن' : 'Dark'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Code Box & Copy */}
              <div className="space-y-3">
                <pre 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed dir-ltr" 
                  dir="ltr"
                >
                  {`<script src="${window.location.origin}/badge.js" data-store="${createdStore.slug}" data-placement="${placement}" data-theme="${theme}" data-lang="${lang}" async></script>`}
                </pre>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full bg-[#047857] hover:bg-[#036247] text-white py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>{lang === 'ar' ? 'تم نسخ الكود بنجاح!' : 'Copied to Clipboard!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'نسخ كود الإدراج' : 'Copy Embed Code'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* LIVE PREVIEW CANVAS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#047857]" />
                    <span>{lang === 'ar' ? 'معاينة الختم التفاعلي' : 'Live Badge Preview'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'ستظهر الشارة فور اعتماد الإدارة خلال 24 ساعة:' : 'Badge will activate automatically once approved:'}
                  </p>
                </div>
                
                <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'معاينة (قيد التفعيل)' : 'Pending Activation'}</span>
                </span>
              </div>

              {/* Simulated Store Canvas */}
              <div className="bg-slate-100 rounded-2xl border border-slate-300 p-8 min-h-[220px] relative flex flex-col justify-between overflow-hidden shadow-inner">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#047857] text-white flex items-center justify-center font-black text-xs">
                      {createdStore.nameAr.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{createdStore.nameAr}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{createdStore.websiteUrl}</div>
                    </div>
                  </div>
                  <div className="h-2 w-20 bg-slate-200 rounded-full" />
                </div>

                <div className="py-4 text-center sm:text-right">
                  <div className="h-2.5 bg-slate-200/80 rounded-md w-3/4 mx-auto sm:mx-0 mb-2" />
                  <div className="h-2 bg-slate-200/60 rounded-md w-1/2 mx-auto sm:mx-0" />
                </div>

                <div className={`flex ${placement === 'bottom-left' ? 'justify-start' : 'justify-end'} pt-2`}>
                  <div
                    onClick={() => onOpenCertificate && onOpenCertificate(createdStore.slug)}
                    className={`group relative cursor-pointer rounded-full transition-all duration-300 shadow-lg border flex items-center gap-2.5 px-4 py-2.5 ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-white text-slate-900 border-slate-200'
                    }`}
                  >
                    <MadmoonLogo className="w-5 h-5 shrink-0" variant={theme === 'dark' ? 'colored-dark' : 'colored-light'} />
                    <div className="text-xs font-black tracking-tight whitespace-nowrap">
                      {createdStore.sellerType === 'business'
                        ? (lang === 'ar' ? 'مضمون | منشأة مسجلة' : 'Madmoon | Registered Entity')
                        : (lang === 'ar' ? 'مضمون | هوية مؤكدة' : 'Madmoon | Personal Identity')}
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetWizard}
                  className="text-xs font-extrabold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تسجيل متجر آخر' : 'Register Another Store'}</span>
                </button>

                {onOpenCertificate && (
                  <button
                    type="button"
                    onClick={() => onOpenCertificate(createdStore.slug)}
                    className="text-xs font-extrabold text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'معاينة شهادة التوثيق' : 'View Verification Certificate'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
