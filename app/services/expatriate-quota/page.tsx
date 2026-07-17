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
      "Expatriate Quota positions must be renewed periodically. We track expiry dates, prepare renewal applications, compile the necessary documentation, and file them well in advance to prevent any disruption to your workforce or compliance status.",
  },
  {
    title: "Monthly Returns",
    description:
      "Every company holding an Expatriate Quota is required to file Monthly Returns with the Nigeria Immigration Service. These returns report the status, details, movement and location of all expatriate employees, their qualifications, demographics, and Nigerian understudies. Consulat prepares and submits these filings on your behalf every month, ensuring timely compliance and accurate reporting.",
  },
  {
    title: "Deletion Returns",
    description:
      "In the event of an expatriate being disengaged or demobilised upon completion of their task or project, the company owes a reporting obligation to the Comptroller General, Nigeria Immigration Service. The NIS will only absolve the company of immigration responsibility and delete the departed expatriate from the company's Expatriate Quota Card after proof of exit — by physical surrender of the e-CERPAC card and/or the airline boarding pass of the departed expatriate.",
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
        eyebrow="Immigration Simplified"
        title="Expatriate Quota Services"
        subtitle="Secure and manage approvals for your organisation to employ foreign nationals in Nigeria. Your selected persons will be employed in Nigeria and will be able to apply for Work and Residence Permits."
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

      <ServiceCoverGrid
        heading="What We Cover"
        items={ITEMS}
        image="/services/expatriate-quota-cover.jpg"
        imageAlt="Expatriate Quota management in Nigeria"
      />

      <ServiceNav currentSlug="expatriate-quota" />
      <ServiceCTA
        heading="Need help securing or managing your Expatriate Quota?"
        body="Our team can assess your requirements and guide you through the process from start to finish."
      />
    </>
  );
}
