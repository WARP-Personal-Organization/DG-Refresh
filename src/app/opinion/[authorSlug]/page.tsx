export const revalidate = 300;

import { notFound } from "next/navigation";
import AuthorArticlesPage from "@/components/AuthorArticlesPage";
import { getOpinionPostsByAuthor } from "../../../../lib/wordpress";

type Props = {
  params: Promise<{ authorSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

// Convert URL slug back to a search-friendly name
// "atty-eduardo-t-reyes-iii" → "atty eduardo t reyes iii"
function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { authorSlug } = await params;
  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);

  const searchName = slugToName(authorSlug);
  const { posts, totalPages } = await getOpinionPostsByAuthor(searchName, 12, page).catch(
    () => ({ posts: [], totalPages: 1, total: 0 }),
  );

  if (posts.length === 0 && page === 1) notFound();

  // The display name comes from the first post's resolved author field
  const displayName = posts[0]?.data.author ?? searchName;

  return (
    <AuthorArticlesPage
      authorName={displayName}
      posts={posts}
      currentPage={page}
      totalPages={totalPages}
      authorSlug={authorSlug}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { authorSlug } = await params;
  const displayName = slugToName(authorSlug)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${displayName} | Voices | Daily Guardian`,
    description: `Read all opinion columns by ${displayName} on Daily Guardian.`,
  };
}
