import Link from "next/link";
import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SITE, SERVICES } from "@/lib/constants";
import { Logo } from "./Logo";
import { WorldMap } from "@/components/shared/WorldMap";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-dark text-grey-200">
      {/* Decorative world map — fills the footer at very low opacity */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <WorldMap className="opacity-[0.06] mix-blend-screen" />
      </div>

      <div className="container-prose relative py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-6">
          <div className="lg:col-span-3 lg:pr-8">
            <Logo variant="light" className="h-14 w-auto" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-grey-300">
              Nigeria&apos;s specialist immigration consulting firm. We help multinationals, expatriates, and international businesses navigate Nigeria&apos;s immigration landscape with confidence.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={SITE.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/10 p-2 transition hover:border-white/40 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.twitter}
                aria-label="X / Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/10 p-2 transition hover:border-white/40 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/10 p-2 transition hover:border-white/40 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                // { href: "/", label: "Home" },
                // { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/blog", label: "Blog" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-grey-300 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-grey-300 transition hover:text-white"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-grey-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-grey-300 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {SITE.legalName} All rights reserved.</p>
          <p className="text-grey-300">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <span className="mx-2 text-grey-300">·</span>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
