/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Citation,
  OfficialReferral,
  PilotJurisdictionId,
  JurisdictionConfig,
  DocumentTypeConfig,
  DocumentTypeId
} from '../types/navigator';

export const JURISDICTIONS: Record<PilotJurisdictionId, JurisdictionConfig> = {
  india_maharashtra: {
    id: 'india_maharashtra',
    name: 'Maharashtra (Mumbai, Pune, Nagpur)',
    region: 'State of Maharashtra',
    isSupported: true,
    courtSystem: 'Bombay High Court, City Civil Court & Court of Small Causes',
    statutes: [
      'Maharashtra Rent Control Act, 1999 (Sections 15 & 16 - Recovery of Possession)',
      'Negotiable Instruments Act, 1881 (Section 138 - Dishonour of Cheque)',
      'Code of Civil Procedure, 1908 (Order 5 - Summons, Order 8 - Written Statement)',
      'Consumer Protection Act, 2019 (District / State Consumer Commission)'
    ]
  },
  india_delhi: {
    id: 'india_delhi',
    name: 'Delhi NCR (New Delhi & Districts)',
    region: 'National Capital Territory of Delhi',
    isSupported: true,
    courtSystem: 'Delhi High Court & District Courts (Tis Hazari, Saket, Patiala House)',
    statutes: [
      'Delhi Rent Control Act, 1958 (Section 14 - Eviction grounds)',
      'Negotiable Instruments Act, 1881 (Section 138)',
      'Code of Civil Procedure, 1908',
      'Transfer of Property Act, 1882 (Section 106)'
    ]
  },
  india_karnataka: {
    id: 'india_karnataka',
    name: 'Karnataka (Bengaluru, Mysuru)',
    region: 'State of Karnataka',
    isSupported: true,
    courtSystem: 'High Court of Karnataka & Bengaluru City Civil Court',
    statutes: [
      'Karnataka Rent Act, 1999',
      'Negotiable Instruments Act, 1881 (Section 138)',
      'Code of Civil Procedure, 1908',
      'Transfer of Property Act, 1882'
    ]
  },
  india_national: {
    id: 'india_national',
    name: 'All-India National Legal Framework',
    region: 'Republic of India (Central Acts)',
    isSupported: true,
    courtSystem: 'Supreme Court of India, High Courts & District Courts under eCourts Portal',
    statutes: [
      'Transfer of Property Act, 1882 (Section 106 - Notice to Quit / Terminate Lease)',
      'Negotiable Instruments Act, 1881 (Section 138 - 15-Day Demand Notice for Cheque Dishonour)',
      'Code of Civil Procedure, 1908 (Order 5 - Summons to Defendant, Order 37 - Summary Suits)',
      'Consumer Protection Act, 2019 (Section 35 - Consumer Complaint & Legal Notice)',
      'Legal Services Authorities Act, 1987 (Free Legal Aid via NALSA & State Legal Services)'
    ]
  },
  unsupported_foreign: {
    id: 'unsupported_foreign',
    name: 'Foreign Jurisdiction (Outside India)',
    region: 'Outside Republic of India',
    isSupported: false,
    courtSystem: 'Non-Indian Judicial System',
    statutes: [],
    refusalMessage: 'Nyaya Mitra is dedicated strictly to Indian Law (Transfer of Property Act, Negotiable Instruments Act 1881, Code of Civil Procedure 1908, Consumer Protection Act 2019). Documents from foreign countries (such as US, UK, Australia) operate under foreign legal codes and cannot be processed under Indian jurisprudence.'
  },
  unsupported_other: {
    id: 'unsupported_other',
    name: 'Non-Indian / Out of Scope Document',
    region: 'Non-Indian Legal Framework',
    isSupported: false,
    courtSystem: 'Unrecognized Forum',
    statutes: [],
    refusalMessage: 'This document does not match supported Indian legal proceedings. Please verify whether this is an Indian civil, tenancy, or financial notice.'
  }
};

export const SUPPORTED_DOCUMENT_TYPES: Record<DocumentTypeId, DocumentTypeConfig> = {
  cheque_bounce_138: {
    id: 'cheque_bounce_138',
    displayName: 'Cheque Bounce Notice under Section 138, NI Act 1881',
    hindiName: 'धारा 138 एनआई एक्ट (चेक बाउंस) कानूनी नोटिस',
    marathiName: 'कलम १३८ एनआय अ‍ॅक्ट (धनादेश अनादरण) कायदेशीर नोटीस',
    statutoryBasis: 'Section 138 & 142 of the Negotiable Instruments Act, 1881',
    isSupported: true,
    defaultUrgency: 'urgent',
    description: 'Statutory demand notice sent by an advocate after a cheque is returned unpaid by the bank due to insufficient funds. The recipient has a strict statutory window of 15 days from notice receipt to pay the cheque amount before a criminal complaint can be filed in court.'
  },
  eviction_rent_notice: {
    id: 'eviction_rent_notice',
    displayName: 'Notice of Eviction / Termination of Tenancy (Rent Act / TPA)',
    hindiName: 'मकान/दुकान खाली करने या किराए की मांग की कानूनी नोटिस',
    marathiName: 'घर/जागा रिकामी करण्याची किंवा भाडे थकबाकीची कायदेशीर नोटीस',
    statutoryBasis: 'Section 106 Transfer of Property Act, 1882 / Section 15-16 Maharashtra Rent Control Act, 1999',
    isSupported: true,
    defaultUrgency: 'urgent',
    description: 'A formal notice issued by a landlord demanding payment of rent arrears or termination of tenancy. In India, a landlord cannot forcefully evict a tenant without a valid statutory notice and a decree from the Competent Civil Court / Rent Controller.'
  },
  civil_summons_cpc: {
    id: 'civil_summons_cpc',
    displayName: 'Civil Court Summons & Plaint Copy (CPC Order 5)',
    hindiName: 'दीवानी अदालत समन एवं वादपत्र (सीपीसी ऑर्डर 5)',
    marathiName: 'दिवाणी न्यायालय समन्स व दाव्याची प्रत (सीपीसी ऑर्डर ५)',
    statutoryBasis: 'Order 5 Rule 1 & Order 8 Rule 1, Code of Civil Procedure, 1908',
    isSupported: true,
    defaultUrgency: 'urgent',
    description: 'An official summons issued by an Indian Civil Court with a court seal and CNR Number. You are summoned to appear in court or through an advocate, and you typically have 30 days (extendable up to 90 days with court permission) to file your Written Statement (W.S.).'
  },
  consumer_dispute_notice: {
    id: 'consumer_dispute_notice',
    displayName: 'Consumer Protection Legal Notice / Commission Complaint',
    hindiName: 'उपभोक्ता संरक्षण कानूनी नोटिस / ग्राहक फोरम शिकायत',
    marathiName: 'ग्राहक संरक्षण कायदेशीर नोटीस / ग्राहक तक्रार निवारण आयोग',
    statutoryBasis: 'Consumer Protection Act, 2019 (Sections 35, 47, 58)',
    isSupported: true,
    defaultUrgency: 'soon',
    description: 'Notice regarding deficiency of service, unfair trade practices, or defective goods before or after filing a complaint before the District Consumer Disputes Redressal Commission (DCDRC).'
  },
  advocate_legal_demand: {
    id: 'advocate_legal_demand',
    displayName: 'Advocate Legal Notice / Demand for Dues or Performance',
    hindiName: 'वकील कानूनी नोटिस / बकाया राशि या समझौते की मांग',
    marathiName: 'वकिलाची कायदेशीर नोटीस / थकबाकी किंवा कराराची पूर्तता मागणी',
    statutoryBasis: 'Indian Contract Act, 1872 & Advocates Act, 1961',
    isSupported: true,
    defaultUrgency: 'soon',
    description: 'A formal legal demand letter sent by an advocate on behalf of a claimant setting out grievances, alleged violations, and granting a period (usually 15 to 30 days) to resolve before civil litigation is initiated.'
  },
  execution_warrant_order21: {
    id: 'execution_warrant_order21',
    displayName: 'Execution Warrant / Bailiff Possession Warrant (Order 21 CPC)',
    hindiName: 'न्यायालयीन निष्पादन वारंट / बेलीफ कब्जा आदेश (सीपीसी ऑर्डर 21)',
    marathiName: 'न्यायालयीन जप्ती / बेलीफ ताबा वॉरंट (सीपीसी ऑर्डर २१)',
    statutoryBasis: 'Order 21 Rule 35, Code of Civil Procedure, 1908',
    isSupported: true,
    defaultUrgency: 'urgent',
    description: 'A court-ordered execution warrant directing the Court Bailiff to deliver possession of property or execute a civil decree. Requires immediate legal intervention or stay application if lawful grounds exist.'
  },
  unsupported_general: {
    id: 'unsupported_general',
    displayName: 'Unsupported Document Category',
    hindiName: 'असमर्थित दस्तावेज़ श्रेणी',
    marathiName: 'असमर्थित दस्तऐवज श्रेणी',
    statutoryBasis: 'N/A',
    isSupported: false,
    defaultUrgency: 'standard',
    description: 'This document appears to be a traffic challan, passport/visa paper, criminal police FIR, or non-civil matter that is outside the scope of Indian civil and tenancy notice analysis.'
  },
  uncertain: {
    id: 'uncertain',
    displayName: 'Uncertain / Low Quality Indian Legal Notice',
    hindiName: 'अस्पष्ट / कम स्पष्टता वाला कानूनी दस्तावेज़',
    marathiName: 'अस्पष्ट / कमी स्पष्टतेचा कायदेशीर दस्तऐवज',
    statutoryBasis: 'N/A',
    isSupported: false,
    defaultUrgency: 'standard',
    description: 'The document image or text is blurry, truncated, or missing key court seals or notice headers. Cannot safely confirm document nature without human inspection.'
  }
};

export const OFFICIAL_SOURCES: Citation[] = [
  {
    id: 'nalsa_official_portal',
    title: 'National Legal Services Authority (NALSA) — Free Legal Aid Services',
    sourceType: 'National Legal Services Authority (NALSA)',
    jurisdiction: 'Republic of India (All States & UTs)',
    url: 'https://nalsa.gov.in',
    lastChecked: '2026-09-23',
    versionOrSection: 'Legal Services Authorities Act, 1987 (Section 12)',
    summary: 'Statutory authority providing free and competent legal services to women, children, senior citizens, SC/ST, and citizens with annual income below ₹3 Lakhs.'
  },
  {
    id: 'ecourts_services_portal',
    title: 'eCourts National Services Portal (eCommittee, Supreme Court of India)',
    sourceType: 'eCourts Portal',
    jurisdiction: 'Republic of India',
    url: 'https://services.ecourts.gov.in',
    lastChecked: '2026-09-23',
    versionOrSection: 'eCourts Digital Services — Case Status by CNR Number & Cause Lists',
    summary: 'Official Government of India portal to search and verify real court summons, daily orders, and upcoming hearings across all District Courts and High Courts.'
  },
  {
    id: 'mslsa_portal',
    title: 'Maharashtra State Legal Services Authority (MSLSA)',
    sourceType: 'State Legal Services Authority',
    jurisdiction: 'State of Maharashtra',
    url: 'https://legalservices.maharashtra.gov.in',
    lastChecked: '2026-09-23',
    versionOrSection: 'Bombay High Court & District Legal Services Authorities (DLSA Mumbai / Pune / Nagpur)',
    summary: 'Provides free advocate representation, panel lawyer assignment, and pre-litigation mediation at district court complexes across Maharashtra.'
  },
  {
    id: 'ni_act_section_138',
    title: 'Negotiable Instruments Act, 1881 — Section 138 (Cheque Dishonour Statutory Rules)',
    sourceType: 'Indian Statutory Code',
    jurisdiction: 'Republic of India',
    url: 'https://www.indiacode.nic.in/handle/123456789/2264',
    lastChecked: '2026-09-23',
    versionOrSection: 'Section 138 & Section 142 (Procedural limitation and 15-day notice clause)',
    summary: 'Mandates that upon receiving a notice of cheque dishonour, the drawer must be given 15 days to tender payment. Only upon failure to pay within 15 days can a complaint be instituted within 30 days thereafter.'
  },
  {
    id: 'cpc_order_5_summons',
    title: 'Code of Civil Procedure, 1908 — Order 5 (Issue and Service of Summons)',
    sourceType: 'Indian Statutory Code',
    jurisdiction: 'Republic of India',
    url: 'https://www.indiacode.nic.in/handle/123456789/2191',
    lastChecked: '2026-09-23',
    versionOrSection: 'Order 5 Rule 1 & Order 8 Rule 1 (Written Statement filing timeline)',
    summary: 'Regulates civil court appearance and sets statutory period of 30 days from date of summons service for the defendant to file a Written Statement of defense.'
  },
  {
    id: 'maha_rent_act_1999',
    title: 'Maharashtra Rent Control Act, 1999 — Sections 15 & 16',
    sourceType: 'Indian Statutory Code',
    jurisdiction: 'State of Maharashtra',
    url: 'https://www.indiacode.nic.in',
    lastChecked: '2026-09-23',
    versionOrSection: 'Maharashtra Act No. 18 of 2000 (Relief against forfeiture & bonafide requirement)',
    summary: 'Protects tenants from arbitrary eviction and stipulates that no suit for recovery of possession shall be instituted without statutory 90-day notice for rent arrears under section 15(2).'
  }
];

export const OFFICIAL_LEGAL_AID_CONTACTS: Record<PilotJurisdictionId, OfficialReferral[]> = {
  india_maharashtra: [
    {
      id: 'nalsa_toll_free',
      name: 'NALSA National Legal Aid Helpline',
      role: 'Free 24x7 Government Legal Aid & Guidance',
      url: 'https://nalsa.gov.in',
      phone: '15100',
      freeService: true,
      jurisdiction: 'All India & Maharashtra',
      notes: 'Toll-free 15100 connects directly to state legal aid authorities in English, Hindi, Marathi, and regional languages.'
    },
    {
      id: 'mslsa_mumbai',
      name: 'Maharashtra State Legal Services Authority (MSLSA)',
      role: 'Free Lawyer Representation & Lok Adalat',
      url: 'https://legalservices.maharashtra.gov.in',
      phone: '022-22691358',
      freeService: true,
      jurisdiction: 'Maharashtra (High Court PWD Building, Fort, Mumbai)',
      notes: 'Assigns free defense advocate to eligible citizens (women, elders, income under ₹3 Lakhs).'
    },
    {
      id: 'dlsa_mumbai_city',
      name: 'District Legal Services Authority (DLSA), City Civil Court Mumbai',
      role: 'District Court Legal Aid Clinic',
      url: 'https://services.ecourts.gov.in',
      phone: '022-22676008',
      freeService: true,
      jurisdiction: 'Mumbai City & Suburbs',
      notes: 'Assistance for civil court summons, Small Causes Court rent matters, and mediation.'
    },
    {
      id: 'ecourts_portal_verify',
      name: 'eCourts Case Status Portal (eCommittee)',
      role: 'Official Government Case Tracking Portal',
      url: 'https://services.ecourts.gov.in',
      freeService: true,
      jurisdiction: 'Maharashtra & All India',
      notes: 'Verify CNR number from court summons to check genuine filing, next hearing date, and court room.'
    }
  ],
  india_delhi: [
    {
      id: 'nalsa_toll_free_delhi',
      name: 'NALSA Legal Aid National Toll-Free',
      role: 'Government Legal Aid Hotline',
      url: 'https://nalsa.gov.in',
      phone: '15100',
      freeService: true,
      jurisdiction: 'All India',
      notes: 'Free advice and panel advocate allocation.'
    },
    {
      id: 'dslsa_central',
      name: 'Delhi State Legal Services Authority (DSLSA)',
      role: 'State Legal Aid Authority',
      url: 'http://dslsa.org',
      phone: '1516 (24x7 Delhi Helpline)',
      freeService: true,
      jurisdiction: 'NCT of Delhi (Patiala House Courts)',
      notes: 'Legal aid clinics at Tis Hazari, Saket, Karkardooma, Rohini, and Dwarka courts.'
    }
  ],
  india_karnataka: [
    {
      id: 'kslsa_bengaluru',
      name: 'Karnataka State Legal Services Authority (KSLSA)',
      role: 'State Legal Services Authority',
      url: 'https://kslsa.kar.nic.in',
      phone: '080-22111730',
      freeService: true,
      jurisdiction: 'Karnataka (High Court Complex, Bengaluru)',
      notes: 'Free legal aid and Lok Adalat for civil disputes.'
    }
  ],
  india_national: [
    {
      id: 'nalsa_central_help',
      name: 'National Legal Services Authority (NALSA)',
      role: 'Apex Government Legal Aid Authority',
      url: 'https://nalsa.gov.in',
      phone: '15100',
      freeService: true,
      jurisdiction: 'Republic of India',
      notes: 'Statutory helpline under Legal Services Authorities Act, 1987.'
    },
    {
      id: 'ecourts_official',
      name: 'eCourts Services (Digital India)',
      role: 'Official National Court Portal',
      url: 'https://services.ecourts.gov.in',
      freeService: true,
      jurisdiction: 'All High Courts & District Courts of India',
      notes: 'Search court case status by CNR number, party name, or court case type.'
    },
    {
      id: 'consumer_helpline_national',
      name: 'National Consumer Helpline (NCH)',
      role: 'Department of Consumer Affairs, Government of India',
      url: 'https://consumerhelpline.gov.in',
      phone: '1915',
      freeService: true,
      jurisdiction: 'Republic of India',
      notes: 'Guidance on consumer notice, unfair trade practices, and filing at eDaakhil.nic.in.'
    }
  ],
  unsupported_foreign: [
    {
      id: 'nalsa_referral_foreign',
      name: 'NALSA Legal Aid Information Center',
      role: 'Indian Legal Referral Authority',
      url: 'https://nalsa.gov.in',
      phone: '15100',
      freeService: true,
      jurisdiction: 'India Only',
      notes: 'Foreign legal notices must be referred to respective consulates or local overseas legal aid.'
    }
  ],
  unsupported_other: [
    {
      id: 'nalsa_referral_other',
      name: 'NALSA Legal Aid Information Center',
      role: 'Indian Legal Referral Authority',
      url: 'https://nalsa.gov.in',
      phone: '15100',
      freeService: true,
      jurisdiction: 'India',
      notes: 'Contact NALSA for civil or criminal legal aid.'
    }
  ]
};
