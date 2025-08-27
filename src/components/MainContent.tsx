import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface MainContentProps {
  heroPost?: BlogPostDocument;
  featuredPost?: BlogPostDocument;
  editorialPost?: BlogPostDocument;
  // editorsPicks is no longer used in this specific layout
  editorsPicks?: BlogPostDocument[];
}

// Helper function to render Prismic rich text
const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

const MainContent: React.FC<MainContentProps> = ({
  heroPost,
  featuredPost,
  editorialPost,
}) => {
  if (!heroPost || !featuredPost) {
    return (
      <main className="lg:col-span-3 w-full bg-[#1b1a1b]">
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="lg:col-span-3 w-full">
      {/* === NEW MAIN GRID (Adjusted for a 40/60 split) === */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* === LEFT COLUMN (MAIN HERO STORY - 2/5 width) === */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <article>
            <p className="text-[#fcee16] text-sm font-bold uppercase tracking-wider mb-2 font-open-sans">
              {heroPost.data.category || "News"}
            </p>
            <Link href={`/blog/${heroPost.uid}`} className="block group">
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors">
                {heroPost.data.title}
              </h1>
            </Link>
            <p className="text-lg text-gray-300 mt-4 leading-relaxed font-open-sans">
              {renderText(heroPost.data.summary)}
            </p>
          </article>

          {/* Editorial Link */}
          {editorialPost && (
            <article className="pt-6 mt-6 border-t border-gray-800">
              <Link href={`/blog/${editorialPost.uid}`} className="block group">
                <div className="flex items-start gap-4">
                  <div className="text-[#fcee16] text-2xl font-serif font-bold">
                    &ldquo;
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg group-hover:text-[#fcee16] transition-colors">
                      <span className="text-gray-400 font-normal">
                        The DG View.
                      </span>{" "}
                      {editorialPost.data.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      The editorial board
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          )}
        </div>

        {/* === RIGHT COLUMN (FEATURED STORY WITH IMAGE - 3/5 width) === */}
        <div className="lg:col-span-3">
          <article>
            <Link href={`/blog/${featuredPost.uid}`} className="block group">
              {featuredPost.data.featured_image?.url && (
                <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden">
                  <Image
                    src={featuredPost.data.featured_image.url}
                    alt={
                      featuredPost.data.featured_image.alt || "Featured Story"
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <p className="text-[#fcee16] text-sm font-bold uppercase tracking-wider mb-2 font-open-sans">
                {featuredPost.data.category || "Featured"}
              </p>
              <h2 className="text-3xl font-serif font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors">
                <span className="text-gray-400">The Big Read.</span>{" "}
                {featuredPost.data.title}
              </h2>
            </Link>
          </article>
        </div>
      </div>
    </main>
  );
};

export default MainContent;