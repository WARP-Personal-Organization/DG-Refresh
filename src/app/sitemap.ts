import type { MetadataRoute } from "next";
import { getPostSlugsForSitemap } from "../../lib/wordpress";

export const revalidate = 86_400; // regenerate once per day

const SITE_URL = "https://www.dailyguardian.com.ph";

// 100 sub-sitemaps × 100 posts each = up to 10,000 most recent articles.
// Google crawls sub-sitemaps on demand so only visited ones incur API calls.
const TOTAL_PAGES = 100;

const STATIC_ROUTES = [
  "",
  "/news",
  "/opinion",
  "/business",
  "/sports",
  "/features",
  "/initiatives",
  "/about-us",
  "/contact-us",
  "/Policies",
];

export function generateSitemaps() {
  return Array.from({ length: TOTAL_PAGES }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const page = id + 1; // WP REST API pages are 1-indexed
  const posts = await getPostSlugsForSitemap(page).catch(() => []);

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.modified || post.date,
    changeFrequency: "weekly",
    priority: id === 0 ? 0.9 : 0.7,
  }));

  // Static pages only in the first sub-sitemap
  if (id === 0) {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route === "" ? "hourly" : "daily",
      priority: route === "" ? 1.0 : 0.7,
    }));
    return [...staticEntries, ...articleEntries];
  }

  return articleEntries;
}
