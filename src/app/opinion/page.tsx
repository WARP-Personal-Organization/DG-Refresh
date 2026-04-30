export const revalidate = 300;

import VoicesPage from "@/components/VoicesPage";
import { getPostsByCategorySlugs } from "../../../lib/wordpress";

export const metadata = {
  title: "Voices | Daily Guardian",
  description:
    "Opinion, commentary, and analysis from Daily Guardian's leading columnists and contributors.",
};

export default async function OpinionPage() {
  const { posts } = await getPostsByCategorySlugs(
    ["opinion"],
    100,
  ).catch(() => ({ posts: [] }));

  return <VoicesPage posts={posts} />;
}
