# Project Requirements: Private Legal Navigator

## 1. Product summary
Private Legal Navigator is a local-first assistant that helps a person understand one supported category of urgent legal document, beginning with eviction notices and court papers. It extracts only the information required for navigation, explains the document in plain language, identifies uncertainty, provides a source-linked checklist, and connects the user to official court and legal-aid resources.

The product provides legal information and navigation. It is not a lawyer, does not create an attorney-client relationship, and must not determine whether a legal action is valid or predict a case outcome.

## 2. Pilot Jurisdiction & Scope
- **Pilot Jurisdiction:** California (Alameda County, San Francisco, and California Superior Courts under California Code of Civil Procedure § 1161 et seq.).
- **Supported Document Types:**
  1. 3-Day Notice to Pay Rent or Quit (CCP § 1161(2))
  2. 3-Day Notice to Perform Covenants or Quit / Cure or Quit (CCP § 1161(3))
  3. 30-Day / 60-Day Notice of Termination of Tenancy (Cal. Civ. Code § 1946.1 / Tenant Protection Act)
  4. Summons & Complaint for Unlawful Detainer (Formal Court Action - Form SUM-130)
  5. Notice of Court Hearing / Case Management Conference
  6. Sheriff's Notice to Vacate / Eviction Order (Writ of Possession)

## 3. Privacy & Safety Mandates
1. Process the original document locally by default.
2. Never send the original file to an external model in the default path.
3. Never send raw OCR text containing personal information.
4. Detect, redact, display, and let the user confirm sensitive data removal before any network request.
5. Show the exact minimized payload before any network request.
6. Do not store raw documents, raw OCR text, or model prompts on a server.
7. Do not log document contents, names, addresses, case numbers, or extracted legal facts.
8. Make deletion and timeout behavior explicit and testable.
9. Refuse unsupported jurisdictions and out-of-scope document types.
10. Neutral, decision-preserving language only; zero prohibited legal conclusions.
