import { getAllPosts } from "../../../lib/wordpress";

const SITE_URL = "https://dailyguardian.com.ph";

export async function GET() {
  const posts = await getAllPosts(20).catch(() => []);

  const lastBuildDate = posts[0]
    ? new Date(posts[0].data.published_date).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.uid}`;
      const pubDate = new Date(post.data.published_date).toUTCString();
      const author = post.data.author ?? "Daily Guardian";

      // Build category tags from category, subcategory, and tags
      const categorySet = new Set<string>();
      if (post.data.category) categorySet.add(post.data.category.toUpperCase());
      if (post.data.subcategory) categorySet.add(post.data.subcategory.toUpperCase());
      post.data.tags?.forEach((t) => categorySet.add(t.toUpperCase()));
      const categoryTags = [...categorySet]
        .map((c) => `        <category><![CDATA[${c}]]></category>`)
        .join("\n");

      return `
    <item>
        <title>${escapeXml(post.data.title ?? "")}</title>
        <link>${url}</link>
        <comments>${url}#respond</comments>
        <dc:creator><![CDATA[${author}]]></dc:creator>
        <pubDate>${pubDate}</pubDate>
${categoryTags}
        <guid isPermaLink="true">${url}</guid>
        <description><![CDATA[${post.data.summary ?? ""}]]></description>
        <content:encoded><![CDATA[${post.data.content ?? ""}]]></content:encoded>
        <wfw:commentRss>${url}/feed/</wfw:commentRss>
        <slash:comments>0</slash:comments>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    >

<channel>
    <title>Daily Guardian</title>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
    <link>${SITE_URL}</link>
    <description>We write, you decide.</description>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>
    hourly    </sy:updatePeriod>
    <sy:updateFrequency>
    1    </sy:updateFrequency>
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
