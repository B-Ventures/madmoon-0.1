import React from 'react';
import { Lock, Eye, ShieldCheck, Database, Server, ArrowRight, ArrowLeft, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface PrivacyPolicyPageProps {
  lang: Language;
  onBackToRegister?: () => void;
  onNavigateHome?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ lang, onBackToRegister, onNavigateHome }) => {
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
          
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            SECURITY STANDARD: ENCRYPTED
          </span>
        </div>

        {/* Page Header - Clean Light Styling */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#047857] px-3.5 py-1.5 rounded-full text-xs font-black">
            <Lock className="w-4 h-4 text-[#047857]" />
            <span>{isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'سياسة الخصوصية وحماية البيانات (Madmoon Privacy Policy)' : 'Madmoon Privacy & Telemetry Protection Policy'}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr
              ? 'تلتزم منصة مضمون ("نحن"، "المنصة") بحماية خصوصية وأمان بيانات التجار والمستهلكين الذين يتفاعلون مع خدماتنا وشارات التوثيق الخاصة بنا عبر madmoon.bventures.me. توضح هذه السياسة كيفية جمع البيانات واستخدامها وحمايتها.'
              : 'Madmoon ("we", "our", "us") is committed to protecting the privacy and data security of both merchants using our verification protocol and consumers interacting with our trust seals across madmoon.bventures.me.'}
          </p>
        </div>

        {/* Policy Sections - All Light Theme */}
        <div className="space-y-6">

          {/* Section 1: Information We Collect */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Database className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '1. البيانات التي نجمعها (Information We Collect)' : '1. Information We Collect'}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {/* Merchants */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isAr ? 'أ. بيانات التجار والمنشآت (From Merchants & Businesses):' : 'A. From Merchants (Sellers & Businesses):'}
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li>{isAr ? 'بيانات الهوية والمنشأة: الاسم التجاري، رقم السجل التجاري (CR)، الرقم الوطني للمنشأة، الرقم الضريبي، اسم المالك، وصورة الوثائق.' : 'Identity & Business Data: Legal entity name, trade name, Commercial Registration (CR) number, National Entity ID, owner name, and ID documents.'}</li>
                  <li>{isAr ? 'بيانات التواصل: أرقام الهواتف، أرقام الواتساب التجاري، رابط المتجر/النطاق، وبريد خدمة العملاء.' : 'Contact Data: Business phone numbers, WhatsApp Business numbers, store domain URLs, and customer service email addresses.'}</li>
                  <li>{isAr ? 'البيانات المالية: كتاب الحساب البنكي (IBAN)، أو معرف الدفع السريع (CliQ).' : 'Financial Data: IBAN verification letters, CliQ merchant alias handles, and payment gateway identifiers.'}</li>
                </ul>
              </div>

              {/* Consumers */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2">
                <span className="font-extrabold text-[#047857] text-xs block">
                  {isAr ? 'ب. بيانات المستهلكين والمشترين (From Consumers & End-Users):' : 'B. From Consumers & Buyers (End-Users):'}
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li>{isAr ? 'تفاعلات التوثيق: عنوان IP، رابط الصفحة المرجعية (Referer URL)، نوع المتصفح، وجهاز المستخدم عند النقر على الختم.' : 'Verification Interactions: HTTP Referer URL, IP address, browser user-agent, timestamp, and device type during seal clicks.'}</li>
                  <li>{isAr ? 'شكاوى النزاعات: الاسم، رقم الهاتف، رقم الطلب، وصورة الفاتورة/الإيصال عند تقديم بلاغ.' : 'Dispute & Report Filings: Full name, phone number, order reference ID, and proof of purchase upload.'}</li>
                  <li>{isAr ? 'بيانات التتبع الآلي (Telemetry): أرقام الطلبات المجهولة وقيمة العمليات لغايات حساب مؤشرات النمو.' : 'Order Conversion Telemetry: Anonymized order IDs and transaction values for conversion lift metrics.'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: How We Use Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Server className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '2. كيفية استخدام البيانات' : '2. How We Use Information'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">{isAr ? '✓ التحقق والاعتماد' : '✓ Authentication'}</span>
                <p className="text-slate-600">{isAr ? 'مطابقة بيانات التاجر مع السجلات الحكومية والبنكية الرسمية.' : 'Cross-referencing merchant identity against government databases.'}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">{isAr ? '✓ الحماية من الاحتيال' : '✓ Anti-Spoofing'}</span>
                <p className="text-slate-600">{isAr ? 'التحقق من أصل الطلبات البرمجية (HTTP Origin) وضمان عدم سرقة الشارة.' : 'Real-time HTTP origin checks ensuring badge.js renders on valid domains.'}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">{isAr ? '✓ إدارة النزاعات' : '✓ Dispute Resolution'}</span>
                <p className="text-slate-600">{isAr ? 'تسهيل عملية التواصل بين المشتري والتاجر خلال مهلة الـ 48 ساعة.' : 'Facilitating the 48-Hour Private Dispute Resolution window.'}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">{isAr ? '✓ التحليلات والأمان' : '✓ Analytics'}</span>
                <p className="text-slate-600">{isAr ? 'حساب إجمالي ظهور الختم (Impressions) ونسبة النقر (CTR).' : 'Calculating aggregate impression metrics and seal conversion stats.'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry & Cookies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Eye className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '3. ملفات الكوكيز والتبادل البرمجي (badge.js)' : '3. Data Telemetry & Cookies (badge.js)'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? 'تعمل شفرة badge.js بشكل غير متزامن (Async) ولا تقوم بكتابة ملفات تتبع خبيثة (Third-party Cookies) في متصفح المشتري. يقتصر التتبع على التحقق من أمان النطاق ونوع الصفحة (صفحة رئيسية، منتج، سلة، أو صفحة تأكيد الشراء).'
                : 'The badge.js script operates asynchronously and does NOT write persistent third-party tracking cookies to the consumer browser session. Telemetry collection is restricted strictly to security origin checks and click-through verification events.'}
            </p>
          </div>

          {/* Section 4: Sharing & Disclosure */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Globe className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '4. مشاركة البيانات والإفصاح' : '4. Data Sharing & Disclosure'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? 'نحن لا نبيع أو نؤجر بيانات التجار أو المشترين لأي جهات تسويقية خارجية. يتم الإفصاح عن البيانات في الحالات التالية فقط: السجل العام للمنشآت (/verify/:storeSlug)، الامتثال القانوني والأوامر القضائية الرسمية، ومزودات إرسال الرسائل المعتمدة لغايات إرسال رموز OTP.'
                : 'We do NOT sell, rent, or lease personal or merchant data to third-party ad networks. We disclose information strictly for Public Registry disclosures (/verify/:storeSlug), legal regulatory compliance, and automated OTP dispatch services.'}
            </p>
          </div>

          {/* Section 5 & 6: Security & Contact */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Mail className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? '5. أمان البيانات والتواصل مع ضابط الخصوصية' : '5. Data Security & Compliance Contact'}
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {isAr
                ? 'يتم نقل جميع البيانات عبر قنوات مشفرة وفق بروتوكولات TLS 1.3 وتخزينها في قواعد بيانات سحابية آمنة (Firebase / Firestore) محصنة بصلاحيات وصول صارمة.'
                : 'All data is transmitted over encrypted TLS 1.3 channels and stored in secure cloud infrastructure (Firebase / Firestore) with strict Role-Based Access Control.'}
            </p>

            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs text-slate-800 font-bold flex-wrap gap-2">
              <span>📧 Email: privacy@bventures.me</span>
              <span>🌐 Registry: https://madmoon.bventures.me/registry</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
