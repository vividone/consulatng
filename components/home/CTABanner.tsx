import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettings } from "@/lib/content";

type CTABannerProps = {
  /**
   * Overrides the shared copy for a page that needs its own wording.
   * Left unset, the banner uses the text in Site Settings, which is what
   * the home page and the services index both show.
   */
  heading?: string;
  subtext?: string;
};

export async function CTABanner({ heading, subtext }: CTABannerProps) {
  const settings = await getSiteSettings();
  const title = heading ?? settings.ctaHeading;
  const body = subtext ?? settings.ctaBody;

  return (
    <section className="bg-primary-dark text-white">
      <div className="container-prose flex flex-col items-start gap-8 py-14 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold leading-tight text-ice sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-md text-white/80">{body}</p>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Button asChild size="lg">
            <a href={settings.calendarUrl} target="_blank" rel="noopener noreferrer">
              {settings.ctaButtonLabel}
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
