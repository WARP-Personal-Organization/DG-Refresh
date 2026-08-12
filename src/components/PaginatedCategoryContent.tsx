"use client";

import { useEffect, useState } from "react";
import type { Post } from "../../lib/wordpress";
import CategoryPageComponent from "./CategoryPage";
import Pagination from "./Pagination";

interface PaginatedCategoryContentProps {
  categorySlug: string;
  categoryName: string;
  basePath: string;
  initialFeaturedArticle: Post;
  initialNewsArticles: Post[];
  initialRecommendedArticles: Post[];
  initialTotalPages: number;
}

export default function PaginatedCategoryContent({
  categorySlug,
  categoryName,
  basePath,
  initialFeaturedArticle,
  initialNewsArticles,
  initialRecommendedArticles,
  initialTotalPages,
}: PaginatedCategoryContentProps) {
  // Seeded from server-rendered props so hydration matches the static
  // (ISR-cached) markup exactly — URL-driven correction happens only in the
  // effect below, after hydration.
  const [page, setPage] = useState(1);
  const [featuredArticle, setFeaturedArticle] = useState(initialFeaturedArticle);
  const [newsArticles, setNewsArticles] = useState(initialNewsArticles);
  const [recommendedArticles, setRecommendedArticles] = useState(initialRecommendedArticles);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  async function fetchPage(newPage: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/category-posts?category=${encodeURIComponent(categorySlug)}&page=${newPage}`,
      );
      const data = await res.json();
      const posts: Post[] = data.posts ?? [];
      if (posts.length > 0) {
        setFeaturedArticle(posts[0]);
        setNewsArticles(posts.slice(1));
      }
      setRecommendedArticles(data.recommendedPosts ?? []);
      setTotalPages(data.totalPages ?? 1);
      setPage(newPage);
    } catch {
      // keep previous content on failure
    } finally {
      setLoading(false);
    }
  }

  // Deep-link support: a direct visit to ?page=N loads the static page-1 shell
  // first (fast, cached), then swaps to the requested page client-side.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPage = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
    if (urlPage !== 1) fetchPage(urlPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePageChange(newPage: number) {
    fetchPage(newPage);
    const url = newPage === 1 ? basePath : `${basePath}?page=${newPage}`;
    window.history.pushState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <CategoryPageComponent
        categoryName={categoryName}
        categorySlug={categorySlug}
        featuredArticle={featuredArticle}
        newsArticles={newsArticles}
        opinionArticles={[]}
        recommendedArticles={recommendedArticles}
      />
      <div className="max-w-7xl mx-auto px-4">
        <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
