"use client";

import { useEffect, useRef, useState } from "react";

interface PdfThumbnailProps {
  pdfUrl: string | null | undefined;
  fallbackImageUrl: string;
  alt: string;
  className?: string;
}

export default function PdfThumbnail({
  pdfUrl,
  fallbackImageUrl,
  alt,
  className = "",
}: PdfThumbnailProps) {
  const [src, setSrc] = useState<string>(fallbackImageUrl);
  const [loading, setLoading] = useState(false);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!pdfUrl || pdfUrl === prevUrl.current) return;
    prevUrl.current = pdfUrl;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const proxied = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
        const pdf = await pdfjsLib.getDocument({ url: proxied, withCredentials: false }).promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvas, viewport } as Parameters<typeof page.render>[0]).promise;

        if (!cancelled) setSrc(canvas.toDataURL("image/jpeg", 0.9));
      } catch {
        // keep showing fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pdfUrl]);

  return (
    <div className="relative w-full h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={className} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-6 h-6 border-2 border-[#fcee16] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
