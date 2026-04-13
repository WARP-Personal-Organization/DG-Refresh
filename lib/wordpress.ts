// lib/wordpress.ts
// WordPress REST API integration for Daily Guardian
// API base: https://dailyguardian.com.ph/wp-json/wp/v2

const WP_API_BASE = "https://dailyguardian.com.ph/wp-json/wp/v2";

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
    author?: Array<{ id: number; name: string; description: string; slug: string }>;
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

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8230;/g, "...")
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

  const categorySlugs = categoryTerms.map((c) => c.slug);
  const category = mapCategory(categorySlugs);
  const subcategory = mapSubcategory(categorySlugs);

  const excerpt = stripHtml(wpPost.excerpt.rendered);

  return {
    id: wpPost.id,
    uid: wpPost.slug,
    data: {
      title: stripHtml(wpPost.title.rendered),
      summary: excerpt,
      content: wpPost.content.rendered,
      category,
      subcategory,
      is_featured: wpPost.sticky,
      is_breaking_news: false,
      editors_pick: false,
      featured_image: media
        ? {
            url: media.source_url,
            alt: media.alt_text || stripHtml(wpPost.title.rendered),
          }
        : null,
      author: authorItem?.name ?? "Staff Writer",
      published_date: wpPost.date,
      updated_date: wpPost.modified,
      reading_time: estimateReadingTime(wpPost.content.rendered),
      tags: tagTerms.map((t) => t.name),
      meta_description: excerpt.substring(0, 160),
      original_link: wpPost.link,
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

async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value))
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 }, // cache 5 minutes
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(
        `WordPress API error ${res.status}: ${url.pathname}${url.search}`
      );
    }

    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Public API Functions ─────────────────────────────────────────────────────

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
  limit = 3
): Promise<Post[]> {
  // Re-uses the same cached fetch as getAllPosts — no extra network call within the same revalidation window
  const allPosts = await getAllPosts(30);
  return allPosts
    .filter((p) => p.uid !== currentSlug && p.data.category === category)
    .slice(0, limit);
}

export async function getPostsByCategory(
  categorySlug: string,
  perPage = 50
): Promise<Post[]> {
  // First resolve the category ID from its slug
  const categories = await wpFetch<WPCategory[]>("/categories", {
    slug: categorySlug,
  });
  if (!categories[0]) return [];
  const wpPosts = await wpFetch<WPPost[]>("/posts", {
    categories: categories[0].id,
    per_page: perPage,
    _embed: 1,
    orderby: "date",
    order: "desc",
  });
  return wpPosts.map(transformPost);
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
