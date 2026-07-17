import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { ServiceItem } from "@/components/services/ServiceItem";

type CoverItem = {
  title: string;
  description: string;
  bullets?: string[];
};

type Props = {
  heading?: string;
  items: readonly CoverItem[];
  /** Optional companion image shown alongside the items on lg+. */
  image?: string;
  imageAlt?: string;
  /** Which side the image sits on at lg+. Defaults to "right". */
  imageSide?: "left" | "right";
};

/**
 * "What We Cover" grid with an optional companion image column.
 *  - lg+: items in a 2-col grid on one side, sticky image on the other.
 *  - md:   items in 2-col grid, image (if any) stacked below.
 *  - < md: items stacked, image (if any) below.
 */
export function ServiceCoverGrid({
  heading = "What We Cover",
  items,
  image,
  imageAlt = "",
  imageSide = "right",
}: Props) {
  const itemsGrid = (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80}>
          <ServiceItem {...item} />
        </Reveal>
      ))}
    </div>
  );

  const imageColumn = image ? (
    <Reveal delay={items.length * 40}>
      <div className="lg:sticky lg:top-24">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-grey-200">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </Reveal>
  ) : null;

  return (
    <section className="bg-grey-50 py-14 sm:py-20">
      <div className="container-prose">
        <h2 className="mb-10 font-display text-3xl font-bold text-grey-900 sm:text-4xl">
          {heading}
        </h2>
        {image ? (
          <div
            className={
              imageSide === "left"
                ? "grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10"
                : "grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10"
            }
          >
            {imageSide === "left" ? (
              <>
                {imageColumn}
                {itemsGrid}
              </>
            ) : (
              <>
                {itemsGrid}
                {imageColumn}
              </>
            )}
          </div>
        ) : (
          itemsGrid
        )}
      </div>
    </section>
  );
}
