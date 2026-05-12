import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SERVICES, type ServiceSlug } from "@/lib/constants";

/**
 * Photographic image per service. Files live in public/services/.
 * Remove an entry here to fall back to the gradient placeholder.
 */
const SERVICE_IMAGES: Partial<Record<ServiceSlug, string>> = {
  "business-permit":  "/services/business-permit.jpg",
  "expatriate-quota": "/services/expatriate-quota.jpg",
  "e-cerpac":         "/services/e-cerpac.jpg",
  "e-visas":          "/services/e-visas.jpg",
};

type Props = {
  /**
   * The `top` offset (in rem) at which each card sticks. Only used when
   * `sticky` is true.
   */
  topOffsetRem?: number;
  /**
   * When `true` (default), each card lives in its own min-h-screen row on
   * lg+ and sticks at the same top offset — newer cards "replace" older
   * ones as the user scrolls.
   *
   * When `false`, the cards simply stack vertically and scroll naturally.
   */
  sticky?: boolean;
};

/**
 * Service cards. Two presentation modes:
 *   - `sticky` (default): replace-stack — each card sticks at the same top
 *     offset, the next card lifts up to cover the previous one.
 *   - flow (`sticky={false}`): plain vertical stack that scrolls normally.
 */
export function ServiceStack({ topOffsetRem = 6, sticky = true }: Props) {
  if (!sticky) {
    return (
      <div className="container-prose space-y-6 sm:space-y-8">
        {SERVICES.map((service) => (
          <ServiceStackCard key={service.slug} service={service} />
        ))}
      </div>
    );
  }

  return (
    <div className="container-prose">
      {SERVICES.map((service) => (
        <div key={service.slug} className="lg:min-h-screen lg:pb-16">
          <div
            className="mb-6 sm:mb-8 lg:sticky lg:mb-0"
            style={{ top: `calc(${topOffsetRem}rem)` }}
          >
            <ServiceStackCard service={service} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServiceStackCard({
  service,
}: {
  service: (typeof SERVICES)[number];
}) {
  const image = SERVICE_IMAGES[service.slug];

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-primary/10">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* Content side — each element fades/slides in with a small stagger */}
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-14">
          <Reveal>
            <h3 className="font-display text-2xl font-bold leading-tight text-grey-900 sm:text-3xl lg:text-4xl">
              {service.title}
            </h3>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-grey-700 sm:text-lg">{service.summary}</p>
          </Reveal>

          <Reveal delay={200}>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {service.covers.slice(0, 4).map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-grey-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={300}>
            <Link
              href={`/services/${service.slug}`}
              className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition hover:gap-2.5"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Image side — fills the right half edge-to-edge */}
        <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent lg:min-h-[460px]">
          {image ? (
            <Image
              src={image}
              alt={service.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <ServicePlaceholderVisual />
          )}
        </div>
      </div>
    </article>
  );
}

/** Minimal placeholder visual — only renders if a service has no image. */
function ServicePlaceholderVisual() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/15 blur-3xl"
      />
    </>
  );
}
