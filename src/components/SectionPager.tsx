"use client";

import { Children, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Compact prev/next pager for homepage section rows.
//
// This is deliberately NOT the Pagination component in this folder — that one
// renders numbered pages for the category listing routes. Editorial asked for
// the control the old site used inside a section: a small pair of arrows that
// swaps the row's contents in place, without navigating away. It replaces the
// "View All …" links, which sent readers to a different page.
//
// Every page is rendered into the DOM and inactive ones are hidden with CSS
// rather than unmounted. That keeps all of the headlines in the server HTML —
// only one is visible, but crawlers still see the rest, and paging costs no
// request and no refetch.
//
// The `chunk` helper that splits a list into pages lives in lib/chunk.ts, not
// here: this is a "use client" module, and a server component may render its
// exports but may not call an exported function from one.
export default function SectionPager({
  children,
  label,
}: {
  children: React.ReactNode;
  /** Describes what is being paged, for screen readers (e.g. "opinion columns"). */
  label: string;
}) {
  const pages = Children.toArray(children);
  const [page, setPage] = useState(0);

  if (pages.length === 0) return null;
  const current = Math.min(page, pages.length - 1);

  const button = (
    to: number,
    disabled: boolean,
    aria: string,
    icon: React.ReactNode,
  ) => (
    <button
      type="button"
      aria-label={aria}
      disabled={disabled}
      onClick={() => setPage(to)}
      className="flex h-7 w-7 items-center justify-center border border-default text-gray-300 transition-colors hover:border-[#fcee16] hover:text-[#fcee16] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-default disabled:hover:text-gray-300"
    >
      {icon}
    </button>
  );

  return (
    <>
      {pages.map((node, i) => (
        <div key={i} className={i === current ? undefined : "hidden"}>
          {node}
        </div>
      ))}

      {pages.length > 1 && (
        <div className="flex items-center gap-2 pt-3">
          {button(current - 1, current === 0, `Previous ${label}`, <ChevronLeft size={15} />)}
          {button(
            current + 1,
            current === pages.length - 1,
            `Next ${label}`,
            <ChevronRight size={15} />,
          )}
          <span aria-live="polite" className="sr-only">
            Showing {label} page {current + 1} of {pages.length}
          </span>
        </div>
      )}
    </>
  );
}
