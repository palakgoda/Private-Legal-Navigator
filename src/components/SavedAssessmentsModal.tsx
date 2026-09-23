/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookmarkCheck, Trash2, ExternalLink, Calendar, ShieldAlert, Clock, CheckCircle2, X } from 'lucide-react';
import { SavedAssessment, deleteSavedAssessment } from '../services/authService';
import { SupportedLanguage } from '../services/i18n';
import { SUPPORTED_DOCUMENT_TYPES, JURISDICTIONS } from '../services/sourceRegistry';

interface SavedAssessmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessments: SavedAssessment[];
  onLoadAssessment: (assessment: SavedAssessment) => void;
  onAssessmentDeleted: (id: string) => void;
  language: SupportedLanguage;
}

export const SavedAssessmentsModal: React.FC<SavedAssessmentsModalProps> = ({
  isOpen,
  onClose,
  assessments,
  onLoadAssessment,
  onAssessmentDeleted,
  language
}) => {
  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg =
      language === 'hi'
        ? 'क्या आप इस सहेजे गए मूल्यांकन को हटाना चाहते हैं?'
        : language === 'mr'
        ? 'आपण हे जतन केलेले मूल्यांकन हटवू इच्छिता का?'
        : 'Are you sure you want to delete this saved document assessment?';

    if (window.confirm(confirmMsg)) {
      deleteSavedAssessment(id);
      onAssessmentDeleted(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'hi'
                  ? 'मेरे सहेजे गए कानूनी दस्तावेज़'
                  : language === 'mr'
                  ? 'माझे जतन केलेले कायदेशीर दस्तऐवज'
                  : 'My Saved Document Assessments'}
              </h3>
              <p className="text-xs text-slate-300">
                {language === 'hi'
                  ? 'आपके खाते में सुरक्षित रखे गए पूर्व मूल्यांकन'
                  : language === 'mr'
                  ? 'आपल्या खात्यातील जतन केलेले पूर्वीचे मूल्यांकन'
                  : 'Review or reload previously assessed notices & summons'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {assessments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookmarkCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold text-slate-600">
                {language === 'hi'
                  ? 'कोई सहेजा गया दस्तावेज़ नहीं मिला'
                  : language === 'mr'
                  ? 'कोणताही जतन केलेला दस्तऐवज आढळला नाही'
                  : 'No saved assessments found'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'दस्तावेज़ का विश्लेषण करने के बाद "यह मूल्यांकन सहेजें" बटन पर क्लिक करके इसे अपने खाते में सुरक्षित रख सकते हैं।'
                  : language === 'mr'
                  ? 'दस्तऐवज तपासल्यानंतर "हे मूल्यांकन जतन करा" बटणावर क्लिक करून जतन करू शकता.'
                  : 'After analyzing a legal document, click "Save This Assessment" to store it securely here.'}
              </p>
            </div>
          ) : (
            assessments.map(item => {
              const docTypeConfig = SUPPORTED_DOCUMENT_TYPES[item.documentType];
              const docLabel =
                language === 'hi' && docTypeConfig?.hindiName
                  ? docTypeConfig.hindiName
                  : language === 'mr' && docTypeConfig?.marathiName
                  ? docTypeConfig.marathiName
                  : docTypeConfig?.displayName || item.documentType;

              const jurisdictionConfig = JURISDICTIONS[item.jurisdictionId];

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onLoadAssessment(item);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.urgency === 'urgent'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.urgency === 'soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.urgency === 'urgent'
                          ? language === 'hi' ? 'तातडीचे' : language === 'mr' ? 'तातडीचे' : 'Urgent'
                          : item.urgency === 'soon'
                          ? language === 'hi' ? 'महत्वपूर्ण' : language === 'mr' ? 'महत्त्वाचे' : 'Soon'
                          : language === 'hi' ? 'सामान्य' : language === 'mr' ? 'नियमित' : 'Standard'}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-700 font-medium">{docLabel}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.dateFormatted}
                      </span>
                      <span>•</span>
                      <span>{jurisdictionConfig?.name || 'India'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadAssessment(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'खोलें' : language === 'mr' ? 'उघडा' : 'Open'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                      title="Delete assessment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            {language === 'hi' ? 'बंद करें' : language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
