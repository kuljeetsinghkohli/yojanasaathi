import Image from "next/image";

/**
 * HeroBanner
 *
 * Full-width hero image that sits above the farmer-profile form.
 * The image already has the "YojanaSaathi" title baked into its pixels,
 * so the alt text carries that information for screen readers.
 *
 * Heights:
 *   mobile  (<640 px) : ~120px  →  h-[120px]
 *   desktop (≥640 px) : ~160px  →  sm:h-[160px]
 *
 * object-position:
 *   mobile  : "top left"  so the baked-in title (top-left corner) stays
 *             visible when the sides crop away on narrow viewports.
 *   desktop : "center"    standard centred crop for wider screens.
 */
export default function HeroBanner() {
  return (
    <div className="relative w-full h-[120px] sm:h-[160px] overflow-hidden">
      <Image
        src="/images/hero-yojanasaathi.jpg"
        alt="YojanaSaathi — your AI companion for government welfare schemes"
        fill
        priority
        sizes="100vw"
        className="object-cover object-left-top sm:object-center"
      />
    </div>
  );
}
