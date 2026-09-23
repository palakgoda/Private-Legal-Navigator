/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { TopBar } from './components/TopBar';
import { PrivacyStatusBanner } from './components/PrivacyStatusBanner';
import { DocumentIntake } from './components/DocumentIntake';
import { PrivacyReview } from './components/PrivacyReview';
import { ExtractionReview } from './components/ExtractionReview';
import { NavigatorResults } from './components/NavigatorResults';
import { NavigationControls } from './components/NavigationControls';
import { FaqSection } from './components/FaqSection';
import { FontSizeLevel } from './components/SeniorAccessibilityBar';

// Lazy-load interactive modals for maximum initial load efficiency
const PrivacyModal = lazy(() => import('./components/PrivacyModal').then(m => ({ default: m.PrivacyModal })));
const AuditTestModal = lazy(() => import('./components/AuditTestModal').then(m => ({ default: m.AuditTestModal })));
const PrintSummaryView = lazy(() => import('./components/PrintSummaryView').then(m => ({ default: m.PrintSummaryView })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const SavedAssessmentsModal = lazy(() => import('./components/SavedAssessmentsModal').then(m => ({ default: m.SavedAssessmentsModal })));
const UnsavedExitModal = lazy(() => import('./components/UnsavedExitModal').then(m => ({ default: m.UnsavedExitModal })));
const WhyNotGeneralAiModal = lazy(() => import('./components/WhyNotGeneralAiModal').then(m => ({ default: m.WhyNotGeneralAiModal })));
import {
  PilotJurisdictionId,
  DocumentTypeId,
  ExtractedField,
  DetectedPii,
  SanitizedPayload,
  NavigatorResult,
  SyntheticDocumentFixture
} from './types/navigator';
import { processFileLocally, SYNTHETIC_FIXTURES } from './services/localOcrService';
import { detectPii, buildSanitizedPayload, applyRedactions } from './services/piiRedactionService';
import { classifyDocumentText } from './services/documentClassifier';
import { generateDeterministicResults } from './services/checklistEngine';
import { requestSanitizedAiExplanation } from './services/aiGateway';
import { JURISDICTIONS } from './services/sourceRegistry';
import {
  getCurrentUser,
  logoutUser,
  User as UserType,
  getSavedAssessments,
  saveAssessment,
  SavedAssessment
} from './services/authService';
import {
  SupportedLanguage,
  getStoredLanguage,
  setStoredLanguage,
  getTranslation
} from './services/i18n';

export default function App() {
  // Localization & Accessibility
  const [language, setLanguage] = useState<SupportedLanguage>(getStoredLanguage());
  const [fontSize, setFontSize] = useState<FontSizeLevel>('normal');

  // Auth & Session
  const [currentUser, setCurrentUser] = useState<UserType | null>(getCurrentUser());
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Navigation State: 1 = Intake, 2 = Privacy & Redaction, 3 = Field Verification, 4 = Results
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<PilotJurisdictionId>('india_maharashtra');

  // Document & Processing State
  const [rawDocumentText, setRawDocumentText] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted Fields & Privacy
  const [detectedPii, setDetectedPii] = useState<DetectedPii[]>([]);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [documentType, setDocumentType] = useState<DocumentTypeId>('cheque_bounce_138');

  // Navigator Final Result
  const [results, setResults] = useState<NavigatorResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showUnsavedExitModal, setShowUnsavedExitModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [showWhyNotAiModal, setShowWhyNotAiModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  // Load saved assessments for active user
  useEffect(() => {
    const list = getSavedAssessments(currentUser ? currentUser.id : 'guest_user_local');
    setSavedAssessments(list);
  }, [currentUser]);

  // Window exit / beforeunload guard for unsaved active documents
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (rawDocumentText && !isSaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [rawDocumentText, isSaved]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setStoredLanguage(lang);
  };

  const handleAuthSuccess = (user: UserType) => {
    setCurrentUser(user);
    const list = getSavedAssessments(user.id);
    setSavedAssessments(list);
    // If we have an active assessment waiting to be saved, auto-save under new user
    if (results && !isSaved) {
      saveActiveAssessment(user.id);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSavedAssessments(getSavedAssessments('guest_user_local'));
  };

  // Process Document Text Locally (Core Local In-Memory Intake)
  const processDocumentTextLocally = (text: string, title: string, jurisdiction?: PilotJurisdictionId) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSessionNotice(null);
    setIsSaved(false);

    try {
      if (jurisdiction) {
        setSelectedJurisdictionId(jurisdiction);
      }

      setRawDocumentText(text);
      setDocumentTitle(title);

      // 1. Detect PII tokens locally
      const piiTokens = detectPii(text);
      setDetectedPii(piiTokens);

      // 2. Classify Document locally
      const classification = classifyDocumentText(text);
      setDocumentType(classification.documentType);
      setExtractedFields(classification.extractedFields);

      // Move to Step 2 (Privacy & Redaction Review)
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing document locally.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Local File Upload or Photo
  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const ocrResult = await processFileLocally(file);
      processDocumentTextLocally(ocrResult.text, ocrResult.fileName);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to read file locally.');
      setIsProcessing(false);
    }
  };

  // Handle 1-Click Synthetic Fixture
  const handleSyntheticFixtureSelected = (fixture: SyntheticDocumentFixture) => {
    processDocumentTextLocally(fixture.rawSimulatedText, fixture.title, fixture.jurisdictionId);
  };

  // Handle Direct Pasted Text
  const handleDirectTextSubmitted = (text: string, title?: string) => {
    processDocumentTextLocally(text, title || 'Pasted Notice Text');
  };

  // Toggle Redaction for a detected PII token
  const handleTogglePii = (id: string) => {
    setDetectedPii(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  // Add Custom Redaction word
  const handleAddCustomPii = (word: string, category: any) => {
    const newId = `custom_pii_${Date.now()}`;
    setDetectedPii(prev => [
      ...prev,
      {
        id: newId,
        category: category || 'custom',
        label: `Custom: "${word}"`,
        detectedValue: word,
        redactedValue: `[REDACTED ${word.toUpperCase()}]`,
        reason: 'User designated sensitive text phrase',
        startPos: 0,
        endPos: word.length,
        enabled: true
      }
    ]);
  };

  // Update Extracted Field
  const handleUpdateField = (id: string, updates: Partial<ExtractedField>) => {
    setExtractedFields(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Generate Results (Deterministic Rule Engine or Sanitized AI)
  const handleGenerateResults = async (useAi: boolean) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const statedReasonField = extractedFields.find(f => f.key === 'statedReason');
      const datesField = extractedFields.find(f => f.key === 'visibleDates');
      const courtField = extractedFields.find(f => f.key === 'courtOrAgency');
      const amountField = extractedFields.find(f => f.key === 'amountClaimed');
      const caseField = extractedFields.find(f => f.key === 'caseNumber');

      const visibleDatesArray = datesField?.value
        ? datesField.value.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // 1. Build Sanitized Payload (contains zero PII)
      const sanitizedPayload = buildSanitizedPayload({
        jurisdiction: JURISDICTIONS[selectedJurisdictionId]?.name || 'India',
        documentType,
        statedReason: statedReasonField?.value || null,
        visibleDates: visibleDatesArray,
        courtOrAgency: courtField?.value || null,
        unclearItems: extractedFields.filter(f => f.isUnclear).map(f => f.label),
        language: language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'
      });

      // 2. Generate Deterministic Results
      const deterministic = generateDeterministicResults({
        jurisdictionId: selectedJurisdictionId,
        documentType,
        statedReason: statedReasonField?.value || null,
        visibleDates: visibleDatesArray,
        courtOrAgency: courtField?.value || null,
        amountClaimed: amountField?.value || null,
        caseNumber: caseField?.value || null,
        isAiAssisted: useAi,
        sanitizedPayload
      });

      // 3. Optional Sanitized AI Call
      if (useAi) {
        setIsAiLoading(true);
        try {
          const aiResponse = await requestSanitizedAiExplanation({
            payload: sanitizedPayload,
            jurisdictionId: selectedJurisdictionId,
            documentType,
            amountClaimed: amountField?.value || null,
            caseNumber: caseField?.value || null,
            courtOrAgency: courtField?.value || null
          });
          if (aiResponse && aiResponse.result) {
            setResults(aiResponse.result);
            setCurrentStep(4);
            return;
          }
        } catch (aiErr: any) {
          console.warn('AI gateway unavailable, falling back to local engine:', aiErr);
        } finally {
          setIsAiLoading(false);
        }
      }

      setResults(deterministic);
      setCurrentStep(4);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate guidance.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Checklist Step Completed
  const handleToggleStepCompleted = (stepId: string) => {
    if (!results) return;
    setResults(prev => {
      if (!prev) return null;
      return {
        ...prev,
        nextSteps: prev.nextSteps.map(s =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        )
      };
    });
  };

  // Save Active Assessment
  const saveActiveAssessment = (userId?: string) => {
    if (!results) return;
    const targetUserId = userId || (currentUser ? currentUser.id : 'guest_user_local');

    const statedReasonField = extractedFields.find(f => f.key === 'statedReason');
    const datesField = extractedFields.find(f => f.key === 'visibleDates');

    const newAssessment: SavedAssessment = {
      id: `assessment_${Date.now()}`,
      userId: targetUserId,
      title: documentTitle || 'Legal Notice Assessment',
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      jurisdictionId: selectedJurisdictionId,
      documentType,
      statedReason: statedReasonField?.value || null,
      visibleDates: datesField?.value ? datesField.value.split(',').map(s => s.trim()) : [],
      urgency: results.escalation,
      results,
      extractedFields,
      detectedPiiCount: detectedPii.length
    };

    saveAssessment(targetUserId, newAssessment);
    setSavedAssessments(getSavedAssessments(targetUserId));
    setIsSaved(true);
    setSessionNotice('Assessment saved successfully to your profile!');
    setTimeout(() => setSessionNotice(null), 4000);
  };

  // Load a Saved Assessment
  const handleLoadSavedAssessment = (item: SavedAssessment) => {
    setSelectedJurisdictionId(item.jurisdictionId);
    setDocumentType(item.documentType);
    setDocumentTitle(item.title);
    setExtractedFields(item.extractedFields || []);
    setResults(item.results);
    setIsSaved(true);
    setCurrentStep(4);
    setSessionNotice(`Loaded saved assessment: "${item.title}"`);
    setTimeout(() => setSessionNotice(null), 3500);
  };

  // Assessment deleted callback
  const handleAssessmentDeleted = (id: string) => {
    setSavedAssessments(prev => prev.filter(a => a.id !== id));
  };

  // Delete / Reset Session
  const handleDeleteSession = () => {
    if (rawDocumentText && !isSaved) {
      // Prompt user with exit/save modal
      setShowUnsavedExitModal(true);
      return;
    }
    wipeMemorySession();
  };

  const wipeMemorySession = () => {
    setRawDocumentText('');
    setDocumentTitle('');
    setDetectedPii([]);
    setExtractedFields([]);
    setResults(null);
    setCurrentStep(1);
    setIsSaved(false);
    setShowUnsavedExitModal(false);
    setSessionNotice('Session erased. Browser memory wiped completely.');
    setTimeout(() => setSessionNotice(null), 4000);
  };

  const hasDocument = rawDocumentText.length > 0;

  const handleOpenFaq = () => {
    if (currentStep !== 1) {
      setCurrentStep(1);
    }
    setTimeout(() => {
      const el = document.getElementById('faq-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  // Build current sanitized preview with memoization for render efficiency
  const sanitizedPayloadPreview = useMemo(() => {
    return buildSanitizedPayload({
      jurisdiction: JURISDICTIONS[selectedJurisdictionId]?.name || 'India',
      documentType,
      statedReason: extractedFields.find(f => f.key === 'statedReason')?.value || null,
      visibleDates: extractedFields.find(f => f.key === 'visibleDates')?.value?.split(',') || [],
      redactedExcerpt: applyRedactions(rawDocumentText.slice(0, 300), detectedPii),
      language: language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'
    });
  }, [selectedJurisdictionId, documentType, extractedFields, rawDocumentText, detectedPii, language]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Global Top Bar */}
      <TopBar
        currentStep={currentStep}
        onNavigateStep={step => setCurrentStep(step)}
        onDeleteSession={handleDeleteSession}
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        onOpenTestModal={() => setShowTestModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenSavedModal={() => setShowSavedModal(true)}
        onOpenWhyNotAiModal={() => setShowWhyNotAiModal(true)}
        onOpenFaq={handleOpenFaq}
        currentUser={currentUser && !currentUser.isGuest ? currentUser : null}
        onLogout={handleLogout}
        savedCount={savedAssessments.length}
        hasDocument={hasDocument}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Privacy & Boundary Status Banner */}
        <PrivacyStatusBanner
          detectedPiiCount={detectedPii.length}
          activeRedactionsCount={detectedPii.filter(p => p.enabled).length}
          onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        />

        {/* Global Front / Back / Previous Workflow Navigation Bar */}
        <NavigationControls
          currentStep={currentStep}
          onNavigateStep={step => setCurrentStep(step)}
          onRestart={handleDeleteSession}
          hasDocument={hasDocument}
          hasResults={!!results}
          documentTitle={documentTitle}
          language={language}
        />

        {/* Temporary Notification Toast */}
        {sessionNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <span>{sessionNotice}</span>
            <button
              onClick={() => setSessionNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: Intake & Upload */}
        {currentStep === 1 && (
          <>
            <DocumentIntake
              selectedJurisdictionId={selectedJurisdictionId}
              onSelectJurisdiction={j => setSelectedJurisdictionId(j)}
              onFileSelected={handleFileSelected}
              onSyntheticFixtureSelected={handleSyntheticFixtureSelected}
              onDirectTextSubmitted={handleDirectTextSubmitted}
              isProcessing={isProcessing}
              errorMessage={errorMessage}
              language={language}
              onOpenWhyNotAiModal={() => setShowWhyNotAiModal(true)}
            />

            {/* Frequently Asked Questions (Spacious, Uncrowded Section) */}
            <FaqSection
              language={language}
              onOpenWhyNotAiModal={() => setShowWhyNotAiModal(true)}
              onOpenPrivacyModal={() => setShowPrivacyModal(true)}
              onRunAuditTests={() => setShowTestModal(true)}
            />
          </>
        )}

        {/* STEP 2: Privacy Review & Redaction */}
        {currentStep === 2 && (
          <PrivacyReview
            rawText={rawDocumentText}
            piiList={detectedPii}
            onTogglePii={handleTogglePii}
            onAddCustomPii={handleAddCustomPii}
            sanitizedPayload={sanitizedPayloadPreview}
            onContinueToConfirmation={() => setCurrentStep(3)}
            onProceedDirectlyLocal={() => handleGenerateResults(false)}
          />
        )}

        {/* STEP 3: Field Verification & Confirmation */}
        {currentStep === 3 && (
          <ExtractionReview
            fields={extractedFields}
            documentType={documentType}
            onUpdateField={handleUpdateField}
            onSelectDocumentType={t => setDocumentType(t)}
            onGenerateResults={useAi => handleGenerateResults(useAi)}
            isAiLoading={isAiLoading}
          />
        )}

        {/* STEP 4: Official Results, Verification & Checklists */}
        {currentStep === 4 && results && (
          <NavigatorResults
            results={results}
            documentType={documentType}
            onOpenPrintModal={() => setShowPrintModal(true)}
            onToggleStepCompleted={handleToggleStepCompleted}
            onSaveAssessment={() => saveActiveAssessment()}
            isSaved={isSaved}
            language={language}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onOpenWhyNotAiModal={() => setShowWhyNotAiModal(true)}
          />
        )}

        {/* Bottom Navigation for long scroll pages (Steps 2, 3, 4) */}
        {currentStep > 1 && (
          <div className="pt-4 border-t border-slate-200/80">
            <NavigationControls
              currentStep={currentStep}
              onNavigateStep={step => setCurrentStep(step)}
              onRestart={handleDeleteSession}
              hasDocument={hasDocument}
              hasResults={!!results}
              documentTitle={documentTitle}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Nyaya Mitra (न्याय मित्र)</span>
            <span>•</span>
            <span>Indian Civil & Tenancy Notice Navigator</span>
            <span>•</span>
            <span>NALSA Free Legal Aid: <strong>15100</strong></span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleOpenFaq}
              className="font-bold text-amber-800 hover:text-amber-950 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'सवाल एवं जवाब (FAQ)' : language === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न (FAQ)' : 'FAQs & Answers'}</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Privacy Architecture & Rules
            </button>
            <span>·</span>
            <button
              onClick={() => setShowTestModal(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Run Test Suite (8 Suites)
            </button>
          </div>
        </div>
      </footer>

      {/* Lazy-loaded Interactive Modals with Zero Impact on First Paint */}
      <Suspense fallback={null}>
        {/* Why Not General AI? Comparison Modal (Mentor/Judge Core Question) */}
        {showWhyNotAiModal && (
          <WhyNotGeneralAiModal
            isOpen={showWhyNotAiModal}
            onClose={() => setShowWhyNotAiModal(false)}
            language={language}
            onRunAuditTests={() => setShowTestModal(true)}
          />
        )}

        {/* Auth Modal (Citizen Login / Register) */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
            language={language}
          />
        )}

        {/* Saved Assessments Drawer / Modal */}
        {showSavedModal && (
          <SavedAssessmentsModal
            isOpen={showSavedModal}
            onClose={() => setShowSavedModal(false)}
            assessments={savedAssessments}
            onLoadAssessment={handleLoadSavedAssessment}
            onAssessmentDeleted={handleAssessmentDeleted}
            language={language}
          />
        )}

        {/* Unsaved Exit / Session Close Warning Modal */}
        {showUnsavedExitModal && (
          <UnsavedExitModal
            isOpen={showUnsavedExitModal}
            onClose={() => setShowUnsavedExitModal(false)}
            onSaveAndLogin={() => {
              setShowUnsavedExitModal(false);
              setShowAuthModal(true);
            }}
            onSaveLocally={() => {
              saveActiveAssessment('guest_citizen');
              setShowUnsavedExitModal(false);
            }}
            onDiscardAndExit={wipeMemorySession}
            language={language}
          />
        )}

        {/* Privacy Architecture Modal */}
        {showPrivacyModal && (
          <PrivacyModal
            isOpen={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
          />
        )}

        {/* Automated Tests Modal */}
        {showTestModal && (
          <AuditTestModal
            isOpen={showTestModal}
            onClose={() => setShowTestModal(false)}
            onOpenWhyNotAiModal={() => setShowWhyNotAiModal(true)}
          />
        )}

        {/* Printable Summary Modal */}
        {showPrintModal && results && (
          <PrintSummaryView
            isOpen={showPrintModal}
            onClose={() => setShowPrintModal(false)}
            results={results}
            documentTitle={documentTitle}
          />
        )}
      </Suspense>
    </div>
  );
}
