export const revalidate = 300;

import { notFound } from "next/navigation";
import AuthorArticlesPage from "@/components/AuthorArticlesPage";
import {
  findColumnistBySlug,
  getOpinionColumnists,
  getOpinionPostsByAuthor,
  getOpinionPostsByColumnSlug,
} from "../../../../lib/wordpress";

type Props = {
  params: Promise<{ authorSlug: string }>;
};

// Convert URL slug back to a search-friendly name
// "atty-eduardo-t-reyes-iii" → "atty eduardo t reyes iii"
function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

// A dynamic segment needs a generateStaticParams export — even one returning
// [] — to be ISR-eligible at all. Without it Next.js falls back to full SSR
// on every request regardless of `revalidate`. Curated columnist slugs are
// prebuilt; other author-search URLs still render on-demand and get cached
// after their first hit.
export async function generateStaticParams(): Promise<{ authorSlug: string }[]> {
  const columnists = await getOpinionColumnists().catch(() => []);
  return columnists.map((c) => ({ authorSlug: c.slug }));
}

// Server render always fetches page 1 — pagination beyond that is handled
// client-side inside AuthorArticlesPage so this page stays a plain ISR-cached
// static render instead of opting into dynamic rendering via searchParams.
export default async function AuthorPage({ params }: Props) {
  const { authorSlug } = await params;
  const page = 1;

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

  if (posts.length === 0) notFound();

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
