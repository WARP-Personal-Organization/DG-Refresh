"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NavigationBar from "@/components/Navigation";
import type { Post } from "../../lib/wordpress";

// Header and nav, fed client-side from /api/nav-data.
//
// This data used to be fetched in the root layout on the server. Because
// Next.js takes the lowest revalidate across a route's layout+page tree, that
// put a 30-minute ceiling on every page in the app — /blog/[uid] could not
// cache for 24h no matter what it declared. Moving the fetch here removes that
// ceiling entirely: the layout no longer touches WordPress, so it imposes no
// revalidate floor on anything.
//
// Header and NavigationBar were already client components with safe empty
// defaults, so the pre-fetch render is the same one they already produced
// whenever a WordPress call failed — the breaking-news line and the nav
// dropdown previews are simply absent until the fetch resolves. The nav's
// category links are static and render immediately.

type NavData = {
  posts: Post[];
  navPosts: Post[];
  breakingPost: Post | null;
};

const EMPTY: NavData = { posts: [], navPosts: [], breakingPost: null };

export default function SiteChrome() {
  const [data, setData] = useState<NavData>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/nav-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: NavData | null) => {
        if (!cancelled && json) setData(json);
      })
      .catch(() => {
        // Non-fatal: header and nav already render without this data.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header posts={data.posts} breakingPost={data.breakingPost} />
      <NavigationBar navPosts={data.navPosts} />
    </>
  );
}
