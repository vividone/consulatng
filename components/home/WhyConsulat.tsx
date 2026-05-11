import { Globe2, ClipboardCheck, BellRing, UserRoundCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const PILLARS = [
  {
    icon: Globe2,
    title: "Local Expertise, Global Standards",
    body: "Deep knowledge of Nigeria Immigration Service (NIS) processes, combined with a service delivery standard that meets international corporate expectations.",
  },
  {
    icon: ClipboardCheck,
    title: "End-to-End Management",
    body: "We handle everything — from initial application through to approval, compliance monitoring, and renewals — so your team can focus on business, not paperwork.",
  },
  {
    icon: BellRing,
    title: "Proactive Compliance",
    body: "Our monitoring systems track permit expiry dates, monthly filing obligations, and regulatory changes, keeping your organisation ahead of compliance deadlines.",
  },
  {
    icon: UserRoundCheck,
    title: "Dedicated Account Management",
    body: "Every client is assigned a dedicated account manager who serves as your single point of contact for all immigration matters in Nigeria.",
  },
];

export function WhyConsulat() {
  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            eyebrow="Why Consulat"
            title="Why organisations choose Consulat"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto grid max-w-6xl divide-y divide-grey-200 overflow-hidden rounded-2xl border border-grey-200 bg-white sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
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
  );
}
