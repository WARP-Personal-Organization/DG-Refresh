// app/blog/[uid]/page.tsx
import CommentSection from "@/components/CommentSection";
import ShareButton from "@/components/ShareButton";
import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";
import {
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
  let relatedArticles: BlogPostDocument[] = [];

  try {
    // FIXED: Await params for Next.js 15+
    const resolvedParams = await params;
    post = await client.getByUID("blog_post", resolvedParams.uid);

    // Fetch related articles: same category, exclude current post
    const filters = [
      prismic.filter.not("my.blog_post.uid", resolvedParams.uid),
      post.data.category
        ? prismic.filter.at("my.blog_post.category", post.data.category)
        : null,
    ].filter((f): f is string => typeof f === "string");
    relatedArticles = await client.getAllByType("blog_post", {
      filters,
      orderings: {
        field: "my.blog_post.published_date",
        direction: "desc",
      },
      pageSize: 3,
    });

    // Fallback: if not enough, fill with featured/editorial
    if (relatedArticles.length < 3) {
      const fallbackArticles = await client.getAllByType("blog_post", {
        filters: [
          prismic.filter.not("my.blog_post.uid", resolvedParams.uid),
          prismic.filter.any("my.blog_post.category", ["feature", "editorial"]),
        ],
        orderings: {
          field: "my.blog_post.published_date",
          direction: "desc",
        },
        pageSize: 3 - relatedArticles.length,
      });
      // Avoid duplicates
      const fallbackUids = new Set(relatedArticles.map((a) => a.uid));
      relatedArticles = [
        ...relatedArticles,
        ...fallbackArticles.filter((a) => !fallbackUids.has(a.uid)),
      ];
    }
  } catch {
    notFound();
  }

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
      <header className="bg-[#1b1a1b] border-b border-default sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2.5">
            <Link href="/" className="hover:text-[#fcee16] transition-colors">
              Home
            </Link>
            {post.data.category && (
              <>
                <span className="text-gray-500">&gt;</span>
                <span className="text-gray-400">{post.data.category}</span>
              </>
            )}
          </nav>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* === COMBINED TAGS AND BADGES SECTION === */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {/* Badges with same styling as tags */}
            {post.data.is_breaking_news && (
              <span className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors duration-200">
                BREAKING NEWS
              </span>
            )}
            {post.data.is_featured && (
              <span className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors duration-200">
                FEATURED
              </span>
            )}
            {post.data.editors_pick && (
              <span className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors duration-200">
                EDITOR&apos;S PICK
              </span>
            )}

            {/* Tags with same styling */}
            {postTags.map((tag, index) => (
              <Link
                key={index}
                href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors duration-200"
              >
                {tag.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
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
            <button className="flex items-center gap-2 text-[#fcee16] hover:text-[#fcee16]/80 transition-colors duration-200">
              <Play size={16} />
              <span className="text-sm font-medium font-open-sans">
                Listen to this article • {readingTime} read
              </span>
            </button>
            <ShareButton
              title={post.data.title || "Article"}
              url={articleUrl}
              text={
                prismicH.asText(post.data.summary) ||
                post.data.title ||
                "Check out this article"
              }
            />
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200">
              <Bookmark size={16} />
            </button>
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
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-default">
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
              /* --- your existing mappers (paragraph, headings, etc.) --- */

              // 1) IMAGES (supports "image links" via node.linkTo)
              image: ({ node }) => {
                // Prefer Next/Image if you like, but plain <img> is fine too.
                const Img = (
                  <img
                    src={node.url}
                    alt={node.alt ?? ""}
                    width={node.dimensions?.width}
                    height={node.dimensions?.height}
                    loading="lazy"
                    className="my-6 rounded-lg border border-gray-700"
                  />
                );

                // If the image is clickable, Prismic puts the link on node.linkTo
                const href = node.linkTo ? prismicH.asLink(node.linkTo) : null;

                return href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                  >
                    {Img}
                  </a>
                ) : (
                  Img
                );
              },

              // 2) EMBEDS (YouTube, Vimeo, tweets, etc.)
              embed: ({ node }) => {
                const html = node?.oembed?.html ?? "";
                if (!html) return null;

                // Responsive 16:9 wrapper; change paddingTop if you want a different ratio
                return (
                  <div className="my-8">
                    <div
                      className="relative w-full"
                      style={{ paddingTop: "56.25%" }}
                    >
                      <div
                        className="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-lg [&>iframe]:border [&>iframe]:border-gray-700"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </div>
                  </div>
                );
              },

              /* --- keep the rest of your mappers --- */
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

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-default">
          <div className="space-y-3">
            <h4 className="text-white font-roboto font-semibold">
              Share this article
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

        {/* COMMENT SECTION */}
        <CommentSection postId={post.uid} />

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-default">
          <h3 className="text-2xl font-bold text-white mb-6 font-roboto">
            Related Articles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.length === 0 && (
              <div className="text-gray-400 font-open-sans">
                No related articles found.
              </div>
            )}
            {relatedArticles.map((article) => {
              const articleUrl = `/blog/${article.uid}`;
              const articleImage = article.data.featured_image?.url;
              const articleImageAlt =
                article.data.featured_image?.alt ||
                article.data.title ||
                "Related article image";
              const articleTitle = article.data.title || "Untitled";
              const articleSummary =
                prismicH.asText(article.data.summary) || "";
              const articleDate = formatDate(article.data.published_date);
              const articleReadingTime = article.data.reading_time
                ? `${article.data.reading_time} min`
                : estimateReadingTime(article.data.content);
              return (
                <Link
                  key={article.uid}
                  href={articleUrl}
                  className="block group focus:outline-none focus:ring-2 focus:ring-[#fcee16] rounded-lg"
                  aria-label={`Read related article: ${articleTitle}`}
                  tabIndex={0}
                >
                  <div className="bg-[#1b1a1b]/80 border border-gray-700 hover:border-[#fcee16]/50 rounded-lg p-0 overflow-hidden transition-all duration-300 flex flex-col h-full">
                    {articleImage && (
                      <div className="relative aspect-[16/10] w-full h-40 overflow-hidden">
                        <Image
                          src={articleImage}
                          alt={articleImageAlt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={false}
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#fcee16] transition-colors duration-200 font-roboto mb-2">
                        {articleTitle}
                      </h4>
                      {articleSummary && (
                        <p className="text-gray-400 text-sm font-open-sans mb-3 line-clamp-3">
                          {articleSummary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto font-open-sans">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {articleDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {articleReadingTime} read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
}

// Generate metadata (no changes needed here)
export async function generateMetadata({ params }: BlogPageProps) {
  try {
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
