import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Scale, Gavel, Lock, Globe, FileSpreadsheet } from 'lucide-react';
import { Language } from '../types';

interface TermsPageProps {
  lang: Language;
  onBackToRegister?: () => void;
  onNavigateHome?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ lang, onBackToRegister, onNavigateHome }) => {
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button & Metadata */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToRegister || onNavigateHome}
            className="text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4 text-[#047857]" /> : <ArrowLeft className="w-4 h-4 text-[#047857]" />}
            <span>{isAr ? 'العودة لنموذج التوثيق' : 'Back to Verification Form'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              VERSION 2.1 | JULY 2026
            </span>
          </div>
        </div>

        {/* Header Container - Clean Light Styling */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#047857] px-3.5 py-1.5 rounded-full text-xs font-black">
            <Scale className="w-4 h-4 text-[#047857]" />
            <span>{isAr ? 'اتفاقية التاجر والالتزامات القانونية' : 'Madmoon Terms of Service & Legal Agreement'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'شروط خدمة منصة مضمون (Madmoon Terms of Service)' : 'Madmoon Digital Trust Protocol Terms of Service'}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-bold">
              Domain: madmoon.bventures.me
            </span>
            <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-bold">
              Operator: B Ventures LLC
            </span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed pt-1">
            {isAr
              ? 'أهلاً بكم في مضمون (Madmoon)، البروتوكول الرقمي المستقل لتوثيق الهوية التجارية والأعمال التابع لشركة B Ventures LLC. بمجرد استخدامك للمنصة، أو تسجيل منشأتك/متجرك، أو إدراج شفرة التوثيق البرمجية (badge.js) على موقعك أو متجرك الإلكتروني، فإنك تقر بالموافقة الكاملة والالتزام بهذه الشروط والأحكام.'
              : 'Welcome to Madmoon, an independent digital trust protocol and business verification service operated by B Ventures LLC. By accessing our platform, registering a business entity, or embedding the Madmoon verification snippet (badge.js) on your storefront, you agree to be bound by these Terms of Service.'}
          </p>
        </div>

        {/* 7 Core Policy Sections - All Light Theme */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr
                  ? '1. نطاق الخدمة وإخلاء المسؤولية القانونية ("التوثيق ≠ الضمان التجاري")'
                  : '1. Scope of Service & Legal Distinction ("Verification ≠ Endorsement")'}
              </h2>
            </div>
            
            <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed space-y-3">
              <p>
                {isAr
                  ? '1.1 تقدم منصة "مضمون" خدمة تحقق برمجية وتقنية للهوية، والسجلات القانونية، والبيانات المالية للمنشآت الرقمية والأفراد عبر منطقة الشرق الأوسط وشمال إفريقيا (MENA).'
                  : '1.1 Madmoon provides technical, identity, legal, and financial data authentication for digital entities across the Middle East & North Africa (MENA) region.'}
              </p>
              <p>
                {isAr
                  ? '1.2 يقتصر دور "مضمون" على تأكيد صحة البيانات المدخلة وتطابقها مع المستوى المعتمد للمنشأة (من المستوى 1 إلى المستوى 4).'
                  : '1.2 Verification by Madmoon confirms solely that a registered business or individual merchant has completed the data validation requirements corresponding to their assigned Verification Layer (Layer 1 through Layer 4).'}
              </p>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-950 font-medium text-xs space-y-1">
                <span className="font-extrabold text-amber-900 block">
                  {isAr ? '⚠️ 1.3 استقلالية المعاملات:' : '⚠️ 1.3 Independent Transactions:'}
                </span>
                <p>
                  {isAr
                    ? 'منصة "مضمون" ليست طرفاً في أي عملية تجارية أو بيع أو شحن بين التاجر والمشتري، ولا تعتبر وكيلاً تجارياً، ولا تضمن جودة المنتجات، أو سلامة البضائع، أو سرعة الشحن، أو الالتزام بالتسليم.'
                    : 'Madmoon is not a merchant of record, e-commerce store, payment processor, or party to any commercial transaction between buyers and merchants. Madmoon does not endorse, warrant, or guarantee the quality, safety, legality, merchantability, or shipping fulfillment of goods or services sold by verified merchants.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <FileText className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '2. مستويات التوثيق والتزامات التاجر' : '2. Verification Layers & Merchant Obligations'}
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? 'يتعهد التاجر/صاحب المنشأة بتقديم بيانات صحيحة ودقيقة عند التسجيل:'
                : 'Merchants agree to submit truthful, accurate, and non-misleading information during onboarding:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isAr ? '⚪ المستوى 1 (الهوية والتواصل):' : '⚪ Layer 1 (Identity & Contact):'}
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  {isAr ? 'إثبات ملكية النطاق والتحقق من رقم الواتساب عبر OTP.' : 'Requires ownership verification of active phone/WhatsApp numbers via SMS OTP and active domain control.'}
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl space-y-1">
                <span className="font-extrabold text-[#047857] text-xs block">
                  {isAr ? '🟢 المستوى 2 (التوثيق القانوني والمنشآت):' : '🟢 Layer 2 (Legal & Business):'}
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  {isAr ? 'سجل تجاري ساري المفعول (CR) أو رخصة رسمية معتمدة.' : 'Requires valid Commercial Registration (CR) or official license issued by government authorities (e.g. MoITS Jordan, MoC KSA).'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isAr ? '🔵 المستوى 3 (التوثيق المالي والتجاري):' : '🔵 Layer 3 (Financial Verification):'}
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  {isAr ? 'إثبات ملكية حساب بنكي تجاري (IBAN) أو معرف CliQ تجاري.' : 'Requires verification of a matching business bank account (IBAN) or registered merchant payment alias (CliQ MID).'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isAr ? '🟡 المستوى 4 (جودة الخدمة والسمعة):' : '🟡 Layer 4 (Operational Quality):'}
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  {isAr ? 'الالتزام بالفوترة الإلكترونية ونسبة نزاعات أقل من 0.8%.' : 'Requires compliance with e-invoicing standards and maintaining a customer dispute rate below 0.8%.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Gavel className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '3. عدم المسؤولية والتعويض الشامل (Strict Indemnification & Hold Harmless)' : '3. Strict Indemnification & Hold Harmless'}
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed space-y-2">
              <p>
                {isAr
                  ? '3.1 يتعهد التاجر أو المنشأة التي تقوم بإدراج ختم "مضمون" بتعويض منصة "مضمون" وشركة B Ventures LLC ومديريها وموظفيها عن أي دعاوى، أو خسائر، أو أضرار، أو غرامات مالية، أو مصاريف قانونية تنشأ عن:'
                  : '3.1 To the fullest extent permitted by law, any merchant registering with Madmoon or displaying the Madmoon seal agrees to defend, indemnify, and hold harmless Madmoon, B Ventures LLC, its officers, directors, employees, and technical partners against any and all claims, liabilities, damages, losses, fines, penalties, or legal fees arising from:'}
              </p>

              <ul className="list-disc list-inside space-y-1.5 text-slate-800 font-semibold pr-2 ltr:pl-2 pt-1 text-xs">
                <li>{isAr ? '(أ) العمليات التجارية للمنشأة، أو جودة منتجاتها، أو خدماتها المقدمة للمستهلكين.' : '(a) The merchant’s business operations, sales, products, or services.'}</li>
                <li>{isAr ? '(ب) حالات التأخر في الشحن، أو عدم التسليم، أو البضائع المعيبة، أو نزاعات الاسترداد المالي.' : '(b) Non-delivery, delayed shipping, defective items, or refund disputes.'}</li>
                <li>{isAr ? '(ج) مخالفة التاجر لقوانين حماية المستهلك، أو التجارة الإلكترونية، أو الأنظمة الضريبية.' : '(c) Violation of regional consumer protection, tax, or e-commerce regulations.'}</li>
                <li>{isAr ? '(د) التلاعب بشفرة التوثيق (badge.js) أو استخدامها على نطاقات غير مصرح لها.' : '(d) Unauthorized modification, hotlinking, or tampering with the badge.js embed script.'}</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '4. حقوق إلغاء وإيقاف التوثيق المنفردة (Unilateral Revocation Rights)' : '4. Unilateral Revocation & Suspension Rights'}
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed space-y-2">
              <p>
                {isAr
                  ? '4.1 تحتفظ منصة "مضمون" بالحق المطلق والمنفرد في تعليق، أو خفض مستوى، أو إلغاء شارة التوثيق فوراً، وإزالة المنشأة من السجل العام (/registry)، ودون الحاجة لإشعار مسبق في الحالات التالية:'
                  : '4.1 Madmoon retains the unilateral, absolute right to suspend, demote, or permanently revoke any verification badge, remove listing records from the Public Registry (/registry), and terminate account access immediately without prior notice upon:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl text-xs font-bold text-rose-950">
                  {isAr ? '🔴 (أ) اكتشاف تلاعب بالنطاق أو استخدام غير مصرح للشفرة (Domain Spoofing).' : '🔴 (a) Domain spoofing, identity impersonation, or unauthorized script hotlinking.'}
                </div>
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl text-xs font-bold text-rose-950">
                  {isAr ? '🔴 (ب) تجاوز نسبة شكاوى ونزاعات المشترين 0.8%.' : '🔴 (b) Accumulating unresolved dispute complaints exceeding 0.8% threshold.'}
                </div>
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl text-xs font-bold text-rose-950">
                  {isAr ? '🔴 (ج) إلغاء أو شطب السجل التجاري من الجهات الرسمية.' : '🔴 (c) Government registries reporting invalidation or CR cancellation.'}
                </div>
                <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl text-xs font-bold text-rose-950">
                  {isAr ? '🔴 (د) ممارسة سلوكيات احتيالية تضر بالمستهلكين.' : '🔴 (d) Engaging in deceptive, fraudulent, or illegal practices.'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '5. آلية معالجة النزاعات المباشرة (مهلة 48 ساعة)' : '5. Mandatory 48-Hour Dispute Resolution Buffer'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? '5.1 يلتزم التاجر الموثق بالمشاركة الفعالة في مهلة "مضمون" للحل الودي. عند تقديم المشتري لشكوى عبر /verify، يُمنح التاجر مهلة 48 ساعة عمل للتواصل مع المشتري وحل الشكوى. وفي حال التجاهل يحق للمنصة تعليق الشارة تلقائياً.'
                : '5.1 Verified merchants agree to actively participate in Madmoon’s 48-Hour Private Dispute Mechanism. Merchants will have 48 business hours to resolve buyer claims. Failure to engage results in badge suspension or public dispute metric disclosure.'}
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Lock className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '6. الملكية الفكرية وحماية الشفرة البرمجية' : '6. Intellectual Property & Script Restrictions'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? '6.1 تمنح منصة "مضمون" التاجر الموثق ترخيصاً محدوداً لاستخدام شفرة badge.js حصرياً على النطاق المعتمد. يُحظر تماماً نسخ الشارة كصورة ثابتة، أو تعديل خصائص الشفرة، أو إعادة توجيهها (Hotlinking).'
                : '6.1 Madmoon grants active merchants a limited, revocable license to embed badge.js strictly on their verified registered domain. Hotlinking, capturing static screenshots of the seal, or embedding badge.js on unapproved domains is strictly prohibited.'}
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F0FDF4] border border-emerald-200 rounded-xl">
                <Globe className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '7. القانون الواجب التطبيق والقضاء المختص' : '7. Governing Law & Jurisdiction'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? 'تخضع هذه الشروط وتفسر وفقاً للأنظمة والقوانين النافذة في المملكة الأردنية الهاشمية والأطر التنظيمية للتجارة الإلكترونية في الشرق الأوسط، وتختص محاكم عمان (العبدلي) بالنظر في أي نزاع قد ينشأ عنها.'
                : 'These Terms shall be governed by the laws of the Hashemite Kingdom of Jordan and applicable regional commercial frameworks across MENA. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Amman, Jordan.'}
            </p>
          </div>

        </div>

        {/* Footer CTA - Clean Light Styling (No Dark Boxes) */}
        <div className="bg-[#F0FDF4] border border-emerald-200 text-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            {isAr ? 'هل أنت تاجر وترغب في توثيق متجرك رسمياً؟' : 'Ready to register and verify your merchant entity?'}
          </h3>
          <button
            onClick={onBackToRegister || onNavigateHome}
            className="bg-[#047857] hover:bg-[#036247] text-white font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>{isAr ? 'الانتقال لتقديم طلب التوثيق' : 'Proceed to Verification Form'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
