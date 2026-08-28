import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Well-known bot/scanner probe paths — never real content on this site.
// Rejected here, before Next.js routes to any page, so these never reach
// [catagory]'s catch-all and never create an ISR cache write for a path
// nobody will ever request again.
const BOT_SCAN_PATTERNS = [
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/wp-json/i,
  /^\/xmlrpc\.php/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/phpmyadmin/i,
  /^\/administrator/i,
  /^\/config\.php/i,
  /^\/vendor\/phpunit/i,
  /^\/\.well-known\/(?!(security\.txt|change-password))/i,
];

// Single-segment paths that belong to a real page in src/app. These must fall
// through to Next.js untouched — the legacy-article redirect below would
// otherwise swallow them.
const APP_ROUTES = new Set([
  "about-us",
  "blog",
  "contact-us",
  "dg-blog",
  "dg-drive",
  "feed",
  "opinion",
  "policies", // src/app/Policies — matched case-insensitively below
  "search",
  "supplement",
  "todays-paper",
]);

// The app-level category slugs that /[catagory] actually renders. Kept in sync
// with APP_CATEGORY_WP_SLUGS in lib/wordpress.ts (minus "opinion", which has
// its own route). Duplicated rather than imported because middleware runs in a
// separate bundle and importing the WordPress client would pull the whole
// module graph into it.
const CATEGORY_SLUGS = new Set([
  "news",
  "sports",
  "business",
  "feature",
  "initiatives",
  "voices",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BOT_SCAN_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // Legacy flat article URLs. The old WordPress site published articles at the
  // site root (/charity-delmo), and years of inbound links and Google's index
  // still point there. /[catagory]/page.tsx used to handle this by fetching
  // the slug from WordPress and redirecting if it turned out to be a post —
  // correct, but it meant every one of those thousands of URLs rendered
  // through the catch-all and got its own ISR cache entry, re-written on every
  // crawl. That single route was writing 26K cache entries per 12h across 10K
  // unique paths, none of which were real categories.
  //
  // Redirecting here instead costs no render and no cache write. It is issued
  // without checking whether the post exists: /blog/[uid] already 404s
  // unknown slugs, so a bad guess ends up in the same place it would have
  // anyway, one hop later.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1) {
    const slug = segments[0];
    const isStaticFile = slug.includes(".");
    const isKnownRoute =
      APP_ROUTES.has(slug.toLowerCase()) || CATEGORY_SLUGS.has(slug.toLowerCase());

    if (!isStaticFile && !isKnownRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/blog/${slug}`;
      // 308 rather than 307: these moved permanently when the site migrated
      // off the flat permalink structure, and a permanent redirect lets search
      // engines consolidate the old URLs onto /blog/*.
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/).*)"],
};
