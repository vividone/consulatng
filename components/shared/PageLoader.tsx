"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Branded splash loader, shown once on first load.
 *
 * It used to re-arm on every pathname change. That added roughly 1.1s to
 * every in-site navigation on a statically generated, prefetched site where
 * the next page would otherwise paint more or less instantly — a deliberate
 * delay, dressed as a loading state. It now runs on mount only, so route
 * changes are as fast as the build makes them.
 *
 * Respects prefers-reduced-motion: still appears, but briefly and without
 * the pulse.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFor = reduced ? 200 : 700;
    const fadeFor = 400;

    const fadeId = window.setTimeout(() => setFading(true), showFor);
    const hideId = window.setTimeout(() => setVisible(false), showFor + fadeFor);

    return () => {
      window.clearTimeout(fadeId);
      window.clearTimeout(hideId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-primary-dark",
        "transition-opacity duration-500 ease-out",
        fading ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Subtle radial vignette for depth */}
      <div
        aria-hidden
        // `colors.primary-light` is not a valid theme path — the colour is
        // nested as primary.light — so Tailwind silently dropped this utility
        // and the vignette never rendered.
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary.light/0.35),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-5">
        <div className="logo-loader">
          <Image
            src="/brand/consulat-icon.png"
            alt=""
            width={100}
            height={100}
            priority
            className="h-16 w-16"
          />
        </div>
        <div className="loader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
