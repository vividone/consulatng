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
  title: "Expatriate Quota Management Services — Consulat",
  description:
    "Expatriate quota applications, renewals, monthly returns, deletions, and NIS portal management services in Nigeria.",
  path: "/services/expatriate-quota",
  keywords: [
    "expatriate quota Nigeria",
    "monthly returns NIS",
    "quota renewal Nigeria",
    "Federal Ministry of Interior",
  ],
});

const ITEMS = [
  {
    title: "Establishment Quota",
    description:
      "The initial quota allocation for newly registered or recently permitted businesses. We guide you through the application process, ensuring the right roles and justifications are presented to secure the positions your company needs from the outset.",
  },
  {
    title: "Additional Quota",
    description:
      "When your business grows and requires more expatriate positions than originally allocated, we handle the application for additional slots, including supporting documentation, justification letters, and Ministry liaison.",
  },
  {
    title: "Renewal",
    description:
      "Expatriate Quota positions must be renewed periodically. We track expiry dates, prepare renewal applications, and file them well in advance to prevent any disruption to your workforce or compliance status.",
  },
  {
    title: "Monthly Returns",
    description:
      "Every company holding an Expatriate Quota is required to file Monthly Returns with the Nigeria Immigration Service. These returns report the status, details, and movements of all expatriate employees. Consulat prepares and submits these filings on your behalf every month, ensuring timely compliance and accurate reporting.",
  },
  {
    title: "Deletions",
    description:
      "When an expatriate leaves the company or a quota position is no longer needed, the slot must be formally deleted from the company's allocation. We handle the deletion process and all associated documentation with the Ministry.",
  },
  {
    title: "Immigration Visits & Queries",
    description:
      "From time to time, the Nigeria Immigration Service may conduct compliance visits or raise queries regarding your quota utilisation. Consulat provides advisory support, prepares responses, and represents your interests during such engagements — ensuring your company is always audit-ready.",
  },
  {
    title: "Portal Management & Monitoring",
    description:
      "We manage your company's NIS online portal on an ongoing basis — monitoring application statuses, responding to system requests, tracking deadlines, and ensuring nothing falls through the cracks. This is particularly valuable for companies with multiple expatriates or frequent permit activity.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Expatriate Quota Management",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "Country", name: "Nigeria" },
  description:
    "End-to-end expatriate quota management — establishment, additional quota, renewals, monthly returns, deletions, NIS visits, and portal management.",
  url: `${SITE.url}/services/expatriate-quota`,
};

export default function ExpatriateQuotaPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow="Services"
        title="Expatriate Quota Services"
        subtitle="Secure and manage the quota positions your organisation needs to employ foreign nationals in Nigeria — from initial allocation through to ongoing compliance."
      />
      <ServiceBanner src="/services/expatriate-quota.jpg" alt="Expatriate Quota Services" />

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="container-prose max-w-4xl">
          <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              An Expatriate Quota is a government-approved allocation that permits a company to employ a specified number of foreign nationals in designated roles within Nigeria. Issued by the Federal Ministry of Interior, each quota position is tied to a specific job title and must be maintained, renewed, and reported on in accordance with Nigeria Immigration Service regulations.
            </p>
            <p>
              Consulat provides end-to-end expatriate quota management — covering every stage from first-time applications to renewals, additions, deletions, monthly compliance filings, and NIS portal administration.
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

      <ServiceNav currentSlug="expatriate-quota" />
      <ServiceCTA
        heading="Need help securing or managing your Expatriate Quota?"
        body="Our team can assess your requirements and guide you through the process from start to finish."
      />
    </>
  );
}
