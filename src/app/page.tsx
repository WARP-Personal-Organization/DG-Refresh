import Image from "next/image";
import Link from "next/link";
import { client } from "../../lib/prismicio";
import * as prismicH from "@prismicio/helpers";
import type { BlogPostDocument } from "../../prismicio-types";

export default async function Page() {
  try {
    const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });

    return (
      <main className="max-w-5xl mx-auto p-6 bg-gray-900 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          All Blog Posts
        </h1>

        <div className="grid gap-8">
          {posts.map((post) => {
            const title = post.data.title || "Untitled";
            const date = post.data.published_date
              ? new Date(post.data.published_date).toLocaleDateString()
              : "No date";
            const category = post.data.category || "Uncategorized";
            const image = post.data.featured_image;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.uid}`}
                className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800"
              >
                {image?.url && (
                  <div className="relative w-full h-64">
                    <Image
                      src={image.url}
                      alt={image.alt ?? "Blog cover"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-white">
                    {title}
                  </h2>

                  <p className="text-sm text-gray-400 mb-2">{date}</p>
                  <p className="text-sm text-gray-400 mb-4">Category: {category}</p>

                  <div className="text-gray-200">
                    {prismicH.asText(post.data.content).split("\n").map((line, i) => (
                      <p key={i} className="mb-2 line-clamp-3">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    );
  } catch (err) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-red-600">
        <h1>Error fetching posts</h1>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}
