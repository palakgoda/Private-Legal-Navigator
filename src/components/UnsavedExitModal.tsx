/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Save, LogIn, Trash2, ArrowLeft, X } from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';

interface UnsavedExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndLogin: () => void;
  onSaveLocally: () => void;
  onDiscardAndExit: () => void;
  language: SupportedLanguage;
}

export const UnsavedExitModal: React.FC<UnsavedExitModalProps> = ({
  isOpen,
  onClose,
  onSaveAndLogin,
  onSaveLocally,
  onDiscardAndExit,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Top visual banner */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'hi'
                  ? 'क्या आप अपना मूल्यांकन सहेजना चाहते हैं?'
                  : language === 'mr'
                  ? 'बाहेर पडण्यापूर्वी आपले मूल्यांकन जतन करायचे आहे का?'
                  : 'Save Your Legal Assessment Before Leaving?'}
              </h3>
              <p className="text-xs text-amber-100">
                {language === 'hi'
                  ? 'सक्रिय दस्तावेज़ विश्लेषण ब्राउज़र मेमोरी में मौजूद है'
                  : language === 'mr'
                  ? 'सक्रिय दस्तऐवज विश्लेषण ब्राउझर मेमरीमध्ये उपलब्ध आहे'
                  : 'You have an active document assessment in progress'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanatory Message */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            {language === 'hi'
              ? 'यदि आप सत्र बंद करते हैं, तो आपकी गोपनीयता की सुरक्षा हेतु सभी अस्थायी डेटा मिटा दिया जाएगा। क्या आप इसे अपने नागरिक खाते में सहेजना चाहते हैं?'
              : language === 'mr'
              ? 'आपण सत्र बंद केल्यास गोपनीयतेच्या रक्षणासाठी सर्व तात्पुरता डेटा नष्ट केला जाईल. आपण हे आपल्या नागरिक खात्यामध्ये सुरक्षित जतन करू इच्छिता का?'
              : 'To preserve complete privacy, in-memory legal data is wiped on exit unless you choose to save it to your citizen profile or locally on this device.'}
          </p>

          <div className="space-y-2.5">
            {/* Option 1: Save & Login */}
            <button
              onClick={onSaveAndLogin}
              className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 group-hover:text-indigo-800">
                    {language === 'hi'
                      ? 'हाँ, खाते में सहेजें (लॉग इन / साइन अप)'
                      : language === 'mr'
                      ? 'होय, खात्यात जतन करा (लॉग इन / नोंदणी)'
                      : 'Yes, Save to My Account (Sign In / Register)'}
                  </h4>
                  <p className="text-[11px] text-indigo-700">
                    {language === 'hi'
                      ? 'भविष्य में किसी भी डिवाइस से पुनः देखने हेतु'
                      : language === 'mr'
                      ? 'भविष्यात पुन्हा पाहण्यासाठी खात्यात जतन ठेवा'
                      : 'Access anytime across sessions and mobile devices'}
                  </p>
                </div>
              </div>
            </button>

            {/* Option 2: Save locally as Guest */}
            <button
              onClick={onSaveLocally}
              className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">
                    {language === 'hi'
                      ? 'इस डिवाइस पर स्थानीय रूप से सहेजें'
                      : language === 'mr'
                      ? 'या डिव्हाइसवर स्थानिकरित्या जतन करा'
                      : 'Save Locally on This Device (Guest Mode)'}
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    {language === 'hi'
                      ? 'बिना पासवर्ड के इसी ब्राउज़र में सहेजा रहेगा'
                      : language === 'mr'
                      ? 'पासवर्डशिवाय याच ब्राउझरमध्ये सुरक्षित राहील'
                      : 'Preserve on this browser without creating an account'}
                  </p>
                </div>
              </div>
            </button>

            {/* Option 3: Discard & Delete */}
            <button
              onClick={onDiscardAndExit}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-200 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 group-hover:bg-rose-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-900">
                    {language === 'hi'
                      ? 'नहीं, सब कुछ मिटाएं और बाहर निकलें'
                      : language === 'mr'
                      ? 'नको, सर्व डेटा नष्ट करा आणि बाहेर पडा'
                      : 'No, Discard & Erase Everything'}
                  </h4>
                  <p className="text-[11px] text-slate-500 group-hover:text-rose-700">
                    {language === 'hi'
                      ? 'मेमोरी से पूरा डेटा तत्काल हटा दिया जाएगा'
                      : language === 'mr'
                      ? 'मेमरीमधून सर्व माहिती त्वरित हटवली जाईल'
                      : 'Permanently wipe this session data immediately'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {language === 'hi'
                ? 'रद्द करें, दस्तावेज़ पर काम जारी रखें'
                : language === 'mr'
                ? 'रद्द करा, काम सुरू ठेवा'
                : 'Cancel, Keep Working'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
