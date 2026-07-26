import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Code2, Sparkles, Monitor, ShoppingBag, Phone, Mail, CheckCircle2, Layout, Zap, ArrowUpRight, Award, Star, Building, Share2 } from 'lucide-react';
import { Language, MerchantStore, BadgeStyleOption } from '../types';
import { translations } from '../translations';

interface BadgeGeneratorProps {
  lang: Language;
  store: MerchantStore;
  onOpenCertificate: (slug: string) => void;
  onStoreUpdated: (updatedStore: MerchantStore) => void;
}

export const BadgeGenerator: React.FC<BadgeGeneratorProps> = ({
  lang,
  store,
  onOpenCertificate,
  onStoreUpdated
}) => {
  const t = translations[lang];

  // Customization state
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyleOption>('footer-gov');
  const [badgeTheme, setBadgeTheme] = useState<'emerald' | 'dark' | 'glass'>('dark');
  const [badgePosition, setBadgePosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [copied, setCopied] = useState(false);

  // Generate HTML snippet based on chosen style
  const embedSnippet = `<script src="https://madmoon.jo/badge.js" data-store="${store.slug}" data-style="${badgeStyle}" data-theme="${badgeTheme}" data-position="${badgePosition}" async></script>`;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBadgeClickInDemo = () => {
    const updated: MerchantStore = {
      ...store,
      clickCount: store.clickCount + 1
    };
    onStoreUpdated(updated);
    onOpenCertificate(store.slug);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'ar' ? 'مولد الأختام والشارات المعتمدة 2026' : 'Verified Trust Seals Generator'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.generatorTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl font-medium leading-relaxed">
              {lang === 'ar' 
                ? 'اختر تصميم الختم المناسب لمتجرك (ختم السجل التجاري الحكومي، أختام الشهادة الذهبية والفضية، أو مربع الاعتماد والتقييم) واحصل على كود الإدراج الفوري.'
                : 'Select the optimal trust seal style for your e-commerce store (Official CR/Tax Footer, Gold/Silver Ribbon Ribbons, Accredited Business Box, or Floating Seal).'}
            </p>
          </div>

          <button
            onClick={() => onOpenCertificate(store.slug)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm shrink-0"
          >
            <span>{t.verifyCertificateBtn}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Customizer & Embed Code (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Style Selector Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <span>{lang === 'ar' ? '1. اختر نوع تصميم الختم' : '1. Choose Trust Badge Style'}</span>
            </h3>

            {/* Style Cards List */}
            <div className="space-y-3">
              
              {/* Option 1: Government CR & Tax Footer Widget */}
              <button
                type="button"
                onClick={() => setBadgeStyle('footer-gov')}
                className={`w-full text-right rtl:text-right ltr:text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  badgeStyle === 'footer-gov'
                    ? 'bg-emerald-50/80 border-emerald-800 ring-2 ring-emerald-800/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                  badgeStyle === 'footer-gov' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-900">
                      {lang === 'ar' ? 'فوتر السجل التجاري والضريبي' : 'CR & Tax Footer Widget'}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'ar' ? 'مؤهل ✓ (المستوى 1)' : 'Qualified ✓ (Level 1)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'شريط رسمي ممتد لفوتر المتجر يظهر بيانات السجل التجاري والضريبي' : 'Full footer banner presenting commercial registration and tax record'}
                  </div>
                </div>
              </button>

              {/* Option 2: Premium Crest Seal */}
              <button
                type="button"
                onClick={() => setBadgeStyle('ribbon-gold')}
                className={`w-full text-right rtl:text-right ltr:text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  badgeStyle === 'ribbon-gold'
                    ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                  💎
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>{lang === 'ar' ? 'ختم الفئة الممتازة (Premium)' : 'Premium Tier Seal'}</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'ar' ? 'يتطلب تأهيل ممتاز' : 'Requires Premium Qualification'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'وسام النخبة المخصص للمتاجر المتميزة ذات المبيعات والأمان العالي' : 'Elite tier badge for top qualified high-volume merchants'}
                  </div>
                </div>
              </button>

              {/* Option 3: Professional Crest Seal */}
              <button
                type="button"
                onClick={() => setBadgeStyle('ribbon-silver')}
                className={`w-full text-right rtl:text-right ltr:text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  badgeStyle === 'ribbon-silver'
                    ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-400 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                  ⭐
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-900">
                      {lang === 'ar' ? 'ختم الفئة الاحترافية (Professional)' : 'Professional Tier Seal'}
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-800 border border-slate-300 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'ar' ? 'تأهيل احترافي' : 'Professional Tier'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'ختم الاعتماد الاحترافي المصمم للتركيب في مختلف أقسام المتجر' : 'Professional accredited badge suited for placement across all store sections'}
                  </div>
                </div>
              </button>

              {/* Option 4: Accredited Rating Box */}
              <button
                type="button"
                onClick={() => setBadgeStyle('accredited-box')}
                className={`w-full text-right rtl:text-right ltr:text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  badgeStyle === 'accredited-box'
                    ? 'bg-emerald-50/80 border-emerald-800 ring-2 ring-emerald-800/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 font-black text-xs">
                  <Star className="w-4 h-4 fill-emerald-300 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-900">
                      {lang === 'ar' ? 'مربع التقييم والاعتماد' : 'Accreditation Rating Box'}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'ar' ? 'مؤهل ✓' : 'Qualified ✓'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'لوحة الاعتماد بدرجة التقييم وعدد فحوصات المشترين المباشرة' : 'Accreditation rating box displaying buyer check metrics'}
                  </div>
                </div>
              </button>

              {/* Option 5: Floating Pill Seal */}
              <button
                type="button"
                onClick={() => setBadgeStyle('floating-pill')}
                className={`w-full text-right rtl:text-right ltr:text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  badgeStyle === 'floating-pill'
                    ? 'bg-emerald-50/80 border-emerald-800 ring-2 ring-emerald-800/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 font-black text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-slate-900">
                      {lang === 'ar' ? 'الختم العائم الذكي' : 'Smart Floating Corner Seal'}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'ar' ? 'مؤهل ✓ (المستوى 1)' : 'Qualified ✓ (Level 1)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {lang === 'ar' ? 'ختم تفاعلي ثابت في زاوية المتجر يستجيب لزيارات المشترين' : 'Sticky interactive badge anchored to bottom screen corner'}
                  </div>
                </div>
              </button>

            </div>

            {/* Theme & Position toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'نسق الألوان' : 'Color Scheme'}
                </label>
                <select
                  value={badgeTheme}
                  onChange={(e) => setBadgeTheme(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-800"
                >
                  <option value="dark">{lang === 'ar' ? 'داكن' : 'Dark Slate'}</option>
                  <option value="emerald">{lang === 'ar' ? 'زمردي رسمي' : 'Official Emerald'}</option>
                  <option value="glass">{lang === 'ar' ? 'فاتح شفاف' : 'Light Glass'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'الموقع الشاشة' : 'Position'}
                </label>
                <select
                  value={badgePosition}
                  onChange={(e) => setBadgePosition(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-800"
                >
                  <option value="bottom-right">{lang === 'ar' ? 'أسفل اليمين' : 'Bottom Right'}</option>
                  <option value="bottom-left">{lang === 'ar' ? 'أسفل اليسار' : 'Bottom Left'}</option>
                </select>
              </div>
            </div>

          </div>

          {/* Embed Code Snippet */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-800" />
                <span>{lang === 'ar' ? '2. كود الإدراج الصغير (1-Line Embed)' : '2. Copy 1-Line Embed Code'}</span>
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono px-2 py-0.5 rounded-md font-extrabold">
                Auto-Sync
              </span>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed dir-ltr" dir="ltr">
                {embedSnippet}
              </pre>
              <button
                id="copy-embed-code-btn"
                onClick={() => handleCopyCode(embedSnippet)}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copiedMsg}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyCodeBtn}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {lang === 'ar'
                ? 'انسخ كود الجافاسكربت أعلاه وضعه في الفوتر أو قبل إغلاق </body> في منصات سلة (Salla) وزد (Zid) وشوبيفاي (Shopify) وووردبريس.'
                : 'Paste this snippet in your store template footer before the closing </body> tag on Salla, Zid, Shopify, or WooCommerce.'}
            </p>
          </div>

        </div>

        {/* Right Column: LIVE E-COMMERCE STORE CANVAS SIMULATOR (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-emerald-800" />
                  <span>{lang === 'ar' ? 'معاينة حية وتفاعلية داخل المتجر' : 'Live Store Interactive Preview'}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {lang === 'ar' ? 'شاهد كيف سينعكس هذا الختم على زوار متجرك الإلكتروني في الوقت الفعلي:' : 'How this verified seal appears on your live e-commerce store:'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{lang === 'ar' ? 'محاكي سلة وزد' : 'Salla & Zid Canvas'}</span>
              </div>
            </div>

            {/* SIMULATED E-COMMERCE CANVAS */}
            <div className="bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden relative min-h-[520px] flex flex-col justify-between shadow-inner">
              
              {/* Simulated Store Header */}
              <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm border border-emerald-900 shadow-2xs">
                    {store.nameAr.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{store.nameAr}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{store.websiteUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                  <span className="hidden sm:inline">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
                  <span className="hidden sm:inline">{lang === 'ar' ? 'الكتالوج' : 'Catalog'}</span>
                  <div className="bg-slate-900 text-white font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>2</span>
                  </div>
                </div>
              </div>

              {/* Simulated Store Content */}
              <div className="p-6 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-200">
                    {lang === 'ar' ? 'منتجات حصرية موثقة' : 'Verified Products'}
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {lang === 'ar' ? `أهلاً بكم في متجر ${store.nameAr}` : `Welcome to ${store.nameAr}`}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {lang === 'ar' ? 'متجر معتمد ومسجل رسمياً مع إمكانية الدفع والتوصيل المباشر.' : 'Verified online store with official commercial registration.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
                      <div className="w-full h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-800 font-black font-mono">25.00 JOD</span>
                        <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-md">{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE RENDERING OF THE SELECTED BADGE STYLE INSIDE STORE PREVIEW */}
              <div className="mt-auto bg-white border-t border-slate-300 p-4 sm:p-6 space-y-4">
                
                {/* STYLE 1: GOVERNMENT CR & TAX FOOTER WIDGET (as in Image 1) */}
                {badgeStyle === 'footer-gov' && (
                  <div
                    onClick={handleBadgeClickInDemo}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md ${
                      badgeTheme === 'dark' 
                        ? 'bg-slate-900 text-white border-slate-800' 
                        : 'bg-emerald-950 text-white border-emerald-900'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Left/Main Store Brand & Reg */}
                      <div className="space-y-1.5 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                        <h4 className="text-base font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                          <span>{store.nameAr}</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                            موثق بـ مضمون ✓
                          </span>
                        </h4>
                        <p className="text-xs text-slate-300 font-medium">
                          {lang === 'ar' ? 'متجر إلكتروني معتمد رسمياً لبيع جميع المنتجات' : 'Officially accredited commercial merchant'}
                        </p>
                      </div>

                      {/* Government Commercial Reg & Tax Numbers Block (Image 1 Style) */}
                      <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-4 py-3 rounded-2xl">
                        <div className="text-center sm:text-right">
                          <div className="flex items-center gap-3 text-xs font-black text-slate-200">
                            <div>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'السجل التجاري' : 'CR Number'}</span>
                              <span className="font-mono text-white text-xs font-bold tracking-wider">{store.commercialReg}</span>
                            </div>
                            <div className="h-6 w-px bg-white/20" />
                            <div>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الرقم الضريبي' : 'Tax ID'}</span>
                              <span className="font-mono text-emerald-400 text-xs font-bold tracking-wider">{store.taxNumber || '300223169300003'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Kingdom / State Crest emblem */}
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-600 flex items-center justify-center shrink-0 text-white shadow-sm">
                          <ShieldCheck className="w-6 h-6 text-emerald-200" />
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STYLE 2: PREMIUM CREST SEAL */}
                {badgeStyle === 'ribbon-gold' && (
                  <div
                    onClick={handleBadgeClickInDemo}
                    className="cursor-pointer bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-amber-500/20 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Ribbon Crest Badge SVG / Visual */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-2 border-amber-200 shadow-lg flex items-center justify-center text-slate-950 font-black">
                          <ShieldCheck className="w-8 h-8 text-slate-950" />
                        </div>
                        {/* Premium Ribbon Tag */}
                        <div className="absolute -bottom-1 -left-2 bg-amber-600 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-yellow-200">
                          {lang === 'ar' ? 'الفئة الممتازة' : 'PREMIUM TIER'}
                        </div>
                      </div>

                      <div className="text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                        <div className="text-xs font-black text-amber-950 flex items-center justify-center sm:justify-start gap-1.5">
                          <span>{lang === 'ar' ? 'مضمون | الفئة الممتازة' : 'Madmoon | Premium Tier'}</span>
                          <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">💎 {lang === 'ar' ? 'ممتاز' : 'Premium'}</span>
                        </div>
                        <p className="text-[11px] text-amber-900 font-medium mt-1">
                          {lang === 'ar' ? `سجل تجاري نشط # ${store.commercialReg} • اعتماد النخبة` : `Active Commercial Record #${store.commercialReg} • Premium Accreditation`}
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-xs shrink-0 flex items-center gap-1.5">
                      <span>{lang === 'ar' ? 'تحقق من الشهادة' : 'Inspect Certificate'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* STYLE 3: PROFESSIONAL CREST SEAL */}
                {badgeStyle === 'ribbon-silver' && (
                  <div
                    onClick={handleBadgeClickInDemo}
                    className="cursor-pointer bg-slate-100 border-2 border-slate-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Professional Crest */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-500 border-2 border-white shadow-md flex items-center justify-center text-white font-black">
                          <ShieldCheck className="w-8 h-8 text-emerald-300" />
                        </div>
                        <div className="absolute -bottom-1 -left-2 bg-slate-800 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                          {lang === 'ar' ? 'الفئة الاحترافية' : 'PROFESSIONAL TIER'}
                        </div>
                      </div>

                      <div className="text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                        <div className="text-xs font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                          <span>{lang === 'ar' ? 'مضمون | الفئة الاحترافية' : 'Madmoon | Professional Tier'}</span>
                          <span className="bg-slate-300 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">⭐ {lang === 'ar' ? 'احترافي' : 'Professional'}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mt-1">
                          {lang === 'ar' ? `سجل تجاري معتمد # ${store.commercialReg} • توثيق احترافي` : `Verified Commercial Record #${store.commercialReg} • Professional Verification`}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs shrink-0 flex items-center gap-1.5">
                      <span>{lang === 'ar' ? 'فحص الشهادة' : 'Inspect Seal'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                )}

                {/* STYLE 4: ACCREDITED RATING BOX */}
                {badgeStyle === 'accredited-box' && (
                  <div
                    onClick={handleBadgeClickInDemo}
                    className="cursor-pointer bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-500/50 transition-all shadow-md"
                  >
                    {/* ACCREDITED GRADE BOX */}
                    <div className="bg-emerald-800 text-white px-3 py-2 rounded-xl flex items-center gap-2 border border-emerald-700 shrink-0">
                      <div className="w-7 h-7 bg-white text-emerald-900 font-black text-xs rounded-lg flex items-center justify-center shadow-2xs">
                        A+
                      </div>
                      <div className="text-right leading-none">
                        <span className="block text-[10px] font-extrabold uppercase text-emerald-200 tracking-wider">
                          {lang === 'ar' ? 'درجة الاعتماد' : 'ACCREDITATION SCORE'}
                        </span>
                        <span className="text-xs font-black text-white">{lang === 'ar' ? 'متجر معتمد وموثق' : 'Verified Merchant'}</span>
                      </div>
                    </div>

                    {/* STARS & REVIEWS */}
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-400 mb-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                        ))}
                        <span className="text-xs font-extrabold text-white mr-1.5">{store.clickCount + 2560}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {lang === 'ar' ? 'فحص وتأكيد مباشر من المشترين عبر مضمون' : 'Live buyer verification inspection seal'}
                      </p>
                    </div>

                    <div className="text-xs font-black text-emerald-400 flex items-center gap-1 shrink-0">
                      <span>{lang === 'ar' ? 'توثيق مضمون' : 'Madmoon Verified'}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                )}

                {/* STYLE 5: FLOATING PILL SEAL (as in Image 4) */}
                {badgeStyle === 'floating-pill' && (
                  <div className="flex justify-end p-2">
                    <div
                      onClick={handleBadgeClickInDemo}
                      className="cursor-pointer bg-emerald-800 text-white font-extrabold px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 hover:scale-105 transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-950/30 flex items-center justify-center text-emerald-200">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="text-right leading-none">
                        <div className="text-xs font-black text-white">مضمون | متجر مضمون ✓</div>
                        <div className="text-[10px] text-emerald-200 font-mono mt-0.5">{store.verificationBadgeId}</div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    </div>
                  </div>
                )}

              </div>

            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-xs text-emerald-900 font-extrabold flex items-center justify-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>{lang === 'ar' ? 'اضغط على الختم أعلاه لتجربة المشتري عند فتح شهادة التوثيق الرسمية!' : 'Click any badge above to test the live buyer inspection flow!'}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
