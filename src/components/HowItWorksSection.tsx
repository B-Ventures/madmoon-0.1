import React from 'react';
import { ShieldCheck, FileCheck2, Code2, Users, CheckCircle2, Lock, Sparkles, Building2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HowItWorksSectionProps {
  lang: Language;
  onRegisterClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  lang,
  onRegisterClick
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'ar' ? 'منظومة الأمان والشفافية الرقمية' : 'Trust-as-a-Service Framework'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {lang === 'ar' ? 'كيف تعمل خدمة مضمون للتجار والمشترين؟' : 'How Madmoon Empowers Merchants & Buyers'}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
          {lang === 'ar'
            ? 'تُعد المتاجر الإلكترونية في الأردن والخليج العربي ركيزة التجارة القادمة. مضمون هي الشارة الموحدة التي تنهي شكوك المشتري وتبني مصداقية قانونية فورية.'
            : 'Eliminate cart abandonment and buyer skepticism with official, automated commercial registry validation for online stores in Jordan and GCC.'}
        </p>
      </div>

      {/* 3 Step Process - Horizontal Connected Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg">
              1
            </div>
            <FileCheck2 className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {lang === 'ar' ? 'إدخال السجل التجاري والهوية' : '1. Submit Official Business ID'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {lang === 'ar' ? 'يقوم التاجر بتسجيل اسم متجره ورقم السجل التجاري أو الرقم الوطني للشركة ورابط الواتساب ليتسنى للنظام التحقق التلقائي.' : 'Merchant enters their store name, commercial registry number or national ID, and official WhatsApp contact.'}
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg">
              2
            </div>
            <Code2 className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {lang === 'ar' ? 'تضمين كود السكريبت الخفيف' : '2. Embed 1-Line HTML Script'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {lang === 'ar' ? 'يحصل التاجر على كود خفيف بدقيقة واحدة، يتم لصقه في تذييل المتجر (Shopify, Salla, Zid, WooCommerce).' : 'Merchant copies a lightweight async script snippet and pastes it into their store footer in under 60 seconds.'}
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg">
              3
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {lang === 'ar' ? 'ارتفاع ثقة المشتري والمبيعات' : '3. Instant Buyer Confidence & Conversion'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {lang === 'ar' ? 'ينقر الزبون على الختم الأخضر ليتأكد من السجل الرسمي والاسم التجاري، مما يحفز الدفع عند الاستلام والشراء الفوري.' : 'Shopper clicks the green badge to review the official verification certificate, instantly driving up order conversion rates.'}
          </p>
        </div>

      </div>

      {/* Value Pillars */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 text-center">
          {lang === 'ar' ? 'لماذا تختار المتاجر الإلكترونية ختم مضمون؟' : 'Why Merchants Trust Madmoon Seals?'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-black text-slate-900">{lang === 'ar' ? 'تخفيض السلات المتروكة' : 'Reduce Cart Abandonment'}</h4>
            <p className="text-xs text-slate-600 font-medium">{lang === 'ar' ? 'يزيل الخوف من المتاجر الوهمية ويشجع المشتري لأول مرة.' : 'Eliminates fear of fraudulent stores for first-time shoppers.'}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-black text-slate-900">{lang === 'ar' ? 'دعم الدفع عند الاستلام' : 'COD Conversion Surge'}</h4>
            <p className="text-xs text-slate-600 font-medium">{lang === 'ar' ? 'يزيد نسبة استلام الشحنات وعدم رفضها عند الباب.' : 'Higher delivery acceptance rate for COD orders.'}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-black text-slate-900">{lang === 'ar' ? 'تغطية الأردن والخليج' : 'Jordan & GCC Coverage'}</h4>
            <p className="text-xs text-slate-600 font-medium">{lang === 'ar' ? 'دعم كامل للسجلات التجارية في الأردن، السعودية، الإمارات، والكويت.' : 'Full registry support for Jordan, KSA, UAE, and Kuwait.'}</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-black text-slate-900">{lang === 'ar' ? 'حماية النزاعات والمشترين' : 'Dispute Protection'}</h4>
            <p className="text-xs text-slate-600 font-medium">{lang === 'ar' ? 'توفير نموذج شكاوى رسمي لحل أي مشكلة بين المشتري والمتجر.' : 'Provides an official dispute portal for resolving order issues.'}</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onRegisterClick}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-sm"
          >
            {t.heroCtaPrimary}
          </button>
        </div>
      </div>

    </div>
  );
};
