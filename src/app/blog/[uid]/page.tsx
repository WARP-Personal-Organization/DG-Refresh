// app/blog/[uid]/page.tsx
export const revalidate = 600;

import CommentSection from "@/components/CommentSection";
import ShareButton from "@/components/ShareButton";
import {
  Bookmark,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCommentsByPostId,
  getPostBySlug,
  getRelatedPosts,
  stripImagesFromContent,
} from "../../../../lib/wordpress";
import type { ContentImage, Post } from "../../../../lib/wordpress";

interface BlogPageProps {
  params: Promise<{ uid: string }>;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogPost({ params }: BlogPageProps) {
  const resolvedParams = await params;
  let post: Post;
  let relatedArticles: Post[] = [];

  let initialComments: Awaited<ReturnType<typeof getCommentsByPostId>> = [];

  try {
    const found = await getPostBySlug(resolvedParams.uid);
    if (!found) notFound();
    post = found;

    [relatedArticles, initialComments] = await Promise.all([
      getRelatedPosts(resolvedParams.uid, post.data.category, 3),
      getCommentsByPostId(post.id),
    ]);
  } catch {
    notFound();
  }

  const publishDate = formatDate(post.data.published_date);
  const updateDate = formatDate(post.data.updated_date);
  const readingTime = `${post.data.reading_time} min`;
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://dailyguardian.com.ph"}/blog/${post.uid}`;

  // Show the featured image once at the top of the article.
  // Body images remain inline where the editor placed them — only the featured
  // image is stripped from the body to avoid rendering it twice.
  const featuredImage: ContentImage | null = post.data.featured_image?.url
    ? {
        url: post.data.featured_image.url,
        alt: post.data.featured_image.alt || post.data.title,
      }
    : null;
  const articleContent = stripImagesFromContent(
    post.data.content,
    featuredImage ? [featuredImage.url] : [],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.data.title,
    description: post.data.meta_description || post.data.summary || "",
    url: articleUrl,
    datePublished: post.data.published_date,
    dateModified: post.data.updated_date || post.data.published_date,
    author: {
      "@type": "Person",
      name: post.data.author || "Daily Guardian",
    },
    publisher: {
      "@type": "Organization",
      name: "Daily Guardian",
      logo: {
        "@type": "ImageObject",
        url: "https://dailyguardian.com.ph/black_dg.png",
      },
    },
    image: post.data.featured_image?.url
      ? {
          "@type": "ImageObject",
          url: post.data.featured_image.url,
          width: 1200,
          height: 630,
        }
      : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  return (
    <div className="bg-[#1b1a1b] min-h-screen font-open-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <article className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Tags & Badges */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
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
            {post.data.tags.map((tag, index) => (
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
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-roboto font-bold text-white leading-tight mb-4 sm:mb-6">
            {post.data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 py-3 sm:py-4 border-t border-b border-gray-700">
            <span className="flex items-center gap-2 text-gray-400 text-sm font-open-sans">
              <Clock size={16} className="text-[#fcee16]" />
              {readingTime} read
            </span>
            <ShareButton
              title={post.data.title || "Article"}
              url={articleUrl}
              text={post.data.summary || post.data.title || "Check out this article"}
            />
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200">
              <Bookmark size={16} />
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={16} />
              <span className="text-sm font-open-sans">{initialComments.length}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {featuredImage && (
          <figure className="mb-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-700">
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || "Article image"}
                fill
                className="object-cover"
                priority
              />
            </div>
            {featuredImage.alt && (
              <figcaption className="mt-3 text-sm text-gray-400 italic font-open-sans">
                {featuredImage.alt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Lede / summary — sits below the image, above the byline */}
        {post.data.summary && (
          <div className="text-base sm:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8 font-light font-open-sans">
            <p>{post.data.summary}</p>
          </div>
        )}

        {/* Author and Date Info */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-default">
          <div className="w-10 h-10 bg-[#fcee16] rounded-full flex items-center justify-center shrink-0">
            <User size={18} className="text-[#1b1a1b]" />
          </div>
          <div>
            {post.data.author && (
              <p className="font-medium text-white text-sm sm:text-base font-open-sans">
                By {post.data.author}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400 mt-0.5">
              <div className="flex items-center gap-1 font-open-sans">
                <Calendar size={11} />
                <time>{publishDate}</time>
              </div>
              {updateDate && updateDate !== publishDate && (
                <div className="flex items-center gap-1 font-open-sans">
                  <Clock size={11} />
                  <span>Updated {updateDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article Content (WordPress HTML) */}
        <div
          className="prose prose-base sm:prose-lg prose-invert max-w-none
            prose-p:text-gray-200 prose-p:leading-relaxed prose-p:text-base prose-p:sm:text-lg prose-p:font-open-sans prose-p:mb-5 sm:prose-p:mb-6
            prose-h1:text-white prose-h1:font-roboto prose-h1:mt-6 prose-h1:mb-3 sm:prose-h1:mt-8 sm:prose-h1:mb-4
            prose-h2:text-white prose-h2:font-roboto prose-h2:mt-6 prose-h2:mb-3 sm:prose-h2:mt-8 sm:prose-h2:mb-4
            prose-h3:text-white prose-h3:font-roboto prose-h3:mt-5 prose-h3:mb-2 sm:prose-h3:mt-6 sm:prose-h3:mb-3
            prose-strong:text-white prose-strong:font-bold
            prose-em:text-[#fcee16] prose-em:italic
            prose-a:text-[#fcee16] prose-a:underline hover:prose-a:text-[#fcee16]/80
            prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:text-gray-200 prose-li:mb-2
            prose-img:rounded-lg prose-img:border prose-img:border-gray-700 prose-img:w-full prose-img:h-auto
            prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-sm
            prose-code:text-green-400 prose-code:text-sm
            [&_p]:mb-5 [&_p+p]:mt-0
            [&_figure]:!max-w-full [&_figure]:!w-full [&_figure_img]:!w-full [&_figure_img]:!h-auto [&_figure_img]:!max-w-full
            [&_img]:!max-w-full [&_img]:!h-auto
            [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />

        {/* Comment Section */}
        <CommentSection postId={post.id} initialComments={initialComments} />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-default">
          <div className="space-y-3">
            <h4 className="text-white font-roboto font-semibold">
              Share this article
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/DailyGuardianPH/"
                className="w-11 h-11 sm:w-9 sm:h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Facebook"
              >
                <Facebook
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://x.com/dailyguardianph"
                className="w-11 h-11 sm:w-9 sm:h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="X (Twitter)"
              >
                <Twitter
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://www.instagram.com/dailyguardianph"
                className="w-11 h-11 sm:w-9 sm:h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                aria-label="Instagram"
              >
                <Instagram
                  size={18}
                  className="text-gray-400 group-hover:text-[#1b1a1b]"
                />
              </Link>
              <Link
                href="https://youtube.com/dailyguardian"
                className="w-11 h-11 sm:w-9 sm:h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
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
              const articleImage = article.data.featured_image?.url;
              const articleTitle = article.data.title || "Untitled";
              const articleDate = formatDate(article.data.published_date);
              return (
                <Link
                  key={article.uid}
                  href={`/blog/${article.uid}`}
                  className="block group focus:outline-none focus:ring-2 focus:ring-[#fcee16] rounded-lg"
                  aria-label={`Read related article: ${articleTitle}`}
                >
                  <div className="bg-[#1b1a1b]/80 border border-gray-700 hover:border-[#fcee16]/50 rounded-lg p-0 overflow-hidden transition-all duration-300 flex flex-col h-full">
                    {articleImage && (
                      <div className="relative aspect-[16/10] w-full h-40 overflow-hidden">
                        <Image
                          src={articleImage}
                          alt={article.data.featured_image?.alt || articleTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#fcee16] transition-colors duration-200 font-roboto mb-2">
                        {articleTitle}
                      </h4>
                      {article.data.summary && (
                        <p className="text-gray-400 text-sm font-open-sans mb-3 line-clamp-3">
                          {article.data.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto font-open-sans">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {articleDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {article.data.reading_time} min read
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

export async function generateMetadata({ params }: BlogPageProps) {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.uid);
    if (!post) return { title: "Article Not Found" };

    const url = `https://dailyguardian.com.ph/blog/${resolvedParams.uid}`;
    const description = post.data.meta_description || post.data.summary || "";
    const featured = post.data.featured_image;
    // Logo fallback uses the wordmark's real dimensions so FB doesn't crop based
    // on a fabricated 1200x630 claim. A dedicated 1200x630 share asset would
    // render larger in feeds — drop one at /public/black_dg.png to override.
    const ogImage = featured?.url
      ? {
          url: featured.url,
          width: featured.width ?? 1200,
          height: featured.height ?? 630,
          alt: featured.alt || post.data.title,
        }
      : { url: "/black_dg.png", width: 536, height: 128, alt: "Daily Guardian" };

    return {
      title: post.data.title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title: post.data.title,
        description,
        siteName: "Daily Guardian",
        publishedTime: post.data.published_date,
        authors: post.data.author ? [post.data.author] : ["Daily Guardian"],
        section: post.data.category || "News",
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: post.data.title,
        description,
        images: [ogImage.url],
      },
    };
  } catch {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }
}
