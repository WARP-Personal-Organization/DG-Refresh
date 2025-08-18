// app/blog/[uid]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '../../../../lib/prismicio';
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  Play,
  MessageCircle,
  Eye,
  Tag
} from 'lucide-react';
import type { BlogPostDocument } from '../../../../prismicio-types';
import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
interface BlogPageProps {
  params: {
    uid: string;
  };
}

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to estimate reading time
const estimateReadingTime = (content: prismic.RichTextField): string => {
  const text = prismicH.asText(content);
  const wordsPerMinute = 250;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min`;
};

// Helper function to get category styling
const getCategoryStyle = (category: string | null) => {
  const categoryMap: Record<string, { bg: string; text: string; name: string }> = {
    'news': { bg: 'bg-red-600', text: 'text-red-100', name: 'NEWS ANALYSIS' },
    'sports': { bg: 'bg-blue-600', text: 'text-blue-100', name: 'SPORTS' },
    'business': { bg: 'bg-green-600', text: 'text-green-100', name: 'BUSINESS' },
    'featured': { bg: 'bg-yellow-600', text: 'text-yellow-100', name: 'FEATURED' }
  };
  
  return category ? categoryMap[category] || categoryMap['news'] : categoryMap['news'];
};

export default async function BlogPost({ params }: BlogPageProps) {
  let post: BlogPostDocument;

  try {
    post = await client.getByUID('blog_post', params.uid);
  } catch (error) {
    notFound();
  }

  const categoryStyle = getCategoryStyle(post.data.category);
  const readingTime = estimateReadingTime(post.data.content);
  const publishDate = formatDate(post.data.published_date);
  const updateDate = formatDate(post.data.updated_date);

  return (
    <div className="bg-black min-h-screen">
      {/* Header with back navigation */}
      <header className="bg-black border-b border-yellow-500/30 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Badge */}
        <div className="mb-6">
          <span className={`inline-block px-4 py-2 text-sm font-bold tracking-wider uppercase rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
            {categoryStyle.name}
          </span>
        </div>

        {/* Headline */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-6">
            {post.data.title}
          </h1>
          
          {/* Summary/Subtitle */}
          {post.data.summary && (
            <div className="text-xl text-gray-300 leading-relaxed mb-6 font-light">
              {prismicH.asText(post.data.summary)}
            </div>
          )}

          {/* Article Meta Info */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-700">
            {/* Audio Player */}
            <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
              <Play size={16} />
              <span className="text-sm font-medium">Listen to this article • {readingTime} read</span>
            </button>

            {/* Share Button */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Share2 size={16} />
              <span className="text-sm">Share full article</span>
            </button>

            {/* Bookmark */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200">
              <Bookmark size={16} />
            </button>

            {/* Comments count */}
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={16} />
              <span className="text-sm">24</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.data.featured_image?.url && (
          <figure className="mb-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-700">
              <Image
                src={post.data.featured_image.url}
                alt={post.data.featured_image.alt || 'Article image'}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.data.featured_image.alt && (
              <figcaption className="mt-3 text-sm text-gray-400 italic">
                {post.data.featured_image.alt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Author and Date Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-black" />
            </div>
            <div>
              <p className="font-medium text-white">
                By {prismicH.asText(post.data.author) || 'Staff Writer'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <time>{publishDate}</time>
                </div>
                {updateDate && updateDate !== publishDate && (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Updated {updateDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>1,247 views</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={12} />
              <span>{readingTime} read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div className="text-gray-200 leading-relaxed space-y-6">
            {prismicH.asHTML(post.data.content)}
          </div>
        </div>

        {/* Tags */}
        {post.data.tags && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-yellow-400" />
              <span className="text-gray-400 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.data.tags.split(',').map((tag, index) => (
                <Link
                  key={index}
                  href={`/tags/${tag.trim().toLowerCase()}`}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-yellow-400 rounded-full text-sm transition-colors duration-200"
                >
                  {tag.trim()}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <h3 className="text-lg font-bold text-white mb-4">Share this article</h3>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
              Facebook
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200">
              Twitter
            </button>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200">
              WhatsApp
            </button>
            <button className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg font-medium transition-colors duration-200">
              Email
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-6 font-serif">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* You can fetch related articles here */}
            <Link href="/blog/related-article-1" className="block group">
              <div className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-200">
                  Related Article Title
                </h4>
                <p className="text-gray-400 mt-2 text-sm">
                  Brief description of the related article...
                </p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps) {
  try {
    const post = await client.getByUID('blog_post', params.uid);
    
    return {
      title: post.data.title,
      description: prismicH.asText(post.data.summary),
      openGraph: {
        title: post.data.title,
        description: prismicH.asText(post.data.summary),
        images: post.data.featured_image?.url ? [post.data.featured_image.url] : [],
      },
    };
  } catch {
    return {
      title: 'Article Not Found',
    };
  }
}