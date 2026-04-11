export const revalidate = 300; // ISR: rebuild at most every 5 minutes

import { notFound } from "next/navigation";
import CategoryPageComponent from "../../components/CategoryPage";
import { getAllPosts } from "../../../lib/wordpress";
import type { Post } from "../../../lib/wordpress";

type Props = {
  params: Promise<{ catagory: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.catagory;

  const allPosts: Post[] = await getAllPosts();
  const posts = allPosts.filter((p) => p.data.category === categorySlug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <div className="font-open-sans">
      <CategoryPageComponent
        categoryName={
          categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
        }
        categorySlug={categorySlug}
        featuredArticle={posts[0]}
        newsArticles={posts}
        opinionArticles={posts}
        recommendedArticles={posts}
      />
    </div>
  );
}

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

export async function generateStaticParams() {
  return [];
}
