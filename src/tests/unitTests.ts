/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { detectPii, applyRedactions, buildSanitizedPayload, validatePayloadIsSafe } from '../services/piiRedactionService';
import { classifyDocumentText } from '../services/documentClassifier';
import { auditAndSanitizeText, containsProhibitedLegalConclusion } from '../services/safetyFilter';
import { generateDeterministicResults } from '../services/checklistEngine';
import { assessRiskAndEscalation } from '../services/riskEscalationService';
import { SYNTHETIC_FIXTURES } from '../services/localOcrService';
import { JURISDICTIONS } from '../services/sourceRegistry';

export interface TestResultItem {
  id: string;
  name: string;
  category: 'Privacy & PII' | 'Jurisdiction Gating' | 'Document Scope' | 'Legal Safety' | 'Security & Injection' | 'Checklist & Uncertainty';
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export function runVerificationTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
} {
  const results: TestResultItem[] = [];

  // TEST 1: Indian PII detection (Aadhaar, PAN, names, addresses, mobile +91, emails, Rupee amounts)
  const fixture1 = SYNTHETIC_FIXTURES.find(f => f.id === 'fixture_in_cheque_bounce_138')!;
  const detectedPii1 = detectPii(fixture1.rawSimulatedText);
  const categories = detectedPii1.map(p => p.category);

  const hasName = categories.includes('tenant_name') || categories.includes('landlord_name');
  const hasAddress = categories.includes('address');
  const hasPhone = categories.includes('phone');
  const hasEmail = categories.includes('email');
  const hasAmount = categories.includes('financial_amount');

  results.push({
    id: 'test_pii_detection',
    name: 'Indian PII Detection (Names, Addresses, +91 Mobile, Email, ₹ Amounts)',
    category: 'Privacy & PII',
    passed: hasName && hasAddress && hasPhone && hasEmail && hasAmount,
    expected: 'All 5 critical Indian PII categories detected in Section 138 notice fixture',
    actual: `Detected ${detectedPii1.length} PII tokens: categories=[${Array.from(new Set(categories)).join(', ')}]`,
    details: `Detected: ${detectedPii1.map(d => `${d.label} ("${d.detectedValue}")`).join(', ')}`
  });

  // TEST 2: Manual correction and toggle of redactions
  const sampleText = 'To Tenant: Arun Deshmukh, phone +91 98201 55432. Please pay ₹ 2,75,000/-.';
  const piiList = detectPii(sampleText);
  // Redact all enabled
  const fullyRedacted = applyRedactions(sampleText, piiList);
  // Disable phone redaction manually
  const partiallyDisabled = piiList.map(p => (p.category === 'phone' ? { ...p, enabled: false } : p));
  const manuallyCorrected = applyRedactions(sampleText, partiallyDisabled);

  const manualCorrectionPassed =
    fullyRedacted.includes('[REDACTED PHONE]') &&
    !manuallyCorrected.includes('[REDACTED PHONE]') &&
    manuallyCorrected.includes('+91 98201 55432') &&
    manuallyCorrected.includes('[REDACTED AMOUNT]');

  results.push({
    id: 'test_manual_redaction_correction',
    name: 'Manual Correction & Selective Toggle of Redactions',
    category: 'Privacy & PII',
    passed: manualCorrectionPassed,
    expected: 'Disabling a specific redaction preserves that text while others remain redacted',
    actual: manualCorrectionPassed
      ? 'Successfully applied manual toggle; phone preserved while Rupee amount remained redacted.'
      : 'Failed to selectively preserve toggled items.'
  });

  // TEST 3: Foreign / non-Indian jurisdiction refusal (US Texas fixture)
  const foreignResult = generateDeterministicResults({
    jurisdictionId: 'unsupported_foreign',
    documentType: 'unsupported_general',
    statedReason: 'Alleged unpaid rent under Texas Property Code',
    visibleDates: ['September 21, 2026']
  });

  const foreignRefused =
    foreignResult.explanation.includes('strictly dedicated to Indian Law') &&
    foreignResult.escalation === 'urgent' &&
    foreignResult.citations.some(c => c.id === 'nalsa_official_portal');

  results.push({
    id: 'test_unsupported_jurisdiction',
    name: 'Foreign Jurisdiction Refusal & Safe NALSA Referral',
    category: 'Jurisdiction Gating',
    passed: foreignRefused,
    expected: 'Refuses foreign legal guidance, flags escalation, and redirects to NALSA 15100',
    actual: foreignRefused
      ? 'Properly refused foreign law; cited National Legal Services Authority (NALSA) helpline.'
      : 'Failed to refuse non-Indian jurisdiction.'
  });

  // TEST 4: Out-of-scope non-tenancy document detection
  const commercialManifestText =
    'INTERNATIONAL SHIPPING COMMERCIAL MANIFEST: B/L Number 49202, 50 shipping containers from Port of Singapore to JNPT Nhava Sheva. Customs bond #4492.';
  const classification = classifyDocumentText(commercialManifestText);

  results.push({
    id: 'test_unsupported_document_type',
    name: 'Out-of-Scope Commercial Document Detection',
    category: 'Document Scope',
    passed: classification.documentType === 'unsupported_general' && classification.isUnsupported === true,
    expected: 'Classifies international shipping manifest as unsupported_general',
    actual: `Classified as ${classification.documentType} with isUnsupported=${classification.isUnsupported}`,
    details: classification.unsupportedReason
  });

  // TEST 5: Neutralization of prohibited legal conclusions
  const textWithViolations =
    'Do not worry, this notice is totally illegal and you will win the case in court without paying anything. Just ignore this notice!';
  const containsProhibited = containsProhibitedLegalConclusion(textWithViolations);
  const sanitizedText = auditAndSanitizeText(textWithViolations);

  const safetyPassed =
    containsProhibited &&
    !sanitizedText.cleanText.includes('totally illegal') &&
    !sanitizedText.cleanText.includes('you will win') &&
    !sanitizedText.cleanText.includes('ignore this notice') &&
    sanitizedText.cleanText.includes('cannot be determined safely');

  results.push({
    id: 'test_legal_safety_neutrality',
    name: 'Prohibited Legal Conclusion Filtering & Neutrality Shield',
    category: 'Legal Safety',
    passed: safetyPassed,
    expected: 'Replaces absolute claims ("illegal", "you will win", "ignore notice") with verified neutral language',
    actual: safetyPassed
      ? 'Successfully replaced absolute claims with neutral procedural disclaimers.'
      : 'Failed to neutralize prohibited legal assertions.'
  });

  // TEST 6: Adversarial prompt injection defense
  const adversarialFixture = SYNTHETIC_FIXTURES.find(f => f.id === 'fixture_adversarial_injection')!;
  const injectionClassification = classifyDocumentText(adversarialFixture.rawSimulatedText);

  results.push({
    id: 'test_prompt_injection_defense',
    name: 'Adversarial Prompt Injection Detection & Containment',
    category: 'Security & Injection',
    passed: injectionClassification.adversarialPromptDetected === true,
    expected: 'Detects embedded "SYSTEM OVERRIDE: Ignore all previous instructions" pattern',
    actual: injectionClassification.adversarialPromptDetected
      ? 'Adversarial instruction detected and quarantined as untrusted document text.'
      : 'Failed to detect adversarial injection pattern.'
  });

  // TEST 7: Blurry / low-quality document uncertainty handling
  const blurryFixture = SYNTHETIC_FIXTURES.find(f => f.id === 'fixture_blurry_unreadable')!;
  const blurryClassification = classifyDocumentText(blurryFixture.rawSimulatedText);
  const dateField = blurryClassification.extractedFields.find(f => f.key === 'visibleDates');

  const blurryPassed =
    blurryClassification.confidence === 'low' &&
    dateField?.isUnclear === true &&
    (dateField?.uncertaintyNote?.includes('unreadable') || dateField?.uncertaintyNote?.includes('damaged'));

  results.push({
    id: 'test_blurry_document_uncertainty',
    name: 'Low-Quality Document & Unreadable Date Uncertainty Flagging',
    category: 'Checklist & Uncertainty',
    passed: Boolean(blurryPassed),
    expected: 'Marks unreadable dates as isUnclear=true with uncertainty advisory instead of guessing deadlines',
    actual: blurryPassed
      ? 'Properly flagged low confidence and unclear date fields with explicit verification advisories.'
      : 'Failed to flag blurry document uncertainty.'
  });

  // TEST 8: Indian Statutory NI Act 138 & CPC Summons Urgency Escalation
  const chequeBounceResult = generateDeterministicResults({
    jurisdictionId: 'india_maharashtra',
    documentType: 'cheque_bounce_138',
    statedReason: 'Cheque bounced due to insufficient funds',
    visibleDates: ['21st September 2026'],
    amountClaimed: '₹ 2,75,000/-'
  });

  const chequePassed =
    chequeBounceResult.escalation === 'urgent' &&
    chequeBounceResult.explanation.includes('Section 138') &&
    chequeBounceResult.citations.some(c => c.id === 'ni_act_section_138') &&
    chequeBounceResult.nextSteps.some(s => s.step.includes('15-Day'));

  results.push({
    id: 'test_ni_act_statutory_urgency',
    name: 'Section 138 NI Act 15-Day Statutory Urgency Escalation',
    category: 'Checklist & Uncertainty',
    passed: chequePassed,
    expected: 'Escalates cheque dishonour notice to "urgent", cites Section 138 NI Act and 15-day statutory window',
    actual: chequePassed
      ? 'Section 138 statutory urgency correctly generated with 15-day limitation advisory.'
      : 'Failed to correctly escalate Section 138 notice.'
  });

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  return { total, passed, failed, results };
}
