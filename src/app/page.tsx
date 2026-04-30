// app/page.tsx
export const revalidate = 60;

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
import {
  getAllPosts,
  getBannerNewsBySubcategory,
  getPostsByCategorySlugs,
  getTodaysPaper,
  getSupplement,
  getPaperEditions,
  getSupplementEditions,
} from "../../lib/wordpress";
import "./globals.css";

export default async function Home() {
  try {
    // Fetch each section's data in parallel with targeted amounts
    const [
      recentPosts,
      bannerBySubcategory,
      localResult,
      negrosResult,
      sportsResult,
      featuresResult,
      initiativesResult,
      nationalResult,
      editorialResult,
      voicesResult,
      youtubeVideos,
      todaysPaper,
      supplement,
      cartoonResult,
      paperEditions,
      supplementEditions,
    ] = await Promise.all([
      getAllPosts(20),
      getBannerNewsBySubcategory(30), // banner news grouped by subcategory
      getPostsByCategorySlugs(["local", "local-news", "iloilo", "western-visayas"], 6),
      getPostsByCategorySlugs(["negros", "negros-news", "bacolod"], 5),
      getPostsByCategorySlugs(["sports"], 8),
      getPostsByCategorySlugs(["feature", "features", "entertainment", "lifestyle", "health", "technology"], 10),
      getPostsByCategorySlugs(["initiatives"], 5),
      getPostsByCategorySlugs(["national", "national-news"], 5),
      getPostsByCategorySlugs(["editorial", "the-dg-view"], 8),
      getPostsByCategorySlugs(["voices", "visons", "opinion"], 9),
      getChannelVideos("@dailyguardian782").catch(() => FALLBACK_VIDEOS),
      getTodaysPaper().catch(() => null),
      getSupplement().catch(() => null),
      getPostsByCategorySlugs(["cartoon"], 5),
      getPaperEditions(30).catch(() => []),
      getSupplementEditions(10).catch(() => []),
    ]);

    // Banner news per section — fall back to regular category posts if no banner news for that section
    const bannerPicks = [
      ...Object.values(bannerBySubcategory).flat(),
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

    const localPicks = [
      ...(bannerBySubcategory["local"] ?? []),
      ...localResult.posts,
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

    const negrosPicks = [
      ...(bannerBySubcategory["negros"] ?? []),
      ...negrosResult.posts,
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

    const sportsPicks = [
      ...(bannerBySubcategory["sports"] ?? []),
      ...sportsResult.posts,
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
    const featuredPicksAsCategory = featuresResult.posts;
    const initiativesPicks = initiativesResult.posts;
    const nationalPicks = [
      ...(bannerBySubcategory["national-news"] ?? []),
      ...nationalResult.posts,
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
    const editorialPicks = editorialResult.posts;
    const voicesPicks = voicesResult.posts;

    // Featured/sticky posts come from the recent posts pool
    const featuredPicks = recentPosts.filter((p) => p.data.is_featured);

    if (recentPosts.length === 0) {
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

    // Hero and featured use banner news; editorial and local use their own sources
    const heroPost = bannerPicks[0] || featuredPicks[0] || localPicks[0] || recentPosts[0];
    const featuredPost = bannerPicks[1] || bannerPicks[0] || recentPosts[1] || recentPosts[0];

    const usedIds = new Set([heroPost.id, featuredPost.id]);

    const editorialPost = editorialPicks.find((p) => !usedIds.has(p.id)) ?? undefined;
    if (editorialPost) usedIds.add(editorialPost.id);

    const localPost = localPicks.find((p) => !usedIds.has(p.id)) ?? undefined;
    if (localPost) usedIds.add(localPost.id);

    // Fill editorial section to at least 5 posts — supplement with recent posts when the
    // editorial/the-dg-view categories don't have enough content in WordPress
    const editorialFilled =
      editorialPicks.length >= 5
        ? editorialPicks
        : [
            ...editorialPicks,
            ...recentPosts.filter(
              (p) => !editorialPicks.some((e) => e.id === p.id),
            ),
          ].slice(0, 5);

    // Combine all fetched posts for EditorsPicks in NegrosAndSports
    const allPostsForEditorsPicks = [
      ...recentPosts,
      ...localPicks,
      ...negrosPicks,
      ...sportsPicks,
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i); // deduplicate

    // Posts already shown prominently in MainContent — exclude from downstream sections
    const shownInMainContent = new Set([
      heroPost.id,
      featuredPost.id,
      ...(editorialPost ? [editorialPost.id] : []),
    ]);

    // TopStories: filter out posts already rendered in the MainContent hero/featured slots
    const topStoriesPool = (
      featuredPicks.length >= 4 ? featuredPicks : recentPosts
    ).filter((p) => !shownInMainContent.has(p.id));

    // LocalStories: skip localPicks[0] which is already shown in MainContent as localposts
    const localStoriesData = localPicks.filter((p) => !usedIds.has(p.id));

    return (
      <div className="bg-[#1b1a1b] min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 pb">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            <MainContent
              heroPost={heroPost}
              featuredPost={featuredPost}
              localposts={localPost}
              editorialPost={editorialPost}
            />
            <div className="flex flex-col gap-6 self-start sticky top-4">
              <PublicationCard
                title="Today's Paper"
                imageUrl={todaysPaper?.imageUrl || "/todaysnewspaper.png"}
                link={todaysPaper?.link || "/"}
                embedSrc={todaysPaper?.embedSrc}
                pdfUrl={todaysPaper?.pdfUrl}
                content={todaysPaper?.content}
                editions={paperEditions}
                isToday
              />
            </div>
          </div>
        </div>
        <TopStories title={"Top Stories"} stories={topStoriesPool} />
        <LocalStories title={"LOCAL"} stories={localStoriesData} />
        <NegrosAndSportsStories
          negrosTitle={"NEGROS"}
          negrosStories={negrosPicks}
          sportsTitle={"Banner News"}
          sportsStories={sportsPicks}
          allPosts={allPostsForEditorsPicks}
          supplement={supplement}
          supplementEditions={supplementEditions}
          cartoons={cartoonResult.posts}
        />
        <FeaturesStories title={"FEATURES"} stories={featuredPicksAsCategory} />
        <InitiativeAndNationStories
          initiativeTitle={"INITIATIVES"}
          initiativeStories={initiativesPicks}
          nationTitle={"NATION"}
          nationStories={nationalPicks}
        />
        <EditorialStories title={"EDITORIAL"} stories={editorialFilled} />
        <OpinionSection posts={voicesPicks} />
        {/* <EnhancedVideoSection
          videos={youtubeVideos.length > 0 ? youtubeVideos : FALLBACK_VIDEOS}
        /> */}
      </div>
    );
  } catch (err) {
    console.error("Error fetching posts from WordPress API:", err);
    return (
      <div className="bg-[#1b1a1b] min-h-screen text-white">
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
