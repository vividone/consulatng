import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock, Calendar } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/shared/ContactForm";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getContactPage, getSiteSettings, whatsapp } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPage();
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: "/contact",
    keywords: (content.keywords ?? []).map((k) => k.keyword),
  });
}

export default async function ContactPage() {
  const [content, settings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);
  const wa = whatsapp(settings);

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-grey-900">
              {content.infoHeading}
            </h2>
            <p className="mt-2 text-grey-700">{content.infoIntro}</p>

            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-grey-500">
                    Office Address
                  </p>
                  <p className="mt-1 text-grey-900">
                    {settings.streetAddress}
                    <br />
                    {settings.addressLocality}, Nigeria
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-grey-500">
                    Phone
                  </p>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="mt-1 block text-grey-900 hover:text-accent">
                    {settings.phone}
                  </a>
                  <a href={`tel:${(settings.phoneSecondary ?? "").replace(/\s/g, "")}`} className="mt-1 block text-grey-900 hover:text-accent">
                    {settings.phoneSecondary}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-grey-500">
                    Email
                  </p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block text-grey-900 hover:text-accent"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-grey-500">
                    WhatsApp
                  </p>
                  <a
                    href={wa.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-grey-900 hover:text-accent"
                  >
                    {wa.display} <span className="text-grey-500">· Click to chat</span>
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-grey-500">
                    Office Hours
                  </p>
                  <p className="mt-1 text-grey-900">{settings.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-10 rounded-2xl border border-grey-200 bg-grey-50 p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                <Calendar className="h-4 w-4" /> {content.bookingEyebrow}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-grey-900">
                {content.bookingHeading}
              </h3>
              <p className="mt-2 text-sm text-grey-700">{content.bookingBody}</p>
              <Button asChild variant="secondary" size="sm" className="mt-4">
                <a href={settings.calendarUrl} target="_blank" rel="noopener noreferrer">
                  {content.bookingButtonLabel}
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-grey-900">
              {content.formHeading}
            </h2>
            <p className="mt-2 text-grey-700">{content.formIntro}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-grey-200 bg-grey-50 py-14 sm:py-20">
        <div className="container-prose">
          <div className="mb-6 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-grey-900">
              {content.mapHeading}
            </h2>
            <p className="mt-2 text-grey-700">{content.mapIntro}</p>
          </div>
          <div className="aspect-[16/7] w-full overflow-hidden rounded-2xl border border-grey-200 shadow-sm">
            <iframe
              title="Consulat office map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${settings.streetAddress}, ${settings.addressLocality}, ${settings.addressRegion}, Nigeria`
              )}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
