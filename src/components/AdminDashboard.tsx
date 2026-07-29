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
  ShieldAlert,
  MoreVertical,
  Eye,
  Globe,
  Code2,
  X,
  ChevronDown,
  User,
  Tag,
  Sparkles,
  Shield,
  ArrowUpRight,
  UserPlus,
  Mail,
  Key
} from 'lucide-react';
import { Language, MerchantStore, DisputeReport } from '../types';
import { 
  subscribeToMerchants, 
  subscribeToReports, 
  updateMerchantStatusInFirestore, 
  updateReportStatusInFirestore,
  seedInitialStoresIfEmpty,
  signOut,
  auth,
  createSecondaryAdminAccount
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

  // Active Store Modal State for deep inspection
  const [selectedStore, setSelectedStore] = useState<MerchantStore | null>(null);
  const [activeMenuStoreId, setActiveMenuStoreId] = useState<string | null>(null);

  // Add Admin Account Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState<string | null>(null);

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminLoading(true);
    setAddAdminError(null);

    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail || !newAdminPassword) {
      setAddAdminError(
        lang === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور للمسؤول الجديد'
          : 'Please enter both email and password for the new admin'
      );
      setAddAdminLoading(false);
      return;
    }

    if (newAdminPassword.length < 6) {
      setAddAdminError(
        lang === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 خانات على الأقل'
          : 'Password must be at least 6 characters long'
      );
      setAddAdminLoading(false);
      return;
    }

    try {
      await createSecondaryAdminAccount(cleanEmail, newAdminPassword);
      showToast(
        lang === 'ar'
          ? `[ ✓ تم تسجيل مسؤول جديد ] (${cleanEmail}) بنجاح على Firebase`
          : `[ ✓ New Admin Registered ] (${cleanEmail}) successfully on Firebase`
      );
      setNewAdminEmail('');
      setNewAdminPassword('');
      setIsAddAdminOpen(false);
    } catch (err: any) {
      console.error('Create admin error:', err);
      let msg = err?.message || '';
      if (err?.code === 'auth/email-already-in-use') {
        msg = lang === 'ar'
          ? 'هذا البريد الإلكتروني مسجل بالفعل كمسؤول في Firebase Auth.'
          : 'This email is already registered on Firebase Auth.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = lang === 'ar'
          ? 'صيغة البريد الإلكتروني غير صحيحة.'
          : 'Invalid email address format.';
      } else if (err?.code === 'auth/weak-password') {
        msg = lang === 'ar'
          ? 'كلمة المرور ضعيفة جداً (يجب ألا تقل عن 6 خانات).'
          : 'Password is too weak (must be at least 6 characters).';
      }
      setAddAdminError(msg);
    } finally {
      setAddAdminLoading(false);
    }
  };

  // Subscribe to Firestore Realtime Data
  useEffect(() => {
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

  const handleApproveStore = async (store: MerchantStore) => {
    try {
      const tier = store.sellerType === 'business' ? (lang === 'ar' ? 'مستوى 2: منشأة مسجلة' : 'Layer 2: Registered Entity') : (lang === 'ar' ? 'مستوى 1: هوية مؤكدة' : 'Layer 1: Personal ID');
      await updateMerchantStatusInFirestore(store.id, 'active', tier);
      showToast(lang === 'ar' ? `[ ✓ تم الاعتماد والتفعيل ] لمتجر "${store.nameAr}"` : `[ ✓ Approved & Activated ] "${store.nameEn}"`);
      if (selectedStore?.id === store.id) {
        setSelectedStore({ 
          ...selectedStore, 
          verificationStatus: 'active', 
          domainVerified: true,
          crVerified: true,
          whatsappVerified: true,
          tier 
        });
      }
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'حدث خطأ أثناء تحديث حالة المتجر' : 'Failed to update store status');
    }
  };

  const handleRejectStore = async (storeId: string, storeName: string) => {
    try {
      await updateMerchantStatusInFirestore(storeId, 'rejected');
      showToast(lang === 'ar' ? `تم رفض طلب توثيق "${storeName}"` : `Verification rejected for "${storeName}"`);
      if (selectedStore?.id === storeId) {
        setSelectedStore({ 
          ...selectedStore, 
          verificationStatus: 'rejected',
          domainVerified: false,
          crVerified: false,
          whatsappVerified: false
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyDnsTxtRecord = (store: MerchantStore) => {
    const txtRecord = `madmoon-verify=${store.verificationBadgeId || store.slug}`;
    navigator.clipboard.writeText(txtRecord);
    showToast(lang === 'ar' ? `تم نسخ سجل DNS TXT: ${txtRecord}` : `DNS TXT Record copied: ${txtRecord}`);
  };

  const handleResendWhatsAppSnippet = (store: MerchantStore) => {
    const baseUrl = window.location.origin;
    const text = lang === 'ar'
      ? `أهلاً ${store.ownerName || store.nameAr}، تم إصدار كود شارة مضمون لمتجرك (${store.websiteUrl}). الكود السريع:\n<script src="${baseUrl}/badge.js" data-id="${store.verificationBadgeId}" data-slug="${store.slug}"></script>`
      : `Hello ${store.ownerName || store.nameEn}, your Madmoon badge snippet is ready for (${store.websiteUrl}):\n<script src="${baseUrl}/badge.js" data-id="${store.verificationBadgeId}" data-slug="${store.slug}"></script>`;
    
    navigator.clipboard.writeText(text);
    showToast(lang === 'ar' ? `تم تجهيز ونسخ كود الواتساب لـ ${store.phone}` : `WhatsApp snippet copied for ${store.phone}!`);
  };

  const handleCopyEmbedCode = (store: MerchantStore) => {
    const baseUrl = window.location.origin;
    const snippet = `<script src="${baseUrl}/badge.js" data-badge-id="${store.verificationBadgeId}" data-slug="${store.slug}"></script>`;
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
  const rejectedCount = merchants.filter(m => m.verificationStatus === 'rejected').length;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-black px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn text-xs border border-slate-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Streamlined & Elegant */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
              {lang === 'ar' ? 'منظومة الامتثال والتحقق المباشرة' : 'Live Compliance System'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded-md">
              v2.4 Firestore
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'ar' ? 'لوحة التحكم والامتثال بـ مضمون' : 'Madmoon Compliance Dashboard'}
          </h1>
          <p className="text-slate-600 text-xs font-medium max-w-xl leading-relaxed">
            {lang === 'ar' 
              ? 'إدارة المتاجر المسجلة، مراجعة السجلات التجارية، اعتماد الأختام، ومتابعة بلاغات المستهلكين.'
              : 'Manage registered merchants, verify business credentials, issue badges, and handle consumer reports.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsAddAdminOpen(true)}
            className="flex-1 md:flex-none bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#047857] font-black px-3.5 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#047857]" />
            <span>{lang === 'ar' ? 'إضافة مسؤول جديد' : 'Add Admin User'}</span>
          </button>

          <button
            onClick={onNavigateToRegister}
            className="flex-1 md:flex-none bg-[#047857] hover:bg-[#036247] text-white font-black px-4 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة متجر جديد' : 'Add New Store'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold px-3.5 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>{lang === 'ar' ? 'خروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Stores */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold text-slate-600">
              {lang === 'ar' ? 'إجمالي المتاجر' : 'Total Merchants'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Building2 className="w-4 h-4 text-[#047857]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStores}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            {lang === 'ar' ? 'محتوى قاعدة البيانات' : 'Stored in Firestore'}
          </p>
        </div>

        {/* Pending Verifications */}
        <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-[11px] font-black text-amber-900">
              {lang === 'ar' ? 'قيد التحقق والمراجعة' : 'Pending Verification'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/90 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950">{pendingCount}</div>
          <p className="text-[11px] font-extrabold text-amber-800 mt-1">
            {lang === 'ar' ? 'تتطلب تفعيل السجل' : 'Awaiting admin review'}
          </p>
        </div>

        {/* Active Verified */}
        <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-emerald-900 mb-2">
            <span className="text-[11px] font-black text-emerald-900">
              {lang === 'ar' ? 'متاجر موثقة ومفعّلة' : 'Active Verified Stores'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#047857] shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">{activeCount}</div>
          <p className="text-[11px] font-extrabold text-[#047857] mt-1">
            {lang === 'ar' ? 'تحمل ختم مضمون الرسمي' : 'Official seal issued'}
          </p>
        </div>

        {/* Total Badge Clicks */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold text-slate-600">
              {lang === 'ar' ? 'فحوصات المشتريين' : 'Verification Clicks'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-teal-700 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBadgeClicks.toLocaleString()}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            {lang === 'ar' ? 'نقرات تحقق على الشهادات' : 'Live buyer inspection hits'}
          </p>
        </div>

      </div>

      {/* CONTROLS BAR: SEGMENTED TABS + SEARCH & FILTERS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-3.5">
          
          {/* Segmented Tabs Control */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 inline-flex items-center self-start md:self-auto">
            <button
              onClick={() => setActiveTab('merchants')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'merchants'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'merchants' ? 'text-[#047857]' : 'text-slate-400'}`} />
              <span>{lang === 'ar' ? 'سجل المتاجر' : 'Merchants Registry'}</span>
              <span className="bg-slate-200/70 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full">
                {merchants.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'disputes'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${activeTab === 'disputes' ? 'text-amber-700' : 'text-slate-400'}`} />
              <span>{lang === 'ar' ? 'بلاغات المشتريين' : 'Disputes Log'}</span>
              {reports.length > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {reports.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Search */}
          {activeTab === 'merchants' && (
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث باسم المتجر، السجل التجاري، رقم الواتساب...' : 'Search store name, CR, phone...'}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-[#047857] transition-colors ltr:pl-9 rtl:pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 rtl:left-3 rtl:right-auto text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          )}

        </div>

        {/* Status Filter Pills (Merchants View) */}
        {activeTab === 'merchants' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 ml-1 rtl:mr-1 rtl:ml-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{lang === 'ar' ? 'تصفية حسب الحالة:' : 'Filter:'}</span>
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'ar' ? 'جميع المتاجر' : 'All'} ({merchants.length})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'قيد التحقق' : 'Pending'}</span>
              <span className="bg-amber-800/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-[#047857] text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المعتمدة والمفتوحة' : 'Active'}</span>
              <span className="bg-emerald-800/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {lang === 'ar' ? 'المرفوضة' : 'Rejected'} ({rejectedCount})
            </button>
          </div>
        )}

      </div>

      {/* TAB CONTENT: MERCHANTS TABLE */}
      {activeTab === 'merchants' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 text-[#047857] animate-spin mx-auto" />
              <p className="text-xs font-medium">{lang === 'ar' ? 'جاري مزامنة سجل المتاجر من Firestore...' : 'Syncing merchant registry from Firestore...'}</p>
            </div>
          ) : filteredMerchants.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-extrabold text-slate-800 text-sm">{lang === 'ar' ? 'لا توجد متاجر تطابق البحث الحقيقي' : 'No stores match your search'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[220px]">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700">
                
                <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'المتجر والنشاط' : 'Store & Domain'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'السجل / الهوية' : 'Commercial Reg.'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'المسؤول والواتساب' : 'Owner & Phone'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'الباقة والنوع' : 'Seller Tier'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'حالة التوثيق' : 'Verification Status'}</th>
                    <th className="px-5 py-3.5 text-center min-w-[200px]">{lang === 'ar' ? 'إجراءات الاعتماد' : 'Quick Actions'}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMerchants.map((store, index) => {
                    const status = store.verificationStatus || (store.domainVerified ? 'active' : 'pending');
                    const isMenuOpen = activeMenuStoreId === store.id;
                    const isNearBottom = index >= filteredMerchants.length - 2 && filteredMerchants.length > 2;

                    return (
                      <tr 
                        key={store.id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        
                        {/* Store Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center font-black text-[#047857] text-xs shrink-0 shadow-2xs">
                              {store.nameAr.slice(0, 1)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                                <span>{lang === 'ar' ? store.nameAr : store.nameEn}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                                <span className="truncate max-w-[150px] sm:max-w-[200px]">{store.websiteUrl}</span>
                                <a
                                  href={store.websiteUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-[#047857] transition-colors"
                                  title={lang === 'ar' ? 'زيارة رابط المتجر' : 'Visit website'}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Commercial Reg / Identity */}
                        <td className="px-5 py-4">
                          <div className="font-mono text-slate-900 font-extrabold text-xs">
                            {store.sellerType === 'individual' || (store.commercialReg && (store.commercialReg.includes('فردي') || store.commercialReg.includes('Individual')))
                              ? (lang === 'ar' ? 'فردي / صانع محتوى' : 'Individual / Content Creator')
                              : store.commercialReg}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            {store.country} • {store.sellerType === 'business' ? (lang === 'ar' ? 'منشأة' : 'Business') : (lang === 'ar' ? 'فردي' : 'Individual')}
                          </div>
                        </td>

                        {/* Owner & Phone */}
                        <td className="px-5 py-4">
                          <div className="font-mono text-slate-900 font-bold dir-ltr text-right text-xs">{store.phone}</div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[130px]">
                            {store.ownerName || (lang === 'ar' ? 'مالك مؤكد' : 'Verified Owner')}
                          </div>
                        </td>

                        {/* Tier / Baqah */}
                        <td className="px-5 py-4">
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-800 font-black border border-slate-300 px-2.5 py-1 rounded-lg">
                            {store.sellerType === 'business' || (store.tier && (store.tier.includes('2') || store.tier.includes('منشأة')))
                              ? (lang === 'ar' ? 'مستوى 2: منشأة مسجلة' : 'Layer 2: Registered Entity')
                              : (lang === 'ar' ? 'مستوى 1: هوية مؤكدة' : 'Layer 1: Personal ID')}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-4">
                          {status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-[#047857] border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-[#047857]" />
                              <span>{lang === 'ar' ? 'مفعّل وموثق' : 'Active'}</span>
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>{lang === 'ar' ? 'قيد المراجعة' : 'Pending'}</span>
                            </span>
                          )}
                          {status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-700" />
                              <span>{lang === 'ar' ? 'مرفوض' : 'Rejected'}</span>
                            </span>
                          )}
                        </td>

                        {/* UN-CROWDED ACTIONS COLUMN */}
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            
                            {/* Primary Action Button */}
                            {status === 'pending' ? (
                              <button
                                onClick={() => handleApproveStore(store)}
                                className="bg-[#047857] hover:bg-[#036247] text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-600/30"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? '[ ✓ اعتماد وتفعيل ]' : '[ ✓ Approve & Activate ]'}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onViewCertificate(store.slug)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-200 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'عرض الشهادة' : 'Certificate'}</span>
                              </button>
                            )}

                            {/* Detail Drawer Trigger */}
                            <button
                              onClick={() => setSelectedStore(store)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                              title={lang === 'ar' ? 'معاينة كافة التفاصيل وأكواد الإدراج' : 'View Full Details & Scripts'}
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span className="hidden sm:inline">{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
                            </button>

                            {/* Dropdown Action Menu Toggle */}
                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuStoreId(isMenuOpen ? null : store.id)}
                                className="p-1.5 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
                                title={lang === 'ar' ? 'المزيد من الإجراءات' : 'More Options'}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Backdrop overlay to close menu on click outside */}
                              {isMenuOpen && (
                                <div 
                                  className="fixed inset-0 z-20 cursor-default" 
                                  onClick={() => setActiveMenuStoreId(null)} 
                                />
                              )}

                              {/* Dropdown Menu Popup - opens upwards if near bottom of table */}
                              {isMenuOpen && (
                                <div className={`absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 py-1.5 animate-fadeIn text-right rtl:text-right ltr:text-left max-h-64 overflow-y-auto ${
                                  isNearBottom ? 'bottom-full mb-1 origin-bottom' : 'top-full mt-1 origin-top'
                                }`}>
                                  
                                  <button
                                    onClick={() => {
                                      handleCopyEmbedCode(store);
                                      setActiveMenuStoreId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Code2 className="w-4 h-4 text-[#047857]" />
                                    <span>{lang === 'ar' ? 'نسخ كود الإدراج (Embed)' : 'Copy Embed Code'}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleCopyDnsTxtRecord(store);
                                      setActiveMenuStoreId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <FileText className="w-4 h-4 text-slate-600" />
                                    <span>{lang === 'ar' ? 'نسخ سجل DNS TXT' : 'Copy DNS TXT'}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleResendWhatsAppSnippet(store);
                                      setActiveMenuStoreId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs font-extrabold text-teal-800 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Send className="w-4 h-4 text-teal-700" />
                                    <span>{lang === 'ar' ? 'إرسال عبر الواتساب' : 'Send via WhatsApp'}</span>
                                  </button>

                                  <hr className="my-1 border-slate-100" />

                                  {status !== 'rejected' && (
                                    <button
                                      onClick={() => {
                                        handleRejectStore(store.id, store.nameAr);
                                        setActiveMenuStoreId(null);
                                      }}
                                      className="w-full px-3.5 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <XCircle className="w-4 h-4 text-rose-600" />
                                      <span>{lang === 'ar' ? 'رفض وإيقاف المتجر' : 'Reject Store'}</span>
                                    </button>
                                  )}

                                </div>
                              )}
                            </div>

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
      )}

      {/* TAB CONTENT: DISPUTES LOG */}
      {activeTab === 'disputes' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <span>{lang === 'ar' ? 'سجل بلاغات ونزاعات المشتريين' : 'Buyer Disputes Log'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {lang === 'ar' ? 'متابعة شكاوى المستهلكين المقدمة من خلال صفحات شهادات المتاجر' : 'Direct consumer dispute reports'}
              </p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <CheckCircle className="w-10 h-10 text-[#047857] mx-auto" />
              <p className="font-black text-slate-900 text-sm">{lang === 'ar' ? 'لا توجد بلاغات نزاع معلقة' : 'No active disputes'}</p>
              <p className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'جميع المتاجر الموثقة ملتزمة بمعايير حماية المشتري' : 'All merchants comply with consumer protection standards'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-black border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'المتجر المعني' : 'Target Store'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'المشتري والهاتف' : 'Buyer Info'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'تفاصيل البلاغ' : 'Issue Details'}</th>
                    <th className="px-5 py-3.5">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="px-5 py-3.5 text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-black text-slate-900">
                        {report.storeName || report.storeSlug}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{report.reporterName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{report.reporterPhone}</div>
                      </td>
                      <td className="px-5 py-4 font-mono text-[#047857] font-extrabold">
                        #{report.orderNumber}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-extrabold block w-fit mb-1">
                          {report.issueType}
                        </span>
                        <p className="text-xs text-slate-600 font-medium line-clamp-2">{report.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        {report.status === 'resolved' ? (
                          <span className="bg-emerald-50 text-[#047857] border border-emerald-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold">
                            {lang === 'ar' ? 'تمت التسوية' : 'Resolved'}
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold">
                            {lang === 'ar' ? 'قيد المتابعة' : 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {report.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolveReport(report.id, 'resolved')}
                            className="px-3 py-1.5 bg-[#047857] hover:bg-[#036247] text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            {lang === 'ar' ? 'إغلاق وتسوية' : 'Resolve'}
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
      )}

      {/* STORE INSPECTION & SCRIPT MODAL (Fixes Crowdedness completely) */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#047857] flex items-center justify-center font-black text-sm shadow-2xs">
                  {selectedStore.nameAr.slice(0, 1)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'ar' ? selectedStore.nameAr : selectedStore.nameEn}
                  </h3>
                  <a
                    href={selectedStore.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#047857] font-mono hover:underline flex items-center gap-1"
                  >
                    <span>{selectedStore.websiteUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => setSelectedStore(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Details Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">
                  {lang === 'ar' ? 'رقم السجل التجاري / الوطنية' : 'CR / National ID'}
                </span>
                <span className="font-mono font-black text-slate-900">{selectedStore.commercialReg}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">
                  {lang === 'ar' ? 'نوع الباقة والاعتماد' : 'Verification Tier'}
                </span>
                <span className="font-extrabold text-[#047857]">{selectedStore.tier || 'Tier 1'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">
                  {lang === 'ar' ? 'مالك المتجر / المسؤول' : 'Store Owner'}
                </span>
                <span className="font-bold text-slate-800">{selectedStore.ownerName || '-'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">
                  {lang === 'ar' ? 'رقم الواتساب المؤكد' : 'Phone Number'}
                </span>
                <span className="font-mono font-bold text-slate-900 dir-ltr inline-block">{selectedStore.phone}</span>
              </div>
            </div>

            {/* Embed Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#047857]" />
                  <span>{lang === 'ar' ? 'كود الإدراج المباشر (Embed Script)' : 'Direct Embed Script'}</span>
                </label>
                <button
                  onClick={() => handleCopyEmbedCode(selectedStore)}
                  className="text-xs text-[#047857] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === selectedStore.id ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy')}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl text-[11px] font-mono whitespace-pre-wrap break-all dir-ltr">
                {`<script src="${window.location.origin}/badge.js" data-badge-id="${selectedStore.verificationBadgeId}" data-slug="${selectedStore.slug}"></script>`}
              </pre>
            </div>

            {/* DNS TXT Record Verification */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'ar' ? 'سجل DNS TXT للتحقق اليدوي' : 'DNS TXT Record String'}</span>
                </label>
                <button
                  onClick={() => handleCopyDnsTxtRecord(selectedStore)}
                  className="text-xs text-slate-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'نسخ السجل' : 'Copy TXT'}</span>
                </button>
              </div>

              <input
                type="text"
                readOnly
                value={`madmoon-verify=${selectedStore.verificationBadgeId || selectedStore.slug}`}
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => onViewCertificate(selectedStore.slug)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{lang === 'ar' ? 'فتح صفحة الشهادة العامة' : 'Open Public Certificate'}</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedStore.verificationStatus !== 'active' && (
                  <button
                    onClick={() => handleApproveStore(selectedStore)}
                    className="bg-[#047857] hover:bg-[#036247] text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اعتماد وتفعيل المتجر' : 'Approve & Activate'}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedStore(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create New Admin Modal */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => {
                setIsAddAdminOpen(false);
                setAddAdminError(null);
              }}
              className="absolute top-5 left-5 rtl:right-5 rtl:left-auto text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl mx-auto flex items-center justify-center mb-3 text-[#047857] shadow-2xs">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {lang === 'ar' ? 'إضافة حساب مسؤول جديد (Firebase)' : 'Register New Admin Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {lang === 'ar'
                  ? 'إنشاء اعتماد مسؤول جديد لدخول لوحة التحكم والامتثال'
                  : 'Grant new admin credentials for compliance dashboard access'}
              </p>
            </div>

            {addAdminError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium p-3.5 rounded-xl flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-700" />
                <span>{addAdminError}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني للمسؤول الجديد' : 'New Admin Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin2@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-[#047857] ltr:pl-9 rtl:pr-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-[#047857] ltr:pl-9 rtl:pr-9"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {lang === 'ar' ? 'يجب أن لا تقل كلمة المرور عن 6 خانات' : 'Password must be at least 6 characters'}
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={addAdminLoading}
                  className="flex-1 bg-[#047857] hover:bg-[#036247] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {addAdminLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>{lang === 'ar' ? 'حفظ وتأهيل المسؤول' : 'Register Admin User'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddAdminOpen(false);
                    setAddAdminError(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

