import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Decorative world map for use as a background.
 *
 * `fill` = true: stretches to fill an absolutely/relatively-positioned parent
 *                (the typical hero / section background case).
 * `fill` = false: renders at its intrinsic aspect ratio, sized via className.
 *
 * Pair with `mix-blend-screen` (or similar) on the className so the image's
 * blue oceans dissolve into the surrounding gradient and only the continents
 * remain visible.
 */
type Props = {
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

const SRC = "/brand/world-map.jpg";
const SIZES_FILL = "100vw";
const SIZES_INTRINSIC = "(max-width: 768px) 90vw, 60vw";

export function WorldMap({ className, fill = true, priority = false }: Props) {
  if (fill) {
    return (
      <Image
        src={SRC}
        alt=""
        fill
        priority={priority}
        sizes={SIZES_FILL}
        aria-hidden
        className={cn("object-cover object-center select-none", className)}
      />
    );
  }
  return (
    <Image
      src={SRC}
      alt=""
      width={5178}
      height={2500}
      priority={priority}
      sizes={SIZES_INTRINSIC}
      aria-hidden
      className={cn("h-auto w-full select-none", className)}
    />
  );
}
