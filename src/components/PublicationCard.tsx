"use client";
import { ChevronDown, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { PaperEdition } from "../../lib/wordpress";

const FlipbookViewer = dynamic(() => import("./FlipbookViewer"), { ssr: false });

export const PublicationCard = ({
  title,
  imageUrl,
  link,
  isToday = false,
  embedSrc,
  pdfUrl,
  content,
  editions = [],
}: {
  title: string;
  imageUrl: string;
  link: string;
  isToday?: boolean;
  embedSrc?: string | null;
  pdfUrl?: string | null;
  content?: string;
  editions?: PaperEdition[];
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<PaperEdition | null>(null);

  // If the "current" publication has no PDF, fall back to the most recent available edition
  const fallbackEdition = !pdfUrl && !embedSrc && !selectedEdition ? (editions[0] ?? null) : null;
  const activeEdition = selectedEdition ?? fallbackEdition;

  const activePdfUrl = activeEdition?.pdfUrl ?? pdfUrl;
  const activeLink = activeEdition?.pdfUrl ?? link;
  const activeLabel = selectedEdition
    ? selectedEdition.label
    : fallbackEdition
    ? fallbackEdition.label
    : isToday
    ? "Latest Edition"
    : "Current Issue";

  const canPreview = !!(activePdfUrl || embedSrc);

  const handleThumbnailClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="relative bg-[#1b1a1b] rounded-xl overflow-hidden shadow-2xl border border-[#fcee16]/20 hover:border-[#fcee16]/40 transition-all duration-500">
        {/* Thumbnail */}
        <button
          onClick={handleThumbnailClick}
          className="block w-full relative group overflow-hidden"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-[#fcee16] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 font-roboto text-sm">
                <Eye size={18} />
                Read Paper
              </div>
            </div>
          </div>
        </button>

        {/* Footer */}
        <div className="p-4 border-t border-[#fcee16]/10">
          <span className="text-sm font-black uppercase tracking-widest font-roboto text-[#fcee16] block mb-2">
            {title}
          </span>

          {/* Edition selector */}
          {editions.length > 0 ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors font-open-sans w-full text-left"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                />
                <span className="truncate">{activeLabel}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#111] border border-[#fcee16]/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                  {/* Current/Latest option */}
                  <button
                    onClick={() => {
                      setSelectedEdition(null);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-open-sans hover:bg-[#fcee16]/10 transition-colors ${
                      !selectedEdition ? "text-[#fcee16]" : "text-gray-300"
                    }`}
                  >
                    {isToday ? "Latest Edition" : "Current Issue"}
                  </button>
                  <div className="border-t border-white/5" />
                  {editions.map((ed) => (
                    <button
                      key={ed.id}
                      onClick={() => {
                        setSelectedEdition(ed);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm font-open-sans hover:bg-[#fcee16]/10 transition-colors ${
                        selectedEdition?.id === ed.id ? "text-[#fcee16]" : "text-gray-300"
                      }`}
                    >
                      {ed.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500 font-open-sans">{activeLabel}</span>
          )}
        </div>
      </div>

      {/* Flipbook viewer — loaded lazily */}
      {open && (
        <FlipbookViewer
          title={title}
          link={activeLink}
          pdfUrl={activePdfUrl}
          embedSrc={embedSrc}
          imageUrl={imageUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
