import * as prismicH from "@prismicio/helpers";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { AuthorOpinionDocument } from "../../prismicio-types";

interface OpinionSectionProps {
  authors?: AuthorOpinionDocument[];
}

const OpinionSection: React.FC<OpinionSectionProps> = ({ authors = [] }) => {
  // Get featured author (first author)
  const featuredAuthor = authors[0];

  // Get sidebar authors (next 4 authors)
  const sidebarAuthors = authors.slice(1, 5);

  // Get bottom authors (remaining authors)
  const bottomAuthors = authors.slice(5, 11);

  return (
    <section className="py-12 border-default bg-[#1b1a1b] font-open-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Section Header */}
        <div className="mb-12 pb-4 border-b border-[#fcee16]">
          <h2 className="text-3xl font-roboto font-bold text-white">VOICES</h2>
        </div>

        {/* Show message if no authors */}
        {authors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No authors available.</p>
          </div>
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-4 gap-8 mb-12">
              {/* Featured Author - 3 columns */}
              {featuredAuthor && (
                <div className="lg:col-span-3">
                  <Link
                    href={`/author/${featuredAuthor.uid}`}
                    className="block group"
                  >
                    <article className="grid md:grid-cols-2 gap-8 pb-8 border-b border-default">
                      {/* Content */}
                      <div className="space-y-4">
                        <div className="text-[#fcee16] text-sm font-medium uppercase tracking-wide font-open-sans">
                          Featured Contributor
                        </div>

                        <h1 className="text-3xl font-roboto font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors duration-200">
                          {featuredAuthor.data.name}
                        </h1>

                        {featuredAuthor.data.title && (
                          <div className="text-lg text-[#fcee16] font-medium font-open-sans">
                            {featuredAuthor.data.title}
                          </div>
                        )}

                        {featuredAuthor.data.bio && (
                          <p className="text-lg text-gray-400 leading-relaxed font-open-sans">
                            {prismicH.asText(featuredAuthor.data.bio)}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-sm text-gray-500 pt-2 font-open-sans">
                          {featuredAuthor.data.email && (
                            <span className="font-medium">
                              {featuredAuthor.data.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Author Avatar */}
                      {featuredAuthor.data.avatar?.url && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <Image
                            src={featuredAuthor.data.avatar.url}
                            alt={
                              featuredAuthor.data.avatar.alt ||
                              featuredAuthor.data.name ||
                              "Author avatar"
                            }
                            fill
                            className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                    </article>
                  </Link>
                </div>
              )}

              {/* Sidebar - 1 column */}
              {sidebarAuthors.length > 0 && (
                <div className="lg:col-span-1 border-l border-default pl-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-roboto font-bold text-white">
                        More Contributors
                      </h3>
                      <Link
                        href="/authors"
                        className="text-[#fcee16] hover:text-[#fcee16]/80 text-sm flex items-center gap-1 transition-colors duration-200 font-open-sans"
                      >
                        All <ChevronRight size={14} />
                      </Link>
                    </div>

                    {sidebarAuthors.map((author) => (
                      <article
                        key={author.id}
                        className="pb-4 border-b border-default last:border-b-0"
                      >
                        <Link
                          href={`/author/${author.uid}`}
                          className="block group"
                        >
                          <div className="flex items-start gap-3">
                            {/* Small Avatar */}
                            {author.data.avatar?.url && (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={author.data.avatar.url}
                                  alt={author.data.name || "Author avatar"}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h4 className="font-roboto font-semibold text-white text-sm leading-tight mb-1 group-hover:text-[#fcee16] transition-colors duration-200">
                                {author.data.name}
                              </h4>

                              {author.data.title && (
                                <div className="text-xs text-[#fcee16] font-medium mb-1 font-open-sans">
                                  {author.data.title}
                                </div>
                              )}

                              {author.data.bio && (
                                <p className="text-xs text-gray-500 font-open-sans line-clamp-2">
                                  {prismicH
                                    .asText(author.data.bio)
                                    .substring(0, 80)}
                                  ...
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Authors Grid */}
            {bottomAuthors.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-default">
                {bottomAuthors.map((author) => (
                  <article key={author.id} className="group">
                    <Link href={`/author/${author.uid}`} className="block">
                      {/* Author Card */}
                      <div className="text-center space-y-4">
                        {/* Avatar */}
                        {author.data.avatar?.url && (
                          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
                            <Image
                              src={author.data.avatar.url}
                              alt={author.data.name || "Author avatar"}
                              fill
                              className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                              sizes="80px"
                            />
                          </div>
                        )}

                        <h3 className="font-roboto font-bold text-lg text-white leading-tight group-hover:text-[#fcee16] transition-colors duration-200">
                          {author.data.name}
                        </h3>

                        {author.data.title && (
                          <div className="text-sm text-[#fcee16] font-medium font-open-sans">
                            {author.data.title}
                          </div>
                        )}

                        {author.data.bio && (
                          <p className="text-sm text-gray-400 font-open-sans line-clamp-3">
                            {prismicH.asText(author.data.bio)}
                          </p>
                        )}

                        <div className="text-xs text-gray-500 border-t border-default pt-3 font-open-sans">
                          View Profile
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default OpinionSection;
