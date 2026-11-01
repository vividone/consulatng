/**
 * Structural identity only.
 *
 * Everything an editor should be able to change — tagline, description,
 * contact details, hours, address, social links, the booking URL — lives in
 * the Site Settings global in the back office and is read through
 * lib/content.ts. What stays here is what is wired into routing and
 * canonical URLs, where an editor typo would break the site rather than
 * change its wording.
 */
export const SITE = {
  name: "Consulat",
  legalName: "Consulat Ltd.",
  // Brand identity, not editorial copy: it is set in the logo lockup, the
  // social card and the page eyebrow. A CMS field that changed one of those
  // three and not the others would be worse than no field at all.
  tagline: "Immigration Simplified",
  domain: "consulatng.net",
  url: "https://consulatng.net",
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

/*
 * SERVICES used to live here as a hardcoded array, with the five service
 * pages written out by hand beside it. Both now come from the Services
 * collection in the CMS — read through getServiceSummaries() in
 * lib/content.ts — so the business can add or reword a service without a
 * developer. What remains in this file is structural identity only: values
 * wired into routing and the logo lockup, where an editor's typo would break
 * the site rather than reword it.
 */
