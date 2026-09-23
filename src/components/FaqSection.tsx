/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  ChevronDown,
  Scale,
  ShieldCheck,
  Lock,
  Clock,
  Landmark,
  FileCheck2,
  Sparkles,
  Search,
  ExternalLink,
  Bot,
  AlertTriangle,
  Printer,
  UserCheck
} from 'lucide-react';
import { SupportedLanguage } from '../services/i18n';

export interface FaqItem {
  id: string;
  category: 'mentor' | 'privacy' | 'law' | 'aid';
  categoryLabel: {
    en: string;
    hi: string;
    mr: string;
  };
  question: {
    en: string;
    hi: string;
    mr: string;
  };
  answer: {
    en: string;
    hi: string;
    mr: string;
  };
  keyTakeaways?: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  highlight?: boolean;
}

interface FaqSectionProps {
  language: SupportedLanguage;
  onOpenWhyNotAiModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onRunAuditTests?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  language,
  onOpenWhyNotAiModal,
  onOpenPrivacyModal,
  onRunAuditTests
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'why-not-general-ai': true // expanded by default so mentors & citizens immediately see it
  });

  const toggleItem = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    faqItems.forEach(item => {
      allExpanded[item.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const faqItems: FaqItem[] = useMemo(() => [
    {
      id: 'why-not-general-ai',
      category: 'mentor',
      highlight: true,
      categoryLabel: {
        en: 'Mentor & Core Architecture',
        hi: 'मेंटर एवं मुख्य तकनीक',
        mr: 'मार्गदर्शक आणि मुख्य तंत्रज्ञान'
      },
      question: {
        en: "Why can't I just do this using a normal general-purpose AI assistant (like ChatGPT or Gemini)?",
        hi: 'क्या मैं यह सामान्य AI सहायक (जैसे ChatGPT या Gemini) से नहीं कर सकता?',
        mr: 'हे मी सामान्य AI असिस्टंट (जसे ChatGPT किंवा Gemini) वापरून का करू शकत नाही?'
      },
      answer: {
        en: 'A general-purpose LLM is a probabilistic text predictor; legal notice analysis in India requires deterministic procedural guardrails. Normal AI assistants fail in 7 critical ways: they leak sensitive Indian PII (Aadhaar, PAN, bank accounts) to cloud chat logs; they hallucinate non-negotiable statutory deadlines (e.g. telling someone they have 30–60 days when Section 138 NI Act allows strictly 15 days); they generate unauthorized speculative legal advice; they conflate foreign/US laws ("motion to dismiss"); they fail to connect indigent citizens to free government legal aid (NALSA 15100); they are vulnerable to prompt injections hidden in notices; and they lack elder-friendly voice and high-contrast assistance.',
        hi: 'सामान्य AI केवल टेक्स्ट प्रेडिक्ट करता है, जबकि भारत में कानूनी नोटिस के लिए तय कानूनी नियमों की जरूरत होती है। सामान्य AI में 7 बड़े खतरे हैं: वे आधार, पैन और बैंक खाते क्लाउड सर्वर पर अपलोड कर देते हैं; वे 15 दिन की सख्त कानूनी समयसीमा (धारा 138 चेक बाउंस) में गलत तारीख बता सकते हैं; वे विदेशी कानून (जैसे अमेरिकी मोशन टू डिस्मिस) का भ्रम पैदा करते हैं; और वे सरकारी मुफ्त कानूनी सहायता (NALSA 15100) से नहीं जोड़ते।',
        mr: 'सामान्य AI केवळ मजकूर प्रेडिक्ट करतो, पण भारतात कायदेशीर नोटीससाठी अचूक न्यायालयीन नियमांची गरज असते. सामान्य AI मध्ये ७ मोठे धोके आहेत: ते आधार, पॅन आणि बँक तपशील क्लाऊडवर पाठवतात; कलम १३८ चेक बाऊन्सची १५ दिवसांची मुदत चुकवून चुकीचा सल्ला देऊ शकतात; आणि मोफत शासकीय विधी सेवा (NALSA 15100) शी जोडत नाहीत.'
      },
      keyTakeaways: {
        en: [
          '100% In-Browser Privacy: Zero personal identifiers (Aadhaar, PAN, phone) ever leave your device memory.',
          'Exact Limitation Calculations: Strict 15-day Section 138 cure window computed from speed post delivery date.',
          'Anti-Hallucination Neutrality: Verified procedural facts without unauthorized outcome predictions.',
          'Statutory Legal Aid: Automatic eligibility routing to NALSA 15100 and state DLSA clinics.'
        ],
        hi: [
          '100% ब्राउज़र गोपनीयता: आधार, पैन और मोबाइल नंबर कभी भी आपके फोन या कंप्यूटर से बाहर नहीं जाते।',
          'सटीक समयसीमा: स्पीड पोस्ट मिलने की तारीख से धारा 138 की 15-दिवसीय अनिवार्य गणना।',
          'सत्यापित तथ्यात्मक जानकारी: बिना किसी भ्रामक कानूनी वादों के निष्पक्ष सलाह।',
          'मुफ्त सरकारी वकील: NALSA हेल्पलाइन 15100 और जिला विधिक सेवा प्राधिकरण से सीधा जुड़ाव।'
        ],
        mr: [
          '१००% ब्राउझर गोपनीयता: आधार, पॅन आणि संपर्क माहिती तुमच्या डिव्हाइसबाहेर कधीही जात नाही.',
          'अचूक मुदत गणना: स्पीड पोस्ट मिळाल्यापासून कलम १३८ ची १५ दिवसांची अनिवार्य मुदत.',
          'निष्पक्ष आणि सत्य माहिती: कोणताही खोटा अंदाज न बांधता न्यायालयीन प्रक्रिया स्पष्ट करणे.',
          'मोफत कायदेशीर सहाय्य: NALSA टोल-फ्री १५१०० आणि जिल्हा विधी सेवा प्राधिकरणाशी जोडणी.'
        ]
      }
    },
    {
      id: 'privacy-data-storage',
      category: 'privacy',
      categoryLabel: {
        en: 'Data Protection & Privacy',
        hi: 'डेटा सुरक्षा एवं गोपनीयता',
        mr: 'माहिती सुरक्षा आणि गोपनीयता'
      },
      question: {
        en: 'Is my personal data (Aadhaar, PAN, phone number, address) uploaded to any server or AI model?',
        hi: 'क्या मेरा व्यक्तिगत डेटा (आधार, पैन, मोबाइल नंबर, पता) किसी सर्वर या AI मॉडल पर अपलोड होता है?',
        mr: 'माझा वैयक्तिक डेटा (आधार, पॅन, फोन नंबर, पत्ता) कोणत्याही सर्व्हरवर किंवा AI मॉडेलवर अपलोड होतो का?'
      },
      answer: {
        en: 'No. Nyaya Mitra is built with a strict Zero-Cloud-PII architecture complying with the Indian Digital Personal Data Protection (DPDP) Act, 2023. Optical Character Recognition (OCR) and privacy masking execute entirely inside your web browser’s local sandbox memory. All Aadhaar numbers (12-digit UIDAI format), PAN cards, phone numbers, and bank account numbers are redacted into secure cryptographic placeholder tokens on the edge before any analysis occurs.',
        hi: 'बिल्कुल नहीं। न्याय मित्र भारत के डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) एक्ट 2023 के तहत 100% ऑन-डिवाइस कार्य करता है। सारा OCR और डेटा मास्किंग आपके ब्राउज़र में ही होता है। आधार, पैन और बैंक खातों को डिवाइस में ही सुरक्षित मास्क कर दिया जाता है।',
        mr: 'नाही, मुळीच नाही. न्याय मित्र हे भारताच्या DPDP Act २०२३ च्या नियमांनुसार पूर्णपणे तुमच्या ब्राऊझरमध्ये स्थानिक पातळीवर काम करते. आधार क्रमांक, पॅन कार्ड आणि बँक तपशील तुमच्याच डिव्हाइसवर आपोआप सुरक्षितपणे झाकले (Mask) जातात.'
      },
      keyTakeaways: {
        en: [
          'Edge OCR via WebAssembly/Tesseract in browser sandbox',
          'Deterministic regex masking for Aadhaar, PAN, and Indian mobile numbers',
          'Zero document retention on external servers'
        ],
        hi: [
          'ब्राउज़र सैंडबॉक्स में लोकल OCR प्रोसेसिंग',
          'आधार, पैन और फोन नंबर के लिए तत्काल ऑन-स्क्रीन मास्किंग',
          'बाहरी सर्वर पर कोई दस्तावेज़ या फोटो सेव नहीं होती'
        ],
        mr: [
          'ब्राऊझरमध्येच स्थानिक OCR प्रक्रिया',
          'आधार, पॅन आणि संपर्क क्रमांकांचे तात्काळ मास्किंग',
          'कोणत्याही बाह्य सर्व्हरवर डेटा साठवला जात नाही'
        ]
      }
    },
    {
      id: 'legal-advice-boundary',
      category: 'mentor',
      categoryLabel: {
        en: 'Legal Role & Ethics',
        hi: 'कानूनी भूमिका एवं मर्यादा',
        mr: 'कायदेशीर भूमिका आणि मर्यादा'
      },
      question: {
        en: 'Does Nyaya Mitra replace an advocate or give official legal advice?',
        hi: 'क्या न्याय मित्र किसी वकील की जगह लेता है या कानूनी सलाह देता है?',
        mr: 'न्याय मित्र वकिलाची जागा घेते का किंवा अधिकृत कायदेशीर सल्ला देते का?'
      },
      answer: {
        en: 'No. Nyaya Mitra is an educational legal notice navigator, not a licensed legal practitioner. Under the Advocates Act, 1961, only enrolled advocates can practice law in Indian courts. Nyaya Mitra demystifies complex legalese into Saral Bhasha (plain language), highlights non-negotiable statutory timelines, identifies missing facts, and connects citizens directly to institutional legal aid (NALSA / DLSA). It never provides speculative predictions on case outcomes.',
        hi: 'नहीं। न्याय मित्र किसी वकील का विकल्प नहीं है। यह कानूनी नोटिस को सरल भाषा में समझाने, समयसीमा बताने और आवश्यक दस्तावेज़ों की सूची तैयार करने का सहायक है। आधिकारिक पैरवी के लिए यह आपको सरकारी मुफ्त कानूनी सहायता (NALSA) या वकील से जोड़ता है।',
        mr: 'नाही. न्याय मित्र हे वकिलाचा पर्याय नाही. हे केवळ कायदेशीर नोटीस सोप्या भाषेत समजून सांगण्यासाठी, महत्त्वाच्या तारखा दाखवण्यासाठी आणि NALSA मार्फत मोफत वकील मिळवण्यासाठी मार्गदर्शन करते.'
      }
    },
    {
      id: 'section-138-cheque-bounce',
      category: 'law',
      categoryLabel: {
        en: 'Indian Statutes & Deadlines',
        hi: 'भारतीय कानून एवं समयसीमा',
        mr: 'भारतीय कायदे आणि मुदत'
      },
      question: {
        en: 'What should I do first if I receive a Section 138 Cheque Bounce notice?',
        hi: 'यदि मुझे धारा 138 चेक बाउंस की नोटिस मिले तो सबसे पहले क्या करना चाहिए?',
        mr: 'मला कलम १३८ चेक बाऊन्सची नोटीस आल्यास मी सर्वात आधी काय करावे?'
      },
      answer: {
        en: 'Do not panic, but act immediately. Under Section 138 proviso (c) of the Negotiable Instruments Act, 1881, the recipient has exactly 15 calendar days from the date of postal delivery to pay the demanded amount or send a formal legal reply. First, preserve the envelope or Speed Post delivery slip to prove the exact delivery date. Second, obtain the Bank Return Memo to see why the cheque was dishonoured. Third, consult a legal aid lawyer or advocate to send a timely reply denying false liability if the cheque was an undated security cheque.',
        hi: 'घबराएं नहीं, लेकिन तुरंत कदम उठाएं। एनआई एक्ट की धारा 138 के तहत नोटिस मिलने के दिन से 15 दिनों का समय होता है। सबसे पहले स्पीड पोस्ट का लिफाफा सुरक्षित रखें ताकि डिलीवरी की तारीख साबित हो सके। बैंक मेमो प्राप्त करें और 15 दिन पूरे होने से पहले NALSA या वकील की मदद से जवाब दें।',
        mr: 'घाबरून जाऊ नका, पण तातडीने पावले उचला. निगोशिएबल इन्स्ट्रुमेंट्स अ‍ॅक्टच्या कलम १३८ नुसार नोटीस मिळालेल्या तारखेपासून बरोबर १५ दिवसांची मुदत असते. स्पीड पोस्टचे पाकीट जपून ठेवा, बँकेचा मेमो तपासा आणि १५ दिवसांच्या आत वकिलामार्फत उत्तर पाठवा.'
      },
      keyTakeaways: {
        en: [
          'Day 1 starts on the day you receive the speed post, NOT the date written on the lawyer notice.',
          'If the 15-day cure period expires without payment or reply, the complainant has 30 days to file a criminal complaint under Section 142 before a Judicial Magistrate.'
        ],
        hi: [
          '15 दिन की गिनती नोटिस मिलने की तारीख से शुरू होती है, वकील द्वारा पत्र लिखने की तारीख से नहीं।',
          'यदि 15 दिन में समाधान या जवाब नहीं दिया जाता, तो परिवादी 30 दिन के अंदर मजिस्ट्रेट कोर्ट में केस दर्ज कर सकता है।'
        ],
        mr: [
          '१५ दिवसांची गणना नोटीस मिळालेल्या दिवसापासून होते, वकिलाने नोटीस तयार केलेल्या तारखेपासून नाही.',
          '१५ दिवसांत उत्तर न दिल्यास समोरील व्यक्ती न्यायालयामध्ये फौजदारी तक्रार दाखल करू शकते.'
        ]
      }
    },
    {
      id: 'free-legal-aid-eligibility',
      category: 'aid',
      categoryLabel: {
        en: 'Free Legal Aid & NALSA',
        hi: 'मुफ्त कानूनी सहायता एवं NALSA',
        mr: 'मोफत कायदेशीर सहाय्य आणि NALSA'
      },
      question: {
        en: 'Who is eligible for 100% Free Legal Aid in India?',
        hi: 'भारत में 100% मुफ्त कानूनी सहायता का पात्र कौन है?',
        mr: 'भारतात १००% मोफत कायदेशीर मदतीसाठी कोण पात्र आहे?'
      },
      answer: {
        en: 'Under Section 12 of the Legal Services Authorities Act, 1987, free legal aid is guaranteed by the Government of India to: (1) All women and children; (2) Members of Scheduled Castes (SC) or Scheduled Tribes (ST); (3) Senior citizens (in states like Maharashtra & Delhi); (4) Persons with disabilities or mental illness; (5) Victims of trafficking or disaster; (6) Industrial workmen; (7) Persons in custody; and (8) Citizens whose annual income is below statutory thresholds (e.g. up to ₹3,00,000 in Maharashtra/Delhi).',
        hi: 'विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12 के तहत भारत सरकार द्वारा निम्नलिखित को पूरी तरह मुफ्त वकील व कानूनी सहायता दी जाती है: (1) सभी महिलाएं एवं बच्चे; (2) अनुसूचित जाति (SC) एवं जनजाति (ST); (3) वरिष्ठ नागरिक; (4) दिव्यांग व्यक्ति; (5) औद्योगिक श्रमिक; एवं (6) निर्धारित आय सीमा से कम आय वाले नागरिक।',
        mr: 'विधी सेवा प्राधिकरण कायदा १९८७ च्या कलम १२ नुसार: (१) सर्व महिला आणि बालके; (२) अनुसूचित जाती/जमाती; (३) ज्येष्ठ नागरिक; (४) दिव्यांग व्यक्ती; (५) कामगार; आणि (६) ठराविक मर्यादेपेक्षा कमी वार्षिक उत्पन्न असणाऱ्या सर्व नागरिकांना सरकार मोफत वकील उपलब्ध करून देते.'
      },
      keyTakeaways: {
        en: [
          'National Helpline: Dial 15100 (Toll-Free, 24x7 across India)',
          'State Authority: MSLSA (Maharashtra) 022-22691358',
          'Courts: District Legal Services Authority (DLSA) present in every district court complex'
        ],
        hi: [
          'राष्ट्रीय हेल्पलाइन: 15100 (टोल-फ्री, 24x7 पूरे भारत में)',
          'राज्य प्राधिकरण: MSLSA (महाराष्ट्र) 022-22691358',
          'प्रत्येक जिला अदालत परिसर में DLSA केंद्र स्थित है'
        ],
        mr: [
          'राष्ट्रीय हेल्पलाइन: १५१०० (टोल-फ्री, २४ तास कार्यरत)',
          'महाराष्ट्र राज्य विधी सेवा प्राधिकरण: ०२२-२२६९१३५८',
          'प्रत्येक जिल्हा न्यायालय आवारात DLSA कार्यालय असते'
        ]
      }
    },
    {
      id: 'printable-court-summary',
      category: 'law',
      categoryLabel: {
        en: 'Court Readiness',
        hi: 'अदालत की तैयारी',
        mr: 'न्यायालयाची तयारी'
      },
      question: {
        en: 'Can I take the Nyaya Mitra summary directly to an advocate or court?',
        hi: 'क्या मैं न्याय मित्र की समरी को सीधे वकील या अदालत में ले जा सकता हूँ?',
        mr: 'मी न्याय मित्रचा अहवाल थेट वकिलाकडे किंवा न्यायालयात घेऊन जाऊ शकतो का?'
      },
      answer: {
        en: 'Yes. In Step 4 (Guidance & Assessment), click the "Print 1-Page Summary" button. Nyaya Mitra formats a high-contrast, clean 1-page physical reference sheet containing verified statutory dates, missing questions to ask your advocate, statutory references, and emergency contacts. This enables elderly citizens, non-lawyers, and paralegal volunteers to present their case clearly in under 3 minutes.',
        hi: 'हाँ। चौथे चरण में "1-Page Summary प्रिंट करें" बटन दबाएं। न्याय मित्र एक साफ-सुथरा 1-पेज का समरी प्रिंट तैयार करता है जिसमें तारीखें, वकील से पूछने वाले सवाल और कानूनी धाराएं शामिल होती हैं। इसे आप वकील या विधिक सेवा केंद्र में ले जा सकते हैं।',
        mr: 'होय. चौथ्या टप्प्यात "१-पेज सारांश प्रिंट करा" या बटनावर क्लिक करा. यामध्ये सर्व महत्त्वाच्या तारखा, वकिलांना विचारण्याचे प्रश्न आणि कायद्याचे संदर्भ एका पानावर स्वच्छ स्वरूपात प्रिंट होतात.'
      }
    },
    {
      id: 'supported-jurisdictions',
      category: 'law',
      categoryLabel: {
        en: 'Supported States',
        hi: 'मान्य राज्य एवं न्यायालय',
        mr: 'समर्थित राज्ये आणि न्यायालये'
      },
      question: {
        en: 'Which Indian states and court jurisdictions are currently supported?',
        hi: 'वर्तमान में कौन-से भारतीय राज्य और अदालतें समर्थित हैं?',
        mr: 'सध्या कोणती भारतीय राज्ये आणि न्यायालये समर्थित आहेत?'
      },
      answer: {
        en: 'Nyaya Mitra currently includes active statutory rulebooks for: Maharashtra (Bombay High Court, Maharashtra Rent Control Act 1999, MSLSA), Karnataka (Karnataka High Court, Karnataka Rent Act 1999, KSLSA), Delhi (Delhi High Court, Delhi Rent Control Act 1958, DSLSA), and Central Indian Statutes including the Negotiable Instruments Act 1881, Consumer Protection Act 2019, and the Code of Civil Procedure (CPC) 1908.',
        hi: 'वर्तमान में महाराष्ट्र (बॉम्बे हाईकोर्ट, महाराष्ट्र रेंट कंट्रोल एक्ट 1999), कर्नाटक (कर्नाटक हाईकोर्ट, रेंट एक्ट 1999), दिल्ली (दिल्ली हाईकोर्ट, रेंट एक्ट 1958), तथा केंद्रीय कानून (एनआई एक्ट 1881, उपभोक्ता संरक्षण अधिनियम 2019, सिविल प्रक्रिया संहिता 1908) पूरी तरह समर्थित हैं।',
        mr: 'सध्या महाराष्ट्र (मुंबई उच्च न्यायालय, महाराष्ट्र भाडे नियंत्रण कायदा १९९९), कर्नाटक (कर्नाटक उच्च न्यायालय), दिल्ली (दिल्ली उच्च न्यायालय) आणि केंद्रीय कायदे (एनआय अ‍ॅक्ट १८८१, ग्राहक संरक्षण कायदा २०१९) समाविष्ट आहेत.'
      }
    }
  ], []);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const questionText = (item.question[language] || item.question.en).toLowerCase();
      const answerText = (item.answer[language] || item.answer.en).toLowerCase();
      const catText = (item.categoryLabel[language] || item.categoryLabel.en).toLowerCase();

      return matchesCategory && (questionText.includes(q) || answerText.includes(q) || catText.includes(q));
    });
  }, [faqItems, selectedCategory, searchQuery, language]);

  return (
    <section
      id="faq-section"
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden my-8"
      aria-labelledby="faq-heading"
    >
      {/* Decorative subtle background tint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Section Header: Spacious & Uncluttered */}
      <div className="max-w-3xl mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <HelpCircle className="w-4 h-4 text-amber-700" />
          </span>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
            {language === 'hi'
              ? 'सवाल एवं जवाब'
              : language === 'mr'
              ? 'नेहमी विचारले जाणारे प्रश्न'
              : 'Knowledge Base & Answers'}
          </span>
        </div>

        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          {language === 'hi'
            ? 'अक्सर पूछे जाने वाले सवाल (FAQs)'
            : language === 'mr'
            ? 'वारंवार विचारले जाणारे प्रश्न (FAQs)'
            : 'Frequently Asked Questions (FAQs)'}
        </h2>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {language === 'hi'
            ? 'नागरिकों और मेंटर्स के मुख्य सवालों के स्पष्ट, प्रामाणिक और कानूनी जवाब।'
            : language === 'mr'
            ? 'नागरिक आणि परीक्षकांसाठी महत्त्वाच्या न्यायालयीन व तांत्रिक बाबींचे स्पष्टीकरण.'
            : 'Clear, verifiable answers to common citizen inquiries and core technical/architectural evaluation questions.'}
        </p>
      </div>

      {/* Controls Bar: Search & Category Filter Pills */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'hi' ? 'सभी प्रश्न' : language === 'mr' ? 'सर्व प्रश्न' : 'All Questions'} ({faqItems.length})
            </button>

            <button
              onClick={() => setSelectedCategory('mentor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'mentor'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'मेंटर एवं AI तुलना' : language === 'mr' ? 'मार्गदर्शक व AI तुलना' : 'Mentor & AI Comparison'}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('privacy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'privacy'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'गोपनीयता' : language === 'mr' ? 'गोपनीयता' : 'Privacy & PII'}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('law')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'law'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'धारा 138 एवं कानून' : language === 'mr' ? 'कलम १३८ व कायदे' : 'Section 138 & Deadlines'}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('aid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'aid'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>NALSA 15100</span>
            </button>
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <button
              onClick={expandAll}
              className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline underline-offset-2"
            >
              {language === 'hi' ? 'सभी खोलें' : language === 'mr' ? 'सर्व उघडा' : 'Expand all'}
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={collapseAll}
              className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline underline-offset-2"
            >
              {language === 'hi' ? 'सभी बंद करें' : language === 'mr' ? 'सर्व बंद करा' : 'Collapse all'}
            </button>
          </div>
        </div>

        {/* Search input for spacious search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'सवाल या विषय खोजें (उदा. सामान्य AI, धारा 138, आधार गोपनीयता, NALSA)...'
                : language === 'mr'
                ? 'प्रश्न किंवा विषय शोधा (उदा. सामान्य AI, कलम १३८, आधार गोपनीयता, NALSA)...'
                : 'Search questions by keyword (e.g. general AI, Section 138, Aadhaar privacy, NALSA)...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* FAQ Accordion List: Spacious, Clean Cards */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs sm:text-sm">
            {language === 'hi'
              ? 'आपकी खोज के अनुसार कोई सवाल नहीं मिला।'
              : language === 'mr'
              ? 'आपल्या शोधानुसार कोणताही प्रश्न आढळला नाही.'
              : 'No matching questions found. Try clearing your search query.'}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = !!expandedIds[item.id];
            const isHighlight = item.highlight;

            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all border ${
                  isHighlight
                    ? isExpanded
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-amber-300 hover:border-amber-400 shadow-2xs'
                    : isExpanded
                    ? 'bg-slate-50/70 border-slate-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isHighlight
                            ? 'bg-amber-200/90 text-amber-950 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.categoryLabel[language] || item.categoryLabel.en}
                      </span>

                      {isHighlight && (
                        <span className="text-[10px] font-black text-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Core Mentor Defense</span>
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-black leading-snug tracking-tight ${
                        isHighlight ? 'text-amber-950' : 'text-slate-900'
                      }`}
                    >
                      {item.question[language] || item.question.en}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform ${
                      isExpanded
                        ? 'bg-slate-900 text-white rotate-180'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expanded Answer */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 border-t border-slate-200/70">
                        <p>{item.answer[language] || item.answer.en}</p>

                        {/* Bulleted Key Takeaways */}
                        {item.keyTakeaways && (
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                              {language === 'hi'
                                ? 'मुख्य बिंदु / Key Takeaways:'
                                : language === 'mr'
                                ? 'महत्त्वाचे मुद्दे / Key Takeaways:'
                                : 'Key Takeaways:'}
                            </p>
                            <ul className="space-y-1 list-disc list-inside text-xs text-slate-600 leading-relaxed">
                              {(item.keyTakeaways[language] || item.keyTakeaways.en).map((pt, idx) => (
                                <li key={idx} className="font-medium">
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Interactive Deep-Dive Actions for Mentor Question */}
                        {item.id === 'why-not-general-ai' && (
                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            {onOpenWhyNotAiModal && (
                              <button
                                type="button"
                                onClick={onOpenWhyNotAiModal}
                                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>Open Full 7-Pillar Matrix & Simulator</span>
                              </button>
                            )}

                            {onRunAuditTests && (
                              <button
                                type="button"
                                onClick={onRunAuditTests}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Inspect 8 Automated Safety Tests</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Spacious Footer Assistance Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span>🏛️</span>
          <span>
            NALSA National Legal Aid 24×7 Toll-Free: <strong className="text-slate-800 font-black">15100</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onOpenPrivacyModal && (
            <button
              onClick={onOpenPrivacyModal}
              className="text-slate-700 hover:text-amber-800 font-bold transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'गोपनीयता नीति (DPDP 2023)' : language === 'mr' ? 'गोपनीयता धोरण' : 'In-Browser Privacy Architecture'}
            </button>
          )}

          <a
            href="https://nalsa.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-amber-800 font-bold transition-colors inline-flex items-center gap-1"
          >
            <span>nalsa.gov.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
