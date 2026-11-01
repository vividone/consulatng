import {
  Clock,
  Ear,
  HeartHandshake,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Row of icon cards. Extracted from the Training page's PILLARS block so it
 * can be driven from the CMS.
 *
 * Icons are a fixed lookup rather than a free-text field: an icon is a React
 * component that has to be bundled, so an editor typing an arbitrary name
 * could only ever produce a blank square. The Services collection offers the
 * same six as a dropdown.
 */
const ICONS = {
  ear: Ear,
  sparkles: Sparkles,
  handshake: HeartHandshake,
  shield: Shield,
  clock: Clock,
  users: Users,
} satisfies Record<string, LucideIcon>;

export type ServiceHighlightIcon = keyof typeof ICONS;

type Props = {
  heading?: string;
  items: {
    id?: string | null;
    icon: ServiceHighlightIcon;
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
            const Icon = ICONS[item.icon] ?? Sparkles;
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
