/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Camera,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../services/i18n';

interface IntakeWalkthroughOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onSelectSampleCase?: () => void;
}

export const IntakeWalkthroughOverlay: React.FC<IntakeWalkthroughOverlayProps> = ({
  isOpen,
  onClose,
  language,
  onSelectSampleCase
}) => {
  const [currentGuideStep, setCurrentGuideStep] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  // Stop speech synthesis on close or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const steps = [
    {
      step: 1,
      title: t('guideStep1Title'),
      desc: t('guideStep1Desc'),
      icon: Scale,
      highlight: language === 'hi' ? 'महाराष्ट्र / दिल्ली / केंद्रीय कानून' : language === 'mr' ? 'महाराष्ट्र / दिल्ली / केंद्रीय कायदे' : 'State Court vs Central Act Rules',
      tip: language === 'hi'
        ? 'कोर्ट नोटिस में ऊपर लिखी अदालत का राज्य चुनें (उदा. पुणे कोर्ट = महाराष्ट्र)।'
        : language === 'mr'
        ? 'नोटीस कोणत्या कोर्टातून आली आहे ते राज्य निवडा (उदा. पुणे = महाराष्ट्र).'
        : 'Choose the Indian state matching the court/advocate heading on your notice paper.'
    },
    {
      step: 2,
      title: t('guideStep2Title'),
      desc: t('guideStep2Desc'),
      icon: Camera,
      highlight: language === 'hi' ? 'फोटो, पीडीएफ या टेक्स्ट' : language === 'mr' ? 'फोटो, पीडीएफ किंवा मजकूर' : 'Upload, Camera or WhatsApp Text',
      tip: language === 'hi'
        ? 'यदि आपके पास कागज़ का नोटिस है, तो "फोटो खींचें / स्कैन करें" बटन दबाएं।'
        : language === 'mr'
        ? 'कागदावरील नोटीस असल्यास "फोटो काढा / स्कॅन करा" बटणावर क्लिक करा.'
        : 'If you received a physical paper notice, simply tap "Scan / Take Photo" with your mobile camera.'
    },
    {
      step: 3,
      title: t('guideStep3Title'),
      desc: t('guideStep3Desc'),
      icon: ShieldCheck,
      highlight: language === 'hi' ? '100% गोपनीय — डिवाइस में ही सुरक्षित' : language === 'mr' ? '१००% गोपनीय — सुरक्षित प्रक्रिया' : 'Zero Cloud Uploads • Instant PII Masking',
      tip: language === 'hi'
        ? 'आधार नंबर, फोन नंबर और नाम आपके फोन में ही काले बॉक्स से छिपा दिए जाते हैं।'
        : language === 'mr'
        ? 'आधार क्रमांक, मोबाईल नंबर आणि नाव आपल्या फोनमध्येच सुरक्षितपणे लपवले जाते.'
        : 'Your Aadhaar, PAN, and personal address are masked on your device before any reading occurs.'
    },
    {
      step: 4,
      title: t('guideStep4Title'),
      desc: t('guideStep4Desc'),
      icon: FileCheck2,
      highlight: language === 'hi' ? '15 या 30 दिन की अंतिम तिथियां' : language === 'mr' ? '१५ किंवा ३० दिवसांची कायदेशीर मुदत' : '15-Day or 30-Day Critical Timelines',
      tip: language === 'hi'
        ? 'आपको स्पष्ट चेकलिस्ट मिलेगी कि वकील को क्या जवाब देना है और मुफ्त नालसा 15100 सहायता कैसे लें।'
        : language === 'mr'
        ? 'आपल्याला संपूर्ण चेकलिस्ट मिळेल — वकिलास काय उत्तर द्यावे आणि मोफत विधी सेवा कशी घ्यावी.'
        : 'Get a clear checklist of what to reply, when to reply, and direct contact to free NALSA Legal Aid (15100).'
    }
  ];

  const active = steps[currentGuideStep - 1];

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${active.title}. ${active.desc}. ${active.tip}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9; // Friendly, slower rate for older citizens

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isOpen) return null;

  const ActiveIcon = active.icon;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header with Tricolor accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-200 to-emerald-600" />

        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>{t('seniorGuideTitle')}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {language === 'hi' ? 'सरल मार्गदर्शन' : language === 'mr' ? 'सुलभ मदत' : 'Senior Friendly'}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'आसान 4 चरणों में कानूनी नोटिस समझना सीखें'
                  : language === 'mr'
                  ? '४ सोप्या टप्प्यांत कायदेशीर नोटीस समजून घ्या'
                  : 'Learn how to analyze your notice paper in 4 clear steps'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isSpeaking ? t('stopAudio') : t('listenAudio')}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isSpeaking ? t('stopAudio') : t('listenAudio')}
              </span>
            </button>

            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span>
              {t('navStepOf')} {currentGuideStep} {t('navOf')} 4
            </span>
            <span className="text-amber-700 font-semibold">{active.highlight}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setCurrentGuideStep(s.step);
                }}
                className={`h-2 rounded-full transition-all ${
                  s.step === currentGuideStep
                    ? 'bg-amber-500 ring-2 ring-amber-200'
                    : s.step < currentGuideStep
                    ? 'bg-emerald-600'
                    : 'bg-slate-200'
                }`}
                title={`Step ${s.step}`}
              />
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {active.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {active.desc}
              </p>
            </div>
          </div>

          {/* Citizen Friendly Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
            <p className="text-xs font-bold flex items-center gap-1.5 text-amber-800">
              <span>💡</span>
              <span>
                {language === 'hi' ? 'नागरिक सलाह' : language === 'mr' ? 'नागरिक सल्ला' : 'Citizen Tip'}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {active.tip}
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (currentGuideStep > 1) {
                if (isSpeaking) window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setCurrentGuideStep(currentGuideStep - 1);
              }
            }}
            disabled={currentGuideStep === 1}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentGuideStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('prevGuideStep')}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentGuideStep < 4 ? (
              <button
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setCurrentGuideStep(currentGuideStep + 1);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all hover:translate-x-0.5"
              >
                <span>{t('nextGuideStep')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  onClose();
                  if (onSelectSampleCase) onSelectSampleCase();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('closeGuide')}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
