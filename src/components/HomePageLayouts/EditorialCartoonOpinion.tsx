import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../../lib/wordpress";
import CartoonCard from "../CartoonCard";
import SectionPager from "../SectionPager";
import { chunk } from "../../../lib/chunk";

// Columns shown per page in the Opinion rail — matches what the old
// "View All Opinion →" link used to sit beneath.
const OPINION_PER_PAGE = 4;

interface Props {
  editorialPosts: Post[];
  cartoons: Post[];
  opinionPosts: Post[];
}

// Pinned to Asia/Manila like the other homepage rails — the functions run in
// iad1, so an unpinned date renders a day behind for a PH newsroom.
const formatDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      })
    : "";

// Byline and date on one line, with the separator drawn only when there are two
// values to separate — an unbylined column would otherwise lead with a stray
// "·". Same shape as the Opinion cards on /opinion.
const Meta: React.FC<{ author?: string; date: string; className: string }> = ({
  author,
  date,
  className,
}) =>
  author || date ? (
    <p className={className}>
      {author}
      {author && date && <span className="mx-1.5">·</span>}
      {date}
    </p>
  ) : null;

const SectionHeading: React.FC<{ label: string }> = ({ label }) => (
  <div className="mb-6 pb-2 border-b-2 border-[#fbd203]">
    <h2 className="text-2xl lg:text-3xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
      {label}
    </h2>
  </div>
);

export default function EditorialCartoonOpinion({
  editorialPosts,
  cartoons,
  opinionPosts,
}: Props) {
  const banner = editorialPosts[0];
  const opinionFeatured = opinionPosts[0];
  // Everything after the featured column, not just the next four — the pager
  // below turns the remainder into pages rather than truncating it.
  const opinionRest = opinionPosts.slice(1);

  if (!banner && cartoons.length === 0 && opinionPosts.length === 0)
    return null;

  return (
    <section className="bg-background py-12 border-t border-default">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT — Editorial banner */}
          <div>
            <SectionHeading label="Editorial" />
            {banner ? (
              <Link href={`/blog/${banner.uid}`} className="block group">
                {banner.data.featured_image?.url && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4">
                    <Image
                      src={banner.data.featured_image.url}
                      alt={banner.data.featured_image.alt || banner.data.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-playfair font-bold text-accent leading-tight group-hover:text-accent/80 transition-colors">
                  {banner.data.title}
                </h3>
                <p className="text-xs text-gray-400 mt-3 font-open-sans uppercase tracking-wider">
                  {formatDate(banner.data.published_date)}
                </p>
                {banner.data.summary && (
                  <p className="text-sm text-gray-300 mt-3 line-clamp-3 font-open-sans">
                    {banner.data.summary}
                  </p>
                )}
              </Link>
            ) : (
              <div className="text-gray-500 text-sm">
                No editorial available.
              </div>
            )}
          </div>

          {/* MIDDLE — Cartoon */}
          <div>
            <SectionHeading label="Cartoon" />
            {cartoons.length > 0 ? (
              <CartoonCard cartoons={cartoons} />
            ) : (
              <div className="text-gray-500 text-sm">No cartoons yet.</div>
            )}
          </div>

          {/* RIGHT — Opinion list */}
          <div>
            <SectionHeading label="Opinion" />
            <div className="space-y-5">
              {opinionFeatured && (
                <Link
                  href={`/blog/${opinionFeatured.uid}`}
                  className="block group"
                >
                  {opinionFeatured.data.featured_image?.url && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded mb-3">
                      <Image
                        src={opinionFeatured.data.featured_image.url}
                        alt={
                          opinionFeatured.data.featured_image.alt ||
                          opinionFeatured.data.title
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-playfair font-bold text-white leading-snug group-hover:text-accent transition-colors">
                    {opinionFeatured.data.title}
                  </h4>
                  <Meta
                    author={opinionFeatured.data.author}
                    date={formatDate(opinionFeatured.data.published_date)}
                    className="text-xs text-gray-400 mt-1 font-open-sans"
                  />
                </Link>
              )}
              {/* Editorial asked for paging here instead of "View All Opinion →",
                  so the latest columns can be stepped through in place rather
                  than sending the reader to /opinion. */}
              <SectionPager label="opinion columns">
                {chunk(opinionRest, OPINION_PER_PAGE).map((group, i) => (
                  <div key={i} className="space-y-3">
                    {group.map((p) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.uid}`}
                        className="block group pt-3 border-t border-default"
                      >
                        <h4 className="text-sm font-playfair font-bold text-white leading-snug group-hover:text-accent transition-colors">
                          {p.data.title}
                        </h4>
                        <Meta
                          author={p.data.author}
                          date={formatDate(p.data.published_date)}
                          className="text-xs text-gray-500 mt-1 font-open-sans"
                        />
                      </Link>
                    ))}
                  </div>
                ))}
              </SectionPager>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
