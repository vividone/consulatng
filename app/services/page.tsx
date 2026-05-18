import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceStack } from "@/components/services/ServiceStack";
import { CTABanner } from "@/components/home/CTABanner";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Immigration Services — Consulat",
  description:
    "Comprehensive immigration services including business permits, expatriate quotas, e-CERPAC, and e-visas for Nigeria.",
  path: "/services",
  keywords: ["Nigeria immigration services", "visa services Nigeria"],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Immigration Simplified"
        title="Our Services"
        subtitle="Comprehensive immigration and consular services for businesses and professionals operating in Nigeria."
      />

      <section className="bg-grey-50 pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="container-prose mb-10 sm:mb-14">
          <Reveal>
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-grey-700">
              Consulat provides end-to-end immigration support across every stage of the expatriate lifecycle — from initial business registration and quota allocation through to visa facilitation, residency permits, and ongoing compliance management.
            </p>
          </Reveal>
        </div>

        <ServiceStack topOffsetRem={6} />
      </section>

      <CTABanner />
    </>
  );
}
