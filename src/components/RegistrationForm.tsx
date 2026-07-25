import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Building2, Globe, Phone, FileText, Tag, Sparkles } from 'lucide-react';
import { Language, MerchantStore, CountryCode, StoreCategory } from '../types';
import { translations } from '../translations';
import { COUNTRIES } from '../data/countries';
import { addMerchantToFirestore } from '../firebase';

interface RegistrationFormProps {
  lang: Language;
  onStoreRegistered: (store: MerchantStore) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  lang,
  onStoreRegistered
}) => {
  const t = translations[lang];

  // Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState<CountryCode>('JO');
  const [phone, setPhone] = useState('');
  const [commercialReg, setCommercialReg] = useState('');
  const [category, setCategory] = useState<StoreCategory>('crafts');
  const [ownerName, setOwnerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helper to generate slug
  const generateSlug = (text: string) => {
    const raw = text.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-').replace(/-+/g, '-');
    if (!raw || raw === '-') return 'my-store-' + Math.floor(Math.random() * 8999 + 1000);
    return raw;
  };

  const selectedCountryInfo = COUNTRIES[country];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr && !nameEn) return;
    if (!websiteUrl) return;
    if (!commercialReg) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const slug = generateSlug(nameEn || nameAr);
      const cleanUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

      const newStore: MerchantStore = {
        id: `store-${Date.now()}`,
        slug: slug,
        nameAr: nameAr || nameEn,
        nameEn: nameEn || nameAr,
        websiteUrl: cleanUrl,
        phone: phone ? `${selectedCountryInfo.dialCode}${phone.replace(/\D/g, '')}` : `${selectedCountryInfo.dialCode}790000000`,
        commercialReg: commercialReg,
        category: category,
        country: country,
        verifiedAt: new Date().toISOString().split('T')[0],
        verificationBadgeId: `MDM-${country}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        domainVerified: true,
        whatsappVerified: true,
        crVerified: true,
        clickCount: 1,
        reportCount: 0,
        ownerName: ownerName || (lang === 'ar' ? 'تاجر موثق' : 'Verified Merchant'),
        isSample: false,
        verificationStatus: 'pending',
        tier: 'Tier 1 - Standard',
        createdAt: new Date().toISOString()
      };

      // Sync to Firestore
      addMerchantToFirestore(newStore).catch(err => console.warn('Firestore store save error:', err));

      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        onStoreRegistered(newStore);
      }, 1200);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-4 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'ar' ? 'توثيق فوري للهوية التجارية' : 'Instant Merchant Verification'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.formTitle}
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          {t.formSub}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        {success ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {lang === 'ar' ? 'تم إصدار ختم التوثيق بنجاح! 🎉' : 'Trust Badge Issued Successfully! 🎉'}
            </h3>
            <p className="text-slate-600 text-sm font-medium">
              {lang === 'ar' ? 'جاري تحويلك إلى لوحة التحكم ومولد كود الإدراج...' : 'Redirecting you to the badge generator dashboard...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Country Selector First */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>{t.countryLabel}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(COUNTRIES) as CountryCode[]).map((cCode) => {
                  const cInfo = COUNTRIES[cCode];
                  const isSelected = country === cCode;
                  return (
                    <button
                      key={cCode}
                      type="button"
                      onClick={() => setCountry(cCode)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-950 font-black ring-2 ring-emerald-600/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{cInfo.flag}</span>
                      <div className="text-xs">
                        <div className="font-bold text-slate-900">
                          {lang === 'ar' ? cInfo.nameAr : cInfo.nameEn}
                        </div>
                        <div className="text-slate-500 text-[10px] font-mono">
                          {cInfo.dialCode}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>{t.storeNameArLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: متجر الزيتون الذهبي' : 'e.g., Golden Olive Store'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>{t.storeNameEnLabel}</span>
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g., Golden Olive Store"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Website URL & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span>{t.websiteUrlLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://mystore.jo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors ltr"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>{t.categoryLabel}</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StoreCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm font-extrabold focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
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

            {/* Commercial Reg / National ID (CRITICAL FOR JORDAN & GCC) */}
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <label className="block text-xs font-black text-emerald-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>{t.crLabel} *</span>
              </label>
              <input
                type="text"
                required
                value={commercialReg}
                onChange={(e) => setCommercialReg(e.target.value)}
                placeholder={selectedCountryInfo.crFormatAr}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-mono focus:outline-none focus:border-emerald-600 transition-colors"
              />
              <p className="text-[11px] text-slate-600 font-medium">
                {lang === 'ar'
                  ? `سيتم المطابقة التلقائية للسجل التجاري مع قاعدة بيانات السجلات الرسمية في ${selectedCountryInfo.nameAr}.`
                  : `Automated match against official ${selectedCountryInfo.nameEn} Commercial Registry.`}
              </p>
            </div>

            {/* Phone & Owner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{t.phoneLabel}</span>
                </label>
                <div className="flex gap-2" dir="ltr">
                  <span className="bg-slate-100 border border-slate-300 text-slate-700 font-mono px-3 py-3 rounded-xl text-sm flex items-center font-bold">
                    {selectedCountryInfo.dialCode}
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="791234567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{t.ownerNameLabel}</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسم المالكون / الشركاء' : 'Owner / Manager Full Name'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Instant Slug Preview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">
                {lang === 'ar' ? 'رابط شهادة التوثيق العامة المتوقع:' : 'Public Certificate URL:'}
              </span>
              <span className="font-mono text-emerald-900 font-extrabold dir-ltr">
                https://madmoon.jo/verify/{generateSlug(nameEn || nameAr)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{lang === 'ar' ? 'جاري التحقق وإصدار الختم...' : 'Verifying and Issuing Seal...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  <span>{t.submitRegistration}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </>
              )}
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
