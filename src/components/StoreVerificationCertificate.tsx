import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ExternalLink, AlertTriangle, Share2, Building2, Globe, Phone, FileText, Calendar, Eye, Lock, ArrowLeft, ArrowRight, Check, Flag } from 'lucide-react';
import { Language, MerchantStore } from '../types';
import { translations } from '../translations';
import { COUNTRIES } from '../data/countries';

interface StoreVerificationCertificateProps {
  lang: Language;
  store: MerchantStore;
  onOpenReportModal: () => void;
  onBackToHome: () => void;
}

export const StoreVerificationCertificate: React.FC<StoreVerificationCertificateProps> = ({
  lang,
  store,
  onOpenReportModal,
  onBackToHome
}) => {
  const t = translations[lang];
  const countryInfo = COUNTRIES[store.country] || COUNTRIES['JO'];
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    const url = window.location.origin + `?verify=${store.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
          REF: {store.verificationBadgeId}
        </span>
      </div>

      {/* OFFICIAL DIGITAL CERTIFICATE DOCUMENT */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-14 shadow-md relative overflow-hidden">
        
        {/* Subtle Watermark Seal Pattern in Center Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <ShieldCheck className="w-96 h-96 text-slate-900" />
        </div>

        {/* Certificate Golden/Emerald Fine Double Frame */}
        <div className="border border-slate-200 rounded-2xl p-6 sm:p-10 relative z-10 bg-slate-50/50">
          
          {/* Top Registry Title Header */}
          <div className="text-center space-y-4 pb-8 border-b border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                  {lang === 'ar' ? 'السجل العام التجاري' : 'PUBLIC TRUST REGISTRY'}
                </span>
                <p className="text-xs font-bold text-slate-500 font-mono">MADMOON-JO-AUTH</p>
              </div>

              {/* Official Seal Stamp Icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex flex-col items-center justify-center p-2 shadow-sm border-2 border-emerald-900 shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">VERIFIED</span>
              </div>

              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  {lang === 'ar' ? 'حالة الاعتماد' : 'STATUS'}
                </span>
                <p className="text-xs font-extrabold text-emerald-800">
                  ✓ {lang === 'ar' ? 'موثق ومعتمد' : 'OFFICIALLY VERIFIED'}
                </p>
              </div>
            </div>

            {/* Main Certificate Title */}
            <div className="pt-4 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'ar' ? 'شهادة توثيق هوية تجارية إلكترونية' : 'Official Electronic E-Commerce Verification Certificate'}
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                MADMOON OFFICIAL VERIFICATION CERTIFICATE
              </p>
            </div>
          </div>

          {/* Store Subject Box */}
          <div className="my-8 bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-1 mx-auto flex items-center justify-center overflow-hidden">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.nameAr} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === 'ar' ? store.nameAr : store.nameEn}
              </h2>
              <p className="text-xs font-mono font-bold text-emerald-800 mt-0.5 dir-ltr">
                {store.websiteUrl}
              </p>
            </div>

            <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto leading-relaxed pt-1">
              {lang === 'ar'
                ? 'تشهد منصة مضمون المعتمدة لمراقبة التجارة الإلكترونية بأن المنشأة المبينة أعلاه موثقة وفق السجل التجاري الرسمي ورقم الهاتف والنطاق الإلكتروني.'
                : 'Madmoon Verification Registry hereby certifies that the e-commerce establishment above is validated against official Commercial Registry records, active domain, and verified hotline.'}
            </p>
          </div>

          {/* VERIFICATION DETAILS TABLE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            
            {/* Field 1: CR Number */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">
                  {lang === 'ar' ? 'السجل التجاري / الرقم الوطني' : 'Commercial Reg. / ID'}
                </span>
                <span className="text-sm font-black font-mono text-slate-900 block mt-0.5">
                  {store.commercialReg}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 mt-1 block">
                  ✓ {lang === 'ar' ? `مطابق وموثق رسمياً (${countryInfo.flag} ${countryInfo.nameAr})` : `Officially Matched (${countryInfo.nameEn})`}
                </span>
              </div>
            </div>

            {/* Field 2: Domain */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">
                  {t.domainVerified}
                </span>
                <span className="text-sm font-black font-mono text-slate-900 block mt-0.5 dir-ltr text-right">
                  {store.websiteUrl.replace('https://', '').replace('http://', '')}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 mt-1 block">
                  ✓ {lang === 'ar' ? 'نطاق مفعل ومحمي ببطاقة SSL' : 'Active Verified SSL Domain'}
                </span>
              </div>
            </div>

            {/* Field 3: Hotline */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">
                  {t.whatsappVerified}
                </span>
                <span className="text-sm font-black font-mono text-slate-900 block mt-0.5 dir-ltr text-right">
                  {store.phone}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 mt-1 block">
                  ✓ {lang === 'ar' ? 'هاتف أعمال معتمد ومستجيب' : 'Verified Hotline Channel'}
                </span>
              </div>
            </div>

            {/* Field 4: Issue Date */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">
                  {lang === 'ar' ? 'تاريخ إصداره أول مرة' : 'Issue Date'}
                </span>
                <span className="text-sm font-black font-mono text-slate-900 block mt-0.5">
                  {store.verifiedAt}
                </span>
                <span className="text-[10px] font-bold text-slate-500 mt-1 block flex items-center gap-1">
                  <Eye className="w-3 h-3 text-emerald-700" />
                  <span>{store.clickCount.toLocaleString()} {t.totalVerifications}</span>
                </span>
              </div>
            </div>

          </div>

          {/* Certificate Footer Signoff */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
            <div>
              <p className="font-extrabold text-slate-900">سجل مضمون التجاري العام | Madmoon Trust Authority</p>
              <p className="text-[10px] text-slate-500 mt-0.5">https://madmoon.jo</p>
            </div>

            <div className="text-right sm:text-left font-mono text-[11px] text-slate-500">
              ID: {store.verificationBadgeId}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          
          <a
            href={store.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>{t.visitStoreBtn}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleShare}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-2xs"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800">{lang === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>{t.shareCertificateBtn}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenReportModal}
              className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-2xs"
            >
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span>{t.reportIssueBtn}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
