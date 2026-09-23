/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, FileText, Code, Copy, Check } from 'lucide-react';
import { NavigatorResult, DocumentTypeId } from '../types/navigator';
import { SupportedLanguage } from '../services/i18n';

interface AccessibilityExportProps {
  results: NavigatorResult;
  documentType: DocumentTypeId;
  language: SupportedLanguage;
  onPrint?: () => void;
}

export const AccessibilityExport: React.FC<AccessibilityExportProps> = ({
  results,
  documentType,
  language,
  onPrint
}) => {
  const [copied, setCopied] = useState(false);

  const generatePlainText = (): string => {
    return [
      '====================================================',
      ' PRIVATE LEGAL NAVIGATOR — ACCESSIBLE LEGAL SUMMARY',
      '====================================================',
      `Generated: ${new Date(results.generationTimestamp).toLocaleString()}`,
      `Statutory Framework: Indian Civil & Tenancy Law`,
      `Processing Mode: ${results.aiAssisted ? 'Sanitized AI Assisted' : 'Deterministic Statutory Engine (Local-Only)'}`,
      `Document Category: ${documentType.replace(/_/g, ' ').toUpperCase()}`,
      '',
      'SECTION 1. WHAT THIS DOCUMENT SAYS:',
      results.explanation,
      '',
      'SECTION 2. DATES TO VERIFY (NEVER SILENTLY CALCULATED):',
      ...results.datesToVerify.map(
        d => ` - ${d.dateText}: ${d.context}\n   Verification Advisory: ${d.verificationAdvisory}`
      ),
      '',
      'SECTION 3. WHAT IS UNCLEAR (CANNOT BE DETERMINED SAFELY):',
      ...results.unknowns.map(u => ` - ${u}`),
      '',
      'SECTION 4. WHAT YOU CAN DO NOW (DECISION-NEUTRAL CHECKLIST):',
      ...results.nextSteps.map(
        (s, i) => ` [${s.completed ? 'X' : ' '}] ${i + 1}. ${s.step}\n      Guidance: ${s.explanation}`
      ),
      '',
      'SECTION 5. OFFICIAL STATUTORY SOURCES & AUTHORITIES:',
      ...results.citations.map(
        c => ` - ${c.title} (${c.sourceType})\n   URL: ${c.url} | Last Verified: ${c.lastChecked}`
      ),
      '',
      'SECTION 6. OFFICIAL FREE LEGAL AID REFERRALS:',
      ...results.officialContacts.map(
        con => ` - ${con.name} (${con.type})\n   Helpline: ${con.phone} | Availability: ${con.hours}`
      ),
      '',
      '----------------------------------------------------',
      'LEGAL DISCLAIMER: Private Legal Navigator provides plain-language legal information and navigation support. It is not an attorney and does not provide legal advice or predict court outcomes. Always verify all dates and filings directly with the court clerk or an empaneled advocate at DLSA / NALSA (15100).'
    ].join('\n');
  };

  const generateSemanticHtml = (): string => {
    const plain = generatePlainText();
    return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Legal Document Assessment - Private Legal Navigator</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #111827;
      --muted: #4b5563;
      --border: #e5e7eb;
      --accent: #1e3a8a;
      --warning-bg: #fffbeb;
      --warning-border: #fde68a;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: #334155;
        --accent: #60a5fa;
        --warning-bg: #1e1b4b;
        --warning-border: #4338ca;
      }
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background-color: var(--bg);
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    h1 { font-size: 1.75rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; margin-top: 2rem; color: var(--accent); }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; background: var(--border); font-size: 0.85rem; font-weight: bold; }
    .advisory { background: var(--warning-bg); border-left: 4px solid #f59e0b; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.75rem; }
    .meta { font-size: 0.9rem; color: var(--muted); margin-bottom: 2rem; }
    .disclaimer { margin-top: 3rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.85rem; color: var(--muted); }
    @media print {
      body { max-width: 100%; padding: 0; color: #000; background: #fff; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Private Legal Navigator — Official Assessment</h1>
    <div class="meta">
      <p><strong>Generated:</strong> ${new Date(results.generationTimestamp).toLocaleString()}</p>
      <p><strong>Mode:</strong> ${results.aiAssisted ? 'Sanitized AI Assisted' : 'Deterministic Statutory Engine (Local-Only)'}</p>
      <p><strong>Jurisdiction:</strong> Indian Civil & Tenancy Law | <strong>NALSA Helpline:</strong> 15100</p>
    </div>
  </header>

  <main>
    <section aria-labelledby="section-summary">
      <h2 id="section-summary">1. What This Document Says</h2>
      <p>${results.explanation.replace(/\n/g, '<br>')}</p>
    </section>

    <section aria-labelledby="section-dates">
      <h2 id="section-dates">2. Dates to Verify (Never Silently Calculated)</h2>
      <div class="advisory" role="note">
        <strong>Warning:</strong> Statutory limitation deadlines in Indian law (e.g., 15-day Section 138 window or 30-day Written Statement) run strictly from official receipt/delivery date, not dates printed on the page.
      </div>
      <ul>
        ${results.datesToVerify
          .map(
            d => `<li><strong>${d.dateText}</strong> (${d.label}): ${d.context}<br><em>Verification Note:</em> ${d.verificationAdvisory}</li>`
          )
          .join('')}
      </ul>
    </section>

    <section aria-labelledby="section-unclear">
      <h2 id="section-unclear">3. What Is Unclear (Cannot Be Determined Safely)</h2>
      <ul>
        ${results.unknowns.map(u => `<li>${u}</li>`).join('')}
      </ul>
    </section>

    <section aria-labelledby="section-checklist">
      <h2 id="section-checklist">4. What You Can Do Now (Procedural Checklist)</h2>
      <ul>
        ${results.nextSteps
          .map(
            s => `<li><strong>${s.step}</strong> [Urgency: ${s.urgency}]<br>${s.explanation}</li>`
          )
          .join('')}
      </ul>
    </section>

    <section aria-labelledby="section-sources">
      <h2 id="section-sources">5. Verified Statutory Citations</h2>
      <ul>
        ${results.citations
          .map(
            c => `<li><strong>${c.title}</strong> (${c.sourceType})<br><a href="${c.url}">${c.url}</a> (Last checked: ${c.lastChecked})</li>`
          )
          .join('')}
      </ul>
    </section>

    <section aria-labelledby="section-aid">
      <h2 id="section-aid">6. Free Legal Aid & Court Helplines</h2>
      <ul>
        ${results.officialContacts
          .map(
            con => `<li><strong>${con.name}</strong> (${con.type})<br>Phone: ${con.phone} | Hours: ${con.hours}</li>`
          )
          .join('')}
      </ul>
    </section>
  </main>

  <footer>
    <div class="disclaimer" role="contentinfo">
      <strong>Legal Disclaimer:</strong> Private Legal Navigator provides plain-language educational guidance only. It is not an advocate, does not give legal representation, and does not determine legality or predict outcomes. Verify all filings with the official court registry or an empaneled legal aid advocate.
    </div>
  </footer>
</body>
</html>`;
  };

  const handleDownloadTxt = () => {
    const content = generatePlainText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `private-legal-navigator-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const content = generateSemanticHtml();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `private-legal-navigator-summary-${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = async () => {
    try {
      const content = generatePlainText();
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy to clipboard', e);
    }
  };

  return (
    <div
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs"
      data-testid="accessibility-export-module"
      aria-label="Accessible Summary Export Controls"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Accessibility Export Module
            </h4>
            <p className="text-[11px] text-slate-500">
              Download WCAG-compliant accessible offline copies for advocates, assistive readers, or printing.
            </p>
          </div>
        </div>

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            aria-label="Open print formatted summary"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Print View</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
        {/* Plain Text (.txt) Download */}
        <button
          type="button"
          onClick={handleDownloadTxt}
          className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          title="Download simple screen-reader friendly text document"
          aria-label="Download plain text legal summary"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Plain Text (.txt)</span>
        </button>

        {/* Semantic HTML (.html) Download */}
        <button
          type="button"
          onClick={handleDownloadHtml}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          title="Download semantic, accessible HTML document with headings and offline styles"
          aria-label="Download accessible HTML legal summary"
        >
          <Code className="w-4 h-4 text-indigo-700" />
          <span>Accessible HTML (.html)</span>
        </button>

        {/* Copy to Clipboard */}
        <button
          type="button"
          onClick={handleCopyClipboard}
          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
            copied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
          }`}
          title="Copy formatted plain text summary to clipboard"
          aria-label="Copy legal assessment to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
