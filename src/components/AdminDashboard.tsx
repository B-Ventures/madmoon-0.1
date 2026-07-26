import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Send, 
  Copy, 
  ExternalLink, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  LogOut, 
  RefreshCw, 
  Check, 
  Plus, 
  FileText,
  Building2,
  Phone,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { Language, MerchantStore, DisputeReport } from '../types';
import { 
  subscribeToMerchants, 
  subscribeToReports, 
  updateMerchantStatusInFirestore, 
  updateReportStatusInFirestore,
  seedInitialStoresIfEmpty,
  signOut,
  auth
} from '../firebase';

interface AdminDashboardProps {
  lang: Language;
  onLogout: () => void;
  onViewCertificate: (slug: string) => void;
  onNavigateToRegister: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onLogout,
  onViewCertificate,
  onNavigateToRegister
}) => {
  const [merchants, setMerchants] = useState<MerchantStore[]>([]);
  const [reports, setReports] = useState<DisputeReport[]>([]);
  const [activeTab, setActiveTab] = useState<'merchants' | 'disputes'>('merchants');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore Realtime Data
  useEffect(() => {
    // Seed initial stores if database is empty on first boot
    seedInitialStoresIfEmpty().catch(console.warn);

    const unsubMerchants = subscribeToMerchants((data) => {
      setMerchants(data);
      setLoading(false);
    });

    const unsubReports = subscribeToReports((data) => {
      setReports(data);
    });

    return () => {
      unsubMerchants();
      unsubReports();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveStore = async (storeId: string, storeName: string) => {
    try {
      await updateMerchantStatusInFirestore(storeId, 'active', 'Tier 2 - Officially Verified');
      showToast(lang === 'ar' ? `تم اعتماد وتفعيل متجر "${storeName}" بنجاح في Firestore!` : `Store "${storeName}" successfully approved & activated in Firestore!`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'حدث خطأ أثناء تحديث حالة المتجر' : 'Failed to update store status');
    }
  };

  const handleRejectStore = async (storeId: string, storeName: string) => {
    try {
      await updateMerchantStatusInFirestore(storeId, 'rejected');
      showToast(lang === 'ar' ? `تم رفض طلب توثيق "${storeName}"` : `Verification rejected for "${storeName}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResendWhatsAppSnippet = (store: MerchantStore) => {
    const text = lang === 'ar'
      ? `أهلاً ${store.ownerName || store.nameAr}، تم إصدار كود شارة مضمون لمتجرك (${store.websiteUrl}). الكود السريع:\n<script src="https://madmoon.jo/badge.js" data-id="${store.verificationBadgeId}"></script>`
      : `Hello ${store.ownerName || store.nameEn}, your Madmoon badge snippet is ready for (${store.websiteUrl}):\n<script src="https://madmoon.jo/badge.js" data-id="${store.verificationBadgeId}"></script>`;
    
    navigator.clipboard.writeText(text);
    showToast(lang === 'ar' ? `تم إرسال وقص كود الواتساب لـ ${store.phone} بنجاح!` : `WhatsApp installation snippet prepared & copied for ${store.phone}!`);
  };

  const handleCopyEmbedCode = (store: MerchantStore) => {
    const snippet = `<script src="https://madmoon.jo/badge.js" data-badge-id="${store.verificationBadgeId}" data-slug="${store.slug}"></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(store.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(lang === 'ar' ? 'تم نسخ كود الإدراج الخاص بالمتجر!' : 'Embed code copied to clipboard!');
  };

  const handleResolveReport = async (reportId: string, newStatus: 'reviewing' | 'resolved') => {
    try {
      await updateReportStatusInFirestore(reportId, newStatus);
      showToast(lang === 'ar' ? `تم تحديث حالة البلاغ إلى ${newStatus === 'resolved' ? 'تمت التسوية' : 'قيد المراجعة'}` : `Report status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    onLogout();
  };

  // Metrics Calculations
  const totalStores = merchants.length;
  const pendingCount = merchants.filter(m => (m.verificationStatus || 'pending') === 'pending').length;
  const activeCount = merchants.filter(m => m.verificationStatus === 'active' || (!m.verificationStatus && m.domainVerified)).length;
  const totalBadgeClicks = merchants.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);

  // Filtered merchants
  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = 
      m.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.commercialReg.includes(searchQuery) ||
      m.phone.includes(searchQuery) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const currentStatus = m.verificationStatus || (m.domainVerified ? 'active' : 'pending');

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && currentStatus === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce text-xs">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              {lang === 'ar' ? 'منظومة الامتثال والتحقق المباشرة' : 'Live Compliance System'}
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">
              v2.4 - Firestore Sync
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'ar' ? 'لوحة التحكم والامتثال بـ مضمون' : 'Madmoon Admin & Compliance Dashboard'}
          </h1>
          <p className="text-slate-600 text-xs font-medium max-w-2xl leading-relaxed">
            {lang === 'ar' 
              ? 'إدارة المتاجر الإلكترونية المسجلة، مراجعة السجلات التجارية، تفعيل الأختام، ومتابعة بلاغات المشتريين في الوقت الفعلي.'
              : 'Manage registered merchants, verify commercial registration credentials, activate badges, and resolve buyer disputes in real-time.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={onNavigateToRegister}
            className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold px-4 py-2.5 rounded-xl border border-slate-300 transition-all text-xs flex items-center justify-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-800" />
            <span>{lang === 'ar' ? 'إضافة متجر جديد' : 'Add New Store'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-extrabold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-rose-700" />
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stores */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
              {lang === 'ar' ? 'إجمالي المتاجر' : 'Total Merchants'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStores}</div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
            {lang === 'ar' ? 'محتوى قاعدة بيانات Firestore' : 'Stored in Firestore Cloud'}
          </p>
        </div>

        {/* Pending Verifications */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-5 hover:border-amber-300 transition-all shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
              {lang === 'ar' ? 'قيد التحقق' : 'Pending Verification'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">{pendingCount}</div>
          <p className="text-[11px] sm:text-xs font-medium text-amber-800 mt-1">
            {lang === 'ar' ? 'تتطلب تفعيل واعتماد السجل' : 'Requires CR review & badge activation'}
          </p>
        </div>

        {/* Active Verified */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 hover:border-emerald-300 transition-all shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
              {lang === 'ar' ? 'متاجر موثقة' : 'Active Verified Stores'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">{activeCount}</div>
          <p className="text-[11px] sm:text-xs font-medium text-emerald-800 mt-1">
            {lang === 'ar' ? 'تحمل ختم مضمون الرسمي' : 'Official active seal issued'}
          </p>
        </div>

        {/* Total Badge Clicks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
              {lang === 'ar' ? 'فحوصات المشتريين' : 'Badge Inspection Clicks'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBadgeClicks.toLocaleString()}</div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
            {lang === 'ar' ? 'نقرات تحقق مباشرة على الشهادات' : 'Live buyer verification hits'}
          </p>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('merchants')}
          className={`pb-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'merchants'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'سجل المتاجر والاعتماد' : 'Merchants Registry'}</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-200">
            {merchants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'disputes'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{lang === 'ar' ? 'بلاغات ونزاعات المشتريين' : 'Buyer Disputes & Reports'}</span>
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
            {reports.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT: MERCHANTS */}
      {activeTab === 'merchants' && (
        <div className="space-y-6">
          
          {/* Controls: Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث باسم المتجر، السجل التجاري، رقم الواتساب...' : 'Search store name, CR number, phone...'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-800 ltr:pl-10 rtl:pr-10"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'} ({merchants.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? 'قيد التحقق' : 'Pending'} ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  statusFilter === 'active'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? 'المفعلة' : 'Active'} ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  statusFilter === 'rejected'
                    ? 'bg-rose-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? 'المرفوضة' : 'Rejected'}
              </button>
            </div>
          </div>

          {/* Merchants Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-800 animate-spin mx-auto" />
                <p className="text-xs font-medium">{lang === 'ar' ? 'جاري مزامنة بيانات المتاجر من Firestore...' : 'Syncing merchant registry from Firestore...'}</p>
              </div>
            ) : filteredMerchants.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Store className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-extrabold text-slate-800 text-sm">{lang === 'ar' ? 'لا توجد متاجر تطابق البحث' : 'No stores match your filter'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">{lang === 'ar' ? 'المتجر والتعريف' : 'Store & Info'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'السجل التجاري / الهوية' : 'Commercial Reg.'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'الباقة والاعتماد' : 'Verification Tier'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="px-6 py-4 text-center">{lang === 'ar' ? 'الإجراءات السريعة' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredMerchants.map((store) => {
                      const status = store.verificationStatus || (store.domainVerified ? 'active' : 'pending');
                      return (
                        <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Store Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-emerald-800 flex-shrink-0">
                                {store.nameEn.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {lang === 'ar' ? store.nameAr : store.nameEn}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                  <span>{store.websiteUrl}</span>
                                  <a
                                    href={store.websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-400 hover:text-emerald-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Commercial Reg */}
                          <td className="px-6 py-4">
                            <div className="font-mono text-slate-900 font-bold">{store.commercialReg}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{store.country}</div>
                          </td>

                          {/* Phone / WhatsApp */}
                          <td className="px-6 py-4">
                            <div className="font-mono text-slate-900 font-bold dir-ltr text-right">{store.phone}</div>
                            {store.ownerName && (
                              <div className="text-[11px] text-slate-500 font-medium">{store.ownerName}</div>
                            )}
                          </td>

                          {/* Tier */}
                          <td className="px-6 py-4">
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200 px-2.5 py-1 rounded-lg">
                              {store.tier || 'Tier 2 - Officially Verified'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {status === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-800" />
                                {lang === 'ar' ? 'مفعّل وموثق' : 'Active'}
                              </span>
                            )}
                            {status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-800" />
                                {lang === 'ar' ? 'قيد المراجعة' : 'Pending'}
                              </span>
                            )}
                            {status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5 text-rose-800" />
                                {lang === 'ar' ? 'مرفوض' : 'Rejected'}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {status === 'pending' && (
                                <button
                                  onClick={() => handleApproveStore(store.id, store.nameAr)}
                                  title={lang === 'ar' ? 'اعتماد وتفعيل المتجر' : 'Approve & Activate'}
                                  className="p-2 bg-emerald-800 text-white font-extrabold rounded-xl hover:bg-emerald-900 transition-all text-xs flex items-center gap-1 shadow-2xs"
                                >
                                  <Check className="w-4 h-4" />
                                  <span className="hidden xl:inline">{lang === 'ar' ? 'اعتماد' : 'Approve'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleResendWhatsAppSnippet(store)}
                                title={lang === 'ar' ? 'إرسال كود الإدراج عبر الواتساب' : 'Resend WhatsApp Snippet'}
                                className="p-2 bg-slate-50 hover:bg-slate-100 text-teal-800 border border-slate-200 rounded-xl transition-all text-xs flex items-center gap-1 font-bold shadow-2xs"
                              >
                                <Send className="w-4 h-4 text-teal-800" />
                                <span className="hidden xl:inline">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                              </button>

                              <button
                                onClick={() => handleCopyEmbedCode(store)}
                                title={lang === 'ar' ? 'نسخ كود الشارة Embed Code' : 'Copy Embed Code'}
                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl transition-all text-xs flex items-center gap-1 font-bold shadow-2xs"
                              >
                                {copiedId === store.id ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                                <span className="hidden xl:inline">{lang === 'ar' ? 'الكود' : 'Copy Snippet'}</span>
                              </button>

                              <button
                                onClick={() => onViewCertificate(store.slug)}
                                title={lang === 'ar' ? 'عرض شهادة التوثيق العامة' : 'View Public Certificate'}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-all text-xs flex items-center gap-1 font-bold shadow-2xs"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden xl:inline">{lang === 'ar' ? 'الشهادة' : 'Certificate'}</span>
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DISPUTES & REPORTS */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                  <span>{lang === 'ar' ? 'سجل بلاغات ونزاعات المشتريين' : 'Buyer Disputes Log'}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {lang === 'ar' ? 'متابعة شكاوى المستهلكين المباشرة وتطبيق معايير حماية المشتري' : 'Direct consumer reports submitted via verified store certificate pages'}
                </p>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-800 mx-auto" />
                <p className="font-black text-slate-900">{lang === 'ar' ? 'لا توجد بلاغات نزاع معلقة' : 'No active disputes'}</p>
                <p className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'جميع المتاجر الموثقة تعمل وفق معايير الامتثال' : 'All verified merchants are meeting compliance standards'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">{lang === 'ar' ? 'المتجر المعني' : 'Target Store'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'المشتري ورقم التواصل' : 'Buyer Info'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'تفاصيل المشكلة' : 'Issue Description'}</th>
                      <th className="px-6 py-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="px-6 py-4 text-center">{lang === 'ar' ? 'إجراء الامتثال' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-black text-slate-900">
                          {report.storeName || report.storeSlug}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{report.reporterName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{report.reporterPhone}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-800 font-extrabold">
                          #{report.orderNumber}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-extrabold block w-fit mb-1">
                            {report.issueType}
                          </span>
                          <p className="text-xs text-slate-600 font-medium line-clamp-2">{report.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          {report.status === 'resolved' ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold">
                              {lang === 'ar' ? 'تمت التسوية' : 'Resolved'}
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold">
                              {lang === 'ar' ? 'قيد المتابعة' : 'Pending Review'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {report.status !== 'resolved' && (
                            <button
                              onClick={() => handleResolveReport(report.id, 'resolved')}
                              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-lg transition-all shadow-2xs"
                            >
                              {lang === 'ar' ? 'إغلاق وتسوية' : 'Mark Resolved'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
