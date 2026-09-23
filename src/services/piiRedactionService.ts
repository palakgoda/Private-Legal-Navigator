/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DetectedPii, PiiCategory, SanitizedPayload } from '../types/navigator';

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// Indian and international phone numbers: +91, 0, or 10-digit mobile
const PHONE_REGEX = /(?:\+91[-.\s]?|91[-.\s]?|0)?\b[6-9]\d{4}[-.\s]?\d{5}\b|(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g;

// Aadhaar: 12 digits (often 4 4 4)
const AADHAAR_REGEX = /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g;

// PAN Card: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;

// Indian CNR number or Court Case Number: e.g. MHCC02-001234-2026, CC/123/2026, Suit No. 45/2026
const CASE_NUMBER_REGEX = /\b(?:CNR\s*(?:No\.?)?|Case\s*(?:No\.?|Number|#)?|Suit\s*No\.?|C\.?C\.?\s*No\.?)\s*[:#]?\s*([A-Z0-9]{2,6}[-\/][A-Z0-9]{2,8}[-\/][A-Z0-9]+|[A-Z0-9]{4,16})\b/gi;

const DOB_REGEX = /\b(?:DOB|Date of Birth|जन्म तारीख)\s*[:#]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/gi;

// Rupee and Dollar amounts: ₹ 25,000, Rs. 50,000/-, INR 1,50,000, $1,850.00
const FINANCIAL_AMOUNT_REGEX = /(?:₹|Rs\.?|INR|\$)\s?[0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?(?:\s*\/-)?\b/gi;

// Indian and standard addresses: Pin codes 6-digits (e.g. 400001, 110001), Flat/Plot/Road/Nagar/Marg/Sector
const ADDRESS_REGEX = /\b(?:Flat|House|Plot|Bldg|Building|Shop|Gala|Room|Apartment|Apt|Suite|Unit|#)\s*No\.?\s*[A-Za-z0-9\-\/]+[A-Za-z0-9,\s.\-]+(?:Nagar|Road|Marg|Street|St|Lane|Colony|Sector|Phase|Bandra|Andheri|Dadar|Thane|Pune|Oakland|Bengaluru|Delhi|Mumbai)[A-Za-z0-9,\s.\-]*(?:\b\d{6}\b|\b\d{5}\b)?/gi;

// Name prefixes common in Indian & tenancy legal notices
const NAME_PATTERNS = [
  /(?:To\s*(?:Tenant|Resident|Occupant|Borrower|Drawer)?\s*[:(]?\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  /(?:Tenant(?:\(s\))?\s*[:\-]\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  /(?:Landlord|Owner|Complainant|Lender|Payee)\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  /(?:Defendant(?:\(s\))?|Respondent|Accused)\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  /(?:Plaintiff(?:\(s\))?|Petitioner)\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  /(?:Advocate|Adv\.)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g
];

export function detectPii(text: string): DetectedPii[] {
  if (!text) return [];

  const detected: DetectedPii[] = [];
  let idCounter = 1;

  // 1. Email Addresses
  let match: RegExpExecArray | null;
  const emailRegex = new RegExp(EMAIL_REGEX.source, EMAIL_REGEX.flags);
  while ((match = emailRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'email',
      label: 'Email Address',
      detectedValue: match[0],
      redactedValue: '[REDACTED EMAIL]',
      reason: 'Personal email address that could identify a citizen on public networks.',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 2. Phone Numbers
  const phoneRegex = new RegExp(PHONE_REGEX.source, PHONE_REGEX.flags);
  while ((match = phoneRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'phone',
      label: 'Mobile / Phone Number',
      detectedValue: match[0],
      redactedValue: '[REDACTED PHONE]',
      reason: 'Direct contact telephone or mobile number.',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 3. Aadhaar Number (UIDAI)
  const aadhaarRegex = new RegExp(AADHAAR_REGEX.source, AADHAAR_REGEX.flags);
  while ((match = aadhaarRegex.exec(text)) !== null) {
    // Basic verification: 12 digits
    const digitsOnly = match[0].replace(/\s/g, '');
    if (digitsOnly.length === 12) {
      detected.push({
        id: `pii_${idCounter++}`,
        category: 'aadhaar_id',
        label: 'Aadhaar Number (UIDAI)',
        detectedValue: match[0],
        redactedValue: '[REDACTED AADHAAR]',
        reason: 'Indian biometric national identification number (Aadhaar). Highly sensitive.',
        startPos: match.index,
        endPos: match.index + match[0].length,
        enabled: true
      });
    }
  }

  // 4. PAN Card Number (Income Tax Dept)
  const panRegex = new RegExp(PAN_REGEX.source, PAN_REGEX.flags);
  while ((match = panRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'pan_id',
      label: 'PAN Card Number',
      detectedValue: match[0],
      redactedValue: '[REDACTED PAN]',
      reason: 'Permanent Account Number (PAN) issued by Income Tax Department.',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 5. Case / CNR Numbers
  const caseRegex = new RegExp(CASE_NUMBER_REGEX.source, CASE_NUMBER_REGEX.flags);
  while ((match = caseRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'case_number',
      label: 'Court Case / CNR Number',
      detectedValue: match[0],
      redactedValue: '[REDACTED CASE NUMBER]',
      reason: 'Official court docket or CNR identifier which exposes public litigation records.',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 6. Dates of Birth
  const dobRegex = new RegExp(DOB_REGEX.source, DOB_REGEX.flags);
  while ((match = dobRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'dob',
      label: 'Date of Birth',
      detectedValue: match[0],
      redactedValue: '[REDACTED DOB]',
      reason: 'Personal date of birth which can be used for identity theft.',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 7. Claimed Rupee / Financial Amounts
  const financialRegex = new RegExp(FINANCIAL_AMOUNT_REGEX.source, FINANCIAL_AMOUNT_REGEX.flags);
  while ((match = financialRegex.exec(text)) !== null) {
    detected.push({
      id: `pii_${idCounter++}`,
      category: 'financial_amount',
      label: 'Claimed Financial Amount',
      detectedValue: match[0],
      redactedValue: '[REDACTED AMOUNT]',
      reason: 'Specific monetary claims or debt amount (can reveal dispute details).',
      startPos: match.index,
      endPos: match.index + match[0].length,
      enabled: true
    });
  }

  // 8. Addresses (Property / Residential)
  const addrRegex = new RegExp(ADDRESS_REGEX.source, ADDRESS_REGEX.flags);
  while ((match = addrRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (val.length > 12) {
      detected.push({
        id: `pii_${idCounter++}`,
        category: 'address',
        label: 'Residential / Property Address',
        detectedValue: val,
        redactedValue: '[REDACTED ADDRESS]',
        reason: 'Physical property or home address subject to legal notice.',
        startPos: match.index,
        endPos: match.index + match[0].length,
        enabled: true
      });
    }
  }

  // 9. Names of Tenants, Accused, Landlords, Advocates
  for (const namePattern of NAME_PATTERNS) {
    const pattern = new RegExp(namePattern.source, namePattern.flags);
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length > 3) {
        const isTenant = /tenant|resident|occupant|defendant|accused/i.test(match[0]);
        detected.push({
          id: `pii_${idCounter++}`,
          category: isTenant ? 'tenant_name' : 'landlord_name',
          label: isTenant ? 'Citizen / Tenant / Accused Name' : 'Landlord / Complainant / Advocate Name',
          detectedValue: match[1],
          redactedValue: isTenant ? '[REDACTED CITIZEN NAME]' : '[REDACTED SENDER NAME]',
          reason: isTenant ? 'Named recipient / respondent in legal document.' : 'Sender or advocate name in legal document.',
          startPos: match.index,
          endPos: match.index + match[0].length,
          enabled: true
        });
      }
    }
  }

  // Deduplicate overlapping spans
  return deduplicatePii(detected);
}

function deduplicatePii(items: DetectedPii[]): DetectedPii[] {
  const sorted = [...items].sort((a, b) => {
    if (a.startPos !== b.startPos) return a.startPos - b.startPos;
    return b.detectedValue.length - a.detectedValue.length;
  });

  const unique: DetectedPii[] = [];
  const seenValues = new Set<string>();

  for (const item of sorted) {
    const key = `${item.category}:${item.detectedValue.trim().toLowerCase()}`;
    if (!seenValues.has(key)) {
      seenValues.add(key);
      unique.push(item);
    }
  }

  return unique;
}

export function applyRedactions(text: string, piiList: DetectedPii[]): string {
  if (!text) return '';
  let result = text;

  // Filter only active/enabled redactions and sort by length descending to avoid partial matches
  const activeRedactions = piiList
    .filter(p => p.enabled)
    .sort((a, b) => b.detectedValue.length - a.detectedValue.length);

  for (const item of activeRedactions) {
    if (!item.detectedValue) continue;
    const escaped = escapeRegExp(item.detectedValue);
    const regex = new RegExp(escaped, 'g');
    result = result.replace(regex, item.redactedValue);
  }

  return result;
}

export function buildSanitizedPayload(params: {
  jurisdiction: string;
  documentType: string;
  statedReason: string | null;
  visibleDates: string[];
  courtOrAgency?: string | null;
  redactedExcerpt?: string;
  unclearItems?: string[];
  language?: string;
}): SanitizedPayload {
  return {
    jurisdiction: params.jurisdiction,
    documentType: params.documentType,
    statedReason: params.statedReason,
    visibleDates: params.visibleDates,
    language: params.language || 'English',
    courtOrAgency: params.courtOrAgency || null,
    redactedText: params.redactedExcerpt || '',
    unclearItems: params.unclearItems || [],
    containsPii: false
  };
}

export function validatePayloadIsSafe(payload: SanitizedPayload): { isSafe: boolean; violations: string[] } {
  const violations: string[] = [];
  const serialized = JSON.stringify(payload);

  if (EMAIL_REGEX.test(serialized)) {
    violations.push('Payload contains unredacted email address.');
  }
  if (AADHAAR_REGEX.test(serialized)) {
    violations.push('Payload contains unredacted Aadhaar number.');
  }
  if (PAN_REGEX.test(serialized)) {
    violations.push('Payload contains unredacted PAN card number.');
  }

  return {
    isSafe: violations.length === 0,
    violations
  };
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
