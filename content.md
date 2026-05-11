# ============================================================
# CONSULAT WEBSITE — CLAUDE CODE BUILD PROMPT
# ============================================================
# Copy this entire file into Claude Code as your initial prompt.
# It contains: Project spec, site structure, page content,
# and technical requirements.
# ============================================================


# PROJECT: Consulat Immigration Consulting — Website Rebuild

## Client
Consulat Ltd. — Immigration & Consular Services, Lagos, Nigeria
Domain: consulatng.net

## Objective
Build a modern, professional, SEO-optimised website that positions
Consulat as Nigeria's leading immigration consulting firm for
multinationals, expatriates, and international businesses.

## Brand
- **Colours:** Grey, Blue, White
- **Tone:** Professional, authoritative, globally oriented
- **Audience:** HR managers at multinationals, expatriates, foreign
  investors, international businesses expanding into Nigeria


---


# TECH STACK

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Blog CMS:** Markdown files (MDX) with gray-matter + next-mdx-remote
- **Deployment:** Vercel
- **Analytics:** Google Analytics 4 (via @next/third-parties)
- **Forms:** React Hook Form + Zod validation
- **SEO:** next/metadata API, JSON-LD schema, sitemap.xml, robots.txt
- **Fonts:** Inter (body), Plus Jakarta Sans (headings) via next/font


---


# PROJECT STRUCTURE

```
consulat-website/
├── app/
│   ├── layout.tsx                    # Root layout (nav, footer, fonts)
│   ├── page.tsx                      # Homepage
│   ├── about/
│   │   └── page.tsx                  # About Us
│   ├── services/
│   │   ├── page.tsx                  # Services overview
│   │   ├── business-permit/
│   │   │   └── page.tsx
│   │   ├── expatriate-quota/
│   │   │   └── page.tsx
│   │   ├── e-cerpac/
│   │   │   └── page.tsx
│   │   └── e-visas/
│   │       └── page.tsx
│   ├── blog/
│   │   ├── page.tsx                  # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx              # Individual blog post
│   ├── faq/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   └── robots.ts                     # Robots.txt generation
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── ServicesOverview.tsx
│   │   ├── WhyConsulat.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTABanner.tsx
│   ├── services/
│   │   ├── ServiceHero.tsx
│   │   ├── ServiceCard.tsx
│   │   └── ServiceCTA.tsx
│   ├── ui/                           # shadcn/ui components
│   └── shared/
│       ├── SectionHeading.tsx
│       ├── WhatsAppWidget.tsx
│       └── ContactForm.tsx
├── content/
│   └── blog/                         # Markdown blog posts
│       ├── expatriate-quota-guide.mdx
│       ├── understanding-e-cerpac.mdx
│       └── nigeria-visa-categories.mdx
├── lib/
│   ├── blog.ts                       # MDX parsing utilities
│   ├── metadata.ts                   # SEO metadata helpers
│   └── constants.ts                  # Site-wide constants
├── public/
│   ├── images/
│   └── og-image.png
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```


---


# DESIGN SYSTEM

## Colours (Tailwind config)
```
primary:        #1B3A5C  (deep navy blue)
primary-light:  #2E5C8A  (medium blue)
primary-dark:   #0F2440  (dark navy)
accent:         #3B82F6  (bright blue for CTAs)
grey-900:       #111827  (near black — text)
grey-700:       #374151  (body text)
grey-500:       #6B7280  (secondary text)
grey-200:       #E5E7EB  (borders)
grey-100:       #F3F4F6  (backgrounds)
grey-50:        #F9FAFB  (subtle backgrounds)
white:          #FFFFFF
```

## Typography
- Headings: Plus Jakarta Sans, 700/800 weight
- Body: Inter, 400/500 weight
- H1: 48px / 3rem desktop, 32px / 2rem mobile
- H2: 36px / 2.25rem desktop, 28px / 1.75rem mobile
- H3: 24px / 1.5rem desktop, 20px / 1.25rem mobile
- Body: 16px / 1rem, line-height 1.75

## Component Patterns
- Section padding: py-20 px-6 lg:px-0, max-w-6xl mx-auto
- Cards: rounded-xl border border-grey-200 p-8 hover:shadow-lg transition
- Buttons primary: bg-accent text-white px-8 py-3 rounded-lg font-semibold
- Buttons secondary: border-2 border-primary text-primary px-8 py-3 rounded-lg


---


# SITE CONTENT — PAGE BY PAGE


## ============================================
## PAGE: HOMEPAGE (app/page.tsx)
## ============================================

### Hero Section
- **Headline:** Your Trusted Partner for Immigration & Work Permits in Nigeria
- **Sub-headline:** We help multinational companies, investors, and professionals navigate Nigeria's immigration landscape — from business permits and expatriate quotas to visa procurement and residency compliance.
- **CTA 1:** Explore Our Services (link to /services)
- **CTA 2:** Book a Consultation (link to /contact)
- **Background:** Subtle gradient from primary-dark to primary, with abstract geometric pattern or professional stock image overlay

### Trust Bar
- **Label:** Trusted by Leading Organisations Across the Globe
- **Display:** Horizontal scrolling logo carousel (greyscale logos, colour on hover)
- **Logos:** Placeholder for client logos (Anotech, FairMoney, Spie, Euro Engineering, etc.)

### Services Overview Section
- **Heading:** What We Do
- **Intro:** Whether you are establishing a business presence, relocating employees, or managing ongoing immigration compliance in Nigeria, Consulat provides end-to-end support tailored to your needs.
- **3 Cards:**

**Card 1 — Business Permit**
Obtain the legal authorisation your company needs to operate in Nigeria. We manage the full application process with the Federal Ministry of Interior from documentation through to approval.
Link: /services/business-permit

**Card 2 — Expatriate Quota**
Secure and manage the quota positions your organisation needs to employ foreign nationals in Nigeria — including establishment, additional slots, renewals, monthly returns, and NIS portal management.
Link: /services/expatriate-quota

**Card 3 — e-CERPAC (Residence Permits)**
Obtain and manage Combined Expatriate Residence Permits and Aliens Cards for your workforce, including new applications, renewals, regularisation, and migration processes.
Link: /services/e-cerpac

**Card 4 — e-Visas**
Facilitate entry into Nigeria with the right visa category — business visas, temporary work permits, tourist visas, and visa-on-arrival processing for both business and TWP purposes.
Link: /services/e-visas

### Why Consulat Section
- **Heading:** Why Organisations Choose Consulat
- **4 pillars with icons:**

1. **Local Expertise, Global Standards** — Deep knowledge of Nigeria Immigration Service (NIS) processes, combined with a service delivery standard that meets international corporate expectations.
2. **End-to-End Management** — We handle everything — from initial application through to approval, compliance monitoring, and renewals — so your team can focus on business, not paperwork.
3. **Proactive Compliance** — Our monitoring systems track permit expiry dates, monthly filing obligations, and regulatory changes, keeping your organisation ahead of compliance deadlines.
4. **Dedicated Account Management** — Every client is assigned a dedicated account manager who serves as your single point of contact for all immigration matters in Nigeria.

### How It Works Section
- **Heading:** How We Work
- **4 steps (horizontal on desktop, vertical on mobile):**
1. **Consultation** — We begin with a detailed assessment of your business and immigration needs, mapping the right permits, visas, and compliance requirements.
2. **Documentation** — Our team prepares and reviews all required documentation, ensuring every application is accurate and complete before submission.
3. **Submission & Follow-Up** — We submit applications directly to the relevant authorities and actively follow up to ensure timely processing.
4. **Approval & Ongoing Support** — Once approved, we help with onboarding, compliance setup, and ongoing monitoring — including expiry tracking and monthly returns.

### Testimonials Section
- **Heading:** What Our Clients Say
- **Display:** 3 testimonial cards with quote, name, country flag icon
- **Placeholder testimonials (client to confirm):**
  - Ajit, India
  - Yoann, France
  - Sanne, Netherlands

### CTA Banner
- **Heading:** Ready to Simplify Your Immigration Process in Nigeria?
- **Text:** Speak with our team to discuss your requirements. We respond within 24 hours.
- **CTA 1:** Book a Consultation (link to /contact)
- **CTA 2:** Call Us: +234 XXX XXXX
- **Style:** Full-width, primary-dark background with white text


## ============================================
## PAGE: ABOUT US (app/about/page.tsx)
## ============================================

### Hero
- **Headline:** About Consulat
- **Sub-headline:** Nigeria's Specialist Immigration Consulting Firm — Trusted by Multinationals, NGOs, and Growing Businesses Worldwide.

### Our Story
Consulat was founded with a clear mission: to make Nigeria's immigration process seamless, transparent, and stress-free for international businesses and professionals.

Over the years, we have built a reputation for reliability, attention to detail, and deep institutional knowledge of the Nigerian immigration system. We work closely with the Nigeria Immigration Service and understand the regulatory landscape at every level — from federal directives to state-level implementation.

Our clients include Fortune 500 companies, international NGOs, fast-growing startups, and individual professionals across Europe, Asia, the Americas, and Africa. Regardless of size, every client receives the same standard of care: proactive communication, meticulous documentation, and full compliance assurance.

### Our Mission
To deliver world-class immigration consulting services that enable organisations and professionals to establish, operate, and grow in Nigeria with confidence.

### Our Values (4-column grid)
- **Integrity** — We operate with transparency and honesty in every engagement. Our clients know exactly where their application stands at all times.
- **Excellence** — We hold ourselves to the highest standard of service delivery. Every document, every filing, every interaction reflects our commitment to quality.
- **Reliability** — Immigration timelines matter. We deliver on our commitments and keep our clients ahead of deadlines, not behind them.
- **Partnership** — We are not a transactional vendor. We invest in understanding our clients' businesses and become a long-term extension of their operations team.

### Our Team (placeholder grid)
- [Name], Founder & Principal Consultant — [Bio placeholder]
- [Name], Operations Manager — [Bio placeholder]
- [Name], Client Relations Manager — [Bio placeholder]

### Accreditations
- Placeholder section for professional memberships and NIS accreditation logos


## ============================================
## PAGE: SERVICES OVERVIEW (app/services/page.tsx)
## ============================================

### Hero
- **Headline:** Our Services
- **Sub-headline:** Comprehensive immigration and consular services for businesses and professionals operating in Nigeria.

### Intro
Consulat provides end-to-end immigration support across every stage of the expatriate lifecycle — from initial business registration and quota allocation through to visa facilitation, residency permits, and ongoing compliance management.

### 3 Service Cards (large, linked to sub-pages)

**Business Permit**
Obtain the legal authorisation your company needs to operate in Nigeria as a foreign-owned or foreign-affiliated entity.
Covers: Documentation preparation, Federal Ministry of Interior application, follow-up and liaison, permit collection.
[Learn More → /services/business-permit]

**Expatriate Quota**
Secure and manage the quota positions your organisation needs to employ foreign nationals in designated roles.
Covers: Establishment Quota, Additional Quota, Renewal, Monthly Returns, Deletions, Immigration Visits & Queries, Portal Management & Monitoring.
[Learn More → /services/expatriate-quota]

**e-CERPAC (Residence Permits)**
Secure and manage biometric residence permits for your foreign employees throughout their stay in Nigeria.
Covers: Migration/Transitioning, Regularisation, In-Country Renewal, Out-Country Renewal, Landing Page (Entry & Exit).
[Learn More → /services/e-cerpac]

**e-Visas**
Facilitate smooth entry into Nigeria with the right visa category for every employee and visitor.
Covers: Business Visa, Temporary Work Permit (TWP), Tourist Visa, Visa on Arrival (Business), Visa on Arrival (TWP).
[Learn More → /services/e-visas]


## ============================================
## PAGE: BUSINESS PERMIT
## (app/services/business-permit/page.tsx)
## ============================================

### Hero
- **Headline:** Business Permit Services
- **Sub-headline:** Obtain the legal authorisation your company needs to operate in Nigeria as a foreign-owned or foreign-affiliated business.

### Introduction
Every foreign-owned or foreign-affiliated business operating in Nigeria is required to obtain a Business Permit from the Federal Ministry of Interior. This permit is the foundational legal document that authorises a foreign company to conduct business in the country and is a prerequisite for obtaining expatriate quota positions, opening corporate bank accounts, and engaging in regulated commercial activities.

The application process requires detailed documentation, precise compliance with regulatory requirements, and active follow-up with the Ministry. Consulat manages the entire process on your behalf — from initial assessment through to permit approval and collection.

### What We Handle

**Eligibility Assessment**
We assess your company structure, ownership, and business activities to confirm Business Permit requirements and identify the correct application category.

**Documentation Preparation**
Our team compiles and reviews all required documents — including incorporation papers, board resolutions, memorandum and articles of association, and supporting evidence — ensuring every application is complete and accurate before submission.

**Application Submission**
We submit the Business Permit application directly to the Federal Ministry of Interior, managing all filing requirements and ensuring compliance with current regulations.

**Follow-Up & Liaison**
Consulat actively follows up with the Ministry throughout the review process, responding to queries, providing additional information where requested, and keeping you informed at every stage.

**Permit Collection & Delivery**
Once approved, we collect the Business Permit on your behalf and deliver it to your office or designated representative.

### Who Needs a Business Permit?
A Business Permit is required if your company has any of the following:
- Foreign ownership (partial or full)
- Foreign directorship
- Foreign shareholding
- A parent company registered outside Nigeria

If you are unsure whether your organisation requires a Business Permit, our team can conduct a quick assessment and advise accordingly.

### CTA
Need to apply for or renew a Business Permit? Our team handles the full process so you can focus on running your business.
[Book a Consultation] [Contact Us]


## ============================================
## PAGE: EXPATRIATE QUOTA
## (app/services/expatriate-quota/page.tsx)
## ============================================

### Hero
- **Headline:** Expatriate Quota Services
- **Sub-headline:** Secure and manage the quota positions your organisation needs to employ foreign nationals in Nigeria — from initial allocation through to ongoing compliance.

### Introduction
An Expatriate Quota is a government-approved allocation that permits a company to employ a specified number of foreign nationals in designated roles within Nigeria. Issued by the Federal Ministry of Interior, each quota position is tied to a specific job title and must be maintained, renewed, and reported on in accordance with Nigeria Immigration Service regulations.

Consulat provides end-to-end expatriate quota management — covering every stage from first-time applications to renewals, additions, deletions, monthly compliance filings, and NIS portal administration.

### Services List

**Establishment Quota**
The initial quota allocation for newly registered or recently permitted businesses. We guide you through the application process, ensuring the right roles and justifications are presented to secure the positions your company needs from the outset.

**Additional Quota**
When your business grows and requires more expatriate positions than originally allocated, we handle the application for additional slots, including supporting documentation, justification letters, and Ministry liaison.

**Renewal**
Expatriate Quota positions must be renewed periodically. We track expiry dates, prepare renewal applications, and file them well in advance to prevent any disruption to your workforce or compliance status.

**Monthly Returns**
Every company holding an Expatriate Quota is required to file Monthly Returns with the Nigeria Immigration Service. These returns report the status, details, and movements of all expatriate employees. Consulat prepares and submits these filings on your behalf every month, ensuring timely compliance and accurate reporting.

**Deletions**
When an expatriate leaves the company or a quota position is no longer needed, the slot must be formally deleted from the company's allocation. We handle the deletion process and all associated documentation with the Ministry.

**Immigration Visits & Queries**
From time to time, the Nigeria Immigration Service may conduct compliance visits or raise queries regarding your quota utilisation. Consulat provides advisory support, prepares responses, and represents your interests during such engagements — ensuring your company is always audit-ready.

**Portal Management & Monitoring**
We manage your company's NIS online portal on an ongoing basis — monitoring application statuses, responding to system requests, tracking deadlines, and ensuring nothing falls through the cracks. This is particularly valuable for companies with multiple expatriates or frequent permit activity.

### CTA
Need help securing or managing your Expatriate Quota? Our team can assess your requirements and guide you through the process from start to finish.
[Book a Consultation] [Contact Us]


## ============================================
## PAGE: e-CERPAC
## (app/services/e-cerpac/page.tsx)
## ============================================

### Hero
- **Headline:** e-CERPAC Services
- **Sub-headline:** Secure and manage Combined Expatriate Residence Permits and Aliens Cards for your foreign employees — from first-time applications to renewals, regularisation, and entry/exit compliance.

### Introduction
The Combined Expatriate Residence Permit and Aliens Card (CERPAC) is a mandatory biometric residence document for all foreign nationals living and working in Nigeria. Issued by the Nigeria Immigration Service, it serves as proof of lawful residence and must be obtained within the prescribed timeline of arrival.

Consulat handles the complete e-CERPAC lifecycle — whether your employee is arriving in Nigeria for the first time, transitioning between permit categories, or renewing an existing card.

### Services List

**Migration / Transitioning**
When an expatriate's immigration status changes — for example, moving from a Temporary Work Permit to a full Subject to Regularisation (STR) visa, or transferring between employers — the CERPAC must be updated accordingly. We manage the full migration and transitioning process with the NIS.

**Regularisation Process**
Expatriates who enter Nigeria on certain visa types are required to regularise their stay by obtaining a CERPAC within a specified period. Consulat ensures the regularisation is completed on time, preventing penalties, overstay issues, or disruptions to the employee's right to work.

**Renewal Process — In-Country**
For expatriates currently residing in Nigeria whose CERPAC is approaching expiry. We initiate the renewal well in advance, manage the biometric capture process, and track the card through to issuance.

**Renewal Process — Out-Country**
For expatriates who are outside Nigeria at the time of renewal. We coordinate the process remotely and ensure the renewed CERPAC is ready upon their return.

**Landing Page (Entry and Exit)**
All expatriates arriving in or departing from Nigeria are required to complete the NIS Landing Page process — an electronic declaration of entry or exit. Consulat assists with the completion and submission of landing page forms for every arrival and departure, ensuring full compliance with NIS requirements.

### CTA
Need to apply for, renew, or regularise a CERPAC? We manage every step of the process so your employees remain compliant and focused on their work.
[Book a Consultation] [Contact Us]


## ============================================
## PAGE: e-VISAS
## (app/services/e-visas/page.tsx)
## ============================================

### Hero
- **Headline:** e-Visa Services
- **Sub-headline:** Facilitate smooth entry into Nigeria with the right visa category — whether for business, employment, tourism, or short-term assignments.

### Introduction
Nigeria's electronic visa system enables foreign nationals to apply for entry visas through the Nigeria Immigration Service online portal. Selecting the correct visa category, preparing the right supporting documents, and navigating the approval process can be complex — particularly for organisations managing multiple expatriate entries.

Consulat handles visa applications across all relevant categories, ensuring accurate submissions, faster processing, and a smooth arrival experience for your personnel.

### Services List

**Business Visa**
For foreign nationals visiting Nigeria for business meetings, conferences, contract negotiations, site inspections, or other commercial activities that do not constitute employment.
- Eligibility assessment and visa category confirmation
- Preparation of invitation letters, company documents, and supporting materials
- Online application submission and fee processing
- Follow-up through to visa approval

**Temporary Work Permit (TWP)**
For foreign nationals who need to carry out short-term work assignments in Nigeria — typically for projects, installations, technical support, audits, or training — without requiring a full expatriate quota position.
- TWP eligibility assessment
- Documentation preparation, including company and project details
- Application submission and NIS liaison
- Permit tracking through to issuance

**Tourist Visa**
For foreign nationals visiting Nigeria for leisure, family visits, or other non-business purposes.
- Application preparation and document compilation
- Online submission and processing
- Advisory on entry requirements and travel documentation

**Visa on Arrival — Business**
For business travellers who require expedited visa processing upon arrival at a Nigerian port of entry. The Visa on Arrival (Business) allows pre-approved travellers to receive their visa stamp at the airport.
- Pre-approval application submitted to NIS before travel
- Preparation of all supporting documentation
- Coordination with NIS to ensure approval is in place before arrival
- Airport liaison where required

**Visa on Arrival — TWP**
For foreign nationals arriving in Nigeria on short-term work assignments who require a Temporary Work Permit issued on arrival.
- Pre-approval application and documentation
- Coordination with NIS and the employing company
- Arrival facilitation and permit issuance support

### CTA
Need a visa for Nigeria? Whether it is a single entry or a large deployment, our team ensures the right visa is secured — on time and without complications.
[Book a Consultation] [Contact Us]


## ============================================
## PAGE: FAQ (app/faq/page.tsx)
## ============================================

### Hero
- **Headline:** Frequently Asked Questions
- **Sub-headline:** Answers to the most common questions about immigration, work permits, and residency in Nigeria.

### Questions (use shadcn/ui Accordion component)

Q: What is a Business Permit and does my company need one?
A: A Business Permit is a legal authorisation issued by the Federal Ministry of Interior that allows a foreign-owned or foreign-affiliated company to conduct business in Nigeria. If your company has foreign ownership or directorship, a Business Permit is a legal requirement.

Q: What is an Expatriate Quota?
A: An Expatriate Quota is a government-approved allocation that permits a company to employ a specified number of foreign nationals in designated roles within Nigeria. Each quota position is tied to a specific job title and must be renewed periodically.

Q: What is a CERPAC and who needs one?
A: The Combined Expatriate Residence Permit and Aliens Card (CERPAC) is a biometric residence permit required for all foreign nationals living and working in Nigeria. It must be obtained within a specified period after arrival and renewed before expiry.

Q: How long does it take to process a work permit or visa?
A: Processing times vary depending on the permit or visa type, the completeness of documentation, and NIS processing volumes. Consulat provides estimated timelines at the start of every engagement and keeps clients updated throughout the process.

Q: What are Monthly Returns and is my company required to file them?
A: Monthly Returns are mandatory filings submitted to the Nigeria Immigration Service by every company that holds an Expatriate Quota. They report the status and details of all expatriate employees. Failure to file can result in penalties and complications with future applications.

Q: Can Consulat manage our entire immigration portfolio?
A: Yes. Many of our clients engage us on a retainer basis to manage their full immigration portfolio — including all permits, visas, CERPAC renewals, monthly filings, NIS portal management, and compliance monitoring.

Q: What happens if a CERPAC or visa expires?
A: Operating on an expired CERPAC or visa can result in penalties, fines, or restrictions on future applications. Consulat's monitoring systems track all expiry dates and initiate renewals well in advance to prevent any lapse in compliance.

Q: Does Consulat work with companies outside Nigeria?
A: Absolutely. A significant portion of our clients are headquartered in Europe, Asia, the Americas, and other parts of Africa. We serve as their on-the-ground immigration partner in Nigeria, working closely with their HR and legal teams remotely.

Q: How do I get started?
A: Simply reach out via our contact page or book a consultation call. We will assess your requirements and provide a clear recommendation on the permits, visas, and services your organisation needs.


## ============================================
## PAGE: CONTACT (app/contact/page.tsx)
## ============================================

### Hero
- **Headline:** Get in Touch
- **Sub-headline:** Whether you have a specific immigration need or want to discuss ongoing support, our team is ready to help.

### Contact Info (left column)
- **Address:** [To be confirmed], Lagos, Nigeria
- **Phone:** +234 XXX XXXX XXX
- **Email:** info@consulatng.net
- **WhatsApp:** +234 XXX XXXX XXX
- **Hours:** Monday – Friday: 8:00 AM – 5:00 PM (WAT)

### Enquiry Form (right column, React Hook Form + Zod)
Fields:
- Full Name (required)
- Company Name (required)
- Email Address (required, email validation)
- Phone Number (optional)
- Service of Interest (select dropdown):
  - Business Permit
  - Expatriate Quota
  - e-CERPAC
  - e-Visas
  - Monthly Returns
  - General Enquiry
- Number of Expatriates (select dropdown): 1–5 / 6–20 / 21–50 / 50+
- Message (textarea, optional)
- Submit button

### Book a Call
Text: Prefer to speak directly with a consultant? Schedule a 30-minute call at a time that works for you.
Link: [Calendly embed or link]

### Google Maps Embed
Embed office location map


## ============================================
## PAGE: BLOG LISTING (app/blog/page.tsx)
## ============================================

### Hero
- **Headline:** Immigration Insights & Resources
- **Sub-headline:** Stay informed with the latest updates, regulatory changes, and practical guides on immigration and work permits in Nigeria.

### Intro
Our team publishes regular updates to help HR professionals, business leaders, and immigration managers stay ahead of regulatory changes and compliance requirements in Nigeria.

### Blog Grid
- Display all MDX posts from /content/blog/
- Card layout: featured image, title, excerpt, date, read time
- Sort by date descending


## ============================================
## PAGE: BLOG POST (app/blog/[slug]/page.tsx)
## ============================================

- Render MDX content with prose styling (Tailwind Typography plugin)
- Show: title, date, read time, author
- Back to blog link
- Related posts at bottom
- CTA banner at bottom of article


---


# BLOG STARTER ARTICLES (content/blog/)


## Article 1: expatriate-quota-guide.mdx
```
---
title: "A Complete Guide to Expatriate Quota in Nigeria: What Every Employer Needs to Know"
excerpt: "An overview of the expatriate quota system — what it is, who needs it, how to apply, and how to stay compliant."
date: "2025-04-15"
author: "Consulat Team"
image: "/images/blog/expatriate-quota.jpg"
---

[Article body to be written — 800-1200 words covering:
what expatriate quota is, who needs it, application process,
renewal requirements, monthly returns obligations, and
common pitfalls to avoid]
```

## Article 2: understanding-e-cerpac.mdx
```
---
title: "Understanding e-CERPAC: The Residence Permit Every Expatriate in Nigeria Must Have"
excerpt: "A practical guide to the CERPAC process — from first-time applications to renewals and regularisation."
date: "2025-04-10"
author: "Consulat Team"
image: "/images/blog/cerpac-guide.jpg"
---

[Article body to be written — 800-1200 words]
```

## Article 3: nigeria-visa-categories.mdx
```
---
title: "Visa Categories for Entering Nigeria: Which One Does Your Employee Need?"
excerpt: "A breakdown of Nigeria's main visa types for business travellers and foreign workers, and how to choose the right one."
date: "2025-04-05"
author: "Consulat Team"
image: "/images/blog/visa-categories.jpg"
---

[Article body to be written — 800-1200 words]
```


---


# SEO REQUIREMENTS

## Per-Page Metadata (use Next.js generateMetadata)

| Page | Title | Description | Keywords |
|------|-------|-------------|----------|
| Home | Consulat — Immigration & Work Permit Services in Nigeria | Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and CERPAC services. | immigration consulting Nigeria, work permit Nigeria, expatriate quota |
| About | About Consulat — Nigeria's Immigration Consulting Experts | Learn about Consulat's team, mission, and expertise in Nigerian immigration services for international businesses. | about consulat, immigration consultants Lagos |
| Services | Immigration Services — Consulat | Comprehensive immigration services including business permits, expatriate quotas, e-CERPAC, and e-visas for Nigeria. | Nigeria immigration services, visa services Nigeria |
| Business Permit | Business Permit Services in Nigeria — Consulat | Business permit applications for foreign-owned companies in Nigeria. Full documentation, Ministry submission, and follow-up services. | business permit Nigeria, foreign company permit Nigeria |
| Expatriate Quota | Expatriate Quota Management Services — Consulat | Expatriate quota applications, renewals, monthly returns, deletions, and NIS portal management services in Nigeria. | expatriate quota Nigeria, monthly returns NIS, quota renewal Nigeria |
| e-CERPAC | e-CERPAC Residence Permit Services — Consulat | CERPAC applications, renewals, regularisation, and migration services for expatriates in Nigeria. | CERPAC Nigeria, residence permit Nigeria, CERPAC renewal |
| e-Visas | e-Visa Services for Nigeria — Consulat | Business visas, temporary work permits, tourist visas, and visa-on-arrival services for entry into Nigeria. | Nigeria visa, business visa Nigeria, visa on arrival Nigeria, TWP Nigeria |
| FAQ | FAQs — Immigration & Work Permits in Nigeria — Consulat | Answers to common questions about business permits, expatriate quotas, CERPAC, visas, and immigration compliance in Nigeria. | Nigeria immigration FAQ, work permit questions |
| Contact | Contact Consulat — Book an Immigration Consultation | Get in touch with Consulat for immigration consulting, visa services, and expatriate management in Lagos, Nigeria. | contact consulat, immigration consultant Lagos |
| Blog | Immigration Insights & Resources — Consulat | Articles, guides, and regulatory updates on immigration and work permits in Nigeria. | Nigeria immigration blog, immigration news Nigeria |

## Technical SEO
- Generate sitemap.xml via app/sitemap.ts
- Generate robots.txt via app/robots.ts
- Add JSON-LD LocalBusiness schema to homepage
- Add JSON-LD Service schema to each service page
- Add JSON-LD FAQPage schema to FAQ page
- Add JSON-LD BlogPosting schema to each blog post
- Open Graph and Twitter Card meta on all pages
- Canonical URLs on all pages


---


# GLOBAL COMPONENTS

## Navbar
- Logo (left)
- Nav links: Home, About, Services (dropdown: Business Permit, Expatriate Quota, e-CERPAC, e-Visas), Blog, FAQ, Contact
- CTA button: "Book a Consultation" (right)
- Mobile: hamburger menu with slide-out drawer
- Sticky on scroll with subtle shadow

## Footer
- 4 columns:
  1. Logo + company description (2 sentences)
  2. Quick Links: Home, About, Services, Blog, FAQ, Contact
  3. Services: Business Permit, Expatriate Quota, e-CERPAC, e-Visas
  4. Contact: Address, Phone, Email, WhatsApp
- Social media icons row (LinkedIn, Twitter/X, Instagram)
- Bottom bar: © 2025 Consulat Ltd. All rights reserved.

## WhatsApp Floating Widget
- Fixed bottom-right
- Green WhatsApp icon
- Opens wa.me link with pre-filled message:
  "Hello Consulat, I would like to enquire about your immigration services."


---


# BUILD INSTRUCTIONS FOR CLAUDE CODE

1. Initialise a new Next.js 14 project with TypeScript and Tailwind CSS
2. Install dependencies: shadcn/ui, lucide-react, react-hook-form, zod, gray-matter, next-mdx-remote, @tailwindcss/typography
3. Set up the Tailwind config with the colour system defined above
4. Set up fonts (Inter + Plus Jakarta Sans) via next/font/google
5. Build the root layout with Navbar and Footer
6. Build all pages in the order listed above, using the exact content provided
7. Build the MDX blog system with gray-matter frontmatter parsing
8. Implement all SEO metadata using generateMetadata on every page
9. Add JSON-LD structured data where specified
10. Generate sitemap.ts and robots.ts
11. Add the WhatsApp floating widget
12. Ensure full mobile responsiveness on all pages
13. Test all navigation links work correctly
14. Deploy to Vercel

Build every page completely. Do not use placeholder "Lorem ipsum" text.
Use the exact copy provided in this document for all page content.