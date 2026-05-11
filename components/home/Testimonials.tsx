import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const TESTIMONIALS = [
  {
    quote:
      "Consulat handled our entire team's CERPAC and quota renewals seamlessly. Their proactive monitoring meant we never had a single expiry surprise.",
    name: "Ajit",
    role: "HR Director",
    country: "India",
    flag: "🇮🇳",
  },
  {
    quote:
      "When we expanded operations into Lagos, Consulat became our go-to immigration partner. The team is responsive, meticulous, and deeply knowledgeable.",
    name: "Yoann",
    role: "Operations Lead",
    country: "France",
    flag: "🇫🇷",
  },
  {
    quote:
      "From visa-on-arrival to long-term residence permits, Consulat has supported our entire expatriate workforce in Nigeria. We couldn't recommend them more.",
    name: "Sanne",
    role: "Global Mobility Manager",
    country: "Netherlands",
    flag: "🇳🇱",
  },
];

export function Testimonials() {
  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <SectionHeading eyebrow="Testimonials" title="What our clients say" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border border-grey-200 bg-white p-8 shadow-sm">
                <Quote className="h-8 w-8 text-accent" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-grey-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-grey-200 pt-4">
                  <p className="font-display text-base font-bold text-grey-900">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-sm text-grey-500">
                    {t.role} · <span aria-hidden>{t.flag}</span> {t.country}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
