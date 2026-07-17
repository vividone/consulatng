import Link from "next/link";
import { ArrowRight, FileCheck2, IdCard, Plane, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlagMarquee } from "./FlagMarquee";
import { CountUpStat } from "./CountUpStat";
import { WorldMap } from "@/components/shared/WorldMap";
import { SITE, CALENDAR_URL } from "@/lib/constants";

const HERO_TITLE =
  "Your trusted partner for immigration & work permits in Nigeria";

/**
 * Hero entrance timing. All animations are CSS-driven.
 *  - The tagline eyebrow rises first.
 *  - The H1 reveals word-by-word with a stagger, then a continuous gradient
 *    shimmer flows across the heading.
 *  - Subtitle, CTAs and stats fade-up sequentially.
 */
const EYEBROW_DELAY_MS = 150;
const TITLE_BASE_DELAY_MS = 280;
const TITLE_STAGGER_MS = 80;
const SUBTITLE_DELAY_MS = 350;
const CTAS_DELAY_MS = 550;
const STATS_BASE_DELAY_MS = 800;

const HERO_TITLE_WORDS = HERO_TITLE.split(" ");
/**
 * Index AFTER which to force a line break. e.g. break after word index 3
 * ("for") splits the title into:
 *   "Your trusted partner for"
 *   "immigration & work permits in Nigeria"
 */
const HERO_BREAK_AFTER = 3;

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

      {/* Floating decorative chips */}
      {/* <FloatingChips /> */}

      {/* Hero copy — centered */}
      <div className="container-prose relative py-16 sm:py-18 lg:py-24 xl:py-35">
        <div className="mx-auto max-w-4xl text-center">
          {/* <p
            className="hero-rise mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent sm:mb-5 sm:text-sm"
            style={{ animationDelay: `${EYEBROW_DELAY_MS}ms` }}
          >
            {SITE.tagline}
          </p> */}
          {/* Animated H1: each word fades + rises with a stagger, and a
              continuous gradient shimmer flows across the heading. */}
          <h1 className="hero-title font-display text-[1.65rem] font-extrabold leading-[1.25] tracking-tight pb-2 sm:pb-3 sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="sr-only">{HERO_TITLE}</span>
            <span aria-hidden className="hero-title-words">
              {HERO_TITLE_WORDS.flatMap((word, i) => {
                const isLast = i === HERO_TITLE_WORDS.length - 1;
                const wordSpan = (
                  <span
                    key={`${word}-${i}`}
                    className="hero-word"
                    style={{
                      animationDelay: `${TITLE_BASE_DELAY_MS + i * TITLE_STAGGER_MS}ms`,
                    }}
                  >
                    {word}
                    {!isLast ? " " : ""}
                  </span>
                );
                if (i === HERO_BREAK_AFTER) {
                  return [wordSpan, <br key={`br-${i}`} aria-hidden />];
                }
                return [wordSpan];
              })}
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
            Nigeria&apos;s immigration ecosystem — from business permits to
            visa procurement.
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
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                Book a Consultation
              </a>
            </Button>
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-14 sm:gap-6 sm:pt-8">
            <CountUpStat target={500}   suffix="+" label="Permits issued"    delayMs={STATS_BASE_DELAY_MS} />
            <CountUpStat target={1200}  suffix="+" label="Visas processed"   delayMs={STATS_BASE_DELAY_MS + 120} />
            <CountUpStat target={30}    suffix="+" label="Countries served"  delayMs={STATS_BASE_DELAY_MS + 240} />
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
      label: "e-CERPAC",
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
