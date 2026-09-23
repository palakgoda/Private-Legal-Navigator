/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appName: 'Nyaya Mitra — Legal Document Navigator',
    appTagline: 'Indian Legal Document Analyzer & Rights Assistant',
    subtitle: 'Confidential, in-browser analysis of Indian legal notices, summons & agreements under Indian Law.',
    privacyBadge: '100% In-Browser Privacy • Zero Raw Data Sent to Cloud',
    indianLawOnly: 'Indian Law Only • NALSA & State Legal Aid Integrated',

    // Hero Section
    heroTitle: 'Understand Any Indian Legal Notice in Plain Language',
    heroSubtitle: 'Upload court summons, Section 138 cheque dishonour notices, or eviction demands. Get step-by-step rights, critical deadlines, and free legal aid options strictly under Indian law.',

    // Navigation & Step Controls
    navPrevious: 'Previous Step',
    navNext: 'Next Step',
    navBack: 'Back',
    navForward: 'Forward',
    navRestart: 'Start Over / New Document',
    navStepOf: 'Step',
    navOf: 'of',

    // Senior Citizen Guided Tour & Tooltips
    seniorGuideBtn: 'Elder-Citizen Guided Tour',
    seniorGuideTitle: 'Simple 4-Step Guide for Citizens',
    guideStep1Title: 'Step 1: Choose Your Indian State',
    guideStep1Desc: 'Legal rules differ between states (e.g. Maharashtra Rent Control vs Delhi Rent Act). Pick your state or choose All India Central Acts.',
    guideStep2Title: 'Step 2: Add Your Document',
    guideStep2Desc: 'Upload a PDF, take a clear photo of the court paper with your phone camera, or paste the notice text directly.',
    guideStep3Title: 'Step 3: Privacy & Name Masking',
    guideStep3Desc: 'Everything happens inside your device. Aadhaar, PAN, phone numbers, and names are masked before anything is processed.',
    guideStep4Title: 'Step 4: Get Clear Rights & Deadlines',
    guideStep4Desc: 'Review procedural deadlines (such as 15-day Section 138 window or 30-day CPC summons reply) and connect with free NALSA legal aid.',
    closeGuide: 'Close Guide',
    nextGuideStep: 'Next Guide Step',
    prevGuideStep: 'Previous Guide Step',

    // Tooltips
    tipJurisdiction: 'Select your state so procedural timelines and state rent/civil acts match your local court rules.',
    tipUpload: 'Drag & drop court summons, advocate notices, or agreements in PDF, JPG, or PNG format.',
    tipCamera: 'Snap a clear photo of your paper notice using your phone or laptop camera.',
    tipPrivacy: 'Zero cloud uploads. All Optical Character Recognition and masking run strictly in your browser.',
    tipSampleCases: 'Click any real Indian legal scenario to see an instant demonstration without uploading personal files.',

    // Nav & TopBar
    stepIntake: '1. Document Intake',
    stepPrivacy: '2. Privacy & Redaction',
    stepFields: '3. Verify Details',
    stepGuidance: '4. Legal Guidance',
    loginBtn: 'Login / Account',
    guestUser: 'Guest Citizen',
    mySavedAssessments: 'My Saved Assessments',
    deleteSession: 'Delete Session & Erase Memory',
    runTests: 'Safety Tests',
    fontSmall: 'A-',
    fontMedium: 'A',
    fontLarge: 'A+',
    seniorFriendly: 'Senior & Youth Friendly Mode',
    listenAudio: 'Listen to Explanation',
    stopAudio: 'Stop Audio',

    // Jurisdictions
    selectJurisdiction: 'Select Indian State / Legal Jurisdiction',
    jurisdictionLabel: 'State / Court Jurisdiction',
    nationalLaw: 'All India (Central Acts: NI Act, TPA, CPC, Consumer Act)',
    maharashtraLaw: 'Maharashtra (Rent Control Act 1999, Bombay HC, MSLSA)',
    delhiLaw: 'Delhi NCR (Delhi Rent Act 1958, Delhi HC, DSLSA)',
    karnatakaLaw: 'Karnataka (Rent Act 1999, High Court of Karnataka)',

    // Intake options
    demoNotices: 'Sample Legal Fixtures (Indian Law)',
    uploadDocument: 'Upload File / Photo',
    pasteText: 'Paste Notice Text',
    dragDropText: 'Drop Court Notice, Summons, or Tenancy Document Here',
    chooseFileBtn: 'Choose File from Device',
    takePhotoBtn: 'Scan / Take Photo of Physical Paper',
    uploadTitle: 'Upload Document (PDF / Image / Camera)',
    uploadDesc: 'Drag & drop court summons, advocate legal notice, or rent notice. Processed 100% locally in browser memory.',
    chooseFile: 'Select File from Device',
    takePhoto: 'Scan / Take Photo',
    pasteTextTitle: 'Or Paste Legal Notice Text Directly',
    pastePlaceholder: 'Paste text from legal notice, summons, or WhatsApp message here...',
    analyzeTextBtn: 'Analyze Document Locally',
    sampleFixturesTitle: 'Try Ready Test Scenarios (Real-world Indian Law Fixtures)',
    sampleFixturesDesc: 'Click any example to see instant Indian law analysis, PII masking, and official procedure:',

    // Privacy review
    piiReviewTitle: 'Sensitive Indian Identifiers Detected',
    piiReviewDesc: 'Aadhaar, PAN, phone numbers, addresses, and financial amounts are automatically detected and masked in browser memory.',
    toggleAll: 'Redact All Detected PII',
    customPiiPlaceholder: 'Add custom word to mask (e.g. family name, village)...',
    addTerm: 'Add Mask Term',
    sanitizedPreview: 'Sanitized Data Payload Preview',
    proceedToVerify: 'Continue to Detail Verification',
    proceedLocalOnly: 'Proceed with 100% Local Rule Engine',

    // Fields review
    fieldReviewTitle: 'Document Classification & Critical Dates',
    fieldReviewDesc: 'Verify the detected document type under Indian Law and confirm dates visible on the document.',
    docTypeLabel: 'Document Category (Indian Law)',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Needs Verification',
    confidenceLow: 'Unclear / Low Quality',
    markUnclear: 'Mark as Unclear',
    generateGuidanceBtn: 'Generate Legal Guidance & Action Plan',
    generateAiGuidanceBtn: 'Get AI Plain Language Explanation (Sanitized Only)',

    // Results & Guidance
    urgencyMeterTitle: 'Legal Urgency Meter',
    urgencyImmediate: 'High Urgency — Immediate Action Required',
    urgencySoon: 'Moderate Urgency — Act Within 7-15 Days',
    urgencyStandard: 'Informational / Standard Notice',
    timelineTitle: 'Indian Legal Procedure Timeline',
    plainSummaryTitle: '1. What This Document Appears to Say (Plain Explanation)',
    datesTitle: '2. Dates Visible in Document (Subject to Court Verification)',
    unknownsTitle: '3. What Cannot Be Determined Safely From Text Alone',
    checklistTitle: '4. Decision-Neutral Action Checklist',
    legalAidTitle: '5. Official Free Legal Aid & Court Services (NALSA / State)',
    citationsTitle: '6. Indian Statutory References & Verified Sources',
    printSummary: 'Print Official Checklist',
    exportTxt: 'Download Summary (.txt)',
    saveAssessment: 'Save This Assessment',
    savedSuccess: 'Assessment saved to your profile!',

    // Senior / Plain language explainer
    saralBhashaToggle: 'Saral Bhasha / Simple Language Guide',
    saralBhashaDesc: 'Click here for simple explanations of difficult court terms like Vakalatnama, Summons, or Ex-Parte.',

    // Exit popup
    unsavedModalTitle: 'Save Your Legal Assessment Before Leaving?',
    unsavedModalDesc: 'You have an active legal document assessment in browser memory. What would you like to do before closing?',
    saveToAccountBtn: 'Save to My Account (Login / Register)',
    saveLocalBtn: 'Save Locally on This Device',
    discardAndExitBtn: 'Discard & Delete Session Data',
    cancelKeepWorking: 'Keep Working on Document',

    // Auth
    loginModalTitle: 'Citizen Sign In / Register',
    loginModalDesc: 'Access your saved legal assessments across sessions. Guest mode is also available.',
    emailOrPhone: 'Email or Mobile Number',
    password: 'Password or 4-digit PIN',
    loginAction: 'Sign In',
    registerAction: 'Create New Account',
    continueGuest: 'Continue as Guest (Local Storage Only)',
    logout: 'Sign Out',
    loggedInAs: 'Signed in as',

    // Legal disclaimer
    disclaimer: 'DISCLAIMER: Nyaya Mitra is an informational technology tool, NOT an advocate or law firm. This does not constitute legal advice. Please consult a licensed advocate or visit your nearest District Legal Services Authority (DLSA) / NALSA (Toll-free 15100).'
  },
  hi: {
    appName: 'न्याय मित्र — कानूनी दस्तावेज़ नेविगेटर',
    appTagline: 'भारतीय कानूनी दस्तावेज़ विश्लेषक एवं अधिकार सहायक',
    subtitle: 'भारतीय कानूनों के तहत कानूनी नोटिस, कोर्ट समन और समझौतों का गोपनीय और सुरक्षित विश्लेषण।',
    privacyBadge: '100% ब्राउज़र गोपनीयता • कोई भी व्यक्तिगत डेटा क्लाउड पर नहीं भेजा जाता',
    indianLawOnly: 'केवल भारतीय कानून • नालसा (NALSA) एवं राज्य विधिक सहायता से जुड़ा',

    // Hero Section
    heroTitle: 'भारतीय कानूनी नोटिस को समझें सरल और स्पष्ट भाषा में',
    heroSubtitle: 'कोर्ट समन, चेक बाउंस नोटिस या किरायेदारी नोटिस अपलोड करें। भारतीय कानून के तहत अपने अधिकार, अंतिम तिथियां और मुफ्त कानूनी सहायता जानें।',

    // Navigation & Step Controls
    navPrevious: 'पिछला चरण',
    navNext: 'अगला चरण',
    navBack: 'पीछे जाएं',
    navForward: 'आगे बढ़ें',
    navRestart: 'नया दस्तावेज़ / रीस्टार्ट',
    navStepOf: 'चरण',
    navOf: 'का',

    // Senior Citizen Guided Tour & Tooltips
    seniorGuideBtn: 'वरिष्ठ नागरिक मार्गदर्शन टूर',
    seniorGuideTitle: 'नागरिकों हेतु 4 आसान चरणों का मार्गदर्शन',
    guideStep1Title: 'चरण 1: अपना भारतीय राज्य चुनें',
    guideStep1Desc: 'कानूनी नियम राज्यों के अनुसार बदलते हैं (जैसे महाराष्ट्र रेंट कंट्रोल बनाम दिल्ली रेंट एक्ट)। अपना राज्य चुनें।',
    guideStep2Title: 'चरण 2: अपना कानूनी दस्तावेज़ जोड़ें',
    guideStep2Desc: 'पीडीएफ फाइल अपलोड करें, फोन कैमरे से कोर्ट पेपर की फोटो खींचें, या नोटिस का टेक्स्ट सीधे पेस्ट करें।',
    guideStep3Title: 'चरण 3: स्थानीय गोपनीयता और नाम सुरक्षा',
    guideStep3Desc: 'प्रक्रिया आपके डिवाइस में ही पूरी होती है। आधार, पैन, फोन नंबर और नाम विश्लेषण से पहले ही सुरक्षित छुपा दिए जाते हैं।',
    guideStep4Title: 'चरण 4: अधिकार, अंतिम तिथि और सहायता',
    guideStep4Desc: 'कानूनी समयसीमा (जैसे धारा 138 में 15 दिन या सीपीसी समन में 30 दिन का जवाब) समझें और मुफ्त नालसा विधिक सहायता लें।',
    closeGuide: 'मार्गदर्शन बंद करें',
    nextGuideStep: 'अगला चरण देखें',
    prevGuideStep: 'पिछला चरण देखें',

    // Tooltips
    tipJurisdiction: 'अपना राज्य चुनें ताकि स्थानीय कोर्ट नियम व रेंट/सिविल एक्ट सही लागू हों।',
    tipUpload: 'कोर्ट समन, वकील की नोटिस या अनुबंध पीडीएफ, जेपीजी या पीएनजी में जोड़ें।',
    tipCamera: 'फोन या लैपटॉप कैमरे से नोटिस की साफ फोटो लें।',
    tipPrivacy: 'क्लाउड पर कोई डेटा नहीं जाता। ओसीआर और डेटा मास्किंग आपके ब्राउज़र में होती है।',
    tipSampleCases: 'बिना निजी दस्तावेज़ अपलोड किए त्वरित डेमो देखने हेतु किसी भी केस पर क्लिक करें।',

    // Nav & TopBar
    stepIntake: '1. दस्तावेज़ अपलोड',
    stepPrivacy: '2. गोपनीयता व छिपाव',
    stepFields: '3. विवरण जांचें',
    stepGuidance: '4. कानूनी मार्गदर्शन',
    loginBtn: 'लॉग इन / खाता',
    guestUser: 'अतिथि नागरिक',
    mySavedAssessments: 'मेरे सहेजे गए दस्तावेज़',
    deleteSession: 'सत्र हटाएं और डेटा मिटाएं',
    runTests: 'सुरक्षा परीक्षण',
    fontSmall: 'छोटा (A-)',
    fontMedium: 'मध्यम (A)',
    fontLarge: 'बड़ा (A+)',
    seniorFriendly: 'बुजुर्गों और युवाओं हेतु सुगम मोड',
    listenAudio: 'आवाज़ में सुनें',
    stopAudio: 'आवाज़ रोकें',

    // Jurisdictions
    selectJurisdiction: 'भारतीय राज्य / अधिकार क्षेत्र चुनें',
    jurisdictionLabel: 'राज्य / न्यायालयीन क्षेत्र',
    nationalLaw: 'अखिल भारतीय (केंद्रीय कानून: चेक बाउंस, संपत्ति अंतरण, सीपीसी, उपभोक्ता कानून)',
    maharashtraLaw: 'महाराष्ट्र (महाराष्ट्र रेंट कंट्रोल एक्ट 1999, बॉम्बे हाईकोर्ट, MSLSA)',
    delhiLaw: 'दिल्ली एनसीआर (दिल्ली रेंट एक्ट 1958, दिल्ली हाईकोर्ट, DSLSA)',
    karnatakaLaw: 'कर्नाटक (कर्नाटक रेंट एक्ट 1999, कर्नाटक हाईकोर्ट)',

    // Intake options
    demoNotices: 'नमूना कानूनी नोटिस (भारतीय कानून)',
    uploadDocument: 'फ़ाइल या फोटो अपलोड करें',
    pasteText: 'नोटिस का टेक्स्ट पेस्ट करें',
    dragDropText: 'कोर्ट नोटिस, समन या कानूनी पत्र यहाँ खींचें या चुनें',
    chooseFileBtn: 'मोबाइल/कंप्यूटर से फ़ाइल चुनें',
    takePhotoBtn: 'कागज़ की फोटो खींचें / स्कैन करें',
    uploadTitle: 'दस्तावेज़ अपलोड करें (PDF / फोटो / कैमरा)',
    uploadDesc: 'कोर्ट समन, वकील की कानूनी नोटिस या मकान खाली करने की नोटिस जोड़ें। यह 100% आपके डिवाइस में सुरक्षित प्रोसेस होता है।',
    chooseFile: 'मोबाइल/कंप्यूटर से फ़ाइल चुनें',
    takePhoto: 'फोटो खींचे / स्कैन करें',
    pasteTextTitle: 'या कानूनी नोटिस का टेक्स्ट यहाँ पेस्ट करें',
    pastePlaceholder: 'कानूनी नोटिस, समन या संदेश यहाँ पेस्ट करें...',
    analyzeTextBtn: 'दस्तावेज़ का विश्लेषण करें',
    sampleFixturesTitle: 'नमूना दस्तावेज़ आज़माएँ (वास्तविक भारतीय कानून उदाहरण)',
    sampleFixturesDesc: 'भारतीय कानून, गोपनीयता छिपाव और आधिकारिक प्रक्रिया देखने हेतु किसी भी उदाहरण पर क्लिक करें:',

    // Privacy review
    piiReviewTitle: 'संवेदनशील भारतीय पहचान विवरण पहचाने गए',
    piiReviewDesc: 'आधार नंबर, पैन कार्ड, फोन नंबर, पता और धनराशि स्वचालित रूप से पहचान कर सुरक्षित कर दी गई है।',
    toggleAll: 'सभी संवेदनशील विवरण छिपाएं',
    customPiiPlaceholder: 'छिपाने के लिए नया शब्द जोड़ें (उदा. नाम, गाँव)...',
    addTerm: 'शब्द जोड़ें',
    sanitizedPreview: 'सुरक्षित डेटा पूर्वावलोकन',
    proceedToVerify: 'विवरण सत्यापन के लिए आगे बढ़ें',
    proceedLocalOnly: 'केवल लोकल नियमों के साथ आगे बढ़ें',

    // Fields review
    fieldReviewTitle: 'दस्तावेज़ प्रकार और महत्वपूर्ण तिथियाँ',
    fieldReviewDesc: 'भारतीय कानून के तहत पहचाने गए दस्तावेज़ के प्रकार और उल्लिखित तारीखों की पुष्टि करें।',
    docTypeLabel: 'दस्तावेज़ श्रेणी (भारतीय कानून)',
    confidenceHigh: 'उच्च सटीकता',
    confidenceMedium: 'सत्यापन आवश्यक',
    confidenceLow: 'अस्पष्ट / कम गुणवत्ता',
    markUnclear: 'अस्पष्ट चिह्नित करें',
    generateGuidanceBtn: 'कानूनी मार्गदर्शन और चेकलिस्ट तैयार करें',
    generateAiGuidanceBtn: 'सरल भाषा में व्याख्या प्राप्त करें (सुरक्षित डेटा)',

    // Results & Guidance
    urgencyMeterTitle: 'कानूनी तात्कालिकता मीटर (Urgency Meter)',
    urgencyImmediate: 'अत्यंत आवश्यक — तुरंत कार्रवाई करें (समन/चेक बाउंस)',
    urgencySoon: 'मध्यम तात्कालिकता — 7 से 15 दिनों में कदम उठाएं',
    urgencyStandard: 'सामान्य जानकारी / प्रारंभिक नोटिस',
    timelineTitle: 'भारतीय कानूनी प्रक्रिया की समयरेखा (Timeline)',
    plainSummaryTitle: '1. यह दस्तावेज़ क्या कहता है (सरल भाषा में समझें)',
    datesTitle: '2. दस्तावेज़ में दिखने वाली महत्वपूर्ण तिथियाँ (सत्यापन योग्य)',
    unknownsTitle: '3. जो जानकारी केवल दस्तावेज़ से तय नहीं की जा सकती',
    checklistTitle: '4. आपके लिए अगला कदम (चेकलिस्ट)',
    legalAidTitle: '5. मुफ्त सरकारी विधिक सहायता व कोर्ट पोर्टल (NALSA / DLSA)',
    citationsTitle: '6. भारतीय कानून संदर्भ एवं धाराएं (Statutory Sources)',
    printSummary: 'चेकलिस्ट प्रिंट करें / पीडीएफ बनाएं',
    exportTxt: 'सारांश डाउनलोड करें (.txt)',
    saveAssessment: 'यह मूल्यांकन सहेजें',
    savedSuccess: 'दस्तावेज़ मूल्यांकन आपके खाते में सुरक्षित सहेज लिया गया!',

    // Senior / Plain language explainer
    saralBhashaToggle: 'सरल भाषा मार्गदर्शिका (कठिन कानूनी शब्दों का अर्थ)',
    saralBhashaDesc: 'वकालतनामा, समन, एकतरफा आदेश (Ex-Parte) जैसे कठिन शब्दों को आसान भाषा में समझें।',

    // Exit popup
    unsavedModalTitle: 'क्या आप बाहर निकलने से पहले अपना मूल्यांकन सहेजना चाहते हैं?',
    unsavedModalDesc: 'आपके ब्राउज़र में दस्तावेज़ का मूल्यांकन खुला हुआ है। क्या आप इसे सहेजना चाहते हैं या हटाना चाहते हैं?',
    saveToAccountBtn: 'मेरे खाते में सहेजें (लॉग इन / पंजीकरण)',
    saveLocalBtn: 'इस डिवाइस पर सहेजें',
    discardAndExitBtn: 'हटाएं और डेटा नष्ट करें',
    cancelKeepWorking: 'दस्तावेज़ पर काम जारी रखें',

    // Auth
    loginModalTitle: 'नागरिक खाता / लॉग इन',
    loginModalDesc: 'अपने सहेजे गए दस्तावेज़ों को कभी भी देखने हेतु लॉग इन करें। अतिथि मोड भी उपलब्ध है।',
    emailOrPhone: 'ईमेल या मोबाइल नंबर',
    password: 'पासवर्ड या 4-अंकीय पिन',
    loginAction: 'लॉग इन करें',
    registerAction: 'नया खाता बनाएं',
    continueGuest: 'अतिथि के रूप में जारी रखें (स्थानीय मेमोरी)',
    logout: 'लॉग आउट',
    loggedInAs: 'लॉग इन नागरिक',

    // Legal disclaimer
    disclaimer: 'अस्वीकरण: न्याय मित्र एक तकनीकी सूचना सहायक है, वकील या लॉ फर्म नहीं। यह कानूनी सलाह नहीं है। कानूनी मामलों में अधिकृत वकील से मिलें या अपने नजदीकी जिला विधिक सेवा प्राधिकरण (DLSA) / NALSA (टोल-फ्री 15100) से संपर्क करें।'
  },
  mr: {
    appName: 'न्याय मित्र — कायदेशीर दस्तऐवज मार्गदर्शक',
    appTagline: 'भारतीय कायदेशीर दस्तऐवज विश्लेषक व हक्क सहाय्यक',
    subtitle: 'भारतीय कायद्यांनुसार नोटीस, कोर्ट समन्स आणि करारांचे अत्यंत सुरक्षित व गोपनीय विश्लेषण.',
    privacyBadge: '१००% ब्राउझर गोपनीयता • कोणताही वैयक्तिक डेटा क्लाउडवर पाठवला जात नाही',
    indianLawOnly: 'केवळ भारतीय कायदे • नालसा (NALSA) व महाराष्ट्र विधी सेवा प्राधिकरण',

    // Hero Section
    heroTitle: 'कोणतीही भारतीय कायदेशीर नोटीस समजून घ्या सोप्या भाषेत',
    heroSubtitle: 'कोर्ट समन्स, चेक बाऊन्स नोटीस किंवा भाडेकरू नोटीस अपलोड करा. भारतीय कायद्यानुसार आपले हक्क, मुदत आणि मोफत कायदेशीर मदत जाणून घ्या.',

    // Navigation & Step Controls
    navPrevious: 'मागील टप्पा',
    navNext: 'पुढील टप्पा',
    navBack: 'मागे जा',
    navForward: 'पुढे जा',
    navRestart: 'नवीन दस्तऐवज / रीस्टार्ट',
    navStepOf: 'टप्पा',
    navOf: 'पैकी',

    // Senior Citizen Guided Tour & Tooltips
    seniorGuideBtn: 'ज्येष्ठ नागरिक मार्गदर्शन टूर',
    seniorGuideTitle: 'नागरिकांसाठी ४ सोप्या टप्प्यांचे मार्गदर्शन',
    guideStep1Title: 'टप्पा १: आपले भारतीय राज्य निवडा',
    guideStep1Desc: 'कायद्यांचे नियम राज्यांनुसार बदलतात (उदा. महाराष्ट्र भाडे नियंत्रण कायदा वि. दिल्ली रेंट ॲक्ट). आपले राज्य निवडा.',
    guideStep2Title: 'टप्पा २: आपला कायदेशीर दस्तऐवज जोडा',
    guideStep2Desc: 'पीडीएफ फाईल अपलोड करा, मोबाईल कॅमेऱ्याने कोर्टाच्या कागदाचा फोटो काढा किंवा नोटीसमधील मजकूर थेट पेस्ट करा.',
    guideStep3Title: 'टप्पा ३: स्थानिक गोपनीयता व नाव सुरक्षा',
    guideStep3Desc: 'सर्व प्रक्रिया आपल्याच डिव्हाइसमध्ये होते. आधार, पॅन, फोन नंबर आणि नाव विश्लेषणापूर्वीच सुरक्षितपणे लपवले जाते.',
    guideStep4Title: 'टप्पा ४: हक्क, मुदत आणि मोफत मदत',
    guideStep4Desc: 'कायदेशीर मुदत (उदा. कलम १३८ मध्ये १५ दिवस किंवा समन्सला ३० दिवसांत उत्तर) समजून घ्या आणि मोफत नालसा मदत मिळवा.',
    closeGuide: 'मार्गदर्शन बंद करा',
    nextGuideStep: 'पुढील टप्पा पहा',
    prevGuideStep: 'मागील टप्पा पहा',

    // Tooltips
    tipJurisdiction: 'आपले राज्य निवडा जेणेकरून स्थानिक कोर्टाचे नियम व भाडे/दिवाणी कायदे योग्य लागू होतील.',
    tipUpload: 'कोर्टाचे समन्स, वकिलाची नोटीस किंवा करार पीडीएफ, जेपीजी किंवा पीएनजीमध्ये जोडा.',
    tipCamera: 'मोबाईल किंवा लॅपटॉप कॅमेऱ्याने नोटीसचा स्पष्ट फोटो काढा.',
    tipPrivacy: 'क्लाउडवर काहीही पाठवले जात नाही. ओसीआर आणि माहिती लपवण्याची प्रक्रिया आपल्या ब्राउझरमध्ये होते.',
    tipSampleCases: 'वैयक्तिक दस्तऐवज न जोडता त्वरित डेमो पाहण्यासाठी कोणत्याही केसवर क्लिक करा.',

    // Nav & TopBar
    stepIntake: '१. दस्तऐवज जोडा',
    stepPrivacy: '२. गोपनीयता व संपादन',
    stepFields: '३. तपशील पडताळा',
    stepGuidance: '४. कायदेशीर मार्गदर्शन',
    loginBtn: 'लॉग इन / खाते',
    guestUser: 'अतिथी नागरिक',
    mySavedAssessments: 'माझे जतन केलेले दस्तऐवज',
    deleteSession: 'सत्र हटवा व डेटा नष्ट करा',
    runTests: 'सुरक्षा चाचण्या',
    fontSmall: 'लहान (A-)',
    fontMedium: 'मध्यम (A)',
    fontLarge: 'मोठा (A+)',
    seniorFriendly: 'ज्येष्ठ नागरिक व तरुणांसाठी सुलभ मोड',
    listenAudio: 'मराठीत ऐका',
    stopAudio: 'आवाज थांबवा',

    // Jurisdictions
    selectJurisdiction: 'राज्य / न्यायालयीन अधिकारक्षेत्र निवडा',
    jurisdictionLabel: 'राज्य / न्यायालयीन क्षेत्र',
    nationalLaw: 'अखिल भारतीय कायदे (चेक बाऊन्स, मालमत्ता हस्तांतरण, सीपीसी, ग्राहक संरक्षण)',
    maharashtraLaw: 'महाराष्ट्र (महाराष्ट्र भाडे नियंत्रण कायदा १९९९, मुंबई उच्च न्यायालय, MSLSA)',
    delhiLaw: 'दिल्ली (दिल्ली भाडे कायदा १९५८, दिल्ली उच्च न्यायालय, DSLSA)',
    karnatakaLaw: 'कर्नाटक (कर्नाटक भाडे कायदा १९९९, कर्नाटक उच्च न्यायालय)',

    // Intake options
    demoNotices: 'नमुना कायदेशीर नोटीस (भारतीय कायदे)',
    uploadDocument: 'फाइल किंवा फोटो अपलोड करा',
    pasteText: 'नोटीस मजकूर पेस्ट करा',
    dragDropText: 'कोर्ट समन्स, नोटीस किंवा कराराची फाईल येथे ड्रॅग करा किंवा निवडा',
    chooseFileBtn: 'डिव्हाइसमधून फाइल निवडा',
    takePhotoBtn: 'कागदाचा फोटो काढा / स्कॅन करा',
    uploadTitle: 'दस्तऐवज अपलोड करा (PDF / फोटो / कॅमेरा)',
    uploadDesc: 'कोर्टाचे समन्स, वकिलाची कायदेशीर नोटीस किंवा घर रिकामे करण्याची नोटीस जोडा. १००% आपल्या डिव्हाइसवर प्रक्रिया होते.',
    chooseFile: 'डिव्हाइसमधून फाइल निवडा',
    takePhoto: 'फोटो काढा / स्कॅन करा',
    pasteTextTitle: 'किंवा नोटीसमधील मजकूर येथे पेस्ट करा',
    pastePlaceholder: 'कायदेशीर नोटीस किंवा समन्सचा मजकूर येथे पेस्ट करा...',
    analyzeTextBtn: 'दस्तऐवजाचे विश्लेषण करा',
    sampleFixturesTitle: 'नमुना उदाहरणे तपासा (भारतीय कायद्यावर आधारित)',
    sampleFixturesDesc: 'गोपनीयता, कलम व अधिकृत कायदेशीर प्रक्रिया समजून घेण्यासाठी खालील उदाहरणावर क्लिक करा:',

    // Privacy review
    piiReviewTitle: 'संवेदनशील वैयक्तिक माहिती ओळखली गेली',
    piiReviewDesc: 'आधार क्रमांक, पॅन कार्ड, फोन नंबर, पत्ता आणि रक्कम आपोआप लपवून सुरक्षित केली जाते.',
    toggleAll: 'सर्व संवेदनशील माहिती लपवा',
    customPiiPlaceholder: 'लपवण्यासाठी नवीन शब्द टाका (उदा. नाव, गाव)...',
    addTerm: 'शब्द जोडा',
    sanitizedPreview: 'सुरक्षित डेटा पूर्वावलोकन',
    proceedToVerify: 'तपशील पडताळणीसाठी पुढे जा',
    proceedLocalOnly: 'केवळ स्थानिक नियमांनुसार पुढे जा',

    // Fields review
    fieldReviewTitle: 'दस्तऐवजाचा प्रकार आणि महत्त्वाच्या तारखा',
    fieldReviewDesc: 'भारतीय कायद्यानुसार ओळखलेला प्रकार आणि दस्तऐवजावरील तारखा तपासून घ्या.',
    docTypeLabel: 'दस्तऐवज श्रेणी (भारतीय कायदा)',
    confidenceHigh: 'उच्च अचूकता',
    confidenceMedium: 'पडताळणी आवश्यक',
    confidenceLow: 'अस्पष्ट / कमी दर्जा',
    markUnclear: 'अस्पष्ट म्हणून नोंदवा',
    generateGuidanceBtn: 'कायदेशीर कृती आराखडा तयार करा',
    generateAiGuidanceBtn: 'सोप्या भाषेत समजावून घ्या (AI विश्लेषण)',

    // Results & Guidance
    urgencyMeterTitle: 'कायदेशीर निकड मीटर (Urgency Meter)',
    urgencyImmediate: 'तातडीचे — त्वरित पाऊल उचला (कोर्ट समन्स / चेक बाऊन्स)',
    urgencySoon: 'मध्यम निकड — ७ ते १५ दिवसांत पावले उचला',
    urgencyStandard: 'सर्वसाधारण माहिती / प्राथमिक नोटीस',
    timelineTitle: 'भारतीय कायदेशीर प्रक्रियेची कालमर्यादा (Timeline)',
    plainSummaryTitle: '१. हा दस्तऐवज काय सांगतो (सोप्या भाषेत अर्थ)',
    datesTitle: '२. दस्तऐवजावरील महत्त्वाच्या तारखा (कोर्टात पडताळण्याजोग्या)',
    unknownsTitle: '३. दस्तऐवजावरून खात्रीने न सांगता येणाऱ्या बाबी',
    checklistTitle: '४. तुमच्यासाठी पुढील पायऱ्या (Action Checklist)',
    legalAidTitle: '५. मोफत सरकारी विधी सेवा व कोर्ट पोर्टल (NALSA / MSLSA)',
    citationsTitle: '६. भारतीय कायदे व कलमे (Statutory References)',
    printSummary: 'चेकलिस्ट प्रिंट करा / पीडीएफ जतन करा',
    exportTxt: 'मजकूर डाउनलोड करा (.txt)',
    saveAssessment: 'हे मूल्यांकन जतन करा',
    savedSuccess: 'दस्तऐवज मूल्यांकन आपल्या खात्यामध्ये यशस्वीपणे जतन झाले!',

    // Senior / Plain language explainer
    saralBhashaToggle: 'सोपी भाषा मार्गदर्शक (कठीण कायदेशीर शब्दांचे अर्थ)',
    saralBhashaDesc: 'वकालतनामा, समन्स, एकतर्फी हुकूमनामा (Ex-Parte) यांसारख्या कठीण शब्दांचे सोप्या मराठीत अर्थ.',

    // Exit popup
    unsavedModalTitle: 'बाहेर पडण्यापूर्वी आपले मूल्यांकन जतन करायचे आहे का?',
    unsavedModalDesc: 'तुमच्या ब्राउझरमध्ये सक्रिय दस्तऐवज मूल्यांकन आहे. बंद करण्यापूर्वी काय करायचे आहे?',
    saveToAccountBtn: 'माझ्या खात्यामध्ये जतन करा (लॉग इन / नोंदणी)',
    saveLocalBtn: 'या डिव्हाइसवर स्थानिक जतन करा',
    discardAndExitBtn: 'सर्व डेटा कायमचा हटवा',
    cancelKeepWorking: 'दस्तऐवजावर काम सुरू ठेवा',

    // Auth
    loginModalTitle: 'नागरिक खाते / लॉग इन',
    loginModalDesc: 'आपले जतन केलेले कायदेशीर दस्तऐवज कधीही पाहण्यासाठी लॉग इन करा. अतिथी मोड देखील उपलब्ध आहे.',
    emailOrPhone: 'ईमेल किंवा मोबाइल नंबर',
    password: 'पासवर्ड किंवा ४-अंकी पिन',
    loginAction: 'लॉग इन करा',
    registerAction: 'नवीन खाते तयार करा',
    continueGuest: 'अतिथी म्हणून सुरू ठेवा (लोकल स्टोरेज)',
    logout: 'बाहेर पडा (Sign Out)',
    loggedInAs: 'लॉग इन नागरिक',

    // Legal disclaimer
    disclaimer: 'अस्वीकरण: न्याय मित्र हे तंत्रज्ञान आधारित माहिती साधन आहे, वकील किंवा लॉ फर्म नाही. हा कायदेशीर सल्ला नाही. कृपया अधिकृत वकिलांचा सल्ला घ्या किंवा आपल्या जवळच्या जिल्हा विधी सेवा प्राधिकरण (DLSA) / NALSA (टोल-फ्री १५१००) शी संपर्क साधा.'
  }
};

export function getTranslation(lang: SupportedLanguage, key: string, fallback?: string): string {
  const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return langDict[key] || TRANSLATIONS.en[key] || fallback || key;
}

const STORAGE_LANG_KEY = 'nyaya_mitra_lang_v1';

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  const val = localStorage.getItem(STORAGE_LANG_KEY);
  if (val === 'hi' || val === 'mr' || val === 'en') return val;
  return 'en';
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_LANG_KEY, lang);
}

