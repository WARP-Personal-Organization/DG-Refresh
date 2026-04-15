"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

interface FlipbookViewerProps {
  title: string;
  link: string;
  pdfUrl?: string | null;
  embedSrc?: string | null;
  imageUrl?: string | null;
  onClose: () => void;
}

// ── Issuu / known flipbook services ─────────────────────────────────────────
const FLIPBOOK_SERVICES = ["issuu.com", "joomag.com", "calameo.com", "pageflip.io", "yumpu.com"];

function isFlipbookService(src: string): boolean {
  return FLIPBOOK_SERVICES.some((s) => src.includes(s));
}

// ── PDF → page-image renderer ────────────────────────────────────────────────
async function renderPdfToImages(url: string): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  // Route through local proxy to avoid CORS issues with DG's server
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  const pdf = await pdfjsLib.getDocument({ url: proxiedUrl, withCredentials: false }).promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    // pdfjs-dist v5+ uses `canvas` directly instead of `canvasContext`
    await page.render({ canvas, viewport } as Parameters<typeof page.render>[0]).promise;
    images.push(canvas.toDataURL("image/jpeg", 0.85));
  }

  return images;
}

// ── Page component for react-pageflip ────────────────────────────────────────
const Page = React.forwardRef<HTMLDivElement, { src: string; number: number }>(
  ({ src, number }, ref) => (
    <div ref={ref} className="bg-white shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`Page ${number}`} className="w-full h-full object-contain" />
    </div>
  )
);
Page.displayName = "Page";

// ── Main viewer ───────────────────────────────────────────────────────────────
export default function FlipbookViewer({
  title,
  link,
  pdfUrl,
  embedSrc,
  imageUrl,
  onClose,
}: FlipbookViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; getCurrentPageIndex: () => number; getPageCount: () => number } } | null>(null);

  // Decide mode
  const useEmbed = embedSrc && isFlipbookService(embedSrc);
  const usePdf = !useEmbed && !!pdfUrl;
  const useFallbackEmbed = !useEmbed && !usePdf && !!embedSrc;

  const loadPdf = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const imgs = await renderPdfToImages(url);
      setPages(imgs);
    } catch (e) {
      console.error("PDF load error:", e);
      setError("Could not load the PDF. Try opening it in a new tab.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usePdf && pdfUrl) loadPdf(pdfUrl);
  }, [usePdf, pdfUrl, loadPdf]);

  const prev = () => bookRef.current?.pageFlip().flipPrev();
  const next = () => bookRef.current?.pageFlip().flipNext();

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1b1a1b] border-b border-[#fcee16]/20 flex-shrink-0">
        <h2 className="text-white font-roboto font-bold text-lg">{title}</h2>
        <div className="flex items-center gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#fcee16] text-sm font-semibold hover:opacity-80 transition-opacity font-open-sans"
          >
            Open in new tab <ExternalLink size={14} />
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#111] relative">

        {/* ── Known flipbook service (Issuu etc.) ── */}
        {useEmbed && (
          <iframe
            src={embedSrc}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
          />
        )}

        {/* ── Fallback iframe (non-flipbook embed) ── */}
        {useFallbackEmbed && (
          <iframe
            src={embedSrc!}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
          />
        )}

        {/* ── PDF Flipbook ── */}
        {usePdf && (
          <>
            {loading && (
              <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 size={40} className="animate-spin text-[#fcee16]" />
                <p className="text-gray-300 font-open-sans">Loading paper…</p>
              </div>
            )}

            {error && (
              <div className="text-center space-y-4">
                <p className="text-gray-300 font-open-sans">{error}</p>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#fcee16] font-semibold hover:opacity-80"
                >
                  Open directly <ExternalLink size={14} />
                </a>
              </div>
            )}

            {!loading && !error && pages.length > 0 && (
              <div className="flex flex-col items-center gap-4 h-full w-full py-4">
                <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                  {/* @ts-expect-error – react-pageflip types incomplete */}
                  <HTMLFlipBook
                    ref={bookRef}
                    width={420}
                    height={594}
                    size="fixed"
                    minWidth={220}
                    maxWidth={560}
                    minHeight={310}
                    maxHeight={793}
                    showCover
                    mobileScrollSupport
                    onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                    className="shadow-2xl"
                  >
                    {pages.map((src, i) => (
                      <Page key={i} src={src} number={i + 1} />
                    ))}
                  </HTMLFlipBook>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 pb-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full bg-[#fcee16] text-black flex items-center justify-center hover:bg-[#fcee16]/80 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-gray-400 text-sm font-open-sans min-w-[80px] text-center">
                    {currentPage + 1} / {pages.length}
                  </span>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full bg-[#fcee16] text-black flex items-center justify-center hover:bg-[#fcee16]/80 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── No PDF/embed — show image as a single flipbook page ── */}
        {!useEmbed && !useFallbackEmbed && !usePdf && imageUrl && (
          <div className="flex flex-col items-center gap-4 h-full w-full py-4">
            <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
              {/* @ts-expect-error – react-pageflip types incomplete */}
              <HTMLFlipBook
                width={420}
                height={594}
                size="fixed"
                minWidth={220}
                maxWidth={560}
                minHeight={310}
                maxHeight={793}
                showCover
                mobileScrollSupport
                className="shadow-2xl"
              >
                <Page src={imageUrl} number={1} />
              </HTMLFlipBook>
            </div>
            <p className="text-gray-500 font-open-sans text-xs pb-2">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#fcee16]/60 hover:text-[#fcee16] hover:underline transition-colors">
                Open on Daily Guardian ↗
              </a>
            </p>
          </div>
        )}

        {/* ── No content at all ── */}
        {!useEmbed && !useFallbackEmbed && !usePdf && !imageUrl && (
          <p className="text-gray-400 font-open-sans text-sm text-center">
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#fcee16] hover:underline">
              Open on Daily Guardian ↗
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
