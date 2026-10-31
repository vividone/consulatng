import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-prose max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-grey-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-grey-700">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
