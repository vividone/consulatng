"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  /** Auto-advance interval in ms. Set to 0 to disable auto-play. */
  intervalMs?: number;
  /** Headline overlaid on the slider. */
  overlayHeading?: string;
  /** Sub-line below the headline. */
  overlayText?: string;
};

/**
 * Auto-rotating image slider with crossfade transitions and an overlay caption.
 * - Pauses on hover, respects prefers-reduced-motion (only first image shown)
 * - Indicator dots are clickable to jump to a specific slide
 * - Mounted with -mt-* so it overlaps the bottom of the dark PageHero above,
 *   matching the ServiceBanner pattern used on the services pages.
 */
export function BridgeSlider({
  images,
  intervalMs = 5500,
  overlayHeading,
  overlayText,
}: Props) {
  const [active, setActive] = useState(0);

  // Auto-rotate continuously. The only reason it would stop is if the user
  // has prefers-reduced-motion enabled (accessibility) or the consumer
  // explicitly sets intervalMs={0}.
  useEffect(() => {
    if (images.length <= 1 || intervalMs === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className="relative -mt-10 sm:-mt-16 lg:-mt-20">
      <div className="container-prose">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl shadow-primary/30 ring-1 ring-white/10 sm:aspect-[16/7]">
          {/* Crossfading images */}
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 1280px"
              className={cn(
                "object-cover transition-opacity duration-1000 ease-out",
                i === active ? "opacity-100" : "opacity-0"
              )}
            />
          ))}

          {/* Legibility gradient for the overlay text */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/30"
          />

          {/* Overlay caption */}
          {(overlayHeading || overlayText) && (
            <div className="absolute inset-0 flex items-end p-6 sm:p-10 lg:p-14">
              <div className="max-w-2xl text-white">
                {overlayHeading && (
                  <h2 className="font-display text-2xl font-bold leading-tight drop-shadow-md sm:text-3xl lg:text-5xl">
                    {overlayHeading}
                  </h2>
                )}
                {overlayText && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 drop-shadow sm:text-base lg:text-lg">
                    {overlayText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Image count + active indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
              <span className="rounded-full bg-black/40 px-2.5 py-1 font-display text-xs font-semibold text-white backdrop-blur-sm">
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === active
                        ? "w-8 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
