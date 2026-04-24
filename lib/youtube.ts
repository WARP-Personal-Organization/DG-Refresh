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
      "Before the Enhanced Community Quarantine, University of the Philippines held Business Leaders' Summit 5.0 where Senior High and College students in Western Visayas were given a two-day immersion into the corporate world. This episode is all about the experience at BLS 5, and it has a surprise host!",
    thumbnail: "https://img.youtube.com/vi/pspDeWO-HHQ/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://youtu.be/pspDeWO-HHQ?si=wslbtRzWA7Qm0alk",
  },
  {
    id: "2",
    videoId: "BMjJ5W3IV_Q",
    title: "DGD Episode 8: Dinagyang Badminton Cup",
    description:
      "Reviving a proud tradition in the Dinagyang Festival, the Dinagyang Badminton Cup returns and is once again embraced by the Iloilo Badminton community with over 400 smashers including world-class players from the national pool vying for 130K in cash prizes.",
    thumbnail: "https://img.youtube.com/vi/BMjJ5W3IV_Q/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://youtu.be/BMjJ5W3IV_Q?si=OsFUsalbfT698_7k",
  },
  {
    id: "3",
    videoId: "HDwa0s1ax_I",
    title: "DGD Episode 7: DG Initiative Night",
    description:
      "The Daily Guardian Initiative was first founded in April 2019 to create a network of passion and advocacy-based organizations and individuals who can give more perspectives to the shared story of human experience.",
    thumbnail: "https://img.youtube.com/vi/HDwa0s1ax_I/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://youtu.be/HDwa0s1ax_I?si=nfE7V-Jc2sjwfPJg",
  },
  {
    id: "4",
    videoId: "0eGJDJL-w3o",
    title: "DGD Episode 5: Pride",
    description:
      "Iloilo City's 4th Pride March was powerful in its unity, and its diversity. With an appearance by Senator Risa Hontiveros, a battalion of 5,000 strong, and the support of the Iloilo City Government, Ilonggos show that their strongest weapon is love.",
    thumbnail: "https://img.youtube.com/vi/0eGJDJL-w3o/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=0eGJDJL-w3o",
  },
  {
    id: "5",
    videoId: "E9cX2N5H2Nc",
    title: "DGD Episode 4: The Royal Homecoming",
    description:
      "The Iloilo United-Royals of the Maharlika Pilipinas Basketball League came home for the first time and we were there to document all of it. Let us take you through the Royal Homecoming of OUR MPBL Team!",
    thumbnail: "https://img.youtube.com/vi/E9cX2N5H2Nc/mqdefault.jpg",
    publishDate: "",
    videoUrl: "https://www.youtube.com/watch?v=E9cX2N5H2Nc",
  },
];

export async function getChannelVideos(
  handle = "@dailyguardian782",
): Promise<YouTubeVideo[]> {
  try {
    const channelId = await resolveChannelId(handle);
    if (!channelId) return [];

    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }, // refresh every hour
    );

    if (!rssRes.ok) return [];

    const xml = await rssRes.text();
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    return entries.slice(0, 10).map((entry, index) => {
      const videoId =
        entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeEntities(
        entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "",
      );
      const description = decodeEntities(
        entry
          .match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]
          ?.trim() ?? "",
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
