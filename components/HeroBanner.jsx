import Image from "next/image";
import { Kaushan_Script } from "next/font/google";

const kaushan = Kaushan_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/**
 * HeroBanner
 *
 * Full-width hero image with a real HTML <h1> and tagline overlaid via
 * absolute positioning. The background photo has no text baked in.
 *
 * Heights:
 *   mobile  (<640 px) : ~120px  →  h-[120px]
 *   desktop (≥640 px) : ~160px  →  sm:h-[160px]
 *
 * object-position:
 *   mobile  : left top  — keeps the subject visible on narrow viewports
 *   desktop : center    — standard centred crop
 */
export default function HeroBanner() {
  return (
    <div className="relative w-full h-[120px] sm:h-[160px] overflow-hidden">
      {/* Background photo — no text baked in */}
      <Image
        src="/images/hero-yojanasaathi-bg.jpg"
        alt="YojanaSaathi — your AI companion for government welfare schemes"
        fill
        priority
        sizes="100vw"
        className="object-cover object-left-top sm:object-center"
      />

      {/* Text overlay — absolutely positioned top-left, ~10–14% inset */}
      <div
        className="absolute"
        style={{ top: "12%", left: "4%" }}
      >
        <h1
          className={kaushan.className}
          style={{
            fontSize: "clamp(1.25rem, 4vw, 2.5rem)",
            lineHeight: 1.15,
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(30,25,10,0.5)",
            margin: 0,
          }}
        >
          YojanaSaathi
        </h1>
        <p
          style={{
            fontSize: "clamp(0.65rem, 1.8vw, 1rem)",
            lineHeight: 1.3,
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(30,25,10,0.5)",
            margin: "0.2em 0 0",
          }}
        >
          Your AI companion for government welfare schemes
        </p>
      </div>
    </div>
  );
}
