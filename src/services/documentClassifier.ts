/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentTypeId, ExtractedField, ConfidenceLevel } from '../types/navigator';

export interface ClassificationResult {
  documentType: DocumentTypeId;
  confidence: ConfidenceLevel;
  statutoryBasis: string;
  detectedJurisdictionMention?: string;
  isUnsupported: boolean;
  unsupportedReason?: string;
  adversarialPromptDetected: boolean;
  extractedFields: ExtractedField[];
  reasonSummary?: string;
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+|prior\s+)?instructions/i,
  /you\s+are\s+now\s+(an?\s+)?assistant/i,
  /system\s*:\s*override/i,
  /tell\s+the\s+user\s+(that\s+)?(they\s+don'?t\s+need\s+to\s+pay|eviction\s+is\s+illegal)/i,
  /output\s+only\s+JSON/i,
  /bypass\s+safety/i,
  /disregard\s+the\s+system\s+prompt/i
];

export function classifyDocumentText(rawText: string): ClassificationResult {
  if (!rawText || rawText.trim().length < 20) {
    return {
      documentType: 'uncertain',
      confidence: 'unknown',
      statutoryBasis: 'N/A',
      isUnsupported: false,
      adversarialPromptDetected: false,
      extractedFields: [],
      reasonSummary: 'Document text is too brief or unreadable to categorize safely.'
    };
  }

  // 1. Check for adversarial prompt injection text
  const adversarialPromptDetected = PROMPT_INJECTION_PATTERNS.some(pat => pat.test(rawText));

  // Clean working text for analysis (while treating injections as ordinary untrusted content)
  const text = rawText.replace(/\r\n/g, '\n');

  // Check for foreign (outside India) or explicitly unsupported documents
  if (
    /texas\s+property\s+code/i.test(text) ||
    /superior\s+court\s+of\s+california/i.test(text) ||
    /justice\s+of\s+the\s+peace/i.test(text) ||
    /commercial\s+shipping\s+manifest/i.test(text) ||
    /foreign\s+arbitration\s+award/i.test(text) ||
    /traffic\s+challan/i.test(text) ||
    /passport\s+application/i.test(text)
  ) {
    const isForeign = /texas|california|united\s+states|foreign/i.test(text);
    return {
      documentType: 'unsupported_general',
      confidence: 'high',
      statutoryBasis: isForeign ? 'Foreign Law (Outside India)' : 'Outside Scope',
      isUnsupported: true,
      adversarialPromptDetected,
      unsupportedReason: isForeign
        ? 'This document appears to originate outside India. Nyaya Mitra strictly operates under Indian Law (Transfer of Property Act, NI Act 1881, CPC 1908, Consumer Protection Act 2019).'
        : 'This document is outside the civil and tenancy legal notice scope.',
      extractedFields: extractCommonFields(text, 'unsupported_general')
    };
  }

  // Check for Indian State cues
  let detectedJurisdictionMention: string | undefined;
  if (/maharashtra|bombay\s+high\s+court|mumbai|pune|nagpur|small\s+causes\s+court/i.test(text)) {
    detectedJurisdictionMention = 'Maharashtra';
  } else if (/delhi|new\s+delhi|tis\s+hazari|saket|patiala\s+house/i.test(text)) {
    detectedJurisdictionMention = 'Delhi';
  } else if (/karnataka|bengaluru|bangalore|mysuru/i.test(text)) {
    detectedJurisdictionMention = 'Karnataka';
  } else {
    detectedJurisdictionMention = 'All India (Central Acts)';
  }

  // Check for low quality / blurry markers
  if (/\[blurry|unreadable|illegible|damaged\s+document\]/i.test(text)) {
    return {
      documentType: 'uncertain',
      confidence: 'low',
      statutoryBasis: 'Unclear Due to Low Document Quality',
      detectedJurisdictionMention,
      isUnsupported: false,
      adversarialPromptDetected,
      extractedFields: extractCommonFields(text, 'uncertain'),
      reasonSummary: 'Document contains blurry or illegible segments preventing definitive classification.'
    };
  }

  // 2. Identify Indian Legal Document Type
  let documentType: DocumentTypeId = 'uncertain';
  let confidence: ConfidenceLevel = 'low';
  let statutoryBasis = 'N/A';
  let reasonSummary = '';

  // A. Cheque Bounce Notice under Section 138 NI Act
  if (
    (/section\s+138/i.test(text) && /negotiable\s+instruments/i.test(text)) ||
    (/cheque\s+(?:no|number|dated)/i.test(text) && /dishonour|returned\s+unpaid|insufficient\s+funds/i.test(text)) ||
    (/notice\s+under\s+section\s+138/i.test(text)) ||
    (/15\s+days/i.test(text) && /cheque/i.test(text) && /demand/i.test(text))
  ) {
    documentType = 'cheque_bounce_138';
    confidence = 'high';
    statutoryBasis = 'Section 138 & 142 of the Negotiable Instruments Act, 1881';
    reasonSummary = 'Demand notice regarding dishonoured cheque with statutory 15-day payment demand.';
  }
  // B. Civil Court Summons (Order 5 CPC)
  else if (
    (/summons\s+to\s+defendant/i.test(text) || /in\s+the\s+court\s+of/i.test(text)) &&
    (/order\s+(?:5|v)/i.test(text) || /code\s+of\s+civil\s+procedure|c\.?p\.?c\.?/i.test(text) || /written\s+statement/i.test(text) || /cnr\s+no/i.test(text))
  ) {
    documentType = 'civil_summons_cpc';
    confidence = 'high';
    statutoryBasis = 'Order 5 Rule 1 & Order 8 Rule 1, Code of Civil Procedure, 1908';
    reasonSummary = 'Official court summons requiring appearance and submission of Written Statement.';
  }
  // C. Eviction / Tenancy Notice under Rent Act / TPA
  else if (
    (/notice\s+to\s+(?:quit|vacate)/i.test(text) ||
      /transfer\s+of\s+property\s+act.*106/i.test(text) ||
      /maharashtra\s+rent\s+control\s+act/i.test(text) ||
      /delhi\s+rent\s+control\s+act/i.test(text) ||
      (/hand\s+over.*vacant.*possession/i.test(text) && /tenant|landlord/i.test(text)) ||
      (/rent\s+in\s+the\s+sum\s+of/i.test(text) && /quit|vacate/i.test(text)) ||
      (/(?:3-?\s*day\s+)?notice\s+to\s+(?:pay\s+rent\s+|pay\s+)?or\s+quit/i.test(text)))
  ) {
    documentType = 'eviction_rent_notice';
    confidence = 'high';
    statutoryBasis = 'Section 106 Transfer of Property Act 1882 / State Rent Control Acts';
    reasonSummary = 'Notice demanding vacant possession or clearing of tenancy rent arrears.';
  }
  // D. Consumer Disputes Redressal Notice
  else if (
    /consumer\s+protection\s+act/i.test(text) ||
    /district\s+consumer/i.test(text) ||
    /consumer\s+disputes\s+redressal/i.test(text) ||
    /deficiency\s+(?:of|in)\s+service/i.test(text)
  ) {
    documentType = 'consumer_dispute_notice';
    confidence = 'high';
    statutoryBasis = 'Consumer Protection Act, 2019';
    reasonSummary = 'Notice alleging deficiency in service or unfair trade practice under Consumer Law.';
  }
  // E. Execution / Bailiff Warrant (Order 21 CPC)
  else if (
    /execution\s+(?:petition|warrant)/i.test(text) ||
    /order\s+21/i.test(text) ||
    /warrant\s+of\s+possession/i.test(text) ||
    /bailiff/i.test(text)
  ) {
    documentType = 'execution_warrant_order21';
    confidence = 'high';
    statutoryBasis = 'Order 21 Rule 35, Code of Civil Procedure, 1908';
    reasonSummary = 'Court execution warrant directing delivery of possession or attachment of property.';
  }
  // F. Advocate Legal Demand Notice
  else if (
    /under\s+instructions\s+from\s+my\s+client/i.test(text) ||
    /legal\s+notice/i.test(text) ||
    /call\s+upon\s+you\s+to/i.test(text) ||
    /failing\s+which\s+my\s+client\s+shall\s+initiate/i.test(text)
  ) {
    documentType = 'advocate_legal_demand';
    confidence = 'medium';
    statutoryBasis = 'Advocate Legal Notice / Indian Contract Act, 1872';
    reasonSummary = 'Pre-litigation legal demand notice served by an advocate on behalf of a client.';
  }
  else {
    documentType = 'uncertain';
    confidence = 'low';
    statutoryBasis = 'General Indian Civil Matter';
    reasonSummary = 'Document text does not match specific statutory notice patterns.';
  }

  const extractedFields = extractCommonFields(text, documentType);

  return {
    documentType,
    confidence,
    statutoryBasis,
    detectedJurisdictionMention,
    isUnsupported: false,
    adversarialPromptDetected,
    extractedFields,
    reasonSummary
  };
}

function extractCommonFields(text: string, docType: DocumentTypeId): ExtractedField[] {
  const fields: ExtractedField[] = [];

  // Court or Agency
  const courtMatch = text.match(/(?:In the Court of|Before the|Court of|Tribunal|Commission)\s*[:\-]?\s*([A-Za-z0-9\s,\.]{5,60})/i);
  fields.push({
    id: 'f_court',
    key: 'courtOrAgency',
    label: 'Court, Forum or Sender Office',
    value: courtMatch ? courtMatch[1].trim() : docType === 'civil_summons_cpc' ? 'Civil Court' : 'Advocate / Sender Office',
    confidence: courtMatch ? 'high' : 'medium',
    userConfirmed: false,
    isUnclear: !courtMatch && docType === 'civil_summons_cpc'
  });

  // Case / CNR Number
  const caseMatch = text.match(/\b(?:CNR\s*(?:No\.?)?|Case\s*(?:No\.?|Number|#)?|Suit\s*No\.?|C\.?C\.?\s*No\.?)\s*[:#]?\s*([A-Z0-9\-\/]{4,20})\b/i);
  fields.push({
    id: 'f_case',
    key: 'caseNumber',
    label: 'Case / CNR / Reference Number',
    value: caseMatch ? caseMatch[1].trim() : null,
    confidence: caseMatch ? 'high' : 'low',
    userConfirmed: false,
    isUnclear: !caseMatch
  });

  // Stated Reason
  let reason = '';
  if (/cheque/i.test(text) && /dishonour|insufficient/i.test(text)) {
    reason = 'Dishonour of cheque due to insufficient funds (Section 138 NI Act)';
  } else if (/rent/i.test(text) && /unpaid|arrears|due/i.test(text)) {
    reason = 'Non-payment of tenancy rent arrears';
  } else if (/recovery\s+of\s+money/i.test(text)) {
    reason = 'Recovery of money and outstanding dues';
  } else if (/vacate|possession/i.test(text)) {
    reason = 'Demand for vacant possession of premises';
  }

  fields.push({
    id: 'f_reason',
    key: 'statedReason',
    label: 'Primary Grievance / Stated Reason',
    value: reason || 'Legal demand specified in notice',
    confidence: reason ? 'high' : 'medium',
    userConfirmed: false,
    isUnclear: !reason
  });

  // Visible Dates
  const dateRegex = /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*,?\s*\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/gi;
  const foundDates: string[] = [];
  let dMatch: RegExpExecArray | null;
  while ((dMatch = dateRegex.exec(text)) !== null) {
    foundDates.push(dMatch[0]);
  }

  const isLowQuality = /\[blurry|unreadable|damaged\]/i.test(text);

  fields.push({
    id: 'f_dates',
    key: 'visibleDates',
    label: 'Visible Dates in Document',
    value: foundDates.length > 0 ? Array.from(new Set(foundDates)).join(', ') : isLowQuality ? 'Unreadable / Damaged Date' : null,
    confidence: isLowQuality ? 'low' : foundDates.length > 0 ? 'high' : 'low',
    userConfirmed: false,
    isUnclear: isLowQuality || foundDates.length === 0,
    uncertaintyNote: isLowQuality
      ? 'Date text is partially damaged or unreadable. Exact limitation or response deadline cannot be determined safely without original.'
      : undefined
  });

  // Financial Amount Claimed
  const amountMatch = text.match(/(?:₹|Rs\.?|INR|\$)\s?[0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?(?:\s*\/-)?/i);
  fields.push({
    id: 'f_amount',
    key: 'amountClaimed',
    label: 'Monetary Amount Claimed (₹)',
    value: amountMatch ? amountMatch[0].trim() : null,
    confidence: amountMatch ? 'high' : 'medium',
    userConfirmed: false,
    isUnclear: !amountMatch
  });

  return fields;
}
