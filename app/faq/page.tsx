import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { FAQS } from "@/lib/faqs";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "FAQs — Immigration & Work Permits in Nigeria — Consulat",
  description:
    "Answers to common questions about business permits, expatriate quotas, CERPAC, visas, and immigration compliance in Nigeria.",
  path: "/faq",
  keywords: ["Nigeria immigration FAQ", "work permit questions", "CERPAC FAQ"],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <PageHero
        eyebrow="Immigration Simplified"
        title="Frequently Asked Questions"
        subtitle="Answers to the most common questions about immigration, work permits, and residency in Nigeria."
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-3xl">
          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <CTABanner
        heading="Still have a question?"
        subtext="Reach out and our team will get back to you within 24 hours."
      />
    </>
  );
}
