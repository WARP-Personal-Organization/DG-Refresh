// app/blog/[uid]/page.tsx
import CommentSection from "@/components/CommentSection";
import ShareButton from "@/components/ShareButton";
import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Facebook,
  Instagram,
  MessageCircle,
  Play,
  Tag,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "../../../../lib/prismicio";
import type {
  BlogPostDocument,
  BlogPostDocumentDataTagsItem,
} from "../../../../prismicio-types";

// FIXED: Proper interface for params (Next.js 15+ compatibility)
interface BlogPageProps {
  params: Promise<{
    uid: string;
  }>;
}

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
  const categoryMap: Record<
    string,
    { bg: string; text: string; name: string }
  > = {
    news: { bg: "bg-red-600", text: "text-red-100", name: "NEWS ANALYSIS" },
    sports: { bg: "bg-blue-600", text: "text-blue-100", name: "SPORTS" },
    business: { bg: "bg-green-600", text: "text-green-100", name: "BUSINESS" },
    feature: {
      bg: "bg-purple-600",
      text: "text-purple-100",
      name: "FEATURE",
    },
    opinion: {
      bg: "bg-orange-600",
      text: "text-orange-100",
      name: "OPINION",
    },
    industries: {
      bg: "bg-teal-600",
      text: "text-teal-100",
      name: "INDUSTRIES",
    },
    "other-pages": {
      bg: "bg-gray-600",
      text: "text-gray-100",
      name: "OTHER",
    },
  };

  return category && categoryMap[category]
    ? categoryMap[category]
    : categoryMap["news"];
};

// FIXED: Properly typed function to extract tags
const extractTagsFromGroup = (
  tagsGroup: BlogPostDocumentDataTagsItem[] | undefined
): string[] => {
  if (!Array.isArray(tagsGroup)) return [];

  return tagsGroup
    .map((item: BlogPostDocumentDataTagsItem) => item.tag) // Extract the 'tag' field from each group item
    .filter((tag) => tag !== null && tag !== undefined) // Filter out null/undefined
    .map((tag) => tag.toString().trim()); // Convert to string and clean up whitespace
};

// FIXED: Main component with proper params handling
export default async function BlogPost({ params }: BlogPageProps) {
  let post: BlogPostDocument;

  try {
    // FIXED: Await params for Next.js 15+
    const resolvedParams = await params;
    post = await client.getByUID("blog_post", resolvedParams.uid);
  } catch (error) {
    notFound();
  }

  const categoryStyle = getCategoryStyle(post.data.category);
  const readingTime = post.data.reading_time
    ? `${post.data.reading_time} min`
    : estimateReadingTime(post.data.content);
  const publishDate = formatDate(post.data.published_date);
  const updateDate = formatDate(post.data.updated_date);

  // FIXED: Properly typed tag extraction
  const postTags = extractTagsFromGroup(post.data.tags);

  // Generate the current article URL for sharing
  const resolvedParams = await params;
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/blog/${resolvedParams.uid}`;

  return (
    <div className="bg-[#1b1a1b] min-h-screen font-open-sans">
      {/* Header with back navigation */}
      <header className="bg-[#1b1a1b] border-b border-[#fcee16]/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#fcee16] hover:text-[#fcee16]/80 transition-colors duration-200 font-open-sans"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          {/* Breaking News Badge */}
          {post.data.is_breaking_news && (
            <span className="inline-block px-4 py-2 text-sm font-bold tracking-wider uppercase rounded bg-red-600 text-red-100 animate-pulse font-open-sans">
              BREAKING NEWS
            </span>
          )}

          {/* Featured Badge */}
          {post.data.is_featured && (
            <span className="ml-3 inline-block px-4 py-2 text-sm font-bold tracking-wider uppercase rounded bg-[#fcee16] text-[#1b1a1b] font-open-sans">
              FEATURED
            </span>
          )}

          {/* Editor's Pick Badge */}
          {post.data.editors_pick && (
            <span className="ml-3 inline-block px-4 py-2 text-sm font-bold tracking-wider uppercase rounded bg-green-600 text-green-100 font-open-sans">
              EDITOR&apos;S PICK
            </span>
          )}
        </div>

        {/* Headline */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-roboto font-bold text-white leading-tight mb-6">
            {post.data.title}
          </h1>

          {/* Summary/Subtitle */}
          {post.data.summary && prismicH.asText(post.data.summary) && (
            <div className="text-xl text-gray-300 leading-relaxed mb-6 font-light font-open-sans">
              <PrismicRichText field={post.data.summary} />
            </div>
          )}

          {/* Article Meta Info */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-700">
            {/* Audio Player */}
            <button className="flex items-center gap-2 text-[#fcee16] hover:text-[#fcee16]/80 transition-colors duration-200">
              <Play size={16} />
              <span className="text-sm font-medium font-open-sans">
                Listen to this article • {readingTime} read
              </span>
            </button>

            {/* Share Button - NOW WITH NATIVE SHARE FUNCTIONALITY */}
            <ShareButton
              title={post.data.title || "Article"}
              url={articleUrl}
              text={
                prismicH.asText(post.data.summary) ||
                post.data.title ||
                "Check out this article"
              }
            />

            {/* Bookmark */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200">
              <Bookmark size={16} />
            </button>

            {/* Comments count */}
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={16} />
              <span className="text-sm font-open-sans">24</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.data.featured_image?.url && (
          <figure className="mb-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-700">
              <Image
                src={post.data.featured_image.url}
                alt={post.data.featured_image.alt || "Article image"}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.data.featured_image.alt && (
              <figcaption className="mt-3 text-sm text-gray-400 italic font-open-sans">
                {post.data.featured_image.alt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Author and Date Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fcee16] rounded-full flex items-center justify-center">
              <User size={18} className="text-[#1b1a1b]" />
            </div>
            <div>
              <p className="font-medium text-white font-open-sans">
                By {prismicH.asText(post.data.author) || "Staff Writer"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1 font-open-sans">
                  <Calendar size={12} />
                  <time>{publishDate}</time>
                </div>
                {updateDate && updateDate !== publishDate && (
                  <div className="flex items-center gap-1 font-open-sans">
                    <Clock size={12} />
                    <span>Updated {updateDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1 font-open-sans">
              <Eye size={12} />
              <span>1,247 views</span>
            </div>
            <div className="flex items-center gap-1 font-open-sans">
              <Tag size={12} />
              <span>{readingTime} read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <PrismicRichText
            field={post.data.content}
            components={{
              paragraph: ({ children }) => (
                <p className="mb-6 text-gray-200 leading-relaxed text-lg font-open-sans">
                  {children}
                </p>
              ),
              heading1: ({ children }) => (
                <h1 className="mt-8 mb-4 text-3xl font-bold text-white font-roboto">
                  {children}
                </h1>
              ),
              heading2: ({ children }) => (
                <h2 className="mt-8 mb-4 text-2xl font-bold text-white font-roboto">
                  {children}
                </h2>
              ),
              heading3: ({ children }) => (
                <h3 className="mt-6 mb-3 text-xl font-bold text-white font-roboto">
                  {children}
                </h3>
              ),
              list: ({ children }) => (
                <ul className="mb-6 ml-6 list-disc text-gray-200 font-open-sans">
                  {children}
                </ul>
              ),
              oList: ({ children }) => (
                <ol className="mb-6 ml-6 list-decimal text-gray-200 font-open-sans">
                  {children}
                </ol>
              ),
              listItem: ({ children }) => (
                <li className="mb-2 text-gray-200 font-open-sans">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-[#fcee16] italic">{children}</em>
              ),
              hyperlink: ({ children, node }) => {
                // Handle different link types properly
                const linkUrl = prismicH.asLink(node.data);
                const linkTarget =
                  node.data.link_type === "Web" && "target" in node.data
                    ? node.data.target
                    : "_self";

                return (
                  <a
                    href={linkUrl || "#"}
                    className="text-[#fcee16] hover:text-[#fcee16]/80 underline transition-colors duration-200"
                    target={linkTarget}
                    rel={
                      linkTarget === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </a>
                );
              },
              preformatted: ({ children }) => (
                <pre className="mb-6 p-4 bg-gray-800 rounded-lg overflow-x-auto">
                  <code className="text-green-400 text-sm font-mono">
                    {children}
                  </code>
                </pre>
              ),
            }}
          />
        </div>

        {/* Tags Section */}
        {postTags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-[#fcee16]" />
              <span className="text-gray-400 font-medium font-open-sans">
                Tags:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {postTags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-[#fcee16] rounded-full text-sm transition-colors duration-200 border border-gray-700 hover:border-[#fcee16]/50 font-open-sans"
                >
                  #{tag.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Meta Information */}
        <div className="mt-8 p-6 bg-[#1b1a1b]/80 rounded-lg border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 font-roboto">
            Article Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 font-open-sans">Category:</span>
                <span className="text-white capitalize font-open-sans">
                  {post.data.category || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-open-sans">
                  Subcategory:
                </span>
                <span className="text-white capitalize font-open-sans">
                  {post.data.subcategory?.replace(/-/g, " ") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-open-sans">
                  Reading Time:
                </span>
                <span className="text-white font-open-sans">{readingTime}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 font-open-sans">Published:</span>
                <span className="text-white font-open-sans">{publishDate}</span>
              </div>
              {updateDate && updateDate !== publishDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-open-sans">Updated:</span>
                  <span className="text-white font-open-sans">
                    {updateDate}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400 font-open-sans">Tags:</span>
                <span className="text-white font-open-sans">
                  {postTags.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COMMENT SECTION - Using post.uid as the unique identifier */}
        <CommentSection postId={post.uid} />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="space-y-3">
            <h4 className="text-white font-roboto font-semibold">
              Share with us
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="https://facebook.com/dailyguardian"
                className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Facebook"
              >
                <Facebook
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://twitter.com/dailyguardian"
                className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Twitter"
              >
                <Twitter
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://instagram.com/dailyguardian"
                className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Instagram"
              >
                <Instagram
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://youtube.com/dailyguardian"
                className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="YouTube"
              >
                <Youtube
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-6 font-roboto">
            Related Articles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* You can fetch related articles here */}
            <Link href="/blog/related-article-1" className="block group">
              <div className="bg-[#1b1a1b]/80 border border-gray-700 hover:border-[#fcee16]/50 rounded-lg p-6 transition-all duration-300">
                <h4 className="text-lg font-bold text-white group-hover:text-[#fcee16] transition-colors duration-200 font-roboto">
                  Related Article Title
                </h4>
                <p className="text-gray-400 mt-2 text-sm font-open-sans">
                  Brief description of the related article...
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 font-open-sans">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />2 days ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />5 min read
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

// FIXED: Generate metadata for SEO with proper params handling
export async function generateMetadata({ params }: BlogPageProps) {
  try {
    // FIXED: Await params for Next.js 15+
    const resolvedParams = await params;
    const post = await client.getByUID("blog_post", resolvedParams.uid);

    return {
      title: `${post.data.title} | Daily Guardian`,
      description:
        post.data.meta_description || prismicH.asText(post.data.summary),
      openGraph: {
        title: post.data.title,
        description:
          post.data.meta_description || prismicH.asText(post.data.summary),
        images: post.data.featured_image?.url
          ? [
              {
                url: post.data.featured_image.url,
                width: 1200,
                height: 630,
                alt: post.data.featured_image.alt || post.data.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.data.title,
        description:
          post.data.meta_description || prismicH.asText(post.data.summary),
        images: post.data.featured_image?.url
          ? [post.data.featured_image.url]
          : [],
      },
    };
  } catch {
    return {
      title: "Article Not Found | Daily Guardian",
      description: "The requested article could not be found.",
    };
  }
}
