export const SITE = {
  name: "Consulat",
  legalName: "Consulat Ltd.",
  tagline: "Immigration Simplified",
  domain: "consulatng.net",
  url: "https://consulatng.net",
  description:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and e-CERPAC services.",
  email: "info@consulatng.net",
  phone: "+2348141657981",
  phoneHref: "tel:+2348141657981",
  phone2: "+2348026442090",
  phone2Href: "tel:+2348026442090",
  altphone: "02013438504",
  whatsapp: "+234 814657981",
  whatsappHref:
    "https://wa.me/2348141657981?text=Hello%20Consulat%2C%20I%20would%20like%20to%20enquire%20about%20your%20immigration%20services.",
  address: {
    streetAddress: "H1 Garwood Court, Sule Olusesi Road, Off Lekki Conservation Center Road, Chevron",
    addressLocality: "Lekki",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  hours: "Monday – Friday: 8:00 AM – 5:00 PM (WAT)",
  social: {
    linkedin: "https://www.linkedin.com/company/consulat",
    twitter: "https://twitter.com/consulatng",
    instagram: "https://instagram.com/consulatng",
  },
} as const;

/**
 * External Google Calendar booking page — opens in a new tab from every
 * "Book a Free Consultation" CTA sitewide.
 */
export const CALENDAR_URL = "https://calendar.app.google/SpQcgjw5VWJTxdqo9";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/business-permit",  label: "Business Permit" },
      { href: "/services/expatriate-quota", label: "Expatriate Quota" },
      { href: "/services/e-cerpac",         label: "e-CERPAC" },
      { href: "/services/e-visas",          label: "e-Visas" },
      { href: "/services/training",         label: "Training" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  {
    slug: "business-permit",
    title: "Business Permit",
    shortTitle: "Business Permit",
    summary:
      "Obtain the legal authorisation your company needs to operate in Nigeria as a foreign-owned or foreign-affiliated business.",
    covers: [
      "Eligibility Assessment",
      "Documentation Preparation",
      "Ministry Submission",
      "Follow-Up & Liaison",
      "Permit Collection",
    ],
  },
  {
    slug: "expatriate-quota",
    title: "Expatriate Quota",
    shortTitle: "Expatriate Quota",
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
  },
  {
    slug: "e-cerpac",
    title: "e-CERPAC (Residence Permits)",
    shortTitle: "e-CERPAC",
    summary:
      "Obtain and manage Combined Expatriate Residence Permits and Aliens Cards for your workforce, including new applications, renewals, regularisation, and migration. Your workforce will have the full benefits and privileges of being Nigerian residents.",
    covers: [
      "Migration / Transitioning",
      "Regularisation",
      "In-Country Renewal",
      "Out-Country Renewal",
      "Landing Page (Entry & Exit)",
    ],
  },
  {
    slug: "e-visas",
    title: "e-Visas",
    shortTitle: "e-Visas",
    summary:
      "Facilitate entry into Nigeria with the right visa category — business visas, temporary work permits, tourist visas, and visa-on-arrival processing for both business and TWP purposes.",
    covers: [
      "Business Visa",
      "Temporary Work Permit (TWP)",
      "Tourist Visa",
      "Visa on Arrival (Business)",
      "Visa on Arrival (TWP)",
    ],
  },
  {
    slug: "training",
    title: "Training",
    shortTitle: "Training",
    summary:
      "Building skills you can actually use. Practical, tailored training sessions designed around your team's real challenges — no fluff, no one-size-fits-all lectures, just skills your people can apply the next day.",
    covers: [
      "Leadership Development",
      "Communication Skills",
      "Project Management",
      "Digital Skills",
      "Bespoke Programmes",
    ],
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
