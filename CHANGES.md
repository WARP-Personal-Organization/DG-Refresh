# Daily Guardian (DG-refresh) — Change Summary

Grouped by session/date, most recent first. Entries are committed and merged to `main` unless marked otherwise.

---

## 2026-09-01 — Editorial feedback: category leakage and editorial mis-tagging (branch `fix/editorial-category-leakage`, **not yet merged**)

Acting on `for website.docx` — 12 annotated screenshots with review comments from DG-Editorial-Rex, written in Hiligaynon. Three of the items are real bugs; the rest are design/feature requests, listed at the bottom as still open.

| File | Change |
|---|---|
| `src/app/page.tsx` | **Top Stories now carries local news only.** It drew from `getAllPosts(20)` — the 20 newest posts in *any* category — so publishing an opinion column, a sports result, or a business item put it straight onto the homepage's Top Stories rail. Editorial reported this twice, as their biggest problem with the new site. Now sourced from `localPicks`, with the LOCAL section taking what Top Stories didn't so the two rails never show the same story. |
| `src/app/page.tsx` | Local fetch raised 6 → 16, since that pool now feeds three places (MainContent, Top Stories, LOCAL). |
| `src/app/page.tsx` | **Editorials no longer duplicate into the Opinion list.** They are filed under both the `editorial` and `opinion` WordPress categories, so both fetches returned them and they rendered twice in the same block. The Editorial column owns them. |
| `lib/wordpress.ts` | **`editorial` now maps to `opinion`, not `news`.** This one line put a `NEWS` label on every editorial, and — via the `category === "news"` branch in `transformPost` — also gave editorials a locality tag they should never have had. |

**Verified** against `next build` + `next start`, parsing the rendered homepage: Top Stories returns 4 stories all labelled `local` (previously mixed categories), LOCAL returns 4 different stories, NEGROS 4, with **zero overlap** between Top Stories and LOCAL. An editorial article's breadcrumb now reads `Home > opinion` (was `Home > news`).

**Still open from the same document** — feature/design work, not yet started:

- **Pagination** requested in four places: main article list, Latest Opinion, Features, and replacing the "VIEW ALL OPINION" button with in-place paging (they want the old site's red-arrow control).
- **Embedded article images render too large on desktop** — you have to scroll past a single image. Mobile is fine. They want the old site's dimensions.
- **Byline cleanup**: drop the `STAFF` fallback when a story has no byline; remove a duplicate byline at the top of article pages; remove the `UPDATED` timestamp.
- **Publish dates on homepage story cards**, as on the old site.
- **Category labels in the Features section** (entertainment, society, environment, health, …).

Note: the comments are in Hiligaynon and the readings above are a translation — worth a native check before acting on the remaining items.

---

## 2026-08-30 — Remove the root layout's revalidate ceiling (PR #14, `4ba1132` — merged)

**Measured outcome.** Aug 31, the first full day on the new layout, against Aug 27 (before any of this work):

| Line item | Aug 27 | Aug 29 (after PR #13) | **Aug 31 (after PR #14)** |
|---|---|---|---|
| ISR Writes | $7.22 | $4.92 | **$0.67** (−91%) |
| Fast Origin Transfer | $2.31 | $1.71 | $0.61 (−74%) |
| Edge Requests | $0.60 | $1.45 | $1.22 |
| Fluid Active CPU | $0.69 | $0.57 | $0.31 |
| **Total/day** | **$11.94** | **$9.58** | **$3.47** |

**$11.94 → $3.47/day, a 71% reduction** — roughly $358/month down to $104/month. The layout ceiling was indeed the blocker: `/blog/[uid]` writes-per-path halved (2.4 → 1.33) once the route could actually hold a 24h cache, and `/[catagory]` has dropped off the top-10 routes entirely. **Edge Requests is now the largest single line item** ($1.22 of $3.47), partly the redirect hop introduced in PR #13 — that is where the next increment of savings would come from, at roughly a fifth the stakes.

**Measured outcome of the Aug 28 work first**, since it motivates this change. Comparing two adjacent full days, Aug 27 (pre-fix) against Aug 29 (post-fix):

| Line item | Aug 27 | Aug 29 | Change |
|---|---|---|---|
| ISR Writes | $7.22 | $4.92 | −32% |
| Fast Origin Transfer | $2.31 | $1.71 | −26% |
| **Edge Requests** | $0.60 | **$1.45** | **+142%** |
| Fluid Active CPU | $0.69 | $0.57 | −17% |
| ISR Reads | $0.58 | $0.47 | −19% |
| **Total/day** | **$11.94** | **$9.58** | **−20%** |

Two things to record honestly:

- **`/[catagory]` was a complete success**: 26K writes / 10K unique paths → **0 writes / 5 paths**.
- **`/blog/[uid]` went up**: 28K → 36K writes, 9K → 15K unique paths. The traffic did not vanish, it *moved* — those ~6K extra paths are the legacy flat URLs that used to be cached on `/[catagory]`. That consolidation is correct, but it only pays off if the article route can actually hold its cache, and the root layout was capping it at 30 minutes.
- **Edge Requests more than doubled** — the redirect hop is two edge requests where there was one. That was an unaccounted cost in the Aug 28 design and it ate roughly a quarter of the gain.

Note: the Observability route table (~44K writes/12h) and billing (1.23M writes/day) disagree by more than an order of magnitude, so the free-tier route counts appear to be sampled. **Billing is the number to trust.**

**Problem:** `src/app/layout.tsx` declared `revalidate = 1800` *and* ran seven WordPress fetches. Next.js takes the lowest revalidate across a route's whole layout+page tree, and the root layout wraps every route — so that 1800 was a hard 30-minute ceiling on every page in the app. `/blog/[uid]` declared 86400 and silently got 1800. Raising the number would only have moved the ceiling; the fetches themselves are what forced one to exist.

**Fix:**

| File | Change |
|---|---|
| `src/app/api/nav-data/route.ts` (new) | The seven header/nav fetches, moved out of the layout, behind `Cache-Control: s-maxage=1800, stale-while-revalidate=3600`. One CDN-cached JSON response shared by every reader, instead of a page regeneration per article. Keeps the same `withConcurrencyLimit(…, 4)` cap on the WordPress origin. |
| `src/components/SiteChrome.tsx` (new) | Client component that fetches `/api/nav-data` once on mount and renders `Header` + `NavigationBar`. Both were already client components with safe empty defaults, so the pre-fetch render is the same one they already produced whenever a WordPress call failed. |
| `src/app/layout.tsx` | No `revalidate`, no fetches, no longer `async`. Carries a comment warning that adding either one silently re-caps every route in the app. |

**Verified** via `next build` + `next start`: `/blog/[uid]` now reports **`1d`** (was `30m`). `/` and `/[catagory]` unchanged at `5m`, `/opinion` at `5m` — pages with their own lower value are unaffected, as intended. Static pages (`/about-us`, `/contact-us`, `/dg-blog`, `/dg-drive`) dropped their inherited 30m window entirely and are now fully static. `/api/nav-data` returns the identical payload the layout produced (10 posts, 36 navPosts, correct breakingPost) with the right cache header. Full route sweep still 200; legacy redirects, junk 404s, and `/e-paper` all unchanged. Confirmed in-browser that the breaking-news ticker and the nav dropdown previews populate client-side.

**Tradeoffs:**

- **Header/nav post data is no longer in the server HTML.** The nav's category links are static and still server-rendered; what moved client-side is the breaking-news headline and the article previews inside the nav dropdowns. Those are enhancement content, but it is a real change for crawlers.
- **Brief empty state** for the breaking-news line on first paint, until `/api/nav-data` resolves.
- Search still only covers the 10 posts from `getLayoutPosts` — a pre-existing limitation, now fed from the same client fetch.

**Still outstanding:** `/[catagory]/[subcategory]` (6.7K writes/12h, untouched — `generateStaticParams` returns `[]`); the `robots.ts` → `/sitemap.xml` 404; `supplement`/`todays-paper` declare `revalidate = 1800` but build as `5m`, so something in their own fetches still caps them.

---

## 2026-08-28 — Cut ISR writes at the source: edge redirects + on-demand article revalidation (PR #13, `6b0f2bb` — merged)

**Measured starting point.** Vercel billing, 17 days into the cycle: **$164.32** on-demand, of which **ISR Writes $114.38 (70%)** and **Fast Origin Transfer $38.33 (23%)** — the latter is largely a byproduct of the same regenerations, since every write ships its rendered HTML to the edge. Observability → ISR, last 12h, showed where they came from:

| Route | Reads | Writes | Unique paths |
|---|---|---|---|
| `/blog/[uid]` | 21K | 28K | 9K |
| `/[catagory]` | 13K | **26K** | **10K** |
| `/[catagory]/[subcategory]` | 7.7K | 8.3K | 1.5K |
| everything else | — | ~1.5K | 1 each |

~63K writes/12h. Two findings changed the plan:

1. **PR #12 did not reduce ISR writes.** `/anymind-sw.js` was still being written 143×/12h a day after it merged. The `.`-guard calls `notFound()`, and `notFound()` still renders and still writes a cache entry — it only skipped the WordPress calls. This is exactly the caveat the Aug 26 entry predicted; it is now confirmed empirically. Only rejection in middleware, before routing, avoids the write.
2. **`/[catagory]`'s 10K unique paths are mostly legitimate.** The six real categories are prebuilt and bill separately, so that 26K was almost entirely *legacy flat article URLs* — the old WordPress permalink structure (`/charity-delmo`), which the route resolved via WordPress and redirected to `/blog/*`. Each of those thousands of URLs held its own ISR entry, re-written every 5 minutes on every crawl. `dynamicParams = false` alone would have 404'd years of indexed inbound links.

**Fix:**

| File | Change |
|---|---|
| `src/middleware.ts` | Legacy flat URLs now 308-redirect to `/blog/<slug>` at the edge — no render, no cache write. Issued without verifying the post exists, since `/blog/[uid]` already handles unknown slugs. Guarded by an allowlist of real app routes and category slugs; dotted paths fall through untouched so `/ads.txt`, `/robots.txt`, and `public/*` still serve. |
| `src/app/[catagory]/page.tsx` | `dynamicParams = false` — only the six real category slugs render. Unknown params 404 without rendering, so junk creates no cache entry. The in-page redirect fallback is now unreachable, kept as a safety net. |
| `src/app/blog/[uid]/page.tsx` | `revalidate` 600 → 86400, and the four fetch calls that were independently pinning the route to 600s now follow it. |
| `src/app/api/revalidate-recent/route.ts` (new) | Cron poller. Asks WordPress `orderby=modified` which posts actually changed and invalidates only those, so article pages no longer need a short timer. `CRON_SECRET`-guarded; capped at 20 posts/run so a bulk edit can't stampede. |
| `lib/wordpress.ts` | `getRecentlyModifiedPosts()` — uses `modified_gmt` rather than `modified`, which is in site-local time (Asia/Manila) and would skew the cutoff by 8h. |
| `vercel.json` (new) | Cron schedule, every 10 minutes. |

**Verified** via `next build` + `next start` (not dev): all six categories, all ten static pages, `/ads.txt`, `/robots.txt`, `/black_dg.png`, `/feed` → 200. `/charity-delmo`, `/a-bitter-harvest` → 308 to the correct article. `/anymind-sw.js`, `/manifest.json`, `/wp-login.php`, `/.env`, `/xmlrpc.php` → genuine 404 with no cache write (previously 200 + a write).

**Honest limits — this is not a clean sweep:**

- **The root layout caps the article win.** `/blog/[uid]` went 10m → **30m**, not 24h. `layout.tsx` sets `revalidate = 1800` and Next.js takes the lowest value across the tree, so the 86400 is floored. Getting the full reduction requires moving the nav fetches out of the root layout — not attempted here. Setting article `revalidate` to `false` is pointless until that lands, since it would still be capped at 1800.
- **Non-dotted junk still costs one write.** `/random-junk-slug` now redirects to `/blog/random-junk-slug`, which returns 200 with a soft-404 page (same streaming-SSR quirk as above) and writes a cache entry. That junk moved from a 5-minute window to a 30-minute one rather than disappearing. Dotted junk *is* fully eliminated.
- **`/[catagory]/[subcategory]` is untouched** (8.3K writes/12h). Its `generateStaticParams` returns `[]`, so `dynamicParams = false` would 404 every subcategory; it needs its own pass.

**Separately discovered — pre-existing, not caused by this work:** `robots.ts` advertises `https://www.dailyguardian.com.ph/sitemap.xml`, but production serves that path as **HTTP 200 with `content-type: text/html`** — the "Section Not Found" page, cached in ISR. Google has been fetching an HTML error page as the sitemap. Real sitemaps are at `/sitemap/0.xml`…`/99.xml`; there is no index at `/sitemap.xml`. This change turns it into an honest 404 rather than a fake 200, but the underlying problem needs its own fix.

**Also noted:** `x-vercel-id: sin1::iad1` — functions run in a **single** region (no ISR write multiplier), but that region is `iad1` (US East) for a Philippine audience with WordPress on PH-adjacent shared hosting. Latency question, not a cost one.

**Requires before merge:** `CRON_SECRET` set in Vercel (done, Production, Secret type) and a deploy — the cron does not exist until `vercel.json` reaches production.

---

## 2026-08-26 — Block junk/bot paths before they reach ISR cache (PR #12, `fec5eba` — merged in `c39b3d3`)

**Problem:** `/[catagory]` is a single-segment catch-all route, so it silently absorbed every bot/scanner hit at the site root (`anymind-sw.js`, `wp-login.php`, `.env`, etc.). Confirmed via Vercel Observability → ISR: **16K unique paths under this one route in 12h**, vs ~6-7 real categories — the single largest write count of any route on the site, and growing day over day. Each junk path cost two wasted WordPress requests (a failed category lookup, then a failed post-slug lookup) before finally 404ing, and still created its own ISR cache write.

**Fix:**

| File | Change |
|---|---|
| `src/app/[catagory]/page.tsx` | Reject any slug containing `"."` before either WordPress call — real category/article slugs never contain one. Verified via debug logging that the WordPress fetch code path is never reached for junk slugs after this change. |
| `src/middleware.ts` (new) | Reject well-known bot/scanner probe paths (`wp-admin`, `wp-login`, `xmlrpc.php`, `.env`, `.git`, `phpmyadmin`, ...) at the edge, before Next.js routes to any page at all — the more complete fix, since a request blocked here never creates an ISR write in the first place, not just a cheaper one. |

**Important honest caveat found during this fix:** blocked junk paths in `[catagory]/page.tsx` still return HTTP 200 instead of 404 — a Next.js streaming-SSR quirk where the status header commits before `notFound()` fires deep in the render. The visible content is correct (the site's "Section Not Found" page), just not the status code. Confirmed this doesn't affect the actual goal (WordPress calls are verifiably skipped), but it's a known limitation, not fully clean.

**Also important:** this fix targets wasted WordPress requests and origin load, but ISR Writes are billed per write-event regardless of how much work that write did — so this alone likely won't dramatically move the dominant "ISR Writes" cost line. The bigger lever (proposed, not yet built) is webhook-based on-demand revalidation from WordPress, so pages only regenerate when content actually changes instead of on a timer.

**Verified:** production build (`next build` + `next start`, not dev mode) — bot-scan patterns return a genuine 404 (`/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/.env`, `/.git/config`), all real routes still 200 (`/news`, `/sports`, `/opinion`, `/ads.txt`, `/black_dg.png`, `/`, `/robots.txt`). Re-verified live on the Vercel preview deploy too.

**Game plan:** check the Aug 26 finalized number on Aug 27. If it's still not meaningfully lower, merge this PR immediately without further delay.

---

## 2026-08-24 — ISR write cost reduction (PR #11, `f136132`)

**Problem:** Vercel billing showed a flat ~$9-13/day in ISR Writes, independent of real traffic — the site's `revalidate` windows weren't actually taking effect the way the code implied.

Two causes, found via the Vercel Usage dashboard + code audit:

1. **`AutoRefresh.tsx`** called `router.refresh()` every 5 minutes on *every open browser tab*, with no check for whether the tab was even visible. A tab left open overnight kept pinging the server all night with zero real readers.
2. **The root layout's `revalidate = 300` silently capped every route in the app.** Next.js takes the *lowest* `revalidate` value across a route's whole layout+page tree — since the root layout wraps every page, its 300s (5 min) setting was overriding `blog/[uid]`'s intended 600s (10 min) window, doubling article regeneration frequency site-wide.

**Fix:**

| File | Change |
|---|---|
| `src/components/AutoRefresh.tsx` | Skips the refresh call when `document.visibilityState !== "visible"` |
| `lib/wordpress.ts` | Added optional `revalidateSeconds` param (default 300, unchanged for existing callers) to `getLayoutPosts`, `getAllPosts`, `getPostsByCategorySlugs`, `getPostBySlug`, `getRelatedPosts`, `getCommentsByPostId` |
| `src/app/layout.tsx` | `revalidate` raised 300 → 1800; nav fetches now explicitly pass 1800s so they stop imposing a 300s floor on every other route |
| `src/app/blog/[uid]/page.tsx` | Its own fetch calls now explicitly pass 600s, matching its already-declared `revalidate = 600` |

**Verified:** production build confirmed `blog/[uid]` now shows a genuine `10m` revalidate window (was `5m`); home/category/opinion pages (which have their own lower explicit `revalidate = 300`) are unaffected. `supplement`/`todays-paper` (2 pages total, more tangled fetch internals) intentionally left uncapped-from-300s for now — not worth the risk for that small a slice of cost. Deployed via PR, previewed, then merged to `main` — no regressions on homepage/article/category/opinion pages.

**Follow-up:** monitor Vercel Usage over the next few days to confirm ISR Writes actually trend down from the ~$9-13/day baseline.

---

## 2026-08-20 — WordPress origin connection-burst fix + API route hardening (`284861c`, `6f9d9af`)

**Problem:** The WordPress backend (`old.dailyguardian.com.ph`, cPanel/Bluehost hosting) was reporting intermittent connection loss. Root cause: a single homepage or root-layout render fired ~25-40+ simultaneous requests to the WordPress origin via `Promise.all` (each `getPostsByCategorySlugs` call costs 2 requests under the hood). Bluehost support confirmed the server's concurrent-connection limit is 25-30 — a single page load could hit or exceed it alone.

**Fix (`284861c`):**
- Added `lib/concurrency.ts` — `withConcurrencyLimit()`, a small tuple-typed throttled runner (like `Promise.all` but capped).
- `src/app/page.tsx`: homepage's 16 WordPress fetches now run at most 5 at a time.
- `src/app/layout.tsx`: root layout's 7 fetches now run at most 4 at a time.
- Same data, same fallbacks — only the concurrency changed. Verified homepage renders identically before/after.

**Also fixed (`6f9d9af`):** the new pagination API routes (`/api/category-posts`, `/api/subcategory-posts`, `/api/author-posts`, added the same day) were unauthenticated and uncached — anyone could loop garbage input into wasted WordPress fetches.
- Reject unknown category/subcategory slugs with a 400 instead of paying for a WP fetch.
- Cap `page` at 500.
- Added `Cache-Control` headers matching the pages they back, so repeat requests hit Vercel's edge cache instead of invoking the function every time.

---

## 2026-08-13 — ISR / Vercel caching fix (`ef262d3`) + same-day hotfixes

**Problem:** `/[catagory]` and `/[catagory]/[subcategory]` had `export const dynamic = "force-dynamic"` (added months earlier to work around a Next.js 15 conflict between `searchParams`-based pagination and ISR `revalidate`). That made every category/subcategory pageview a live function invocation — never cached, and the primary driver behind a reported 78% cache-bypass rate. `/opinion/[authorSlug]` had `revalidate = 300` set but **no `generateStaticParams`**, which silently makes a dynamic-segment page fully SSR regardless of `revalidate` — a second, previously-unknown instance of the same class of bug.

**Fix:** pages now always statically render page 1 (ISR, `revalidate = 300`); pagination beyond page 1 is fetched client-side against new JSON API routes, so the page itself never opts into dynamic rendering.

| File | Change |
|---|---|
| `lib/wordpress.ts` | Added `getAppCategorySlugs()` export for `generateStaticParams` |
| `src/app/api/category-posts/route.ts` | JSON endpoint backing `/[catagory]` pagination |
| `src/app/api/subcategory-posts/route.ts` | JSON endpoint backing `/[catagory]/[subcategory]` pagination |
| `src/app/api/author-posts/route.ts` | JSON endpoint backing `/opinion/[authorSlug]` pagination |
| `src/components/Pagination.tsx` | Added optional `onPageChange` prop — renders `<button>`s calling it instead of `<Link>`s when provided |
| `src/components/PaginatedCategoryContent.tsx` | Client component owning `/[catagory]`'s paginated list + sidebar "recommended" |
| `src/components/PaginatedSubcategoryContent.tsx` | Client component owning `/[catagory]/[subcategory]`'s paginated list + banner/breaking/featured sections |
| `src/components/AuthorArticlesPage.tsx` | Converted to a client component managing its own pagination state |
| `src/app/[catagory]/page.tsx` | Dropped `force-dynamic`; restored `revalidate = 300`; `generateStaticParams` now returns the 7 real app category slugs (was `[]`) |
| `src/app/[catagory]/[subcategory]/page.tsx` | Dropped `force-dynamic`; restored `revalidate = 300` |
| `src/app/opinion/[authorSlug]/page.tsx` | Removed `searchParams` prop; added `generateStaticParams` prebuilding the 35 curated columnists |
| `src/app/blog/[uid]/page.tsx` | Added `generateStaticParams` prebuilding the 100 most recent articles (previously none — every article cold-rendered on first visit) |

**Same-day hotfixes:** this deploy introduced two production regressions, fixed within the hour — `d1aa6b7` (`ERR_REQUIRE_ESM` crash on article pages) and `4d143aa` (replaced `isomorphic-dompurify` with `sanitize-html` to fix article 500s). A third bug from the same batch — `/opinion` colliding with `/[catagory]`'s `generateStaticParams` output and corrupting its ISR manifest — wasn't caught until `a1eb29c`, ~13 hours later.

**Verified:** production build showed all four routes as `● SSG` (3 of them were `ƒ Dynamic` before); pagination exercised live in Chrome.

---

## 2. Security hardening

- **`src/app/api/fb-ajax/route.ts`** — this proxy previously fetched *any* `https://` URL passed in a query param (open proxy / SSRF risk). Now restricted to an allowlist of `facebook.com`/`fbcdn.net` hosts, with every redirect hop re-validated against that allowlist too (capped at 5 hops), not just the initial URL. Applies to both `GET` and `POST`.
- **`src/components/FlipbookViewer.tsx`**, **`src/components/HomePageLayouts/FeaturesStories.tsx`** — embedded iframes (flipbook viewer, Rappler Communities widget) now carry a `sandbox` attribute restricting what the embedded page can do.

## 3. Bug fixes

- **`src/components/CommentSection.tsx`** — `CommentItem` was defined as a closure *inside* the `CommentSection` component body, so React saw a new component type on every render and remounted the entire comment tree (losing focus, closing forms) on any state change. Extracted to a top-level component receiving props. Also added `aria-label`s to like/dislike buttons.
- **`src/components/SearchModal.tsx`** — `searchPosts` is now memoized via `useCallback` and invoked through a ref, and the debounce effect no longer depends on `posts`/`onClose` directly. Previously, any parent re-render could reset the 300ms debounce timer or effectively restart the Escape-key listener; now both are decoupled from parent render identity.
- **`src/components/Header.tsx`** — the weather widget's demo-mode `setTimeout` wasn't cleaned up on unmount (leak); now cleared alongside the polling interval.
- **`src/components/HomePageLayouts/NegrosAndSports.tsx`** — `supplementEditions`'s default value changed from an inline `[]` literal to a module-level `EMPTY_EDITIONS` constant, avoiding a new array reference on every render that could trigger unnecessary re-renders/effect reruns downstream.
- **Timezone fixes** — date formatting in `Header.tsx`, `CartoonCard.tsx`, `CommentSection.tsx`, `VideosSection.tsx`, `SearchModal.tsx` now explicitly pins `timeZone: "Asia/Manila"` instead of using the server's local timezone, fixing dates that could display wrong (and mismatch between server/client render) for a PH-based news site.
- **`src/components/ArticleGallery.tsx`**, **`src/components/VoicesPage.tsx`** — list `key`s changed from array index to a stable identifier (`img.url`, `c.slug`), preventing subtle re-render/state bugs when items reorder.
- **`src/app/contact-us/page.tsx`** — "DG" monogram font size corrected (10px → 12px, was rendering too small).

## 4. Accessibility pass

Across `Header.tsx`, `Navigation.tsx`, `ArticleGallery.tsx`, `CartoonCard.tsx`, `DGDriveReels.tsx`, `FlipbookViewer.tsx`, `PublicationCard.tsx`, `ShareButton.tsx`, `SearchModal.tsx`, `VideosSection.tsx`, `[catagory]/error.tsx`, `dg-blog/page.tsx`, `dg-drive/page.tsx`, `CommentSection.tsx`:
- Added `type="button"` to interactive `<button>`s that had none (prevents implicit form submission when nested inside a `<form>`).
- Added `aria-label`s to icon-only buttons/links (search toggle, close buttons, social icons, prev/next controls, mobile menu, video play button).
- `Navigation.tsx` also gained an Escape-key handler to close the mobile drawer, plus `aria-hidden="true"` on the mobile overlay backdrop.

## 5. Performance

- **`next/image` adoption** — raw `<img>` tags replaced with `next/image` in `Header.tsx`, `Footer.tsx`, `DGDriveReels.tsx`, `VideosSection.tsx`, and `dg-drive/page.tsx`, enabling automatic format/size optimization. Required adding `img.youtube.com` and `images.unsplash.com` to `next.config.ts`'s allowed remote image hosts.
- **Missing `sizes` prop added** to existing `<Image fill>` usages in `HomePageLayouts/FeaturesStories.tsx`, `InitiativeAndNationStories.tsx`, `LocalStories.tsx`, `NegrosAndSports.tsx` — without it, Next.js was serving full-width images to small viewports.
- **`FlipbookViewer.tsx`** — PDF pages now render in parallel batches of 4 instead of one at a time, speeding up flipbook load.
- **`SearchModal.tsx`** — swapped a manual `isLoading` boolean for React's `useTransition`, giving smoother, non-blocking search-result updates; localStorage key versioned (`recent_searches` → `recent_searches:v1`, resetting saved searches once).
- **`src/app/layout.tsx`** — replaced the hand-rolled Google Analytics `<Script>` tags (manual `gtag.js` load + inline init script) with `@next/third-parties`'s `<GoogleAnalytics gaId="..." />` — same tracking ID, using the maintained framework-native component instead of hand-written boilerplate.

## 6. Removed dead code / retired features

| Removed | What it did | Why it's gone |
|---|---|---|
| `lib/facebook.ts` | Facebook Graph API client for fetching page posts | Feature retired |
| `src/components/FacebookFeed.tsx` | Rendered a feed using `lib/facebook.ts` | Paired with the above |
| `src/app/blog/[uid]/tts.tsx` | "Listen" text-to-speech button (Google Cloud TTS) | Feature retired — `@google-cloud/text-to-speech` dependency dropped too |
| `src/app/search/SearchResluts.tsx` | Old full-page client-side search results view | Superseded by the `SearchModal.tsx` overlay |
| `src/components/AdUnit.tsx` | Google AdSense slot wrapper | Unused — AdSense now loaded directly as a script in `layout.tsx` |
| `src/components/ArticleImageCarousel.tsx` | In-article carousel for deduped content images | Superseded by `ArticleGallery.tsx` (td-gallery-based) |
| `src/components/HomePageLayouts/CartoonAndLotto.tsx` | Combined homepage cartoon + lotto section | Superseded by `CartoonCard.tsx` |
| `src/components/LoadingScreen.tsx` | Canvas-based animated "ink drop" splash/intro screen (432 lines) | Removed entirely — a prior commit had already disabled it on first load |
| `src/components/RightSidebar.tsx` | Generic "Editor's Picks" sidebar widget | Unused |
| `src/components/SubCategory.tsx` | Older subcategory page template | Superseded by the current `[catagory]/[subcategory]/page.tsx` |
| `src/components/TodaysPaper.tsx` | Static "Today's Paper" spotlight with a hardcoded date | Superseded by the WP-backed `PublicationCard.tsx` |
| `src/components/TopStories.tsx` (top-level) | Older top-stories list | A same-named, same-purpose component still exists at `src/components/HomePageLayouts/TopStories.tsx` and is what's actually used — this looks like a relocation/dedupe rather than a pure removal. Worth a quick diff between the two before assuming zero behavior change. |

`lib/wordpress.ts` also dropped the now-unused exports that only those deleted components consumed: `stripDuplicateFeaturedImage`, `imageKey`, `stripImagesFromContent`, `extractContentImages`, `dedupeImagesByFilename`, `transformAuthor`, `getPostsByCategory`, `authorToSlug`, `getAllAuthors`, `getAllCategories`.

## 7. Refactors (no behavior change)

- `dg-drive/page.tsx`, `Footer.tsx`, `MainContent.tsx`, `src/app/layout.tsx` — inline data arrays/objects hoisted from inside the component body to module scope (e.g. `layout.tsx`'s repeated `{ posts: [], total: 0 }` fallback became a single `EMPTY_CATEGORY_RESULT` constant), so they aren't recreated every render.
- `lib/wordpress.ts` — several `.filter().map()` chains rewritten as single `.reduce()` passes.

## 8. Dependencies (`package.json` / `package-lock.json`)

- **Added:** `@next/third-parties` (used for the `GoogleAnalytics` component in `layout.tsx`), `sanitize-html` (sanitizes article HTML in `blog/[uid]/page.tsx`, replacing `isomorphic-dompurify` after the Aug 13 ESM crash), `react-doctor` (dev tool)
- **Removed:** `@google-cloud/text-to-speech` (TTS feature removed), `framer-motion` (only used by the removed `LoadingScreen.tsx`), `isomorphic-dompurify` (replaced by `sanitize-html`)
- **Bumped:** `next` 15.5.14 → 15.5.18, `eslint-config-next` to match

## 9. Config

- `next.config.ts` — added `img.youtube.com` and `images.unsplash.com` to `images.remotePatterns` (needed for the `next/image` conversions in Section 5).
