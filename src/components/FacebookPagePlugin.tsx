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
        setIframeWidth(Math.min(900, Math.max(180, w)));
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
    `&height=700` +
    `&small_header=true` +
    `&adapt_container_width=true` +
    `&hide_cover=true` +
    `&show_facepile=false` +
    `&appid=`;

  return (
    <div className="rounded-xl overflow-hidden border border-[#fcee16]/20 bg-[#1b1a1b] shadow-2xl">
      {/* Single white wrapper — prevents dark bg bleeding through as a gap seam */}
      <div className="bg-white">
        {/* ── Widget header ── */}
        <div className="relative px-4 pt-3 pb-3 overflow-hidden">
          {/* Yellow top accent strip */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#fcee16]" />

          <div className="flex items-center gap-3 pt-1">
            {/* Facebook "f" mark */}
            <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#1877F2] flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="white"
                aria-hidden="true"
              >
                <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </div>

            {/* Label + link */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] font-roboto text-[#1b1a1b] leading-none mb-0.5">
                Follow Us
              </p>
              <a
                href="https://www.facebook.com/DailyGuardianPH"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#1877F2] transition-colors duration-200 font-open-sans"
                aria-label="Open Daily Guardian Facebook page"
              >
                <span className="truncate">facebook.com/DailyGuardianPH</span>
                <svg
                  viewBox="0 0 12 12"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="flex-shrink-0"
                >
                  <path
                    d="M2.5 9.5l7-7M4 2.5h5.5v5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Iframe container — measured to feed accurate width to FB */}
        <div ref={containerRef} className="w-full overflow-hidden relative">
          {/* Skeleton shown until iframe fires onLoad */}
          {!loaded && (
            <div
              className="absolute inset-0 bg-[#242324] animate-pulse"
              style={{ height: 700 }}
              aria-hidden="true"
            />
          )}
          <iframe
            key={iframeWidth} // re-mount when width changes so FB re-renders at new size
            src={src}
            width={iframeWidth}
            height={700}
            style={{
              border: "none",
              overflow: "hidden",
              display: "block",
              width: "100%",
              minWidth: 0,
              minHeight: 700,
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
      {/* end white wrapper */}
    </div>
  );
}
