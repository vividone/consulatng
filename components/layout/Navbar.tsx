"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, FileText, IdCard, Plane, Users } from "lucide-react";
import { NAV_LINKS, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";

const SERVICE_ICONS = {
  "business-permit":  FileText,
  "expatriate-quota": Users,
  "e-cerpac":         IdCard,
  "e-visas":          Plane,
} as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "shadow-md" : "shadow-none border-b border-grey-100"
      )}
    >
      <div className="container-prose flex h-20 items-center justify-between md:h-24">
        {/* LEFT — logo */}
        <Link href="/" aria-label="Consulat home" className="flex items-center">
          <Logo />
        </Link>

        {/* RIGHT — nav links + CTA, grouped together */}
        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              if ("children" in link && link.children) {
                return (
                  <div key={link.href} className="group relative">
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex items-center gap-1 text-[15px] font-medium transition",
                        isActive ? "text-accent" : "text-grey-700 hover:text-accent"
                      )}
                    >
                      {link.label}
                      <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                    </Link>

                    <ServicesMegaMenu />
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[15px] font-medium transition",
                    isActive ? "text-accent" : "text-grey-700 hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button asChild size="sm">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/**
 * Mega menu for Services — wide 2-column panel centered under the trigger.
 * Visible while the parent .group is hovered (CSS-only).
 */
function ServicesMegaMenu() {
  return (
    <div
      className="invisible absolute left-1/2 top-full z-50 w-[880px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100"
      role="region"
      aria-label="Services menu"
    >
      <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-2xl">
        <div className="grid grid-cols-[1fr_1px_1fr]">
          {/* left column */}
          <ul className="p-5">
            {SERVICES.slice(0, 2).map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
          {/* divider */}
          <div className="bg-grey-100" />
          {/* right column */}
          <ul className="p-5">
            {SERVICES.slice(2, 4).map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-grey-200 bg-grey-50 px-7 py-4">
          <p className="text-sm text-grey-500">
            End-to-end immigration support, tailored to your business.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[number];
}) {
  const Icon = SERVICE_ICONS[service.slug as keyof typeof SERVICE_ICONS];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group/card flex gap-4 rounded-xl p-4 transition hover:bg-grey-50"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition group-hover/card:bg-accent group-hover/card:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[15px] font-semibold text-grey-900 group-hover/card:text-accent">
          {service.shortTitle}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-grey-500">
          {service.summary}
        </p>
      </div>
    </Link>
  );
}
