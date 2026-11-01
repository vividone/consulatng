import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlagMarquee } from "./FlagMarquee";
import { CountUpStat } from "./CountUpStat";
import { WorldMap } from "@/components/shared/WorldMap";
import { getSiteSettings } from "@/lib/content";
import type { HomePage } from "@/cms/payload-types";

/**
 * Hero entrance timing. All animations are CSS-driven.
 *  - The H1 reveals word-by-word with a stagger, then a continuous gradient
 *    shimmer flows across the heading.
 *  - Subtitle, CTAs and stats fade-up sequentially.
 */
const TITLE_BASE_DELAY_MS = 280;
const TITLE_STAGGER_MS = 80;
const SUBTITLE_DELAY_MS = 350;
const CTAS_DELAY_MS = 550;
const STATS_BASE_DELAY_MS = 800;

/**
 * Index AFTER which to force a line break. e.g. break after word index 3
 * ("for") splits the title into:
 *   "Your trusted partner for"
 *   "immigration & work permits in Nigeria"
 *
 * Fixed rather than CMS-managed: it is a typographic detail of this one
 * layout, and the heading reflows sensibly without it on every width.
 */
const HERO_BREAK_AFTER = 3;

export async function Hero({ content }: { content: HomePage }) {
  const settings = await getSiteSettings();
  const heroTitle = content.heroTitle;
  const heroTitleWords = heroTitle.split(" ");
  const stats = content.stats ?? [];

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

      {/* Hero copy — centered */}
      <div className="container-prose relative py-16 sm:py-18 lg:py-24 xl:py-35">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated H1: each word fades + rises with a stagger, and a
              continuous gradient shimmer flows across the heading. */}
          <h1 className="hero-title font-display text-[1.65rem] font-extrabold leading-[1.25] tracking-tight pb-2 sm:pb-3 sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="sr-only">{heroTitle}</span>
            <span aria-hidden className="hero-title-words">
              {heroTitleWords.flatMap((word, i) => {
                const isLast = i === heroTitleWords.length - 1;
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
            {content.heroSubtitle}
          </p>

          <div
            className="hero-rise mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: `${CTAS_DELAY_MS}ms` }}
          >
            <Button asChild size="lg">
              <Link href="/services">
                {content.heroPrimaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="white" size="lg">
              <a href={settings.calendarUrl} target="_blank" rel="noopener noreferrer">
                {content.heroSecondaryCta}
              </a>
            </Button>
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-14 sm:gap-6 sm:pt-8">
            {stats.map((stat, i) => (
              <CountUpStat
                key={stat.id ?? stat.label}
                target={stat.value}
                suffix={stat.suffix ?? ""}
                label={stat.label}
                delayMs={STATS_BASE_DELAY_MS + i * 120}
              />
            ))}
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
