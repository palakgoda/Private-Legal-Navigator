/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Scale, CheckSquare, ShieldCheck } from 'lucide-react';
import { NavigatorResult } from '../types/navigator';

interface PrintSummaryViewProps {
  isOpen: boolean;
  onClose: () => void;
  results: NavigatorResult;
  documentTitle?: string;
}

export const PrintSummaryView: React.FC<PrintSummaryViewProps> = ({
  isOpen,
  onClose,
  results,
  documentTitle
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-summary-title"
        className="bg-white rounded-xl max-w-4xl w-full border border-gray-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Toolbar (hidden on actual print) */}
        <div className="px-6 py-3 border-b border-gray-200 bg-slate-100 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#596579]">
            <Printer className="w-4 h-4 text-[#1E4D8F]" />
            <span className="font-semibold text-[#172033]">Print & Export Preview</span>
            <span>· Sensitive personal data omitted</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#1E4D8F] text-white hover:bg-[#163A6C] rounded-md text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-500 hover:text-black hover:bg-gray-200"
              aria-label="Close print dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print-page font-sans text-gray-900 leading-relaxed text-sm">
          {/* Print Header */}
          <div className="border-b-2 border-gray-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1 id="print-summary-title" className="text-xl font-bold tracking-tight">
                Private Legal Navigator — Summary & Action Checklist
              </h1>
              <span className="text-xs font-mono text-gray-500">
                {new Date(results.generationTimestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              This summary contains confirmed procedural information and source-linked checklist items. All raw identifiers (names, phone numbers, exact addresses) have been removed for privacy.
            </p>
          </div>

          {/* Legal Notice */}
          <div className="p-3 bg-gray-50 border border-gray-300 rounded mb-6 text-xs text-gray-700">
            <strong>NOTICE & DISCLAIMER:</strong> Private Legal Navigator is an informational assistant, not an attorney. This document does not constitute legal advice or an attorney-client relationship. All deadlines must be confirmed directly with the official court or a licensed attorney.
          </div>

          {/* Section 1: Overview */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              1. What This Document Appears to Say
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              {results.explanation}
            </p>
          </div>

          {/* Section 2: Dates to verify */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              2. Dates Visible in Document (Subject to Official Verification)
            </h2>
            <div className="space-y-2">
              {results.datesToVerify.map((d, i) => (
                <div key={i} className="text-xs p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="font-bold text-gray-900">{d.dateText}</span> ({d.label}) — {d.context}
                  <div className="text-amber-800 italic mt-0.5">⚠️ {d.verificationAdvisory}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Unknowns */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              3. Unresolved Questions & Procedural Unknowns
            </h2>
            <ul className="list-disc list-inside text-xs space-y-1 text-gray-800">
              {results.unknowns.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Next Steps Checklist */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              4. Decision-Neutral Action Checklist
            </h2>
            <div className="space-y-2 text-xs">
              {results.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 border border-gray-400 rounded shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900">{i + 1}. {step.step}</span>
                    <p className="text-gray-600 mt-0.5">{step.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Official Court & Legal Aid Contacts */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              5. Official Court & Non-Profit Legal Aid Directory
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {results.officialContacts.map(c => (
                <div key={c.id} className="p-2 border border-gray-200 rounded">
                  <div className="font-bold text-gray-900">{c.name}</div>
                  <div className="text-gray-600">{c.role} {c.phone ? `· ${c.phone}` : ''}</div>
                  <div className="text-blue-800 underline break-all">{c.url}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Verified Citations */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2">
              6. Statutory & Source Registry Citations
            </h2>
            <div className="space-y-1 text-[11px] text-gray-600">
              {results.citations.map(c => (
                <div key={c.id}>
                  <strong>{c.title}</strong> ({c.sourceType}) — {c.url} (Checked: {c.lastChecked})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
