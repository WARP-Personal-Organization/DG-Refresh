"use client";

import { useEffect, useRef, useState } from "react";

export default function FacebookPagePlugin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeWidth, setIframeWidth] = useState(280);
  const [loaded, setLoaded] = useState(false);

  // Measure the container width after mount so we pass an accurate width
  // to Facebook's embed URL. Facebook ignores CSS width on the iframe —
  // it only responds to the `width` query param.
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        // Facebook plugin accepts 180–500px; clamp to that range
        setIframeWidth(Math.min(500, Math.max(180, w)));
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const src =
    `https://www.facebook.com/plugins/page.php` +
    `?href=https%3A%2F%2Fwww.facebook.com%2FDailyGuardianPH` +
    `&tabs=timeline` +
    `&width=${iframeWidth}` +
    `&height=500` +
    `&small_header=true` +
    `&adapt_container_width=true` +
    `&hide_cover=false` +
    `&show_facepile=false` +
    `&appid=`;

  return (
    <div className="rounded-xl overflow-hidden border border-accent/20 bg-[#1b1a1b] shadow-2xl">
      {/* Section header — matches PublicationCard footer label style */}
      <div className="px-4 py-3 border-b border-accent/10 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest font-roboto text-accent">
          Follow Us
        </span>
        <a
          href="https://www.facebook.com/DailyGuardianPH"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-accent transition-colors font-roboto"
          aria-label="Open Daily Guardian Facebook page"
        >
          facebook.com/DailyGuardianPH
        </a>
      </div>

      {/* Iframe container — measured to feed accurate width to FB */}
      <div ref={containerRef} className="w-full overflow-hidden relative">
        {/* Skeleton shown until iframe fires onLoad */}
        {!loaded && (
          <div
            className="absolute inset-0 bg-[#242324] animate-pulse"
            style={{ height: 500 }}
            aria-hidden="true"
          />
        )}
        <iframe
          key={iframeWidth} // re-mount when width changes so FB re-renders at new size
          src={src}
          width={iframeWidth}
          height={500}
          style={{
            border: "none",
            overflow: "hidden",
            display: "block",
            width: "100%",
            minWidth: 0,
            minHeight: 500,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          loading="lazy"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Daily Guardian Facebook Page"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
