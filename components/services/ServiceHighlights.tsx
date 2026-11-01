import { Reveal } from "@/components/shared/Reveal";
import { iconFor } from "@/components/shared/icons";

/**
 * Row of icon cards. Extracted from the Training page's PILLARS block so it
 * can be driven from the CMS.
 *
 * Icons resolve through the shared registry in components/shared/icons.tsx,
 * whose keys are derived from the options the back office offers.
 */

type Props = {
  heading?: string;
  items: {
    id?: string | null;
    icon: string;
    title: string;
    body: string;
  }[];
};

export function ServiceHighlights({ heading, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-grey-50 py-14 sm:py-20">
      <div className="container-prose">
        {heading && (
          <h2 className="mb-10 font-display text-3xl font-bold text-grey-900 sm:text-4xl">
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = iconFor(item.icon);
            return (
              <Reveal key={item.id ?? item.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-grey-200 bg-white p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-grey-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-grey-700">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
