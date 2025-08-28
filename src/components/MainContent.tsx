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
    <main className="lg:col-span-3 w-full p-0 m-0">
      {/* === NEW MAIN GRID (Adjusted for a 40/60 split) === */}
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 mt-8">
        
        {/* === LEFT COLUMN (MAIN HERO STORY - 2/5 width) === */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full">
          <article>
            <p className="text-[#fcee16] text-xs font-bold uppercase tracking-wider mb-1 font-open-sans">
              {heroPost.data.category || "News"}
            </p>
            <Link href={`/blog/${heroPost.uid}`} className="block group">
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white leading-snug group-hover:text-[#fcee16] transition-colors">
                {heroPost.data.title}
              </h1>
            </Link>
            <p className="text-base text-gray-300 mt-2 leading-snug font-open-sans">
              {renderText(heroPost.data.summary)}
            </p>
          </article>

          {/* Wrapper for the bottom articles */}
          <div>
            {/* Editorial Link */}
            {editorialPost && (
              <article className="pt-4 mt-4 border-t border-gray-800">
                <Link href={`/blog/${editorialPost.uid}`} className="block group">
                  <div className="flex items-start gap-2">
                    <div className="text-[#fcee16] text-lg font-serif font-bold">&ldquo;</div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-base group-hover:text-[#fcee16] transition-colors">
                        <span className="text-gray-400 font-normal text-sm">The DG View.</span>{" "}
                        {editorialPost.data.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">The editorial board</p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* DUPLICATED Editorial Link for visual testing, remove if there is more data */}
            {editorialPost && (
              <article className="pt-4 mt-4 border-t border-gray-800">
                <Link href={`/blog/${editorialPost.uid}`} className="block group">
                  <div className="flex items-start gap-2">
                    <div className="text-[#fcee16] text-lg font-serif font-bold">&ldquo;</div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-base group-hover:text-[#fcee16] transition-colors">
                        <span className="text-gray-400 font-normal text-sm">Another Story.</span>{" "}
                        Cops in Duterte ‘narco list’ ordered reinstated
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Francis Allan L. Angelo</p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {editorialPost && (
              <article className="pt-4 mt-4 border-t border-gray-800">
                <Link href={`/blog/${editorialPost.uid}`} className="block group">
                  <div className="flex items-start gap-2">
                    <div className="text-[#fcee16] text-lg font-serif font-bold">&ldquo;</div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-base group-hover:text-[#fcee16] transition-colors">
                        <span className="text-gray-400 font-normal text-sm">Another Story.</span>{" "}
                        Cops in Duterte ‘narco list’ ordered reinstated
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Francis Allan L. Angelo</p>
                    </div>
                  </div>
                </Link>
              </article>
            )}
            {/*end of duplicated area*/}
            
          </div>
        </div>

        {/* === RIGHT COLUMN (FEATURED STORY WITH IMAGE - 3/5 width) === */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <article className="h-full">
            <Link href={`/blog/${featuredPost.uid}`} className="block group h-full">
              {featuredPost.data.featured_image?.url && (
                <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden">
                  <Image
                    src={featuredPost.data.featured_image.url}
                    alt={featuredPost.data.featured_image.alt || "Featured Story"}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <p className="text-[#fcee16] text-xs font-bold uppercase tracking-wider mb-1 font-open-sans">
                {featuredPost.data.category || "Featured"}
              </p>
              
              {/* === START: HEADLINE CHANGE === */}
              {/* The separate <p> tag is removed and the headline is now combined */}
              <h2 className="text-3xl lg:text-4xl font-serif text-white leading-tight max-w-2xl break-words text-left">
                <span className="font-bold">The Big Read.</span>{" "}
                {featuredPost.data.title}
              </h2>
              {/* === END: HEADLINE CHANGE === */}

            </Link>
          </article>
        </div>
      </div>
    </main>
  );
};

export default MainContent;