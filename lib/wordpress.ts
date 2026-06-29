// lib/wordpress.ts
// WordPress REST API integration for Daily Guardian
// API base: https://dailyguardian.com.ph/wp-json/wp/v2

const WP_API_BASE = process.env.WORDPRESS_API_URL ?? "https://old.dailyguardian.com.ph/wp-json/wp/v2";

// ─── Raw WordPress API Types ──────────────────────────────────────────────────

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  sticky: boolean;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      description: string;
      slug: string;
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }>;
    "wp:term"?: Array<
      Array<{ id: number; name: string; slug: string; taxonomy: string }>
    >;
  };
  // Yoast SEO fallback — used when /wp-json/wp/v2/media/{id} returns rest_forbidden
  // for newly uploaded attachments, which empties wp:featuredmedia in _embed.
  yoast_head_json?: {
    og_image?: Array<{ url: string; width?: number; height?: number; type?: string }>;
  };
}

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
  avatar_urls: Record<string, string>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
}

// ─── Unified App Types ────────────────────────────────────────────────────────

export interface Post {
  id: number;
  uid: string;
  data: {
    title: string;
    summary: string;
    content: string;
    category: string;
    subcategory: string;
    locality: string; // specific WV province for local news (e.g. "Negros", "Capiz"); "" otherwise
    is_featured: boolean;
    is_breaking_news: boolean;
    editors_pick: boolean;
    featured_image: { url: string | null; alt: string; width?: number; height?: number } | null;
    author: string;
    published_date: string;
    updated_date: string;
    reading_time: number;
    tags: string[];
    meta_description: string;
    original_link: string;
  };
}

export interface Author {
  id: number;
  uid: string;
  data: {
    name: string;
    title: string;
    bio: string;
    email: string;
    avatar: { url: string | null; alt: string };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rewriteMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace("https://dailyguardian.com.ph/", "https://old.dailyguardian.com.ph/");
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "…")
    .replace(/&#8230;/g, "…")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/\s*\[\u2026\]\s*$/, "")
    .trim();
}

// Strip the featured image from the article body if WP duplicated it there.
export function stripDuplicateFeaturedImage(
  html: string,
  featuredUrl: string | null | undefined,
): string {
  if (!featuredUrl || !html) return html;
  return stripImagesFromContent(html, [featuredUrl]);
}

// Normalized identity for an uploaded image, collapsing the variant suffixes
// DG's CMS and WordPress generate for the SAME source photo:
//   -1024x683 (size), -scaled/-rotated (WP), -w/-wm/-web (DG web/watermark copy),
//   and -1/-2/-3 (WP re-upload counters added on filename clashes).
// Two URLs that normalize to the same key are treated as the same picture, so a
// post whose featured image is "foo-w.jpg" and body image is "foo-1.jpg" no
// longer renders the same photo twice. Trade-off: a genuine sequence like
// photo-1.jpg / photo-2.jpg also collapses — but DG's real multi-photo galleries
// use distinct descriptive filenames, not bare numeric counters.
function imageKey(url: string): string {
  const file = url.split("/").pop()?.split("?")[0] ?? url;
  const dot = file.lastIndexOf(".");
  let name = dot === -1 ? file : file.slice(0, dot);
  const ext = dot === -1 ? "" : file.slice(dot).toLowerCase();
  let prev = "";
  while (prev !== name) {
    prev = name;
    name = name
      .replace(/-\d+x\d+$/i, "") // size variant
      .replace(/-(scaled|rotated)$/i, "") // WP markers
      .replace(/-(w|wm|web)$/i, "") // DG web/watermark copy
      .replace(/-\d+$/, "") // WP re-upload counter
      .replace(/\d+$/, ""); // DG bare-digit suffix (e.g. hub → hub1)
  }
  return (name + ext).toLowerCase();
}

// Remove from the body any <img> (and its <figure>/<a> wrapper) whose image
// matches — by normalized key — one of the given URLs. Matching by key (not by
// substring) means a body copy named "-1" is stripped even when the gallery
// kept the "-w" variant of the same photo.
export function stripImagesFromContent(html: string, urls: string[]): string {
  if (!html || urls.length === 0) return html;
  const keys = new Set(urls.map(imageKey));
  const blockMatches = (block: string): boolean => {
    const src = block.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    return !!src && keys.has(imageKey(src));
  };
  return html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, (b) =>
      blockMatches(b) ? "" : b,
    )
    .replace(/<img[^>]*>/gi, (t) => (blockMatches(t) ? "" : t));
}

// Pull every <img src="..."> from WP article HTML, with alt text when present.
// Used to detect multi-image posts and render them in a top-of-article carousel.
export interface ContentImage {
  url: string;
  alt: string;
}

export function extractContentImages(html: string): ContentImage[] {
  if (!html) return [];
  const results: ContentImage[] = [];
  const re = /<img[^>]*>/gi;
  const matches = html.match(re) ?? [];
  for (const tag of matches) {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "";
    results.push({ url: rewriteMediaUrl(src) ?? src, alt });
  }
  return results;
}

// Deduplicate images that are the same picture (see imageKey for what counts as
// "same" — size, scaled, web/watermark, and re-upload-counter variants).
export function dedupeImagesByFilename(images: ContentImage[]): ContentImage[] {
  const seen = new Set<string>();
  const out: ContentImage[] = [];
  for (const img of images) {
    const key = imageKey(img.url);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(img);
  }
  return out;
}

function estimateReadingTime(htmlContent: string): number {
  const text = stripHtml(htmlContent);
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 250));
}

// ─── Category Mapping ─────────────────────────────────────────────────────────
// Map WordPress category slugs to app category/subcategory values.
// Update these slugs to match the actual categories on dailyguardian.com.ph.

const CATEGORY_MAP: Record<string, string> = {
  news: "news",
  "banner-news": "news",
  "banner news": "news",
  sports: "sports",
  business: "business",
  features: "feature",
  feature: "feature",
  initiatives: "initiatives",
  opinion: "opinion",
  voices: "voices",
  visons: "voices",
  editorial: "news",
  entertainment: "feature",
  lifestyle: "feature",
  health: "feature",
  technology: "feature",
  // Add more as needed after inspecting /wp-json/wp/v2/categories
};

const SUBCATEGORY_MAP: Record<string, string> = {
  local: "local",
  "local-news": "local",
  iloilo: "local",
  "western-visayas": "local",
  negros: "negros",
  "negros-news": "negros",
  bacolod: "negros",
  national: "national-news",
  "national-news": "national-news",
  editorial: "editorial",
  "the-dg-view": "editorial",
  // Add more as needed after inspecting /wp-json/wp/v2/categories
};

// Specific WV provinces/cities → display name. Used to label local news by its
// actual locality (NEGROS, CAPIZ, …) instead of the umbrella "LOCAL". Iloilo is
// deliberately excluded so home-province posts stay "Local".
const LOCALITY_BY_SLUG: Record<string, string> = {
  negros: "Negros",
  "negros-news": "Negros",
  "negros-occidental": "Negros",
  "negros-oriental": "Negros",
  bacolod: "Bacolod",
  capiz: "Capiz",
  roxas: "Capiz",
  antique: "Antique",
  aklan: "Aklan",
  kalibo: "Aklan",
  boracay: "Aklan",
  guimaras: "Guimaras",
};

// Best-effort province from a headline, used only when a news post has no
// province category. Word-boundary matched to avoid false hits; "Roxas" must be
// "Roxas City" (the place) so it doesn't catch the surname. Iloilo is omitted so
// home-province stories stay "Local".
function localityFromTitle(title: string): string {
  const t = title.toLowerCase();
  const checks: Array<[RegExp, string]> = [
    [/\bguimaras\b/, "Guimaras"],
    [/\bbacolod\b/, "Bacolod"],
    [/\bnegros\b/, "Negros"],
    [/\bcapiz\b/, "Capiz"],
    [/\broxas city\b/, "Capiz"],
    [/\bantique\b/, "Antique"],
    [/\b(?:aklan|kalibo|boracay)\b/, "Aklan"],
  ];
  for (const [re, name] of checks) if (re.test(t)) return name;
  return "";
}

function mapCategory(slugs: string[]): string {
  for (const slug of slugs) {
    if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug];
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
      if (slug.includes(key)) return val;
    }
  }
  return "news";
}

function mapSubcategory(slugs: string[]): string {
  for (const slug of slugs) {
    if (SUBCATEGORY_MAP[slug]) return SUBCATEGORY_MAP[slug];
    for (const [key, val] of Object.entries(SUBCATEGORY_MAP)) {
      if (slug.includes(key)) return val;
    }
  }
  return "";
}

// ─── Transform Functions ──────────────────────────────────────────────────────

export function transformPost(wpPost: WPPost): Post {
  const embedded = wpPost._embedded;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  const authorItem = embedded?.author?.[0];
  const terms = embedded?.["wp:term"] ?? [];

  const categoryTerms =
    terms.find((group) => group.some((t) => t.taxonomy === "category")) ?? [];
  const tagTerms =
    terms.find((group) => group.some((t) => t.taxonomy === "post_tag")) ?? [];

  // WP post_tag is always empty for DG posts — use category names as tags instead.
  // Filter out the generic top-level section slugs so only meaningful labels remain
  // (e.g. "IMPULSES", "LOCAL NEWS", "ABOVE THE BELT", not "OPINION" / "NEWS").
  const TOP_LEVEL_SLUGS = new Set([
    ...Object.keys(CATEGORY_MAP),
    ...Object.keys(SUBCATEGORY_MAP),
    "uncategorized",
    "general",
  ]);
  const derivedTags =
    tagTerms.length > 0
      ? tagTerms.map((t) => t.name)
      : categoryTerms
          .filter((t) => !TOP_LEVEL_SLUGS.has(t.slug))
          .map((t) => t.name);

  const categorySlugs = categoryTerms.map((c) => c.slug);
  const category = mapCategory(categorySlugs);
  const subcategoryMapped = mapSubcategory(categorySlugs);

  // Column / series name: the secondary category that isn't a top-level section slug.
  // e.g. opinion post → "IMPULSES", "ABOVE THE BELT", "MAAYONG AGA, ILOILO!"
  // e.g. local news   → already handled by subcategoryMapped ("local", "negros", etc.)
  const SECTION_SLUGS = new Set([
    ...Object.keys(CATEGORY_MAP),
    ...Object.keys(SUBCATEGORY_MAP),
    "uncategorized",
    "general",
  ]);
  const columnTerm = categoryTerms.find((t) => !SECTION_SLUGS.has(t.slug));
  const subcategory = subcategoryMapped || columnTerm?.name || "";

  // Specific Western Visayas locality shown in hero/top-story labels in place of
  // the generic "LOCAL" (e.g. NEGROS, CAPIZ). Only for news posts. Prefer a
  // province category; otherwise fall back to a province named in the headline
  // ("…ferry shortage in Guimaras" → Guimaras). Iloilo is intentionally omitted —
  // it's the home bucket and stays "Local". Region-wide/place-less headlines
  // (e.g. "Western Visayas opens…") also stay "Local".
  let locality = "";
  if (category === "news") {
    const localityTerm = categorySlugs.find((s) => LOCALITY_BY_SLUG[s]);
    locality = localityTerm
      ? LOCALITY_BY_SLUG[localityTerm]
      : localityFromTitle(stripHtml(wpPost.title?.rendered ?? ""));
  }

  const rawContent = wpPost.content?.rendered ?? "";
  const rawExcerpt = stripHtml(wpPost.excerpt?.rendered ?? "");

  // Extract real columnist name from the content's first paragraph.
  // DG marks the byline as: <p>By <em>Author Name</em></p>
  // This is unambiguous — the <em> tag wraps exactly the name, nothing else.
  const bylineEmMatch = rawContent.match(
    /<p[^>]*>\s*By\s+<em>([^<]+)<\/em>\s*<\/p>/i,
  );
  const bylineName = bylineEmMatch?.[1]?.trim() ?? null;

  const wpAuthorName = authorItem?.name ?? "";
  const isGenericUser =
    !wpAuthorName ||
    wpAuthorName.toLowerCase().includes("daily guardian") ||
    wpAuthorName.toLowerCase() === "staff writer";
  const author = (!isGenericUser ? wpAuthorName : null) ?? bylineName ?? "";

  // Strip "By [Name]" from the excerpt so article summaries start cleanly.
  const excerpt = bylineName
    ? rawExcerpt
        .replace(
          new RegExp(
            `^By\\s+${bylineName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`,
            "i",
          ),
          "",
        )
        .trim()
    : rawExcerpt;

  return {
    id: wpPost.id,
    uid: wpPost.slug,
    data: {
      title: stripHtml(wpPost.title?.rendered ?? ""),
      summary: excerpt,
      content: rawContent,
      category,
      subcategory,
      locality,
      is_featured: wpPost.sticky,
      is_breaking_news: false,
      editors_pick: false,
      featured_image: (() => {
        if (media?.source_url) {
          return {
            url: rewriteMediaUrl(media.source_url) ?? media.source_url,
            alt: media.alt_text || stripHtml(wpPost.title?.rendered ?? ""),
            width: media.media_details?.width,
            height: media.media_details?.height,
          };
        }
        const og = wpPost.yoast_head_json?.og_image?.[0];
        if (og?.url) {
          return {
            url: rewriteMediaUrl(og.url) ?? og.url,
            alt: stripHtml(wpPost.title?.rendered ?? ""),
            width: og.width,
            height: og.height,
          };
        }
        return null;
      })(),
      author,
      published_date: wpPost.date,
      updated_date: wpPost.modified,
      reading_time: estimateReadingTime(rawContent),
      tags: derivedTags,
      meta_description: excerpt.substring(0, 160),
      original_link: wpPost.link ?? "",
    },
  };
}

export function transformAuthor(wpUser: WPUser): Author {
  const avatarUrl =
    wpUser.avatar_urls?.["96"] || wpUser.avatar_urls?.["48"] || null;
  return {
    id: wpUser.id,
    uid: wpUser.slug,
    data: {
      name: wpUser.name,
      title: "",
      bio: wpUser.description,
      email: "",
      avatar: { url: avatarUrl, alt: wpUser.name },
    },
  };
}

// ─── API Fetch ────────────────────────────────────────────────────────────────

// WP server can be slow — 15 s gives enough headroom without hanging the page.
const DEFAULT_TIMEOUT_MS = 15_000;

// AbortController properly cancels the in-flight HTTP request when the timeout
// fires, freeing server connections. The old Promise.race approach left the
// underlying fetch running even after the race resolved.
function timedAbort(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  revalidate = 300,
): Promise<T> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  );

  const { signal, clear } = timedAbort(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal,
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`WordPress API error ${res.status}: ${url.pathname}${url.search}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`WP API timeout: ${url.pathname}`);
    }
    throw err;
  } finally {
    clear();
  }
}

async function wpFetchPaginated<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  revalidate = 300,
): Promise<{ data: T; totalPages: number; total: number }> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  );

  const { signal, clear } = timedAbort(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal,
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`WordPress API error ${res.status}: ${url.pathname}${url.search}`);
    }
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
    const total = parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
    const data = (await res.json()) as T;
    return { data, totalPages, total };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`WP API timeout: ${url.pathname}`);
    }
    throw err;
  } finally {
    clear();
  }
}

// Batch-resolve multiple category slugs → IDs in ONE request instead of N.
// Uses PHP array syntax (slug[]=a&slug[]=b) which WP REST API parses natively.
// Categories rarely change → cache for 24 hours to nearly eliminate this call.
async function resolveCategoryIds(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];

  const url = new URL(`${WP_API_BASE}/categories`);
  slugs.forEach((s) => url.searchParams.append("slug[]", s));
  url.searchParams.set("per_page", "100");
  url.searchParams.set("_fields", "id,slug");

  const { signal, clear } = timedAbort(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal,
      next: { revalidate: 86_400 }, // 24 h — categories are stable
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const categories = (await res.json()) as Array<{ id: number; slug: string }>;
    const wanted = new Set(slugs);
    return categories.filter((c) => wanted.has(c.slug)).map((c) => c.id);
  } catch {
    return [];
  } finally {
    clear();
  }
}

// ─── App category/subcategory → WP category slug(s) ──────────────────────────
// Used to resolve paginated queries from the category/subcategory pages.

const APP_CATEGORY_WP_SLUGS: Record<string, string[]> = {
  news: ["news"],
  sports: ["sports"],
  business: ["business"],
  feature: [
    "features",
    "entertainment",
    "lifestyle",
    "health",
    "technology",
    "education",
    "environment",
    "arts-and-culture",
    "travel",
    "tourism",
    "society",
  ],
  initiatives: ["initiative"],
  opinion: ["opinion"],
  voices: ["opinion"],
};

const APP_SUBCATEGORY_WP_SLUGS: Record<string, string[]> = {
  local: ["local-news"],
  negros: ["negros"],
  "national-news": ["nation"],
  editorial: ["editorial"],
  capiz: ["capiz"],
  "facts-first-ph": ["facts-first-ph"],
  motoring: ["motoring"],
  "tech-talk": ["tecktalk"],
  health: ["health"],
  travel: ["travel"],
  entertainment: ["entertainment"],
  lifestyle: ["lifestyle"],
  "arts-and-culture": ["arts-and-culture"],
  education: ["education"],
  environment: ["environment"],
  "fashion-fridays": ["fashion-fridays"],
  empower: ["empower"],
  "global-shapers-iloilo": ["global-shapers-iloilo"],
  "zero-day": ["zero-day"],
};

export function getWPSlugsForCategory(appSlug: string): string[] {
  return APP_CATEGORY_WP_SLUGS[appSlug] ?? [appSlug];
}

export function getWPSlugsForSubcategory(appSlug: string): string[] {
  return APP_SUBCATEGORY_WP_SLUGS[appSlug] ?? [appSlug];
}

// ─── Public API Functions ─────────────────────────────────────────────────────

// Lightweight fetch for layout/header — no _embed, fewer posts, essential fields only.
// Much faster than getAllPosts; use this in the root layout to avoid timeouts.
export async function getLayoutPosts(perPage = 10): Promise<Post[]> {
  const wpPosts = await wpFetch<WPPost[]>("/posts", {
    per_page: perPage,
    status: "publish",
    orderby: "date",
    order: "desc",
    _fields: "id,slug,title,excerpt,sticky",
  }).catch(() => [] as WPPost[]);
  return wpPosts.map(transformPost);
}

export async function getAllPosts(perPage = 40): Promise<Post[]> {
  const wpPosts = await wpFetch<WPPost[]>("/posts", {
    per_page: perPage,
    _embed: 1,
    status: "publish",
    orderby: "date",
    order: "desc",
  });
  return wpPosts.map(transformPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const wpPosts = await wpFetch<WPPost[]>("/posts", { slug, _embed: 1 });
  if (!wpPosts[0]) return null;
  return transformPost(wpPosts[0]);
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3,
): Promise<Post[]> {
  // Re-uses the same cached fetch as getAllPosts — no extra network call within the same revalidation window
  const allPosts = await getAllPosts(30);
  return allPosts
    .filter((p) => p.uid !== currentSlug && p.data.category === category)
    .slice(0, limit);
}

export async function getPostsByCategory(
  categorySlug: string,
  perPage = 20,
  page = 1,
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
  const categories = await wpFetch<WPCategory[]>("/categories", {
    slug: categorySlug,
  });
  if (!categories[0]) return { posts: [], totalPages: 0, total: 0 };

  const { data, totalPages, total } = await wpFetchPaginated<WPPost[]>(
    "/posts",
    {
      categories: categories[0].id,
      per_page: perPage,
      page,
      _embed: 1,
      orderby: "date",
      order: "desc",
    },
  );
  return { posts: data.map(transformPost), totalPages, total };
}

// Fetch banner-news posts and group them by subcategory/category
// Used to populate section heroes with banner news relevant to each section
export async function getBannerNewsBySubcategory(
  perPage = 30,
): Promise<Record<string, Post[]>> {
  const { posts } = await getPostsByCategorySlugs(
    ["banner-news", "banner news"],
    perPage,
  );

  const grouped: Record<string, Post[]> = {};
  for (const post of posts) {
    const key = post.data.subcategory || post.data.category || "news";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  }
  return grouped;
}

// Resolve multiple WP category slugs → IDs in ONE batched request, then fetch posts.
// Previously made N separate /categories calls (one per slug). Now a single request
// handles all slugs, cached for 24 hours since categories rarely change.
export async function getPostsByCategorySlugs(
  slugs: string[],
  perPage = 20,
  page = 1,
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
  const ids = await resolveCategoryIds(slugs).catch(() => [] as number[]);

  if (ids.length === 0) {
    return { posts: [], totalPages: 1, total: 0 };
  }

  try {
    const { data, totalPages, total } = await wpFetchPaginated<WPPost[]>(
      "/posts",
      {
        categories: ids.join(","),
        per_page: perPage,
        page,
        _embed: 1,
        orderby: "date",
        order: "desc",
      },
    );
    return { posts: data.map(transformPost), totalPages, total };
  } catch (err) {
    console.error("Failed to fetch posts for category IDs:", ids, err);
    return { posts: [], totalPages: 1, total: 0 };
  }
}

// Convert an author name to a URL-safe slug
// e.g. "Atty. Eduardo T. Reyes III" → "atty-eduardo-t-reyes-iii"
export function authorToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // drop punctuation (dots, commas, etc.)
    .trim()
    .replace(/\s+/g, "-");
}

// Normalize a name for loose comparison (remove dots, lowercase, collapse spaces)
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

// Fetch opinion posts by a specific columnist, matched via WP full-text search
// then filtered to only posts where the extracted byline matches the author.
export async function getOpinionPostsByAuthor(
  authorName: string,
  perPage = 12,
  page = 1,
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
  const cats = await wpFetch<WPCategory[]>("/categories", {
    slug: "opinion",
  }).catch(() => []);
  const catId = cats[0]?.id;
  if (!catId) return { posts: [], totalPages: 1, total: 0 };

  const { data, totalPages, total } = await wpFetchPaginated<WPPost[]>(
    "/posts",
    {
      categories: catId,
      search: authorName,
      per_page: perPage,
      page,
      _embed: 1,
      orderby: "date",
      order: "desc",
    },
  );

  const target = normalizeName(authorName);
  const posts = data
    .map(transformPost)
    .filter((p) => normalizeName(p.data.author) === target);

  return { posts, totalPages, total };
}

// One entry per columnist for the Opinion directory.
export interface ColumnistSummary {
  column: string; // the column's display title, e.g. "PROMETHEUS"
  author: string; // the columnist's name, e.g. "Lcid Crescent Fernandez"
  slug: string; // WP category slug — links to the column's archive
  image: { url: string; alt: string } | null;
}

// Curated columnist roster — mirrors the old site's Opinion landing page.
// Each column is a WP category; deriving this list from post bylines proved
// unreliable (bylines come in several formats and the WP author is generic),
// so the roster is fixed here. `headshot` is the columnist's portrait pulled
// from the old site's media library (the column/author banner, face on the
// left — see ColumnistCard's object-left crop). When set, it's used directly;
// otherwise we fall back to the column's latest post banner (fetchColumnImage).
// To add/remove a columnist, edit this list. Slugs are real opinion categories.
const OPINION_ROSTER: ReadonlyArray<{
  column: string;
  slug: string;
  author: string;
  headshot?: string;
}> = [
  { column: "EDUCATION UPDATES", slug: "education-updates", author: "Dr. Rex Casiple", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/EDUCATION-UPDATES.png" },
  { column: "REFLECTIONS", slug: "reflections", author: "Fr. Roy Cimagala", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/REFLECTIONS.png" },
  { column: "HOT & SPICY", slug: "hot-spicy", author: "Artchil Fernandez", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/HOT-SPICY-1-1.png" },
  { column: "PROMETHEUS", slug: "prometheus", author: "Lcid Crescent Fernandez", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/prometheus-x-Lcid-Crescent-Fernandez-VP-Externalnew.jpg" },
  { column: "BARE FACTS", slug: "bare-facts", author: "Engr. Edgar Mana-ay", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/bare-facts2023.jpg" },
  { column: "FOCUS", slug: "focus", author: "Modesto P. Sa-onoy", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/focus-x-Modesto-Sa-onoy-23.jpg" },
  { column: "BEYOND THE NUMBERS", slug: "beyond-the-numbers", author: "John Carlo Tria", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/beyond-the-numbers1.jpg" },
  { column: "ABOVE THE BELT", slug: "above-the-belt", author: "Alex P. Vidal", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/ABOVE-THE-BELT.png" },
  { column: "ON WHITSUN WINGS", slug: "on-whitsun-wings", author: "Lucell Larawan", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/on-whitsun1.jpg" },
  { column: "COFFEEBREAK", slug: "coffeebreak", author: 'Manuel "Boy" Mejorada', headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/coffeebreak1.jpg" },
  { column: "MIDDLE CLASS ICONOCLAST", slug: "middle-class-iconoclast", author: "Reyshimar Arguelles", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/middle-class-iconoclast.jpg" },
  { column: "POST AND LINTEL", slug: "post-and-lintel", author: "Arch. Eric L. Demingoy", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/post-and-lintel1.jpg" },
  { column: "SHOUT OUT", slug: "shout-out", author: "Francis Allan L. Angelo", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/shout-out1.jpg" },
  { column: "COLUMNY", slug: "columny", author: "Limuel S. Celebria", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2025/07/Lemonade-xLimuel-S-Celebria.jpg" },
  { column: "LEGAL HARBINGER", slug: "legal-harbinger", author: "Atty. Eduardo Reyes III", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/Atty-Eduardo-Reyes-III-x-Legal-Harbinger-23.jpg" },
  { column: "CRUISING BY", slug: "cruising-by", author: "Terri Amador", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/cruising-by-TERRI-AMADOR-a.jpg" },
  { column: "ZOOMER THOUGHTS", slug: "zoomer-thoughts", author: "Joshua Corcuera", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/04/Zoomer-Thoughts.png" },
  { column: "BUSINESS OBSERVER", slug: "business-observer", author: "Art Jimenez", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/02/business-observer-x-Art-Jimenez.jpg" },
  { column: "PEOPLE POWWOW", slug: "people-powwow", author: "Herbert Vego", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2022/10/PEOPLE-POWWOW-x-Herbert-Vego-1-new.jpg" },
  { column: "IMPULSES", slug: "impulses", author: "Dr. Herman M. Lagon", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2025/05/Herman-M-Lagon-x-Impulses.jpg" },
  { column: "AMICUS CURIOUS", slug: "amicus-curious", author: "Jose Mari BFU Tirol", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/07/Amicus-Curious-x-Jose-Mari-BFU-Tirol.jpg" },
  { column: "ILONGGO ENGINEER", slug: "ilonggo-engineer", author: "Engr. Ray Adrian Macalalag", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2025/01/Ilonggo-Engineer-x-Ray-Adrian-Macalalag-24.jpg" },
  { column: "LAYLA", slug: "layla", author: "Hera Barrameda", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/layla-x-hera-barrameda-23.jpg" },
  { column: "SO TO SAY", slug: "so-to-say", author: "Klaus Doring", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/So-To-Say-x-Klaus-Doring-23.jpg" },
  { column: "THE RATIONAL DECIDENDI", slug: "the-rational-decidendi", author: "Atty. Anfred P. Panes, LL.M.", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/07/The-Rational-Decidendi.jpg" },
  { column: "ON THE SPOT", slug: "on-the-spot", author: "PSMS Francisco Lindero", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/07/on-the-spot.jpg" },
  { column: "GENDER MATTERS", slug: "gender-matters", author: "Mary Barby P. Badayos-Jover, PhD", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/01/gender-matters-x-Badayos-Jover1.jpg" },
  { column: "NORTH STAR", slug: "north-star", author: "Engr. Carlos V. Cornejo", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/North-Star-Engr-Carlos-V-Cornejo.jpg" },
  { column: "FACTUALITY", slug: "factuality", author: "Ted Aldwin Ong", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/Ted-Aldwin-Ong-x-Factuality.jpg" },
  { column: "DURA LEX, SED LEX", slug: "dura-lex-sed-lex", author: "Atty. Rolex T. Suplico", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2026/03/5th-District-Board-Member-Rolex-T-Suplico.jpg" },
  { column: "CIGARETTES", slug: "cigarettes", author: "Raoul Suarez", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/RAOUL-SUAREZ-X-CIGARETTES-1-23.jpg" },
  { column: "BALINTATAW", slug: "balintataw", author: "Jaime Babiera", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/balintataw-1.jpg" },
  { column: "RANT AND RAVE", slug: "rant-and-rave", author: "Joseph B.A Marzan", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/04/RANT-AND-RAVE-JOSEPH-MARZAN1.jpg" },
  { column: "CONTEMPLATIONS", slug: "contemplations", author: "Shay Cullen", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2023/01/Shay-Cullen-x-Contemplations-23.jpg" },
  { column: "BEYOND THE BEND", slug: "beyond-the-bend", author: "Michael Henry Yusingco, LL.M", headshot: "https://old.dailyguardian.com.ph/wp-content/uploads/2021/12/Michael-Henry-Yusingco-x-beyond-the-bend.jpg" },
];

// Resolve category slugs → a slug→id map in ONE request (vs N).
async function resolveCategoryIdMap(
  slugs: string[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (slugs.length === 0) return map;

  const url = new URL(`${WP_API_BASE}/categories`);
  slugs.forEach((s) => url.searchParams.append("slug[]", s));
  url.searchParams.set("per_page", "100");
  url.searchParams.set("_fields", "id,slug");

  const { signal, clear } = timedAbort(DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal,
      next: { revalidate: 86_400 }, // 24 h — categories are stable
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return map;
    const cats = (await res.json()) as Array<{ id: number; slug: string }>;
    for (const c of cats) map.set(c.slug, c.id);
    return map;
  } catch {
    return map;
  } finally {
    clear();
  }
}

// Pull the latest banner image for a single column category. Opinion posts often
// have a rest_forbidden featured_media (empty wp:featuredmedia), so we lean on
// transformPost, which falls back to the Yoast og_image when needed.
async function fetchColumnImage(
  catId: number,
  fallbackAlt: string,
): Promise<{ url: string; alt: string } | null> {
  try {
    const posts = await wpFetch<WPPost[]>("/posts", {
      categories: catId,
      per_page: 1,
      _embed: 1,
      orderby: "date",
      order: "desc",
    });
    const img = posts[0] ? transformPost(posts[0]).data.featured_image : null;
    if (!img?.url) return null;
    return { url: img.url, alt: img.alt || fallbackAlt };
  } catch {
    return null;
  }
}

// Build the FULL columnist directory from the curated roster, attaching each
// column's latest banner image (fetched live per category, in parallel). Returns
// every columnist regardless of image availability — the UI falls back to a
// monogram tile when a column has no usable image.
export async function getOpinionColumnists(): Promise<ColumnistSummary[]> {
  // Only columns without a curated headshot need a live banner lookup.
  const needsImage = OPINION_ROSTER.filter((r) => !r.headshot);
  const idMap = await resolveCategoryIdMap(
    needsImage.map((r) => r.slug),
  ).catch(() => new Map<string, number>());

  const fetched = await Promise.all(
    needsImage.map((r) => {
      const catId = idMap.get(r.slug);
      return catId ? fetchColumnImage(catId, r.column) : Promise.resolve(null);
    }),
  );
  const fetchedBySlug = new Map(
    needsImage.map((r, i) => [r.slug, fetched[i]]),
  );

  return OPINION_ROSTER.map((r) => ({
    column: r.column,
    author: r.author,
    slug: r.slug,
    image: r.headshot
      ? { url: r.headshot, alt: r.author }
      : fetchedBySlug.get(r.slug) ?? null,
  }));
}

// Look up a curated columnist by their column's category slug (e.g. "prometheus").
export function findColumnistBySlug(
  slug: string,
): { column: string; author: string; slug: string; headshot?: string } | null {
  return OPINION_ROSTER.find((r) => r.slug === slug) ?? null;
}

// Fetch a column's posts by its category slug — reliable for the columnist pages
// where byline-based lookup fails (e.g. plain "By Name" posts resolve no author).
export async function getOpinionPostsByColumnSlug(
  slug: string,
  perPage = 12,
  page = 1,
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
  const idMap = await resolveCategoryIdMap([slug]).catch(
    () => new Map<string, number>(),
  );
  const catId = idMap.get(slug);
  if (!catId) return { posts: [], totalPages: 1, total: 0 };

  try {
    const { data, totalPages, total } = await wpFetchPaginated<WPPost[]>(
      "/posts",
      {
        categories: catId,
        per_page: perPage,
        page,
        _embed: 1,
        orderby: "date",
        order: "desc",
      },
    );
    return { posts: data.map(transformPost), totalPages, total };
  } catch {
    return { posts: [], totalPages: 1, total: 0 };
  }
}

interface WPPage {
  link: string;
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
  };
}

export interface Publication {
  imageUrl: string | null;
  link: string;
  title: string;
  /** Raw HTML content from the WP page — may contain iframe embeds (Issuu, PDF, etc.) */
  content: string;
  /** Extracted src from the first iframe in content, if any */
  embedSrc: string | null;
  /** Extracted PDF URL from content links, if any */
  pdfUrl: string | null;
}

function extractIframeSrc(html: string): string | null {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function extractPdfUrl(html: string, pageLink: string): string | null {
  // ── 3D FlipBook plugin (FB3D_CLIENT_DATA) ──────────────────────────────────
  // The plugin stores PDF data as a base64-encoded JSON pushed into FB3D_CLIENT_DATA.
  // Decode it and pull the `guid` field which is the direct PDF URL.
  const fb3dMatch = html.match(/FB3D_CLIENT_DATA\.push\('([^']+)'\)/);
  if (fb3dMatch?.[1]) {
    try {
      const json = JSON.parse(
        Buffer.from(fb3dMatch[1], "base64").toString("utf-8"),
      );
      const posts: Record<string, { data?: { guid?: string } }> =
        json?.posts ?? {};
      const firstPost = Object.values(posts)[0];
      const guid = firstPost?.data?.guid;
      if (guid && guid.toLowerCase().endsWith(".pdf")) {
        return guid.replace(/\\\//g, "/"); // unescape WP JSON slashes
      }
    } catch {
      // malformed base64 — fall through
    }
  }

  // ── Plain PDF link in content ──────────────────────────────────────────────
  const hrefMatch = html.match(/href=["']([^"']+\.pdf[^"']*)["']/i);
  if (hrefMatch?.[1]) return hrefMatch[1];

  // ── Page link is itself a PDF ──────────────────────────────────────────────
  if (pageLink.toLowerCase().endsWith(".pdf")) return pageLink;

  return null;
}

async function fetchPublicationByPageSlug(
  slug: string,
  fallbackLink: string,
  fallbackTitle: string,
): Promise<Publication> {
  try {
    const pages = await wpFetch<WPPage[]>("/pages", { slug, _embed: 1 });
    const page = pages[0];
    if (page) {
      const content = page.content?.rendered ?? "";
      return {
        imageUrl: rewriteMediaUrl(page._embedded?.["wp:featuredmedia"]?.[0]?.source_url),
        link: page.link,
        title: fallbackTitle,
        content,
        embedSrc: extractIframeSrc(content),
        pdfUrl: extractPdfUrl(content, page.link),
      };
    }
  } catch {
    // fall through to post search
  }

  // Try as a post instead
  try {
    const posts = await wpFetch<WPPost[]>("/posts", {
      slug,
      _embed: 1,
      per_page: 1,
    });
    if (posts[0]) {
      const p = transformPost(posts[0]);
      const content = posts[0].content?.rendered ?? "";
      return {
        imageUrl: p.data.featured_image?.url ?? null,
        link: p.data.original_link,
        title: p.data.title || fallbackTitle,
        content,
        embedSrc: extractIframeSrc(content),
        pdfUrl: extractPdfUrl(content, p.data.original_link),
      };
    }
  } catch {
    // fall through to fallback
  }

  return {
    imageUrl: null,
    link: fallbackLink,
    title: fallbackTitle,
    content: "",
    embedSrc: null,
    pdfUrl: null,
  };
}

export async function getTodaysPaper(): Promise<Publication> {
  const FLIPBOOK_URL = "https://old.dailyguardian.com.ph/3d-flip-book/todays-paper/";

  // Try WP REST API first (slug may vary)
  const slugsToTry = ["todays-paper", "today-paper", "today-s-paper", "daily-paper"];
  let imageOnlyResult: Publication | null = null;

  for (const slug of slugsToTry) {
    const pub = await fetchPublicationByPageSlug(slug, FLIPBOOK_URL, "Today's Paper");
    if (pub.pdfUrl || pub.embedSrc) return pub;
    if (pub.imageUrl && !imageOnlyResult) imageOnlyResult = pub;
  }

  // Direct HTML scrape of the 3D FlipBook page — FB3D_CLIENT_DATA is injected
  // via wp_localize_script and only appears in a full page render, not the REST API.
  try {
    const { signal, clear: clearFlipbook } = timedAbort(DEFAULT_TIMEOUT_MS);
    const res = await fetch(FLIPBOOK_URL, {
      signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DGReader/1.0)" },
    }).finally(() => clearFlipbook());
    if (res.ok) {
      const html = await res.text();
      const pdfUrl = extractPdfUrl(html, FLIPBOOK_URL);
      if (pdfUrl) {
        return {
          ...(imageOnlyResult ?? {
            imageUrl: null,
            title: "Today's Paper",
            content: "",
            embedSrc: null,
          }),
          link: FLIPBOOK_URL,
          pdfUrl,
        };
      }
    }
  } catch {
    // fall through
  }

  return (
    imageOnlyResult ?? {
      imageUrl: null,
      link: FLIPBOOK_URL,
      title: "Today's Paper",
      content: "",
      embedSrc: null,
      pdfUrl: null,
    }
  );
}

export async function getSupplement(): Promise<Publication> {
  const SUPPLEMENT_URL =
    "https://old.dailyguardian.com.ph/3d-flip-book/supplement/";
  const slugsToTry = [
    "supplement",
    "e-supplement",
    "dg-supplement",
    "weekly-supplement",
  ];

  let imageOnlyResult: Publication | null = null;

  for (const slug of slugsToTry) {
    const pub = await fetchPublicationByPageSlug(
      slug,
      SUPPLEMENT_URL,
      "Supplement",
    );
    if (pub.pdfUrl || pub.embedSrc) return pub; // ideal — has something to render
    if (pub.imageUrl && !imageOnlyResult) imageOnlyResult = pub; // save thumbnail as fallback
  }

  // The 3D FlipBook plugin injects FB3D_CLIENT_DATA via wp_localize_script which
  // only runs during a full page render — it never appears in content.rendered from
  // the REST API. Fetch the actual HTML page so extractPdfUrl can parse it.
  try {
    const { signal, clear: clearSupplement } = timedAbort(DEFAULT_TIMEOUT_MS);
    const res = await fetch(SUPPLEMENT_URL, {
      signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DGReader/1.0)" },
    }).finally(() => clearSupplement());
    if (res.ok) {
      const html = await res.text();
      const pdfUrl = extractPdfUrl(html, SUPPLEMENT_URL);
      if (pdfUrl) {
        return {
          ...(imageOnlyResult ?? {
            imageUrl: null,
            title: "Supplement",
            content: "",
            embedSrc: null,
          }),
          link: SUPPLEMENT_URL,
          pdfUrl,
        };
      }
    }
  } catch {
    // fall through
  }

  return (
    imageOnlyResult ?? {
      imageUrl: null,
      link: SUPPLEMENT_URL,
      title: "Supplement",
      content: "",
      embedSrc: null,
      pdfUrl: null,
    }
  );
}

export interface PaperEdition {
  id: number;
  date: string;
  label: string;
  pdfUrl: string;
}

interface WPMediaItem {
  id: number;
  date: string;
  title: { rendered: string };
  source_url: string;
}

// Fetch daily paper editions from the WP media library.
// Daily papers are named "PDF-[Month]-[Day]-[Year]".
export async function getPaperEditions(limit = 30): Promise<PaperEdition[]> {
  try {
    const items = await wpFetch<WPMediaItem[]>("/media", {
      mime_type: "application/pdf",
      per_page: limit,
      orderby: "date",
      order: "desc",
      _fields: "id,date,title,source_url",
    });
    return items
      .filter((m) =>
        /^PDF-[A-Za-z]+-\d+-\d+$/.test(m.title.rendered.replace(/\.pdf$/i, "")),
      )
      .map((m) => ({
        id: m.id,
        date: m.date,
        label: m.title.rendered.replace(/^PDF-/, "").replace(/-/g, " "),
        pdfUrl: m.source_url,
      }));
  } catch {
    return [];
  }
}

// Fetch past supplement editions (special issues) from the WP media library.
export async function getSupplementEditions(
  limit = 20,
): Promise<PaperEdition[]> {
  try {
    const items = await wpFetch<WPMediaItem[]>("/media", {
      mime_type: "application/pdf",
      per_page: limit,
      orderby: "date",
      order: "desc",
      search: "supplement",
      _fields: "id,date,title,source_url",
    });
    return items.map((m) => ({
      id: m.id,
      date: m.date,
      label: m.title.rendered.replace(/[-_]/g, " ").replace(/\.pdf$/i, ""),
      pdfUrl: m.source_url,
    }));
  } catch {
    return [];
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  const wpUsers = await wpFetch<WPUser[]>("/users", {
    per_page: 100,
    who: "authors",
  });
  return wpUsers.map(transformAuthor);
}

export async function getAllCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>("/categories", { per_page: 100 });
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  status: string;
}

export async function getCommentsByPostId(
  postId: number,
): Promise<WPComment[]> {
  return wpFetch<WPComment[]>("/comments", {
    post: postId,
    per_page: 100,
    status: "approve",
    orderby: "date",
    order: "asc",
  }).catch(() => []);
}

export async function submitWPComment(
  postId: number,
  authorName: string,
  authorEmail: string,
  content: string,
  parent = 0,
): Promise<WPComment> {
  const url = `${WP_API_BASE}/comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      post: postId,
      author_name: authorName,
      author_email: authorEmail,
      content,
      parent,
    }),
  });
  if (!res.ok) throw new Error(`Failed to submit comment: ${res.status}`);
  return res.json();
}
