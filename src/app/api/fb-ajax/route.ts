import { NextRequest, NextResponse } from "next/server";

// Pass-through proxy for Facebook AJAX calls made by the plugin JS.
// Allows the plugin to fetch timeline data without CORS errors.

// This route only ever needs to reach Facebook's own domains (see the
// proxy() regex in fb-plugin/route.ts). Restricting to that allowlist,
// on both the requested URL and every redirect hop, closes it off as an
// open proxy / SSRF vector for arbitrary destinations.
const MAX_REDIRECTS = 5;

function isAllowedFacebookHost(hostname: string): boolean {
  return (
    hostname === "facebook.com" ||
    hostname.endsWith(".facebook.com") ||
    hostname === "fbcdn.net" ||
    hostname.endsWith(".fbcdn.net")
  );
}

function isAllowedFacebookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && isAllowedFacebookHost(parsed.hostname);
  } catch {
    return false;
  }
}

async function fetchFollowingAllowedRedirects(
  url: string,
  init: RequestInit,
): Promise<Response> {
  let currentUrl = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(currentUrl, { ...init, redirect: "manual" });
    if (res.status < 300 || res.status >= 400 || !res.headers.get("location")) {
      return res;
    }
    const nextUrl = new URL(res.headers.get("location")!, currentUrl).toString();
    if (!isAllowedFacebookUrl(nextUrl)) {
      throw new Error("Redirect target is not an allowed Facebook host");
    }
    currentUrl = nextUrl;
  }
  throw new Error("Too many redirects");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !isAllowedFacebookUrl(url)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const res = await fetchFollowingAllowedRedirects(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
    });
    const body = await res.arrayBuffer();
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    const ct = res.headers.get("content-type");
    if (ct) headers.set("content-type", ct);
    return new NextResponse(body, { status: res.status, headers });
  } catch {
    return new NextResponse("Proxy error", { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !isAllowedFacebookUrl(url)) {
    return new NextResponse("Bad request", { status: 400 });
  }
  try {
    const body = await req.arrayBuffer();
    const res = await fetchFollowingAllowedRedirects(url, {
      method: "POST",
      body,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        "Content-Type": req.headers.get("content-type") ?? "application/x-www-form-urlencoded",
      },
    });
    const resBody = await res.arrayBuffer();
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    const ct = res.headers.get("content-type");
    if (ct) headers.set("content-type", ct);
    return new NextResponse(resBody, { status: res.status, headers });
  } catch {
    return new NextResponse("Proxy error", { status: 502 });
  }
}
