/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';

interface PrivacyStatusBannerProps {
  onOpenPrivacyModal: () => void;
  aiModeActive?: boolean;
  detectedPiiCount?: number;
  activeRedactionsCount?: number;
}

export const PrivacyStatusBanner: React.FC<PrivacyStatusBannerProps> = ({
  onOpenPrivacyModal,
  aiModeActive = false,
  detectedPiiCount,
  activeRedactionsCount
}) => {
  return (
    <div
      role="region"
      aria-label="Privacy and Local Processing Status"
      className="w-full bg-[#EBF2FA] border-b border-[#D7DDE7] text-[#172033] py-2.5 px-4 sm:px-6 transition-colors"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#1E4D8F] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-semibold text-[#1E4D8F]">Local processing is on.</span>{' '}
            <span className="text-[#172033]">
              Your original document stays in this browser unless you explicitly choose optional AI assistance.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
          <span className="text-[#596579] hidden md:inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#176B4D]" aria-hidden="true" />
            Zero server uploads in default flow
          </span>
          <button
            onClick={onOpenPrivacyModal}
            className="text-[#1E4D8F] hover:underline font-medium inline-flex items-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D8F] rounded"
          >
            <span>How privacy works</span>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
