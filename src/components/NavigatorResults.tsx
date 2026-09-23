/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Calendar,
  HelpCircle,
  CheckSquare,
  Square,
  ExternalLink,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Phone,
  BookmarkCheck,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { NavigatorResult, NextStepItem, DateToVerify, DocumentTypeId } from '../types/navigator';
import { UrgentEscalationCard } from './UrgentEscalationCard';
import { UrgencyMeterWidget } from './UrgencyMeterWidget';
import { LegalProcedureTimelineWidget } from './LegalProcedureTimelineWidget';
import { SeniorAccessibilityBar, FontSizeLevel } from './SeniorAccessibilityBar';
import { AccessibilityExport } from './AccessibilityExport';
import { SupportedLanguage, getTranslation } from '../services/i18n';

interface NavigatorResultsProps {
  results: NavigatorResult;
  documentType: DocumentTypeId;
  onOpenPrintModal: () => void;
  onToggleStepCompleted: (stepId: string) => void;
  onSaveAssessment: () => void;
  isSaved: boolean;
  language: SupportedLanguage;
  fontSize: FontSizeLevel;
  onFontSizeChange: (size: FontSizeLevel) => void;
  onOpenWhyNotAiModal?: () => void;
}

export const NavigatorResults: React.FC<NavigatorResultsProps> = ({
  results,
  documentType,
  onOpenPrintModal,
  onToggleStepCompleted,
  onSaveAssessment,
  isSaved,
  language,
  fontSize,
  onFontSizeChange,
  onOpenWhyNotAiModal
}) => {
  const [showAllSources, setShowAllSources] = useState(false);
  const t = (key: string) => getTranslation(language, key);

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-normal';

  const handleDownloadTextSummary = () => {
    const textLines = [
      '====================================================',
      ' NYAYA MITRA (न्याय मित्र) — CONFIRMED LEGAL SUMMARY',
      '====================================================',
      `Generated: ${new Date(results.generationTimestamp).toLocaleString('en-IN')}`,
      `Statutory Framework: Indian Civil & Tenancy Law`,
      `Processing Mode: ${results.aiAssisted ? 'Sanitized AI Assisted' : 'Deterministic Statutory Engine'}`,
      '',
      '1. WHAT THIS DOCUMENT APPEARS TO SAY:',
      results.explanation,
      '',
      '2. DATES TO VERIFY WITH COURT / SPEED POST RECORD:',
      ...results.datesToVerify.map(
        d => ` - ${d.dateText}: ${d.context}\n   Advisory: ${d.verificationAdvisory}`
      ),
      '',
      '3. KEY UNKNOWNS REQUIRING VERIFICATION:',
      ...results.unknowns.map(u => ` - ${u}`),
      '',
      '4. RECOMMENDED PROCEDURAL NEXT STEPS:',
      ...results.nextSteps.map(
        (s, i) => ` [${s.completed ? 'X' : ' '}] ${i + 1}. ${s.step}\n      ${s.explanation}`
      ),
      '',
      '5. OFFICIAL STATUTORY SOURCES & PORTALS:',
      ...results.citations.map(
        c => ` - ${c.title} (${c.sourceType})\n   URL: ${c.url} | Last checked: ${c.lastChecked}`
      ),
      '',
      '6. FREE LEGAL AID REFERRALS:',
      ...results.officialContacts.map(
        con => ` - ${con.name} (${con.type})\n   Phone: ${con.phone} | ${con.hours}`
      ),
      '',
      '----------------------------------------------------',
      'DISCLAIMER: Nyaya Mitra provides legal information, not legal representation. Always verify dates and proceedings directly with the court docket or an empaneled legal aid advocate at DLSA.'
    ];

    const blob = new Blob([textLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nyaya-mitra-assessment-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isUrgent = results.escalation === 'urgent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Senior & Youth Accessibility Bar */}
      <SeniorAccessibilityBar
        language={language}
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        textToRead={`${results.explanation} ${results.datesToVerify.map(d => d.verificationAdvisory).join(' ')}`}
      />

      {/* Action Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>{language === 'hi' ? 'केवल कानूनी सूचना:' : language === 'mr' ? 'केवळ कायदेशीर माहिती:' : 'Informational Only:'}</strong>{' '}
            {language === 'hi'
              ? 'न्याय मित्र वकील नहीं है। यह जानकारी भारतीय कानून के अनुसार आपकी मदद के लिए है।'
              : language === 'mr'
              ? 'न्याय मित्र वकील नाही. ही माहिती भारतीय कायद्यानुसार नागरिकांच्या मदतीसाठी आहे.'
              : 'Nyaya Mitra provides informational guidance under Indian law and does not replace an advocate.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Save Assessment Button */}
          <button
            onClick={onSaveAssessment}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>
              {isSaved
                ? language === 'hi' ? 'सहेज लिया गया' : language === 'mr' ? 'जतन केले' : 'Assessment Saved'
                : language === 'hi' ? 'यह मूल्यांकन सहेजें' : language === 'mr' ? 'हे मूल्यांकन जतन करा' : 'Save This Assessment'}
            </span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printBtn')}</span>
          </button>

          <button
            onClick={handleDownloadTextSummary}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('downloadBtn')}</span>
          </button>
        </div>
      </div>

      {/* Domain Defense: Why this notice cannot be safely analyzed by a general AI chatbot */}
      {onOpenWhyNotAiModal && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="text-xs font-black text-amber-950">
                Why paste this into Nyaya Mitra instead of a normal AI assistant (like ChatGPT/Gemini)?
              </p>
              <p className="text-[11px] text-amber-800">
                100% In-Browser Privacy (zero Aadhaar/PAN leak), exact statutory limitation calculations, and direct NALSA 15100 legal aid integration.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWhyNotAiModal}
            className="px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-center"
          >
            <span>See 7 Differences</span>
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>
      )}

      {/* Interactive Speedometer & Urgency Gauge */}
      <UrgencyMeterWidget
        escalation={results.escalation}
        documentType={documentType}
        language={language}
      />

      {/* Urgent Escalation Card if high urgency */}
      {isUrgent && results.escalationReason && (
        <UrgentEscalationCard
          reason={results.escalationReason}
          primaryContact={results.officialContacts[0]}
        />
      )}

      {/* Section 1: Plain Language Document Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900" data-testid="section-what-document-says">
                {language === 'hi'
                  ? '1. यह दस्तावेज़ क्या कहता है (What This Document Says)'
                  : language === 'mr'
                  ? '१. हा दस्तऐवज काय सांगतो (What This Document Says)'
                  : '1. What This Document Says'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'भारतीय कानून के आधार पर सरल व्याख्या'
                  : language === 'mr'
                  ? 'भारतीय कायद्यावर आधारित सोपे विश्लेषण'
                  : 'Plain-language analysis grounded in Indian statutory codes'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {results.aiAssisted ? 'Sanitized AI Summary' : 'Local Statutory Rule Engine'}
          </span>
        </div>

        <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 ${fontClass}`}>
          {results.explanation}
        </div>
      </div>

      {/* Section 2: Interactive Procedural Timeline Track */}
      <LegalProcedureTimelineWidget
        documentType={documentType}
        language={language}
      />

      {/* Section 3: Dates to Verify with Court */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900" data-testid="section-dates-to-verify">
              {language === 'hi'
                ? '2. तारीखों का सत्यापन (Dates to Verify — कभी स्वतः न गिनें)'
                : language === 'mr'
                ? '२. तारखांची पडताळणी (Dates to Verify — मुदत स्वतः मोजू नका)'
                : '2. Dates to Verify (Never Silently Calculated)'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'स्पीड पोस्ट रसीद या कोर्ट समन डिलीवरी की तारीख से समयसीमा गिनी जाती है'
                : language === 'mr'
                ? 'स्पीड पोस्ट पावती किंवा समन्स प्रत्यक्ष मिळाल्याच्या दिवसापासून मुदत मोजली जाते'
                : 'Statutory limitations run strictly from service/receipt, not typed dates'}
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {results.datesToVerify.map(dateItem => (
            <div
              key={dateItem.id}
              className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-200/80 text-amber-950 font-mono">
                    {dateItem.dateText}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{dateItem.label}</span>
                </div>
                <p className="text-xs text-slate-600">{dateItem.context}</p>
                <p className="text-xs font-medium text-amber-900 mt-1">
                  ⚠️ {dateItem.verificationAdvisory}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: What Cannot Be Determined Safely (Unknowns) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900" data-testid="section-what-is-unclear">
              {language === 'hi'
                ? '3. क्या अस्पष्ट है (What Is Unclear — कागज़ात से सुरक्षित रूप से तय नहीं हो सकता)'
                : language === 'mr'
                ? '३. काय अस्पष्ट आहे (What Is Unclear — कागदपत्रांवरून ठरवता येत नाही)'
                : '3. What Is Unclear (Cannot Be Determined Safely from Text Alone)'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'ये बिंदु वकील या कोर्ट रिकॉर्ड के बिना तय नहीं किए जा सकते'
                : language === 'mr'
                ? 'हे मुद्दे वकील किंवा कोर्टाच्या रेकॉर्डशिवाय ठरवता येत नाहीत'
                : 'Crucial legal elements that require docket or factual verification'}
            </p>
          </div>
        </div>

        <ul className="space-y-2 mt-4">
          {results.unknowns.map((unknownItem, idx) => (
            <li
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 font-medium"
            >
              <span className="text-indigo-600 font-bold">•</span>
              <span>{unknownItem}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 5: Step-by-step Action Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900" data-testid="section-what-you-can-do-now">
                {language === 'hi'
                  ? '4. आप अब क्या कर सकते हैं (What You Can Do Now — चेकलिस्ट)'
                  : language === 'mr'
                  ? '४. तुम्ही आता काय करू शकता (What You Can Do Now — चेकलिस्ट)'
                  : '4. What You Can Do Now (Actionable Next Steps Checklist)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'किए गए कार्यों को टिक करें; यह आपके डिवाइस में सुरक्षित रहेगा'
                  : language === 'mr'
                  ? 'झालेली कामे टिक करा; ही नोंद आपल्या डिव्हाइसमध्ये सुरक्षित राहील'
                  : 'Check off steps as you complete them to track your legal defense'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {results.nextSteps.map((stepItem, index) => (
            <div
              key={stepItem.id}
              onClick={() => onToggleStepCompleted(stepItem.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                stepItem.completed
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-500'
                  : 'bg-slate-50 hover:bg-indigo-50/30 border-slate-200'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-hidden"
              >
                {stepItem.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs font-bold ${
                      stepItem.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {index + 1}. {stepItem.step}
                  </h4>
                  {stepItem.urgency === 'immediate' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">
                      {language === 'hi' ? 'तत्काल' : language === 'mr' ? 'तातडीने' : 'Immediate'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{stepItem.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Official Free Legal Aid & Verified Contacts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi'
                ? '5. मुफ्त सरकारी विधिक सहायता एवं आधिकारिक केंद्र'
                : language === 'mr'
                ? '५. मोफत सरकारी विधी सेवा व अधिकृत संपर्क'
                : '5. Official Free Legal Aid & Court Services'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'नालसा (NALSA) एवं जिला विधिक सेवा प्राधिकरण (DLSA) संपर्क'
                : language === 'mr'
                ? 'NALSA व जिल्हा विधी सेवा प्राधिकरण (DLSA) चे अधिकृत संपर्क'
                : 'Government verified legal services under Legal Services Authorities Act'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {results.officialContacts.map((contact, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900">{contact.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {contact.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{contact.description}</p>

                <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{contact.phone}</span>
                </div>
                <p className="text-[11px] text-slate-400">{contact.hours}</p>
              </div>

              {contact.url && (
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Export Module (WCAG Accessible Plain Text & Semantic HTML) */}
      <AccessibilityExport
        results={results}
        documentType={documentType}
        language={language}
        onPrint={onOpenPrintModal}
      />
    </motion.div>
  );
};
