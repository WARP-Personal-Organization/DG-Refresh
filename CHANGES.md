# Daily Guardian (DG-refresh) — Working-Tree Change Summary

Everything below is currently **uncommitted** on `main` (`git status` vs `HEAD` at commit `a362a94`). Nothing has been committed or pushed. Grouped by what changed and why, not by file — Section 1 is from this session; everything else predates it.

---

## 1. ISR / Vercel caching fix (this session)

**Problem:** `/[catagory]` and `/[catagory]/[subcategory]` had `export const dynamic = "force-dynamic"` (added months ago, commit `40ee1b9`, to work around a Next.js 15 conflict between `searchParams`-based pagination and ISR `revalidate`). That made every category/subcategory pageview a live function invocation — never cached, and the primary driver behind the reported 78% cache-bypass rate. `/opinion/[authorSlug]` had `revalidate = 300` set but **no `generateStaticParams`**, which silently makes a dynamic-segment page fully SSR regardless of `revalidate` — a second, previously-unknown instance of the same class of bug.

**Fix:** pages now always statically render page 1 (ISR, `revalidate = 300`); pagination beyond page 1 is fetched client-side against new JSON API routes, so the page itself never opts into dynamic rendering.

| File | Change |
|---|---|
| `lib/wordpress.ts` | Added `getAppCategorySlugs()` export for `generateStaticParams` |
| `src/app/api/category-posts/route.ts` *(new)* | JSON endpoint backing `/[catagory]` pagination |
| `src/app/api/subcategory-posts/route.ts` *(new)* | JSON endpoint backing `/[catagory]/[subcategory]` pagination |
| `src/app/api/author-posts/route.ts` *(new)* | JSON endpoint backing `/opinion/[authorSlug]` pagination |
| `src/components/Pagination.tsx` | Added optional `onPageChange` prop — renders `<button>`s calling it instead of `<Link>`s when provided |
| `src/components/PaginatedCategoryContent.tsx` *(new)* | Client component owning `/[catagory]`'s paginated list + sidebar "recommended" |
| `src/components/PaginatedSubcategoryContent.tsx` *(new)* | Client component owning `/[catagory]/[subcategory]`'s paginated list + banner/breaking/featured sections |
| `src/components/AuthorArticlesPage.tsx` | Converted to a client component managing its own pagination state |
| `src/app/[catagory]/page.tsx` | Dropped `force-dynamic`; restored `revalidate = 300`; `generateStaticParams` now returns the 7 real app category slugs (was `[]`) |
| `src/app/[catagory]/[subcategory]/page.tsx` | Dropped `force-dynamic`; restored `revalidate = 300` |
| `src/app/opinion/[authorSlug]/page.tsx` | Removed `searchParams` prop; added `generateStaticParams` prebuilding the 35 curated columnists |
| `src/app/blog/[uid]/page.tsx` | Added `generateStaticParams` prebuilding the 100 most recent articles (previously none — every article cold-rendered on first visit) |

**Verified:** production build (`next build`) shows all four routes as `● SSG` (3 of them were `ƒ Dynamic` before); `next start` shows `/news/local` going `MISS → HIT` on its second request; pagination exercised live in Chrome (button clicks, deep-link to `?page=3`, no console errors introduced).

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

- **Added:** `@next/third-parties` (used for the `GoogleAnalytics` component in `layout.tsx`), `isomorphic-dompurify` (sanitizes article HTML in `blog/[uid]/page.tsx`), `react-doctor` (dev tool)
- **Removed:** `@google-cloud/text-to-speech` (TTS feature removed), `framer-motion` (only used by the removed `LoadingScreen.tsx`)
- **Bumped:** `next` 15.5.14 → 15.5.18, `eslint-config-next` to match

## 9. Config

- `next.config.ts` — added `img.youtube.com` and `images.unsplash.com` to `images.remotePatterns` (needed for the `next/image` conversions in Section 5).
