import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceBanner } from "@/components/services/ServiceBanner";
import { ServiceCoverGrid } from "@/components/services/ServiceCoverGrid";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceNav } from "@/components/services/ServiceNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "e-Visa Services for Nigeria — Consulat",
  description:
    "Business visas, temporary work permits, tourist visas, and visa-on-arrival services for entry into Nigeria.",
  path: "/services/e-visas",
  keywords: [
    "Nigeria visa",
    "business visa Nigeria",
    "visa on arrival Nigeria",
    "TWP Nigeria",
    "temporary work permit Nigeria",
  ],
});

const ITEMS = [
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
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "e-Visa Services for Nigeria",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "Country", name: "Nigeria" },
  description:
    "Nigeria e-visa facilitation — business visas, temporary work permits, tourist visas, and visa-on-arrival processing.",
  url: `${SITE.url}/services/e-visas`,
};

export default function EVisasPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow="Immigration Simplified"
        title="e-Visa Services"
        subtitle="Facilitate smooth entry into Nigeria with the right visa category — whether for business, employment, tourism, or short-term assignments."
      />
      <ServiceBanner src="/services/e-visas.jpg" alt="e-Visa Services" />

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="container-prose max-w-4xl">
          <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              Nigeria&apos;s electronic visa system enables foreign nationals to apply for entry visas through the Nigeria Immigration Service online portal. Selecting the correct visa category, preparing the right supporting documents, and navigating the approval process can be complex — particularly for organisations managing multiple expatriate entries.
            </p>
            <p>
              Consulat handles visa applications across all relevant categories, ensuring accurate submissions, faster processing, and a smooth arrival experience for your personnel.
            </p>
          </div>
        </div>
      </section>

      <ServiceCoverGrid
        heading="What We Cover"
        items={ITEMS}
        image="/services/e-visas-cover.jpg"
        imageAlt="e-Visa applications for Nigeria"
      />

      <ServiceNav currentSlug="e-visas" />
      <ServiceCTA
        heading="Need a visa for Nigeria?"
        body="Whether it is a single entry or a large deployment, our team ensures the right visa is secured — on time and without complications."
      />
    </>
  );
}
