/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MailCheck, SearchCheck, Hourglass, Scale, Gavel, ChevronRight, Info } from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';
import { DocumentTypeId } from '../types/navigator';

interface LegalProcedureTimelineWidgetProps {
  documentType: DocumentTypeId;
  language: SupportedLanguage;
}

interface StepInfo {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  shortDescEn: string;
  shortDescHi: string;
  shortDescMr: string;
  fullDetailsEn: string;
  fullDetailsHi: string;
  fullDetailsMr: string;
  isUrgentStage?: boolean;
}

export const LegalProcedureTimelineWidget: React.FC<LegalProcedureTimelineWidgetProps> = ({
  documentType,
  language
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // default highlight on statutory window

  const isCheque = documentType === 'cheque_bounce_138';
  const isSummons = documentType === 'civil_summons_cpc';

  const steps: StepInfo[] = [
    {
      id: 1,
      icon: MailCheck,
      titleEn: '1. Receipt & Envelope Date',
      titleHi: '1. नोटिस प्राप्ति व लिफाफा तारीख',
      titleMr: '१. नोटीस मिळाल्याची व पाकिटावरील तारीख',
      shortDescEn: 'Preserve Registered Post / Speed Post envelope',
      shortDescHi: 'स्पीड पोस्ट या रजिस्टर्ड डाक का लिफाफा संभाल कर रखें',
      shortDescMr: 'स्पीड पोस्ट किंवा पाकिटाचा ट्रॅकिंग नंबर सुरक्षित ठेवा',
      fullDetailsEn: 'Under Indian law, limitation begins strictly from the date of physical receipt or electronic delivery tick, not from the date typed at the top of the notice. Preserve the postal envelope showing the tracking number.',
      fullDetailsHi: 'भारतीय कानून में समय सीमा (Limitation) नोटिस मिलने की वास्तविक तारीख से शुरू होती है, नोटिस पर छपी तारीख से नहीं। स्पीड पोस्ट का लिफाफा कोर्ट में सबसे बड़ा सबूत होता है।',
      fullDetailsMr: 'भारतीय कायद्यानुसार नोटीस प्रत्यक्षात मिळाल्याच्या दिवसापासून कालमर्यादा सुरू होते. टपालाचे पाकीट आणि ट्रॅकिंग बारकोड कोर्टात महत्वाचा पुरावा ठरतो.'
    },
    {
      id: 2,
      icon: SearchCheck,
      titleEn: '2. Verify on eCourts Portal',
      titleHi: '2. ई-कोर्ट पोर्टल पर सत्यापन',
      titleMr: '२. ई-कोर्ट्स पोर्टलवर पडताळणी',
      shortDescEn: 'Check 16-character CNR Number on services.ecourts.gov.in',
      shortDescHi: 'CNR नंबर से आधिकारिक केस स्थिति जांचें',
      shortDescMr: 'CNR क्रमांकावरून खटल्याची अधिकृत स्थिती तपासा',
      fullDetailsEn: 'If this is a Court Summons, visit services.ecourts.gov.in or use the eCourts mobile app. Enter the CNR number to verify whether an actual suit has been registered and check the next hearing date.',
      fullDetailsHi: 'यदि यह कोर्ट समन है, तो services.ecourts.gov.in पर जाएं और 16 अंकों का CNR नंबर डालकर अदालत का नाम, जज और अगली सुनवाई तारीख जांचें।',
      fullDetailsMr: 'हे कोर्टाचे समन्स असल्यास services.ecourts.gov.in वर १६ अंकी CNR नंबर टाकून खटल्याची सत्यता व पुढील सुनावणी तारीख तपासा.'
    },
    {
      id: 3,
      icon: Hourglass,
      titleEn: isCheque ? '3. 15-Day NI Act Window' : isSummons ? '3. 30-Day W.S. Deadline' : '3. Statutory Response Time',
      titleHi: isCheque ? '3. 15 दिन की वैधानिक मियाद' : isSummons ? '3. 30 दिन में जवाब (W.S.)' : '3. कानूनी जवाब की समयसीमा',
      titleMr: isCheque ? '३. १५ दिवसांची कायदेशीर मुदत' : isSummons ? '३. ३० दिवसांत जबाब (W.S.)' : '३. कायदेशीर उत्तराची मुदत',
      shortDescEn: isCheque ? 'Pay or reply within 15 days of notice receipt' : isSummons ? 'File Written Statement within 30 days under CPC' : 'Act within 15-30 days before court action',
      shortDescHi: isCheque ? 'नोटिस मिलने के 15 दिनों में उत्तर या भुगतान करें' : isSummons ? 'सीपीसी के तहत 30 दिनों में लिखित जवाब दाखिल करें' : '15 से 30 दिनों में वकील द्वारा जवाब भेजें',
      shortDescMr: isCheque ? 'नोटीस मिळाल्यापासून १५ दिवसांत रक्कम द्या किंवा उत्तर पाठवा' : isSummons ? 'सीपीसी अंतर्गत ३० दिवसांत लेखी उत्तर दाखल करा' : '१५ ते ३० दिवसांत वकिलामार्फत उत्तर द्या',
      fullDetailsEn: isCheque
        ? 'Section 138 of Negotiable Instruments Act grants exactly 15 days to tender payment. After 15 days, the complainant can file a criminal complaint in Magistrate Court within 30 days.'
        : isSummons
        ? 'Order 8 Rule 1 of Code of Civil Procedure (CPC) 1908 requires filing your Written Statement within 30 days of receiving court summons to prevent an ex-parte order.'
        : 'Do not ignore the legal notice. Sending a timely formal reply through an advocate establishes your defense on the legal record.',
      fullDetailsHi: isCheque
        ? 'चेक बाउंस होने पर 15 दिन का समय मिलता है। 15 दिन पूरे होने के बाद ही शिकायतकर्ता मजिस्ट्रेट कोर्ट में केस दर्ज कर सकता है।'
        : isSummons
        ? 'समन मिलने के 30 दिनों के भीतर जवाब (Written Statement) दाखिल करना अनिवार्य है, अन्यथा अदालत एकतरफा फैसला सुना सकती है।'
        : 'कानूनी नोटिस को कभी नजरअंदाज न करें। निर्धारित समय में वकील द्वारा लिखित उत्तर भेजने से आपका पक्ष सुरक्षित रहता है।',
      fullDetailsMr: isCheque
        ? 'चेक बाऊन्स झाल्यास १५ दिवसांची कठोर मुदत असते. १५ दिवस संपल्यावरच तक्रारदार कोर्टात फौजदारी खटला दाखल करू शकतो.'
        : isSummons
        ? 'समन्स मिळाल्यापासून ३० दिवसांत लेखी जबाब दाखल करणे आवश्यक आहे, अन्यथा कोर्ट एकतर्फी हुकूमनामा काढू शकते.'
        : 'कायदेशीर नोटीस दुर्लक्षित करू नका. वेळेत लेखी उत्तर दिल्यास आपला कायदेशीर हक्क सुरक्षित राहतो.',
      isUrgentStage: true
    },
    {
      id: 4,
      icon: Scale,
      titleEn: '4. Free Legal Aid (NALSA / DLSA)',
      titleHi: '4. मुफ्त सरकारी कानूनी सहायता (नालसा)',
      titleMr: '४. मोफत विधी सेवा (NALSA / DLSA)',
      shortDescEn: 'Call Toll-Free 15100 or visit District Court DLSA Clinic',
      shortDescHi: 'टोल-फ्री 15100 डायल करें या कोर्ट में DLSA से मिलें',
      shortDescMr: 'टोल-फ्री १५१०० वर कॉल करा किंवा कोर्टातील DLSA केंद्रात जा',
      fullDetailsEn: 'Under Section 12 of the Legal Services Authorities Act 1987, all women, senior citizens, and individuals earning under ₹3 Lakhs/year are entitled to 100% free advocate representation and court fee waivers.',
      fullDetailsHi: 'विधिक सेवा प्राधिकरण कानून 1987 की धारा 12 के तहत सभी महिलाएं, वरिष्ठ नागरिक और ₹3 लाख से कम आय वाले नागरिक मुफ्त सरकारी वकील के हकदार हैं।',
      fullDetailsMr: 'विधी सेवा प्राधिकरण कायदा १९८७ च्या कलम १२ नुसार सर्व महिला, ज्येष्ठ नागरिक आणि ३ लाख रुपयांपेक्षा कमी उत्पन्न असणाऱ्या नागरिकांना मोफत वकिलाची मदत मिळते.'
    },
    {
      id: 5,
      icon: Gavel,
      titleEn: '5. Court Appearance / Resolution',
      titleHi: '5. अदालत में उपस्थिति / निपटारा',
      titleMr: '५. कोर्टात हजेरी / तडजोड',
      shortDescEn: 'Sign Vakalatnama or explore Lok Adalat mediation',
      shortDescHi: 'वकालतनामा पर हस्ताक्षर करें या लोक अदालत में सुलह करें',
      shortDescMr: 'वकालतनाम्यावर सही करा किंवा लोकअदालतीत तडजोड करा',
      fullDetailsEn: 'Authorize your advocate via a signed Vakalatnama. For civil disputes and cheque cases, compoundable settlement or pre-litigation Lok Adalat mediation can resolve matters peacefully without penalties.',
      fullDetailsHi: 'अपने वकील को अधिकृत करने के लिए वकालतनामा पर हस्ताक्षर करें। चेक मामलों में लोक अदालत या आपसी समझौते से विवाद बिना सजा के सुलझाया जा सकता है।',
      fullDetailsMr: 'आपल्या वकिलाला अधिकृत करण्यासाठी वकालतनाम्यावर स्वाक्षरी करा. धनादेश व दिवाणी वाद लोकअदालतीत किंवा तडजोडीने शांततेत मिटवता येतात.'
    }
  ];

  return (
    <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Hourglass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {language === 'hi'
                ? 'भारतीय कानूनी प्रक्रिया की समयरेखा'
                : language === 'mr'
                ? 'भारतीय कायदेशीर प्रक्रियेची कालमर्यादा'
                : 'Indian Legal Procedure Timeline'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'प्रत्येक चरण पर क्लिक करके आसान भाषा में समझें'
                : language === 'mr'
                ? 'प्रत्येक टप्प्यावर क्लिक करून सोप्या भाषेत माहिती वाचा'
                : 'Click any step to understand your procedural rights'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          🇮🇳 Code of Civil Procedure & NI Act
        </span>
      </div>

      {/* Steps Track */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;
          const title = language === 'hi' ? step.titleHi : language === 'mr' ? step.titleMr : step.titleEn;
          const shortDesc = language === 'hi' ? step.shortDescHi : language === 'mr' ? step.shortDescMr : step.shortDescEn;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : step.isUrgentStage
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {step.isUrgentStage && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                      {language === 'hi' ? 'महत्वपूर्ण' : language === 'mr' ? 'महत्त्वाचे' : 'Key Deadline'}
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-bold text-slate-800 leading-snug mb-1">{title}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{shortDesc}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center text-[10px] font-semibold text-indigo-600">
                <span>{language === 'hi' ? 'विवरण देखें' : language === 'mr' ? 'तपशील वाचा' : 'View Guide'}</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Active Step Guide Box */}
      <AnimatePresence mode="wait">
        {steps.map((step) => {
          if (step.id !== activeStep) return null;
          const Icon = step.icon;
          const title = language === 'hi' ? step.titleHi : language === 'mr' ? step.titleMr : step.titleEn;
          const fullText = language === 'hi' ? step.fullDetailsHi : language === 'mr' ? step.fullDetailsMr : step.fullDetailsEn;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span>{title}</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({language === 'hi' ? 'भारतीय कानून प्रक्रिया' : language === 'mr' ? 'भारतीय कायदा प्रक्रिया' : 'Indian Statutory Procedure'})
                  </span>
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">{fullText}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
