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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (BOT_SCAN_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/).*)"],
};
