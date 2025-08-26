("use client");

import { Search, Calendar, Tag, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as prismicH from "@prismicio/helpers";
import type { BlogPostDocument } from "../../../prismicio-types";

interface SearchResult extends BlogPostDocument {
  relevanceScore: number;
  matchedFields: string[];
}

interface SearchResultsProps {
  posts: BlogPostDocument[];
}

export default function SearchResults({ posts }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance");
  const [filterBy, setFilterBy] = useState<string>("all");

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Search function with advanced scoring
  const searchPosts = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    const scoredResults = posts.map((post): SearchResult => {
      let score = 0;
      const matchedFields: string[] = [];

      // Title matching (highest weight)
      const title = post.data.title?.toLowerCase() || "";
      if (title.includes(normalizedQuery)) {
        score += 15;
        matchedFields.push("title");
      } else {
        queryWords.forEach((word) => {
          if (title.includes(word)) {
            score += 8;
            if (!matchedFields.includes("title")) matchedFields.push("title");
          }
        });
      }

      // Summary matching
      const summary = prismicH.asText(post.data.summary).toLowerCase();
      if (summary.includes(normalizedQuery)) {
        score += 10;
        matchedFields.push("summary");
      } else {
        queryWords.forEach((word) => {
          if (summary.includes(word)) {
            score += 5;
            if (!matchedFields.includes("summary"))
              matchedFields.push("summary");
          }
        });
      }

      // Content matching
      const content = prismicH.asText(post.data.content).toLowerCase();
      if (content.includes(normalizedQuery)) {
        score += 7;
        matchedFields.push("content");
      } else {
        queryWords.forEach((word) => {
          if (content.includes(word)) {
            score += 3;
            if (!matchedFields.includes("content"))
              matchedFields.push("content");
          }
        });
      }

      // Author matching
      const author = prismicH.asText(post.data.author).toLowerCase();
      if (author.includes(normalizedQuery)) {
        score += 6;
        matchedFields.push("author");
      }

      // Category matching
      const category = post.data.category?.toLowerCase() || "";
      if (category.includes(normalizedQuery)) {
        score += 5;
        matchedFields.push("category");
      }

      // Tags matching
      if (post.data.tags) {
        post.data.tags.forEach((tagItem) => {
          const tag = tagItem.tag?.toLowerCase() || "";
          if (tag.includes(normalizedQuery)) {
            score += 4;
            if (!matchedFields.includes("tags")) matchedFields.push("tags");
          }
        });
      }

      // Boost for special post types
      if (post.data.is_featured) score += 2;
      if (post.data.is_breaking_news) score += 3;
      if (post.data.editors_pick) score += 1;

      return {
        ...post,
        relevanceScore: score,
        matchedFields,
      };
    });

    return scoredResults.filter((result) => result.relevanceScore > 0);
  };

  const performSearch = (searchQuery: string) => {
    setIsLoading(true);
    const searchResults = searchPosts(searchQuery);
    setResults(searchResults);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      // Update URL
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "relevance") {
      return b.relevanceScore - a.relevanceScore;
    } else {
      const dateA = new Date(a.data.published_date || "");
      const dateB = new Date(b.data.published_date || "");
      return dateB.getTime() - dateA.getTime();
    }
  });

  // Filter results
  const filteredResults =
    filterBy === "all"
      ? sortedResults
      : sortedResults.filter((post) => post.data.category === filterBy);

  // Get unique categories for filter
  const categories = [
    ...new Set(posts.map((post) => post.data.category).filter(Boolean)),
  ];

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#fcee16] hover:text-[#fcee16]/80 transition-colors duration-200 font-open-sans"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 font-roboto">
          Search Articles
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, authors, categories..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans text-lg"
            />
          </div>
        </form>

        {/* Search Results Summary */}
        {query && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-400 font-open-sans">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    {filteredResults.length} result
                    {filteredResults.length !== 1 ? "s" : ""} for "{query}"
                  </>
                )}
              </p>
            </div>

            {/* Sort and Filter Controls */}
            {!isLoading && filteredResults.length > 0 && (
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "relevance" | "date")
                  }
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm font-open-sans"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="date">Sort by Date</option>
                </select>

                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm font-open-sans"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fcee16]"></div>
        </div>
      ) : query && filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2 font-roboto">
            No Results Found
          </h3>
          <p className="text-gray-500 font-open-sans">
            Try different keywords or check your spelling
          </p>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-6">
          {filteredResults.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-[#fcee16]/50 transition-colors"
            >
              <div className="flex gap-6">
                {/* Featured Image */}
                {post.data.featured_image?.url && (
                  <div className="hidden sm:block flex-shrink-0">
                    <Link href={`/blog/${post.uid}`}>
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={post.data.featured_image.url}
                          alt={
                            post.data.featured_image.alt ||
                            post.data.title ||
                            ""
                          }
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </Link>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <Link href={`/blog/${post.uid}`}>
                        <h2 className="text-xl font-bold text-white hover:text-[#fcee16] transition-colors line-clamp-2 font-roboto">
                          {post.data.title}
                        </h2>
                      </Link>

                      {/* Badges */}
                      <div className="flex gap-2 mt-2">
                        {post.data.is_breaking_news && (
                          <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded uppercase">
                            Breaking
                          </span>
                        )}
                        {post.data.is_featured && (
                          <span className="px-2 py-1 text-xs font-bold bg-[#fcee16] text-black rounded uppercase">
                            Featured
                          </span>
                        )}
                        {post.data.editors_pick && (
                          <span className="px-2 py-1 text-xs font-bold bg-green-600 text-white rounded uppercase">
                            Editor's Pick
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div className="font-semibold text-[#fcee16]">
                        Score: {post.relevanceScore}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {prismicH.asText(post.data.summary) && (
                    <p className="text-gray-300 line-clamp-2 mb-3 font-open-sans">
                      {prismicH.asText(post.data.summary)}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span className="font-open-sans">
                        {formatDate(post.data.published_date)}
                      </span>
                    </div>
                    {post.data.category && (
                      <div className="flex items-center gap-1">
                        <Tag size={12} />
                        <span className="capitalize font-open-sans">
                          {post.data.category}
                        </span>
                      </div>
                    )}
                    {prismicH.asText(post.data.author) && (
                      <span className="font-open-sans">
                        By {prismicH.asText(post.data.author)}
                      </span>
                    )}
                  </div>

                  {/* Matched Fields */}
                  {post.matchedFields.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 font-open-sans">
                        Matched in:
                      </span>
                      <div className="flex gap-1">
                        {post.matchedFields.map((field) => (
                          <span
                            key={field}
                            className="px-2 py-1 bg-[#fcee16]/20 text-[#fcee16] rounded font-open-sans"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !query ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2 font-roboto">
            Search Articles
          </h3>
          <p className="text-gray-500 font-open-sans">
            Enter keywords to find articles by title, content, author, or
            category
          </p>
        </div>
      ) : null}
    </div>
  );
}
