/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavigatorResult, PilotJurisdictionId, DocumentTypeId } from '../types/navigator';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface SavedAssessment {
  id: string;
  userId: string;
  title: string;
  jurisdictionId: PilotJurisdictionId;
  documentType: DocumentTypeId;
  timestamp?: string;
  createdAt?: string;
  dateFormatted: string;
  urgency: 'urgent' | 'soon' | 'standard' | 'none';
  results: NavigatorResult;
  rawExcerpt?: string;
  statedReason?: string | null;
  visibleDates?: string[];
  extractedFields?: any[];
  detectedPiiCount?: number;
}

const STORAGE_USERS_KEY = 'pln_users_db_v2';
const STORAGE_CURRENT_USER_KEY = 'pln_active_user_v2';
const STORAGE_ASSESSMENTS_KEY = 'pln_saved_assessments_v2';
const GUEST_ID = 'guest_user_local';

export const DEMO_USER: User = {
  id: 'usr_demo_senior_kulkarni',
  name: 'Rameshwar Kulkarni (Senior Citizen)',
  emailOrPhone: 'rameshwar.kulkarni@nyayamitra.in',
  createdAt: '2026-01-15T10:00:00.000Z'
};

// Initialize single demo user and one realistic sample assessment if storage is empty
function initializeUsersStore(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_USERS_KEY);
  if (!existing) {
    // Only ONE full demo profile as requested
    const defaultUsers = [
      {
        id: DEMO_USER.id,
        name: DEMO_USER.name,
        emailOrPhone: DEMO_USER.emailOrPhone,
        passwordHash: 'demo',
        createdAt: DEMO_USER.createdAt
      }
    ];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
  }

  // Also seed ONE realistic saved assessment for this demo profile if assessments store is empty
  const existingAssessments = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  if (!existingAssessments) {
    const demoAssessment: SavedAssessment = {
      id: 'assessment_demo_ni138_kulkarni',
      userId: DEMO_USER.id,
      title: 'Statutory Demand Notice u/s 138 Negotiable Instruments Act',
      createdAt: '2026-02-10T14:30:00.000Z',
      dateFormatted: '10 Feb 2026',
      jurisdictionId: 'india_maharashtra',
      documentType: 'cheque_bounce_138',
      statedReason: 'Alleged dishonour of Cheque No. 458920 for Rs. 1,75,000/- drawn on Bank of Maharashtra on grounds of Funds Insufficient',
      visibleDates: ['10-Feb-2026', '15 days from receipt'],
      urgency: 'urgent',
      detectedPiiCount: 4,
      results: {
        explanation: 'This document is a formal Statutory Demand Notice issued under Section 138 of the Negotiable Instruments Act, 1881. It demands payment of Rs. 1,75,000/- within 15 calendar days from delivery.',
        datesToVerify: [
          {
            id: 'dv_1',
            label: 'Demand Delivery Date',
            dateText: '10-Feb-2026',
            context: 'Date speed post was served at Pune residence',
            verificationAdvisory: 'Verify speed post tracking slip from India Post portal.',
            urgency: 'high',
            confirmedByUser: true
          },
          {
            id: 'dv_2',
            label: '15-Day Statutory Cure Period',
            dateText: '25-Feb-2026',
            context: 'Mandatory 15 calendar days deadline under Section 138 proviso (c)',
            verificationAdvisory: 'Failure to reply or pay within this period allows filing of complaint under Section 142.',
            urgency: 'high',
            confirmedByUser: false
          }
        ],
        unknowns: [
          'Whether the statutory 30-day presentation rule was observed by the payee bank.',
          'Whether the postal acknowledgement receipt bears the actual recipient signature.'
        ],
        nextSteps: [
          {
            id: 'ns_1',
            step: 'Verify Exact Postal Delivery Date',
            explanation: 'Check the India Post speed post tracking slip or envelope delivery stamp to establish day 1 of the 15-day window.',
            urgency: 'immediate',
            completed: true
          },
          {
            id: 'ns_2',
            step: 'Gather Bank Return Memo',
            explanation: 'Obtain the official Bank Return Memo with reason code to verify if signature matched or funds were disputed.',
            urgency: 'immediate',
            completed: false
          },
          {
            id: 'ns_3',
            step: 'Draft Advocate Reply within 15 Days',
            explanation: 'Respond denying liability if cheque was given as security or without legally enforceable debt.',
            urgency: 'soon',
            completed: false
          },
          {
            id: 'ns_4',
            step: 'Contact Free Legal Aid (MSLSA / Pune DLSA)',
            explanation: 'Senior citizens qualify for free legal representation under Legal Services Authorities Act 1987.',
            urgency: 'soon',
            completed: false
          }
        ],
        escalation: 'urgent',
        escalationReason: 'Statutory 15-day payment window under Section 138 NI Act 1881. Expiry allows complainant to file criminal complaint within 30 days under Section 142.',
        officialContacts: [
          {
            id: 'ref_1',
            name: 'National Legal Services Authority (NALSA)',
            role: 'National Legal Aid Authority',
            phone: '15100',
            url: 'https://nalsa.gov.in',
            freeService: true,
            jurisdiction: 'India Central',
            notes: 'Free legal aid and lawyer appointment for senior citizens and disadvantaged groups'
          },
          {
            id: 'ref_2',
            name: 'Maharashtra State Legal Services Authority (MSLSA)',
            role: 'State Legal Aid',
            phone: '022-22691358',
            url: 'https://legalservices.maharashtra.gov.in',
            freeService: true,
            jurisdiction: 'Maharashtra',
            notes: 'State authority offering mediation and panel advocate support in Pune'
          }
        ],
        citations: [
          {
            id: 'cit_1',
            title: 'Negotiable Instruments Act, 1881 — Section 138',
            sourceType: 'Indian Statutory Code',
            jurisdiction: 'India Central',
            url: 'https://www.indiacode.nic.in',
            lastChecked: '2026-01-01',
            versionOrSection: 'Section 138',
            summary: 'Mandates 15-day notice period before any criminal complaint can be filed in court.'
          },
          {
            id: 'cit_2',
            title: 'Negotiable Instruments Act, 1881 — Section 142',
            sourceType: 'Indian Statutory Code',
            jurisdiction: 'India Central',
            url: 'https://www.indiacode.nic.in',
            lastChecked: '2026-01-01',
            versionOrSection: 'Section 142',
            summary: 'Governs 1-month limitation for filing complaint before Judicial Magistrate First Class.'
          }
        ],
        aiAssisted: false,
        generationTimestamp: '2026-02-10T14:30:00.000Z'
      }
    };
    localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify([demoAssessment]));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  initializeUsersStore();
  const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } else {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function loginUser(emailOrPhone: string, password?: string): { success: boolean; user?: User; error?: string } {
  initializeUsersStore();
  const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];

  const found = users.find(
    (u: any) => u.emailOrPhone.toLowerCase() === emailOrPhone.trim().toLowerCase()
  );

  if (!found) {
    // For convenience of Indian citizens, auto-register if password provided
    return registerUser(emailOrPhone.split('@')[0] || 'Indian Citizen', emailOrPhone, password || 'pass123');
  }

  const userObj: User = {
    id: found.id,
    name: found.name,
    emailOrPhone: found.emailOrPhone,
    createdAt: found.createdAt
  };

  setCurrentUser(userObj);
  return { success: true, user: userObj };
}

export function registerUser(name: string, emailOrPhone: string, password?: string): { success: boolean; user?: User; error?: string } {
  initializeUsersStore();
  const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];

  const cleanEmailOrPhone = emailOrPhone.trim().toLowerCase();
  const existing = users.find((u: any) => u.emailOrPhone.toLowerCase() === cleanEmailOrPhone);

  if (existing) {
    const userObj: User = {
      id: existing.id,
      name: existing.name,
      emailOrPhone: existing.emailOrPhone,
      createdAt: existing.createdAt
    };
    setCurrentUser(userObj);
    return { success: true, user: userObj };
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || 'Indian Citizen',
    emailOrPhone: cleanEmailOrPhone,
    passwordHash: password || 'pass123',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  const userObj: User = {
    id: newUser.id,
    name: newUser.name,
    emailOrPhone: newUser.emailOrPhone,
    createdAt: newUser.createdAt
  };

  setCurrentUser(userObj);
  return { success: true, user: userObj };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Scoped Assessments Storage:
export function getSavedAssessments(userId?: string): SavedAssessment[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  if (!raw) return [];
  try {
    const all: SavedAssessment[] = JSON.parse(raw);
    const targetUserId = userId || getCurrentUser()?.id || GUEST_ID;
    return all.filter(a => a.userId === targetUserId);
  } catch {
    return [];
  }
}

export function saveAssessmentRecord(params: {
  title: string;
  jurisdictionId: PilotJurisdictionId;
  documentType: DocumentTypeId;
  urgency: 'urgent' | 'soon' | 'standard';
  results: NavigatorResult;
  rawExcerpt?: string;
  targetUserId?: string;
}): SavedAssessment {
  if (typeof window === 'undefined') {
    throw new Error('Local storage not available');
  }

  const current = getCurrentUser();
  const effectiveUserId = params.targetUserId || (current ? current.id : GUEST_ID);

  const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  const all: SavedAssessment[] = raw ? JSON.parse(raw) : [];

  const newRecord: SavedAssessment = {
    id: `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: effectiveUserId,
    title: params.title || 'Legal Document Assessment',
    jurisdictionId: params.jurisdictionId,
    documentType: params.documentType,
    timestamp: new Date().toISOString(),
    dateFormatted: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    urgency: params.urgency,
    results: params.results,
    rawExcerpt: params.rawExcerpt || ''
  };

  all.unshift(newRecord);
  localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(all));
  return newRecord;
}

export function deleteSavedAssessment(assessmentId: string, currentUserId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  if (!raw) return false;
  try {
    const all: SavedAssessment[] = JSON.parse(raw);
    const effectiveUserId = currentUserId || getCurrentUser()?.id || GUEST_ID;
    const filtered = all.filter(a => !(a.id === assessmentId && a.userId === effectiveUserId));
    localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function saveAssessment(userId: string, assessment: SavedAssessment): SavedAssessment {
  if (typeof window === 'undefined') {
    throw new Error('Local storage not available');
  }

  const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  const all: SavedAssessment[] = raw ? JSON.parse(raw) : [];

  const record: SavedAssessment = {
    ...assessment,
    userId: userId || GUEST_ID,
    id: assessment.id || `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: assessment.timestamp || new Date().toISOString()
  };

  // Remove duplicate if re-saving same id
  const filtered = all.filter(a => a.id !== record.id);
  filtered.unshift(record);

  localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(filtered));
  return record;
}

export function clearAllUserData(userId?: string): void {
  if (typeof window === 'undefined') return;
  const targetUserId = userId || getCurrentUser()?.id || GUEST_ID;
  const raw = localStorage.getItem(STORAGE_ASSESSMENTS_KEY);
  if (raw) {
    try {
      const all: SavedAssessment[] = JSON.parse(raw);
      const remaining = all.filter(a => a.userId !== targetUserId);
      localStorage.setItem(STORAGE_ASSESSMENTS_KEY, JSON.stringify(remaining));
    } catch {
      localStorage.removeItem(STORAGE_ASSESSMENTS_KEY);
    }
  }
}
