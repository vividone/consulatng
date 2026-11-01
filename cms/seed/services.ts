/**
 * Migration record of the five service pages.
 *
 * Transcribed verbatim from the page files they replace:
 *   app/(site)/services/{business-permit,expatriate-quota,e-cerpac,
 *                        e-visas,training}/page.tsx
 *
 * Prose is markdown; the seed converts it to Lexical. Paragraphs that were
 * separate <p> elements are separate markdown paragraphs, so the rendered
 * spacing is unchanged.
 *
 * `image` / `banner` / `cover` name files in public/services/, which the
 * seed uploads into the media library.
 */

/** Mirrors the icon options in cms/collections/Services.ts. */
export type ServiceIcon =
  | "ear"
  | "sparkles"
  | "handshake"
  | "shield"
  | "clock"
  | "users";

export type SeedService = {
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  summary: string;
  covers: string[];
  cardImage?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  bannerImage?: string;
  bannerAlt?: string;
  intro: string;
  introImage?: string;
  introImageAlt?: string;
  coverHeading?: string;
  coverItems?: {
    title: string;
    description: string;
    bullets?: string[];
  }[];
  coverImage?: string;
  coverImageAlt?: string;
  highlightsHeading?: string;
  highlights?: { icon: ServiceIcon; title: string; body: string }[];
  sections?: {
    heading: string;
    align: "left" | "center";
    intro?: string;
    checklist?: string[];
    outro?: string;
  }[];
  ctaHeading: string;
  ctaBody: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  schemaServiceType: string;
  schemaDescription: string;
};

export const SERVICES: SeedService[] = [
  {
    slug: "business-permit",
    title: "Business Permit",
    shortTitle: "Business Permit",
    order: 0,
    summary:
      "Obtain the legal authorisation your company needs to operate in Nigeria as a foreign-owned or foreign-affiliated business.",
    covers: [
      "Eligibility Assessment",
      "Documentation Preparation",
      "Ministry Submission",
      "Follow-Up & Liaison",
      "Permit Collection",
    ],
    cardImage: "business-permit.jpg",
    heroEyebrow: "Immigration Simplified",
    heroTitle: "Business Permit Services",
    heroSubtitle:
      "You can own a Nigerian Business 100% and create a pathway towards Nigerian (Temporary or Permanent) Residency for your staff.",
    bannerImage: "business-permit.jpg",
    bannerAlt: "Business Permit Services",
    intro:
      "Every foreign-owned or foreign-affiliated business operating in Nigeria is required to obtain a Business Permit from the Federal Ministry of Interior. This permit is the foundational legal document that authorises a foreign company to conduct business in the country and is a prerequisite for obtaining expatriate quota positions, opening corporate bank accounts, and engaging in regulated commercial activities.\n\nThe application process requires detailed documentation, precise compliance with regulatory requirements, and active follow-up with the Ministry. Consulat manages the entire process on your behalf — from initial assessment through to permit approval and collection.",
    coverHeading: "What We Handle",
    coverItems: [
      {
        title: "Eligibility Assessment",
        description:
          "We assess your company structure, ownership, and business activities to confirm Business Permit requirements and identify the correct application category.",
      },
      {
        title: "Documentation Preparation",
        description:
          "Our team compiles and reviews all required documents — including incorporation papers, board resolutions, memorandum and articles of association, and supporting evidence — ensuring every application is complete and accurate before submission.",
      },
      {
        title: "Application Submission",
        description:
          "We submit the Business Permit application directly to the Federal Ministry of Interior, managing all filing requirements and ensuring compliance with current regulations.",
      },
      {
        title: "Follow-Up & Liaison",
        description:
          "Consulat actively follows up with the Ministry throughout the review process, responding to queries, providing additional information where requested, and keeping you informed at every stage.",
      },
      {
        title: "Permit Collection & Delivery",
        description:
          "Once approved, we collect the Business Permit on your behalf and deliver it to your office or designated representative.",
      },
    ],
    coverImage: "business-permit-cover.jpg",
    coverImageAlt: "Business Permit application in Nigeria",
    sections: [
      {
        heading: "Who Needs a Business Permit?",
        align: "left",
        intro:
          "A Business Permit is required if your company has any of the following:",
        checklist: [
          "Foreign ownership (partial or full)",
          "Foreign directorship",
          "Foreign shareholding",
          "A parent company registered outside Nigeria",
        ],
        outro:
          "If you are unsure whether your organisation requires a Business Permit, our team can conduct a quick assessment and advise accordingly.",
      },
    ],
    ctaHeading:
      "Need to apply for, renew or authenticate a Business Permit?",
    ctaBody:
      "Our team handles the full process so you can focus on running your business.",
    seoTitle: "Business Permit Services in Nigeria — Consulat",
    seoDescription:
      "Business permit applications for foreign-owned companies in Nigeria. Full documentation, Ministry submission, and follow-up services.",
    keywords: [
      "business permit Nigeria",
      "foreign company permit Nigeria",
      "Federal Ministry of Interior",
    ],
    schemaServiceType: "Business Permit",
    schemaDescription:
      "End-to-end Business Permit applications for foreign-owned and foreign-affiliated companies operating in Nigeria — eligibility, documentation, Ministry submission, follow-up, and collection.",
  },

  {
    slug: "expatriate-quota",
    title: "Expatriate Quota",
    shortTitle: "Expatriate Quota",
    order: 1,
    summary:
      "Secure and manage approvals for your organisation to employ foreign nationals in Nigeria. Your selected persons will be employed in Nigeria and will be able to apply for Work and Residence Permits.",
    covers: [
      "Establishment Quota",
      "Additional Quota",
      "Renewal",
      "Monthly Returns",
      "Deletion Returns",
      "Immigration Visits",
      "Portal Management",
    ],
    cardImage: "expatriate-quota.jpg",
    heroEyebrow: "Immigration Simplified",
    heroTitle: "Expatriate Quota Services",
    heroSubtitle:
      "Secure and manage approvals for your organisation to employ foreign nationals in Nigeria. Your selected persons will be employed in Nigeria and will be able to apply for Work and Residence Permits.",
    bannerImage: "expatriate-quota.jpg",
    bannerAlt: "Expatriate Quota Services",
    intro:
      "An Expatriate Quota is a government-approved allocation that permits a company to employ a specified number of foreign nationals in designated roles within Nigeria. Issued by the Federal Ministry of Interior, each quota position is tied to a specific job title and must be maintained, renewed, and reported on in accordance with Nigeria Immigration Service regulations.\n\nConsulat provides end-to-end expatriate quota management — covering every stage from first-time applications to renewals, additions, deletions, monthly compliance filings, and NIS portal administration.",
    coverHeading: "What We Cover",
    coverItems: [
      {
        title: "Establishment Quota",
        description:
          "The initial quota allocation for newly registered or recently permitted businesses. We guide you through the application process, ensuring the right roles and justifications are presented to secure the positions your company needs from the outset.",
      },
      {
        title: "Additional Quota",
        description:
          "When your business grows and requires more expatriate positions than originally allocated, we handle the application for additional slots, including supporting documentation, justification letters, and Ministry liaison.",
      },
      {
        title: "Renewal",
        description:
          "Expatriate Quota positions must be renewed periodically. We track expiry dates, prepare renewal applications, compile the necessary documentation, and file them well in advance to prevent any disruption to your workforce or compliance status.",
      },
      {
        title: "Monthly Returns",
        description:
          "Every company holding an Expatriate Quota is required to file Monthly Returns with the Nigeria Immigration Service. These returns report the status, details, movement and location of all expatriate employees, their qualifications, demographics, and Nigerian understudies. Consulat prepares and submits these filings on your behalf every month, ensuring timely compliance and accurate reporting.",
      },
      {
        title: "Deletion Returns",
        description:
          "In the event of an expatriate being disengaged or demobilised upon completion of their task or project, the company owes a reporting obligation to the Comptroller General, Nigeria Immigration Service. The NIS will only absolve the company of immigration responsibility and delete the departed expatriate from the company's Expatriate Quota Card after proof of exit — by physical surrender of the e-CERPAC card and/or the airline boarding pass of the departed expatriate.",
      },
      {
        title: "Immigration Visits & Queries",
        description:
          "From time to time, the Nigeria Immigration Service may conduct compliance visits or raise queries regarding your quota utilisation. Consulat provides advisory support, prepares responses, and represents your interests during such engagements — ensuring your company is always audit-ready.",
      },
      {
        title: "Portal Management & Monitoring",
        description:
          "We manage your company's NIS online portal on an ongoing basis — monitoring application statuses, responding to system requests, tracking deadlines, and ensuring nothing falls through the cracks. This is particularly valuable for companies with multiple expatriates or frequent permit activity.",
      },
    ],
    coverImage: "expatriate-quota-cover.jpg",
    coverImageAlt: "Expatriate Quota management in Nigeria",
    ctaHeading: "Need help securing or managing your Expatriate Quota?",
    ctaBody:
      "Our team can assess your requirements and guide you through the process from start to finish.",
    seoTitle: "Expatriate Quota Management Services — Consulat",
    seoDescription:
      "Expatriate quota applications, renewals, monthly returns, deletions, and NIS portal management services in Nigeria.",
    keywords: [
      "expatriate quota Nigeria",
      "monthly returns NIS",
      "quota renewal Nigeria",
      "Federal Ministry of Interior",
    ],
    schemaServiceType: "Expatriate Quota Management",
    schemaDescription:
      "End-to-end expatriate quota management — establishment, additional quota, renewals, monthly returns, deletions, NIS visits, and portal management.",
  },

  {
    slug: "e-cerpac",
    title: "e-CERPAC (Residence Permits)",
    shortTitle: "e-CERPAC",
    order: 2,
    summary:
      "Obtain and manage Combined Expatriate Residence Permits and Aliens Cards for your workforce, including new applications, renewals, regularisation, and migration. Your workforce will have the full benefits and privileges of being Nigerian residents.",
    covers: [
      "Migration / Transitioning",
      "Regularisation",
      "In-Country Renewal",
      "Out-Country Renewal",
      "Landing Page (Entry & Exit)",
    ],
    cardImage: "e-cerpac.jpg",
    heroEyebrow: "Immigration Simplified",
    heroTitle: "e-CERPAC Services",
    heroSubtitle:
      "Obtain and manage Combined Expatriate Residence Permits and Aliens Cards for your workforce — including new applications, renewals, regularisation, and migration. Your workforce will have the full benefits and privileges of being Nigerian residents.",
    bannerImage: "e-cerpac.jpg",
    bannerAlt: "e-CERPAC Services",
    intro:
      "The Combined Expatriate Residence Permit and Aliens Card (CERPAC) is a mandatory biometric residence document for all foreign nationals living and working in Nigeria. Issued by the Nigeria Immigration Service, it serves as proof of lawful residence and must be obtained within the prescribed timeline of arrival, and presented on demand by an immigration officer.\n\nThe Nigeria Immigration Service has introduced a QR-coded, machine-readable e-CERPAC designed to reduce airport processing time for non-Nigerian residents entering or leaving Nigeria.\n\nConsulat handles the complete e-CERPAC lifecycle — whether your employee is arriving in Nigeria for the first time, transitioning between permit categories, or renewing an existing card.",
    coverHeading: "What We Cover",
    coverItems: [
      {
        title: "Migration / Transitioning",
        description:
          "When an expatriate's immigration status changes — for example, moving from a Temporary Work Permit to a full Subject to Regularisation (STR) visa, or transferring between employers — the e-CERPAC must be updated accordingly. We manage the full migration and transitioning process with the NIS.",
      },
      {
        title: "Regularisation Process",
        description:
          "Expatriates who enter Nigeria on certain visa types are required to regularise their stay by obtaining an e-CERPAC within a specified period. Consulat ensures the regularisation is completed on time, preventing penalties, overstay issues, or disruptions to the employee's right to work.",
      },
      {
        title: "Renewal Process — In-Country",
        description:
          "For expatriates currently residing in Nigeria whose e-CERPAC is approaching expiry. We initiate the renewal well in advance, manage the biometric capture process, and track the card through to issuance.",
      },
      {
        title: "Renewal Process — Out-Country",
        description:
          "For expatriates who are outside Nigeria at the time of renewal. We coordinate the process remotely and ensure the renewed e-CERPAC is ready upon their return.",
      },
      {
        title: "Landing Page (Entry and Exit)",
        description:
          "All expatriates arriving in or departing from Nigeria are required to complete the NIS Landing Page process — an electronic declaration of entry or exit. Consulat assists with the completion and submission of landing page forms for every arrival and departure, ensuring full compliance with NIS requirements.",
      },
    ],
    coverImage: "e-cerpac-cover.jpg",
    coverImageAlt: "e-CERPAC residence permit services",
    sections: [
      {
        heading: "Benefits of Nigerian Residency",
        align: "left",
        intro:
          "With a valid e-CERPAC in hand, your expatriate workforce enjoys the full benefits and privileges of being Nigerian residents:",
        checklist: [
          "Multiple-entry visa to enter and leave Nigeria at will (valid for the period of residency)",
          "Apply for a National Identity Number (NIN) as a resident",
          "Open bank accounts in any currency at any financial institution",
          "Legally own property in Nigeria",
          "Pay Nigerian taxes, which are deductible from taxes in your home country",
          "Free movement anywhere in Nigeria, including offshore locations for business",
        ],
      },
    ],
    ctaHeading: "Need to apply for, renew, or regularise an e-CERPAC?",
    ctaBody:
      "We manage every step of the process so your employees remain compliant and focused on their work.",
    seoTitle: "e-CERPAC Residence Permit Services — Consulat",
    seoDescription:
      "e-CERPAC applications, renewals, regularisation, and migration services for expatriates in Nigeria.",
    keywords: [
      "e-CERPAC Nigeria",
      "residence permit Nigeria",
      "e-CERPAC renewal",
      "regularisation Nigeria",
    ],
    schemaServiceType: "e-CERPAC Residence Permit",
    schemaDescription:
      "Combined Expatriate Residence Permit and Aliens Card (CERPAC) services — migration/transitioning, regularisation, in-country and out-country renewal, and landing page filings.",
  },

  {
    slug: "e-visas",
    title: "e-Visas",
    shortTitle: "e-Visas",
    order: 3,
    summary:
      "Facilitate entry into Nigeria with the right visa category — business visas, temporary work permits, tourist visas, and visa-on-arrival processing for both business and TWP purposes.",
    covers: [
      "Business Visa",
      "Temporary Work Permit (TWP)",
      "Tourist Visa",
      "Visa on Arrival (Business)",
      "Visa on Arrival (TWP)",
    ],
    cardImage: "e-visas.jpg",
    heroEyebrow: "Immigration Simplified",
    heroTitle: "e-Visa Services",
    heroSubtitle:
      "Facilitate smooth entry into Nigeria with the right visa category — whether for business, employment, tourism, or short-term assignments.",
    bannerImage: "e-visas.jpg",
    bannerAlt: "e-Visa Services",
    intro:
      "Nigeria's electronic visa system enables foreign nationals to apply for entry visas through the Nigeria Immigration Service online portal. Selecting the correct visa category, preparing the right supporting documents, and navigating the approval process can be complex — particularly for organisations managing multiple expatriate entries.\n\nConsulat handles visa applications across all relevant categories, ensuring accurate submissions, faster processing, and a smooth arrival experience for your personnel.",
    coverHeading: "What We Cover",
    coverItems: [
      {
        title: "Business Visa",
        description:
          "For foreign nationals visiting Nigeria for business meetings, conferences, contract negotiations, site inspections, or other commercial activities that do not constitute employment.",
        bullets: [
          "Eligibility assessment and visa category confirmation",
          "Preparation of invitation letters, company documents, and supporting materials",
          "Online application submission and fee processing",
          "Follow-up through to visa approval",
        ],
      },
      {
        title: "Temporary Work Permit (TWP)",
        description:
          "For foreign nationals who need to carry out short-term work assignments in Nigeria — typically for projects, installations, technical support, audits, or training — without requiring a full expatriate quota position.",
        bullets: [
          "TWP eligibility assessment",
          "Documentation preparation, including company and project details",
          "Application submission and NIS liaison",
          "Permit tracking through to issuance",
        ],
      },
      {
        title: "Tourist Visa",
        description:
          "For foreign nationals visiting Nigeria for leisure, family visits, or other non-business purposes.",
        bullets: [
          "Application preparation and document compilation",
          "Online submission and processing",
          "Advisory on entry requirements and travel documentation",
        ],
      },
      {
        title: "Visa on Arrival — Business",
        description:
          "For business travellers who require expedited visa processing upon arrival at a Nigerian port of entry. The Visa on Arrival (Business) allows pre-approved travellers to receive their visa stamp at the airport.",
        bullets: [
          "Pre-approval application submitted to NIS before travel",
          "Preparation of all supporting documentation",
          "Coordination with NIS to ensure approval is in place before arrival",
          "Airport liaison where required",
        ],
      },
      {
        title: "Visa on Arrival — TWP",
        description:
          "For foreign nationals arriving in Nigeria on short-term work assignments who require a Temporary Work Permit issued on arrival.",
        bullets: [
          "Pre-approval application and documentation",
          "Coordination with NIS and the employing company",
          "Arrival facilitation and permit issuance support",
        ],
      },
    ],
    coverImage: "e-visas-cover.jpg",
    coverImageAlt: "e-Visa applications for Nigeria",
    ctaHeading: "Need a visa for Nigeria?",
    ctaBody:
      "Whether it is a single entry or a large deployment, our team ensures the right visa is secured — on time and without complications.",
    seoTitle: "e-Visa Services for Nigeria — Consulat",
    seoDescription:
      "Business visas, temporary work permits, tourist visas, and visa-on-arrival services for entry into Nigeria.",
    keywords: [
      "Nigeria visa",
      "business visa Nigeria",
      "visa on arrival Nigeria",
      "TWP Nigeria",
      "temporary work permit Nigeria",
    ],
    schemaServiceType: "e-Visa Services for Nigeria",
    schemaDescription:
      "Nigeria e-visa facilitation — business visas, temporary work permits, tourist visas, and visa-on-arrival processing.",
  },

  {
    slug: "training",
    title: "Training",
    shortTitle: "Training",
    order: 4,
    summary:
      "Practical training programmes built around your team's real challenges — leadership, communication, project management, and digital skills.",
    covers: [
      "Leadership",
      "Communication",
      "Project Management",
      "Digital Skills",
    ],
    cardImage: "training.jpg",
    heroEyebrow: "Immigration Simplified",
    heroTitle: "Training",
    heroSubtitle: "Building skills you can actually use.",
    bannerImage: "training.jpg",
    bannerAlt: "Training Services",
    intro:
      "At our core, we believe people grow when they're given the right tools and the confidence to use them. That's why training isn't an add-on for us — it's one of the main ways we help teams and individuals move forward.\n\nWe've all sat through trainings that feel like a blur of slides and jargon. That's not how we work. Our sessions are practical, clear, and built around your real challenges. No fluff, no one-size-fits-all lectures — just skills you can use the next day.",
    introImage: "training-cover.jpg",
    introImageAlt: "Training session in progress",
    highlightsHeading: "What makes it different?",
    highlights: [
      {
        icon: "ear",
        title: "We start with you",
        body: "Before designing anything, we listen. What's slowing your team down? Where do people feel stuck? We build the training around your goals — whether it's leadership, communication, project management, or digital skills.",
      },
      {
        icon: "sparkles",
        title: "It's made to stick",
        body: "You'll learn by doing. Every session mixes short explanations with exercises and real scenarios from your work. You leave with a clear plan, not just notes you'll forget.",
      },
      {
        icon: "handshake",
        title: "It feels human",
        body: "Learning works best when people feel safe to ask questions and try new things. Our trainers keep it engaging, supportive, and free of judgment.",
      },
    ],
    sections: [
      {
        heading: "The result",
        align: "center",
        intro:
          "Teams that communicate better, solve problems faster, and feel more confident in their roles.",
      },
    ],
    ctaHeading: "Ready to grow?",
    ctaBody: "Let's talk about how training can help your team get there.",
    seoTitle: "Training Services — Consulat",
    seoDescription:
      "Practical training programmes built around your team's real challenges — leadership, communication, project management, and digital skills.",
    keywords: [
      "corporate training Nigeria",
      "leadership training Lagos",
      "team development Nigeria",
    ],
    schemaServiceType: "Corporate Training",
    schemaDescription:
      "Practical, tailored training programmes covering leadership, communication, project management, digital skills, and bespoke topics built around your team's real challenges.",
  },
];
