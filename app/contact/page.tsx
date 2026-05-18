import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Clock, Calendar } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/shared/ContactForm";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Contact Consulat — Book an Immigration Consultation",
  description:
    "Get in touch with Consulat for immigration consulting, visa services, and expatriate management in Lagos, Nigeria.",
  path: "/contact",
  keywords: ["contact consulat", "immigration consultant Lagos", "book consultation Nigeria"],
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Immigration Simplified"
        title="Get in Touch"
        subtitle="Whether you have a specific immigration need or want to discuss ongoing support, our team is ready to help."
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-grey-900">
              Contact Information
            </h2>
            <p className="mt-2 text-grey-700">
              Reach out by phone, WhatsApp, or email — we respond within 24 hours.
            </p>

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
                    {SITE.address.streetAddress}
                    <br />
                    {SITE.address.addressLocality}, Nigeria
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
                  <a href={SITE.phoneHref} className="mt-1 block text-grey-900 hover:text-accent">
                    {SITE.phone}
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
                    href={`mailto:${SITE.email}`}
                    className="mt-1 block text-grey-900 hover:text-accent"
                  >
                    {SITE.email}
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
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-grey-900 hover:text-accent"
                  >
                    {SITE.whatsapp} <span className="text-grey-500">· Click to chat</span>
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
                  <p className="mt-1 text-grey-900">{SITE.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-10 rounded-2xl border border-grey-200 bg-grey-50 p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                <Calendar className="h-4 w-4" /> Book a consultation
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-grey-900">
                Prefer to speak directly with a consultant?
              </h3>
              <p className="mt-2 text-sm text-grey-700">
                Schedule a 30-minute call at a time that works for you.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-4">
                <Link href="#calendly">Book a Call →</Link>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-grey-900">
              Send us an enquiry
            </h2>
            <p className="mt-2 text-grey-700">
              Fill in the form below and our team will reply within one business day.
            </p>
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
              Find Our Office
            </h2>
            <p className="mt-2 text-grey-700">
              Located in the heart of Lagos. Map placeholder — to be replaced with the confirmed office location.
            </p>
          </div>
          <div className="aspect-[16/7] w-full overflow-hidden rounded-2xl border border-grey-200 shadow-sm">
            <iframe
              title="Consulat office map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.34%2C6.42%2C3.42%2C6.48&layer=mapnik"
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
