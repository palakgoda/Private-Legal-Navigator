/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PilotJurisdictionId =
  | 'india_maharashtra'
  | 'india_delhi'
  | 'india_karnataka'
  | 'india_national'
  | 'unsupported_foreign'
  | 'unsupported_other';

export interface JurisdictionConfig {
  id: PilotJurisdictionId;
  name: string;
  region: string;
  state?: string;
  isSupported: boolean;
  courtSystem: string;
  statutes: string[];
  refusalMessage?: string;
}

export type DocumentTypeId =
  | 'cheque_bounce_138'
  | 'eviction_rent_notice'
  | 'civil_summons_cpc'
  | 'consumer_dispute_notice'
  | 'advocate_legal_demand'
  | 'execution_warrant_order21'
  | 'unsupported_general'
  | 'uncertain';

export interface DocumentTypeConfig {
  id: DocumentTypeId;
  displayName: string;
  statutoryBasis: string;
  isSupported: boolean;
  defaultUrgency: 'urgent' | 'soon' | 'standard';
  description: string;
  hindiName?: string;
  marathiName?: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface ExtractedField {
  id: string;
  key:
    | 'jurisdiction'
    | 'documentType'
    | 'courtOrAgency'
    | 'caseNumber'
    | 'statedReason'
    | 'visibleDates'
    | 'serviceDate'
    | 'amountClaimed'
    | 'officialContact';
  label: string;
  value: string | null;
  confidence: ConfidenceLevel;
  userConfirmed: boolean;
  isUnclear: boolean;
  sourceRegion?: {
    page?: number;
    textSnippet: string;
  };
  uncertaintyNote?: string;
}

export type PiiCategory =
  | 'aadhaar_id'
  | 'pan_id'
  | 'tenant_name'
  | 'landlord_name'
  | 'address'
  | 'phone'
  | 'email'
  | 'case_number'
  | 'financial_amount'
  | 'dob';

export interface DetectedPii {
  id: string;
  category: PiiCategory;
  label: string;
  detectedValue: string;
  redactedValue: string;
  reason: string;
  startPos: number;
  endPos: number;
  enabled: boolean;
}

export interface SanitizedPayload {
  jurisdiction: string;
  documentType: string;
  statedReason: string | null;
  visibleDates: string[];
  language: string;
  courtOrAgency?: string | null;
  redactedText?: string;
  unclearItems?: string[];
  containsPii?: boolean;
}

export interface Citation {
  id: string;
  title: string;
  sourceType:
    | 'Supreme Court / High Court'
    | 'National Legal Services Authority (NALSA)'
    | 'State Legal Services Authority'
    | 'Indian Statutory Code'
    | 'eCourts Portal'
    | 'District Legal Services Authority (DLSA)';
  jurisdiction: string;
  url: string;
  lastChecked: string;
  versionOrSection: string;
  summary: string;
}

export interface NextStepItem {
  id: string;
  step: string;
  explanation: string;
  urgency: 'immediate' | 'soon' | 'standard';
  citationId?: string;
  completed?: boolean;
}

export interface DateToVerify {
  id: string;
  dateText: string;
  label: string;
  context: string;
  verificationAdvisory: string;
  urgency: 'high' | 'medium' | 'low';
  confirmedByUser: boolean;
}

export interface OfficialReferral {
  id: string;
  name: string;
  role: string;
  url: string;
  phone?: string;
  freeService: boolean;
  jurisdiction: string;
  notes: string;
  type?: string;
  hours?: string;
  description?: string;
}

export interface NavigatorResult {
  explanation: string;
  datesToVerify: DateToVerify[];
  unknowns: string[];
  nextSteps: NextStepItem[];
  citations: Citation[];
  escalation: 'none' | 'soon' | 'urgent';
  escalationReason?: string;
  officialContacts: OfficialReferral[];
  aiAssisted: boolean;
  sanitizedPayloadUsed?: SanitizedPayload;
  generationTimestamp: string;
}

export interface SyntheticDocumentFixture {
  id: string;
  title: string;
  subtitle: string;
  jurisdictionId: PilotJurisdictionId;
  documentType: DocumentTypeId;
  description: string;
  rawSimulatedText: string;
  targetExpectedPiiCount: number;
  isAdversarial?: boolean;
  isUnsupported?: boolean;
  isLowQuality?: boolean;
}
