// lib/youtube.ts
// Fetches videos from a YouTube channel via RSS feed (no API key required)

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishDate: string;
  videoUrl: string;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function resolveChannelId(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/${handle}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86400 }, // re-resolve once a day
    });
    const html = await res.text();
    const match = html.match(/"channelId":"(UC[^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

// Known DGD episodes used as fallback when the RSS fetch fails
export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "1",
    videoId: "pspDeWO-HHQ",
    title: "DGD Episode 9: Business Leaders' Summit 5.0",
    description:
      "An exclusive look at the annual business summit featuring local entrepreneurs and industry leaders discussing the future of our local economy.",
    thumbnail: "https://img.youtube.com/vi/pspDeWO-HHQ/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=pspDeWO-HHQ",
  },
  {
    id: "2",
    videoId: "6Q7Jz1Xqz8A",
    title: "DGD Episode 8: Daily Guardian Cup 2019",
    description:
      "Highlights from the annual Daily Guardian sponsored community sports championship.",
    thumbnail: "https://img.youtube.com/vi/6Q7Jz1Xqz8A/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=6Q7Jz1Xqz8A",
  },
  {
    id: "3",
    videoId: "QHc9j3QMwOg",
    title: "DGD Episode 7: Pride Celebration",
    description:
      "Community comes together for the annual Pride celebration in downtown.",
    thumbnail: "https://img.youtube.com/vi/QHc9j3QMwOg/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=QHc9j3QMwOg",
  },
  {
    id: "4",
    videoId: "Zn5G6n4S3Yk",
    title: "DGD Episode 6: The Royal Homecoming",
    description: "Local high school celebrates homecoming with record attendance.",
    thumbnail: "https://img.youtube.com/vi/Zn5G6n4S3Yk/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=Zn5G6n4S3Yk",
  },
  {
    id: "5",
    videoId: "XkQvTn3LHSE",
    title: "DGD Episode 5: Iloilo Fade Barber",
    description: "Meet the local barber who has become a community institution.",
    thumbnail: "https://img.youtube.com/vi/XkQvTn3LHSE/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=XkQvTn3LHSE",
  },
  {
    id: "6",
    videoId: "mNjIHbMDFH0",
    title: "DGD Episode 4: Ilonggo Hablon Heritage",
    description:
      "Exploring the traditional weaving techniques of local artisans.",
    thumbnail: "https://img.youtube.com/vi/mNjIHbMDFH0/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=mNjIHbMDFH0",
  },
];

export async function getChannelVideos(
  handle = "@dailyguardian782"
): Promise<YouTubeVideo[]> {
  try {
    const channelId = await resolveChannelId(handle);
    if (!channelId) return [];

    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } } // refresh every hour
    );

    if (!rssRes.ok) return [];

    const xml = await rssRes.text();
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    return entries.slice(0, 10).map((entry, index) => {
      const videoId =
        entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeEntities(
        entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? ""
      );
      const description = decodeEntities(
        entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() ?? ""
      );
      const publishDate =
        entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";

      return {
        id: String(index + 1),
        videoId,
        title,
        description: description.substring(0, 200),
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        publishDate,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch {
    return [];
  }
}
