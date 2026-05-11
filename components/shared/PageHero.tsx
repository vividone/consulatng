import { cn } from "@/lib/utils";
import { WorldMap } from "./WorldMap";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHero({ eyebrow, title, subtitle, className }: Props) {
  return (
    <section className={cn("relative overflow-hidden bg-primary-dark text-white", className)}>
      {/* Base gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-95"
      />
      {/* World map silhouette — matches the homepage hero treatment */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <WorldMap className="opacity-[0.10] mix-blend-screen" />
      </div>
      {/* Subtle dot pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container-prose relative py-20 sm:py-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ice sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
