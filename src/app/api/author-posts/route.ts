import { NextRequest, NextResponse } from "next/server";
import {
  findColumnistBySlug,
  getOpinionPostsByAuthor,
  getOpinionPostsByColumnSlug,
} from "../../../../lib/wordpress";

// Convert URL slug back to a search-friendly name — mirrors the page's own helper.
function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

// Backs client-side pagination for /opinion/[authorSlug] so the page itself can
// stay statically rendered (ISR) instead of opting into dynamic rendering via
// searchParams.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorSlug = searchParams.get("authorSlug") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

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

  return NextResponse.json({ posts, totalPages, page });
}
