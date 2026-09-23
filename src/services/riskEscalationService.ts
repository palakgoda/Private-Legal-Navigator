/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentTypeId, PilotJurisdictionId, OfficialReferral } from '../types/navigator';
import { OFFICIAL_LEGAL_AID_CONTACTS } from './sourceRegistry';

export interface EscalationAssessment {
  level: 'none' | 'soon' | 'urgent';
  title: string;
  reasons: string[];
  referrals: OfficialReferral[];
  actionRequiredNotice: string;
  isCourtDeadline: boolean;
}

export function assessRiskAndEscalation(params: {
  documentType: DocumentTypeId;
  jurisdictionId: PilotJurisdictionId;
  visibleDates: string[];
  isUnclear: boolean;
  hasCaseNumber: boolean;
  needsInterpreter?: boolean;
}): EscalationAssessment {
  const { documentType, jurisdictionId, visibleDates, isUnclear, needsInterpreter } = params;
  const reasons: string[] = [];
  let isCourtDeadline = false;

  // 1. High Urgency Triggers (Indian Law)
  if (documentType === 'cheque_bounce_138') {
    reasons.push('Section 138 NI Act: Dishonour of cheque carries a strict 15-day statutory window from receipt to pay before criminal prosecution.');
    isCourtDeadline = false;
  }

  if (documentType === 'civil_summons_cpc') {
    reasons.push('Court Summons (CPC Order 5): You must appear on hearing date and file Written Statement within 30 days under Order 8 Rule 1 CPC.');
    isCourtDeadline = true;
  }

  if (documentType === 'execution_warrant_order21') {
    reasons.push('Execution Warrant (Order 21 CPC): Active court bailiff warrant for delivery of possession or asset attachment.');
    isCourtDeadline = true;
  }

  if (documentType === 'eviction_rent_notice') {
    reasons.push('Eviction / Tenancy Notice: Landlord cannot self-evict without civil court decree. Reply within notice timeline.');
  }

  if (isUnclear) {
    reasons.push('Unreadable or Incomplete Text: Blurry or missing sections prevent automated verification; urgent manual review with court staff or DLSA is advised.');
  }

  if (jurisdictionId.startsWith('unsupported_')) {
    reasons.push('Foreign / Non-Indian Jurisdiction: Nyaya Mitra is strictly focused on Indian Law. Overseas matters require local foreign counsel.');
  }

  // Determine Level
  let level: 'none' | 'soon' | 'urgent' = 'none';
  if (
    documentType === 'cheque_bounce_138' ||
    documentType === 'civil_summons_cpc' ||
    documentType === 'execution_warrant_order21' ||
    documentType === 'eviction_rent_notice'
  ) {
    level = 'urgent';
  } else if (documentType === 'advocate_legal_demand' || documentType === 'consumer_dispute_notice' || isUnclear || jurisdictionId.startsWith('unsupported_')) {
    level = 'soon';
  }

  const referrals = OFFICIAL_LEGAL_AID_CONTACTS[jurisdictionId] || OFFICIAL_LEGAL_AID_CONTACTS.india_national;

  const title =
    level === 'urgent'
      ? 'Urgent Statutory Timeline Detected'
      : level === 'soon'
      ? 'Time-Sensitive Verification Recommended'
      : 'Standard Procedural Guidance';

  const actionRequiredNotice =
    level === 'urgent'
      ? 'Under Indian law, statutory limitations run strictly from the date you received the notice or summons. Preserve speed post tracking and consult an advocate or DLSA (Toll-Free 15100).'
      : 'Review the document details with your local District Legal Services Authority (DLSA) or legal advisor before deadlines lapse.';

  return {
    level,
    title,
    reasons,
    referrals,
    actionRequiredNotice,
    isCourtDeadline
  };
}
