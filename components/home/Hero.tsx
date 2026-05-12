import Link from "next/link";
import { ArrowRight, FileCheck2, IdCard, Plane, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlagMarquee } from "./FlagMarquee";
import { WorldMap } from "@/components/shared/WorldMap";

const HERO_TITLE =
  "Your trusted partner for immigration & work permits in Nigeria";

/**
 * Hero entrance timing. All animations are CSS-driven.
 *  - The H1 uses the magnifier effect (continuous, auto-roam) — no entrance,
 *    just settles into place once visible.
 *  - Subtitle, CTAs and stats fade-up sequentially.
 */
const SUBTITLE_DELAY_MS = 350;
const CTAS_DELAY_MS = 550;
const STATS_BASE_DELAY_MS = 800;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-dark text-white">
      {/* Base gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light"
      />

      {/* Spotlight wash — single sweep on load */}
      <div
        aria-hidden
        className="hero-spotlight pointer-events-none absolute inset-0"
      />

      {/* Drifting blob orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hero-blob hero-blob-1 left-[-10%] top-[-20%] h-[520px] w-[520px] bg-accent/40" />
        <div className="hero-blob hero-blob-2 right-[-10%] top-[10%] h-[480px] w-[480px] bg-primary-light/60" />
        <div className="hero-blob hero-blob-3 bottom-[-25%] left-1/3 h-[560px] w-[560px] bg-[#60A5FA]/25" />
      </div>

      {/* World map silhouette — fades in slowly behind everything */}
      <div
        aria-hidden
        className="hero-bg-in pointer-events-none absolute inset-0"
        style={{ ["--hero-bg-target" as string]: "1" }}
      >
        <WorldMap priority className="opacity-[0.12] mix-blend-screen" />
      </div>

      {/* Subtle drifting dot grid */}
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Flowing topographic line accent */}
      <svg
        aria-hidden
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="hero-flow pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" x2="1">
            <stop offset="0%"  stopColor="#60A5FA" stopOpacity="0" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M -100 ${320 + i * 50} C 360 ${260 + i * 40}, 720 ${380 + i * 40}, 1080 ${300 + i * 40} S 1540 ${360 + i * 30}, 1640 ${320 + i * 40}`}
            fill="none"
            stroke="url(#flowGrad)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Floating decorative chips */}
      <FloatingChips />

      {/* Hero copy — centered */}
      <div className="container-prose relative py-16 sm:py-24 lg:py-32 xl:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Magnifier H1: dim base text + bright gradient text revealed only
              inside a circular mask that roams across the heading. */}
          <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="magnifier-h1">
              <span className="sr-only">{HERO_TITLE}</span>
              <span aria-hidden className="magnifier-base">
                {HERO_TITLE}
              </span>
              <span aria-hidden className="magnifier-bright">
                {HERO_TITLE}
              </span>
              <span aria-hidden className="magnifier-lens hidden md:block" />
            </span>
          </h1>

          {/* Subtitle — tightened to fit ≤ 3 lines on phones */}
          <p
            className="hero-rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg md:text-xl"
            style={{
              animationDelay: `${SUBTITLE_DELAY_MS}ms`,
              textWrap: "balance",
            }}
          >
            Helping multinationals, investors, and professionals navigate
            Nigeria&apos;s immigration system — from business permits to visa
            procurement.
          </p>

          <div
            className="hero-rise mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: `${CTAS_DELAY_MS}ms` }}
          >
            <Button asChild size="lg">
              <Link href="/services">
                Explore Our Services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="white" size="lg">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-14 sm:gap-6 sm:pt-8">
            <Stat value="500+" label="Permits filed"   delayMs={STATS_BASE_DELAY_MS} />
            <Stat value="30+"  label="Countries served" delayMs={STATS_BASE_DELAY_MS + 120} />
            <Stat value="24h"  label="Response time"   delayMs={STATS_BASE_DELAY_MS + 240} />
          </dl>
        </div>
      </div>

      {/* Flag marquee — bottom border of hero */}
      <div className="relative">
        <FlagMarquee />
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  delayMs,
}: {
  value: string;
  label: string;
  delayMs: number;
}) {
  return (
    <div className="hero-rise" style={{ animationDelay: `${delayMs}ms` }}>
      <dt className="font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
        {value}
      </dt>
      <dd className="mt-1 text-[10px] uppercase tracking-wider text-white/60 sm:text-xs">
        {label}
      </dd>
    </div>
  );
}

/** Subtle floating icon "chips" — visual depth, hidden on small screens. */
function FloatingChips() {
  const chips: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    className: string;
    floatClass: string;
  }> = [
    {
      icon: Plane,
      label: "e-Visa",
      className: "left-[6%] top-[18%]",
      floatClass: "hero-chip-float-1",
    },
    {
      icon: IdCard,
      label: "CERPAC",
      className: "right-[8%] top-[14%]",
      floatClass: "hero-chip-float-2",
    },
    {
      icon: Stamp,
      label: "Approved",
      className: "left-[10%] bottom-[22%]",
      floatClass: "hero-chip-float-3",
    },
    {
      icon: FileCheck2,
      label: "Work Permit",
      className: "right-[6%] bottom-[26%]",
      floatClass: "hero-chip-float-4",
    },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {chips.map((chip) => {
        const Icon = chip.icon;
        return (
          <div
            key={chip.label}
            className={`hero-chip ${chip.floatClass} ${chip.className}`}
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 shadow-xl backdrop-blur-md">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/30 text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-white">{chip.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
