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

export const metadata: Metadata = buildMetadata({
  title: "Consulat — Immigration & Work Permit Services in Nigeria",
  description:
    "Expert immigration consulting for multinationals and expatriates in Nigeria. Business permits, expatriate quotas, visas, and CERPAC services.",
  path: "/",
  keywords: [
    "immigration consulting Nigeria",
    "work permit Nigeria",
    "expatriate quota",
    "CERPAC Nigeria",
    "business permit Nigeria",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <WelcomeSection />
      <ServicesOverview />
      <TrustBar />
      <WhyConsulat />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  );
}
