import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { iconFor } from "@/components/shared/icons";
import type { HomePage } from "@/cms/payload-types";


export function WhyConsulat({ content }: { content: HomePage }) {
  const pillars = content.pillars ?? [];

  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            eyebrow={content.whyEyebrow}
            title={content.whyTitle}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto grid max-w-6xl divide-y divide-grey-200 overflow-hidden rounded-2xl border border-grey-200 bg-white sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = iconFor(pillar.icon);
              return (
              <div key={pillar.id ?? pillar.title} className="space-y-3 p-8 lg:p-10">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 shrink-0 text-accent" />
                  <h3 className="font-display text-base font-semibold text-grey-900">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-grey-700">
                  {pillar.body}
                </p>
              </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
