import type { IconName } from "../icon-options";

/**
 * Migration record of the About, Contact, Services index and FAQ pages.
 *
 * Transcribed verbatim from the page files they replace. Privacy and Terms
 * are deliberately absent: both interpolate the registered name, domain and
 * office address from Site Settings, so moving them into rich text would
 * freeze those values as literal prose and leave the policy silently stale
 * the first time the office moves. They are also awaiting counsel's rewrite.
 */

export const ABOUT_PAGE = {
  heroEyebrow: "Immigration Simplified",
  heroTitle: "About Consulat",
  heroSubtitle:
    "Nigeria's Specialist Immigration Consulting Firm — Trusted by Multinationals, NGOs, and Growing Businesses Worldwide.",
  bridgeHeading: "Bridging the world to Nigeria",
  bridgeText:
    "From every continent to Nigeria — we connect global businesses and professionals to opportunity in Nigeria.",

  storyEyebrow: "Our Story",
  storyTitle: "A reliable partner for immigration in Nigeria",
  storyBody:
    "Consulat was founded with a clear mission: to make Nigeria's immigration process seamless, transparent, and stress-free for international businesses and professionals.\n\nOver the years, we have built a reputation for reliability, attention to detail, and deep institutional knowledge of the Nigerian immigration system. We work closely with the Nigeria Immigration Service and understand the regulatory landscape at every level — from federal directives to state-level implementation.\n\nOur clients include blue chip companies, international NGOs, fast-growing startups, and individual professionals across Europe, Asia, the Americas, and Africa. Regardless of size, every client receives the same standard of care: proactive communication, meticulous documentation, and full compliance assurance.",

  missionEyebrow: "Our Mission",
  missionStatement:
    "To deliver world-class immigration consulting services that enable organisations and professionals to establish, operate, and grow in Nigeria with confidence.",

  valuesEyebrow: "Our Values",
  valuesTitle: "The principles that guide every engagement",
  values: [
    {
      icon: "shield" as IconName,
      title: "Integrity",
      body: "We operate with transparency and honesty in every engagement. Our clients know exactly where their application stands at all times.",
    },
    {
      icon: "sparkles" as IconName,
      title: "Excellence",
      body: "We hold ourselves to the highest standard of service delivery. Every document, every filing, every interaction reflects our commitment to quality.",
    },
    {
      icon: "clock" as IconName,
      title: "Reliability",
      body: "Immigration timelines matter. We deliver on our commitments and keep our clients ahead of deadlines, not behind them.",
    },
    {
      icon: "handshake" as IconName,
      title: "Partnership",
      body: "We are not a transactional vendor. We invest in understanding our clients' businesses and become a long-term extension of their operations team.",
    },
  ],

  teamEyebrow: "Our Team",
  teamTitle: "The people behind Consulat",
  teamIntro: "Meet the people delivering Consulat’s standards of service.",

  ctaHeading: "Let's discuss how we can support your team in Nigeria",

  seoTitle: "About Consulat — Nigeria's Immigration Consulting Experts",
  seoDescription:
    "Learn about Consulat's team, mission, and expertise in Nigerian immigration services for international businesses.",
  keywords: ["about consulat", "immigration consultants Nigeria"],
};

export const CONTACT_PAGE = {
  heroEyebrow: "Immigration Simplified",
  heroTitle: "Get in Touch",
  heroSubtitle:
    "Whether you have a specific immigration need or want to discuss ongoing support for an ongoing or future project, our team is ready to help.",

  infoHeading: "Contact Information",
  infoIntro:
    "Reach out by phone, WhatsApp, or email — we respond within 24 hours.",

  bookingEyebrow: "Book a free consultation",
  bookingHeading: "Prefer to speak directly with a consultant?",
  bookingBody: "Schedule a 30-minute call at a time that works for you.",
  bookingButtonLabel: "Book a Call →",

  formHeading: "Send us an enquiry",
  formIntro:
    "Fill in the form below and our team will reply within one business day.",

  mapHeading: "Find Our Office",
  mapIntro: "Located in the heart of Lagos.",

  seoTitle: "Contact Consulat — Book an Immigration Consultation",
  seoDescription:
    "Get in touch with Consulat for immigration consulting, visa services, and expatriate management in Lagos, Nigeria.",
  keywords: [
    "contact consulat",
    "immigration consultant Lagos",
    "book consultation Nigeria",
  ],
};

export const SERVICES_PAGE = {
  heroEyebrow: "Immigration Simplified",
  heroTitle: "Our Services",
  heroSubtitle:
    "Comprehensive immigration and consular services for businesses and professionals operating in Nigeria.",
  intro:
    "Consulat provides end-to-end immigration support across every stage of the expatriate lifecycle — from initial business registration and quota allocation through to visa facilitation, residency permits, and ongoing compliance management.",
  seoTitle: "Immigration Services — Consulat",
  seoDescription:
    "Comprehensive immigration services including business permits, expatriate quotas, e-CERPAC, and e-visas for Nigeria.",
  keywords: ["Nigeria immigration services", "visa services Nigeria"],
};

export const FAQ_PAGE = {
  heroEyebrow: "Immigration Simplified",
  heroTitle: "Frequently Asked Questions",
  heroSubtitle:
    "Answers to the most common questions about immigration, work permits, and residency in Nigeria.",
  ctaHeading: "Still have a question?",
  ctaBody: "Reach out and our team will get back to you within 24 hours.",
  seoTitle: "FAQs — Immigration & Work Permits in Nigeria — Consulat",
  seoDescription:
    "Answers to common questions about business permits, expatriate quotas, e-CERPAC, visas, and immigration compliance in Nigeria.",
  keywords: [
    "Nigeria immigration FAQ",
    "work permit questions",
    "e-CERPAC FAQ",
  ],
};
