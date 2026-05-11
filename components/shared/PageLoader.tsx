"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Branded splash loader.
 *
 * - Shows on initial mount and animates out after ~900ms
 * - Re-triggers briefly on pathname changes so navigation feels considered
 * - Respects prefers-reduced-motion (still appears, but no animation)
 */
export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Each pathname change re-arms the loader briefly
    setVisible(true);
    setFading(false);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFor = reduced ? 200 : 700;
    const fadeFor = 400;

    const fadeId = window.setTimeout(() => setFading(true), showFor);
    const hideId = window.setTimeout(() => setVisible(false), showFor + fadeFor);

    return () => {
      window.clearTimeout(fadeId);
      window.clearTimeout(hideId);
    };
  }, [pathname]);

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary-light/0.35),transparent_70%)]"
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
