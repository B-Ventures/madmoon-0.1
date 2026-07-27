import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Users, ExternalLink, Award, ArrowLeft, ArrowRight, Lock, Building2 } from 'lucide-react';
import { Language, MerchantStore } from '../types';
import { translations } from '../translations';
import { MadmoonLogo } from './MadmoonLogo';
import { getStoreLayerInfo } from '../utils/layerUtils';

interface HeroSectionProps {
  lang: Language;
  onRegisterClick: () => void;
  onDirectoryClick: () => void;
  sampleStores: MerchantStore[];
  onSelectStoreToVerify: (slug: string) => void;
  totalClickCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onRegisterClick,
  onDirectoryClick,
  sampleStores,
  onSelectStoreToVerify,
  totalClickCount
}) => {
  const t = translations[lang];

  return (
    <div className="relative overflow-hidden bg-slate-50 pt-8 pb-16 border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Two-Column Institutional Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          
          {/* Main Headline Column */}
          <div className="lg:col-span-7 text-right">
            
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs mb-6">
              <MadmoonLogo className="w-4 h-4" variant="colored-light" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 leading-[1.18] tracking-tight">
              {t.heroHeadline}
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-700 font-medium leading-relaxed max-w-2xl">
              {t.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="hero-primary-cta"
                onClick={onRegisterClick}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base px-7 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5"
              >
                <MadmoonLogo className="w-5 h-5" variant="white" />
                <span>{t.heroCtaPrimary}</span>
              </button>

              <button
                id="hero-secondary-cta"
                onClick={onDirectoryClick}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-base px-7 py-3.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>{t.heroCtaSecondary}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4 text-slate-500" /> : <ArrowRight className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* Micro Guarantee Tags */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'التحقق من السجل التجاري / الهوية' : 'Commercial Reg & ID Verification'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'تأكيد الواتساب والنطاق' : 'Domain & WhatsApp Validation'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'كود برمجيات خفيف 100%' : 'Ultra-light 1-line HTML snippet'}</span>
              </div>
            </div>

          </div>

          {/* Interactive Live Preview Card Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {lang === 'ar' ? 'معاينة ختم الثقة المباشر' : 'Live Trust Badge Preview'}
                </span>
              </div>

              {/* Sample Store Footer Context */}
              <div className="bg-slate-900 rounded-2xl p-6 text-slate-100 relative min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
                    <span className="font-bold text-slate-200">متجر حرف عمان | Amman Artisans</span>
                    <span>© 2026</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    جميع الحقوق محفوظة للمتجر. منتجات يدوية أصيلة وموثوقة من المملكة الأردنية الهاشمية.
                  </p>
                </div>

                {/* Embedded Floating Pill Badge inside Footer */}
                <div className="mt-6 flex justify-end">
                  <div 
                    onClick={() => onSelectStoreToVerify('amman-artisans')}
                    className="cursor-pointer bg-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 transition-transform hover:scale-105"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center p-1.5 shrink-0">
                      <MadmoonLogo className="w-full h-full" variant="white" />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                        <span>مضمون 🇯🇴</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <div className="text-xs font-bold text-white">متجر مضمون</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Certificate Quick Details */}
              <div className="mt-4 pt-3 text-xs flex items-center justify-between text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span className="font-extrabold text-slate-900">سجل تجاري: 200148902</span>
                </div>
                <button
                  onClick={() => onSelectStoreToVerify('amman-artisans')}
                  className="text-emerald-800 hover:text-emerald-900 font-extrabold underline text-[11px]"
                >
                  {lang === 'ar' ? 'فحص الشهادة الحية ←' : 'Verify Live Certificate →'}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* INSTITUTIONAL LIVE TRUST STATS BAR */}
        <div className="mt-14 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="text-center mb-5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t.heroTrustTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center mb-1.5">
                <MadmoonLogo className="w-5 h-5" variant="colored-light" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-numeric">
                1,248+
              </div>
              <div className="text-xs text-slate-600 mt-1 font-semibold">
                {t.statBadgesServed}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center text-emerald-700 mb-1.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-numeric">
                {sampleStores.length + 120}
              </div>
              <div className="text-xs text-slate-600 mt-1 font-semibold">
                {t.statVerifiedStores}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center text-emerald-700 mb-1.5">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-numeric">
                {totalClickCount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 mt-1 font-semibold">
                {t.statBuyerClicks}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center text-emerald-700 mb-1.5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-numeric">
                +38%
              </div>
              <div className="text-xs text-slate-600 mt-1 font-semibold">
                {t.statConversionBoost}
              </div>
            </div>

          </div>
        </div>

        {/* SAMPLE STORES PREVIEW TEASER */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {lang === 'ar' ? 'أبرز المتاجر والمنشآت الموثقة حديثاً في الشرق الأوسط وشمال إفريقيا (MENA)' : 'Recently Verified Businesses in Middle East & North Africa (MENA)'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {lang === 'ar' ? 'انقر على أي متجر لمشاهدة شهادة التوثيق الحية ورقم السجل التجاري' : 'Click any store to inspect its live verification certificate'}
              </p>
            </div>
            <button
              onClick={onDirectoryClick}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-extrabold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleStores.map((store) => {
              const layerInfo = getStoreLayerInfo(store);
              return (
                <div
                  key={store.id}
                  onClick={() => onSelectStoreToVerify(store.slug)}
                  className="group bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                          {store.logoUrl ? (
                            <img src={store.logoUrl} alt={store.nameAr} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {lang === 'ar' ? store.nameAr : store.nameEn}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono">
                            {store.websiteUrl.replace('https://', '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 px-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                      <span className="text-slate-600 font-medium">
                        {lang === 'ar' ? 'السجل التجاري' : 'Commercial Reg'}
                      </span>
                      <span className="font-mono text-slate-900 font-extrabold">
                        {store.commercialReg}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div 
                      className="inline-flex items-center gap-1.5 font-black px-2.5 py-1 rounded-full border text-[11px]"
                      style={{
                        backgroundColor: `${layerInfo.colorHex}12`,
                        borderColor: `${layerInfo.colorHex}35`,
                        color: layerInfo.colorHex
                      }}
                    >
                      <MadmoonLogo className="w-3.5 h-3.5 shrink-0" variant={layerInfo.variant} />
                      <span>L{layerInfo.layer}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] font-semibold">
                      {store.clickCount.toLocaleString()} {lang === 'ar' ? 'نقرة' : 'clicks'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
