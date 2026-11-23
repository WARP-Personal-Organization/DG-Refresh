"use client";

import { ArrowRight, Calendar, Clock, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DG_YELLOW, type DriveArticle } from "./data";

const SLANT_TAG = "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)";

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s|-)(\w)/g, (_m, sep: string, c: string) => sep + c.toUpperCase());

function CategoryTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block bg-[#FCD400] px-3 py-1 text-[11px] font-extrabold tracking-wider text-black uppercase"
      style={{ clipPath: SLANT_TAG }}
    >
      {children}
    </span>
  );
}

function Meta({ article }: { article: DriveArticle }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] font-semibold text-black/60 sm:text-[11.5px]">
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={13} /> {article.date}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={13} /> {article.readTime}
      </span>
    </p>
  );
}

function ArticleCard({ article }: { article: DriveArticle }) {
  return (
    <Link href={article.href} className="group flex flex-col">
      <div className="relative aspect-[1270/720] overflow-hidden bg-black shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <Image
          src={article.thumb}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 22vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <span className="absolute top-1.5 left-1.5 origin-top-left scale-[0.8] sm:top-2.5 sm:left-2.5 sm:scale-100">
          <CategoryTag>{article.category}</CategoryTag>
        </span>
      </div>
      {/* Black underline bar that fills white on hover */}
      <div className="relative -mt-px h-1.5 overflow-hidden bg-black sm:h-2">
        <span className="absolute inset-y-0 left-0 w-0 bg-white transition-[width] duration-500 ease-out group-hover:w-full" />
      </div>
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <h3 className="text-[15px] leading-tight font-black text-black sm:text-[19px] xl:text-[21px]">
          {article.title}
        </h3>
        <p className="mt-1 text-[11px] font-extrabold text-black sm:text-[12.5px]">
          {article.subtitle}
        </p>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-black/75 sm:line-clamp-3 sm:text-[13.5px]">
          {article.dek}.
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-3">
          <Meta article={article} />
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-black sm:text-[13px]">
            Read
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesExplorer({ articles }: { articles: DriveArticle[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles],
  );
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return [a.title, a.subtitle, a.dek, a.category].join(" ").toLowerCase().includes(q);
    });
  }, [articles, category, query]);

  const isFiltering = category !== "All" || query.trim() !== "";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={`h-9 px-5 text-[13px] font-bold transition-colors ${
                  active ? "bg-black text-[#FCD400]" : "bg-black/10 text-black hover:bg-black/20"
                }`}
                style={{ clipPath: SLANT_TAG }}
              >
                {titleCase(c)}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search articles</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="h-10 w-full border-2 border-black bg-white/70 pr-9 pl-9 text-[14px] font-medium text-black placeholder:text-black/45 focus:bg-white focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-black/60 hover:text-black"
            >
              <X size={15} />
            </button>
          )}
        </label>
      </div>

      <p className="mt-4 text-[13px] font-semibold text-black/60" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {isFiltering ? " found" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 bg-black px-6 py-14 text-center text-white">
          <p className="text-[22px] font-black" style={{ color: DG_YELLOW }}>
            No articles found.
          </p>
          <p className="mt-2 text-[14px] text-white/70">Try another category or search term.</p>
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setQuery("");
            }}
            className="mt-6 h-10 px-6 text-[14px] font-bold text-black"
            style={{ backgroundColor: DG_YELLOW }}
          >
            Show all articles
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {filtered.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
