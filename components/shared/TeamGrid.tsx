"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  bio: string | string[];
};

type Props = { members: TeamMember[] };

export function TeamGrid({ members }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? members[openIndex] : null;

  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const bioParas = active
    ? Array.isArray(active.bio)
      ? active.bio
      : [active.bio]
    : [];

  const placementFor = (i: number, total: number) => {
    // 12-col grid. Top row 3 cards (col-span-4 on sm+); bottom row 2 cards centered.
    // On mobile, 2 cards per row (col-span-6) with the lone trailing card centered.
    if (total !== 5) return "col-span-6 sm:col-span-4";
    if (i === 3) return "col-span-6 sm:col-span-4 sm:col-start-3";
    if (i === 4) return "col-span-6 col-start-4 sm:col-span-4 sm:col-start-7";
    return "col-span-6 sm:col-span-4";
  };

  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4 sm:gap-5">
        {members.map((m, i) => (
          <Reveal
            key={`${m.name}-${m.role}`}
            delay={i * 80}
            className={placementFor(i, members.length)}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Read Bio for ${m.name}, ${m.role}`}
              className="group block h-full w-full overflow-hidden rounded-xl border border-grey-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-grey-100">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 896px) 33vw, 288px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
                      {m.name.replace(/[^A-Za-z]/g, "").charAt(0) || "?"}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 py-3 sm:px-4">
                <h3 className="font-display text-sm font-bold text-grey-900 sm:text-base">
                  {m.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-accent sm:text-sm">{m.role}</p>
                <p className="mt-2 text-xs font-semibold text-grey-500 transition-colors group-hover:text-primary">
                  Read Bio →
                </p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50",
          active ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!active}
      >
        <button
          type="button"
          aria-label="Close bio"
          tabIndex={active ? 0 : -1}
          onClick={() => setOpenIndex(null)}
          className={cn(
            "absolute inset-0 bg-grey-900/50 backdrop-blur-[2px] transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={active ? `${active.name} bio` : undefined}
          className={cn(
            "absolute bottom-0 left-0 right-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out",
            "sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-2xl",
            active
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          )}
        >
          {active && (
            <>
              <div className="flex items-center justify-between border-b border-grey-200 px-5 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Team Profile
                </p>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  aria-label="Close"
                  className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition hover:bg-grey-100 hover:text-grey-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pb-8 pt-5 sm:px-6">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-grey-100 sm:h-32 sm:w-32 sm:rounded-2xl">
                    {active.image ? (
                      <Image
                        src={active.image}
                        alt={active.name}
                        fill
                        sizes="(max-width: 640px) 80px, 128px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 font-display text-2xl font-bold text-primary">
                        {active.name.replace(/[^A-Za-z]/g, "").charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-grey-900 sm:text-2xl">
                      {active.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">{active.role}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-grey-700 sm:text-[15px]">
                  {bioParas.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
