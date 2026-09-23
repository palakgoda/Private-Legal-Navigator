/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CheckSquare,
  Scale
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../services/i18n';

interface NavigationControlsProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onRestart: () => void;
  hasDocument: boolean;
  hasResults: boolean;
  documentTitle?: string;
  language: SupportedLanguage;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  onNavigateStep,
  onRestart,
  hasDocument,
  hasResults,
  documentTitle,
  language
}) => {
  const t = (key: string) => getTranslation(language, key);

  const stepMeta = [
    { number: 1, key: 'stepIntake', icon: FileText, labelEn: '1. Intake' },
    { number: 2, key: 'stepPrivacy', icon: ShieldCheck, labelEn: '2. Privacy Review' },
    { number: 3, key: 'stepFields', icon: CheckSquare, labelEn: '3. Verify Details' },
    { number: 4, key: 'stepGuidance', icon: Scale, labelEn: '4. Legal Guidance' }
  ];

  const canGoPrevious = currentStep > 1;
  const canGoNext =
    (currentStep === 1 && hasDocument) ||
    (currentStep === 2 && hasDocument) ||
    (currentStep === 3 && hasResults);

  const handlePrevious = () => {
    if (canGoPrevious) {
      onNavigateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigateStep(currentStep + 1);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Left: Previous / Back Button */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            canGoPrevious
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs cursor-pointer hover:-translate-x-0.5 active:translate-x-0'
              : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50 border border-slate-200'
          }`}
          aria-label={t('navPrevious')}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('navPrevious')}</span>
        </button>

        {hasDocument && (
          <button
            onClick={onRestart}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-colors flex items-center gap-1.5"
            title={t('navRestart')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('navRestart')}</span>
          </button>
        )}
      </div>

      {/* Middle: Step Breadcrumb Indicator */}
      <nav
        aria-label="Workflow Navigation"
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-full"
      >
        {stepMeta.map((s) => {
          const isCurrent = currentStep === s.number;
          const isCompleted = currentStep > s.number;
          const isClickable =
            s.number === 1 ||
            (s.number === 2 && hasDocument) ||
            (s.number === 3 && hasDocument) ||
            (s.number === 4 && hasResults);

          const StepIcon = s.icon;

          return (
            <button
              key={s.number}
              onClick={() => isClickable && onNavigateStep(s.number)}
              disabled={!isClickable}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300/60'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                  : isClickable
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                  : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <StepIcon className="w-3.5 h-3.5" />
              )}
              <span>{t(s.key)}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Next / Forward Button */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              canGoNext
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm cursor-pointer hover:translate-x-0.5 active:translate-x-0'
                : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 border border-slate-200'
            }`}
            aria-label={t('navNext')}
          >
            <span>{t('navNext')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'मूल्यांकन पूर्ण' : language === 'mr' ? 'मूल्यांकन पूर्ण' : 'Analysis Complete'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
