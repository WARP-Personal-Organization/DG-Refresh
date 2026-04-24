import { NextRequest, NextResponse } from "next/server";

// Pass-through proxy for Facebook AJAX calls made by the plugin JS.
// Allows the plugin to fetch timeline data without CORS errors.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("https://")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const res = await fetch(url, {
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
  if (!url || !url.startsWith("https://")) {
    return new NextResponse("Bad request", { status: 400 });
  }
  try {
    const body = await req.arrayBuffer();
    const res = await fetch(url, {
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
