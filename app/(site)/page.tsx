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
import { getClientLogos, getTestimonials } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Consulat — Immigration & Work Permit Services in Nigeria",
  description:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and e-CERPAC services.",
  path: "/",
  keywords: [
    "immigration consulting Nigeria",
    "work permit Nigeria",
    "expatriate quota",
    "e-CERPAC Nigeria",
    "business permit Nigeria",
  ],
});

export default async function HomePage() {
  // Fetched in parallel: neither depends on the other, and a home-page
  // build should not pay for two sequential round trips.
  const [testimonials, clients] = await Promise.all([
    getTestimonials(),
    getClientLogos(),
  ]);

  return (
    <>
      <Hero />
      <WelcomeSection />
      <ServicesOverview />
      <TrustBar clients={clients} />
      <WhyConsulat />
      <HowItWorks />
      <Testimonials testimonials={testimonials} />
      <CTABanner />
    </>
  );
}
