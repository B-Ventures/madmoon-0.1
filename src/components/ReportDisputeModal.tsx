import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { Language, MerchantStore, DisputeReport } from '../types';
import { translations } from '../translations';
import { addReportToFirestore } from '../firebase';

interface ReportDisputeModalProps {
  lang: Language;
  store: MerchantStore;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: DisputeReport) => void;
}

export const ReportDisputeModal: React.FC<ReportDisputeModalProps> = ({
  lang,
  store,
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const t = translations[lang];

  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [issueType, setIssueType] = useState<DisputeReport['issueType']>('non_delivery');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !reporterPhone || !orderNumber) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: DisputeReport = {
        id: `rep-${Date.now()}`,
        storeSlug: store.slug,
        storeName: store.nameAr,
        reporterName,
        reporterPhone,
        orderNumber,
        issueType,
        description,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      addReportToFirestore(newReport).catch(err => console.warn('Firestore report save error:', err));

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onSubmitReport(newReport);

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {lang === 'ar' ? 'تم تقديم البلاغ بنجاح' : 'Dispute Submitted'}
            </h3>
            <p className="text-slate-600 text-xs font-medium leading-relaxed max-w-sm mx-auto">
              {t.reportSuccessMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {t.reportModalTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {store.nameAr} ({store.verificationBadgeId})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {t.reportModalSub}
            </p>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                {t.reportName} *
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder={lang === 'ar' ? 'محمد علي' : 'Mohammed Ali'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition-colors font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  {t.reportPhone} *
                </label>
                <input
                  type="tel"
                  required
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="0791234567"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition-colors font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  {t.reportOrderNo} *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#ORD-9912"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                {t.reportIssueType}
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as DisputeReport['issueType'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition-colors font-medium"
              >
                <option value="non_delivery">{t.reportIssueTypeNonDelivery}</option>
                <option value="fraud">{t.reportIssueTypeFraud}</option>
                <option value="counterfeit">{t.reportIssueTypeCounterfeit}</option>
                <option value="bad_service">{t.reportIssueTypeBadService}</option>
                <option value="other">{t.reportIssueTypeOther}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                {t.reportDescription}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'ar' ? 'وضح التفاصيل، تاريخ الطلب، والمشكلة الواجهة معك...' : 'Provide details regarding your order...'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-rose-600 transition-colors resize-none font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-800 hover:bg-rose-900 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الإرسال...' : t.submitReportBtn}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
