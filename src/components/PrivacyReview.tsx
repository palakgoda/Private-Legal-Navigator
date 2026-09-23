/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  Code,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { DetectedPii, SanitizedPayload, PilotJurisdictionId } from '../types/navigator';
import { applyRedactions } from '../services/piiRedactionService';

interface PrivacyReviewProps {
  rawText: string;
  piiList: DetectedPii[];
  onTogglePii: (id: string) => void;
  onAddCustomPii: (word: string, category: any) => void;
  sanitizedPayload: SanitizedPayload;
  onContinueToConfirmation: () => void;
  onProceedDirectlyLocal: () => void;
}

export const PrivacyReview: React.FC<PrivacyReviewProps> = ({
  rawText,
  piiList,
  onTogglePii,
  onAddCustomPii,
  sanitizedPayload,
  onContinueToConfirmation,
  onProceedDirectlyLocal
}) => {
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);
  const [customWord, setCustomWord] = useState('');
  const [previewTab, setPreviewTab] = useState<'redacted' | 'raw'>('redacted');

  const activeRedactionsCount = piiList.filter(p => p.enabled).length;
  const redactedText = applyRedactions(rawText, piiList);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWord.trim().length >= 2) {
      onAddCustomPii(customWord.trim(), 'address');
      setCustomWord('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#596579] font-medium mb-1">
              <span>Step 2 of 4</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1E4D8F]">Privacy & Redaction Review</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Review and confirm sensitive information removal
            </h1>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 max-w-2xl leading-relaxed">
              We automatically detect personal identifiers like names, street addresses, phone numbers, case numbers, and financial demands. Confirm or adjust what gets redacted before continuing.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-[#D7DDE7] sm:pl-6 shrink-0">
            <span className="text-2xl font-bold text-[#1E4D8F] tabular-nums block">
              {activeRedactionsCount}
            </span>
            <span className="text-xs text-[#596579]">
              Active redactions of {piiList.length} detected
            </span>
          </div>
        </div>
      </div>

      {/* Detected PII List & Controls */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7DDE7]">
          <div>
            <h2 className="text-sm font-semibold text-[#172033]">
              Detected Sensitive Data Tokens
            </h2>
            <p className="text-xs text-[#596579]">
              Click any token to toggle redaction on or off. Unchecked items will remain visible.
            </p>
          </div>

          {/* Add custom word */}
          <form onSubmit={handleAddCustom} className="flex items-center gap-2">
            <input
              type="text"
              value={customWord}
              onChange={e => setCustomWord(e.target.value)}
              placeholder="Add custom name/number to redact..."
              className="text-xs px-3 py-1.5 border border-[#D7DDE7] rounded-md text-[#172033] focus:ring-1 focus:ring-[#1E4D8F] outline-none w-56"
            />
            <button
              type="submit"
              disabled={customWord.trim().length < 2}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Redact</span>
            </button>
          </form>
        </div>

        {/* Tokens Grid */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {piiList.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-xs text-[#596579]">
              No obvious personal identifiers were detected in this notice text. You can add custom terms above.
            </div>
          ) : (
            piiList.map(item => (
              <div
                key={item.id}
                onClick={() => onTogglePii(item.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  item.enabled
                    ? 'border-[#1E4D8F] bg-blue-50/40 text-[#172033]'
                    : 'border-[#D7DDE7] bg-gray-50/50 text-[#596579]'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4D8F]">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#596579]">·</span>
                    <span className="text-xs font-mono truncate max-w-[180px]">
                      "{item.detectedValue}"
                    </span>
                  </div>
                  <p className="text-xs text-[#596579] line-clamp-1 leading-normal">
                    {item.reason}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                  {item.enabled ? (
                    <span className="text-xs font-medium text-[#1E4D8F] inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Redacted
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#596579] inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      Kept
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Side-by-Side or Tabbed Text Preview */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#D7DDE7] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewTab('redacted')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                previewTab === 'redacted'
                  ? 'bg-white text-[#172033] shadow-xs border border-gray-200'
                  : 'text-[#596579] hover:text-[#172033]'
              }`}
            >
              Sanitized Text Preview (How it looks with redactions)
            </button>
            <button
              onClick={() => setPreviewTab('raw')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                previewTab === 'raw'
                  ? 'bg-white text-[#172033] shadow-xs border border-gray-200'
                  : 'text-[#596579] hover:text-[#172033]'
              }`}
            >
              Original In-Memory Notice Text
            </button>
          </div>

          <button
            onClick={() => setShowPayloadPreview(!showPayloadPreview)}
            className="text-xs text-[#1E4D8F] hover:underline font-medium inline-flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showPayloadPreview ? 'Hide Sanitized JSON' : 'Inspect Exact Sanitized JSON Payload'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {previewTab === 'redacted' ? (
            <pre className="text-xs font-mono text-[#172033] bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
              {redactedText}
            </pre>
          ) : (
            <pre className="text-xs font-mono text-[#596579] bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
              {rawText}
            </pre>
          )}

          {/* Exact Sanitized Payload JSON Viewer (Mandatory Privacy Requirement) */}
          {showPayloadPreview && (
            <div className="mt-4 pt-4 border-t border-[#D7DDE7]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#172033]">
                  Exact Minimized Payload (Shown before any optional network request)
                </span>
                <span className="text-xs text-[#176B4D] inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  Zero files or raw OCR included
                </span>
              </div>
              <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(sanitizedPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onProceedDirectlyLocal}
          className="px-4 py-2.5 bg-white border border-[#D7DDE7] hover:bg-gray-50 text-[#172033] text-xs sm:text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-[#176B4D]" aria-hidden="true" />
          <span>Local Mode Only (Skip AI Completely)</span>
        </button>

        <button
          onClick={onContinueToConfirmation}
          className="px-5 py-2.5 bg-[#1E4D8F] hover:bg-[#163A6C] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
        >
          <span>Confirm Redactions & Review Extracted Fields</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
