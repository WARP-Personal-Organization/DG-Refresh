import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";
import { notFound } from "next/navigation";
import { BlogPostDocument } from "../../../prismicio-types";
import CategoryPageComponent from "../../components/CategoryPage";

// FIXED: Changed to Promise type for Next.js 15+
type Props = {
  params: Promise<{ catagory: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const client = createClient();

  // FIXED: Await the params promise
  const resolvedParams = await params;

  // Filter posts by the category field
  const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
    predicates: [
      prismic.filter.at("my.blog_post.category", resolvedParams.catagory),
    ],
    orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
  });

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <div className="font-open-sans">
      <CategoryPageComponent
        categoryName={
          resolvedParams.catagory.charAt(0).toUpperCase() +
          resolvedParams.catagory.slice(1)
        }
        categorySlug={resolvedParams.catagory}
        featuredArticle={posts[0]}
        newsArticles={posts}
        opinionArticles={posts}
        recommendedArticles={posts}
      />
    </div>
  );
}

// FIXED: If you have generateMetadata, update it too
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryName =
    resolvedParams.catagory.charAt(0).toUpperCase() +
    resolvedParams.catagory.slice(1);

  return {
    title: `${categoryName} Articles | Daily Guardian`,
    description: `Read the latest ${categoryName.toLowerCase()} articles and news from Daily Guardian.`,
    keywords: `${categoryName}, news, articles, Daily Guardian, ${resolvedParams.catagory}`,
  };
}

// FIXED: If you have generateStaticParams, update it too
export async function generateStaticParams() {
  const client = createClient();

  try {
    const posts = await client.getAllByType("blog_post");
    const categories = new Set<string>();

    posts.forEach((post: BlogPostDocument) => {
      if (post.data.category) {
        categories.add(post.data.category);
      }
    });

    return Array.from(categories).map((category) => ({
      catagory: category,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [
      { catagory: "news" },
      { catagory: "sports" },
      { catagory: "business" },
      { catagory: "feature" },
      { catagory: "opinion" },
      { catagory: "industries" },
    ];
  }
}
