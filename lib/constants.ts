export const SITE = {
  name: "Consulat",
  legalName: "Consulat Ltd.",
  domain: "consulatng.net",
  url: "https://consulatng.net",
  description:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and CERPAC services.",
  email: "info@consulatng.net",
  phone: "+234 802 644 2090",
  altphone: "02013438504",
  phoneHref: "tel:+2348026442090",
  whatsapp: "+234 802 644 2090",
  whatsappHref:
    "https://wa.me/2348026442090?text=Hello%20Consulat%2C%20I%20would%20like%20to%20enquire%20about%20your%20immigration%20services.",
  address: {
    streetAddress: "H1 Garwood Court, Sule Olusesi Road, Off National Conservation Road, Chevron",
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
      "Obtain the legal authorisation your company needs to operate in Nigeria. We manage the full application process with the Federal Ministry of Interior from documentation through to approval.",
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
      "Secure and manage the quota positions your organisation needs to employ foreign nationals in Nigeria — including establishment, additional slots, renewals, monthly returns, and NIS portal management.",
    covers: [
      "Establishment Quota",
      "Additional Quota",
      "Renewal",
      "Monthly Returns",
      "Deletions",
      "Immigration Visits",
      "Portal Management",
    ],
  },
  {
    slug: "e-cerpac",
    title: "e-CERPAC (Residence Permits)",
    shortTitle: "e-CERPAC",
    summary:
      "Obtain and manage Combined Expatriate Residence Permits and Aliens Cards for your workforce, including new applications, renewals, regularisation, and migration processes.",
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
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
