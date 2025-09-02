// components/SearchModal.tsx
"use client";

import * as prismicH from "@prismicio/helpers";
import { ArrowRight, Calendar, Clock, Search, Tag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPostDocument[];
}

interface SearchResult extends BlogPostDocument {
  relevanceScore: number;
  matchedFields: string[];
}

const SearchModal = ({ isOpen, onClose, posts }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Search function with scoring
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
        score += 10;
        matchedFields.push("title");
      } else {
        queryWords.forEach((word) => {
          if (title.includes(word)) {
            score += 5;
            if (!matchedFields.includes("title")) matchedFields.push("title");
          }
        });
      }

      // Summary matching
      const summary = prismicH.asText(post.data.summary).toLowerCase();
      if (summary.includes(normalizedQuery)) {
        score += 7;
        matchedFields.push("summary");
      } else {
        queryWords.forEach((word) => {
          if (summary.includes(word)) {
            score += 3;
            if (!matchedFields.includes("summary"))
              matchedFields.push("summary");
          }
        });
      }

      // Content matching
      const content = prismicH.asText(post.data.content).toLowerCase();
      if (content.includes(normalizedQuery)) {
        score += 5;
        matchedFields.push("content");
      } else {
        queryWords.forEach((word) => {
          if (content.includes(word)) {
            score += 2;
            if (!matchedFields.includes("content"))
              matchedFields.push("content");
          }
        });
      }

      // Author matching
      const author = prismicH.asText(post.data.author).toLowerCase();
      if (author.includes(normalizedQuery)) {
        score += 4;
        matchedFields.push("author");
      }

      // Category matching
      const category = post.data.category?.toLowerCase() || "";
      if (category.includes(normalizedQuery)) {
        score += 3;
        matchedFields.push("category");
      }

      // Tags matching
      if (post.data.tags) {
        post.data.tags.forEach((tagItem) => {
          const tag = tagItem.tag?.toLowerCase() || "";
          if (tag.includes(normalizedQuery)) {
            score += 3;
            if (!matchedFields.includes("tags")) matchedFields.push("tags");
          }
        });
      }

      // Boost for featured/breaking news
      if (post.data.is_featured) score += 1;
      if (post.data.is_breaking_news) score += 2;

      return {
        ...post,
        relevanceScore: score,
        matchedFields,
      };
    });

    return scoredResults
      .filter((result) => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  };

  // Handle search with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = searchPosts(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, posts]);

  // Save search to recent searches
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // Handle search result click
  const handleResultClick = (post: SearchResult) => {
    saveSearch(query);
    onClose();
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-2xl bg-[#1b1a1b] rounded-xl border border-default shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-default">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, authors, categories..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {!query.trim() ? (
              /* Recent Searches */
              <div className="p-6">
                {recentSearches.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-400 font-roboto">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex items-center gap-3 w-full p-3 text-left rounded-lg hover:bg-gray-800 transition-colors group"
                        >
                          <Clock
                            size={16}
                            className="text-gray-500 group-hover:text-[#fcee16]"
                          />
                          <span className="text-gray-300 font-open-sans">
                            {search}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2 font-roboto">
                      Search Articles
                    </h3>
                    <p className="text-gray-500 font-open-sans">
                      Find articles by title, content, author, or category
                    </p>
                  </div>
                )}
              </div>
            ) : isLoading ? (
              /* Loading */
              <div className="p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fcee16]"></div>
                </div>
              </div>
            ) : results.length > 0 ? (
              /* Search Results */
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-400 font-open-sans">
                    {results.length} result{results.length !== 1 ? "s" : ""} for
                    "{query}"
                  </p>
                </div>
                <div className="space-y-4">
                  {results.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.uid}`}
                      onClick={() => handleResultClick(post)}
                      className="block p-4 rounded-lg border border-default hover:border-[#fcee16]/50 hover:bg-gray-800/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-[#fcee16] transition-colors line-clamp-2 font-roboto">
                            {post.data.title}
                          </h4>
                          {prismicH.asText(post.data.summary) && (
                            <p className="mt-1 text-sm text-gray-400 line-clamp-2 font-open-sans">
                              {prismicH.asText(post.data.summary)}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
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
                            {post.matchedFields.length > 0 && (
                              <div className="text-[#fcee16]">
                                Matched: {post.matchedFields.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-gray-500 group-hover:text-[#fcee16] transition-colors flex-shrink-0"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* No Results */
              <div className="p-6">
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2 font-roboto">
                    No Results Found
                  </h3>
                  <p className="text-gray-500 font-open-sans">
                    Try different keywords or check your spelling
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
