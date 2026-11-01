import type { IconName } from "../icon-options";

/**
 * Migration record of the home page.
 *
 * Transcribed verbatim from the components it replaces:
 *   Hero.tsx, WelcomeSection.tsx, ServicesOverview.tsx, TrustBar.tsx,
 *   WhyConsulat.tsx, HowItWorks.tsx
 * and from the page metadata in app/(site)/page.tsx.
 *
 * The CTA banner is not here: it shows the same copy on the home page and
 * the services index, so it lives in Site Settings.
 */
export const HOME_PAGE = {
  heroTitle:
    "Your trusted partner for immigration & work permits in Nigeria",
  heroSubtitle:
    "Helping multinationals, investors, and professionals navigate Nigeria's immigration ecosystem — from business permits to visa procurement.",
  heroPrimaryCta: "Explore Our Services",
  heroSecondaryCta: "Book a Free Consultation",
  stats: [
    { value: 500, suffix: "+", label: "Permits issued" },
    { value: 1200, suffix: "+", label: "Visas processed" },
    { value: 30, suffix: "+", label: "Countries served" },
  ],

  welcomeHeading: "Welcome to Consulat",
  welcomeBody:
    "If you require a Work or Business Visa to Nigeria or you wish to embark on a project and require assistance on how to structure your stay in Nigeria for you, your Partner, family and friends who may wish to visit — we can help.",
  welcomeCtaLabel: "Talk to our team",
  welcomeImage: "brand/welcome.png",

  servicesEyebrow: "What We Do",
  servicesTitle: "Immigration & Business Support",
  servicesIntro:
    "From establishing a business presence to relocating employees and managing ongoing compliance — we handle every stage so your team can focus on what matters.",

  trustBarHeading: "Trusted by Leading Organisations Across the Globe",

  whyEyebrow: "Why Consulat",
  whyTitle: "Why organisations choose Consulat",
  pillars: [
    {
      icon: "globe" as IconName,
      title: "Local Expertise, Global Standards",
      body: "Deep knowledge of Nigeria Immigration Service (NIS) processes, combined with a service delivery standard that meets international corporate expectations.",
    },
    {
      icon: "clipboard-check" as IconName,
      title: "End-to-End Management",
      body: "We handle everything — from initial application through to approval, compliance monitoring, and renewals — so your team can focus on business, not paperwork.",
    },
    {
      icon: "bell" as IconName,
      title: "Proactive Compliance",
      body: "Our monitoring systems track permit expiry dates, monthly filing obligations, and regulatory changes, keeping your organisation ahead of compliance deadlines.",
    },
    {
      icon: "user-check" as IconName,
      title: "Dedicated Account Management",
      body: "Every client is assigned a dedicated account manager who serves as your single point of contact for all immigration matters in Nigeria.",
    },
  ],

  processEyebrow: "Our Process",
  processTitle: "How we work",
  steps: [
    {
      title: "Consultation",
      body: "We begin with a detailed assessment of your business and immigration needs, mapping the right permits, visas, and compliance requirements.",
    },
    {
      title: "Documentation",
      body: "Our team prepares and reviews all required documentation, ensuring every application is accurate and complete before submission.",
    },
    {
      title: "Submission & Follow-Up",
      body: "We submit applications directly to the relevant authorities and actively follow up to ensure timely processing.",
    },
    {
      title: "Approval & Ongoing Support",
      body: "Once approved, we help with onboarding, compliance setup, and ongoing monitoring — including expiry tracking and monthly returns.",
    },
  ],

  seoTitle: "Consulat — Immigration & Work Permit Services in Nigeria",
  seoDescription:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and e-CERPAC services.",
  keywords: [
    "immigration consulting Nigeria",
    "work permit Nigeria",
    "expatriate quota",
    "e-CERPAC Nigeria",
    "business permit Nigeria",
  ],
};

/**
 * Default CTA banner copy, previously the default parameters of
 * components/home/CTABanner.tsx.
 */
export const CTA_BANNER = {
  ctaHeading: "Ready to simplify your immigration process in Nigeria?",
  ctaBody:
    "Speak with our team to discuss your requirements. \n We respond within 24 hours.",
  ctaButtonLabel: "Book a Free Consultation",
};

/** Menu icons previously hardcoded by slug in components/layout/Navbar.tsx. */
export const SERVICE_MENU_ICONS: Record<string, IconName> = {
  "business-permit": "file-text",
  "expatriate-quota": "users",
  "e-cerpac": "id-card",
  "e-visas": "plane",
  training: "graduation-cap",
};
