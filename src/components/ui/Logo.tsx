import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** Show the wordmark (default) or only the red square mark. */
  variant?: "full" | "mark";
};

/**
 * Castellana logo: red square + «CASTELLANA» in bold italic + lighter «.CH».
 * Vector recreation of the façade sign; the wordmark inherits `currentColor`.
 * Set the height via className (e.g. `h-5 w-auto`).
 */
export function Logo({ className, variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="20" height="20" fill="#E30613" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 226 28"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Castellana Automobile AG"
      focusable="false"
    >
      {/* Turns 90° when a parent `group/logo` is hovered (header). */}
      <rect
        x="0"
        y="2"
        width="24"
        height="24"
        fill="#E30613"
        className="origin-center transition-transform duration-700 ease-out-expo [transform-box:fill-box] group-hover/logo:rotate-90"
      />
      <text
        x="35"
        y="24.6"
        fill="currentColor"
        fontSize="27"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.2"
        style={{ fontFamily: "var(--font-instrument-sans), Arial, sans-serif" }}
      >
        CASTELLANA
        <tspan fontWeight="400" fillOpacity="0.62">
          .CH
        </tspan>
      </text>
    </svg>
  );
}
