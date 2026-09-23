/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Play, Shield, RefreshCw } from 'lucide-react';
import { runVerificationTests, TestResultItem } from '../tests/unitTests';

interface AuditTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhyNotAiModal?: () => void;
}

export const AuditTestModal: React.FC<AuditTestModalProps> = ({ isOpen, onClose, onOpenWhyNotAiModal }) => {
  const [testSuite, setTestSuite] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(() => runVerificationTests());

  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRerun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestSuite(runVerificationTests());
      setIsRunning(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-test-modal-title"
        className="bg-white rounded-xl max-w-3xl w-full border border-[#D7DDE7] shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="px-6 py-4 border-b border-[#D7DDE7] flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#1E4D8F]" aria-hidden="true" />
            <div>
              <h2 id="audit-test-modal-title" className="text-base font-bold text-[#172033]">
                Automated Safety, Privacy & Scope Verification Tests
              </h2>
              <span className="text-xs text-[#596579]">
                Live evaluation against project requirements and acceptance criteria
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#596579] hover:text-[#172033] hover:bg-gray-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Summary Bar */}
        {testSuite && (
          <div className="px-6 py-3 bg-[#F7F8FA] border-b border-[#D7DDE7] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-xs">
              <span className="font-semibold text-[#172033]">
                Status: {testSuite.passed}/{testSuite.total} Tests Passed ({Math.round((testSuite.passed / testSuite.total) * 100)}%)
              </span>
              <span className="text-[#176B4D] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {testSuite.passed} Passing
              </span>
              {testSuite.failed > 0 && (
                <span className="text-[#A33A3A] font-medium flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {testSuite.failed} Failed
                </span>
              )}
            </div>

            <button
              onClick={handleRerun}
              disabled={isRunning}
              className="px-3 py-1 bg-white border border-[#D7DDE7] hover:bg-gray-50 text-[#172033] rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Rerun Suite</span>
            </button>
          </div>
        )}

        {/* Tests List */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1 text-xs">
          {onOpenWhyNotAiModal && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <div>
                  <p className="font-bold text-xs">Why these tests matter for mentors:</p>
                  <p className="text-[11px] text-amber-800">
                    These 8 tests prove why raw general AI assistants fail on legal safety, statutory deadlines, PII protection, and prompt injections.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWhyNotAiModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs whitespace-nowrap cursor-pointer"
              >
                View 7 Pillars →
              </button>
            </div>
          )}

          {testSuite?.results.map((test, idx) => (
            <div
              key={test.id}
              className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                test.passed ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D]" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#A33A3A]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-[#172033]">
                    {idx + 1}. {test.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#596579] bg-white px-2 py-0.5 rounded border border-gray-200">
                    {test.category}
                  </span>
                </div>

                <div className="space-y-1 text-[#596579]">
                  <p>
                    <strong className="text-[#172033]">Requirement:</strong> {test.expected}
                  </p>
                  <p>
                    <strong className="text-[#172033]">Actual Output:</strong> {test.actual}
                  </p>
                  {test.details && (
                    <p className="font-mono text-[11px] text-[#1E4D8F] bg-white/70 p-1.5 rounded border border-gray-100">
                      {test.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-[#D7DDE7] bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#172033] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            Close Audit Report
          </button>
        </div>
      </div>
    </div>
  );
};
