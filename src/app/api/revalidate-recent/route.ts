import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getRecentlyModifiedPosts } from "../../../../lib/wordpress";

// Cron-driven counterpart to /api/revalidate (the WordPress webhook).
//
// Article pages used to sit on a 600s timer, which meant every crawler hit on
// a stale page rebuilt it — across a 75,000-post archive that was the single
// largest source of billed ISR writes, almost entirely for articles whose
// content had not changed. Those pages now use a 24h backstop instead, and
// this job supplies the freshness: once per run it asks WordPress which posts
// were actually edited and invalidates only those.
//
// Runs on a schedule (see vercel.json). Safe to run more often than needed —
// re-invalidating an already-fresh path is harmless.
export const dynamic = "force-dynamic";

// How far back to look for edits. Deliberately wider than the cron interval so
// a slow run, a clock skew, or a missed tick can't drop an edit into a gap.
const LOOKBACK_MINUTES = 20;

// Upper bound on how many posts one run will act on. WordPress returns these
// newest-first, so under normal load this is never reached; it exists so that
// a bulk edit or re-import in WordPress can't turn one cron tick into a
// stampede of invalidations. Anything missed is still caught by the 24h
// backstop on the article pages themselves.
const MAX_POSTS_PER_RUN = 20;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Without this the
  // endpoint would let anyone force arbitrary revalidation work.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let posts: Awaited<ReturnType<typeof getRecentlyModifiedPosts>>;
  try {
    posts = await getRecentlyModifiedPosts(MAX_POSTS_PER_RUN);
  } catch (err) {
    // Surface the failure rather than reporting a silent success — a cron that
    // quietly stops working would leave articles stale for up to 24h.
    console.error("revalidate-recent: WordPress fetch failed:", err);
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: 503 },
    );
  }

  const cutoff = Date.now() - LOOKBACK_MINUTES * 60_000;
  const changed = posts.filter((post) => {
    // WordPress returns `modified_gmt` without a timezone suffix; append "Z"
    // so it isn't parsed as local time.
    const modified = Date.parse(`${post.modified_gmt}Z`);
    return Number.isFinite(modified) && modified >= cutoff;
  });

  for (const post of changed) {
    revalidatePath(`/blog/${post.slug}`);
  }

  // Index pages keep their own short revalidate windows (they are a handful of
  // paths, so their write cost is negligible) and are intentionally not
  // touched here.
  if (changed.length === MAX_POSTS_PER_RUN) {
    console.warn(
      `revalidate-recent: hit the ${MAX_POSTS_PER_RUN}-post cap — possible bulk edit in WordPress.`,
    );
  }

  return NextResponse.json({
    revalidated: changed.length,
    slugs: changed.map((p) => p.slug),
    lookbackMinutes: LOOKBACK_MINUTES,
  });
}
