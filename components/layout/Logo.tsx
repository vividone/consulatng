import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "light";
  showIcon?: boolean;
  className?: string;
};

/**
 * `light` inverts the wordmark for dark backgrounds (footer).
 * `className` lets each consumer set its own height; the width auto-scales.
 */
export function Logo({ variant = "default", showIcon = false, className }: LogoProps) {
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
  );
}
