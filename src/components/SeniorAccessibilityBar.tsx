/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BookOpen, Sparkles, X, HeartHandshake } from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';

interface SeniorAccessibilityBarProps {
  language: SupportedLanguage;
  fontSize: FontSizeLevel;
  onFontSizeChange: (size: FontSizeLevel) => void;
  textToRead?: string;
}

export const SeniorAccessibilityBar: React.FC<SeniorAccessibilityBarProps> = ({
  language,
  fontSize,
  onFontSizeChange,
  textToRead
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const cleanText = textToRead || (
      language === 'hi'
        ? 'यह न्याय मित्र का सरल कानूनी सारांश है। अपने दस्तावेज़ को कोर्ट में सत्यापित करवाएं।'
        : language === 'mr'
        ? 'हे न्याय मित्रचे सोपे कायदेशीर सारांश आहे. कोर्टात किंवा वकिलांकडून पडताळणी करून घ्या.'
        : 'This is Nyaya Mitra legal document summary. Please verify all dates with the court.'
    );

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9; // slightly slower for high clarity

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const glossaryItems = [
    {
      term: 'Vakalatnama (वकालतनामा / वकिलीपत्र)',
      en: 'A legal document authorizing an advocate to represent you in court and file papers on your behalf.',
      hi: 'एक कानूनी अधिकार पत्र, जिस पर हस्ताक्षर करके आप अपने वकील को कोर्ट में आपकी ओर से बोलने और पैरवी करने का अधिकार देते हैं।',
      mr: 'आपल्या वकिलाला कोर्टात आपल्या वतीने बाजू मांडण्याचा कायदेशीर अधिकार देणारे अधिकृत पत्र.'
    },
    {
      term: 'Summons (समन / समन्स)',
      en: 'An official call from the court ordering the defendant to appear or submit a defense in writing.',
      hi: 'अदालत का आधिकारिक बुलावा पत्र, जिसमें आपको कोर्ट में पेश होने या 30 दिन में जवाब दाखिल करने का आदेश होता है।',
      mr: 'कोर्टाचे अधिकृत बोलावणे, ज्यामध्ये हजर राहून किंवा लेखी जबाब दाखल करण्याचे आदेश असतात.'
    },
    {
      term: 'Ex-Parte (एकतरफा फैसला / एकतर्फी हुकूमनामा)',
      en: 'A court decision passed in the absence of one party because they failed to appear after summons were served.',
      hi: 'जब समन मिलने के बाद भी कोई कोर्ट में नहीं जाता, तो जज दूसरी पार्टी की अनुपस्थिति में एकतरफा फैसला सुना देते हैं।',
      mr: 'समन्स मिळूनही हजर न राहिल्यास कोर्टाने दुसऱ्या बाजूची अनुपस्थिती गृहीत धरून दिलेला एकतर्फी निकाल.'
    },
    {
      term: 'Written Statement - W.S. (लिखित जवाब / लेखी जबाब)',
      en: 'Your formal written reply answering each point of the lawsuit paragraph-by-paragraph.',
      hi: 'दावे के हर आरोप का सिलसिलेवार लिखित उत्तर, जो समन मिलने के 30 दिनों के भीतर कोर्ट में दाखिल किया जाता है।',
      mr: 'दाव्यातील प्रत्येक आरोपाला मुद्देसूद उत्तर देणारा लेखी जबाब, जो ३० दिवसांत कोर्टात सादर करायचा असतो.'
    },
    {
      term: 'Section 138 NI Act (चेक बाउंस कानून)',
      en: 'Law dealing with dishonour of cheques due to insufficient funds, giving a strict 15-day payment window.',
      hi: 'खाते में पैसे न होने पर चेक बाउंस का कानून। इसमें नोटिस मिलने के 15 दिनों के भीतर भुगतान करने का मौका मिलता है।',
      mr: 'खात्यात पैसे नसल्याने धनादेश परत जाण्याचा कायदा; यात नोटीस मिळाल्यापासून १५ दिवसांत पैसे भरण्याची मुभा असते.'
    },
    {
      term: 'NALSA 15100 (मुफ्त कानूनी सहायता)',
      en: 'National Legal Services Authority helpline providing 100% free lawyer support for eligible citizens.',
      hi: 'राष्ट्रीय विधिक सेवा प्राधिकरण का मुफ्त हेल्पलाइन नंबर (15100), जहां महिलाओं और कम आय वालों को मुफ्त वकील मिलता है।',
      mr: 'राष्ट्रीय विधी सेवा प्राधिकरणाचा मोफत हेल्पलाइन नंबर (१५१००), जेथे पात्र नागरिकांना मोफत वकील दिला जातो.'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-800">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <span>
              {language === 'hi'
                ? 'बुजुर्गों और युवाओं हेतु सुगम सहायता'
                : language === 'mr'
                ? 'ज्येष्ठ नागरिक व तरुण मित्रांसाठी सुलभ पर्याय'
                : 'Senior Citizen & Youth Accessibility'}
            </span>
            <span className="text-[10px] font-semibold bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded">
              🇮🇳 भारत
            </span>
          </span>
          <p className="text-[11px] text-amber-800">
            {language === 'hi'
              ? 'आवाज़ में सुनें, फॉन्ट आकार बदलें या कठिन कानूनी शब्दों का सरल अर्थ समझें'
              : language === 'mr'
              ? 'मजकूर ऐका, अक्षरांचा आकार वाढवा किंवा कठीण शब्दांचे सोपे अर्थ पहा'
              : 'Listen to narration, adjust text size, or view simple legal terms glossary'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Listen Audio Button */}
        <button
          onClick={handleToggleSpeech}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
            isPlaying
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-300'
          }`}
          title="Audio read aloud"
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-700" />}
          <span>
            {isPlaying
              ? language === 'hi' ? 'आवाज़ रोकें' : language === 'mr' ? 'आवाज थांबवा' : 'Stop Audio'
              : language === 'hi' ? 'आवाज़ में सुनें' : language === 'mr' ? 'मराठीत ऐका' : 'Listen Aloud'}
          </span>
        </button>

        {/* Font Size Adjuster (A- / A / A+) */}
        <div className="inline-flex rounded-xl bg-white border border-amber-300 p-0.5 shadow-xs">
          <button
            onClick={() => onFontSizeChange('normal')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
              fontSize === 'normal' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-amber-50'
            }`}
            title="Standard font size"
          >
            A-
          </button>
          <button
            onClick={() => onFontSizeChange('large')}
            className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-all ${
              fontSize === 'large' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-amber-50'
            }`}
            title="Medium font size"
          >
            A
          </button>
          <button
            onClick={() => onFontSizeChange('xlarge')}
            className={`px-2.5 py-1 text-base font-bold rounded-lg transition-all ${
              fontSize === 'xlarge' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-amber-50'
            }`}
            title="Extra large font size (best for seniors)"
          >
            A+
          </button>
        </div>

        {/* Saral Bhasha Glossary Button */}
        <button
          onClick={() => setShowGlossary(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>
            {language === 'hi' ? 'सरल शब्दकोश' : language === 'mr' ? 'सोपी भाषा शब्दकोश' : 'Saral Bhasha Guide'}
          </span>
        </button>
      </div>

      {/* Simple Legal Terms Modal */}
      {showGlossary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'hi'
                      ? 'सरल भाषा मार्गदर्शिका (कठिन कानूनी शब्दों का अर्थ)'
                      : language === 'mr'
                      ? 'सोपी भाषा मार्गदर्शक (कठीण कायदेशीर शब्दांचे अर्थ)'
                      : 'Saral Bhasha — Plain Indian Legal Terms'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'hi'
                      ? 'भारतीय अदालतों में उपयोग होने वाले शब्दों का सीधा अर्थ'
                      : language === 'mr'
                      ? 'भारतीय न्यायालयांमधील शब्दांचे थेट व सोपे अर्थ'
                      : 'Everyday explanations of court terms for citizens of all ages'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGlossary(false)}
                className="p-1.5 rounded-full hover:bg-white text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5">
              {glossaryItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-indigo-900 mb-1">{item.term}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {language === 'hi' ? item.hi : language === 'mr' ? item.mr : item.en}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowGlossary(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                {language === 'hi' ? 'समझ गया, बंद करें' : language === 'mr' ? 'समजले, बंद करा' : 'Got it, Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
