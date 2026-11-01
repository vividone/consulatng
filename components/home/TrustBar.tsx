"use client";

import Image from "next/image";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import type { ClientLogoView } from "@/lib/content";


/**
 * Scrolling client logo marquee.
 *
 * WCAG 2.2.2 requires a pause mechanism for motion that runs longer than five
 * seconds, so the control below is a requirement rather than a nicety. Two
 * further details follow from it:
 *
 *  - `motion-reduce:animate-none` stops the scroll outright for users who have
 *    asked for less motion, without waiting for them to find the button.
 *  - When the animation is off, the track is wider than the viewport, so the
 *    overflow has to become scrollable or those users simply never see the
 *    logos past the fold. Hence `motion-reduce:overflow-x-auto` on the mask.
 */
export function TrustBar({ clients }: { clients: ClientLogoView[] }) {
  const [paused, setPaused] = useState(false);
  const loop = [...clients, ...clients];

  return (
    <section className="border-y border-grey-200 bg-grey-50 py-10 sm:py-12">
      <div className="container-prose">
        <div className="flex items-center justify-center gap-3">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-grey-500 sm:text-sm">
            Trusted by Leading Organisations Across the Globe
          </p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={
              paused ? "Resume scrolling logos" : "Pause scrolling logos"
            }
            className="shrink-0 rounded-full border border-grey-200 bg-white p-1.5 text-grey-500 transition hover:border-grey-300 hover:text-grey-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hidden"
          >
            {paused ? (
              <Play className="h-3 w-3" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>
        </div>

        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] motion-reduce:overflow-x-auto sm:mt-8">
          <ul
            className="flex w-max animate-scroll-x items-center gap-10 motion-reduce:animate-none sm:gap-14"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {loop.map((client, i) => (
              <li
                key={`${client.name}-${i}`}
                className="flex h-10 shrink-0 items-center sm:h-12"
                // The track is duplicated to loop seamlessly. Only the first
                // copy should be announced; the second is the same logos again.
                aria-hidden={i >= clients.length}
              >
                <Image
                  src={client.image.url}
                  alt={client.name}
                  width={client.image.width}
                  height={client.image.height}
                  className="h-full w-auto object-contain opacity-60 transition duration-300 hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
