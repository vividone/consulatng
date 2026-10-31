import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceBanner } from "@/components/services/ServiceBanner";
import { ServiceCoverGrid } from "@/components/services/ServiceCoverGrid";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceNav } from "@/components/services/ServiceNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";
import { Check } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Business Permit Services in Nigeria — Consulat",
  description:
    "Business permit applications for foreign-owned companies in Nigeria. Full documentation, Ministry submission, and follow-up services.",
  path: "/services/business-permit",
  keywords: ["business permit Nigeria", "foreign company permit Nigeria", "Federal Ministry of Interior"],
});

const ITEMS = [
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
];

const ELIGIBILITY = [
  "Foreign ownership (partial or full)",
  "Foreign directorship",
  "Foreign shareholding",
  "A parent company registered outside Nigeria",
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Business Permit",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "Country", name: "Nigeria" },
  description:
    "End-to-end Business Permit applications for foreign-owned and foreign-affiliated companies operating in Nigeria — eligibility, documentation, Ministry submission, follow-up, and collection.",
  url: `${SITE.url}/services/business-permit`,
};

export default function BusinessPermitPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow="Immigration Simplified"
        title="Business Permit Services"
        subtitle="You can own a Nigerian Business 100% and create a pathway towards Nigerian (Temporary or Permanent) Residency for your staff."
      />
      <ServiceBanner src="/services/business-permit.jpg" alt="Business Permit Services" />

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="container-prose max-w-4xl">
          <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              Every foreign-owned or foreign-affiliated business operating in Nigeria is required to obtain a Business Permit from the Federal Ministry of Interior. This permit is the foundational legal document that authorises a foreign company to conduct business in the country and is a prerequisite for obtaining expatriate quota positions, opening corporate bank accounts, and engaging in regulated commercial activities.
            </p>
            <p>
              The application process requires detailed documentation, precise compliance with regulatory requirements, and active follow-up with the Ministry. Consulat manages the entire process on your behalf — from initial assessment through to permit approval and collection.
            </p>
          </div>
        </div>
      </section>

      <ServiceCoverGrid
        heading="What We Handle"
        items={ITEMS}
        image="/services/business-permit-cover.jpg"
        imageAlt="Business Permit application in Nigeria"
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-grey-900 sm:text-4xl">
            Who Needs a Business Permit?
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-grey-700">
            A Business Permit is required if your company has any of the following:
          </p>
          <ul className="mt-6 space-y-3">
            {ELIGIBILITY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[17px] text-grey-700">
                <Check className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[17px] leading-relaxed text-grey-700">
            If you are unsure whether your organisation requires a Business Permit, our team can conduct a quick assessment and advise accordingly.
          </p>
        </div>
      </section>

      <ServiceNav currentSlug="business-permit" />
      <ServiceCTA
        heading="Need to apply for, renew or authenticate a Business Permit?"
        body="Our team handles the full process so you can focus on running your business."
      />
    </>
  );
}
