import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  /** Tailwind classes applied to the outer link */
  className?: string;
  /**
   * Visual variant:
   * - "default" — original brand colors (use on light backgrounds)
   * - "white"   — inverted to pure white via CSS filter (use on dark backgrounds)
   */
  variant?: "default" | "white";
  /** Pixel height of the logo image. Width scales proportionally (≈1.62:1). */
  height?: number;
}

export function Logo({
  className = "",
  variant = "default",
  height = 40,
}: LogoProps) {
  // The source SVG has a viewBox of 1549.92 × 954.93 → aspect ratio ≈ 1.623
  const width = Math.round(height * 1.623);

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Alta Mortgage Group Home"
    >
      <Image
        src="/logo.svg"
        alt="Alta Mortgage Group"
        width={width}
        height={height}
        priority
        className={
          variant === "white"
            ? "h-auto w-auto brightness-0 invert"
            : "h-auto w-auto"
        }
        style={{ height: `${height}px` }}
      />
    </Link>
  );
}
