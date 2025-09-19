// app/page.tsx
import Header from "@/components/Header";
import EditorialStories from "@/components/HomePageLayouts/EditorialStories";
import FeaturesStories from "@/components/HomePageLayouts/FeaturesStories";
import InitiativeAndNationStories from "@/components/HomePageLayouts/InitiativeAndNationStories";
import LocalStories from "@/components/HomePageLayouts/LocalStories";
import NegrosAndSportsStories, {
  PublicationCard,
} from "@/components/HomePageLayouts/NegrosAndSports";
import TopStories from "@/components/HomePageLayouts/TopStories";
import MainContent from "@/components/MainContent";
import NavigationBar from "@/components/Navigation";
import OpinionSection from "@/components/Opinion";
import RightSidebar from "@/components/RightSidebar";
import EnhancedVideoSection from "@/components/VideosSection";
import { client } from "../../lib/prismicio";
import type {
  AuthorOpinionDocument,
  BlogPostDocument,
} from "../../prismicio-types";
import "./globals.css";
export default async function Home() {
  try {
    // Fetch all blog posts
    const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });
    console.log(posts);

    // Fetch all author opinions
    const authors: AuthorOpinionDocument[] = await client.getAllByType(
      "author_opinion",
      {
        orderings: [{ field: "my.author_opinion.name", direction: "asc" }],
      }
    );
    console.log(authors);

    // Handle case where no posts exist
    if (!posts || posts.length === 0) {
      return (
        <div className="bg-black min-h-screen text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center bg-black border-2 border-yellow-500/30 rounded-xl p-12">
              <h1 className="text-3xl font-bold mb-4 text-yellow-400">
                No Content Available
              </h1>
              <p className="text-gray-300">
                Please create some blog posts in Prismic to see content here.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Filter and select posts for different sections
    const featuredPosts = posts.filter(
      (post) => post.data.is_featured === true
    );
    const newsPosts = posts.filter((post) => post.data.category === "news");
    const sportsPosts = posts.filter((post) => post.data.category === "sports");
    const businessPosts = posts.filter(
      (post) => post.data.category === "business"
    );
    // Select specific posts for each component section with better fallbacks
    // const heroPost = featuredPosts[0] || newsPosts[0] || posts[0];
    // const featuredPost =
    //   sportsPosts[0] ||
    //   featuredPosts[1] ||
    //   businessPosts[0] ||
    //   posts[1] ||
    //   posts[0];

    // Filter for editor's picks and sort by latest published date
    const editorsPicks = posts
      .filter((post) => post.data.editors_pick === true)
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const featuredPicks = posts
      .filter((post) => post.data.is_featured === true)
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const breakingNews = posts
      .filter((post) => post.data.is_breaking_news === true)
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const localPicks = posts
      .filter((post) => post.data.subcategory === "local")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const negrosPicks = posts
      .filter((post) => post.data.subcategory === "negros")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const sportsPicks = posts
      .filter((post) => post.data.category === "sports")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const featuredPicksAsCategory = posts
      .filter((post) => post.data.category === "feature")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const initiativesPicks = posts
      .filter((post) => post.data.category === "initiatives")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const nationalPicks = posts
      .filter((post) => post.data.subcategory === "national-news")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });
    const editorialPicks = posts
      .filter((post) => post.data.subcategory === "editorial")
      .sort((a, b) => {
        // Sort by published_date in descending order (latest first)
        const dateA = new Date(a.data.published_date || "");
        const dateB = new Date(b.data.published_date || "");
        return dateB.getTime() - dateA.getTime();
      });

    const editorialPost = newsPosts[1] || newsPosts[0] || posts[2];

    return (
      <div className="bg-[1b1a1b] min-h-screen text-white">
        {/* Pass posts to Header for search functionality */}
        {/* <Header posts={posts} />
        <NavigationBar /> */}

        {/* Overall Layout Structure */}

        <div className="max-w-7xl mx-auto px-4 py-8 pb">
          {/* <Header  posts={posts}/> */}
          <div className="grid lg:grid-cols-4 gap-8">
            <MainContent
              heroPost={breakingNews[0]}
              featuredPost={featuredPicks[0]}
              localposts={localPicks[0]}
              editorialPost={editorialPost}
            />
            {/* <RightSidebar editorsPicks={editorsPicks} /> */}
            <PublicationCard
              title="Today's Paper"
              imageUrl={"/Todays'News.PNG"}
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
          sportsStories={posts.length > 0 ? sportsPicks : sportsPicks}
        />
        <FeaturesStories title={"FEATURES"} stories={featuredPicksAsCategory} />
        <InitiativeAndNationStories
          initiativeTitle={"INITIATIVES"}
          initiativeStories={initiativesPicks}
          nationTitle={"NATION"}
          nationStories={nationalPicks}
        />
        <EditorialStories title={"EDITORIAL"} stories={editorialPicks} />
        <OpinionSection authors={authors} />
        <EnhancedVideoSection />
      </div>
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
    return (
      <div className="bg-[1b1a1b] min-h-screen text-white">
        <Header posts={[]} />
        <NavigationBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            <h1 className="text-2xl font-bold mb-4">Unable to load content</h1>
            <p>
              Please check your Prismic configuration and try refreshing the
              page.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
