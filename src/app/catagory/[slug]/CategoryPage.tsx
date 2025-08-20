// app/category/[slug]/CategoryPageComponent.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import type { BlogPostDocument } from '../../../..//prismicio-types';

interface CategoryPageComponentProps {
  categoryName: string;
  categorySlug: string;
  featuredArticle: BlogPostDocument;
  newsArticles: BlogPostDocument[];
  opinionArticles: BlogPostDocument[];
  recommendedArticles: BlogPostDocument[];
}

// Helper function to safely render text
import { RichTextField } from "@prismicio/client";

const renderText = (richText: RichTextField | string | null): string => {
  if (!richText) return "";
  if (typeof richText === "string") return richText;

  // Prismic RichTextField is an array of nodes
  if (Array.isArray(richText)) {
    return richText.map((block) => ("text" in block ? block.text : "")).join(" ").trim();
  }

  return "";
};


// Helper function to format dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return '';
  }
};

// Simple article card
const ArticleCard: React.FC<{ article: BlogPostDocument }> = ({ article }) => (
  <Link href={`/blog/${article.uid}`} className="block group">
    <article className="bg-black border border-gray-800 hover:border-yellow-500/50 rounded-lg p-4 transition-all duration-300">
      {article.data.featured_image?.url && (
        <div className="relative aspect-[16/10] mb-4 overflow-hidden rounded">
          <Image
            src={article.data.featured_image.url}
            alt={article.data.featured_image.alt || 'Article image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-white group-hover:text-yellow-200 transition-colors duration-200 leading-tight">
          {article.data.title || 'Untitled Article'}
        </h3>
        
        <p className="text-gray-400 text-sm">
          {renderText(article.data.summary).substring(0, 150)}...
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User size={12} className="text-yellow-400" />
            {renderText(article.data.author) || 'Staff Reporter'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-yellow-400" />
            {formatDate(article.data.published_date)}
          </span>
        </div>
      </div>
    </article>
  </Link>
);

const CategoryPageComponent: React.FC<CategoryPageComponentProps> = ({
  categoryName,
  featuredArticle,
  newsArticles,
  opinionArticles,
  recommendedArticles
}) => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            {categoryName}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Article */}
            {featuredArticle && (
              <section>
                <Link href={`/blog/${featuredArticle.uid}`} className="block group">
                  <article className="bg-black border border-yellow-500/30 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded text-xs font-bold uppercase">
                          Featured
                        </span>
                        
                        <h2 className="text-3xl font-serif font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">
                          {featuredArticle.data.title || 'Untitled Article'}
                        </h2>
                        
                        <p className="text-gray-300 leading-relaxed">
                          {renderText(featuredArticle.data.summary).substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <User size={14} className="text-yellow-400" />
                            {renderText(featuredArticle.data.author) || 'Staff Reporter'}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-yellow-400" />
                            {formatDate(featuredArticle.data.published_date)}
                          </span>
                        </div>
                      </div>
                      
                      {featuredArticle.data.featured_image?.url && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded">
                          <Image
                            src={featuredArticle.data.featured_image.url}
                            alt={featuredArticle.data.featured_image.alt || 'Featured article'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* News Articles */}
            {newsArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                  Latest {categoryName}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {newsArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Opinion Articles */}
            {opinionArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                  Related Stories
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {opinionArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Simple Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {recommendedArticles.length > 0 && (
                <section className="bg-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-4">
                    Recommended
                  </h3>
                  
                  <div className="space-y-4">
                    {recommendedArticles.map((article, index) => (
                      <Link key={article.id} href={`/blog/${article.uid}`} className="block group">
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-white group-hover:text-yellow-200 transition-colors text-sm font-semibold">
                              {article.data.title || 'Untitled Article'}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {formatDate(article.data.published_date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageComponent;