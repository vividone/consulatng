import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceBanner } from "@/components/services/ServiceBanner";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceNav } from "@/components/services/ServiceNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";
import { Ear, Sparkles, HeartHandshake } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Training Services — Consulat",
  description:
    "Practical training programmes built around your team's real challenges — leadership, communication, project management, and digital skills.",
  path: "/services/training",
  keywords: [
    "corporate training Nigeria",
    "leadership training Lagos",
    "team development Nigeria",
  ],
});

const PILLARS = [
  {
    icon: Ear,
    title: "We start with you",
    body: "Before designing anything, we listen. What's slowing your team down? Where do people feel stuck? We build the training around your goals — whether it's leadership, communication, project management, or digital skills.",
  },
  {
    icon: Sparkles,
    title: "It's made to stick",
    body: "You'll learn by doing. Every session mixes short explanations with exercises and real scenarios from your work. You leave with a clear plan, not just notes you'll forget.",
  },
  {
    icon: HeartHandshake,
    title: "It feels human",
    body: "Learning works best when people feel safe to ask questions and try new things. Our trainers keep it engaging, supportive, and free of judgment.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Corporate Training",
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: { "@type": "Country", name: "Nigeria" },
  description:
    "Practical, tailored training programmes covering leadership, communication, project management, digital skills, and bespoke topics built around your team's real challenges.",
  url: `${SITE.url}/services/training`,
};

export default function TrainingPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        eyebrow="Immigration Simplified"
        title="Training"
        subtitle="Building skills you can actually use."
      />

      <ServiceBanner src="/services/training.jpg" alt="Training Services" />

      <section className="bg-white pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="container-prose max-w-4xl">
          <div className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              At our core, we believe people grow when they&apos;re given the right tools and the confidence to use them. That&apos;s why training isn&apos;t an add-on for us — it&apos;s one of the main ways we help teams and individuals move forward.
            </p>
            <p>
              We&apos;ve all sat through trainings that feel like a blur of slides and jargon. That&apos;s not how we work. Our sessions are practical, clear, and built around your real challenges. No fluff, no one-size-fits-all lectures — just skills you can use the next day.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-grey-50 py-14 sm:py-20">
        <div className="container-prose">
          <h2 className="mb-10 font-display text-3xl font-bold text-grey-900 sm:text-4xl">
            What makes it different?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-grey-200 bg-white p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-grey-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-grey-700">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-grey-900 sm:text-4xl">
            The result
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-grey-700">
            Teams that communicate better, solve problems faster, and feel more confident in their roles.
          </p>
        </div>
      </section>

      <ServiceNav currentSlug="training" />
      <ServiceCTA
        heading="Ready to grow?"
        body="Let's talk about how training can help your team get there."
      />
    </>
  );
}
