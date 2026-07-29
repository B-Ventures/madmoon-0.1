/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, MerchantStore, ViewTab, DisputeReport } from './types';
import { INITIAL_STORES } from './data/initialStores';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RegistrationForm } from './components/RegistrationForm';
import { StoreVerificationCertificate } from './components/StoreVerificationCertificate';
import { ReportDisputeModal } from './components/ReportDisputeModal';
import { StoreRegistryDirectory } from './components/StoreRegistryDirectory';
import { HowItWorksSection } from './components/HowItWorksSection';
import { TermsPage } from './components/TermsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { DisclaimerPage } from './components/DisclaimerPage';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  Store, 
  PlusCircle, 
  Code2, 
  Search, 
  ShieldCheck, 
  Download, 
  X, 
  Lock 
} from 'lucide-react';
import { 
  auth, 
  onAuthStateChanged, 
  signOut,
  subscribeToMerchants, 
  incrementClickCountInFirestore,
  seedInitialStoresIfEmpty
} from './firebase';

const parseRouteFromUrl = (): { tab: ViewTab; slug: string | null } => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');

  if (path.includes('/terms') || hash === '#terms' || tabParam === 'terms') {
    return { tab: 'terms', slug: null };
  }
  if (path.includes('/privacy') || hash === '#privacy' || tabParam === 'privacy') {
    return { tab: 'privacy', slug: null };
  }
  if (path.includes('/disclaimer') || hash === '#disclaimer' || tabParam === 'disclaimer' || params.get('error') === 'domain_mismatch') {
    return { tab: 'disclaimer', slug: null };
  }
  if (path.includes('/admin') || hash === '#admin' || tabParam === 'admin') {
    return { tab: 'admin', slug: null };
  }
  if (path.includes('/directory') || hash === '#directory' || tabParam === 'directory') {
    return { tab: 'directory', slug: null };
  }
  if (path.includes('/register') || hash === '#register' || tabParam === 'register') {
    return { tab: 'register', slug: null };
  }

  let slug: string | null = params.get('verify');
  if (!slug && path.includes('/verify/')) {
    slug = path.split('/verify/')[1]?.split('/')[0]?.split('?')[0] || null;
  }
  if (slug || path.includes('/verify')) {
    return { tab: 'verify', slug: slug || 'amman-artisans' };
  }

  return { tab: 'home', slug: null };
};

export default function App() {
  // Language State (Arabic RTL default)
  const [lang, setLang] = useState<Language>('ar');

  // PWA Install Event Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(false);

  // Stores State synced with Firestore
  const [stores, setStores] = useState<MerchantStore[]>(() => {
    const saved = localStorage.getItem('madmoon_stores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STORES;
      }
    }
    return INITIAL_STORES;
  });

  // Parse current URL route on initial load
  const initialRoute = parseRouteFromUrl();

  // Current active view tab
  const [activeTab, setActiveTabState] = useState<ViewTab>(initialRoute.tab);

  // Active store selected for Badge Generator or Public Verification Certificate
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>(initialRoute.slug || 'amman-artisans');

  // Navigation tab updater that updates state and keeps browser URL synced
  const setActiveTab = (tab: ViewTab, targetSlug?: string) => {
    setActiveTabState(tab);

    const s = targetSlug || selectedStoreSlug;
    if (targetSlug) {
      setSelectedStoreSlug(targetSlug);
    }

    let newPath = '/';
    if (tab === 'terms') newPath = '/terms';
    else if (tab === 'privacy') newPath = '/privacy';
    else if (tab === 'disclaimer') newPath = '/disclaimer';
    else if (tab === 'directory') newPath = '/directory';
    else if (tab === 'register') newPath = '/register';
    else if (tab === 'admin') newPath = '/admin';
    else if (tab === 'verify') newPath = `/verify/${s}`;

    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      newPath += `?error=${params.get('error')}`;
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // Listen for browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromUrl();
      setActiveTabState(route.tab);
      if (route.slug) {
        setSelectedStoreSlug(route.slug);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Dispute Reports State
  const [reports, setReports] = useState<DisputeReport[]>(() => {
    const saved = localStorage.getItem('madmoon_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Dispute Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Listen for PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
      } else {
        const localAdmin = localStorage.getItem('madmoon_admin_logged');
        if (localAdmin === 'true') {
          setIsAdminAuthenticated(true);
        }
      }
    });
    return () => unsub();
  }, []);

  // Sync Stores Realtime from Firestore
  useEffect(() => {
    seedInitialStoresIfEmpty().then((data) => {
      if (data && data.length > 0) {
        setStores(data);
      }
    }).catch(console.warn);

    const unsubStores = subscribeToMerchants((firestoreStores) => {
      if (firestoreStores && firestoreStores.length > 0) {
        setStores(firestoreStores);
      }
    });

    return () => unsubStores();
  }, []);

  // Sync stores to localStorage as backup
  useEffect(() => {
    localStorage.setItem('madmoon_stores', JSON.stringify(stores));
  }, [stores]);

  // Sync reports to localStorage
  useEffect(() => {
    localStorage.setItem('madmoon_reports', JSON.stringify(reports));
  }, [reports]);

  // Update document direction and lang attribute whenever language changes
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (lang === 'ar') {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ar');
    } else {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
    }
  }, [lang]);

  // Find active selected store object
  const activeStore = stores.find((s) => s.slug === selectedStoreSlug) || stores[0];

  // Calculate total buyer verification clicks across all stores
  const totalClickCount = stores.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);

  // Handle new store registration
  const handleStoreRegistered = (newStore: MerchantStore) => {
    setStores((prev) => [newStore, ...prev]);
    setSelectedStoreSlug(newStore.slug);
  };

  // Handle store update (e.g. click count increment)
  const handleStoreUpdated = (updatedStore: MerchantStore) => {
    setStores((prev) => prev.map((s) => (s.slug === updatedStore.slug ? updatedStore : s)));
  };

  // Handle opening store verification certificate
  const handleOpenCertificate = (slug: string) => {
    const target = stores.find(s => s.slug === slug);
    if (target) {
      incrementClickCountInFirestore(target.id, target.clickCount || 0);
    }
    setStores((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, clickCount: (s.clickCount || 0) + 1 } : s))
    );
    setSelectedStoreSlug(slug);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle new report submission
  const handleSubmitReport = (newReport: DisputeReport) => {
    setReports((prev) => [newReport, ...prev]);
    setStores((prev) =>
      prev.map((s) => (s.slug === newReport.storeSlug ? { ...s, reportCount: (s.reportCount || 0) + 1 } : s))
    );
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('madmoon_admin_logged', 'true');
  };

  const handleAdminLogout = () => {
    signOut(auth).catch(console.warn);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('madmoon_admin_logged');
    setActiveTab('home');
  };

  // Active verified stores only for public showcase
  const activeVerifiedStores = stores.filter(
    (s) => s.verificationStatus === 'active' || (!s.verificationStatus && s.domainVerified)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white pb-20 sm:pb-0">
      
      {/* PWA Install Banner */}
      {showPwaBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-slate-950 px-4 py-2.5 flex items-center justify-between text-xs font-bold shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>
              {lang === 'ar'
                ? 'ثبّت تطبيق مضمون على شاشة جوالك الرئيسية لسرعة الوصول!'
                : 'Install Madmoon App on your phone for quick access!'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallPwa}
              className="bg-slate-950 hover:bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg text-xs font-extrabold shadow"
            >
              {lang === 'ar' ? 'تثبيت الآن' : 'Install Now'}
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1 text-slate-950/70 hover:text-slate-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header / Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalStoresCount={stores.length}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              lang={lang}
              onRegisterClick={() => setActiveTab('register')}
              onDirectoryClick={() => setActiveTab('directory')}
              sampleStores={activeVerifiedStores.slice(0, 4)}
              onSelectStoreToVerify={handleOpenCertificate}
              totalClickCount={totalClickCount}
            />
            <HowItWorksSection
              lang={lang}
              onRegisterClick={() => setActiveTab('register')}
            />
          </>
        )}

        {activeTab === 'register' && (
          <RegistrationForm
            lang={lang}
            existingStores={stores}
            onStoreRegistered={handleStoreRegistered}
            onOpenCertificate={handleOpenCertificate}
            onOpenTerms={() => setActiveTab('terms')}
            onOpenPrivacy={() => setActiveTab('privacy')}
            onOpenDisclaimer={() => setActiveTab('disclaimer')}
          />
        )}

        {activeTab === 'directory' && (
          <StoreRegistryDirectory
            lang={lang}
            stores={stores}
            onSelectStoreToVerify={handleOpenCertificate}
            onRegisterClick={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'verify' && (
          <StoreVerificationCertificate
            lang={lang}
            store={activeStore}
            onOpenReportModal={() => setReportModalOpen(true)}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'about' && (
          <HowItWorksSection
            lang={lang}
            onRegisterClick={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'terms' && (
          <TermsPage
            lang={lang}
            onBackToRegister={() => setActiveTab('register')}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyPage
            lang={lang}
            onBackToRegister={() => setActiveTab('register')}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'disclaimer' && (
          <DisclaimerPage
            lang={lang}
            onBackToRegister={() => setActiveTab('register')}
            onNavigateHome={() => setActiveTab('home')}
            onReportIssue={() => setReportModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              lang={lang}
              onLogout={handleAdminLogout}
              onViewCertificate={handleOpenCertificate}
              onNavigateToRegister={() => setActiveTab('register')}
            />
          ) : (
            <AdminLoginModal
              lang={lang}
              onLoginSuccess={handleAdminLoginSuccess}
              onCancel={() => setActiveTab('home')}
            />
          )
        )}
      </main>

      {/* Dispute / Report Modal */}
      <ReportDisputeModal
        lang={lang}
        store={activeStore}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Footer */}
      <Footer lang={lang} setActiveTab={setActiveTab} />

      {/* Mobile Ultra-Friendly Floating Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg pwa-safe-bottom">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-800 font-extrabold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'register'
              ? 'text-emerald-800 font-extrabold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'ar' ? 'تسجيل متجر' : 'Register'}</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'directory'
              ? 'text-emerald-800 font-extrabold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'ar' ? 'السجل' : 'Directory'}</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-all ${
            activeTab === 'admin'
              ? 'text-emerald-800 font-extrabold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
        </button>
      </div>

    </div>
  );
}

