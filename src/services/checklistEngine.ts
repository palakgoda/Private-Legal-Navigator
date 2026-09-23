/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DocumentTypeId,
  PilotJurisdictionId,
  NextStepItem,
  Citation,
  DateToVerify,
  NavigatorResult,
  OfficialReferral,
  SanitizedPayload
} from '../types/navigator';
import { OFFICIAL_SOURCES, OFFICIAL_LEGAL_AID_CONTACTS, JURISDICTIONS } from './sourceRegistry';

export function generateDeterministicResults(params: {
  jurisdictionId: PilotJurisdictionId;
  documentType: DocumentTypeId;
  statedReason: string | null;
  visibleDates: string[];
  caseNumber?: string | null;
  courtOrAgency?: string | null;
  amountClaimed?: string | null;
  isAiAssisted?: boolean;
  sanitizedPayload?: SanitizedPayload;
}): NavigatorResult {
  const { jurisdictionId, documentType, statedReason, visibleDates, amountClaimed, isAiAssisted, sanitizedPayload } = params;
  const jurisdiction = JURISDICTIONS[jurisdictionId] || JURISDICTIONS.unsupported_other;

  // Handle Unsupported or Foreign Jurisdiction
  if (!jurisdiction.isSupported) {
    const nalsaSource = OFFICIAL_SOURCES.find(s => s.id === 'nalsa_official_portal')!;
    return {
      explanation: `The uploaded document refers to or was selected as ${jurisdiction.name}. Nyaya Mitra is strictly dedicated to Indian Law (Transfer of Property Act, Negotiable Instruments Act 1881, Code of Civil Procedure 1908, Consumer Protection Act 2019). Documents from foreign jurisdictions operate under overseas legal codes and cannot be processed under Indian jurisprudence.`,
      datesToVerify: visibleDates.map((d, i) => ({
        id: `date_unsupported_${i}`,
        dateText: d,
        label: 'Visible Date in Document',
        context: 'Date extracted from document text',
        verificationAdvisory: 'This date is visible in the document, but the application cannot determine legal deadlines for foreign or non-Indian jurisdictions.',
        urgency: 'high',
        confirmedByUser: false
      })),
      unknowns: [
        `Applicable national statutes for ${jurisdiction.name}`,
        'Local court procedural rules and answer filing deadlines',
        'Validity of notice service method under foreign law'
      ],
      nextSteps: [
        {
          id: 'step_nalsa_refusal',
          step: 'Contact NALSA Legal Aid Helpline (15100)',
          explanation: 'For Indian citizens with legal matters in India, contact the National Legal Services Authority helpline at 15100 for free guidance.',
          urgency: 'immediate',
          citationId: 'nalsa_official_portal'
        },
        {
          id: 'step_embassy_consulate',
          step: 'Consult overseas legal counsel or consulate',
          explanation: 'For foreign court matters, contact legal aid in the country of origin or consult the respective embassy/consulate.',
          urgency: 'immediate'
        },
        {
          id: 'step_preserve_records',
          step: 'Preserve all papers, envelopes, and receipts',
          explanation: 'Safely store the original document, the postal envelope showing the speed post tracking or dispatch date, and written communication.',
          urgency: 'standard'
        }
      ],
      citations: [nalsaSource],
      escalation: 'urgent',
      escalationReason: `Document is located in an unsupported foreign jurisdiction (${jurisdiction.name}). Non-Indian foreign law cannot be evaluated.`,
      officialContacts: OFFICIAL_LEGAL_AID_CONTACTS[jurisdictionId] || OFFICIAL_LEGAL_AID_CONTACTS.unsupported_other,
      aiAssisted: isAiAssisted || false,
      sanitizedPayloadUsed: sanitizedPayload,
      generationTimestamp: new Date().toISOString()
    };
  }

  // Handle Unsupported or Uncertain Document Type
  if (documentType === 'unsupported_general' || documentType === 'uncertain') {
    const nalsaSource = OFFICIAL_SOURCES.find(s => s.id === 'nalsa_official_portal')!;
    const ecourtsSource = OFFICIAL_SOURCES.find(s => s.id === 'ecourts_services_portal')!;
    return {
      explanation:
        'The document appears to be outside supported Indian civil, tenancy, or financial notice categories (such as traffic challans, police complaints, or unreadable pages), or its legal nature could not be verified safely from the text alone.',
      datesToVerify: visibleDates.map((d, i) => ({
        id: `date_unclear_${i}`,
        dateText: d,
        label: 'Visible Date in Document',
        context: 'Visible text date',
        verificationAdvisory: 'This date is visible in the document, but the application cannot determine whether it represents a binding statutory limitation date.',
        urgency: 'medium',
        confirmedByUser: false
      })),
      unknowns: [
        'Document classification and governing statutory authority under Indian law',
        'Whether any court filing or statutory limitation period has started',
        'Completeness of document pages, advocate signature, and official seal'
      ],
      nextSteps: [
        {
          id: 'step_dlsa_inquiry',
          step: 'Visit your nearest District Legal Services Authority (DLSA)',
          explanation: 'Carry the physical document to the legal aid clinic located in your local District Court complex for a free in-person review by an empaneled advocate.',
          urgency: 'immediate',
          citationId: 'nalsa_official_portal'
        },
        {
          id: 'step_verify_ecourts',
          step: 'Check eCourts portal if a case number is present',
          explanation: 'If a CNR or Suit Number appears on the paper, search it on services.ecourts.gov.in to confirm if an official court matter exists.',
          urgency: 'soon',
          citationId: 'ecourts_services_portal'
        },
        {
          id: 'step_do_not_sign',
          step: 'Do not sign blank papers or hand over original documents',
          explanation: 'Keep the original notice safe. Only share photocopies when seeking advice until you have verified the nature of the demand.',
          urgency: 'standard'
        }
      ],
      citations: [nalsaSource, ecourtsSource],
      escalation: 'soon',
      escalationReason: 'Uncertain document type. Physical inspection by an empaneled advocate at DLSA is recommended.',
      officialContacts: OFFICIAL_LEGAL_AID_CONTACTS[jurisdictionId] || OFFICIAL_LEGAL_AID_CONTACTS.india_national,
      aiAssisted: isAiAssisted || false,
      sanitizedPayloadUsed: sanitizedPayload,
      generationTimestamp: new Date().toISOString()
    };
  }

  // Document Type Specific Logic (Strictly Indian Law)
  let explanation = '';
  let unknowns: string[] = [];
  let nextSteps: NextStepItem[] = [];
  let citations: Citation[] = [];
  let escalation: 'none' | 'soon' | 'urgent' = 'soon';
  let escalationReason: string | undefined;

  const nalsaSource = OFFICIAL_SOURCES.find(s => s.id === 'nalsa_official_portal')!;
  const ecourtsSource = OFFICIAL_SOURCES.find(s => s.id === 'ecourts_services_portal')!;

  // 1. Cheque Bounce Notice under Section 138 NI Act
  if (documentType === 'cheque_bounce_138') {
    const niSource = OFFICIAL_SOURCES.find(s => s.id === 'ni_act_section_138')!;
    citations = [niSource, nalsaSource];
    escalation = 'urgent';
    escalationReason =
      'CRITICAL STATUTORY DEADLINE: Under Section 138 of the Negotiable Instruments Act, 1881, the recipient has strictly 15 DAYS from the date of receipt of this notice to make payment before a criminal complaint can be filed in the Magistrate Court.';

    explanation = `This document appears to be a formal Statutory Legal Notice under Section 138 of the Negotiable Instruments Act, 1881, regarding a dishonoured cheque${amountClaimed ? ` in the amount of ${amountClaimed}` : ''}. The sender's advocate demands payment within 15 days of receiving the notice. Under Indian law, if payment is not tendered within 15 days of notice receipt, the complainant is legally entitled to file a criminal complaint before the Judicial Magistrate / Metropolitan Magistrate Court within 30 days thereafter.`;

    unknowns = [
      'Exact date of delivery / postal service of this notice (the 15-day clock begins on receipt, not on dispatch)',
      'Reason given by the bank on the Cheque Return Memo (e.g., Funds Insufficient, Account Closed, Signature Mismatch)',
      'Whether the cheque was issued for an existing legally enforceable debt or liability',
      'Whether the notice was dispatched within the statutory 30-day window from the bank return memo date'
    ];

    nextSteps = [
      {
        id: 'step_ni_15day_receipt',
        step: 'Confirm 15-Day statutory notice receipt date (Postal / Speed Post / WhatsApp)',
        explanation: 'Preserve the registered post envelope, speed post consignment number, or WhatsApp delivery tick. In Indian courts, limitation begins strictly from the date you received the notice.',
        urgency: 'immediate',
        citationId: 'ni_act_section_138'
      },
      {
        id: 'step_ni_bank_memo',
        step: 'Obtain copy of Cheque Return Memo and bank statements',
        explanation: 'Check your bank account statement on the date the cheque was presented. Verify whether sufficient funds existed or if a stop-payment instruction was given with valid cause.',
        urgency: 'immediate'
      },
      {
        id: 'step_ni_reply_notice',
        step: 'Consult an advocate to draft a formal Reply Notice within 15 days',
        explanation: 'Sending a timely written reply by an advocate denying wrongful liability, setting out defenses (e.g., security cheque, loan repaid, or disputed bill), is crucial for criminal trial defense.',
        urgency: 'immediate',
        citationId: 'ni_act_section_138'
      },
      {
        id: 'step_ni_free_legal_aid',
        step: 'Approach DLSA or call NALSA 15100 if unable to afford a private lawyer',
        explanation: 'Under Section 12 of Legal Services Authorities Act, eligible citizens (including all women, senior citizens, and persons earning under ₹3 Lakhs/year) receive free advocate representation.',
        urgency: 'soon',
        citationId: 'nalsa_official_portal'
      },
      {
        id: 'step_ni_settlement',
        step: 'Explore amicable settlement or Lok Adalat conciliation if amount is due',
        explanation: 'Section 138 offenses are compoundable under Section 147 NI Act. Lok Adalat can record a settlement without criminal conviction if parties mutually agree on payment terms.',
        urgency: 'standard'
      }
    ];
  }

  // 2. Eviction / Rent Notice (Transfer of Property Act / State Rent Control Act)
  else if (documentType === 'eviction_rent_notice') {
    const rentSource =
      jurisdictionId === 'india_maharashtra'
        ? OFFICIAL_SOURCES.find(s => s.id === 'maha_rent_act_1999')!
        : nalsaSource;
    citations = [rentSource, nalsaSource];
    escalation = 'urgent';
    escalationReason =
      'EVICTION NOTICE: Under Indian tenancy law (Transfer of Property Act s. 106 and State Rent Control Acts), a landlord cannot forcefully dispossess a tenant without a valid statutory notice and a decree from the Competent Civil Court / Rent Controller.';

    explanation = `This document appears to be an Eviction Notice or Notice to Vacate under Indian Tenancy Law${statedReason ? ` citing: "${statedReason}"` : ''}. Under the law of India (Section 106 Transfer of Property Act 1882 or State Rent Acts), a landlord cannot self-help evict a tenant or cut electricity/water supplies. A landlord must serve a formal notice and obtain a decree of eviction from the Competent Civil Court or Rent Authority.`;

    unknowns = [
      'Whether the tenancy is covered by State Rent Control Act (statutory tenant) or a registered Leave & License Agreement',
      'Proof of rent payments and rent receipts (whether alleged arrears are factually accurate)',
      'Statutory validity of the notice period (typically 15 to 30 days under s. 106 TPA, or 90 days for rent arrears under s. 15(2) Maharashtra Rent Control Act)',
      'Whether municipal essential services (water, electricity) have been unlawfully interfered with'
    ];

    nextSteps = [
      {
        id: 'step_rent_receipts',
        step: 'Gather all rent receipts, UPI transfer screenshots, and bank statements',
        explanation: 'Collect written proof of all rental payments made over the past 12 to 24 months to refute any false claims of rent default.',
        urgency: 'immediate'
      },
      {
        id: 'step_rent_reply',
        step: 'Send a formal Reply through an advocate within the notice timeline',
        explanation: 'Do not ignore the notice. State clearly that rent has been tendered, dispute unjustified grounds, and affirm that forceful eviction is illegal.',
        urgency: 'immediate',
        citationId: rentSource.id
      },
      {
        id: 'step_rent_police_protection',
        step: 'Know your rights against harassment or essential utility cutoff',
        explanation: 'Section 29 of Maharashtra Rent Control Act and similar State Acts make cutting off water, electricity, or locking gates by a landlord a cognizable criminal offense punishable with imprisonment.',
        urgency: 'soon'
      },
      {
        id: 'step_rent_dlsa',
        step: 'Contact District Legal Services Authority (DLSA) for free representation',
        explanation: 'Tenants facing eviction who cannot afford legal fees can request a panel advocate through DLSA at the local civil court complex.',
        urgency: 'soon',
        citationId: 'nalsa_official_portal'
      }
    ];
  }

  // 3. Civil Court Summons (Order 5 CPC)
  else if (documentType === 'civil_summons_cpc') {
    const cpcSource = OFFICIAL_SOURCES.find(s => s.id === 'cpc_order_5_summons')!;
    citations = [cpcSource, ecourtsSource, nalsaSource];
    escalation = 'urgent';
    escalationReason =
      'OFFICIAL COURT SUMMONS: Issued under Code of Civil Procedure (CPC Order 5). You must appear or file a Written Statement within 30 days. Failure to appear may result in an ex-parte (one-sided) decree against you.';

    explanation = `This document appears to be an official Court Summons issued by an Indian Civil Court under Order 5 of the Code of Civil Procedure, 1908. It informs you that a lawsuit (Plaint) has been filed against you. Under Order 8 Rule 1 CPC, you have 30 days from the date of summons service to file your defense (Written Statement - W.S.). If neither you nor an advocate appears on the designated hearing date, the court may proceed "Ex-Parte" and pass an order in your absence.`;

    unknowns = [
      'CNR Number status on the official eCourts Portal (services.ecourts.gov.in)',
      'Exact date of service by the Court Bailiff or registered post',
      'Whether complete copies of the Plaint and all supporting documents were delivered with the summons'
    ];

    nextSteps = [
      {
        id: 'step_cpc_ecourts_verify',
        step: 'Verify CNR Number & Court Room on the official eCourts Portal',
        explanation: 'Visit services.ecourts.gov.in or download the eCourts Services mobile app. Enter the 16-character CNR number to verify the case title, judge name, and next hearing date.',
        urgency: 'immediate',
        citationId: 'ecourts_services_portal'
      },
      {
        id: 'step_cpc_vakalatnama',
        step: 'Engage an advocate and execute a Vakalatnama',
        explanation: 'Authorize a licensed advocate by signing a Vakalatnama so they can file their appearance (Memo of Appearance) in court on the hearing date.',
        urgency: 'immediate',
        citationId: 'cpc_order_5_summons'
      },
      {
        id: 'step_cpc_written_statement',
        step: 'Prepare Written Statement (W.S.) within the 30-day statutory timeline',
        explanation: 'Under Order 8 Rule 1 CPC, provide your advocate with parawise replies to every allegation in the plaint, along with supporting document copies.',
        urgency: 'immediate',
        citationId: 'cpc_order_5_summons'
      },
      {
        id: 'step_cpc_dlsa_aid',
        step: 'Request free court-appointed panel lawyer from DLSA if eligible',
        explanation: 'If you cannot afford an advocate, submit an application to the District Legal Services Authority (DLSA) in the court complex before the appearance date.',
        urgency: 'soon',
        citationId: 'nalsa_official_portal'
      }
    ];
  }

  // 4. Consumer Dispute Notice
  else if (documentType === 'consumer_dispute_notice') {
    citations = [nalsaSource];
    escalation = 'soon';
    escalationReason =
      'CONSUMER COMPLAINT: Governed by Consumer Protection Act 2019. Check if matter is at pre-litigation legal notice stage or before District Consumer Disputes Redressal Commission.';

    explanation = `This document appears to be a Legal Notice or complaint under the Consumer Protection Act, 2019. It alleges deficiency in service, unfair trade practices, or defective products. Consumer commissions in India provide a summary dispute mechanism, and parties often resolve matters through the National Consumer Helpline or Consumer Mediation Cells.`;

    unknowns = [
      'Whether a formal complaint has been numbered on eDaakhil.nic.in',
      'Original purchase invoices, service terms, and warranty cards',
      'Whether manufacturer or seller has provided an alternate remedy'
    ];

    nextSteps = [
      {
        id: 'step_consumer_helpline',
        step: 'Call National Consumer Helpline (1915) for guidance',
        explanation: 'The Department of Consumer Affairs provides free toll-free support at 1915 and online at consumerhelpline.gov.in for docketing pre-litigation grievances.',
        urgency: 'immediate'
      },
      {
        id: 'step_consumer_edaakhil',
        step: 'Check case status on eDaakhil Portal',
        explanation: 'Visit edaakhil.nic.in to see if a formal consumer complaint has been registered with the District Consumer Commission.',
        urgency: 'soon'
      },
      {
        id: 'step_consumer_reply',
        step: 'Draft a factual reply outlining terms of service or transaction records',
        explanation: 'Respond with transaction receipts, warranty terms, and evidence of reasonable service provided.',
        urgency: 'standard'
      }
    ];
  }

  // 5. Advocate Legal Demand Notice
  else if (documentType === 'advocate_legal_demand') {
    citations = [nalsaSource];
    escalation = 'soon';
    escalationReason =
      'LEGAL DEMAND NOTICE: A formal pre-litigation notice issued by an advocate. Answering with a formal written reply helps prevent one-sided civil litigation.';

    explanation = `This document appears to be a formal Legal Demand Notice sent by an advocate on behalf of a claimant. It specifies grievances, demands compliance or financial payment, and gives a timeline (typically 15 to 30 days) before initiating legal proceedings in a civil court.`;

    unknowns = [
      'Exact date you received the notice (preserves proof of replying within the demand period)',
      'Validity of the claims and whether an underlying agreement or contract exists',
      'Whether past payments or correspondences were suppressed by the sender'
    ];

    nextSteps = [
      {
        id: 'step_demand_save_envelope',
        step: 'Preserve postal envelope with tracking number and delivery date',
        explanation: 'The envelope bearing the Speed Post / Registered Post tracking bar-code proves the exact date of receipt in court.',
        urgency: 'immediate'
      },
      {
        id: 'step_demand_reply',
        step: 'Engage an advocate or DLSA panel lawyer to draft a formal Reply',
        explanation: 'A parawise reply drafted by an advocate sets your defense on the legal record and deters frivolous civil suits.',
        urgency: 'immediate'
      },
      {
        id: 'step_demand_records',
        step: 'Compile all signed agreements, receipts, and communication logs',
        explanation: 'Assemble emails, WhatsApp chats, bills, and signed agreements relevant to the dispute.',
        urgency: 'soon'
      }
    ];
  }

  // 6. Execution Warrant / Bailiff (Order 21 CPC)
  else if (documentType === 'execution_warrant_order21') {
    const cpcSource = OFFICIAL_SOURCES.find(s => s.id === 'cpc_order_5_summons')!;
    citations = [cpcSource, nalsaSource];
    escalation = 'urgent';
    escalationReason =
      'URGENT EXECUTION ORDER: This document indicates an active court decree is being executed by the Court Bailiff. Immediate legal intervention is required to avoid possession loss or asset attachment.';

    explanation = `This document appears to be an Execution Warrant or Bailiff Order issued by an Indian Civil Court under Order 21 of the Code of Civil Procedure, 1908. It directs the Court Bailiff to execute a decree, which may involve taking physical possession of property or attaching assets.`;

    unknowns = [
      'Original court decree number and whether an ex-parte decree was passed',
      'Whether an Appeal or Stay Application has been filed before the District Court or High Court',
      'Identity of the executing bailiff and court execution date'
    ];

    nextSteps = [
      {
        id: 'step_exec_urgent_stay',
        step: 'Instruct an advocate to file an Urgent Application for Stay of Execution',
        explanation: 'Approach the executing court or appellate court immediately with an application under Order 21 Rule 26 / Section 151 CPC for a stay of warrant execution.',
        urgency: 'immediate',
        citationId: cpcSource.id
      },
      {
        id: 'step_exec_ecourts',
        step: 'Check Execution Petition (E.P.) details on eCourts Portal',
        explanation: 'Find the Execution Petition number and date of decree on services.ecourts.gov.in.',
        urgency: 'immediate',
        citationId: 'ecourts_services_portal'
      },
      {
        id: 'step_exec_dlsa_emergency',
        step: 'Seek emergency assistance from District Legal Services Authority (DLSA)',
        explanation: 'DLSA front offices provide immediate duty counsels for citizens facing imminent dispossession.',
        urgency: 'immediate',
        citationId: 'nalsa_official_portal'
      }
    ];
  }

  // Map dates with verification advisories
  const datesToVerify: DateToVerify[] = visibleDates.map((d, idx) => ({
    id: `dt_${idx}`,
    dateText: d,
    label: idx === 0 ? 'Document / Notice Date' : 'Appearance / Demand Date',
    context: `Visible text in document`,
    verificationAdvisory:
      'This date is visible in the notice, but statutory limitation periods under Indian law (such as the 15-day window under Section 138 NI Act or 30-day WS period under CPC) run strictly from the date of official receipt or service, not merely from the date typed on the notice. Please verify service records.',
    urgency: escalation === 'urgent' ? 'high' : 'medium',
    confirmedByUser: false
  }));

  return {
    explanation,
    datesToVerify,
    unknowns,
    nextSteps,
    citations,
    escalation,
    escalationReason,
    officialContacts: OFFICIAL_LEGAL_AID_CONTACTS[jurisdictionId] || OFFICIAL_LEGAL_AID_CONTACTS.india_national,
    aiAssisted: isAiAssisted || false,
    sanitizedPayloadUsed: sanitizedPayload,
    generationTimestamp: new Date().toISOString()
  };
}
