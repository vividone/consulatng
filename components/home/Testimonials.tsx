"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "Consulat handled our entire team's e-CERPAC and quota renewals seamlessly. Their proactive monitoring meant we never had a single expiry surprise.",
    name: "Ajit",
    role: "Petroleum Engineer",
    country: "India",
    flag: "🇮🇳",
  },
  {
    quote:
      "When we expanded operations into Lagos, Consulat became our go-to immigration partner. The team is responsive, meticulous, and deeply knowledgeable.",
    name: "Yoann",
    role: "Operations Director Africa",
    country: "France",
    flag: "🇫🇷",
  },
  {
    quote:
      "From visa-on-arrival to long-term residence permits, Consulat has supported our entire expatriate workforce in Nigeria. We couldn't recommend them more.",
    name: "Sanne",
    role: "Agrifoods Strategist",
    country: "Netherlands",
    flag: "🇳🇱",
  },
  {
    quote:
      "Consulat is simply the most reliable immigration partner we've worked with in West Africa. Their team combines deep local expertise with a level of professionalism that builds long-term trust.",
    name: "David",
    role: "Legal Counsel",
    country: "Canada",
    flag: "🇨🇦",
  },
  {
    quote:
      "From our first work permit renewal to navigating the complexities of a Golden Visa, the Consulat team has been an invaluable guide. Highly recommended.",
    name: "Elena",
    role: "COO",
    country: "Italy",
    flag: "🇮🇹",
  },
];

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial]");
    const cardWidth = card?.offsetWidth ?? el.clientWidth * 0.8;
    const gap = 24;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  }, []);

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <section className="bg-grey-50 py-16 sm:py-24">
      <div className="container-prose">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Testimonials" title="What our clients say" />
            <div
              className={cn(
                "hidden shrink-0 gap-2 pb-1 sm:flex",
                !showArrows && "opacity-0"
              )}
              aria-hidden={!showArrows}
            >
              <ArrowButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
              />
              <ArrowButton
                direction="right"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            ref={scrollerRef}
            className="mt-10 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                data-testimonial
                className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-grey-200 bg-white p-8 shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Quote className="h-8 w-8 text-accent" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-grey-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-grey-200 pt-4">
                  <p className="font-display text-base font-bold text-grey-900">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-sm text-grey-500">
                    {t.role} · <span aria-hidden>{t.flag}</span> {t.country}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        {showArrows && (
          <div className="mt-6 flex justify-center gap-3 sm:hidden">
            <ArrowButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            />
            <ArrowButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const label =
    direction === "left" ? "Previous testimonial" : "Next testimonial";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 bg-white text-grey-700 shadow-sm transition",
        "hover:border-primary/30 hover:text-primary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-grey-200 disabled:hover:text-grey-700"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
