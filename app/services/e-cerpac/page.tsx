import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceBanner } from "@/components/services/ServiceBanner";
import { ServiceItem } from "@/components/services/ServiceItem";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceNav } from "@/components/services/ServiceNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "e-CERPAC Residence Permit Services — Consulat",
  description:
    "CERPAC applications, renewals, regularisation, and migration services for expatriates in Nigeria.",
  path: "/services/e-cerpac",
  keywords: ["CERPAC Nigeria", "residence permit Nigeria", "CERPAC renewal", "regularisation Nigeria"],
});

const ITEMS = [
  {
    title: "Migration / Transitioning",
    description:
      "When an expatriate's immigration status changes — for example, moving from a Temporary Work Permit to a full Subject to Regularisation (STR) visa, or transferring between employers — the CERPAC must be updated accordingly. We manage the full migration and transitioning process with the NIS.",
  },
  {
    title: "Regularisation Process",
    description:
      "Expatriates who enter Nigeria on certain visa types are required to regularise their stay by obtaining a CERPAC within a specified period. Consulat ensures the regularisation is completed on time, preventing penalties, overstay issues, or disruptions to the employee's right to work.",
  },
  {
    title: "Renewal Process — In-Country",
    description:
      "For expatriates currently residing in Nigeria whose CERPAC is approaching expiry. We initiate the renewal well in advance, manage the biometric capture process, and track the card through to issuance.",
  },
  {
    title: "Renewal Process — Out-Country",
    description:
      "For expatriates who are outside Nigeria at the time of renewal. We coordinate the process remotely and ensure the renewed CERPAC is ready upon their return.",
  },
  {
    title: "Landing Page (Entry and Exit)",
    description:
      "All expatriates arriving in or departing from Nigeria are required to complete the NIS Landing Page process — an electronic declaration of entry or exit. Consulat assists with the completion and submission of landing page forms for every arrival and departure, ensuring full compliance with NIS requirements.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "e-CERPAC Residence Permit",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "Country", name: "Nigeria" },
  description:
    "Combined Expatriate Residence Permit and Aliens Card (CERPAC) services — migration/transitioning, regularisation, in-country and out-country renewal, and landing page filings.",
  url: `${SITE.url}/services/e-cerpac`,
};

export default function ECerpacPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow="Immigration Simplified"
        title="e-CERPAC Services"
        subtitle="Secure and manage Combined Expatriate Residence Permits and Aliens Cards for your foreign employees — from first-time applications to renewals, regularisation, and entry/exit compliance."
      />
      <ServiceBanner src="/services/e-cerpac.jpg" alt="e-CERPAC Services" />

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="container-prose max-w-4xl">
          <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              The Combined Expatriate Residence Permit and Aliens Card (CERPAC) is a mandatory biometric residence document for all foreign nationals living and working in Nigeria. Issued by the Nigeria Immigration Service, it serves as proof of lawful residence and must be obtained within the prescribed timeline of arrival.
            </p>
            <p>
              Consulat handles the complete e-CERPAC lifecycle — whether your employee is arriving in Nigeria for the first time, transitioning between permit categories, or renewing an existing card.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-grey-50 py-14 sm:py-20">
        <div className="container-prose">
          <h2 className="mb-10 font-display text-3xl font-bold text-grey-900 sm:text-4xl">
            What We Cover
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}><ServiceItem {...item} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <ServiceNav currentSlug="e-cerpac" />
      <ServiceCTA
        heading="Need to apply for, renew, or regularise a CERPAC?"
        body="We manage every step of the process so your employees remain compliant and focused on their work."
      />
    </>
  );
}
