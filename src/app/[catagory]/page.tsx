import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";
import { notFound } from "next/navigation";
import { BlogPostDocument } from "../../../prismicio-types";
import CategoryPageComponent from "../../components/CategoryPage";

type Props = {
  params: { catagory: string };
};

export default async function CategoryPage({ params }: Props) {
  const client = createClient();

  // Filter posts by the category field
  const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
    predicates: [prismic.filter.at("my.blog_post.category", params.catagory)],
    orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
  });

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <CategoryPageComponent
      categoryName={
        params.catagory.charAt(0).toUpperCase() + params.catagory.slice(1)
      }
      categorySlug={params.catagory}
      featuredArticle={posts[0]}
      newsArticles={posts}
      opinionArticles={posts}
      recommendedArticles={posts}
    />
  );
}
