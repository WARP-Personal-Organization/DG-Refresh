import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "../../../../lib/wordpress";

// Called by a WordPress webhook whenever a post is published or updated, so
// the affected pages refresh immediately instead of waiting for their next
// timer-based revalidate window. This is additive, not a replacement — the
// existing revalidate windows stay in place as a safety net if the webhook
// is ever missed or misconfigured.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slug = body?.slug;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");

  // revalidate: 0 — always fetch fresh here, we want the category this post
  // was *just* filed under, not a stale cached lookup.
  const post = await getPostBySlug(slug, 0).catch(() => null);
  if (post?.data.category) {
    revalidatePath(`/${post.data.category}`);
  }
  if (post?.data.subcategory) {
    revalidatePath(`/${post.data.category}/${post.data.subcategory}`);
  }

  return NextResponse.json({
    revalidated: true,
    slug,
    category: post?.data.category ?? null,
  });
}
