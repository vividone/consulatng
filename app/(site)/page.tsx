import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyConsulat } from "@/components/home/WhyConsulat";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { CTABanner } from "@/components/home/CTABanner";
import { buildMetadata } from "@/lib/metadata";
import { getClientLogos, getHomePage, getTestimonials } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePage();
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: "/",
    keywords: (content.keywords ?? []).map((k) => k.keyword),
  });
}

export default async function HomePage() {
  // Fetched in parallel: neither depends on the other, and a home-page
  // build should not pay for two sequential round trips.
  const [content, testimonials, clients] = await Promise.all([
    getHomePage(),
    getTestimonials(),
    getClientLogos(),
  ]);

  return (
    <>
      <Hero content={content} />
      <WelcomeSection content={content} />
      <ServicesOverview content={content} />
      <TrustBar clients={clients} heading={content.trustBarHeading} />
      <WhyConsulat content={content} />
      <HowItWorks content={content} />
      <Testimonials testimonials={testimonials} />
      <CTABanner />
    </>
  );
}
