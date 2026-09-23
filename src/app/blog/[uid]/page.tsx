// app/blog/[uid]/page.tsx
//
// 24h, not 10 minutes. There are ~75,000 published articles; at 600s every
// crawler hit on a stale one rebuilt it, which made this route the largest
// single source of billed ISR writes — overwhelmingly for articles that had
// not changed since publication. Freshness now comes from invalidation
// instead of expiry: /api/revalidate-recent (cron) and /api/revalidate
// (WordPress webhook) invalidate the specific articles that were edited.
//
// This 24h value is the backstop for when both of those fail, which is why it
// isn't `false`. Do not lower it to buy freshness — add coverage to the
// invalidation routes instead.
export const revalidate = 86_400;

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
import { notFound, unstable_rethrow } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import ArticleGallery from "@/components/ArticleGallery";
import DataVizEmbeds, { type DatawrapperScript } from "@/components/DataVizEmbeds";
import {
  addTargetBlankToExternalLinks,
  extractGalleries,
  GALLERY_MARKER_RE,
  getCommentsByPostId,
  getPostBySlug,
  getPostSlugsForSitemap,
  getRelatedPosts,
  stripGalleryStyles,
  stripHtml,
  stripLeadingByline,
} from "../../../../lib/wordpress";
import type { Post } from "../../../../lib/wordpress";

interface BlogPageProps {
  params: Promise<{ uid: string }>;
}

// Prebuild the most recent articles at deploy time so the highest-traffic
// pages are served from ISR cache immediately instead of cold-rendering on
// first visit. Older/long-tail articles still render on-demand (fallback)
// and get cached after their first hit.
export async function generateStaticParams(): Promise<{ uid: string }[]> {
  const recent = await getPostSlugsForSitemap(1).catch(() => []);
  return recent.map((p) => ({ uid: p.slug }));
}

// WordPress article bodies legitimately embed video/social iframes (YouTube,
// Vimeo, X, Facebook, Issuu). <iframe> is stripped by default, so it's
// added back here — but only for these known-safe embed hosts, so a
// compromised/malicious post can't smuggle in an iframe pointing anywhere else.
const TRUSTED_EMBED_HOSTS = [
  "youtube.com",
  "youtube-nocookie.com",
  "vimeo.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "instagram.com",
  "issuu.com",
  // Data visualisations. flo.uri.sh is Flourish's direct iframe embed and
  // datawrapper.dwcdn.net serves Datawrapper's; the script-based forms of both
  // are handled by DataVizEmbeds instead.
  "flo.uri.sh",
  "datawrapper.dwcdn.net",
];

function isTrustedEmbedSrc(src: string): boolean {
  let host = "";
  try {
    host = new URL(src, "https://placeholder.invalid").hostname;
  } catch {
    return false;
  }
  return TRUSTED_EMBED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

// Datawrapper's script embed is <div id="datawrapper-vis-ID"> holding a
// <script src="https://datawrapper.dwcdn.net/ID/embed.js?dark=true"
// data-target="#datawrapper-vis-ID">. The sanitizer removes the script, so this
// reads it off the raw body first and DataVizEmbeds appends it again. The URL is
// rebuilt from the parsed chart ID rather than passed through, so only
// Datawrapper's own embed.js can ever be loaded this way.
const DATAWRAPPER_SCRIPT = /<script\b[^>]*>/gi;

function extractDatawrapperScripts(html: string): DatawrapperScript[] {
  const scripts: DatawrapperScript[] = [];
  for (const [tag] of html.matchAll(DATAWRAPPER_SCRIPT)) {
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    const target = tag.match(/\sdata-target=["']([^"']+)["']/i)?.[1];
    if (!src || !target || !/^#datawrapper-vis-[A-Za-z0-9]+$/.test(target)) continue;

    let url: URL;
    try {
      url = new URL(src, "https://placeholder.invalid");
    } catch {
      continue;
    }
    const id = url.pathname.match(/^\/([A-Za-z0-9]+)\/(?:\d+\/)?embed\.js$/)?.[1];
    if (url.hostname !== "datawrapper.dwcdn.net" || !id) continue;

    // The newsroom sets ?dark=true (the site is dark) and occasionally ?theme=;
    // carry those, drop anything else.
    const params = new URLSearchParams();
    for (const key of ["dark", "theme"]) {
      const value = url.searchParams.get(key);
      if (value && /^[\w-]+$/.test(value)) params.set(key, value);
    }
    const query = params.toString();
    scripts.push({
      src: `https://datawrapper.dwcdn.net/${id}/embed.js${query ? `?${query}` : ""}`,
      target,
    });
  }
  return scripts;
}

const ALLOWED_TAGS = [
  "a", "abbr", "b", "blockquote", "br", "caption", "cite", "code", "col",
  "colgroup", "dd", "del", "div", "dl", "dt", "em", "figcaption", "figure",
  "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "li", "mark",
  "ol", "p", "pre", "q", "s", "small", "span", "strong", "sub", "sup",
  "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul", "video",
  "audio", "source", "track", "iframe",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  "*": ["class", "id", "style", "title", "lang", "dir"],
  // Flourish (the newsroom's data-visualisation tool) marks up a chart as
  // <div class="flourish-embed" data-src="visualisation/123">. data-src is the
  // only thing telling embed.js which chart to draw, and stripping it left the
  // container inert — which is exactly why the charts stopped being
  // interactive. It is an inert data attribute, not a script or URL handler.
  div: ["data-src"],
  a: ["href", "name", "target", "rel"],
  img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
  video: ["src", "width", "height", "controls", "poster"],
  audio: ["src", "controls"],
  source: ["src", "srcset", "type", "media"],
  iframe: ["src", "allow", "allowfullscreen", "frameborder", "scrolling", "width", "height", "title", "aria-label", "loading"],
  table: ["width", "border", "cellpadding", "cellspacing"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
};

function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowProtocolRelative: true,
    // Defaults plus "noscript". Without it sanitize-html drops the <noscript>
    // wrapper but keeps its children, so an embed's no-JS fallback thumbnail
    // rendered as a plain <img> for everyone — a flat picture of a chart sitting
    // where the live chart belongs. Listing it here removes the tag and its
    // contents, so the real embed is the only thing left.
    nonTextTags: ["script", "style", "textarea", "option", "noscript"],
    // Drop any iframe whose src isn't one of the known-safe embed hosts.
    exclusiveFilter: (frame) =>
      frame.tag === "iframe" && !isTrustedEmbedSrc(frame.attribs.src ?? ""),
    // target="_blank" without rel="noopener noreferrer" lets the opened page
    // reach back into window.opener (reverse tabnabbing). Guarantee both
    // tokens on every target="_blank" anchor regardless of what rel the
    // source HTML supplied.
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target === "_blank") {
          const relTokens = new Set((attribs.rel ?? "").split(/\s+/).filter(Boolean));
          relTokens.add("noopener");
          relTokens.add("noreferrer");
          attribs.rel = Array.from(relTokens).join(" ");
        }
        return { tagName, attribs };
      },
    },
  });
}

const PROSE_CLASSES = `prose prose-base sm:prose-lg prose-invert max-w-none
            prose-p:text-gray-200 prose-p:leading-relaxed prose-p:text-base prose-p:sm:text-lg prose-p:font-open-sans prose-p:mb-7 sm:prose-p:mb-8
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
            [&_p]:mb-7 [&_p+p]:mt-0
            [&_figure]:!max-w-full [&_figure]:!w-full [&_figure]:!mt-8 [&_figure]:!mb-10
            [&_figure_img]:!w-full [&_figure_img]:!h-auto [&_figure_img]:!max-w-full [&_figure_img]:!mb-0
            [&_figcaption]:!mt-3 [&_figcaption]:!mb-0 [&_figcaption]:!text-sm [&_figcaption]:!text-gray-400 [&_figcaption]:!italic [&_figcaption]:!leading-snug
            [&_.wp-caption-text]:!mt-3 [&_.wp-caption-text]:!mb-0 [&_.wp-caption-text]:!text-sm [&_.wp-caption-text]:!text-gray-400 [&_.wp-caption-text]:!italic [&_.wp-caption-text]:!leading-snug
            [&_img]:!max-w-full [&_img]:!h-auto
            [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block`;

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

  const found = await getPostBySlug(resolvedParams.uid, revalidate).catch((error) => {
    unstable_rethrow(error);
    return null;
  });
  if (!found) notFound();
  const post: Post = found;

  let relatedArticles: Post[] = [];
  let initialComments: Awaited<ReturnType<typeof getCommentsByPostId>> = [];
  try {
    [relatedArticles, initialComments] = await Promise.all([
      getRelatedPosts(resolvedParams.uid, post.data.category, 3, revalidate),
      getCommentsByPostId(post.id, revalidate),
    ]);
  } catch (error) {
    unstable_rethrow(error);
    // Related articles / comments are supplementary — degrade gracefully
    // rather than 404ing an otherwise-valid article page.
  }

  const publishDate = formatDate(post.data.published_date);
  const updateDate = formatDate(post.data.updated_date);
  const readingTime = `${post.data.reading_time} min`;
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.dailyguardian.com.ph"}/blog/${post.uid}`;

  const { galleries, html: extracted } = extractGalleries(post.data.content);
  // A gallery that opens the story (photo essays) keeps its slot above the
  // byline; every other gallery renders where the editor placed it.
  let leadGallery: (typeof galleries)[number] | null = null;
  let contentWithoutGallery = extracted;
  const firstMarker = extracted.match(GALLERY_MARKER_RE);
  if (
    firstMarker?.index !== undefined &&
    !/<img\b/i.test(extracted.slice(0, firstMarker.index)) &&
    stripHtml(extracted.slice(0, firstMarker.index)).trim() === ""
  ) {
    leadGallery = galleries[Number(firstMarker[1])];
    contentWithoutGallery = extracted.slice(firstMarker.index + firstMarker[0].length);
  }
  const articleContent = sanitizeArticleHtml(
    addTargetBlankToExternalLinks(
      stripGalleryStyles(stripLeadingByline(contentWithoutGallery, post.data.author)),
    ),
  );
  // Odd entries are gallery indexes, even entries the HTML between them.
  const contentParts = articleContent.split(new RegExp(GALLERY_MARKER_RE.source, "g"));

  // Only stories that actually carry a chart pay for the loaders. See
  // DataVizEmbeds for why the scripts cannot come from the post body.
  const hasFlourishEmbed = articleContent.includes("flourish-embed");
  const datawrapperScripts = extractDatawrapperScripts(contentWithoutGallery);
  const hasDatawrapperIframe = articleContent.includes('id="datawrapper-chart-');

  // WordPress sets post_modified to the last save. For a scheduled story that
  // is *earlier* than the publish time — the newsroom writes in the evening and
  // schedules for just after midnight — so articles were showing "Updated
  // August 30" above a September 1 publish date. Editorial asked for the field
  // to go; suppressing it when it is not genuinely later keeps real corrections
  // visible while removing the nonsense. The tolerance stops a tidy-up minutes
  // after publishing from counting as an update.
  const UPDATE_TOLERANCE_MS = 5 * 60 * 1000;
  const publishedAt = Date.parse(post.data.published_date);
  const updatedAt = Date.parse(post.data.updated_date);
  const wasUpdatedAfterPublishing =
    Number.isFinite(publishedAt) &&
    Number.isFinite(updatedAt) &&
    updatedAt - publishedAt > UPDATE_TOLERANCE_MS;

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
        url: "https://www.dailyguardian.com.ph/black_dg.png",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
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
            {post.data.tags.map((tag) => (
              <Link
                key={tag}
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
          {post.data.subtitle && (
            <p className="-mt-2 sm:-mt-3 mb-4 sm:mb-6 text-base sm:text-lg italic text-gray-400 font-open-sans leading-snug">
              {post.data.subtitle}
            </p>
          )}

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
            <button
              type="button"
              aria-label="Bookmark article"
              className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200"
            >
              <Bookmark size={16} />
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={16} />
              <span className="text-sm font-open-sans">{initialComments.length}</span>
            </div>
          </div>
        </header>

        {/* Gallery — for photo-essay / td-gallery articles */}
        {leadGallery && <ArticleGallery images={leadGallery} />}

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
              {wasUpdatedAfterPublishing && updateDate !== publishDate && (
                <div className="flex items-center gap-1 font-open-sans">
                  <Clock size={11} />
                  <span>Updated {updateDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article Content (WordPress HTML), with galleries in place */}
        {contentParts.map((part, i) =>
          i % 2 === 1 ? (
            galleries[Number(part)] && (
              <ArticleGallery key={i} images={galleries[Number(part)]} />
            )
          ) : (
            part.trim() && (
              <div
                key={i}
                className={PROSE_CLASSES}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            )
          ),
        )}

        {(hasFlourishEmbed || datawrapperScripts.length > 0 || hasDatawrapperIframe) && (
          <DataVizEmbeds
            flourish={hasFlourishEmbed}
            datawrapperScripts={datawrapperScripts}
            datawrapperIframes={hasDatawrapperIframe}
          />
        )}

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
    const post = await getPostBySlug(resolvedParams.uid, revalidate);
    if (!post) return { title: "Article Not Found" };

    const url = `https://www.dailyguardian.com.ph/blog/${resolvedParams.uid}`;
    const rawDescription = post.data.meta_description || post.data.summary || "";
    const description = rawDescription.length > 155
      ? rawDescription.slice(0, 152) + "..."
      : rawDescription;
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
