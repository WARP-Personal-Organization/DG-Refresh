"use client";

import { ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

interface Reel {
  id: number;
  title: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
  link: string;
}

const REELS: Reel[] = [
  {
    id: 1,
    title: "2025 Toyota GR86 — Full Track Review",
    category: "REVIEW",
    duration: "2:34",
    views: "128K",
    thumbnail:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=2025+toyota+gr86+review",
  },
  {
    id: 2,
    title: "Inside the Lamborghini Urus SE",
    category: "LUXURY",
    duration: "1:58",
    views: "204K",
    thumbnail:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=lamborghini+urus+se",
  },
  {
    id: 3,
    title: "Drift King: AE86 Build Log",
    category: "BUILD",
    duration: "3:12",
    views: "87K",
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=ae86+drift+build",
  },
  {
    id: 4,
    title: "Electric vs Petrol Drag Race",
    category: "RACE",
    duration: "0:58",
    views: "512K",
    thumbnail:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=electric+vs+petrol+drag+race",
  },
  {
    id: 5,
    title: "Hidden Roads of Cebu — Motorcycle Run",
    category: "ADVENTURE",
    duration: "4:20",
    views: "63K",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=cebu+motorcycle+scenic+road",
  },
  {
    id: 6,
    title: "Porsche 911 GT3 RS — Sound Check",
    category: "SOUND",
    duration: "1:14",
    views: "341K",
    thumbnail:
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=porsche+911+gt3+rs+exhaust+sound",
  },
  {
    id: 7,
    title: "Mitsubishi Montero Sport 2025 PH",
    category: "LOCAL",
    duration: "2:05",
    views: "95K",
    thumbnail:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=mitsubishi+montero+sport+2025+philippines",
  },
  {
    id: 8,
    title: "Top 5 SUVs Under ₱2M Philippines",
    category: "TOP 5",
    duration: "3:45",
    views: "178K",
    thumbnail:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=700&fit=crop&crop=center",
    link: "https://www.youtube.com/results?search_query=best+suv+under+2+million+philippines+2025",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  REVIEW: "bg-blue-500",
  LUXURY: "bg-yellow-500 text-black",
  BUILD: "bg-orange-500",
  RACE: "bg-red-500",
  ADVENTURE: "bg-green-500",
  SOUND: "bg-purple-500",
  LOCAL: "bg-[#fbd203] text-black",
  "TOP 5": "bg-white text-black",
};

export default function DGDriveReels() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 bg-[#1b1a1b]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 pb-3 border-b-2 border-[#fbd203] flex items-center justify-between">
          <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
            DG Drive Reels
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#fbd203] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#fbd203] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Reels scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {REELS.map((reel) => (
            <a
              key={reel.id}
              href={reel.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredId(reel.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex-shrink-0 relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                width: "160px",
                height: "284px",
                scrollSnapAlign: "start",
              }}
            >
              {/* Thumbnail */}
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{
                  transform: hoveredId === reel.id ? "scale(1.08)" : "scale(1)",
                }}
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Top row: category + sound icon */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded font-roboto uppercase tracking-wider text-white ${
                    CATEGORY_COLORS[reel.category] ?? "bg-gray-600"
                  }`}
                >
                  {reel.category}
                </span>
                <Volume2 size={12} className="text-white/60" />
              </div>

              {/* Play button */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: hoveredId === reel.id ? 1 : 0.7 }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    background: "rgba(251,210,3,0.9)",
                    transform:
                      hoveredId === reel.id ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <Play size={16} className="text-black ml-0.5" fill="black" />
                </div>
              </div>

              {/* Bottom: title + duration/views */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-[11px] font-bold leading-tight line-clamp-2 font-roboto mb-1.5">
                  {reel.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px] font-open-sans">
                    {reel.views} views
                  </span>
                  <span className="text-[#fbd203] text-[10px] font-bold font-roboto">
                    {reel.duration}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
