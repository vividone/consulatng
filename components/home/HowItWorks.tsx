import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import type { HomePage } from "@/cms/payload-types";


export function HowItWorks({ content }: { content: HomePage }) {
  const steps = content.steps ?? [];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            eyebrow={content.processEyebrow}
            title={content.processTitle}
          />
        </Reveal>
        <div className="grid gap-8 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.id ?? step.title} delay={i * 100}>
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
                {i < steps.length - 1 && (
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
