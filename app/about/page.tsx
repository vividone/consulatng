import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { BridgeSlider } from "@/components/shared/BridgeSlider";
import { CTABanner } from "@/components/home/CTABanner";
import { TeamGrid, type TeamMember } from "@/components/shared/TeamGrid";
import { buildMetadata } from "@/lib/metadata";
import { getBridgeImages } from "@/lib/bridges";
import { ShieldCheck, Sparkles, Clock, Handshake } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About Consulat — Nigeria's Immigration Consulting Experts",
  description:
    "Learn about Consulat's team, mission, and expertise in Nigerian immigration services for international businesses.",
  path: "/about",
  keywords: ["about consulat", "immigration consultants Nigeria"],
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

const TEAM: TeamMember[] = [
  {
    name: "Michael Odibeli",
    role: "Non-Executive Director",
    image: "/team/michael-odibeli.jpg",
    bio: [
      "Michael Odibeli is a seasoned legal and governance professional with over three decades of experience spanning corporate law, regulatory compliance, Board-level advisory, business planning, integration and strategic implementation.",
      "A Barrister-at-Law with LLB and LLM qualifications, he brings a multidisciplinary background combining legal expertise, operational oversight, and strategic governance. He is currently a Partner at CREED & Company, where he leads Corporate, Immigration and Compliance services. His involvement in hundreds of expatriate and local personnel mobilisations and crew changes for Oil & Gas, Engineering and Maritime Service companies is worthy of note: NLNG Train II, Mobil TMSA, Total Energies OFON, AKPO and EGINA projects offshore, LADOL, Bonny Island and Onne locations to name a few.",
      "Michael brings his wealth of experience to serve as Non-Executive Director at Consulat Ltd.",
    ],
  },
  {
    name: "Lynn Odibeli",
    role: "Director, Business Development",
    image: "/team/lynn-odibeli.jpg",
    bio: "With over 20 years of experience in banking, credit management, and business development, Lynn specialises in market expansion and commercial partnerships. She has a proven track record in credit risk management, strategic negotiation, and driving revenue growth in competitive markets during a banking career as Assistant Bank Manager and Branch Head. Lynn holds a B.Sc. in Applied Biology and a Certification in Entrepreneurial Management from Lagos Business School's Enterprise arm. As Director, Business Development, she is recognised for her strategic oversight, disciplined decision-making, and board-level contributions to sustainable growth.",
  },
  {
    name: "Fezi Eniekebi",
    role: "Logistics & Government Relations",
    image: "/team/fezi-eniekebi.jpg",
    bio: "Fezi is a results-driven Logistics and Government Relations Specialist with a proven track record of streamlining supply chain operations while fostering productive relationships with government agencies and regulatory bodies. A skilled navigator of complex compliance matters, he coordinates cross-border logistics on very challenging timelines and has built relationships with strategic stakeholders to ensure smooth business operations and regulatory alignment. He graduated with honours from the Rivers State University of Technology, Port Harcourt, and anchors the entire South-East business activities.",
  },
  {
    name: "Emmanuella Edoho",
    role: "Operations Officer",
    image: "/team/emmanuella-edoho.jpg",
    bio: "Emmanuella Edoho is an operations and administrative professional with experience supporting organisational efficiency, executive coordination, and customer relationship management. She has worked across business operations, education administration, and executive support roles, where she has developed strong skills in process management, stakeholder communication, and workflow optimisation. Emmanuella is passionate about delivering organised, client-focused solutions that improve productivity and service delivery.",
  },
  {
    name: "Faith Bassey",
    role: "Business Officer",
    image: "/team/faith-bassey.jpg",
    bio: "Faith brings experience in customer relationship management and virtual assistance, with a strong focus on client communication, documentation, and administrative support. She has developed a solid background in managing client interactions, maintaining accurate records, and supporting efficient business operations. She continues to build her expertise in business support and service coordination, and is committed to delivering organised, reliable, and detail-oriented support across all assigned responsibilities.",
  },
];

export default function AboutPage() {
  const bridgeImages = getBridgeImages();

  return (
    <>
      <PageHero
        eyebrow="Immigration Simplified"
        title="About Consulat"
        subtitle="Nigeria's Specialist Immigration Consulting Firm — Trusted by Multinationals, NGOs, and Growing Businesses Worldwide."
      />
      <BridgeSlider
        images={bridgeImages}
        overlayHeading="Bridging the world to Nigeria"
        overlayText="From every continent to Nigeria — we connect global businesses and professionals to opportunity in Nigeria."
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
              Our clients include blue chip companies, international NGOs, fast-growing startups, and individual professionals across Europe, Asia, the Americas, and Africa. Regardless of size, every client receives the same standard of care: proactive communication, meticulous documentation, and full compliance assurance.
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
              intro="Meet the people delivering Consulat&rsquo;s standards of service."
            />
          </Reveal>
          <TeamGrid members={TEAM} />
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

      <CTABanner heading="Let's discuss how we can support your team in Nigeria" />
    </>
  );
}
