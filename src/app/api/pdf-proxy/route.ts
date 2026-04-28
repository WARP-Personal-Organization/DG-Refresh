import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow fetching from the Daily Guardian domain
  if (!url.startsWith("https://dailyguardian.com.ph/") && !url.startsWith("https://old.dailyguardian.com.ph/")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rewrite main domain URLs to old subdomain where files are actually stored
  const fetchUrl = url.replace("https://dailyguardian.com.ph/", "https://old.dailyguardian.com.ph/");

  try {
    const res = await fetch(fetchUrl, {
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
