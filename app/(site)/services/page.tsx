import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceStack } from "@/components/services/ServiceStack";
import { CTABanner } from "@/components/home/CTABanner";
import { buildMetadata } from "@/lib/metadata";
import { getServicesPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServicesPage();
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: "/services",
    keywords: (content.keywords ?? []).map((k) => k.keyword),
  });
}

export default async function ServicesPage() {
  const content = await getServicesPage();

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      <section className="bg-grey-50 pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="container-prose mb-10 sm:mb-14">
          <Reveal>
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-grey-700">
              {content.intro}
            </p>
          </Reveal>
        </div>

        <ServiceStack topOffsetRem={6} />
      </section>

      <CTABanner />
    </>
  );
}
