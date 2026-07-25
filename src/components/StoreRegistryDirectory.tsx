import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, ExternalLink, Building2, CheckCircle2, Globe, Eye } from 'lucide-react';
import { Language, MerchantStore, CountryCode, StoreCategory } from '../types';
import { translations } from '../translations';
import { COUNTRIES } from '../data/countries';

interface StoreRegistryDirectoryProps {
  lang: Language;
  stores: MerchantStore[];
  onSelectStoreToVerify: (slug: string) => void;
  onRegisterClick: () => void;
}

export const StoreRegistryDirectory: React.FC<StoreRegistryDirectoryProps> = ({
  lang,
  stores,
  onSelectStoreToVerify,
  onRegisterClick
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.commercialReg.includes(searchTerm) ||
      store.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = selectedCountry === 'ALL' || store.country === selectedCountry;
    const matchesCategory = selectedCategory === 'ALL' || store.category === selectedCategory;

    return matchesSearch && matchesCountry && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'ar' ? 'السجل العام المفتوح' : 'Public Open Registry'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          {t.directoryTitle}
        </h2>
        <p className="text-slate-600 text-sm font-medium">
          {t.directorySub}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input (6 cols) */}
          <div className="sm:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-11 pl-4 py-3 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 font-medium transition-colors"
            />
          </div>

          {/* Country Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
            >
              <option value="ALL">{t.filterAllCountries}</option>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((cCode) => (
                <option key={cCode} value={cCode}>
                  {COUNTRIES[cCode].flag} {lang === 'ar' ? COUNTRIES[cCode].nameAr : COUNTRIES[cCode].nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-slate-800 text-xs font-extrabold focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
            >
              <option value="ALL">{t.filterAllCategories}</option>
              <option value="crafts">{t.catCrafts}</option>
              <option value="fashion">{t.catFashion}</option>
              <option value="electronics">{t.catElectronics}</option>
              <option value="beauty">{t.catBeauty}</option>
              <option value="food">{t.catFood}</option>
              <option value="services">{t.catServices}</option>
              <option value="general">{t.catGeneral}</option>
            </select>
          </div>

        </div>

      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900">
            {lang === 'ar' ? 'لم يتم العثور على نتائج تطابق البحث' : 'No matching verified stores found'}
          </h3>
          <button
            onClick={onRegisterClick}
            className="bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-900 transition-colors shadow-sm"
          >
            {t.navRegister}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const countryData = COUNTRIES[store.country] || COUNTRIES['JO'];
            return (
              <div
                key={store.id}
                className="bg-white border border-slate-200 hover:border-emerald-600 rounded-2xl p-6 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                        {store.logoUrl ? (
                          <img src={store.logoUrl} alt={store.nameAr} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {lang === 'ar' ? store.nameAr : store.nameEn}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5 dir-ltr">
                          {store.websiteUrl.replace('https://', '').replace('http://', '')}
                        </p>
                      </div>
                    </div>

                    <span className="text-xl" title={countryData.nameAr}>
                      {countryData.flag}
                    </span>
                  </div>

                  {/* Badges / Details */}
                  <div className="space-y-2 mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{lang === 'ar' ? 'السجل التجاري' : 'Commercial Reg'}</span>
                      <span className="font-mono text-slate-900 font-extrabold">{store.commercialReg}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{lang === 'ar' ? 'الهاتف المعتمد' : 'Hotline'}</span>
                      <span className="font-mono text-slate-800 font-bold dir-ltr">{store.phone}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{store.clickCount.toLocaleString()} {lang === 'ar' ? 'تحقق' : 'verifications'}</span>
                  </div>

                  <button
                    onClick={() => onSelectStoreToVerify(store.slug)}
                    className="bg-emerald-50 hover:bg-emerald-800 text-emerald-900 hover:text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.verifyCertificateBtn}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
