import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Check } from "lucide-react";

import { PageHero } from "@/components/shared/PageHero";
import { ServiceBanner } from "@/components/services/ServiceBanner";
import { ServiceCoverGrid } from "@/components/services/ServiceCoverGrid";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceHighlights } from "@/components/services/ServiceHighlights";
import { ServiceNav } from "@/components/services/ServiceNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";
import {
  getServiceBySlug,
  getServiceSummaries,
  resolveImage,
} from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

/**
 * One route for all five service pages, replacing five near-identical page
 * files. Content comes from the Services collection, so adding a sixth
 * service is an entry in the back office rather than a new file and a deploy.
 */

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServiceSummaries();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    keywords: (service.keywords ?? []).map((k) => k.keyword),
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const [service, services] = await Promise.all([
    getServiceBySlug(slug),
    getServiceSummaries(),
  ]);

  if (!service) notFound();

  const banner = resolveImage(service.bannerImage);
  const introImage = resolveImage(service.introImage);
  const coverImage = resolveImage(service.coverImage);
  const coverItems = service.coverItems ?? [];
  const highlights = service.highlights ?? [];
  const sections = service.sections ?? [];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.schemaServiceType,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "Country", name: "Nigeria" },
    description: service.schemaDescription,
    url: `${SITE.url}/services/${service.slug}`,
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow={service.heroEyebrow}
        title={service.heroTitle}
        subtitle={service.heroSubtitle}
      />
      {banner && (
        <ServiceBanner src={banner.url} alt={service.bannerAlt ?? banner.alt} />
      )}

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className={cn("container-prose", !introImage && "max-w-4xl")}>
          {introImage ? (
            /* Training's layout: prose beside a portrait image. */
            <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
              <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
                <RichText data={service.intro} />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-grey-200">
                <Image
                  src={introImage.url}
                  alt={service.introImageAlt ?? introImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
              <RichText data={service.intro} />
            </div>
          )}
        </div>
      </section>

      {coverItems.length > 0 && (
        <ServiceCoverGrid
          heading={service.coverHeading ?? "What We Cover"}
          items={coverItems.map((item) => ({
            title: item.title,
            description: item.description,
            bullets: (item.bullets ?? []).map((b) => b.text),
          }))}
          image={coverImage?.url}
          imageAlt={service.coverImageAlt ?? coverImage?.alt ?? ""}
        />
      )}

      {highlights.length > 0 && (
        <ServiceHighlights
          heading={service.highlightsHeading ?? undefined}
          items={highlights}
        />
      )}

      {sections.map((section, i) => (
        <section
          key={section.id ?? i}
          className="bg-white py-14 sm:py-20"
        >
          <div
            className={cn(
              "container-prose",
              section.align === "center"
                ? "max-w-3xl text-center"
                : "max-w-4xl",
            )}
          >
            <h2 className="font-display text-3xl font-bold text-grey-900 sm:text-4xl">
              {section.heading}
            </h2>
            {section.intro && (
              <div className="mt-4 space-y-5 text-[17px] leading-relaxed text-grey-700">
                <RichText data={section.intro} />
              </div>
            )}
            {(section.checklist ?? []).length > 0 && (
              <ul className="mt-6 space-y-3 text-left">
                {(section.checklist ?? []).map((item, j) => (
                  <li
                    key={item.id ?? j}
                    className="flex items-start gap-3 text-[17px] text-grey-700"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-accent" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.outro && (
              <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-grey-700">
                <RichText data={section.outro} />
              </div>
            )}
          </div>
        </section>
      ))}

      <ServiceNav services={services} currentSlug={service.slug} />
      <ServiceCTA heading={service.ctaHeading} body={service.ctaBody} />
    </>
  );
}
