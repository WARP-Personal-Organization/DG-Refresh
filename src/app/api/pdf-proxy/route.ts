import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const ALLOWED_ORIGINS = [
    "https://dailyguardian.com.ph/",
    "https://old.dailyguardian.com.ph/",
    "https://bit.ly/",
  ];

  if (!ALLOWED_ORIGINS.some((o) => url.startsWith(o))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rewrite main domain to old subdomain; bit.ly links will be followed via redirect
  const fetchUrl = url.replace("https://dailyguardian.com.ph/", "https://old.dailyguardian.com.ph/");

  try {
    const res = await fetch(fetchUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://old.dailyguardian.com.ph/",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, {
        status: res.status,
      });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch PDF", { status: 500 });
  }
}
