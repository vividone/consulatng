import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

type LogoProps = {
  variant?: "default" | "light";
  showIcon?: boolean;
  /**
   * Render the brand tagline ("Immigration Simplified") below the wordmark.
   * Defaults to true — the tagline should accompany every logo placement
   * per the brand brief. Set to false in icon-only or very tight contexts.
   */
  withTagline?: boolean;
  className?: string;
};

/**
 * `light` inverts the wordmark + tones the tagline for dark backgrounds.
 * `className` lets each consumer set the wordmark height; width auto-scales.
 */
export function Logo({
  variant = "default",
  showIcon = false,
  withTagline = true,
  className,
}: LogoProps) {
  if (showIcon) {
    return (
      <Image
        src="/brand/consulat-icon.png"
        alt="Consulat"
        width={100}
        height={100}
        priority
        className={cn("h-12 w-12", className)}
      />
    );
  }

  return (
    <div className="flex flex-col items-start">
      <Image
        src="/brand/consulat-logo.png"
        alt="Consulat"
        width={200}
        height={100}
        priority
        className={cn(
          "h-12 w-auto md:h-14",
          variant === "light" && "brightness-0 invert",
          className
        )}
      />
      {withTagline && (
        <span
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]",
            variant === "light" ? "text-white/70" : "text-grey-500"
          )}
        >
          {SITE.tagline}
        </span>
      )}
    </div>
  );
}
