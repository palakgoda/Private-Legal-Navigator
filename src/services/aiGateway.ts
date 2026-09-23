/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SanitizedPayload, NavigatorResult, Citation, PilotJurisdictionId, DocumentTypeId } from '../types/navigator';
import { generateDeterministicResults } from './checklistEngine';
import { auditAndSanitizeText } from './safetyFilter';
import { validatePayloadIsSafe } from './piiRedactionService';

export interface AiGatewayResponse {
  success: boolean;
  result: NavigatorResult;
  usedFallback: boolean;
  message?: string;
}

export async function requestSanitizedAiExplanation(params: {
  payload: SanitizedPayload;
  jurisdictionId: PilotJurisdictionId;
  documentType: DocumentTypeId;
  amountClaimed?: string | null;
  caseNumber?: string | null;
  courtOrAgency?: string | null;
}): Promise<AiGatewayResponse> {
  const { payload, jurisdictionId, documentType, amountClaimed, caseNumber, courtOrAgency } = params;

  // 1. Client-Side Pre-Flight Security Validation: Assert NO identifiers exist in payload
  const safetyCheck = validatePayloadIsSafe(payload);
  if (!safetyCheck.isSafe) {
    throw new Error(
      `Cannot send payload: privacy safety check detected potential personal identifiers: ${safetyCheck.violations.join(
        ', '
      )}. Please enable redactions or proceed in Local Mode.`
    );
  }

  // 2. Prepare local deterministic baseline result (guaranteed fallback)
  const localBaseline = generateDeterministicResults({
    jurisdictionId,
    documentType,
    statedReason: payload.statedReason,
    visibleDates: payload.visibleDates,
    caseNumber,
    courtOrAgency,
    amountClaimed,
    isAiAssisted: true,
    sanitizedPayload: payload
  });

  try {
    const response = await fetch('/api/navigator/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      console.warn('AI gateway endpoint returned status:', response.status, errorJson);
      return {
        success: true,
        result: localBaseline,
        usedFallback: true,
        message:
          errorJson.error ||
          'AI assistance was unavailable or disabled. Standard local procedural guidance is displayed.'
      };
    }

    const data = await response.json();
    if (!data || !data.explanation) {
      return {
        success: true,
        result: localBaseline,
        usedFallback: true,
        message: 'AI response was incomplete. Fallback local verified checklist applied.'
      };
    }

    // 3. Apply post-processing deterministic safety filters
    const sanitizedExplanation = auditAndSanitizeText(data.explanation);

    const mergedResult: NavigatorResult = {
      ...localBaseline,
      explanation: sanitizedExplanation.cleanText,
      unknowns: Array.isArray(data.unknowns) && data.unknowns.length > 0 ? data.unknowns : localBaseline.unknowns,
      aiAssisted: true,
      sanitizedPayloadUsed: payload
    };

    return {
      success: true,
      result: mergedResult,
      usedFallback: false
    };
  } catch (err: any) {
    console.warn('Network error calling AI gateway, using local engine:', err?.message);
    return {
      success: true,
      result: localBaseline,
      usedFallback: true,
      message: 'Local procedural engine used (Network request bypassed).'
    };
  }
}
