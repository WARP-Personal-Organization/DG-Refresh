# Daily Guardian (DG-refresh) — Change Summary

Grouped by session/date, most recent first. Entries are committed and merged to `main` unless marked otherwise.

---

## 2026-08-26 — Block junk/bot paths before they reach ISR cache (PR #12, `fec5eba` — **open, not yet merged, pending Aug 27 review**)

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
