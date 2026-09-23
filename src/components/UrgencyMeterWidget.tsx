/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';
import { DocumentTypeId } from '../types/navigator';

interface UrgencyMeterWidgetProps {
  escalation: 'none' | 'soon' | 'urgent';
  documentType: DocumentTypeId;
  language: SupportedLanguage;
}

export const UrgencyMeterWidget: React.FC<UrgencyMeterWidgetProps> = ({
  escalation,
  documentType,
  language
}) => {
  // Determine meter score from 0 to 100
  let score = 25;
  let angle = -60; // range: -90 (low) to +90 (critical)
  let levelColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let badgeText = 'Standard Procedural Notice';
  let deadlineNote = 'Standard review window';

  if (escalation === 'urgent') {
    score = documentType === 'cheque_bounce_138' ? 95 : 85;
    angle = 65;
    levelColor = 'text-rose-700 bg-rose-50 border-rose-200';
    if (documentType === 'cheque_bounce_138') {
      badgeText = language === 'hi'
        ? 'अत्यंत तात्कालिक — सख्त 15 दिन की सीमा'
        : language === 'mr'
        ? 'अत्यंत तातडीचे — कठोर १५ दिवसांची कालमर्यादा'
        : 'Critical Urgency — Strict 15-Day Statutory Window';
      deadlineNote = language === 'hi'
        ? 'एनआई एक्ट धारा 138 के तहत नोटिस मिलने के 15 दिनों में भुगतान आवश्यक है।'
        : language === 'mr'
        ? 'एनआय अ‍ॅक्ट कलम १३८ अंतर्गत नोटीस मिळाल्यापासून १५ दिवसांत रक्कम देणे आवश्यक.'
        : 'Under Section 138 NI Act, reply or payment is required within 15 days of notice receipt.';
    } else if (documentType === 'civil_summons_cpc') {
      badgeText = language === 'hi'
        ? 'कोर्ट समन — 30 दिन में लिखित जवाब (W.S.)'
        : language === 'mr'
        ? 'कोर्ट समन्स — ३० दिवसांत लेखी जबाब (W.S.)'
        : 'Court Summons — 30-Day Written Statement Deadline';
      deadlineNote = language === 'hi'
        ? 'सीपीसी ऑर्डर 8 के तहत कोर्ट में उपस्थित हों या 30 दिनों में लिखित उत्तर दाखिल करें।'
        : language === 'mr'
        ? 'सीपीसी ऑर्डर ८ नुसार कोर्टात हजर राहा किंवा ३० दिवसांत लेखी उत्तर दाखल करा.'
        : 'Order 8 Rule 1 CPC requires filing defense (Written Statement) within 30 days of service.';
    } else {
      badgeText = language === 'hi' ? 'उच्च तात्कालिकता' : language === 'mr' ? 'उच्च निकड' : 'High Priority Notice';
      deadlineNote = language === 'hi' ? 'तुरंत विधिक सलाह आवश्यक' : language === 'mr' ? 'त्वरित कायदेशीर सल्ला आवश्यक' : 'Immediate legal aid advice recommended.';
    }
  } else if (escalation === 'soon') {
    score = 55;
    angle = 0;
    levelColor = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeText = language === 'hi'
      ? 'मध्यम तात्कालिकता — 15 से 30 दिन का समय'
      : language === 'mr'
      ? 'मध्यम निकड — १५ ते ३० दिवसांचा अवधी'
      : 'Moderate Urgency — 15 to 30 Day Response Window';
    deadlineNote = language === 'hi'
      ? 'वकील के माध्यम से औपचारिक लिखित उत्तर (Reply Notice) भेजना उचित है।'
      : language === 'mr'
      ? 'वकिलामार्फत अधिकृत लेखी उत्तर (Reply Notice) पाठवणे हिताचे राहील.'
      : 'Sending a formal reply notice via an advocate or DLSA within the granted period is advised.';
  } else {
    score = 20;
    angle = -55;
    badgeText = language === 'hi' ? 'सामान्य जानकारी' : language === 'mr' ? 'सर्वसाधारण माहिती' : 'Informational / Standard Notice';
    deadlineNote = language === 'hi' ? 'कोई आपातकालीन कोर्ट तारीख नहीं' : language === 'mr' ? 'कोणतीही तातडीची कोर्ट तारीख नाही' : 'No immediate court appearance detected.';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Background visual motif */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/5 to-rose-500/5 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left: Interactive Speedometer Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-44 h-24 flex items-end justify-center">
            {/* SVG Arc Gauge */}
            <svg viewBox="0 0 200 110" className="w-44 h-24 overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Background track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Gradient active track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                className="transition-all duration-1000 ease-out"
              />

              {/* Center pivot */}
              <circle cx="100" cy="100" r="7" fill="#1e293b" />
            </svg>

            {/* Animated Needle */}
            <motion.div
              className="absolute bottom-0 w-1.5 h-16 bg-slate-900 rounded-full origin-bottom shadow-md"
              initial={{ rotate: -80 }}
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 90, damping: 14 }}
              style={{ left: 'calc(50% - 3px)' }}
            />
          </div>

          <div className="flex justify-between w-40 text-[11px] font-semibold text-slate-500 mt-2 px-1">
            <span className="text-emerald-600">
              {language === 'hi' ? 'सामान्य' : language === 'mr' ? 'नियमित' : 'Standard'}
            </span>
            <span className="text-amber-600">
              {language === 'hi' ? 'महत्वपूर्ण' : language === 'mr' ? 'महत्त्वाचे' : 'Moderate'}
            </span>
            <span className="text-rose-600">
              {language === 'hi' ? 'तातडीचे / समन' : language === 'mr' ? 'तातडीचे / समन्स' : 'Critical'}
            </span>
          </div>
        </div>

        {/* Right: Explanatory Card */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${levelColor}`}
            >
              {escalation === 'urgent' ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : escalation === 'soon' ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {badgeText}
            </span>
          </div>

          <p className="text-sm text-slate-700 font-medium leading-relaxed mb-2">
            {deadlineNote}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
              🇮🇳 Indian Civil & Tenancy Law
            </span>
            <span>•</span>
            <span>NALSA Free Legal Aid: <strong>15100</strong></span>
            <span>•</span>
            <span>eCourts: <strong>services.ecourts.gov.in</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
