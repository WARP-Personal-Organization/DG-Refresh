export const revalidate = 300;

import {
  formatSubcategoryName,
  slugToSubcategory,
} from "@/app/[catagory]/[subcategory]/types";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBannerNewsBySubcategory,
  getPostsByCategorySlugs,
  getWPSlugsForSubcategory,
} from "../../../../lib/wordpress";
import PaginatedSubcategoryContent from "../../../components/PaginatedSubcategoryContent";

const POSTS_PER_PAGE = 9;

type Params = Promise<{ catagory: string; subcategory: string }>;
interface SubCategoryPageProps {
  params: Params;
}

// Only the top-level app category slugs are prebuilt at deploy time; the huge
// legacy subcategory list in ./types.ts isn't reliably mapped to real WP
// categories, so subcategory pages fall back to on-demand ISR generation
// (still cached after the first hit — unlike the previous force-dynamic).
export async function generateStaticParams(): Promise<
  { subcategory: string }[]
> {
  return [];
}

export async function generateMetadata({
  params,
}: SubCategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const subcategoryValue = slugToSubcategory(resolvedParams.subcategory);
  const displayName = formatSubcategoryName(subcategoryValue);

  const title = `${displayName} - Latest Articles | Daily Guardian`;
  const description = `Read the latest ${displayName} articles from Daily Guardian.`;
  const url = `https://dailyguardian.com.ph/${resolvedParams.catagory}/${resolvedParams.subcategory}`;
  const ogImage = { url: "/black_dg.png", width: 536, height: 128, alt: "Daily Guardian" };

  return {
    title,
    description,
    keywords: `${displayName}, news, Daily Guardian, ${subcategoryValue}`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
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

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const resolvedParams = await params;
  const subcategoryValue = slugToSubcategory(resolvedParams.subcategory);
  const displayName = formatSubcategoryName(subcategoryValue);
  const basePath = `/${resolvedParams.catagory}/${resolvedParams.subcategory}`;

  // Server render always fetches page 1 — pagination beyond that is handled
  // client-side (see PaginatedSubcategoryContent) so this page stays a plain
  // ISR-cached static render instead of force-dynamic.
  let posts: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];
  let totalPages = 1;
  let fetchError = false;
  let bannerNews: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];

  try {
    const wpSlugs = getWPSlugsForSubcategory(subcategoryValue);
    const [result, bannerBySub] = await Promise.all([
      getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, 1),
      getBannerNewsBySubcategory(30).catch(() => ({}) as Record<string, typeof posts>),
    ]);
    posts = result.posts;
    totalPages = result.totalPages;
    bannerNews = (bannerBySub[subcategoryValue] ?? []).slice(0, 4);
  } catch (error) {
    console.error("Error fetching subcategory articles:", error);
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Unable to load content</h1>
            <p className="text-gray-400">Could not reach the Daily Guardian API. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-roboto font-bold text-white">{displayName}</h1>
            <div className="flex items-center gap-4">
              <div className="h-1 w-24 bg-[#fcee16]"></div>
            </div>
          </div>
        </div>

        <PaginatedSubcategoryContent
          subcategoryValue={subcategoryValue}
          basePath={basePath}
          initialPosts={posts}
          initialTotalPages={totalPages}
          initialBannerNews={bannerNews}
        />
      </div>
    </div>
  );
}
