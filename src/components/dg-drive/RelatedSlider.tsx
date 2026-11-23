import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ComingSoonCover from "./ComingSoonCover";
import { type CarouselItem, DG_YELLOW, type DriveArticle } from "./data";

type RelatedItem = DriveArticle | CarouselItem;

// Slanted crop at rest; opens to a full rectangle on hover / keyboard focus.
const SLANT = "[clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)]";
const OPEN =
  "group-hover:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] group-focus-visible:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]";

function Card({
  article,
  className = "",
  style,
}: {
  article: RelatedItem;
  className?: string;
  style?: React.CSSProperties;
}) {
  if ("comingSoon" in article && article.comingSoon) {
    return (
      <div
        aria-label={`${article.subtitle}, coming soon`}
        className={`group block transition-transform duration-500 hover:z-30 hover:-translate-y-2 ${className}`}
        style={style}
      >
        <div
          className={`relative aspect-[1270/720] overflow-hidden bg-neutral-900 ${SLANT}`}
          style={{ containerType: "inline-size" }}
        >
          <ComingSoonCover src={article.image} sizes="(min-width: 1024px) 52vw, 100vw" />
        </div>
        <div className="mt-3 pr-[18%]">
          <p
            className="text-[11px] font-bold tracking-widest uppercase sm:text-[12px]"
            style={{ color: DG_YELLOW }}
          >
            Coming Soon
          </p>
          <h3 className="mt-1 text-[18px] leading-tight font-black text-white sm:text-[20px]">
            {article.subtitle}
          </h3>
        </div>
      </div>
    );
  }
  const a = article as DriveArticle;
  return (
    <Link
      href={a.href}
      aria-label={`${a.title} — ${a.subtitle}`}
      className={`group block outline-none transition-[transform,filter] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:z-30 hover:-translate-y-3 hover:scale-[1.06] hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] focus-visible:z-30 focus-visible:-translate-y-3 focus-visible:scale-[1.06] ${className}`}
      style={style}
    >
      <div
        className={`relative aspect-[1270/720] overflow-hidden transition-[clip-path] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${SLANT} ${OPEN}`}
      >
        <Image
          src={a.thumb}
          alt=""
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
        {/* Dimmed at rest, like the landing page's faded preview cards */}
        <span className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0" />
      </div>
      {/* Caption below the card (the thumbnail already carries the title art) */}
      <div className="mt-3 pr-[18%] transition-transform duration-300 group-hover:translate-x-1">
        <p
          className="text-[11px] font-bold tracking-widest uppercase sm:text-[12px]"
          style={{ color: DG_YELLOW }}
        >
          {a.category} · {a.date}
        </p>
        <h3 className="mt-1 text-[18px] leading-tight font-black text-white sm:text-[20px]">
          {a.title}
        </h3>
        <span className="mt-1 inline-flex items-center gap-2 text-[13px] font-semibold text-white/80 transition-colors group-hover:text-[#FCD400]">
          Read Article
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * "More from DG Drive": the other articles as static, staggered trapezoid
 * cards in the style of the landing carousel's faded previews. Hovering a card
 * brings it forward, brightens it and opens it to show the full thumbnail.
 */
export default function RelatedSlider({
  articles,
}: {
  articles: RelatedItem[];
}) {
  if (!articles.length) return null;
  const n = articles.length;
  const STEP = 90; // vertical offset between cards, px

  return (
    <>
      {/* Desktop: overlapping, stepped cards */}
      <div className="relative hidden lg:block">
        {/* Spacer sized by the first card so the absolutely placed cards get room */}
        <div
          className="invisible w-[52%]"
          style={{ paddingBottom: (n - 1) * STEP + 130 }}
        >
          <div className="aspect-[1270/720]" />
        </div>
        {articles.map((a, i) => (
          <Card
            key={a.id}
            article={a}
            // z-index via a variable: an inline zIndex would beat hover:z-30.
            className="absolute z-[var(--z)] w-[52%]"
            style={
              {
                left: n === 1 ? "24%" : `${(i * 48) / (n - 1)}%`,
                top: 20 + i * STEP,
                "--z": 20 - i,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Mobile / tablet: stacked */}
      <div className="grid gap-6 py-4 sm:grid-cols-2 lg:hidden">
        {articles.map((a) => (
          <Card key={a.id} article={a} />
        ))}
      </div>
    </>
  );
}
