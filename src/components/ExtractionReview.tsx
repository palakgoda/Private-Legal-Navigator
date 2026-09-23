/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  Info
} from 'lucide-react';
import { ExtractedField, ConfidenceLevel, DocumentTypeId } from '../types/navigator';
import { SUPPORTED_DOCUMENT_TYPES } from '../services/sourceRegistry';

interface ExtractionReviewProps {
  fields: ExtractedField[];
  documentType: DocumentTypeId;
  onUpdateField: (id: string, updates: Partial<ExtractedField>) => void;
  onSelectDocumentType: (type: DocumentTypeId) => void;
  onGenerateResults: (useAi: boolean) => void;
  isAiLoading: boolean;
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({
  fields,
  documentType,
  onUpdateField,
  onSelectDocumentType,
  onGenerateResults,
  isAiLoading
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value || '');
  };

  const handleSaveEdit = (fieldId: string) => {
    onUpdateField(fieldId, {
      value: editValue.trim(),
      isUnclear: false,
      confidence: 'high',
      userConfirmed: true
    });
    setEditingFieldId(null);
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
  };

  const handleToggleConfirm = (field: ExtractedField) => {
    onUpdateField(field.id, {
      userConfirmed: !field.userConfirmed
    });
  };

  const handleMarkUnclear = (field: ExtractedField) => {
    onUpdateField(field.id, {
      isUnclear: true,
      confidence: 'unknown',
      userConfirmed: true
    });
  };

  const confirmedCount = fields.filter(f => f.userConfirmed).length;
  const currentDocTypeConfig = SUPPORTED_DOCUMENT_TYPES[documentType];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#596579] font-medium mb-1">
              <span>Step 3 of 4</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1E4D8F]">Field Confirmation & Uncertainty Review</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Confirm extracted legal fields and identify uncertainty
            </h1>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 max-w-2xl leading-relaxed">
              Software cannot guess controlling deadlines or court facts without human confirmation. Verify each extracted field below or mark it as unclear.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-[#D7DDE7] sm:pl-6 shrink-0">
            <span className="text-2xl font-bold text-[#1E4D8F] tabular-nums block">
              {confirmedCount}/{fields.length}
            </span>
            <span className="text-xs text-[#596579]">
              Fields reviewed by you
            </span>
          </div>
        </div>
      </div>

      {/* Document Classification Confirmation */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D7DDE7]">
          <div>
            <span className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1">
              Classified Document Category
            </span>
            <span className="text-base font-semibold text-[#1E4D8F]">
              {currentDocTypeConfig?.displayName || 'Uncertain Classification'}
            </span>
          </div>

          <div className="w-full sm:w-auto">
            <label htmlFor="doc-type-override" className="sr-only">Override document category</label>
            <select
              id="doc-type-override"
              value={documentType}
              onChange={e => onSelectDocumentType(e.target.value as DocumentTypeId)}
              className="text-xs font-medium px-3 py-2 border border-[#D7DDE7] rounded-lg bg-white text-[#172033] focus:ring-1 focus:ring-[#1E4D8F]"
            >
              {Object.values(SUPPORTED_DOCUMENT_TYPES).map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.displayName} {doc.isSupported ? '' : '(Unsupported)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-[#596579] leading-relaxed">
          {currentDocTypeConfig?.description}
        </p>
        <div className="text-xs text-[#596579] flex items-center gap-2">
          <span className="font-semibold text-[#172033]">Statutory Authority:</span>
          <span>{currentDocTypeConfig?.statutoryBasis}</span>
        </div>
      </div>

      {/* Extracted Fields Rows */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl overflow-hidden divide-y divide-[#D7DDE7]">
        <div className="bg-slate-50 px-5 py-3 flex items-center justify-between text-xs font-semibold text-[#596579]">
          <span>Document Field & Value</span>
          <span>Confidence & Verification</span>
        </div>

        {fields.map(field => {
          const isEditing = editingFieldId === field.id;

          return (
            <div
              key={field.id}
              className={`p-4 sm:p-5 transition-colors ${
                field.userConfirmed ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Field Name and Value */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#172033]">
                      {field.label}
                    </span>
                    {field.isUnclear && (
                      <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        Marked Unclear
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="text-xs sm:text-sm px-3 py-1.5 border border-[#1E4D8F] rounded-md text-[#172033] w-full max-w-md focus:ring-1 focus:ring-[#1E4D8F] outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(field.id)}
                        className="p-1.5 bg-[#1E4D8F] text-white rounded hover:bg-[#163A6C]"
                        title="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-[#172033] font-medium break-words">
                      {field.value || <span className="text-gray-400 italic">None or not found</span>}
                    </div>
                  )}

                  {field.sourceRegion && (
                    <div className="text-xs text-[#596579] mt-1 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                      Source snippet: "{field.sourceRegion.textSnippet.slice(0, 75)}"
                    </div>
                  )}

                  {field.uncertaintyNote && (
                    <div className="text-xs text-amber-900 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{field.uncertaintyNote}</span>
                    </div>
                  )}
                </div>

                {/* Right: Confidence badge and actions */}
                <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs">
                    <ConfidenceBadge confidence={field.confidence} isUnclear={field.isUnclear} />
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(field)}
                        className="px-2.5 py-1 text-xs text-[#596579] hover:text-[#172033] hover:bg-gray-100 rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleMarkUnclear(field)}
                      className="px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-50 rounded transition-colors"
                    >
                      Mark Unclear
                    </button>

                    <button
                      onClick={() => handleToggleConfirm(field)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 ${
                        field.userConfirmed
                          ? 'bg-[#176B4D]/10 text-[#176B4D] border border-[#176B4D]/20'
                          : 'bg-white border border-[#D7DDE7] text-[#596579] hover:text-[#172033]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{field.userConfirmed ? 'Confirmed' : 'Confirm Field'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generation Actions: Local Engine vs Optional AI */}
      <div className="bg-[#FFFFFF] border border-[#D7DDE7] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#172033] uppercase tracking-wider block mb-1">
            Choose Guidance Processing Mode
          </span>
          <p className="text-xs text-[#596579] max-w-xl">
            You can generate a verified checklist 100% locally on your machine, or optionally request AI plain-language assistance using only the confirmed sanitized data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onGenerateResults(false)}
            disabled={isAiLoading}
            className="px-4 py-2.5 bg-white border border-[#1E4D8F] text-[#1E4D8F] hover:bg-blue-50 font-medium text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#176B4D]" />
            <span>Generate Local Guidance (No AI)</span>
          </button>

          <button
            onClick={() => onGenerateResults(true)}
            disabled={isAiLoading}
            className="px-5 py-2.5 bg-[#1E4D8F] hover:bg-[#163A6C] text-white font-medium text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Analyzing...' : 'Request Optional AI Explanation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function ConfidenceBadge({ confidence, isUnclear }: { confidence: ConfidenceLevel; isUnclear?: boolean }) {
  if (isUnclear) {
    return (
      <span className="text-xs text-amber-800 font-medium inline-flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
        Needs Verification
      </span>
    );
  }

  switch (confidence) {
    case 'high':
      return (
        <span className="text-xs text-[#176B4D] font-medium inline-flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          High Confidence
        </span>
      );
    case 'medium':
      return (
        <span className="text-xs text-[#1E4D8F] font-medium inline-flex items-center gap-1">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          Moderate Confidence
        </span>
      );
    case 'low':
      return (
        <span className="text-xs text-[#8A5A00] font-medium inline-flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Low Confidence
        </span>
      );
    default:
      return (
        <span className="text-xs text-[#596579] font-medium inline-flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Unknown
        </span>
      );
  }
}
