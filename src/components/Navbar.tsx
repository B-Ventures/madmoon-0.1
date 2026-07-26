import React, { useState } from 'react';
import { ShieldCheck, Globe, Store, PlusCircle, Search, HelpCircle, Lock, Menu, X, Code2, ArrowUpRight } from 'lucide-react';
import { Language, ViewTab } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  totalStoresCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  totalStoresCount
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabSelect = (tab: ViewTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleTabSelect('home')}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none text-right shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-800 p-0.5 shadow-sm group-hover:bg-emerald-900 transition-colors flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {lang === 'ar' ? 'مَضمون' : 'Madmoon'}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop & Tablet Nav Bar (768px+) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
            <button
              id="nav-home-btn"
              onClick={() => handleTabSelect('home')}
              className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t.navHome}</span>
            </button>

            <button
              id="nav-register-btn"
              onClick={() => handleTabSelect('register')}
              className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.navRegister}</span>
            </button>

            <button
              id="nav-generator-btn"
              onClick={() => handleTabSelect('generator')}
              className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'generator'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{t.navGenerator}</span>
            </button>

            <button
              id="nav-directory-btn"
              onClick={() => handleTabSelect('directory')}
              className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.navDirectory}</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-md font-bold font-mono">
                {totalStoresCount}
              </span>
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => handleTabSelect('admin')}
              className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.navAdmin}</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              id="lang-switch-btn"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-all text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-emerald-800" />
              <span>{t.langSwitch}</span>
            </button>

            {/* Desktop CTA Button */}
            <button
              id="header-cta-btn"
              onClick={() => handleTabSelect('register')}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-3.5 py-2 rounded-xl shadow-xs transition-all text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>{t.navRegister}</span>
            </button>

            {/* Mobile Hamburger Drawer Toggle (Mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Expandable Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 px-2 space-y-1.5 bg-white rounded-b-2xl shadow-xl animate-fadeIn">
            <button
              onClick={() => handleTabSelect('home')}
              className={`w-full text-right rtl:text-right ltr:text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>{t.navHome}</span>
              </div>
            </button>

            <button
              onClick={() => handleTabSelect('register')}
              className={`w-full text-right rtl:text-right ltr:text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between ${
                activeTab === 'register' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>{t.navRegister}</span>
              </div>
            </button>

            <button
              onClick={() => handleTabSelect('generator')}
              className={`w-full text-right rtl:text-right ltr:text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between ${
                activeTab === 'generator' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>{t.navGenerator}</span>
              </div>
            </button>

            <button
              onClick={() => handleTabSelect('directory')}
              className={`w-full text-right rtl:text-right ltr:text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between ${
                activeTab === 'directory' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>{t.navDirectory}</span>
              </div>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-bold font-mono">
                {totalStoresCount}
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('admin')}
              className={`w-full text-right rtl:text-right ltr:text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between ${
                activeTab === 'admin' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>{t.navAdmin}</span>
              </div>
            </button>

            <div className="pt-2">
              <button
                onClick={() => handleTabSelect('register')}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>{t.navRegister}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
