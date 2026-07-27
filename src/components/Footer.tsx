import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { Language, ViewTab } from '../types';
import { translations } from '../translations';
import { MadmoonLogo } from './MadmoonLogo';

interface FooterProps {
  lang: Language;
  setActiveTab: (tab: ViewTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, setActiveTab }) => {
  const t = translations[lang];

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1.5 shadow-2xs flex items-center justify-center">
              <MadmoonLogo className="w-full h-full" variant="colored-light" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">
                {lang === 'ar' ? 'مَضمون' : 'Madmoon'}
              </span>
              <p className="text-xs text-slate-500 font-medium">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-extrabold">
            <button onClick={() => setActiveTab('home')} className="hover:text-emerald-800 transition-colors">
              {t.navHome}
            </button>
            <button onClick={() => setActiveTab('register')} className="hover:text-emerald-800 transition-colors">
              {t.navRegister}
            </button>
            <button onClick={() => setActiveTab('directory')} className="hover:text-emerald-800 transition-colors">
              {t.navDirectory}
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-emerald-800 transition-colors">
              {t.navAbout}
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-800 transition-colors flex items-center gap-1 text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {t.navAdmin}
            </button>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
          <p>{t.footerRights}</p>
        </div>

      </div>
    </footer>
  );
};
