# Private Legal Navigator

A local-first web application that helps a person understand a supported legal document — starting with eviction notices and court papers — and find verified, official next steps.

**Private Legal Navigator is not a lawyer, does not create an attorney-client relationship, and does not determine whether a legal action is valid or predict an outcome.** It provides plain-language explanation, source-linked procedural information, and connections to official and human help.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [What it does](#what-it-does)
- [What it deliberately does not do](#what-it-deliberately-does-not-do)
- [Privacy model](#privacy-model)
- [How it works](#how-it-works)
- [Architecture](#architecture)
- [Jurisdiction and scope](#jurisdiction-and-scope)
- [Legal-safety behavior](#legal-safety-behavior)
- [Getting started](#getting-started)
- [Testing](#testing)
- [Accessibility](#accessibility)
- [Repository constraints](#repository-constraints)
- [Limitations](#limitations)
- [Assumptions](#assumptions)
- [Disclaimer](#disclaimer)

---

## Why this exists

People who receive an eviction notice, summons, complaint, or hearing notice often have unfamiliar terminology, a short deadline, and no easy way to get help. Sending such a document to a general-purpose cloud AI tool creates a second risk: the document may contain names, addresses, case numbers, financial details, or information about children or immigration status.

Private Legal Navigator addresses both problems by processing the original document **locally by default** and only ever sending a **user-reviewed, redacted, minimized payload** to an optional AI explanation layer — never the original file.

## What it does

- Accepts an uploaded or photographed eviction-related document (PDF or image) for one configured pilot jurisdiction.
- Runs OCR and document classification **locally in the browser**.
- Detects likely personal information (names, addresses, phone numbers, emails, case numbers, ID numbers, financial details, dates of birth) and lets the user review, edit, or remove each detected item before anything is sent anywhere.
- Extracts a limited set of fields — document type, jurisdiction, court/agency, visible dates, stated reason, official contact information — for user confirmation or correction.
- Produces four result sections:
  1. **What this document says** — plain-language summary of visible content.
  2. **Dates to verify** — dates shown in the document, never a silently calculated deadline.
  3. **What is unclear** — missing pages, unreadable values, unsupported jurisdiction, conflicting sources.
  4. **What you can do now** — a decision-neutral, source-linked checklist.
- Surfaces an urgent-escalation card for imminent hearings, judgments, lockout language, unreadable documents, or safety concerns, pointing to official court, legal-aid, interpreter, or professional-help resources.
- Cites every procedural claim to a versioned, approved source (title, URL, jurisdiction, source type, last-checked date).
- Provides a one-click **delete session** control and automatic session cleanup.
- Works fully in **local-guidance mode** with no cloud AI call at all.

## What it deliberately does not do

- Does **not** state that an action is legal or illegal.
- Does **not** select a defense, predict a case outcome, or provide litigation strategy.
- Does **not** contact a landlord or court, file a form, or process payment.
- Does **not** claim to be a lawyer or a party's representative.
- Does **not** provide nationwide legal coverage — one jurisdiction only, clearly configured and visible.
- Does **not** use unrestricted web search as legal authority.
- Does **not** upload the original document or raw OCR text in the default flow.

## Privacy model

| Rule | Enforcement |
|---|---|
| Original document processed locally by default | No document-upload network endpoint exists in the default path |
| Original file never sent to an external model | `aiGateway` only accepts a typed `SanitizedPayload`, never a file |
| Raw OCR text never sent externally | Redaction happens before any payload is constructed |
| User approves exactly what would be sent | `PrivacyReview` shows the literal minimized payload before any network call |
| No server-side storage of documents, OCR text, or prompts | Transient, in-memory/session-only data model; stateless server (if any) |
| No logging of document contents or personal fields | Structured logging with content fields stripped; tested |
| No unverifiable provider claims | No statement about an external provider's retention/training policy without a verified, cited source |
| Explicit deletion | "Delete this document and session data" clears session state and returns to the upload screen |

If the configured AI platform cannot offer a suitable privacy guarantee, cloud AI mode is disabled and the app falls back to local-guidance mode automatically.

## How it works

```text
User device
  ├── Upload or camera capture
  ├── Local file validation
  ├── Local OCR and text extraction
  ├── Local PII detection and redaction
  ├── Local document classification
  ├── User confirmation of fields and payload
  ├── Local jurisdiction/checklist engine
  └── Optional sanitized AI explanation (user-initiated only)

Approved knowledge base
  ├── Versioned official court sources
  ├── Government sources
  ├── Legal-aid sources
  └── Source metadata + last-checked date

Optional AI gateway
  ├── Receives only the minimized payload
  ├── Applies system safety instructions
  ├── Validates structured output against a schema
  ├── Rejects unsupported claims / missing citations
  └── Returns explanation with source identifiers
```

## Architecture

**Frontend modules:** `DocumentIntake`, `LocalProcessor`, `PrivacyReview`, `ExtractionReview`, `NavigatorResults`, `AccessibilityExport`.

**Domain services:** `localOcrService`, `piiRedactionService`, `documentClassifier`, `sourceRegistry`, `checklistEngine`, `riskEscalationService`, `aiGateway`.

**Data model:** transient typed objects only — `ExtractedField`, `SanitizedPayload`, `NavigatorResult` — no persistent document database. See [`docs/architecture.md`](docs/architecture.md) for full type definitions and the threat-model table.

**Untrusted content:** all uploaded text, OCR output, filenames, metadata, and any external page content are treated as untrusted data. Document text is never executed as an instruction, and links in a document are never opened automatically.

## Jurisdiction and scope

- The MVP supports **one pilot jurisdiction**, set in configuration and documented below.
- Current pilot jurisdiction: `e.g. "State/County, Country`
- Supported document types: `e.g. eviction notice, summons, complaint, hearing notice`
- Requests outside the pilot jurisdiction receive general resource discovery only — never jurisdiction-specific procedural claims.
- Unsupported or unclassifiable documents are explicitly refused rather than guessed at.

## Legal-safety behavior

Approved phrasing patterns:

- "The document appears to say…"
- "This date is visible in the document, but the application cannot determine the legally controlling deadline."
- "This information should be verified immediately with the official court or a qualified legal professional."
- "The application cannot determine this safely from the available information."

Phrases the application must never produce: "you are safe," "you will win," "this is definitely illegal," "ignore this notice."

A deterministic post-processor validates AI output against these rules before display and blocks or replaces unsafe language.

## Getting started

> Fill in this section with the actual stack once implementation begins. The instructions below assume a typical local web-app setup; adjust to match the framework actually used in this repository.

```bash
# install dependencies
<package manager install command>

# run the app locally
<dev server command>

# run tests
<test command>

# run lint/format
<lint command>

# production build
<build command>
```

Before adding any dependency, check whether the requirement can be met with the existing stack — the project intentionally avoids large models, binary assets, and anything that threatens the 10 MB repository limit.

## Testing

Automated tests cover:

- Common PII detection and redaction, plus manual correction of redactions.
- Unsupported-jurisdiction and unsupported-document refusal.
- Unreadable date handling.
- Checklist selection by document type and urgency.
- Blocking of prohibited legal conclusions.
- AI payload exclusion of original files and identifiers.
- Delete-session behavior.
- Keyboard and accessible-name behavior for critical controls.
- Prompt-injection fixtures, verifying injected text is treated as inert document data.

All fixtures are **synthetic/fictional** — no real legal documents, screenshots, or personal data are committed.

## Accessibility

- Full keyboard navigation with visible focus states; dialogs trap and return focus correctly.
- All controls have accessible names; form errors are associated with fields and announced to assistive technology.
- Urgency and confidence are never communicated by color alone — always paired with a text label and an accessible icon.
- Document images include alternative text or a text-extraction view.
- A print stylesheet renders the confirmed summary, uncertainty notes, source links, and referral details.
- Results are downloadable as a simple HTML/text summary via `AccessibilityExport`.

## Repository constraints

- Public repository, single branch, source and documentation only.
- Stays below **10 MB** — no `node_modules`, build output, models, or sample PDFs committed.
- No secrets, API keys, or `.env` files committed; secrets are documented (without values) in `.env.example`.
- No real legal documents, private interview data, or personal-data screenshots.

## Limitations

- Covers one jurisdiction and a small allowlist of eviction-related document types — it is **not** a general legal chatbot or nationwide service.
- OCR and classification are imperfect; low-confidence or unreadable fields are marked "unclear" rather than guessed.
- Procedural guidance is limited to the versioned source registry; if a needed source is stale, missing, or conflicting, the app fails closed and shows an escalation path instead of guessing.
- Does not calculate legally controlling deadlines — it only surfaces dates as they appear in the document, with a prompt to verify them officially.

## Assumptions

- A configured, versioned source registry (official court, government, and legal-aid sources) exists and is kept current for the pilot jurisdiction.
- Optional cloud AI use is user-initiated per session and can be fully disabled in favor of local-guidance mode.
- The hosting environment supports client-side OCR and does not require the original document to leave the user's device for the default flow to function.

## Disclaimer

Private Legal Navigator provides general legal information and navigation support. It is not a law firm and does not provide legal advice. Using this application does not create an attorney-client relationship. If you are facing an eviction, summons, or court deadline, verify all dates and requirements immediately with the official court or a qualified legal professional, and use legal aid resources where available.
