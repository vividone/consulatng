import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { adjacentServices, type ServiceSummary } from "@/lib/content";

type Props = {
  services: ServiceSummary[];
  currentSlug: string;
};

/**
 * Previous / next service navigation — wraps around at the ends so the
 * pair is always shown. Sits between the page content and the closing CTA.
 */
export function ServiceNav({ services, currentSlug }: Props) {
  const adjacent = adjacentServices(services, currentSlug);
  if (!adjacent) return null;

  const { prev, next } = adjacent;

  return (
    <section className="border-y border-grey-200 bg-white py-14 sm:py-20">
      <div className="container-prose">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-grey-500 sm:mb-8">
          Continue exploring
        </p>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <Link
            href={`/services/${prev.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg sm:p-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-grey-700 transition group-hover:bg-accent group-hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                Previous Service
              </p>
              <p className="mt-1 font-display text-lg font-bold leading-tight text-grey-900 group-hover:text-accent">
                {prev.shortTitle}
              </p>
            </div>
          </Link>

          <Link
            href={`/services/${next.slug}`}
            className="group flex items-center justify-end gap-4 rounded-2xl border border-grey-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg sm:p-7"
          >
            <div className="min-w-0 text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-grey-500">
                Next Service
              </p>
              <p className="mt-1 font-display text-lg font-bold leading-tight text-grey-900 group-hover:text-accent">
                {next.shortTitle}
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-grey-700 transition group-hover:bg-accent group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
