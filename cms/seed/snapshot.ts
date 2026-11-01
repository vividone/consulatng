/**
 * The content that used to live hardcoded in components, captured once so the
 * seed can load it into the CMS.
 *
 * This is a migration record, not a source of truth. Once the components read
 * from Payload, the arrays they used to hold are deleted and this file is the
 * only remaining copy of the starting state. Editors change content in the
 * admin from then on — the seed never overwrites what it finds.
 *
 * Captured from:
 *   components/home/Testimonials.tsx   TESTIMONIALS
 *   components/home/TrustBar.tsx       CLIENTS
 *   app/(site)/about/page.tsx          TEAM
 */

export const TESTIMONIALS = [
  {
    quote:
      "Consulat handled our entire team's e-CERPAC and quota renewals seamlessly. Their proactive monitoring meant we never had a single expiry surprise.",
    personName: "Ajit",
    role: "Petroleum Engineer",
    country: "India",
    flag: "🇮🇳",
  },
  {
    quote:
      "When we expanded operations into Lagos, Consulat became our go-to immigration partner. The team is responsive, meticulous, and deeply knowledgeable.",
    personName: "Yoann",
    role: "Operations Director Africa",
    country: "France",
    flag: "🇫🇷",
  },
  {
    quote:
      "From visa-on-arrival to long-term residence permits, Consulat has supported our entire expatriate workforce in Nigeria. We couldn't recommend them more.",
    personName: "Sanne",
    role: "Agrifoods Strategist",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    quote:
      "Consulat is simply the most reliable immigration partner we've worked with in West Africa. Their team combines deep local expertise with a level of professionalism that builds long-term trust.",
    personName: "David",
    role: "Legal Counsel",
    country: "Canada",
    flag: "🇨🇦",
  },
  {
    quote:
      "From our first work permit renewal to navigating the complexities of a Golden Visa, the Consulat team has been an invaluable guide. Highly recommended.",
    personName: "Elena",
    role: "COO",
    country: "Italy",
    flag: "🇮🇹",
  },
];

/** `file` is relative to public/. */
export const CLIENT_LOGOS = [
  { name: "Anotech", file: "clients/anotech.webp" },
  { name: "FairMoney", file: "clients/fairmoney.webp" },
  { name: "Mandilas", file: "clients/mandilas.jpeg" },
  { name: "Spie", file: "clients/Spie.webp" },
  { name: "IOTA", file: "clients/iota.jpeg" },
  { name: "Euro Engineering", file: "clients/4-client-euro-engineer.webp" },
  { name: "PA", file: "clients/pa.webp" },
  { name: "The White Baker", file: "clients/ThewhiteBaker.webp" },
  { name: "Design & Print", file: "clients/5-client-design-print-set.webp" },
  { name: "Lilygate", file: "clients/6-client-lilygate.webp" },
  { name: "Fortiori", file: "clients/7-client-fortiori.webp" },
  { name: "Pro Expa", file: "clients/8-client-pro-expa.webp" },
  { name: "HB", file: "clients/9-client-HB.webp" },
  { name: "Solicitors", file: "clients/10-client-solicitors.webp" },
  { name: "WellStaff", file: "clients/1-client-well-staff.webp" },
];

export const TEAM = [
  {
    name: "Michael",
    role: "Non-Executive Director",
    file: "team/michael-odibeli.jpg",
    bio: [
      "Michael is a seasoned legal and governance professional with over three decades of experience spanning corporate law, regulatory compliance, Board-level advisory, business planning, integration and strategic implementation.",
      "A Barrister-at-Law with LLB and LLM qualifications, he brings a multidisciplinary background combining legal expertise, operational oversight, and strategic governance. He is currently a Partner at CREED & Company, where he leads Corporate, Immigration and Compliance services. His involvement in hundreds of expatriate and local personnel mobilisations and crew changes for Oil & Gas, Engineering and Maritime Service companies is worthy of note: NLNG Train II, Mobil TMSA, Total Energies OFON, AKPO and EGINA projects offshore, LADOL, Bonny Island and Onne locations to name a few.",
      "Michael brings his wealth of experience to serve as Non-Executive Director at Consulat Ltd.",
    ],
  },
  {
    name: "Lynn",
    role: "Director, Business Development",
    file: "team/lynn-odibeli.jpg",
    bio: [
      "With over 20 years of experience in banking, credit management, and business development, Lynn specialises in market expansion and commercial partnerships. She has a proven track record in credit risk management, strategic negotiation, and driving revenue growth in competitive markets during a banking career as Assistant Bank Manager and Branch Head.",
      "Lynn holds a B.Sc. in Applied Biology and a Certification in Entrepreneurial Management from Lagos Business School's Enterprise arm.",
      "As Director, Business Development, she is recognised for her strategic oversight, disciplined decision-making, and board-level contributions to sustainable growth.",
    ],
  },
  {
    name: "Fezi",
    role: "Logistics & Government Relations",
    file: "team/fezi-eniekebi.jpg",
    bio: [
      "Fezi is a results-driven Logistics and Government Relations Specialist with a proven track record of streamlining supply chain operations while fostering productive relationships with government agencies and regulatory bodies.",
      "A skilled navigator of complex compliance matters, he coordinates cross-border logistics on very challenging timelines and has built relationships with strategic stakeholders to ensure smooth business operations and regulatory alignment.",
      "He graduated with honours from the Rivers State University of Technology, Port Harcourt, and anchors the entire South-East business activities.",
    ],
  },
  {
    name: "Emmanuella",
    role: "Operations Officer",
    file: "team/emmanuella-edoho.jpg",
    bio: [
      "Emmanuella is an operations and administrative professional with experience supporting organisational efficiency, executive coordination, and customer relationship management.",
      "She has worked across business operations, education administration, and executive support roles, where she has developed strong skills in process management, stakeholder communication, and workflow optimisation.",
      "Emmanuella is passionate about delivering organised, client-focused solutions that improve productivity and service delivery.",
    ],
  },
  {
    name: "Faith",
    role: "Business Officer",
    file: "team/faith-bassey.jpg",
    bio: [
      "Faith brings experience in customer relationship management and virtual assistance, with a strong focus on client communication, documentation, and administrative support.",
      "She has developed a solid background in managing client interactions, maintaining accurate records, and supporting efficient business operations.",
      "She continues to build her expertise in business support and service coordination, and is committed to delivering organised, reliable, and detail-oriented support across all assigned responsibilities.",
    ],
  },
];

/**
 * Captured from lib/faqs.ts, which has been deleted now that /faq reads from
 * the CMS. Answers are plain text because they also feed the FAQPage
 * structured data, where markup is invalid.
 */
export const FAQS = [
  {
    q: "What is a Business Permit and does my company need one?",
    a: "A Business Permit is a legal authorisation issued by the Federal Ministry of Interior that allows a foreign-owned or foreign-affiliated company to conduct business in Nigeria. If your company has foreign ownership or directorship, a Business Permit is a legal requirement.",
  },
  {
    q: "What is an Expatriate Quota?",
    a: "An Expatriate Quota is a government-approved allocation that permits a company to employ a specified number of foreign nationals in designated roles within Nigeria. Each quota position is tied to a specific job title and must be renewed periodically.",
  },
  {
    q: "What is an e-CERPAC and who needs one?",
    a: "The Combined Expatriate Residence Permit and Aliens Card (CERPAC) is a mandatory biometric residence document for all foreign nationals living and working in Nigeria. Issued by the Nigeria Immigration Service, it serves as proof of lawful residence and must be obtained within the prescribed timeline of arrival, and presented on demand by an immigration officer. The Nigeria Immigration Service has introduced a QR-coded, machine-readable e-CERPAC designed to reduce airport processing time for non-Nigerian residents entering or leaving Nigeria.",
  },
  {
    q: "How long does it take to process a work permit or visa?",
    a: "Processing times vary depending on the permit or visa type, the completeness of documentation, and NIS processing volumes. Consulat provides estimated timelines at the start of every engagement and keeps clients updated throughout the process.",
  },
  {
    q: "What are Monthly Returns and is my company required to file them?",
    a: "Monthly Returns are mandatory filings submitted to the Nigeria Immigration Service by every company that holds an Expatriate Quota. They report the status and details of all expatriate employees. Failure to file can result in penalties and complications with future applications.",
  },
  {
    q: "Can Consulat manage our entire immigration portfolio?",
    a: "Yes. Many of our clients engage us on a retainer basis to manage their full immigration portfolio — including all permits, visas, e-CERPAC renewals, monthly filings, NIS portal management, and compliance monitoring.",
  },
  {
    q: "What happens if an e-CERPAC or visa expires?",
    a: "Operating on an expired e-CERPAC or visa can result in penalties, fines, or restrictions on future applications. Consulat's monitoring systems track all expiry dates and initiate renewals well in advance to prevent any lapse in compliance.",
  },
  {
    q: "Does Consulat work with companies outside Nigeria?",
    a: "Absolutely. A significant portion of our clients are headquartered in Europe, Asia, the Americas, and other parts of Africa. We serve as their on-the-ground immigration partner in Nigeria, working closely with their HR and legal teams remotely.",
  },
  {
    q: "How do I get started?",
    a: "Simply reach out via our contact page or book a consultation call. We will assess your requirements and provide a clear recommendation on the permits, visas, and services your organisation needs.",
  },
] as const;

/**
 * Captured from the SITE constant in lib/constants.ts, which has been trimmed
 * to structural identity now that Site Settings lives in the CMS.
 *
 * `whatsappNumber` is digits only. The display form and the wa.me link are
 * both derived from it in lib/content.ts — previously they were two separate
 * constants and had drifted, with the displayed number missing a digit.
 */
export const SITE_SETTINGS = {
  description:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and e-CERPAC services.",
  email: "info@consulatng.net",
  phone: "+2348141657981",
  phoneSecondary: "+2348026442090",
  landline: "02013438504",
  whatsappNumber: "2348141657981",
  whatsappMessage:
    "Hello Consulat, I would like to enquire about your immigration services.",
  hours: "Monday – Friday: 8:00 AM – 5:00 PM (WAT)",
  calendarUrl: "https://calendar.app.google/SpQcgjw5VWJTxdqo9",
  streetAddress:
    "H1 Garwood Court, Sule Olusesi Road, Off Lekki Conservation Center Road, Chevron",
  addressLocality: "Lekki",
  addressRegion: "Lagos",
  addressCountry: "NG",
  linkedin: "https://www.linkedin.com/company/consulat",
  twitter: "https://twitter.com/consulatng",
  instagram: "https://instagram.com/consulatng",
};
