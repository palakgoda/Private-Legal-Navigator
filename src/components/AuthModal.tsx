/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, LogIn, UserPlus, Shield, X, CheckCircle2, Lock, Phone } from 'lucide-react';
import { loginUser, registerUser, User as UserType, DEMO_USER } from '../services/authService';
import { SupportedLanguage, getTranslation } from '../services/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  language: SupportedLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailOrPhone.trim()) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें।'
          : language === 'mr'
          ? 'कृपया ईमेल किंवा मोबाईल नंबर टाका.'
          : 'Please enter your email or mobile number.'
      );
      return;
    }

    if (isRegister) {
      const res = registerUser(name, emailOrPhone, password);
      if (res.success && res.user) {
        setSuccessMessage(
          language === 'hi' ? 'खाता सफलतापूर्वक बन गया!' : language === 'mr' ? 'खाते यशस्वीपणे तयार झाले!' : 'Account registered successfully!'
        );
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else {
      const res = loginUser(emailOrPhone, password);
      if (res.success && res.user) {
        setSuccessMessage(
          language === 'hi' ? 'लॉग इन सफल!' : language === 'mr' ? 'लॉग इन यशस्वी!' : 'Signed in successfully!'
        );
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleQuickDemo = () => {
    const res = loginUser(DEMO_USER.emailOrPhone, 'demo');
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isRegister
                  ? language === 'hi' ? 'नया नागरिक खाता बनाएं' : language === 'mr' ? 'नवीन नागरिक खाते तयार करा' : 'Register Citizen Account'
                  : language === 'hi' ? 'नागरिक लॉग इन' : language === 'mr' ? 'नागरिक लॉग इन' : 'Citizen Sign In'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {language === 'hi'
                  ? 'अपने दस्तावेज़ सुरक्षित सहेजने के लिए लॉग इन करें'
                  : language === 'mr'
                  ? 'आपले दस्तऐवज सुरक्षित जतन करण्यासाठी लॉग इन करा'
                  : 'Manage saved legal assessments under your profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Option - Single Verified Profile */}
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold flex items-center justify-between gap-2 transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-left">
              <span className="text-lg">🧓</span>
              <div>
                <p className="font-extrabold text-amber-900 leading-tight">
                  {language === 'hi'
                    ? '1-क्लिक डेमो: रामेश्वर कुलकर्णी'
                    : language === 'mr'
                    ? '१-क्लिक डेमो: रामेश्वर कुलकर्णी'
                    : '1-Click Demo: Rameshwar Kulkarni'}
                </p>
                <p className="text-[10px] text-amber-700 font-normal">
                  {language === 'hi'
                    ? 'वरिष्ठ नागरिक (पुणे) • 1 सहेजा गया धारा 138 चेक बाउंस केस'
                    : language === 'mr'
                    ? 'ज्येष्ठ नागरिक (पुणे) • १ जतन केलेली कलम १३८ चेक बाऊन्स केस'
                    : 'Senior Citizen (Pune) • 1 Saved Section 138 Assessment'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 group-hover:bg-amber-300 transition-colors shrink-0">
              {language === 'hi' ? 'आज़माएँ' : language === 'mr' ? 'सुरू करा' : 'Try Demo'}
            </span>
          </button>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex border-b border-slate-200 mx-5 mt-4">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
              !isRegister
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              {language === 'hi' ? 'लॉग इन' : language === 'mr' ? 'लॉग इन' : 'Sign In'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
              isRegister
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              {language === 'hi' ? 'नया खाता' : language === 'mr' ? 'नवीन खाते' : 'Register'}
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पूरा नाम' : language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Arun Deshmukh / Priya Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'ईमेल या 10-अंकीय मोबाइल नंबर' : language === 'mr' ? 'ईमेल किंवा १०-अंकी मोबाईल नंबर' : 'Email or Mobile Number'}
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              placeholder="e.g. citizen@india.org or 9820012345"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पासवर्ड या 4-अंकीय पिन' : language === 'mr' ? 'पासवर्ड किंवा ४-अंकी पिन' : 'Password or PIN'}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>
              {isRegister
                ? language === 'hi' ? 'खाता बनाएं और सहेजें' : language === 'mr' ? 'खाते तयार करा व जतन करा' : 'Register & Continue'
                : language === 'hi' ? 'लॉग इन करें' : language === 'mr' ? 'लॉग इन करा' : 'Sign In to Profile'}
            </span>
          </button>
        </form>

        <div className="px-5 pb-5 pt-1 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            {language === 'hi'
              ? 'अतिथि के रूप में जारी रखें (स्थानीय मेमोरी)'
              : language === 'mr'
              ? 'अतिथी म्हणून सुरू ठेवा (लोकल स्टोरेज)'
              : 'Continue as Guest (Local In-Memory Only)'}
          </button>
        </div>
      </div>
    </div>
  );
};
