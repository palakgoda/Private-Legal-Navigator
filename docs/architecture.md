# Architecture: Private Legal Navigator

## Data Flow & Security Boundaries
```
User device (Browser Client)
  ├── Document Intake (PDF, Images, Camera capture, Synthetic test fixtures)
  ├── Local File Validation & Size check (<10MB)
  ├── localOcrService: In-memory image/PDF canvas extraction
  ├── piiRedactionService: Pattern-based PII identification & manual redaction controls
  ├── documentClassifier: Categorization against pilot allowlist (CA eviction notices & summons)
  ├── extractionReview: User verification of dates, court, stated reason, and confidence
  ├── checklistEngine: Deterministic, decision-neutral next steps based on verified facts
  ├── riskEscalationService: High-urgency detection (court summons, lockout, <5 day visible dates)
  └── Optional aiGateway:
        - Receives strictly SanitizedPayload (zero PII, zero raw files)
        - Schema enforcement & prohibited phrase blocking
        - Cites versioned sourceRegistry items only
```

## Domain Services
- `src/services/localOcrService.ts`
- `src/services/piiRedactionService.ts`
- `src/services/documentClassifier.ts`
- `src/services/sourceRegistry.ts`
- `src/services/checklistEngine.ts`
- `src/services/riskEscalationService.ts`
- `src/services/aiGateway.ts`
- `src/services/safetyFilter.ts`
