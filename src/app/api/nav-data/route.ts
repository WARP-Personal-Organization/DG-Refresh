import { NextResponse } from "next/server";
import {
  getAllPosts,
  getLayoutPosts,
  getPostsByCategorySlugs,
  type Post,
} from "../../../../lib/wordpress";
import { withConcurrencyLimit } from "../../../../lib/concurrency";

// Header/nav data, moved out of the root layout.
//
// These fetches used to run in src/app/layout.tsx. Because Next.js takes the
// LOWEST revalidate across a route's whole layout+page tree, and the root
// layout wraps every route, their 1800s window imposed a hard 30-minute floor
// on every page in the app — including /blog/[uid], which asks for 24h. With
// ~75,000 articles that floor was the dominant remaining source of billed ISR
// writes, and no per-page revalidate could exceed it.
//
// Serving the same data here instead costs a CDN-cached JSON response shared
// by every reader, rather than forcing a full page regeneration per article.
// The freshness window is unchanged at 1800s; only who pays for it changed.
const NAV_REVALIDATE_SECONDS = 1800;

const EMPTY_CATEGORY_RESULT = { posts: [] as Post[], total: 0 };

// Same cap as the old layout — this fetch set hits the WordPress origin, which
// runs on shared hosting with a limited concurrent-connection budget.
const WP_FETCH_CONCURRENCY = 4;

// No `export const revalidate` here on purpose: segment config must be a
// literal, and it would be redundant anyway. Freshness comes from two places
// that both already respect NAV_REVALIDATE_SECONDS — the Cache-Control header
// below (edge) and the per-fetch cache windows passed to the WordPress client
// (origin).
export async function GET() {
  const [
    posts,
    recentNav,
    sportsNav,
    voicesNav,
    businessNav,
    featuresNav,
    initiativesNav,
  ] = await withConcurrencyLimit(
    [
      () => getLayoutPosts(10, NAV_REVALIDATE_SECONDS).catch(() => [] as Post[]),
      () => getAllPosts(20, NAV_REVALIDATE_SECONDS).catch(() => [] as Post[]),
      () =>
        getPostsByCategorySlugs(["sports"], 4, 1, NAV_REVALIDATE_SECONDS).catch(
          () => EMPTY_CATEGORY_RESULT,
        ),
      () =>
        getPostsByCategorySlugs(
          ["voices", "visons", "opinion"],
          4,
          1,
          NAV_REVALIDATE_SECONDS,
        ).catch(() => EMPTY_CATEGORY_RESULT),
      () =>
        getPostsByCategorySlugs(
          ["business", "motoring", "tech-talk"],
          4,
          1,
          NAV_REVALIDATE_SECONDS,
        ).catch(() => EMPTY_CATEGORY_RESULT),
      () =>
        getPostsByCategorySlugs(
          ["feature", "features", "entertainment", "lifestyle", "health"],
          4,
          1,
          NAV_REVALIDATE_SECONDS,
        ).catch(() => EMPTY_CATEGORY_RESULT),
      () =>
        getPostsByCategorySlugs(["initiatives"], 4, 1, NAV_REVALIDATE_SECONDS).catch(
          () => EMPTY_CATEGORY_RESULT,
        ),
    ],
    WP_FETCH_CONCURRENCY,
  );

  // Merge all nav posts, deduplicated — each category is guaranteed representation
  const navPosts = [
    ...recentNav,
    ...sportsNav.posts,
    ...voicesNav.posts,
    ...businessNav.posts,
    ...featuresNav.posts,
    ...initiativesNav.posts,
  ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

  // Latest local+featured post for breaking news, fallback to any featured
  const breakingPost =
    posts.find((p) => p.data.subcategory === "local" && p.data.is_featured) ||
    posts.find((p) => p.data.is_featured) ||
    posts[0] ||
    null;

  return NextResponse.json(
    { posts, navPosts, breakingPost },
    {
      headers: {
        // Cached at the edge and shared across every reader, so the origin is
        // hit once per window rather than once per page regeneration.
        "Cache-Control": `public, s-maxage=${NAV_REVALIDATE_SECONDS}, stale-while-revalidate=${NAV_REVALIDATE_SECONDS * 2}`,
      },
    },
  );
}
