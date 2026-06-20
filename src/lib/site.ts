export type PageKey =
  | "home"
  | "about"
  | "how-healthcare-works"
  | "ohip"
  | "find-care"
  | "emergency"
  | "mental-health"
  | "chat"
  | "sources"
  | "privacy"
  | "disclaimer";

export type SitePage = {
  key: PageKey;
  href: string;
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  lastReviewed?: string;
  helpsWith?: string[];
  nextSteps?: string[];
  sources?: {
    title: string;
    organization: string;
    note: string;
  }[];
  sections: {
    title: string;
    body: string;
  }[];
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/how-healthcare-works", label: "How healthcare works" },
  { href: "/ohip", label: "OHIP" },
  { href: "/find-care", label: "Find care" },
  { href: "/emergency", label: "Emergency" },
  { href: "/mental-health", label: "Mental health" },
  { href: "/chat", label: "Chat" },
  { href: "/sources", label: "Sources" }
] as const;

export const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" }
] as const;

const placeholderSources = {
  ontarioHealth: {
    title: "Ontario health services information",
    organization: "Government of Ontario",
    note: "Placeholder source card. Add the exact official page URL and review date before publishing detailed guidance."
  },
  serviceOntario: {
    title: "Health card and public service information",
    organization: "ServiceOntario",
    note: "Placeholder source card. Verify application steps, documents, and service options with official text."
  },
  health811: {
    title: "Health811 navigation and health information",
    organization: "Government of Ontario",
    note: "Placeholder source card. Confirm current service description and appropriate redirection language."
  },
  publicHealth: {
    title: "Local public health information",
    organization: "Ontario public health units",
    note: "Placeholder source card. Add relevant local public health sources and confirm service availability."
  },
  mentalHealth: {
    title: "Mental health and crisis support resources",
    organization: "Official and community health organizations",
    note: "Placeholder source card. Verify current crisis lines, service hours, eligibility, and languages."
  },
  privacy: {
    title: "Privacy and personal information guidance",
    organization: "Project policy placeholder",
    note: "Placeholder source card. Replace with reviewed privacy policy and applicable legal guidance before collecting data."
  }
} as const;

export const pages: Record<PageKey, SitePage> = {
  home: {
    key: "home",
    href: "/",
    label: "Home",
    title: "Ontario Health Navigator",
    eyebrow: "Newcomer healthcare guidance",
    description:
      "A plain-language starting point for people new to Ontario who want to understand where to begin with healthcare questions.",
    sections: [
      {
        title: "Start with the basics",
        body: "Use these pages as a simple orientation guide. The information here is placeholder content and should be replaced with verified public sources before launch."
      },
      {
        title: "Find the right next step",
        body: "Explore topics such as health coverage, where to seek care, emergency help, mental health support, and privacy."
      },
      {
        title: "Check official sources",
        body: "Healthcare programs and processes can change. Always confirm details with official Ontario, Government of Canada, or healthcare provider sources."
      }
    ]
  },
  about: {
    key: "about",
    href: "/about",
    label: "About",
    title: "About Ontario Health Navigator",
    eyebrow: "Purpose",
    description:
      "This website is a public-facing placeholder for a future newcomer healthcare navigation resource.",
    sections: [
      {
        title: "What this site is",
        body: "This site is designed to organize general healthcare navigation topics in a clear, accessible way."
      },
      {
        title: "What this site is not",
        body: "This site does not provide medical advice, legal advice, or final answers about eligibility, coverage, or benefits."
      }
    ]
  },
  "how-healthcare-works": {
    key: "how-healthcare-works",
    href: "/how-healthcare-works",
    label: "How healthcare works",
    title: "How Healthcare Works",
    eyebrow: "System overview",
    description:
      "A plain-language introduction to common places people may go for healthcare help in Ontario.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Understanding that different health concerns may need different types of services.",
      "Learning words you may hear, such as primary care, urgent care, emergency care, pharmacy, and public health.",
      "Preparing questions and documents before contacting a service."
    ],
    nextSteps: [
      "If there is immediate danger or a possible medical emergency, call 911.",
      "For non-emergency questions, write down your concern, your location, your language needs, and any documents you have.",
      "Use official Ontario or local health sources to confirm what service fits your situation."
    ],
    sources: [
      placeholderSources.ontarioHealth,
      placeholderSources.health811,
      placeholderSources.publicHealth
    ],
    // TODO: Verify official Ontario wording for healthcare service categories before publishing.
    sections: [
      {
        title: "Different needs, different services",
        body: "Ontario has many kinds of health services. Some are for ongoing care, some are for same-day concerns, and some are for serious or life-threatening situations. This page gives a general overview only."
      },
      {
        title: "Information to keep ready",
        body: "It can help to keep your identification, health coverage documents if you have them, medication names, allergy information, and questions in one place. Do not share private details unless a trusted service needs them."
      },
      {
        title: "Confirm before you go",
        body: "Hours, languages, appointment rules, fees, and required documents can vary. Confirm details with the official source or the service provider before you travel."
      }
    ]
  },
  ohip: {
    key: "ohip",
    href: "/ohip",
    label: "OHIP",
    title: "OHIP",
    eyebrow: "Health coverage",
    description:
      "A cautious overview page for learning where to find official information about Ontario health coverage.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Understanding that OHIP information must be checked with official Ontario sources.",
      "Preparing to look up eligibility, application steps, documents, and covered services.",
      "Avoiding decisions based on unverified or outdated information."
    ],
    nextSteps: [
      "Use official ServiceOntario or Government of Ontario sources for current OHIP information.",
      "Check official pages before making decisions about applications, documents, fees, or coverage.",
      "If your situation is complex, contact an official service channel or a qualified settlement support organization."
    ],
    sources: [
      placeholderSources.serviceOntario,
      placeholderSources.ontarioHealth
    ],
    // TODO: Add exact official OHIP eligibility, application, document, and coverage text only after source verification.
    sections: [
      {
        title: "Use this page as a starting point",
        body: "This page is not an eligibility checker. It should help you understand what kinds of questions to take to official Ontario sources."
      },
      {
        title: "What to verify",
        body: "Before taking action, verify eligibility, application steps, required documents, service locations, processing timelines, and what is or is not covered."
      },
      {
        title: "Keep records",
        body: "When contacting an official service, keep notes about the date, source, phone number or page used, and any next step you were given."
      }
    ]
  },
  "find-care": {
    key: "find-care",
    href: "/find-care",
    label: "Find care",
    title: "Find Care",
    eyebrow: "Where to go",
    description:
      "A newcomer-friendly guide for thinking about where to start when you need healthcare help.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Thinking about whether the situation is an emergency or non-emergency.",
      "Preparing useful information before contacting a clinic, pharmacy, public health unit, or official service.",
      "Finding source-backed next steps without guessing about eligibility or availability."
    ],
    nextSteps: [
      "Call 911 if the situation may be a medical emergency.",
      "For non-emergency questions, gather your location, symptoms or concern in your own words, language needs, and any health coverage information you have.",
      "Check official source cards and service websites for current hours, appointment rules, and contact options."
    ],
    sources: [
      placeholderSources.health811,
      placeholderSources.ontarioHealth,
      placeholderSources.publicHealth
    ],
    // TODO: Verify official Ontario language for finding care options and Health811 redirection.
    sections: [
      {
        title: "Start with urgency",
        body: "If someone may be in immediate danger, call 911. If it is not an emergency, you may have time to compare official options and contact the most appropriate service."
      },
      {
        title: "Ask practical questions",
        body: "Before visiting, ask about hours, appointments, accessibility, language support, accepted documents, and whether there may be a cost."
      },
      {
        title: "Use local information",
        body: "Healthcare access can depend on where you live. Local public health units, hospitals, clinics, and settlement organizations may have information for your area."
      }
    ]
  },
  emergency: {
    key: "emergency",
    href: "/emergency",
    label: "Emergency",
    title: "Emergency Care",
    eyebrow: "Urgent situations",
    description:
      "Clear emergency guidance for situations that may be serious, life-threatening, or unsafe.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Knowing that this website cannot decide whether symptoms are an emergency.",
      "Understanding that possible emergencies should be handled by emergency services.",
      "Finding the safest next step when you are worried about immediate harm."
    ],
    nextSteps: [
      "If this is a medical emergency, call 911 now.",
      "If you are with someone who may be seriously ill, injured, unconscious, unable to breathe normally, or in immediate danger, call 911.",
      "Do not wait for a chatbot or website response when the situation may be urgent."
    ],
    sources: [
      placeholderSources.ontarioHealth,
      placeholderSources.health811
    ],
    // TODO: Verify emergency redirection language with official Ontario emergency and health sources.
    sections: [
      {
        title: "Call 911 for emergencies",
        body: "If this is a medical emergency, call 911. This website cannot assess symptoms or decide whether a situation is an emergency."
      },
      {
        title: "Do not use this site for urgent decisions",
        body: "A website or chatbot should not be used to decide whether to delay emergency care. If you are worried about immediate danger, use emergency services."
      },
      {
        title: "After immediate danger",
        body: "After the emergency is handled, official sources or healthcare providers can explain follow-up steps. Keep any discharge or care instructions from professionals."
      }
    ]
  },
  "mental-health": {
    key: "mental-health",
    href: "/mental-health",
    label: "Mental health",
    title: "Mental Health",
    eyebrow: "Support",
    description:
      "A supportive starting point for finding mental health information and source-backed support options.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Understanding that mental health support can include crisis services, community programs, counselling, primary care, and peer support.",
      "Preparing to look for services that match your language, location, age, and situation.",
      "Recognizing that urgent safety concerns need immediate help."
    ],
    nextSteps: [
      "If someone may hurt themselves or someone else, or there is immediate danger, call 911.",
      "For non-emergency support, look for official or reputable mental health resources and confirm current hours and contact options.",
      "If language is a barrier, ask whether interpretation or multilingual support is available."
    ],
    sources: [
      placeholderSources.mentalHealth,
      placeholderSources.health811,
      placeholderSources.publicHealth
    ],
    // TODO: Verify mental health support names, crisis resources, hours, age ranges, and language availability.
    sections: [
      {
        title: "Support can look different",
        body: "Mental health support may include crisis help, counselling, community programs, primary care, peer support, or specialized services. The right starting point depends on the person and the situation."
      },
      {
        title: "Privacy and comfort matter",
        body: "You can ask services about confidentiality, language support, cultural support, appointment options, and whether there may be a cost."
      },
      {
        title: "Use verified resources",
        body: "Mental health service details can change. This page should be updated only with current, verified resources that are appropriate for newcomers."
      }
    ]
  },
  chat: {
    key: "chat",
    href: "/chat",
    label: "Chat",
    title: "Chat",
    eyebrow: "Guided help",
    description:
      "A placeholder for a future guided chat experience that helps visitors find relevant pages and official resources.",
    sections: [
      {
        title: "Coming later",
        body: "The chat feature is not connected yet. Future versions should include clear limits, privacy notices, source links, and escalation guidance."
      },
      {
        title: "No medical decisions",
        body: "A chat tool should not diagnose conditions, recommend treatment, or replace a healthcare professional."
      }
    ]
  },
  sources: {
    key: "sources",
    href: "/sources",
    label: "Sources",
    title: "Sources",
    eyebrow: "Verification",
    description:
      "A source library placeholder for the official information that will power future RAG answers.",
    lastReviewed: "MVP placeholder - official review needed",
    helpsWith: [
      "Showing which sources should support healthcare navigation answers.",
      "Preparing source records for future chatbot retrieval and citations.",
      "Making it clear when information still needs official review."
    ],
    nextSteps: [
      "Add exact URLs for official Ontario, ServiceOntario, Health811, public health, hospital, and reputable newcomer support pages.",
      "Track review dates and source owners for every source record.",
      "Use source cards to decide what the chatbot can and cannot answer."
    ],
    sources: [
      placeholderSources.ontarioHealth,
      placeholderSources.serviceOntario,
      placeholderSources.health811,
      placeholderSources.publicHealth
    ],
    // TODO: Replace placeholder source cards with verified source records and exact URLs before RAG ingestion.
    sections: [
      {
        title: "What belongs here",
        body: "This page should list the sources used by the website and chatbot. Each source should have a title, organization, official URL, topic, language availability, and review date."
      },
      {
        title: "How sources should be used",
        body: "Future chatbot answers should cite retrieved sources. If the source library does not support an answer, the chatbot should say the information was not found."
      },
      {
        title: "Review process",
        body: "Content should be reviewed regularly. When official guidance changes, affected pages and chatbot source records should be updated before users rely on them."
      }
    ]
  },
  privacy: {
    key: "privacy",
    href: "/privacy",
    label: "Privacy",
    title: "Privacy",
    eyebrow: "Data handling",
    description:
      "A plain-language privacy placeholder explaining what users should avoid entering into this website.",
    lastReviewed: "MVP placeholder - privacy/legal review needed",
    helpsWith: [
      "Understanding that this MVP should not collect sensitive personal or medical information.",
      "Knowing what not to type into future chat or contact features.",
      "Preparing for a complete privacy policy before any personal data is collected."
    ],
    nextSteps: [
      "Do not enter health card numbers, immigration document numbers, or private medical details.",
      "Do not enter passwords, banking information, or other sensitive identifiers.",
      "Before launch, replace this placeholder with a reviewed privacy notice that matches the actual data practices."
    ],
    sources: [
      placeholderSources.privacy
    ],
    // TODO: Replace with reviewed privacy policy and verify applicable Ontario/Canadian privacy requirements.
    sections: [
      {
        title: "Do not enter sensitive information",
        body: "Users should not enter health card numbers, immigration document numbers, private medical details, financial information, passwords, or other sensitive personal information into this website."
      },
      {
        title: "Future chatbot privacy",
        body: "If a chatbot is added, it should explain what information is collected, how long it is kept, who can access it, and how users can avoid sharing personal details."
      },
      {
        title: "Privacy policy needed",
        body: "This is placeholder content. A complete privacy policy should be reviewed before the site collects messages, analytics, feedback, or account information."
      }
    ]
  },
  disclaimer: {
    key: "disclaimer",
    href: "/disclaimer",
    label: "Disclaimer",
    title: "Disclaimer",
    eyebrow: "Important limits",
    description:
      "A plain statement about what this website and future chatbot can and cannot do.",
    lastReviewed: "MVP placeholder - legal review needed",
    helpsWith: [
      "Understanding that this website provides general navigation information only.",
      "Setting boundaries for future chatbot answers.",
      "Reminding users to confirm details with official sources or qualified professionals."
    ],
    nextSteps: [
      "Use this website as a starting point, not a final decision-maker.",
      "Confirm eligibility, fees, deadlines, documents, and service availability with official sources.",
      "Call 911 if there is a possible medical emergency."
    ],
    sources: [
      placeholderSources.privacy,
      placeholderSources.ontarioHealth
    ],
    // TODO: Replace with reviewed disclaimer text before public launch.
    sections: [
      {
        title: "Information only",
        body: "This website provides general navigation information. It does not provide medical advice, diagnosis, treatment, legal advice, or eligibility decisions."
      },
      {
        title: "Chatbot limits",
        body: "A future chatbot should answer only from retrieved sources. If the source library does not support an answer, it should say the information was not found."
      },
      {
        title: "Confirm before acting",
        body: "Programs, documents, fees, coverage, deadlines, and services can change. Confirm details with official sources or qualified professionals."
      }
    ]
  }
};
