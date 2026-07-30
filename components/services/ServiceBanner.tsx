import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

/**
 * Banner image that overlaps the bottom of PageHero by a small amount,
 * creating a visual bridge between the dark hero and the white content
 * sections below. Place immediately after <PageHero /> on a service page.
 */
export function ServiceBanner({ src, alt }: Props) {
  return (
    <div className="relative -mt-10 sm:-mt-16 lg:-mt-20">
      <div className="container-prose">
        <div className="relative aspect-[16/7] overflow-hidden rounded-3xl shadow-2xl shadow-primary/30 ring-1 ring-white/10">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1280px"
            className="object-cover object-top"
            priority
          />
          {/* subtle bottom-fade so any contained text in future is legible */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
