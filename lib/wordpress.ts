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
    is_featured: boolean;
    is_breaking_news: boolean;
    editors_pick: boolean;
    featured_image: { url: string | null; alt: string } | null;
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
  const author =
    (!isGenericUser ? wpAuthorName : null) ?? bylineName ?? "Staff Writer";

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
      is_featured: wpPost.sticky,
      is_breaking_news: false,
      editors_pick: false,
      featured_image: media
        ? {
            url: rewriteMediaUrl(media.source_url) ?? media.source_url,
            alt: media.alt_text || stripHtml(wpPost.title?.rendered ?? ""),
          }
        : null,
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

// Rejects after `ms` milliseconds with a timeout error.
// Using Promise.race (not AbortController) avoids conflicts with
// Next.js 15's fetch instrumentation for ISR/Data Cache on Vercel.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`WP API timeout after ${ms}ms`)), ms),
    ),
  ]);
}

async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  );

  const res = await withTimeout(
    fetch(url.toString(), {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    }),
    8000,
  );

  if (!res.ok) {
    throw new Error(
      `WordPress API error ${res.status}: ${url.pathname}${url.search}`,
    );
  }

  return res.json();
}

async function wpFetchPaginated<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
): Promise<{ data: T; totalPages: number; total: number }> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value)),
  );

  const res = await withTimeout(
    fetch(url.toString(), {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    }),
    8000,
  );

  if (!res.ok) {
    throw new Error(
      `WordPress API error ${res.status}: ${url.pathname}${url.search}`,
    );
  }

  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
  const total = parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
  const data = (await res.json()) as T;
  return { data, totalPages, total };
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

// Resolve multiple WP category slugs to IDs, then fetch paginated posts
export async function getPostsByCategorySlugs(
  slugs: string[],
  perPage = 20,
  page = 1,
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
  const categoryResults = await Promise.all(
    slugs.map((slug) =>
      wpFetch<WPCategory[]>("/categories", { slug }).catch(
        () => [] as WPCategory[],
      ),
    ),
  );
  const ids = categoryResults.flatMap((cats) =>
    cats[0]?.id ? [cats[0].id] : [],
  );

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
  return fetchPublicationByPageSlug(
    "todays-paper",
    "https://old.dailyguardian.com.ph/todays-paper/",
    "Today's Paper",
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
    const res = await withTimeout(
      fetch(SUPPLEMENT_URL, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; DGReader/1.0)" },
      }),
      8000,
    );
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
