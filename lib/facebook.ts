// lib/facebook.ts
// Fetches recent posts from the Daily Guardian Facebook page via the Graph API.
// Requires FB_APP_ID and FB_APP_SECRET env vars (free Facebook App — no approval needed).
// Get them at https://developers.facebook.com → Create App → Business.

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
}

const PAGE_ID = "DailyGuardianPH";
const GRAPH_VERSION = "v19.0";

export async function getFacebookPosts(limit = 6): Promise<FacebookPost[]> {
  const appId = process.env.FB_APP_ID;
  const appSecret = process.env.FB_APP_SECRET;

  if (!appId || !appSecret) return [];

  const token = `${appId}|${appSecret}`;
  const fields = "message,story,created_time,full_picture,permalink_url";
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/posts` +
    `?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as FacebookPost[]) ?? [];
  } catch {
    return [];
  }
}
