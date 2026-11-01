import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettings } from "@/lib/content";

type CTABannerProps = {
  heading?: string;
  subtext?: string;
};

export async function CTABanner({
  heading = "Ready to simplify your immigration process in Nigeria?",
  subtext = "Speak with our team to discuss your requirements. \n We respond within 24 hours.",
}: CTABannerProps) {
  const settings = await getSiteSettings();

  return (
    <section className="bg-primary-dark text-white">
      <div className="container-prose flex flex-col items-start gap-8 py-14 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold leading-tight text-ice sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-md text-white/80">{subtext}</p>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Button asChild size="lg">
            <a href={settings.calendarUrl} target="_blank" rel="noopener noreferrer">
              Book a Free Consultation
            </a>
          </Button>
          <Button asChild variant="white" size="lg">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
