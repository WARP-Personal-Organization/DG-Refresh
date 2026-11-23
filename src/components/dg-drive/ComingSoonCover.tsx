import { Clock } from "lucide-react";
import Image from "next/image";

/**
 * Blurred photo with a "Coming Soon" badge for unreleased episodes. Fills its
 * parent (which must be positioned). Text is sized in container-query units,
 * so the parent should set `container-type: inline-size` to keep the badge in
 * proportion at any card size.
 */
export default function ComingSoonCover({
  src,
  label,
  sizes,
}: {
  src: string;
  /** Small line under the badge, e.g. "DG DRIVE EPISODE 4". */
  label?: string;
  sizes: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="scale-125 object-cover blur-xl brightness-[0.55] saturate-50"
      />
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_100%)]" />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-[2.5cqw] text-center">
        <span
          className="inline-flex items-center gap-[1.6cqw] bg-[#FCD400] px-[4cqw] py-[1.4cqw] text-[5.2cqw] leading-none font-black tracking-wide text-black"
          style={{ clipPath: "polygon(2.2cqw 0, 100% 0, calc(100% - 2.2cqw) 100%, 0 100%)" }}
        >
          <Clock className="h-[5cqw] w-[5cqw]" strokeWidth={3} />
          COMING SOON
        </span>
        {label && (
          <span className="text-[2.6cqw] font-bold tracking-[0.2em] text-white/85 uppercase">
            {label}
          </span>
        )}
      </span>
    </>
  );
}
