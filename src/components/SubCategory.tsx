"use client";
import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { ChevronRight, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface SubcategoryPageProps {
  category: string;
  parentCategory: string;
  articles: BlogPostDocument[];
}

// Helper function to format dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// Helper function to render rich text as plain text
const renderRichTextAsText = (
  richText: prismic.RichTextField,
  maxLength?: number
): string => {
  if (!richText) return "";
  const text = prismicH.asText(richText);
  if (maxLength && text.length > maxLength) {
    return text.substring(0, maxLength).trim() + "...";
  }
  return text;
};

// Helper function to format author names
const formatAuthors = (authorText: prismic.RichTextField): string => {
  const authors = renderRichTextAsText(authorText);
  return authors || "Staff Writer";
};

const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  parentCategory,
  articles,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Latest");

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true;
    const title = article.data.title?.toLowerCase() || "";
    const summary =
      renderRichTextAsText(article.data.summary)?.toLowerCase() || "";
    return (
      title.includes(searchQuery.toLowerCase()) ||
      summary.includes(searchQuery.toLowerCase())
    );
  });

  const tabs = ["Latest", "Most Read", "Featured"];

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/${parentCategory.toLowerCase()}`}
              className="hover:text-yellow-400 transition-colors uppercase tracking-wide"
            >
              {parentCategory}
            </Link>
          </div>
        </nav>

        {/* Category Header */}
        <header className="mb-12">
          <div className="border-b-4 border-yellow-500 pb-4 mb-8">
            <div className="text-sm font-bold text-yellow-400 uppercase tracking-[0.2em] mb-2">
              {parentCategory}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white font-serif tracking-tight">
              {category}
            </h1>
          </div>
        </header>

        {/* Navigation Tabs and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          {/* Tabs */}
          <div className="flex border-b border-default">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm tracking-wide transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? "border-yellow-500 text-yellow-400 bg-gray-900/50"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 w-full lg:w-80"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => {
              const publishDate = formatDate(
                article.data.published_date || article.data.updated_date
              );
              const articleTitle = article.data.title || "Untitled Article";
              const articleSummary = renderRichTextAsText(
                article.data.summary,
                150
              );
              const authorName = formatAuthors(article.data.author);
              const featuredImage = article.data.featured_image;

              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.uid}`}
                  className="block group"
                >
                  <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 border-b border-default hover:border-gray-700 transition-all duration-300">
                    {/* Date Column */}
                    <div className="lg:col-span-2">
                      <time className="text-sm text-gray-400 font-medium">
                        {publishDate}
                      </time>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 space-y-3">
                      <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-200 leading-tight font-serif">
                        {articleTitle}
                      </h2>

                      {articleSummary && (
                        <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-200">
                          {articleSummary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">By</span>
                          <span className="font-medium text-yellow-400">
                            {authorName}
                          </span>
                        </div>
                        {article.data.category && (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 bg-gray-800 text-yellow-400 rounded text-xs font-medium uppercase tracking-wide">
                              {article.data.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="lg:col-span-3">
                      {featuredImage?.url ? (
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-700 group-hover:border-yellow-500/50 transition-all duration-300">
                          <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt || articleTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 1024px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                          <div className="text-center">
                            <User
                              size={24}
                              className="mx-auto text-gray-500 mb-2"
                            />
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 border-2 border-default rounded-xl p-8 max-w-md mx-auto">
                <Search size={48} className="mx-auto text-yellow-400/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No Articles Found
                </h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? `No articles match your search for "${searchQuery}"`
                    : "No articles available in this category yet."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-black via-gray-950 to-black border-2 border-default hover:border-yellow-500/60 rounded-xl px-8 py-4 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105">
              <span className="text-lg font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 font-serif tracking-wide">
                LOAD MORE ARTICLES
              </span>
              <ChevronRight
                size={20}
                className="text-yellow-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        )}

        {/* Bottom Decorative Border */}
        <div className="flex items-center justify-center mt-16 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-yellow-500/30"></div>
          </div>
          <div className="relative bg-black px-6">
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-yellow-500/50 mr-3"></div>
              <div className="w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
              <div className="flex-1 h-px bg-gradient-to-l from-yellow-500/50 via-yellow-400/50 to-transparent ml-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;
