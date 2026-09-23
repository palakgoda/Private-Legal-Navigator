/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Cpu, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';

interface LocalProcessorProps {
  isProcessing: boolean;
  stage?: 'idle' | 'ocr' | 'pii_scan' | 'classification' | 'ready';
  language?: SupportedLanguage;
  fileDetails?: {
    name: string;
    sizeBytes: number;
    mimeType: string;
  } | null;
}

export const LocalProcessor: React.FC<LocalProcessorProps> = ({
  isProcessing,
  stage = 'idle',
  language = 'en',
  fileDetails
}) => {
  return (
    <div
      className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 transition-all"
      data-testid="local-processor-module"
      aria-live="polite"
      aria-label="Local Browser Processor"
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Cpu className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Local-First In-Browser Processor
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                100% Device Sandbox
              </span>
            </div>
            <p className="text-[11px] text-emerald-800">
              {language === 'hi'
                ? 'सभी फाइल और ओसीआर निष्कर्षण केवल आपके ब्राउज़र में चलते हैं। कोई फ़ाइल सर्वर पर अपलोड नहीं होती।'
                : language === 'mr'
                ? 'सर्व फाइल्स आणि ओसीआर प्रक्रिया थेट आपल्या ब्राउझरमध्ये होते. कोणताही डेटा सर्व्हरवर जात नाही.'
                : 'Zero-cloud pipeline: Text extraction, PII scanning, and classification execute strictly in local browser memory.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-white/80 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Offline Sandboxed</span>
        </div>
      </div>

      {/* Processing Pipeline Stages */}
      {isProcessing && (
        <div className="mt-3 pt-3 border-t border-emerald-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-900 font-medium">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>
                {stage === 'ocr'
                  ? 'Extracting document text locally...'
                  : stage === 'pii_scan'
                  ? 'Detecting sensitive Aadhaar, PAN, phone, and name data...'
                  : stage === 'classification'
                  ? 'Classifying document under statutory civil/tenancy rules...'
                  : 'Preparing local safe preview...'}
              </span>
            </span>
            {fileDetails && (
              <span className="text-[10px] text-emerald-700 font-mono truncate max-w-[140px]">
                {fileDetails.name}
              </span>
            )}
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300 animate-pulse"
              style={{
                width: stage === 'ocr' ? '35%' : stage === 'pii_scan' ? '70%' : '100%'
              }}
            />
          </div>
        </div>
      )}

      {/* Static Verification Guarantees when idle */}
      {!isProcessing && (
        <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center gap-4 text-[11px] text-emerald-800 flex-wrap">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Local Web-Worker OCR</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP 2023 Compliant</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Raw OCR Storage</span>
          </span>
        </div>
      )}
    </div>
  );
};
