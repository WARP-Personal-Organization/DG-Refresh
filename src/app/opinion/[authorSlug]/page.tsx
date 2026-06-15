export const revalidate = 300;

import { notFound } from "next/navigation";
import AuthorArticlesPage from "@/components/AuthorArticlesPage";
import {
  findColumnistBySlug,
  getOpinionPostsByAuthor,
  getOpinionPostsByColumnSlug,
} from "../../../../lib/wordpress";

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

  // The Opinion directory links by column category slug (e.g. "prometheus"),
  // which is reliable even when a column's posts have no parseable byline.
  // Fall back to byline-based author search for legacy /opinion/<name> links.
  const columnist = findColumnistBySlug(authorSlug);
  const searchName = slugToName(authorSlug);
  const { posts, totalPages } = columnist
    ? await getOpinionPostsByColumnSlug(authorSlug, 12, page).catch(() => ({
        posts: [],
        totalPages: 1,
        total: 0,
      }))
    : await getOpinionPostsByAuthor(searchName, 12, page).catch(() => ({
        posts: [],
        totalPages: 1,
        total: 0,
      }));

  if (posts.length === 0 && page === 1) notFound();

  // Prefer the curated columnist name; else the post's resolved author field.
  const displayName =
    columnist?.author ?? posts[0]?.data.author ?? searchName;

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
  const columnist = findColumnistBySlug(authorSlug);
  const displayName =
    columnist?.author ??
    slugToName(authorSlug)
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title = `${displayName} | Voices | Daily Guardian`;
  const description = `Read all opinion columns by ${displayName} on Daily Guardian.`;
  const url = `https://dailyguardian.com.ph/opinion/${authorSlug}`;
  // Prefer the columnist's headshot as the share image; fall back to the logo.
  const ogImage = columnist?.headshot
    ? { url: columnist.headshot, width: 600, height: 600, alt: displayName }
    : { url: "/black_dg.png", width: 536, height: 128, alt: "Daily Guardian" };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      siteName: "Daily Guardian",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
