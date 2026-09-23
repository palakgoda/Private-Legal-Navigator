/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scale,
  Trash2,
  BookmarkCheck,
  User,
  LogIn,
  LogOut,
  Sparkles,
  ChevronDown,
  Globe,
  HelpCircle
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../services/i18n';
import { User as UserType } from '../services/authService';

interface TopBarProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onDeleteSession: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTestModal: () => void;
  onOpenAuthModal: () => void;
  onOpenSavedModal: () => void;
  onOpenWhyNotAiModal?: () => void;
  onOpenFaq?: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
  savedCount: number;
  hasDocument: boolean;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentStep,
  onNavigateStep,
  onDeleteSession,
  onOpenPrivacyModal,
  onOpenTestModal,
  onOpenAuthModal,
  onOpenSavedModal,
  onOpenWhyNotAiModal,
  onOpenFaq,
  currentUser,
  onLogout,
  savedCount,
  hasDocument,
  language,
  onLanguageChange
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top micro bar for Tricolor / Indian Law banner */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateStep(1)}
            className="flex items-center gap-2.5 text-left focus:outline-hidden rounded-xl py-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-slate-800">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900">
                  {language === 'hi' ? 'न्याय मित्र' : language === 'mr' ? 'न्याय मित्र' : 'Nyaya Mitra'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-900 border border-amber-300/80">
                  🇮🇳 India
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">
                {language === 'hi'
                  ? 'भारतीय कानूनी दस्तावेज़ एवं अधिकार सहायक'
                  : language === 'mr'
                  ? 'भारतीय कायदेशीर दस्तऐवज व हक्क सहाय्यक'
                  : 'Indian Legal Notice Navigator'}
              </p>
            </div>
          </button>
        </div>

        {/* Step Navigation */}
        <nav
          aria-label="Workflow Steps"
          className="hidden lg:flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-600"
        >
          <button
            onClick={() => onNavigateStep(1)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentStep === 1
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {t('stepIntake')}
          </button>

          <span className="text-slate-300">›</span>

          <button
            onClick={() => hasDocument && onNavigateStep(2)}
            disabled={!hasDocument}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentStep === 2
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : hasDocument
                ? 'hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            {t('stepPrivacy')}
          </button>

          <span className="text-slate-300">›</span>

          <button
            onClick={() => hasDocument && onNavigateStep(3)}
            disabled={!hasDocument}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentStep === 3
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : hasDocument
                ? 'hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            {t('stepFields')}
          </button>

          <span className="text-slate-300">›</span>

          <button
            onClick={() => hasDocument && onNavigateStep(4)}
            disabled={!hasDocument}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentStep === 4
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : hasDocument
                ? 'hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            {t('stepGuidance')}
          </button>
        </nav>

        {/* Action Controls & Menus */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowUserMenu(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Change Language (भाषा बदलें / भाषा बदला)"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-xs font-bold text-left flex items-center justify-between transition-colors ${
                      language === lang.code
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-[11px] text-slate-400">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FAQs Button (Clean, spacious, uncrowded) */}
          {onOpenFaq && (
            <button
              onClick={onOpenFaq}
              className="px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Frequently Asked Questions & Mentor Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>FAQ</span>
            </button>
          )}

          {/* Saved Assessments Button */}
          <button
            onClick={onOpenSavedModal}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all relative"
            title="View saved assessments"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'सहेजे गए' : language === 'mr' ? 'जतन केलेले' : 'Saved'}
            </span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowLangMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-indigo-600" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('loginBtn')}</span>
              </button>
            )}

            {showUserMenu && currentUser && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser.emailOrPhone}</p>
                </div>

                <button
                  onClick={() => {
                    onOpenSavedModal();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('mySavedAssessments')}</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Delete / Exit Session */}
          {hasDocument && (
            <button
              onClick={onDeleteSession}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title={t('deleteSession')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Test Suite Trigger */}
          <button
            onClick={onOpenTestModal}
            className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title={t('runTests')}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
