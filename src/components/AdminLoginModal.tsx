import React, { useState } from 'react';
import { Lock, ShieldCheck, Mail, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { signInWithEmailAndPassword, auth } from '../firebase';

interface AdminLoginModalProps {
  lang: Language;
  onLoginSuccess: () => void;
  onCancel?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  lang,
  onLoginSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
          : 'Please enter both email and password'
      );
      setLoading(false);
      return;
    }

    try {
      // Sign in existing admin user on Firebase Auth
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Firebase Auth Admin Error:', err);
      let msg = err.message || '';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = lang === 'ar' 
          ? 'بيانات الدخول غير صحيحة! يرجى التأكد من البريد الإلكتروني وكلمة المرور.' 
          : 'Invalid credentials! Please check your email and password.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl mx-auto flex items-center justify-center mb-4 text-emerald-800 shadow-2xs">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'ar' ? 'تسجيل دخول لوحة الإدارة' : 'Admin Portal Sign In'}
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-2">
            {lang === 'ar' 
              ? 'منطقة مخصصة لفريق الامتثال والتحقق في مضمون (Firebase Auth Security)'
              : 'Restricted access for Madmoon Compliance & Verification Team'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-700" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'البريد الإلكتروني للمسؤول' : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-emerald-800 ltr:pl-10 rtl:pr-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-emerald-800 ltr:pl-10 rtl:pr-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>{lang === 'ar' ? 'تسجيل الدخول إلى النظام' : 'Sign In to Dashboard'}</span>
              </>
            )}
          </button>
        </form>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-6 text-slate-500 hover:text-slate-800 text-xs font-bold text-center flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{lang === 'ar' ? 'الرجوع إلى الموقع الرئيسي' : 'Return to Home'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
