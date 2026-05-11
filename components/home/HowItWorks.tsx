import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const STEPS = [
  {
    title: "Consultation",
    body: "We begin with a detailed assessment of your business and immigration needs, mapping the right permits, visas, and compliance requirements.",
  },
  {
    title: "Documentation",
    body: "Our team prepares and reviews all required documentation, ensuring every application is accurate and complete before submission.",
  },
  {
    title: "Submission & Follow-Up",
    body: "We submit applications directly to the relevant authorities and actively follow up to ensure timely processing.",
  },
  {
    title: "Approval & Ongoing Support",
    body: "Once approved, we help with onboarding, compliance setup, and ongoing monitoring — including expiry tracking and monthly returns.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <SectionHeading eyebrow="Our Process" title="How we work" />
        </Reveal>
        <div className="grid gap-8 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white shadow-md">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-grey-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-grey-700">
                  {step.body}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-grey-200 lg:block"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
