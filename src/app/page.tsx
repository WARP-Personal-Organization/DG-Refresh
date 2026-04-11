// app/page.tsx
export const revalidate = 300; // ISR: rebuild at most every 5 minutes

import Header from "@/components/Header";
import EditorialStories from "@/components/HomePageLayouts/EditorialStories";
import FeaturesStories from "@/components/HomePageLayouts/FeaturesStories";
import InitiativeAndNationStories from "@/components/HomePageLayouts/InitiativeAndNationStories";
import LocalStories from "@/components/HomePageLayouts/LocalStories";
import NegrosAndSportsStories from "@/components/HomePageLayouts/NegrosAndSports";
import TopStories from "@/components/HomePageLayouts/TopStories";
import MainContent from "@/components/MainContent";
import NavigationBar from "@/components/Navigation";
import OpinionSection from "@/components/Opinion";
import { PublicationCard } from "@/components/PublicationCard";
import EnhancedVideoSection from "@/components/VideosSection";
import { getChannelVideos, FALLBACK_VIDEOS } from "../../lib/youtube";
import { getAllPosts } from "../../lib/wordpress";
import type { Post } from "../../lib/wordpress";
import "./globals.css";

export default async function Home() {
  try {
    // Fetch all posts from WordPress REST API
    const [posts, youtubeVideos]: [Post[], Awaited<ReturnType<typeof getChannelVideos>>] = await Promise.all([
      getAllPosts(),
      getChannelVideos("@dailyguardian782").catch(() => FALLBACK_VIDEOS),
    ]);

    if (!posts || posts.length === 0) {
      return (
        <div className="bg-black min-h-screen text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center bg-black border-2 border-yellow-500/30 rounded-xl p-12">
              <h1 className="text-3xl font-bold mb-4 text-yellow-400">
                No Content Available
              </h1>
              <p className="text-gray-300">
                No posts found from the Daily Guardian API.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ── Section filters ────────────────────────────────────────────────────
    const featuredPicks = posts
      .filter((p) => p.data.is_featured)
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const breakingNews = posts
      .filter((p) => p.data.is_breaking_news)
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const localPicks = posts
      .filter((p) => p.data.subcategory === "local")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const negrosPicks = posts
      .filter((p) => p.data.subcategory === "negros")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const sportsPicks = posts
      .filter((p) => p.data.category === "sports")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const featuredPicksAsCategory = posts
      .filter((p) => p.data.category === "feature")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const initiativesPicks = posts
      .filter((p) => p.data.category === "initiatives")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const nationalPicks = posts
      .filter((p) => p.data.subcategory === "national-news")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const editorialPicks = posts
      .filter((p) => p.data.subcategory === "editorial")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    const voicesPicks = posts
      .filter((p) => p.data.category === "voices" || p.data.category === "opinion")
      .sort(
        (a, b) =>
          new Date(b.data.published_date).getTime() -
          new Date(a.data.published_date).getTime()
      );

    // Hero / featured post fallback: sticky → featured → latest
    const heroPost =
      breakingNews[0] || featuredPicks[0] || localPicks[0] || posts[0];
    const featuredPost =
      featuredPicks[0] || posts[1] || posts[0];
    const editorialPost = editorialPicks[0] || posts[2] || posts[0];

    return (
      <div className="bg-[1b1a1b] min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 pb">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            <MainContent
              heroPost={heroPost}
              featuredPost={featuredPost}
              localposts={localPicks[0]}
              editorialPost={editorialPost}
            />
            <PublicationCard
              title="Today's Paper"
              imageUrl={"/todaysnewspaper.png"}
              link="https://dailyguardian.com.ph/todays-paper/"
            />
          </div>
        </div>
        <TopStories title={"Top Stories"} stories={featuredPicks} />
        <LocalStories title={"LOCAL"} stories={localPicks} />
        <NegrosAndSportsStories
          negrosTitle={"NEGROS"}
          negrosStories={negrosPicks}
          sportsTitle={"Banner News"}
          sportsStories={sportsPicks}
          allPosts={posts}
        />
        <FeaturesStories title={"FEATURES"} stories={featuredPicksAsCategory} />
        <InitiativeAndNationStories
          initiativeTitle={"INITIATIVES"}
          initiativeStories={initiativesPicks}
          nationTitle={"NATION"}
          nationStories={nationalPicks}
        />
        <EditorialStories title={"EDITORIAL"} stories={editorialPicks} />
        <OpinionSection posts={voicesPicks} />
        <EnhancedVideoSection videos={youtubeVideos.length > 0 ? youtubeVideos : FALLBACK_VIDEOS} />
      </div>
    );
  } catch (err) {
    console.error("Error fetching posts from WordPress API:", err);
    return (
      <div className="bg-[1b1a1b] min-h-screen text-white">
        <Header posts={[]} />
        <NavigationBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            <h1 className="text-2xl font-bold mb-4">Unable to load content</h1>
            <p>
              Could not reach the Daily Guardian API. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
