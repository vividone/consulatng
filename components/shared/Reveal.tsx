"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Reveal direction. Defaults to "up" (slide up + fade). */
  direction?: Direction;
  /** Delay in ms before the reveal kicks in. */
  delay?: number;
  /** Threshold for intersection — 0 to 1. */
  threshold?: number;
  /** Only animate once. Default true. */
  once?: boolean;
};

const DIRECTION_HIDDEN: Record<Direction, string> = {
  up:    "translate-y-6",
  down:  "-translate-y-6",
  left:  "translate-x-6",
  right: "-translate-x-6",
  none:  "",
};

/**
 * Wraps its children with a scroll-triggered reveal animation.
 * No external dependencies — uses IntersectionObserver.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  threshold = 0.12,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation for reduced-motion users
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const id = window.setTimeout(() => setShown(true), delay);
          if (once) obs.disconnect();
          return () => window.clearTimeout(id);
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : cn("opacity-0", DIRECTION_HIDDEN[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}
