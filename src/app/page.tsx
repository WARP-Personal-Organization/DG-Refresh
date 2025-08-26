// app/page.tsx
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import NavigationBar from "@/components/Navigation";
import OpinionSection from "@/components/Opinion";
import RightSidebar from "@/components/RightSidebar";
import TopStories from "@/components/TopStories";
import EnhancedVideoSection from "@/components/VideosSection";
import { client } from "../../lib/prismicio";
import type { BlogPostDocument } from "../../prismicio-types";

export default async function Home() {
  try {
    // Fetch all blog posts
    const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });
    console.log(posts);

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
    const heroPost = featuredPosts[0] || newsPosts[0] || posts[0];
    const featuredPost =
      sportsPosts[0] ||
      featuredPosts[1] ||
      businessPosts[0] ||
      posts[1] ||
      posts[0];
    const editorialPost = newsPosts[1] || newsPosts[0] || posts[2];

    return (
      <div className="bg-[1b1a1b] min-h-screen text-white">
        {/* Pass posts to Header for search functionality */}
        {/* <Header posts={posts} />
        <NavigationBar /> */}

        {/* Overall Layout Structure */}
        <div className="max-w-7xl mx-auto px-4 py-8 pb">
          <div className="grid lg:grid-cols-4 gap-8">
            <MainContent
              heroPost={heroPost}
              featuredPost={featuredPost}
              editorialPost={editorialPost}
            />
            <RightSidebar editorsPicks={posts} />
          </div>
        </div>
        <TopStories title={"Top Stories"} stories={posts} />
        <TopStories title={"Local News"} stories={posts} />
        <TopStories title={"Negros"} stories={posts} />
        <OpinionSection />
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
