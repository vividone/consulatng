import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceStack } from "@/components/services/ServiceStack";

export function ServicesOverview() {
  return (
    <section className="relative bg-grey-50 pb-16 sm:pb-24">
      {/* Sticky section heading — stays visible while cards stack so the
          reader always has context for what they're scrolling through. */}
      <div className="sticky top-20 z-20 border-b border-grey-200/60 bg-grey-50/85 backdrop-blur-md md:top-24">
        <div className="container-prose py-8 sm:py-10">
          <SectionHeading
            eyebrow="What We Do"
            title="Immigration & Business Support"
            intro="From establishing a business presence to relocating employees and managing ongoing compliance — we handle every stage so your team can focus on what matters."
            className="mb-0"
          />
        </div>
      </div>

      <div className="mt-10 sm:mt-14">
        <ServiceStack topOffsetRem={20} />
      </div>
    </section>
  );
}
