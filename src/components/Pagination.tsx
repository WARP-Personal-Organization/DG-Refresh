import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g. "/news" or "/news/local"
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const makeHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  // Build visible page numbers: always show first, last, current ±2
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 py-8" aria-label="Pagination">
      <Link
        href={makeHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors font-open-sans
          ${currentPage === 1
            ? "border-gray-700 text-gray-600 pointer-events-none"
            : "border-gray-600 text-gray-300 hover:border-[#fcee16] hover:text-[#fcee16]"}`}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm font-open-sans">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-roboto font-medium transition-colors
              ${p === currentPage
                ? "border-[#fcee16] bg-[#fcee16] text-black"
                : "border-gray-600 text-gray-300 hover:border-[#fcee16] hover:text-[#fcee16]"}`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={makeHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors font-open-sans
          ${currentPage === totalPages
            ? "border-gray-700 text-gray-600 pointer-events-none"
            : "border-gray-600 text-gray-300 hover:border-[#fcee16] hover:text-[#fcee16]"}`}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
