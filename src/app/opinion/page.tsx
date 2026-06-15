export const revalidate = 300;

import VoicesPage from "@/components/VoicesPage";
import {
  getOpinionColumnists,
  getPostsByCategorySlugs,
} from "../../../lib/wordpress";

export const metadata = {
  title: "Opinion | Daily Guardian",
  description:
    "Opinion, commentary, and analysis from Daily Guardian's leading columnists and contributors.",
};

export default async function OpinionPage() {
  // Columnist directory is built from a wider, paginated scan so every columnist
  // appears (not just whoever published in the last 20 posts). The "Latest
  // Opinions" strip stays a small 20-post fetch — 100 posts with _embed produced
  // ~5 MB, over Next.js's 2 MB data-cache limit, so it bypassed cache entirely.
  const [columnists, { posts }] = await Promise.all([
    getOpinionColumnists().catch(() => []),
    getPostsByCategorySlugs(["opinion"], 20).catch(() => ({ posts: [] })),
  ]);

  return <VoicesPage columnists={columnists} recentPosts={posts} />;
}
