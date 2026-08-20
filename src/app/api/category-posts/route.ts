import { NextRequest, NextResponse } from "next/server";
import {
  getAppCategorySlugs,
  getPostsByCategorySlugs,
  getWPSlugsForCategory,
} from "../../../../lib/wordpress";

const POSTS_PER_PAGE = 6;
const MAX_PAGE = 500;

// Backs client-side pagination for /[catagory] so the page itself can stay
// statically rendered (ISR) instead of force-dynamic. Mirrors the sidebar
// "recommended" lookup that previously lived in the page's server logic.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const page = Math.min(
    MAX_PAGE,
    Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1),
  );

  if (!getAppCategorySlugs().includes(category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const wpSlugs = getWPSlugsForCategory(category);
  const mainResult = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page);
  const posts = mainResult.posts;
  const totalPages = mainResult.totalPages;

  const mainIds = new Set(posts.map((p) => p.id));
  const sidebarPage = page < totalPages ? page + 1 : totalPages > 1 ? page - 1 : 0;
  let recommendedPosts: typeof posts = [];
  if (sidebarPage > 0) {
    const sidebarResult = await getPostsByCategorySlugs(wpSlugs, 5, sidebarPage);
    recommendedPosts = sidebarResult.posts.filter((p) => !mainIds.has(p.id)).slice(0, 5);
  }

  return NextResponse.json(
    { posts, totalPages, recommendedPosts, page },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
