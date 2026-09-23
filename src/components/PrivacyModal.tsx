/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Lock, Eye, Trash2, Database, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="bg-white rounded-xl max-w-2xl w-full border border-[#D7DDE7] shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#D7DDE7] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#1E4D8F]" aria-hidden="true" />
            <h2 id="privacy-modal-title" className="text-base font-bold text-[#172033]">
              How Privacy Works in Private Legal Navigator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#596579] hover:text-[#172033] hover:bg-gray-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-[#172033] max-h-[75vh] overflow-y-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E4D8F] flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172033] mb-1">1. Local Processing by Default</h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                When you choose an image, PDF, or type text, processing happens in your browser’s temporary memory. The original file is never uploaded to any cloud server in the default flow.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E4D8F] flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172033] mb-1">2. Local PII Detection & Redaction</h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                Before any optional network request, our pattern engine identifies names, addresses, phone numbers, emails, case numbers, and claimed debt amounts. You can inspect, toggle, or add custom redactions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E4D8F] flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172033] mb-1">3. Exact Minimized Payload Preview</h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                If you choose optional AI assistance, the app displays the exact JSON text payload that will be sent. It excludes original files, images, and raw OCR text.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E4D8F] flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172033] mb-1">4. Zero Server-Side Document Storage</h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                The server is stateless for document content. No legal notices, case numbers, or names are saved to a server database or logged in server telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#A33A3A] flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172033] mb-1">5. Immediate Session Deletion</h3>
              <p className="text-xs text-[#596579] leading-relaxed">
                Clicking "Delete Session" immediately purges all in-memory text, extracted fields, and results from your browser.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#D7DDE7] bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E4D8F] hover:bg-[#163A6C] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
