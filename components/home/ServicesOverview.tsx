import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceStack } from "@/components/services/ServiceStack";
import type { HomePage } from "@/cms/payload-types";

export function ServicesOverview({ content }: { content: HomePage }) {
  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose mb-12 sm:mb-16">
        <SectionHeading
          eyebrow={content.servicesEyebrow}
          title={content.servicesTitle}
          intro={content.servicesIntro}
          className="mb-0"
        />
      </div>

      <ServiceStack sticky={false} />
    </section>
  );
}
