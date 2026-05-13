import { getAllPosts } from "../../../lib/wordpress";

const SITE_URL = "https://dailyguardian.com.ph";

export async function GET() {
  const posts = await getAllPosts(20).catch(() => []);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.uid}`;
      const pubDate = new Date(post.data.published_date).toUTCString();
      const title = escapeXml(post.data.title ?? "");
      const summary = escapeXml(post.data.summary ?? "");
      const author = escapeXml(post.data.author ?? "Daily Guardian");
      const category = escapeXml(post.data.category ?? "");
      const image = post.data.featured_image?.url ?? "";

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
      ${category ? `<category><![CDATA[${post.data.category.toUpperCase()}]]></category>` : ""}
      <description><![CDATA[${post.data.summary ?? ""}${image ? `<br/><img src="${image}" alt="${post.data.title}" />` : ""}]]></description>
      <content:encoded><![CDATA[${post.data.content ?? ""}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
>
<channel>
  <title>Daily Guardian</title>
  <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
  <link>${SITE_URL}</link>
  <description>We write, you decide.</description>
  <language>en-US</language>
  <sy:updatePeriod>hourly</sy:updatePeriod>
  <sy:updateFrequency>1</sy:updateFrequency>
  <image>
    <url>${SITE_URL}/DG-Symbol-Black-1-300x300-1.png</url>
    <title>Daily Guardian</title>
    <link>${SITE_URL}</link>
    <width>32</width>
    <height>32</height>
  </image>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
