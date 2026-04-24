"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";

interface FlipbookViewerProps {
  title: string;
  link: string;
  pdfUrl?: string | null;
  embedSrc?: string | null;
  imageUrl?: string | null;
  onClose: () => void;
}

const FLIPBOOK_SERVICES = [
  "issuu.com",
  "joomag.com",
  "calameo.com",
  "pageflip.io",
  "yumpu.com",
];

async function renderPdfToImages(url: string): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  const pdf = await pdfjsLib.getDocument({
    url: proxiedUrl,
    withCredentials: false,
  }).promise;
  const images: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, viewport } as Parameters<typeof page.render>[0])
      .promise;
    images.push(canvas.toDataURL("image/jpeg", 0.85));
  }
  return images;
}

const Page = React.forwardRef<HTMLDivElement, { src: string; number: number }>(
  ({ src, number }, ref) => (
    <div ref={ref} className="bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Page ${number}`}
        className="w-full h-full object-contain block"
      />
    </div>
  ),
);
Page.displayName = "Page";

function FlipbookModal({
  title,
  link,
  pdfUrl,
  embedSrc,
  imageUrl,
  onClose,
}: FlipbookViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<{
    pageFlip: () => {
      flipNext: () => void;
      flipPrev: () => void;
    };
  } | null>(null);

  const useEmbed = !!(
    embedSrc && FLIPBOOK_SERVICES.some((s) => embedSrc.includes(s))
  );
  const usePdf = !useEmbed && !!pdfUrl;
  const useFallbackEmbed = !useEmbed && !usePdf && !!embedSrc;

  const loadPdf = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      setPages(await renderPdfToImages(url));
    } catch {
      setError("Could not load the PDF. Try opening it in a new tab.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usePdf && pdfUrl) loadPdf(pdfUrl);
  }, [usePdf, pdfUrl, loadPdf]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const prev = () => bookRef.current?.pageFlip().flipPrev();
  const next = () => bookRef.current?.pageFlip().flipNext();

  return (
    // Full-screen portal — pages can animate freely, nothing to overflow into
    <div
      className="fixed inset-0 bg-black flex flex-col"
      style={{ zIndex: 99999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1b1a1b] border-b border-gray-800 flex-shrink-0">
        <span className="font-roboto font-bold text-white text-lg">
          {title}
        </span>
        <div className="flex items-center gap-3">
          {/* <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#fcee16] text-sm font-semibold hover:opacity-70 transition-opacity font-open-sans"
          >
            Open in new tab <ExternalLink size={14} />
          </a> */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] overflow-hidden">
        {/* Embed (Issuu, etc.) */}
        {(useEmbed || useFallbackEmbed) && (
          <iframe
            src={embedSrc!}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
          />
        )}

        {/* PDF flipbook */}
        {usePdf && (
          <>
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={40} className="animate-spin text-[#fcee16]" />
                <p className="text-gray-400 font-open-sans text-sm">
                  Loading paper…
                </p>
              </div>
            )}
            {error && (
              <div className="text-center space-y-4 px-6">
                <p className="text-gray-400 font-open-sans text-sm">{error}</p>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#fcee16] font-semibold text-sm hover:opacity-80"
                >
                  Open directly <ExternalLink size={14} />
                </a>
              </div>
            )}
            {!loading && !error && pages.length > 0 && (
              <div className="flex flex-col items-center gap-6 w-full h-full py-6">
                <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                  {/* @ts-expect-error – react-pageflip types incomplete */}
                  <HTMLFlipBook
                    ref={bookRef}
                    width={420}
                    height={594}
                    size="fixed"
                    minWidth={220}
                    maxWidth={540}
                    minHeight={310}
                    maxHeight={762}
                    showCover
                    mobileScrollSupport={false}
                    useMouseEvents
                    onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                    className="shadow-2xl"
                  >
                    {pages.map((src, i) => (
                      <Page key={i} src={src} number={i + 1} />
                    ))}
                  </HTMLFlipBook>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0 pb-2">
                  <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full bg-[#fcee16] text-black flex items-center justify-center hover:bg-[#fcee16]/80 transition-colors shadow-lg"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <span className="text-gray-400 text-sm font-open-sans min-w-[80px] text-center">
                    {currentPage + 1} / {pages.length}
                  </span>
                  <button
                    onClick={next}
                    className="w-11 h-11 rounded-full bg-[#fcee16] text-black flex items-center justify-center hover:bg-[#fcee16]/80 transition-colors shadow-lg"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Image only */}
        {!useEmbed && !useFallbackEmbed && !usePdf && imageUrl && (
          <div className="w-full h-full flex items-center justify-center p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain shadow-2xl rounded"
            />
          </div>
        )}

        {/* No content */}
        {!useEmbed && !useFallbackEmbed && !usePdf && !imageUrl && (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <p className="text-gray-400 font-open-sans text-sm">
              Preview not available.
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#fcee16] font-semibold text-sm hover:opacity-80"
            >
              Open on Daily Guardian <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Portal wrapper — mounts directly on document.body, escaping all stacking contexts
export default function FlipbookViewer(props: FlipbookViewerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(<FlipbookModal {...props} />, document.body);
}
