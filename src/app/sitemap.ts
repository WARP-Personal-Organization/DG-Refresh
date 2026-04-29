import type { MetadataRoute } from "next";
import { getAllPosts } from "../../lib/wordpress";

const SITE_URL = "https://dailyguardian.com.ph";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts(100).catch(() => []);

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.uid}`,
    lastModified: post.data.updated_date || post.data.published_date,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "hourly" : "daily",
    priority: route === "" ? 1 : 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
