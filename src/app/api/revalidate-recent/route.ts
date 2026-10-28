import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  getRecentlyModifiedPosts,
  getRecentlyPublishedPosts,
} from "../../../../lib/wordpress";

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

// Scheduled posts can't share that cap. The newsroom schedules the next day's
// paper for midnight, so 30–40 posts go live within a few minutes; with only
// the newest 20 fetched, everything older in the batch fell outside the
// window before any run saw it, and any of those whose URL had been hit
// before going live stayed on "Article Not Found" for the 24h backstop.
// 100 is the WordPress per_page maximum — far above any real batch — and
// revalidatePath only marks paths stale, so a large run is cheap.
const MAX_PUBLISHED_PER_RUN = 100;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Without this the
  // endpoint would let anyone force arbitrary revalidation work.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Edits surface by `modified`; scheduled posts going live surface only by
  // publish `date` (see getRecentlyPublishedPosts) — both are needed.
  let posts: Array<{ slug: string; changed_gmt: string }>;
  try {
    const [modified, published] = await Promise.all([
      getRecentlyModifiedPosts(MAX_POSTS_PER_RUN),
      getRecentlyPublishedPosts(MAX_PUBLISHED_PER_RUN),
    ]);
    if (modified.length >= MAX_POSTS_PER_RUN) {
      console.warn(
        `revalidate-recent: hit the ${MAX_POSTS_PER_RUN}-post cap — possible bulk edit in WordPress.`,
      );
    }
    if (published.length >= MAX_PUBLISHED_PER_RUN) {
      console.warn(
        `revalidate-recent: hit the ${MAX_PUBLISHED_PER_RUN}-post published cap — some newly live posts may be missed.`,
      );
    }
    posts = [
      ...modified.map((p) => ({ slug: p.slug, changed_gmt: p.modified_gmt })),
      ...published.map((p) => ({ slug: p.slug, changed_gmt: p.date_gmt })),
    ];
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
  const changed = [
    ...new Set(
      posts
        .filter((post) => {
          // WordPress returns `*_gmt` without a timezone suffix; append "Z"
          // so it isn't parsed as local time.
          const at = Date.parse(`${post.changed_gmt}Z`);
          // Scheduled posts carry a future date until they go live.
          return Number.isFinite(at) && at >= cutoff && at <= Date.now();
        })
        .map((post) => post.slug),
    ),
  ];

  for (const slug of changed) {
    revalidatePath(`/blog/${slug}`);
  }

  // Index pages keep their own short revalidate windows (they are a handful of
  // paths, so their write cost is negligible) and are intentionally not
  // touched here.
  return NextResponse.json({
    revalidated: changed.length,
    slugs: changed,
    lookbackMinutes: LOOKBACK_MINUTES,
  });
}
