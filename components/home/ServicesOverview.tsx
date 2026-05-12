import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceStack } from "@/components/services/ServiceStack";

export function ServicesOverview() {
  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose mb-12 sm:mb-16">
        <SectionHeading
          eyebrow="What We Do"
          title="Immigration & Business Support"
          intro="From establishing a business presence to relocating employees and managing ongoing compliance — we handle every stage so your team can focus on what matters."
          className="mb-0"
        />
      </div>

      <ServiceStack sticky={false} />
    </section>
  );
}
