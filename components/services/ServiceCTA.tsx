import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  heading: string;
  body: string;
};

export function ServiceCTA({ heading, body }: Props) {
  return (
    <section className="bg-grey-50 py-14 sm:py-20">
      <div className="container-prose">
        <div className="mx-auto max-w-3xl rounded-2xl border border-grey-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <h2 className="font-display text-xl font-bold text-grey-900 sm:text-3xl">
            {heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-grey-700">{body}</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-7 sm:flex-row sm:items-center">
            <Button asChild>
              <Link href="/contact">Book a Consultation</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
