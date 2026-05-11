import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { BridgeSlider } from "@/components/shared/BridgeSlider";
import { CTABanner } from "@/components/home/CTABanner";
import { buildMetadata } from "@/lib/metadata";
import { getBridgeImages } from "@/lib/bridges";
import { ShieldCheck, Sparkles, Clock, Handshake } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About Consulat — Nigeria's Immigration Consulting Experts",
  description:
    "Learn about Consulat's team, mission, and expertise in Nigerian immigration services for international businesses.",
  path: "/about",
  keywords: ["about consulat", "immigration consultants Lagos"],
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    body: "We operate with transparency and honesty in every engagement. Our clients know exactly where their application stands at all times.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    body: "We hold ourselves to the highest standard of service delivery. Every document, every filing, every interaction reflects our commitment to quality.",
  },
  {
    icon: Clock,
    title: "Reliability",
    body: "Immigration timelines matter. We deliver on our commitments and keep our clients ahead of deadlines, not behind them.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    body: "We are not a transactional vendor. We invest in understanding our clients' businesses and become a long-term extension of their operations team.",
  },
];

const TEAM = [
  {
    name: "[Name]",
    role: "Founder & Principal Consultant",
    bio: "Bio coming soon — background, qualifications, years of experience, and areas of expertise.",
  },
  {
    name: "[Name]",
    role: "Operations Manager",
    bio: "Bio coming soon.",
  },
  {
    name: "[Name]",
    role: "Client Relations Manager",
    bio: "Bio coming soon.",
  },
];

export default function AboutPage() {
  const bridgeImages = getBridgeImages();

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Consulat"
        subtitle="Nigeria's Specialist Immigration Consulting Firm — Trusted by Multinationals, NGOs, and Growing Businesses Worldwide."
      />
      <BridgeSlider
        images={bridgeImages}
        overlayHeading="Bridging the world to Nigeria"
        overlayText="From every continent to Lagos — we connect global businesses and professionals to opportunity in Nigeria."
      />

      <section className="bg-white pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="container-prose grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Our Story
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-grey-900 sm:text-4xl">
              A reliable partner for immigration in Nigeria
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-[17px] leading-relaxed text-grey-700">
            <p>
              Consulat was founded with a clear mission: to make Nigeria&apos;s immigration process seamless, transparent, and stress-free for international businesses and professionals.
            </p>
            <p>
              Over the years, we have built a reputation for reliability, attention to detail, and deep institutional knowledge of the Nigerian immigration system. We work closely with the Nigeria Immigration Service and understand the regulatory landscape at every level — from federal directives to state-level implementation.
            </p>
            <p>
              Our clients include Fortune 500 companies, international NGOs, fast-growing startups, and individual professionals across Europe, Asia, the Americas, and Africa. Regardless of size, every client receives the same standard of care: proactive communication, meticulous documentation, and full compliance assurance.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="container-prose py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Our Mission
            </p>
            <p className="mt-4 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              To deliver world-class immigration consulting services that enable organisations and professionals to establish, operate, and grow in Nigeria with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-grey-50 py-16 sm:py-24">
        <div className="container-prose">
          <Reveal>
            <SectionHeading eyebrow="Our Values" title="The principles that guide every engagement" />
          </Reveal>
          <Reveal delay={120}>
            <div className="mx-auto grid max-w-6xl divide-y divide-grey-200 overflow-hidden rounded-2xl border border-grey-200 bg-white sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
              {VALUES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-3 p-8 lg:p-10">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 shrink-0 text-accent" />
                    <h3 className="font-display text-base font-semibold text-grey-900">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-grey-700">{body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-prose">
          <Reveal>
            <SectionHeading
              eyebrow="Our Team"
              title="The people behind Consulat"
              intro="Headshots and full biographies will be added once provided by the client."
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {TEAM.map((member, i) => (
              <Reveal key={member.role} delay={i * 120}>
                <div className="rounded-2xl border border-grey-200 bg-white p-7">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
                    {member.name.charAt(1) || "?"}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-grey-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-grey-700">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grey-50 py-14 sm:py-20">
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
      </section>

      <CTABanner heading="Let's discuss how we can support your team in Nigeria" />
    </>
  );
}
