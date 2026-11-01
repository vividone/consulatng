import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { BridgeSlider } from "@/components/shared/BridgeSlider";
import { CTABanner } from "@/components/home/CTABanner";
import { TeamGrid } from "@/components/shared/TeamGrid";
import { buildMetadata } from "@/lib/metadata";
import { getBridgeImages } from "@/lib/bridges";
import { getAboutPage, getTeam } from "@/lib/content";
import { iconFor } from "@/components/shared/icons";
import { RichText } from "@payloadcms/richtext-lexical/react";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPage();
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: "/about",
    keywords: (content.keywords ?? []).map((k) => k.keyword),
  });
}




export default async function AboutPage() {
  const bridgeImages = getBridgeImages();
  const [content, team] = await Promise.all([getAboutPage(), getTeam()]);
  const values = content.values ?? [];

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />
      <BridgeSlider
        images={bridgeImages}
        overlayHeading={content.bridgeHeading}
        overlayText={content.bridgeText}
      />

      <section className="bg-white pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="container-prose grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {content.storyEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-grey-900 sm:text-4xl">
              {content.storyTitle}
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <RichText data={content.storyBody} />
          </Reveal>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="container-prose py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {content.missionEyebrow}
            </p>
            <p className="mt-4 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              {content.missionStatement}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-grey-50 py-16 sm:py-24">
        <div className="container-prose">
          <Reveal>
            <SectionHeading
              eyebrow={content.valuesEyebrow}
              title={content.valuesTitle}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mx-auto grid max-w-6xl divide-y divide-grey-200 overflow-hidden rounded-2xl border border-grey-200 bg-white sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
              {values.map((value) => {
                const Icon = iconFor(value.icon);
                return (
                  <div key={value.id ?? value.title} className="space-y-3 p-8 lg:p-10">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5 shrink-0 text-accent" />
                      <h3 className="font-display text-base font-semibold text-grey-900">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-grey-700">
                      {value.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-prose">
          <Reveal>
            <SectionHeading
              eyebrow={content.teamEyebrow}
              title={content.teamTitle}
              intro={content.teamIntro}
            />
          </Reveal>
          <TeamGrid members={team} />
        </div>
      </section>

      {/* <section className="bg-grey-50 py-14 sm:py-20">
        <div className="container-prose text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Accreditations & Memberships
          </p>
          <p className="mx-auto mt-3 max-w-xl text-grey-700">
            Placeholder for professional memberships and NIS accreditation logos. To be supplied by the client.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-20 items-center justify-center rounded-lg border border-dashed border-grey-300 bg-white text-sm text-grey-500"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <CTABanner heading={content.ctaHeading} />
    </>
  );
}
