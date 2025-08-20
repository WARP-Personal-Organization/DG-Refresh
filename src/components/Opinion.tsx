import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  ChevronRight} from 'lucide-react';

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

// Gold category badge component (matching your existing style)
const CategoryBadge: React.FC<{ category: string; size?: 'sm' | 'xs' }> = ({ category, size = 'xs' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2 py-0.5 text-xs';
  
  return (
    <span className={`inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wide uppercase rounded shadow-lg ${sizeClasses}`}>
      {category}
    </span>
  );
};

// Section header component (matching your existing style)
const SectionHeader: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  href?: string;
}> = ({ title, icon: Icon, href }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 relative">
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    <h3 className="flex items-center gap-2 text-lg font-bold text-white font-serif">
      <Icon size={18} className="text-yellow-400 drop-shadow-sm" />
      {title}
    </h3>
    {href && (
      <Link 
        href={href}
        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1 transition-all duration-200 hover:drop-shadow-sm"
      >
        More <ChevronRight size={14} />
      </Link>
    )}
  </div>
);

const OpinionSection: React.FC = () => {
  const featuredArticle: Article = {
    id: '1',
    title: 'As technology reshapes society, innovation is becoming the greatest challenge',
    subtitle: 'Silicon Valley will struggle to deliver on its promises — setting the stage for even greater disruption',
    author: { name: 'Sarah Chen', avatar: '/api/placeholder/50/50' },
    image: '/api/placeholder/400/300',
    slug: 'technology-innovation-challenge'
  };

  const sidebarArticles: Article[] = [
    {
      id: '2',
      title: 'The future of remote work',
      author: { name: 'Marcus Johnson' },
      category: 'Business',
      slug: 'future-remote-work'
    },
    {
      id: '3',
      title: 'The Tech View',
      author: { name: 'Editorial Board' },
      category: 'Editorial',
      slug: 'tech-view'
    },
    {
      id: '4',
      title: 'Innovation Insights',
      author: { name: 'Tech Team' },
      category: 'Analysis',
      slug: 'innovation-insights'
    },
    {
      id: '5',
      title: 'Market Watch',
      author: { name: 'Financial Desk' },
      category: 'Finance',
      slug: 'market-watch'
    },
    {
      id: '6',
      title: 'Future Trends',
      author: { name: 'Research Team' },
      category: 'Research',
      slug: 'future-trends'
    }
  ];

  const bottomArticles: Article[] = [
    {
      id: '7',
      title: 'The startup revolution',
      author: { name: 'Alex Rivera', avatar: '/api/placeholder/40/40' },
      slug: 'startup-revolution'
    },
    {
      id: '8',
      title: 'Merit-based innovation can make America\'s tech sector great again',
      author: { name: 'Jennifer Park' },
      slug: 'merit-based-innovation'
    },
    {
      id: '9',
      title: 'Cryptocurrency in the digital age',
      author: { name: 'David Kim', avatar: '/api/placeholder/40/40' },
      slug: 'cryptocurrency-digital-age'
    },
    {
      id: '10',
      title: 'AI ethics: The debate that is reshaping our future',
      author: { name: 'Lisa Thompson' },
      slug: 'ai-ethics-debate'
    },
    {
      id: '11',
      title: 'How to bridge the digital divide in emerging markets',
      author: { name: 'Robert Chen' },
      slug: 'digital-divide-emerging-markets'
    },
    {
      id: '12',
      title: 'Blockchain beyond cryptocurrency',
      author: { name: 'Maria Rodriguez', avatar: '/api/placeholder/40/40' },
      slug: 'blockchain-beyond-crypto'
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
        </div><div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            <div className="px-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 tracking-wider font-serif">
                Opinion
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-500 to-transparent"></div>
          </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
          {/* Featured Article - Takes 3 columns on xl screens */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-gradient-to-b from-black via-gray-950 to-black border-2 border-gray-800 hover:border-yellow-500/40 rounded-lg p-8 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
              {/* Left Quote and Text */}
              <div className="lg:text-right space-y-6">

                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white font-serif">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  {featuredArticle.subtitle}
                </p>
                <p className="text-yellow-400 font-medium text-lg drop-shadow-sm">
                  {featuredArticle.author.name}
                </p>
              </div>

              {/* Center Image */}
              <div className="relative">
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-black/60 z-10"></div>
                  <Image
                    src={featuredArticle.image || '/api/placeholder/400/500'}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Quote */}
              <div className="lg:text-left">
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1 column on xl screens */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-b from-black via-gray-950 to-black border-2 border-gray-800 hover:border-yellow-500/40 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
              <SectionHeader title="More Opinion" icon={Star} href="/opinion" />
              <div className="space-y-4">
                {sidebarArticles.map((article) => (
                  <Link key={article.id} href={`/opinion/${article.slug}`} className="block group">
                    <div className="p-3 rounded-lg bg-black hover:bg-black transition-all duration-300 border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
                      {article.category && (
                        <div className="mb-2">
                          <CategoryBadge category={article.category} size="xs" />
                        </div>
                      )}
                      <h4 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2 drop-shadow-sm">
                        {article.title}
                      </h4>
                      <p className="text-yellow-400 font-medium text-xs">{article.author.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bottomArticles.map((article) => (
            <Link key={article.id} href={`/opinion/${article.slug}`} className="block group">
              <article className="bg-black hover:bg-black transition-all duration-300 border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 rounded-lg p-4 relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                
                <div className="text-3xl text-yellow-400 font-serif mb-3 drop-shadow-sm">&quot;</div>
                <h3 className="font-bold text-base mb-4 leading-tight text-white group-hover:text-yellow-200 transition-colors duration-200 drop-shadow-sm font-serif">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3">
                  {article.author.avatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 group-hover:border-yellow-500/50">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-yellow-400 font-medium text-sm drop-shadow-sm">{article.author.name}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpinionSection;