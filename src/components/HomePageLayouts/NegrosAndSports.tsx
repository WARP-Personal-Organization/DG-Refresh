import { client } from "../../../lib/prismicio";
import RightSidebar from "@/components/RightSidebar";
import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import type { BlogPostDocument } from "../../../prismicio-types";

interface RegionalStoriesProps {
  negrosStories: BlogPostDocument[];
  negrosTitle: string;
  sportsStories: BlogPostDocument[];
  sportsTitle: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// Reusable Publication Cards
export const PublicationCard = ({
  title,
  imageUrl,
  link = "#",
}: {
  title: string;
  imageUrl: string;
  link?: string;
}) => (
  <div className="pt-6">
    <h3 className="bg-accent rounded-sm text-black text-xs font-roboto font-bold uppercase px-2 py-1 inline-block mb-3">
      {title}
    </h3>
    <Link href={link} className="block group">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={520}
        className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
      />
    </Link>
  </div>
);

// NOTE: no "use client" — this stays a Server Component and can be async
export default async function NegrosAndSportsStories({
  negrosStories,
  negrosTitle,
  sportsStories,
  sportsTitle,
}: RegionalStoriesProps) {
  if (!negrosStories || negrosStories.length === 0) {
    return null;
  }

  const mainNegrosStory = negrosStories[0];
  const supportingNegrosStories = negrosStories.slice(1, 4);
  const limitedSportsStories = sportsStories.slice(0, 6);

  // Optional: fetch editor's picks here (server-side)
  let editorsPicks: BlogPostDocument[] = [];
  try {
    const posts: BlogPostDocument[] = await client.getAllByType("blog_post", {
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });

    editorsPicks = posts
      .filter((post) => post.data?.editors_pick === true)
      .sort((a, b) => {
        const dateA = new Date(a.data?.published_date || "").getTime() || 0;
        const dateB = new Date(b.data?.published_date || "").getTime() || 0;
        return dateB - dateA; // latest first
      });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  // Placeholder URLs
  const todayPaperUrl = "/Todays'News.PNG";
  const supplementUrl = "/Supplement.PNG";

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* === LEFT COLUMN (MAIN CONTENT) === */}
          <div className="lg:col-span-2 mb-10 lg:mb-0">
            {/* --- Negros Featured Story --- */}
            <div className="mb-12">
              <div className="mb-6 pb-3 border-b border-[#fcee16]">
                <h2 className="text-2xl font-roboto font-bold text-foreground">
                  {negrosTitle}
                </h2>
              </div>
              <article className="group">
                <Link href={`/blog/${mainNegrosStory.uid}`} className="block">
                  {mainNegrosStory.data.featured_image?.url && (
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={mainNegrosStory.data.featured_image.url}
                        alt={
                          mainNegrosStory.data.featured_image.alt ||
                          "Story image"
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-accent text-sm font-medium uppercase font-sans">
                      {mainNegrosStory.data.category || "News"}
                    </p>
                    <h3 className="text-3xl font-roboto font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                      {mainNegrosStory.data.title || "Untitled Article"}
                    </h3>
                  </div>
                </Link>
              </article>
            </div>

            {/* --- Sports Section --- */}
            {limitedSportsStories.length > 0 && (
              <div>
                <div className="mb-6 pb-3 border-b border-[#fcee16]">
                  <h2 className="text-2xl font-roboto font-bold text-foreground">
                    {/* {sportsTitle} */}
                    SPORTS
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {limitedSportsStories.map((story) => (
                    <article key={story.id} className="group">
                      <Link href={`/blog/${story.uid}`} className="block">
                        {story.data.featured_image?.url && (
                          <div className="relative aspect-[16/10] mb-4">
                            <Image
                              src={story.data.featured_image.url}
                              alt={
                                story.data.featured_image.alt || "Story image"
                              }
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <p className="text-accent text-xs font-semibold uppercase mb-1 font-sans">
                          {story.data.category || "Sports"}
                        </p>
                        <h4 className="text-lg font-roboto font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                          {story.data.title || "Untitled Article"}
                        </h4>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN (SIDEBAR) === */}
          <div className="lg:col-span-1">
            <div className="flex flex-col divide-y divide-gray-700">
              {/* Supporting Negros Stories */}
              {supportingNegrosStories.map((story) => (
                <article key={story.id} className="group py-5 first:pt-0">
                  <Link href={`/blog/${story.uid}`} className="block">
                    <h4 className="text-lg font-roboto font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                      {story.data.title || "Untitled Article"}
                    </h4>
                    <p className="text-xs text-gray-400 pt-2 font-sans">
                      By {renderText(story.data.author) || "Staff"}
                    </p>
                  </Link>
                </article>
              ))}

              {/* Publications */}
              {/* <PublicationCard
                title="Today's Paper"
                imageUrl={todayPaperUrl}
                link="https://dailyguardian.com.ph/todays-paper/"
              /> */}

              <RightSidebar editorsPicks={editorsPicks} />

              <PublicationCard
                title="Supplement"
                imageUrl={supplementUrl}
                link="https://dailyguardian.com.ph/3d-flip-book/supplement/"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
