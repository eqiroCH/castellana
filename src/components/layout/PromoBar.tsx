import Link from "next/link";
import { site } from "@/content/site";

/** Optional campaign bar above the header — toggle via `site.promo.enabled`. */
export function PromoBar() {
  const { promo } = site;
  if (!promo.enabled) return null;
  return (
    <div className="bg-brand text-white">
      <p className="mx-auto flex min-h-9 max-w-site items-center justify-center gap-3 px-gutter text-center text-[0.75rem] font-medium tracking-[0.04em]">
        <span>{promo.text}</span>
        <Link href={promo.href} className="underline underline-offset-4">
          {promo.linkLabel}
        </Link>
      </p>
    </div>
  );
}
