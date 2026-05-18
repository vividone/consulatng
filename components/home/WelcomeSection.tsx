import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { SITE } from "@/lib/constants";

/**
 * "Welcome to Consulat" — a calm 2-column section that bridges the Hero
 * gradient and the Services scroll-stack. Voice is intentionally first-
 * person and direct, contrasting with the marketing-y sections that follow.
 */
export function WelcomeSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-prose">
        <div className="grid items-center gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {SITE.tagline}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-grey-900 sm:text-4xl">
              Welcome to Consulat
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-grey-700">
              If you require a Work or Business Visa to Nigeria or you wish to
              embark on a project and require assistance on how to structure
              your stay in Nigeria for you, your Partner, family and friends
              who may wish to visit — we can help.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {/* TODO(client): replace href with the actual requirements PDF
                  once supplied. Lives under public/downloads/ by convention. */}
              <Button asChild size="lg">
                <a href="/downloads/visa-requirements.pdf" download>
                  <Download className="h-4 w-4" />
                  Click to download requirements
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Talk to our team <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative hidden aspect-square w-full max-w-sm lg:block">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent/15 blur-3xl"
              />
              <div className="relative flex h-full items-center justify-center">
                <Image
                  src="/brand/consulat-icon.png"
                  alt=""
                  width={100}
                  height={100}
                  className="h-48 w-48 drop-shadow-xl"
                  aria-hidden
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
