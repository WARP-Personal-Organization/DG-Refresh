"use client";
import { ExternalLink, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const FlipbookViewer = dynamic(() => import("./FlipbookViewer"), { ssr: false });

export const PublicationCard = ({
  title,
  imageUrl,
  link,
  isToday = false,
  embedSrc,
  pdfUrl,
  content,
}: {
  title: string;
  imageUrl: string;
  link: string;
  isToday?: boolean;
  embedSrc?: string | null;
  pdfUrl?: string | null;
  content?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative bg-[#1b1a1b] rounded-xl overflow-hidden shadow-2xl border border-[#fcee16]/20 hover:border-[#fcee16]/40 transition-all duration-500">
        {/* Thumbnail */}
        <button
          onClick={() => setOpen(true)}
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
        <div className="p-4 border-t border-[#fcee16]/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-widest font-roboto text-[#fcee16]">
              {title}
            </span>
            <span className="text-xs text-gray-500 font-open-sans mt-0.5">
              {isToday ? "Latest Edition" : "Current Issue"}
            </span>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#fcee16] text-xs font-bold hover:opacity-80 transition-opacity font-roboto"
          >
            Open <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Flipbook viewer — loaded lazily */}
      {open && (
        <FlipbookViewer
          title={title}
          link={link}
          pdfUrl={pdfUrl}
          embedSrc={embedSrc}
          imageUrl={imageUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
