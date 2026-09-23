/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SafetyViolation {
  matchedPhrase: string;
  category: 'prohibited_guarantee' | 'legal_advice' | 'prohibited_instruction' | 'outcome_prediction';
  remedy: string;
}

const PROHIBITED_RULES: Array<{
  pattern: RegExp;
  category: SafetyViolation['category'];
  replacement: string;
  description: string;
}> = [
  {
    pattern: /\b(?:you are safe|you'?re safe|there is no danger)\b/gi,
    category: 'prohibited_guarantee',
    replacement: 'procedural protections may apply, but must be verified with legal aid or the court',
    description: 'False reassurance of safety in eviction proceedings.'
  },
  {
    pattern: /\b(?:you will win|you'?re guaranteed to win|guaranteed dismissal|you have a winning case)\b/gi,
    category: 'outcome_prediction',
    replacement: 'court outcomes depend on evidence and statutory procedure that only a qualified attorney or the court can evaluate',
    description: 'Outcome prediction prohibited.'
  },
  {
    pattern: /\b(?:this (?:is|notice is) (?:definitely |clearly |totally )?illegal|the landlord acted illegally|an illegal eviction)\b/gi,
    category: 'legal_advice',
    replacement: 'the document may have statutory defects that should be evaluated by legal aid or tenant counsel',
    description: 'Definitive determination of illegality.'
  },
  {
    pattern: /\b(?:ignore this (?:notice|summons|demand)|do not (?:respond|answer|worry))\b/gi,
    category: 'prohibited_instruction',
    replacement: 'do not disregard formal notices; immediately verify official requirements with legal aid or the court clerk',
    description: 'Harmful instruction to ignore legal notices.'
  },
  {
    pattern: /\b(?:do not pay(?: the rent)?|withhold your rent)\b/gi,
    category: 'legal_advice',
    replacement: 'rent withholding rules are strictly regulated under California law and require specific legal counseling before taking action',
    description: 'Unsupervised rent withholding advice.'
  },
  {
    pattern: /\b(?:i am your lawyer|as your legal counsel|attorney-client)\b/gi,
    category: 'legal_advice',
    replacement: 'Private Legal Navigator is an informational navigation tool, not an attorney',
    description: 'Unauthorized practice / claiming representation.'
  }
];

export function auditAndSanitizeText(input: string): {
  cleanText: string;
  violationsFound: SafetyViolation[];
  wasModified: boolean;
} {
  if (!input) return { cleanText: '', violationsFound: [], wasModified: false };

  let text = input;
  const violations: SafetyViolation[] = [];
  let wasModified = false;

  for (const rule of PROHIBITED_RULES) {
    rule.pattern.lastIndex = 0;
    const matches = text.match(rule.pattern);
    if (matches && matches.length > 0) {
      matches.forEach(m => {
        violations.push({
          matchedPhrase: m,
          category: rule.category,
          remedy: rule.description
        });
      });
      rule.pattern.lastIndex = 0;
      text = text.replace(rule.pattern, rule.replacement);
      wasModified = true;
    }
  }

  // Ensure mandatory uncertainty framing exists when safety violations were neutralized
  if (wasModified && !text.includes('cannot be determined safely')) {
    text = `${text} (Notice validity and outcomes cannot be determined safely without official advocate or court review.)`;
  }

  return {
    cleanText: text,
    violationsFound: violations,
    wasModified
  };
}

/**
 * Checks if raw text contains any severe safety violation that warrants rejection
 */
export function containsProhibitedLegalConclusion(text: string): boolean {
  return PROHIBITED_RULES.some(rule => {
    rule.pattern.lastIndex = 0;
    const res = rule.pattern.test(text);
    rule.pattern.lastIndex = 0;
    return res;
  });
}
