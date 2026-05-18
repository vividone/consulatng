"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  /** Static suffix appended after the number (e.g. "+"). Doesn't animate. */
  suffix?: string;
  label: string;
  /** Matches the existing hero-rise stagger pattern. */
  delayMs?: number;
  /** Total duration of the count-up animation. */
  durationMs?: number;
};

const formatter = new Intl.NumberFormat("en-NG");
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Hero stat with a count-up animation that fires once when the element
 * enters the viewport. SSR renders the final value (so SEO/social previews
 * and reduced-motion users see the real number immediately), and the
 * animation only kicks in after hydration on client-side viewport entry.
 */
export function CountUpStat({
  target,
  suffix = "",
  label,
  delayMs = 0,
  durationMs = 1600,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // SSR + first render: emit the final value so crawlers see it.
  // Hydrated client: useEffect resets to 0 and animates up.
  const [value, setValue] = useState(target);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    // Reset to 0 before observing so we don't flash the final value first.
    setValue(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now() + delayMs;
        const tick = (now: number) => {
          if (now < start) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          const elapsed = now - start;
          const t = Math.min(1, elapsed / durationMs);
          const current = Math.round(easeOutCubic(t) * target);
          setValue(current);
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [hydrated, target, delayMs, durationMs]);

  return (
    <div ref={ref} className="hero-rise" style={{ animationDelay: `${delayMs}ms` }}>
      <dt className="font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
        <span>{formatter.format(value)}</span>
        {suffix && <span>{suffix}</span>}
      </dt>
      <dd className="mt-1 text-[10px] uppercase tracking-wider text-white/60 sm:text-xs">
        {label}
      </dd>
    </div>
  );
}
