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
import { getFaqPage, getFaqs } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getFaqPage();
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: "/faq",
    keywords: (content.keywords ?? []).map((k) => k.keyword),
  });
}

export default async function FAQPage() {
  const [content, faqs] = await Promise.all([getFaqPage(), getFaqs()]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-3xl">
          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.id} value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <CTABanner heading={content.ctaHeading} subtext={content.ctaBody} />
    </>
  );
}
