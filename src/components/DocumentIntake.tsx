/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Camera,
  FileText,
  AlertCircle,
  Sparkles,
  Scale,
  MapPin,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { PilotJurisdictionId, SyntheticDocumentFixture } from '../types/navigator';
import { JURISDICTIONS, SUPPORTED_DOCUMENT_TYPES } from '../services/sourceRegistry';
import { SYNTHETIC_FIXTURES } from '../services/localOcrService';
import { SupportedLanguage, getTranslation } from '../services/i18n';
import { AnimatedTooltip } from './AnimatedTooltip';
import { IntakeWalkthroughOverlay } from './IntakeWalkthroughOverlay';
import { LocalProcessor } from './LocalProcessor';

interface DocumentIntakeProps {
  selectedJurisdictionId: PilotJurisdictionId;
  onSelectJurisdiction: (j: PilotJurisdictionId) => void;
  onFileSelected: (file: File) => void;
  onSyntheticFixtureSelected: (fixture: SyntheticDocumentFixture) => void;
  onDirectTextSubmitted: (text: string, title?: string) => void;
  isProcessing: boolean;
  errorMessage: string | null;
  language: SupportedLanguage;
  onOpenWhyNotAiModal?: () => void;
}

export const DocumentIntake: React.FC<DocumentIntakeProps> = ({
  selectedJurisdictionId,
  onSelectJurisdiction,
  onFileSelected,
  onSyntheticFixtureSelected,
  onDirectTextSubmitted,
  isProcessing,
  errorMessage,
  language,
  onOpenWhyNotAiModal
}) => {
  const [activeTab, setActiveTab] = useState<'synthetic' | 'upload' | 'paste'>('synthetic');
  const [pastedText, setPastedText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string, fallback?: string) => getTranslation(language, key, fallback);
  const currentJurisdiction = JURISDICTIONS[selectedJurisdictionId];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handlePastedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pastedText.trim().length > 15) {
      onDirectTextSubmitted(pastedText, 'Manually Entered Notice Text');
    }
  };

  const heroTitleText = t('heroTitle', 'Understand Any Indian Legal Notice in Plain Language');
  const heroSubtitleText = t(
    'heroSubtitle',
    'Upload court summons, Section 138 cheque dishonour notices, or eviction demands. Get step-by-step rights, critical deadlines, and free legal aid options strictly under Indian law.'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Senior Citizen Step-by-Step Guidance Overlay */}
      <IntakeWalkthroughOverlay
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        language={language}
        onSelectSampleCase={() => {
          if (SYNTHETIC_FIXTURES.length > 0) {
            onSyntheticFixtureSelected(SYNTHETIC_FIXTURES[0]);
          }
        }}
      />

      {/* Hero Welcome Card */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-amber-50/20 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Background decorative subtle warm radial gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          {/* Metadata Row: Unboxed discipline */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 mb-3 font-semibold">
            <span className="text-amber-800 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'hi' ? 'भारतीय कानून' : language === 'mr' ? 'भारतीय कायदे' : 'Indian Law Only'}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? '100% ब्राउज़र गोपनीयता' : language === 'mr' ? '१००% ब्राउझर गोपनीयता' : '100% In-Browser Privacy'}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">NALSA National Helpline: 15100</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-3 leading-tight text-balance">
            {heroTitleText}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {heroSubtitleText}
          </p>

          {/* Interactive Senior Walkthrough Launch Banner */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsWalkthroughOpen(true)}
                className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all hover:translate-y-px cursor-pointer"
              >
                <span>🧓</span>
                <span>{t('seniorGuideBtn', 'Elder-Citizen Guided Tour')}</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-700/60 text-amber-100">
                  4 Steps
                </span>
              </button>

              <AnimatedTooltip
                content={t('tipPrivacy', 'Zero cloud uploads. All Optical Character Recognition and masking run strictly in your browser memory.')}
                title={language === 'hi' ? 'गोपनीयता सुरक्षा' : language === 'mr' ? 'गोपनीयता संरक्षण' : 'Privacy Protection'}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
              <span>
                {language === 'hi'
                  ? 'वरिष्ठ नागरिक एवं पहली बार नोटिस पढ़ने वालों के लिए विशेष सुगम मोड'
                  : language === 'mr'
                  ? 'ज्येष्ठ नागरिक आणि पहिल्यांदा नोटीस वाचणाऱ्यांसाठी सुलभ सहाय्य'
                  : 'Special guided view tailored for senior citizens and youth'}
              </span>
              <span>•</span>
              <a
                href="#faq-section"
                className="text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQ) ↓' : language === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न (FAQ) ↓' : 'Browse FAQs & Mentor Q&A ↓'}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Jurisdiction Selection Strip */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('selectJurisdiction', 'Select Indian State / Legal Jurisdiction')}
            </h2>
            <AnimatedTooltip
              content={t(
                'tipJurisdiction',
                'Select your state so procedural timelines and state rent/civil acts match your local court rules.'
              )}
              title={language === 'hi' ? 'राज्य अधिकार क्षेत्र' : language === 'mr' ? 'राज्य अधिकारक्षेत्र' : 'State Jurisdiction'}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active: <strong className="text-slate-800">{currentJurisdiction.name}</strong> ({currentJurisdiction.courtSystem})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.values(JURISDICTIONS).map((jurisdiction) => {
            const isSelected = selectedJurisdictionId === jurisdiction.id;
            return (
              <button
                key={jurisdiction.id}
                onClick={() => onSelectJurisdiction(jurisdiction.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 leading-snug">
                    {jurisdiction.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 truncate font-medium">{jurisdiction.state}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Local In-Browser Processing & Privacy Sandbox Indicator */}
      <LocalProcessor
        isProcessing={isProcessing}
        stage={isProcessing ? 'ocr' : 'ready'}
        language={language}
      />

      {/* Mode Tabs: Synthetic Indian Scenarios vs Real Upload vs Direct Paste */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex border-b border-slate-200/80 pb-3.5 gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('synthetic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'synthetic'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('demoNotices', 'Sample Legal Fixtures')}</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>{t('uploadDocument', 'Upload File / Photo')}</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{t('pasteText', 'Paste Notice Text')}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>🛡️ 100% In-Browser OCR</span>
            <AnimatedTooltip
              content={t(
                'tipPrivacy',
                'Your file never leaves your machine. Optical character recognition executes directly in browser memory.'
              )}
            />
          </div>
        </div>

        {/* Tab 1: Synthetic Indian Fixtures (Real Law Scenarios) */}
        {activeTab === 'synthetic' && (
          <div className="mt-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-700">
                  {language === 'hi'
                    ? 'वास्तविक भारतीय कानूनी नोटिस के नमूने (त्वरित परीक्षण):'
                    : language === 'mr'
                    ? 'वास्तविक भारतीय कायदेशीर नोटीसचे नमुने (त्वरित चाचणी):'
                    : 'Authentic Indian Legal Notice Scenarios (Click to test instantly):'}
                </p>
                <AnimatedTooltip
                  content={t(
                    'tipSampleCases',
                    'Click any real Indian legal scenario to see an instant demonstration without uploading personal files.'
                  )}
                  title={language === 'hi' ? 'नमूना केस' : language === 'mr' ? 'नमुना केस' : 'Sample Cases'}
                />
              </div>

              <span className="text-[11px] font-bold text-amber-800">
                {SYNTHETIC_FIXTURES.length} Scenarios Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SYNTHETIC_FIXTURES.map((fixture) => (
                <button
                  key={fixture.id}
                  onClick={() => onSyntheticFixtureSelected(fixture)}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 text-left transition-all flex flex-col justify-between group relative shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                        {fixture.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        {fixture.targetExpectedPiiCount} PII fields
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-amber-800 mb-1">
                      {fixture.subtitle}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {fixture.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-800">
                    <span>
                      {language === 'hi' ? 'यह नोटिस लोड करें' : language === 'mr' ? 'ही नोटीस लोड करा' : 'Load This Notice'}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: File Upload (PDF / Image) */}
        {activeTab === 'upload' && (
          <div className="mt-5 space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-amber-500 bg-amber-50/50'
                  : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp,text/plain"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="w-14 h-14 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                <Upload className="w-7 h-7" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {t('dragDropText', 'Drop Court Notice, Summons, or Tenancy Document Here')}
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                Supports PDF, JPG, PNG scanned court summons or advocate demand letters. Evaluated securely inside your browser.
              </p>

              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <FileSearch className="w-4 h-4" />
                <span>{t('chooseFileBtn', 'Choose File from Device')}</span>
              </button>
            </div>

            {/* Mobile / Laptop Camera Scan Option */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 shadow-xs cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-700" />
                <span>{t('takePhotoBtn', 'Scan / Take Photo of Physical Paper')}</span>
              </button>

              <AnimatedTooltip
                content={t(
                  'tipCamera',
                  'Snap a clear photo of your paper notice using your phone or laptop camera.'
                )}
                title={language === 'hi' ? 'कैमरा स्कैन' : language === 'mr' ? 'कॅमेरा स्कॅन' : 'Camera Scan'}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Paste Notice Text */}
        {activeTab === 'paste' && (
          <form onSubmit={handlePastedSubmit} className="mt-5 space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {language === 'hi'
                    ? 'कानूनी नोटिस या समन का टेक्स्ट पेस्ट करें'
                    : language === 'mr'
                    ? 'कायदेशीर नोटीस किंवा समन्सचा मजकूर पेस्ट करा'
                    : 'Paste Legal Notice / Summons Text'}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pastedText.length} characters
                </span>
              </div>

              <textarea
                rows={7}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={t(
                  'pastePlaceholder',
                  'Paste text from legal notice, summons, or WhatsApp message here...'
                )}
                className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {language === 'hi'
                  ? 'कम से कम 15 अक्षर आवश्यक'
                  : language === 'mr'
                  ? 'किमान १५ अक्षरे आवश्यक'
                  : 'Minimum 15 characters required'}
              </span>

              <button
                type="submit"
                disabled={pastedText.trim().length < 15 || isProcessing}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('analyzeTextBtn', 'Analyze Document Locally')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </section>
    </motion.div>
  );
};
