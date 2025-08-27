import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Author {
  name: string;
  avatar?: string;
}

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  author: Author;
  category?: string;
  image?: string;
  time?: string;
  slug: string;
}

const OpinionSection: React.FC = () => {
  const featuredArticle: Article = {
    id: "1",
    title:
      "As technology reshapes society, innovation is becoming the greatest challenge",
    subtitle:
      "Silicon Valley will struggle to deliver on its promises — setting the stage for even greater disruption",
    author: { name: "Sarah Chen", avatar: "/api/placeholder/50/50" },
    image: "/api/placeholder/400/300",
    slug: "technology-innovation-challenge",
  };

  const sidebarArticles: Article[] = [
    {
      id: "2",
      title: "The future of remote work in a post-pandemic world",
      author: { name: "Marcus Johnson" },
      category: "Business",
      slug: "future-remote-work",
    },
    {
      id: "3",
      title: "Why the tech sector needs new leadership",
      author: { name: "Editorial Board" },
      category: "Editorial",
      slug: "tech-view",
    },
    {
      id: "4",
      title: "Innovation without regulation is dangerous",
      author: { name: "Tech Team" },
      category: "Analysis",
      slug: "innovation-insights",
    },
    {
      id: "5",
      title: "Market volatility and startup funding",
      author: { name: "Financial Desk" },
      category: "Finance",
      slug: "market-watch",
    },
  ];

  const bottomArticles: Article[] = [
    {
      id: "7",
      title: "The startup revolution that never came",
      author: { name: "Alex Rivera" },
      slug: "startup-revolution",
    },
    {
      id: "8",
      title:
        "Merit-based innovation can make America's tech sector great again",
      author: { name: "Jennifer Park" },
      slug: "merit-based-innovation",
    },
    {
      id: "9",
      title: "Cryptocurrency in the digital age: Promise vs reality",
      author: { name: "David Kim" },
      slug: "cryptocurrency-digital-age",
    },
    {
      id: "10",
      title: "AI ethics: The debate that is reshaping our future",
      author: { name: "Lisa Thompson" },
      slug: "ai-ethics-debate",
    },
    {
      id: "11",
      title: "How to bridge the digital divide in emerging markets",
      author: { name: "Robert Chen" },
      slug: "digital-divide-emerging-markets",
    },
    {
      id: "12",
      title: "Blockchain beyond cryptocurrency: Real-world applications",
      author: { name: "Maria Rodriguez" },
      slug: "blockchain-beyond-crypto",
    },
  ];

  return (
    <section className="py-12 border-t border-gray-800 bg-[#1b1a1b] font-open-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Section Header */}
        <div className="mb-12 pb-4 border-b border-gray-800">
          <h2 className="text-3xl font-roboto font-bold text-white">Opinion</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Featured Article - 3 columns */}
          <div className="lg:col-span-3">
            <Link
              href={`/opinion/${featuredArticle.slug}`}
              className="block group"
            >
              <article className="grid md:grid-cols-2 gap-8 pb-8 border-b border-gray-800">
                {/* Content */}
                <div className="space-y-4">
                  <div className="text-[#fcee16] text-sm font-medium uppercase tracking-wide font-open-sans">
                    Opinion
                  </div>

                  <h1 className="text-3xl font-roboto font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors duration-200">
                    {featuredArticle.title}
                  </h1>

                  <p className="text-lg text-gray-400 leading-relaxed font-open-sans">
                    {featuredArticle.subtitle}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-500 pt-2 font-open-sans">
                    <span className="font-medium">
                      {featuredArticle.author.name}
                    </span>
                  </div>
                </div>

                {/* Image */}
                {featuredArticle.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </article>
            </Link>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 border-l border-gray-800 pl-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-roboto font-bold text-white">
                  More Opinion
                </h3>
                <Link
                  href="/opinion"
                  className="text-[#fcee16] hover:text-[#fcee16]/80 text-sm flex items-center gap-1 transition-colors duration-200 font-open-sans"
                >
                  More <ChevronRight size={14} />
                </Link>
              </div>

              {sidebarArticles.map((article) => (
                <article
                  key={article.id}
                  className="pb-4 border-b border-gray-800/50 last:border-b-0"
                >
                  <Link
                    href={`/opinion/${article.slug}`}
                    className="block group"
                  >
                    {article.category && (
                      <div className="text-[#fcee16] text-xs font-medium uppercase tracking-wide mb-2 font-open-sans">
                        {article.category}
                      </div>
                    )}

                    <h4 className="font-roboto font-semibold text-white text-sm leading-tight mb-2 group-hover:text-[#fcee16] transition-colors duration-200">
                      {article.title}
                    </h4>

                    <div className="text-xs text-gray-500 font-open-sans">
                      {article.author.name}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-800">
          {bottomArticles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/opinion/${article.slug}`} className="block">
                {/* Quote marker */}
                <div className="text-4xl text-[#fcee16] font-roboto mb-3 leading-none">
                  &quot;
                </div>

                <h3 className="font-roboto font-bold text-lg text-white leading-tight mb-4 group-hover:text-[#fcee16] transition-colors duration-200">
                  {article.title}
                </h3>

                <div className="text-sm text-gray-500 border-t border-gray-800/50 pt-3 font-open-sans">
                  {article.author.name}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpinionSection;
