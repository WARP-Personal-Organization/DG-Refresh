import { NextRequest, NextResponse } from "next/server";
import {
  getBannerNewsBySubcategory,
  getPostsByCategorySlugs,
  getWPSlugsForSubcategory,
} from "../../../../lib/wordpress";
import type { Post } from "../../../../lib/wordpress";

const POSTS_PER_PAGE = 9;

// Backs client-side pagination for /[catagory]/[subcategory] so the page itself
// can stay statically rendered (ISR) instead of force-dynamic. Only page 1 needs
// banner news — matches the original server-rendered behavior.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subcategory = searchParams.get("subcategory") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const wpSlugs = getWPSlugsForSubcategory(subcategory);
  const [result, bannerBySub] = await Promise.all([
    getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page),
    page === 1
      ? getBannerNewsBySubcategory(30).catch(() => ({}) as Record<string, Post[]>)
      : Promise.resolve({} as Record<string, Post[]>),
  ]);

  const bannerNews = (bannerBySub[subcategory] ?? []).slice(0, 4);

  return NextResponse.json({
    posts: result.posts,
    totalPages: result.totalPages,
    bannerNews,
    page,
  });
}
