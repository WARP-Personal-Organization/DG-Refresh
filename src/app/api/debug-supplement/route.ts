import { NextResponse } from "next/server";

const SUPPLEMENT_URL = "https://old.dailyguardian.com.ph/3d-flip-book/supplement/";
const WP_API = "https://old.dailyguardian.com.ph/wp-json/wp/v2";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. WordPress REST API — page slug "supplement"
  try {
    const res = await fetch(`${WP_API}/pages?slug=supplement&_embed=1`, {
      headers: { Accept: "application/json" },
    });
    const pages = await res.json();
    const page = pages[0];
    results.wp_rest_page = {
      found: !!page,
      id: page?.id,
      slug: page?.slug,
      link: page?.link,
      has_content: !!page?.content?.rendered,
      content_length: page?.content?.rendered?.length ?? 0,
      content_snippet: page?.content?.rendered?.slice(0, 500),
      has_featured_image: !!page?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      fb3d_in_content: page?.content?.rendered?.includes("FB3D_CLIENT_DATA") ?? false,
      pdf_href_in_content: /href=["'][^"']+\.pdf/i.test(page?.content?.rendered ?? ""),
    };
  } catch (e) {
    results.wp_rest_page = { error: String(e) };
  }

  // 2. Direct HTML fetch of supplement page
  try {
    const res = await fetch(SUPPLEMENT_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DGReader/1.0)" },
    });
    const html = await res.text();
    results.direct_html = {
      status: res.status,
      final_url: res.url,
      html_length: html.length,
      has_fb3d: html.includes("FB3D_CLIENT_DATA"),
      fb3d_snippet: (() => {
        const m = html.match(/FB3D_CLIENT_DATA[^;]{0,300}/);
        return m?.[0] ?? null;
      })(),
      pdf_links: (() => {
        const matches = [...html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)];
        return matches.map((m) => m[1]);
      })(),
      iframe_srcs: (() => {
        const matches = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)];
        return matches.map((m) => m[1]);
      })(),
    };
  } catch (e) {
    results.direct_html = { error: String(e) };
  }

  // 3. WordPress media library — search for PDF files named "supplement"
  try {
    const res = await fetch(
      `${WP_API}/media?search=supplement&mime_type=application/pdf&per_page=5&orderby=date&order=desc`,
      { headers: { Accept: "application/json" } },
    );
    const media = await res.json();
    results.wp_media_pdfs = media.map((m: { id: number; slug: string; source_url: string; date: string }) => ({
      id: m.id,
      slug: m.slug,
      url: m.source_url,
      date: m.date,
    }));
  } catch (e) {
    results.wp_media_pdfs = { error: String(e) };
  }

  return NextResponse.json(results, { status: 200 });
}
