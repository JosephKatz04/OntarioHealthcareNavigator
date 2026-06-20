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
      "A high-level introduction to the kinds of healthcare services people may encounter in Ontario.",
    sections: [
      {
        title: "Different kinds of care",
        body: "People may use different services depending on the situation, such as primary care, urgent care, emergency care, pharmacies, community services, or virtual options."
      },
      {
        title: "Prepare before you go",
        body: "Bring identification, relevant health documents, medication information, and questions you want to ask."
      },
      {
        title: "Verify details",
        body: "Service availability, costs, documents, and eligibility can vary. Confirm details with official sources or the service provider."
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
      "A placeholder page for general information about Ontario health coverage topics.",
    sections: [
      {
        title: "Coverage questions",
        body: "This page should eventually link to official information about eligibility, application steps, required documents, and covered services."
      },
      {
        title: "Use official guidance",
        body: "Do not rely on this placeholder text for coverage decisions. Check current government sources before taking action."
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
      "A general guide to thinking about where to seek care based on urgency and type of concern.",
    sections: [
      {
        title: "Match the service to the need",
        body: "Some needs are best handled by emergency services, while others may fit primary care, pharmacies, community clinics, public health, or mental health supports."
      },
      {
        title: "Ask before you visit",
        body: "Hours, appointment rules, accepted documents, languages, and fees can vary by location."
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
      "A plain reminder to seek emergency help when a situation may be serious or life-threatening.",
    sections: [
      {
        title: "Call for immediate help",
        body: "If this is a medical emergency, call 911. This website cannot assess symptoms or decide whether a situation is an emergency."
      },
      {
        title: "When unsure",
        body: "If you are worried about immediate danger, worsening symptoms, or a serious injury, use emergency services instead of waiting for website information."
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
      "A placeholder page for mental health and wellness navigation topics.",
    sections: [
      {
        title: "Support can look different",
        body: "Mental health support may include crisis services, community programs, counselling, primary care, peer support, or specialized care."
      },
      {
        title: "Use verified resources",
        body: "This page should be updated with official and community resources that are current, accessible, and appropriate for newcomers."
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
      "A placeholder page for official sources and update notes.",
    sections: [
      {
        title: "Official sources",
        body: "Add links to verified government, public health, and healthcare organization sources before publishing detailed guidance."
      },
      {
        title: "Review process",
        body: "Content should include dates reviewed, source owners, and a process for updating pages when official guidance changes."
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
      "A placeholder privacy page for explaining what information the site collects and how it is handled.",
    sections: [
      {
        title: "Placeholder notice",
        body: "This page should be replaced with a complete privacy notice before the site collects any personal information."
      },
      {
        title: "Sensitive information",
        body: "Visitors should avoid entering personal health information unless a future tool clearly explains why it is needed and how it is protected."
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
      "A clear statement that this website is informational and not a substitute for official, medical, or legal advice.",
    sections: [
      {
        title: "Information only",
        body: "This website provides general navigation information. It does not provide medical advice, diagnosis, treatment, legal advice, or eligibility decisions."
      },
      {
        title: "Confirm before acting",
        body: "Programs, documents, fees, coverage, and services can change. Confirm details with official sources or qualified professionals."
      }
    ]
  }
};
