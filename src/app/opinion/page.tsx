export const revalidate = 300;

import VoicesPage from "@/components/VoicesPage";
import { getPostsByCategorySlugs } from "../../../lib/wordpress";

export const metadata = {
  title: "Voices | Daily Guardian",
  description:
    "Opinion, commentary, and analysis from Daily Guardian's leading columnists and contributors.",
};

export default async function OpinionPage() {
  // 100 posts with _embed produced ~5 MB — over Next.js's 2 MB cache limit,
  // meaning every request bypassed cache and hit the WP API directly.
  const { posts } = await getPostsByCategorySlugs(
    ["opinion"],
    20,
  ).catch(() => ({ posts: [] }));

  return <VoicesPage posts={posts} />;
}
