import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, HelpCircle, ExternalLink, Scale } from 'lucide-react';
import { Language } from '../types';

interface DisclaimerPageProps {
  lang: Language;
  onBackToRegister?: () => void;
  onNavigateHome?: () => void;
  onReportIssue?: () => void;
  initialError?: string | null;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({
  lang,
  onBackToRegister,
  onNavigateHome,
  onReportIssue,
  initialError
}) => {
  const isAr = lang === 'ar';
  const [hasDomainMismatch, setHasDomainMismatch] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'domain_mismatch' || initialError === 'domain_mismatch') {
      setHasDomainMismatch(true);
    }
  }, [initialError]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8" id="disclaimer">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header Info */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToRegister || onNavigateHome}
            className="text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4 text-[#047857]" /> : <ArrowLeft className="w-4 h-4 text-[#047857]" />}
            <span>{isAr ? 'العودة لنموذج التوثيق' : 'Back to Verification Form'}</span>
          </button>
          
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            MDM-DISCLAIMER-2026
          </span>
        </div>

        {/* DOMAIN MISMATCH ALERT BANNER - LIGHT THEME (No dark background) */}
        {hasDomainMismatch && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 rounded-2xl border border-rose-200 shrink-0">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  SECURITY ALERT
                </span>
                <h2 className="text-lg sm:text-xl font-black text-rose-950 mt-1">
                  {isAr ? '🔴 تنبيه أمني عاجل: تم رصد انتحال أو عدم تطابق في النطاق' : '🔴 Urgent Security Alert: Domain Mismatch Detected'}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-rose-900 leading-relaxed pt-1">
              {isAr
                ? 'تم رصد محاولة غير مصرح بها لاستخدام ختم التوثيق الرقمي "مضمون" على موقع أو نطاق غير مطابق للسجلات المعتمدة لدينا. تم حجب الختم فوراً لمنع انتحال الهوية وتضليل المتسوقين.'
                : 'An unauthorized website domain attempted to embed or display a Madmoon Trust Seal without authorization. The seal was immediately blocked to prevent domain spoofing and consumer deception.'}
            </p>

            <div className="bg-white p-4 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-1 font-medium">
              <span className="font-extrabold text-rose-900 block">
                {isAr ? '💡 كيف تحمي نفسك كمتسوق؟' : '💡 How to protect yourself as a shopper:'}
              </span>
              <p>
                {isAr
                  ? 'أختام مضمون الرسمية تكون دائماً مقيدة بالنطاق المعتمد المسجل في السجل الوطني، والنقر على الختم يوجهك دائماً لصفحة الشهادة المعتمدة على https://madmoon.bventures.me.'
                  : 'Official Madmoon seals are cryptographically locked to the merchant\'s verified domain name. Clicking the seal will always direct you to the verified certificate page on https://madmoon.bventures.me.'}
              </p>
            </div>
          </div>
        )}

        {/* Page Header - Clean Light Theme */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#047857] px-3.5 py-1.5 rounded-full text-xs font-black">
            <AlertTriangle className="w-4 h-4 text-[#047857]" />
            <span>{isAr ? 'سياسة حماية المستهلك وإخلاء المسؤولية' : 'Consumer Protection & Trust Seal Disclaimer'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'إشعار هام لمتسوقي المتاجر الإلكترونية والجمهور' : 'Consumer Protection & Trust Seal Policy'}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
            {isAr
              ? 'إن ظهور ختم مضمون (Madmoon) الأخضر التفاعلي على أي متجر إلكتروني، أو صفحة تواصل، أو موقع خدمة، يعني أن هذه المنشأة قد خضعت لإجراءات تحقق وتدقيق رقمي مستقل من قبل بروتوكولنا. يرجى قراءة هذا الإشعار لفهم حدود وما يؤكده ختم "مضمون" قبل إتمام عملية الشراء.'
              : 'The Madmoon green checkmark seal displayed on e-commerce storefronts signifies that the business entity or individual seller has undergone dynamic identity, legal, or financial verification by our independent protocol. Please review this disclaimer to understand what the Madmoon seal certifies.'}
          </p>
        </div>

        {/* Section 1: What the Seal Certifies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-[#047857]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isAr ? '1. ماذا يؤكد ختم "مضمون"؟ (مستويات التوثيق)' : '1. What the Madmoon Seal Certifies (Layer Progression)'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {isAr
              ? 'ختم "مضمون" ليس مجرد صورة ثابتة، بل هو عنصر برمجي تفاعلي حي يعكس مستوى التوثيق الذي حققه التاجر:'
              : 'The Madmoon trust badge is not a static image; it is an active, dynamic code element reflecting a specific audited tier:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Layer 1 */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {isAr ? '⚪ المستوى 1 — هوية مؤكدة' : '⚪ Layer 1 — Verified Identity'}
                </span>
                <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                  Silver Tier
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {isAr
                  ? 'يؤكد تحقق منصة "مضمون" من ملكية التاجر للرابط/النطاق والتحقق من رقم التواصل المباشر (الواتساب) عبر رمز OTP.'
                  : 'Confirms that Madmoon has verified the seller\'s active domain/social profile ownership and validated direct phone/WhatsApp identity via SMS OTP.'}
              </p>
            </div>

            {/* Layer 2 */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                  {isAr ? '🟢 المستوى 2 — منشأة مسجلة' : '🟢 Layer 2 — Registered Business'}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  Emerald Tier
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {isAr
                  ? 'يؤكد مطابقة بيانات التاجر وسجله التجاري (CR) أو رقمه الوطني مع السجلات الحكومية الرسمية.'
                  : 'Confirms that Madmoon has matched the merchant\'s trade name and Commercial Registration (CR) against official government business registries.'}
              </p>
            </div>

            {/* Layer 3 */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {isAr ? '🔵 المستوى 3 — حساب تجاري آمن' : '🔵 Layer 3 — Verified Financial Account'}
                </span>
                <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                  Financial Tier
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {isAr
                  ? 'يؤكد أن التاجر يستقبل مدفوعاته عبر حساب بنكي تجاري رسمي أو معرف دفع سريع تجاري (CliQ) مطرد مع اسمه القانوني.'
                  : 'Confirms that the merchant accepts payments via an official business bank account (IBAN) or verified merchant payment alias (CliQ MID).'}
              </p>
            </div>

            {/* Layer 4 */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 text-xs sm:text-sm">
                  {isAr ? '🟡 المستوى 4 — تقييم ممتاز وجودة' : '🟡 Layer 4 — Top Rated Quality'}
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  Gold Tier
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {isAr
                  ? 'يؤكد التزام المنشأة بنظام الفوترة الإلكتروني وحصولها على تقييمات عالية من المشترين الحقيقيين مع خلو سجلها من الشكاوى المعلقة.'
                  : 'Confirms compliant e-invoicing, active shipping SLAs, and an aggregated buyer rating above 4.0 stars with zero unresolved dispute claims.'}
              </p>
            </div>

          </div>
        </div>

        {/* Section 2: What Madmoon Does NOT Guarantee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <HelpCircle className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isAr ? '2. ما لا تضمنه منصة "مضمون" ("التوثيق ≠ الضمان التجاري")' : '2. What Madmoon Does NOT Guarantee ("Verification ≠ Endorsement")'}
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">
                {isAr ? '1. استقلالية التجار:' : '1. Independent Merchants:'}
              </span>
              <p>
                {isAr
                  ? 'المتاجر التي تحمل الختم هي منشآت تجارية مستقلة تماماً. منصة "مضمون" ليست متجراً، ولا وكيلاً عن التاجر، ولا شركة شحن.'
                  : 'Merchants carrying the Madmoon seal are separate, independent commercial entities. Madmoon is not an online store, sales agent, courier, or payment gateway.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">
                {isAr ? '2. سلامة وشحن المنتجات:' : '2. Product & Order Warranty:'}
              </span>
              <p>
                {isAr
                  ? 'ما لم يحمل المتجر ختم المستوى 4 المضمون والمكفول، فإن "مضمون" لا تفحص البضائع الفيزيائية، ولا تضمن سرعة التوصيل، ولا تتحمل مسؤولية عيوب التصنيع.'
                  : 'Unless a store explicitly carries the Layer 4 Insured Protection Seal, Madmoon does not inspect physical product inventory, warrant product fitness, or guarantee delivery speeds.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">
                {isAr ? '3. قرار الشراء والسياسات:' : '3. Purchasing Decisions:'}
              </span>
              <p>
                {isAr
                  ? 'يتوجب على المشتري مراجعة سياسات الإرجاع والاستبدال والشحن الخاصة بالمتجر نفسه قبل الدفع.'
                  : 'Buyers are advised to review the individual merchant’s published Return, Refund, and Shipping policies on their storefront prior to completing a payment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Verification & Fraud Warning */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <ExternalLink className="w-6 h-6 text-[#047857]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isAr ? '3. كيف تتحقق من صحة الختم؟ (وإشعار الاحتيال)' : '3. How to Verify a Store’s Authenticity & Fraud Warnings'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {isAr
              ? 'احرص دائماً على النقر على ختم "مضمون" العائم في أسفل موقع التاجر. الختم الحقيقي سيفتح دائماً صفحة شهادة توثيق رسمية مستضافة على نطاقنا المعتمد حصراً:'
              : 'Always click the floating Madmoon seal on the store footer. Genuine seals will open an official certificate URL directly on our primary domain:'}
          </p>

          <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl font-mono text-xs text-[#047857] font-bold">
            https://madmoon.bventures.me/verify/:storeSlug
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-950 font-medium space-y-1">
            <span className="font-extrabold text-rose-900 block">
              {isAr ? '⚠️ تحذير الاحتيال والتلاعب بالنطاق:' : '⚠️ Fraud Warning & Red Flag Alert:'}
            </span>
            <p>
              {isAr
                ? 'إذا كان الختم عبارة عن صورة ثابتة لا يمكن النقر عليها، أو إذا فتح رابطاً لا ينتهي بـ madmoon.bventures.me، أو ظهرت عبارة "🔴 نطاق غير معتمد / Unverified Origin"، فهذا يعني أن المتجر يحاول استخدام شعارنا بدون ترخيص. لا تقم بالدفع أو إدخال بياناتك المالية.'
                : 'If clicking a badge does not open an official madmoon.bventures.me certificate URL, or if the certificate displays "🔴 Unverified Origin / Domain Mismatch", the store may be attempting to copy or misuse our visual assets. Do not proceed with payment.'}
            </p>
          </div>
        </div>

        {/* Section 4: Filing a Dispute */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isAr ? '4. تقديم بلاغ أو نزاع ضد متجر (مهلة الـ 48 ساعة)' : '4. Filing a Dispute / Reporting a Store'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {isAr
              ? 'إذا قمت بالشراء من متجر يحمل ختم "مضمون" وتعرضت لعدم التسليم أو الاحتيال:'
              : 'If you purchased from a verified Madmoon store and experienced non-delivery, fraud, or counterfeit goods:'}
          </p>

          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-800 font-semibold pr-2 ltr:pl-2">
            <li>{isAr ? 'أدخل على صفحة شهادة المتجر: https://madmoon.bventures.me/verify/:storeSlug' : 'Navigate to the merchant’s certificate page on https://madmoon.bventures.me/verify/:storeSlug'}</li>
            <li>{isAr ? 'اضغط على زر "الإبلاغ عن مشكلة / تقديم نزاع".' : 'Click the "Report Issue / File Dispute" button.'}</li>
            <li>{isAr ? 'أدخل رقم هاتفك وصورة إيصال/فاتورة الشراء.' : 'Submit your phone number and order receipt.'}</li>
          </ol>

          <p className="text-xs text-slate-600 font-medium pt-1">
            {isAr
              ? 'يقوم تقديم البلاغ بتفعيل مهلة الـ 48 ساعة للحل الودي، حيث يُلزم التاجر بالتواصل معك وحل المشكلة، وفي حال التجاهل يتم تعليق شارة التوثيق وتخفيض تصنيفه علناً.'
              : 'Filing a dispute triggers our 48-Hour Private Resolution Hold, forcing the merchant to address your claim directly or face immediate badge suspension and public registry demotion.'}
          </p>

          {onReportIssue && (
            <div className="pt-2">
              <button
                onClick={onReportIssue}
                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-3 rounded-xl text-xs inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>{isAr ? 'تقديم بلاغ عن متجر الآن' : 'File Store Report / Dispute Now'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA - Light Theme */}
        <div className="bg-[#F0FDF4] border border-emerald-200 text-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            {isAr ? 'هل تمتلك متجراً وتود توثيق عملائك؟' : 'Do you own a store and want to build trust with customers?'}
          </h3>
          <button
            onClick={onBackToRegister || onNavigateHome}
            className="bg-[#047857] hover:bg-[#036247] text-white font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>{isAr ? 'انتقل لنموذج تسجيل متجر جديد' : 'Go to Merchant Registration Form'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
