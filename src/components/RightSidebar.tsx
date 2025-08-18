import React from 'react';
import Link from 'next/link';
import { 
  Star, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  ChevronRight,
  Clock,
  Thermometer,
  Building,
  Briefcase
} from 'lucide-react';

// Mock data for editor's picks - in real app this would come from props/API
const editorsPicks = [
  { 
    id: 1,
    title: "City Council approves new downtown development project", 
    author: "Maria Rodriguez", 
    category: "Local Politics",
    time: "2 hours ago",
    image: "https://via.placeholder.com/120x80.png/000000/FFD700?text=City+Hall",
    slug: "city-council-downtown-development"
  },
  { 
    id: 2,
    title: "Local high school wins state championship in dramatic fashion", 
    author: "Tom Wilson", 
    category: "Sports",
    time: "4 hours ago",
    image: "https://via.placeholder.com/120x80.png/1a1a1a/FFD700?text=Sports",
    slug: "high-school-championship"
  },
  { 
    id: 3,
    title: "New business district brings 200 jobs to the community", 
    author: "Jennifer Chen", 
    category: "Business",
    time: "6 hours ago",
    image: "https://via.placeholder.com/120x80.png/2a2a2a/FFD700?text=Business",
    slug: "new-business-district"
  },
];

// Trending local stories
const trendingStories = [
  { title: "Local restaurant wins national award for sustainability", views: "12.5K" },
  { title: "Road construction on Main Street to begin next month", views: "8.2K" },
  { title: "Community fundraiser exceeds goal for new park", views: "6.1K" },
  { title: "Weather alert: Severe storms expected this weekend", views: "15.3K" },
];

// Community events
const communityEvents = [
  { 
    title: "Farmers Market", 
    date: "Every Saturday", 
    time: "8 AM - 2 PM", 
    location: "Downtown Square" 
  },
  { 
    title: "City Council Meeting", 
    date: "Next Tuesday", 
    time: "7:00 PM", 
    location: "City Hall" 
  },
  { 
    title: "Summer Concert Series", 
    date: "Friday", 
    time: "6:30 PM", 
    location: "Riverside Park" 
  },
];

// Weather widget (mock data)
const weatherData = {
  current: "72°F",
  condition: "Partly Cloudy",
  high: "78°F",
  low: "65°F"
};

// Gold category badge component
const CategoryBadge: React.FC<{ category: string; size?: 'sm' | 'xs' }> = ({ category, size = 'xs' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2 py-0.5 text-xs';
  
  return (
    <span className={`inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wide uppercase rounded shadow-lg ${sizeClasses}`}>
      {category}
    </span>
  );
};

// Section header component with gold accents
const SectionHeader: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  href?: string;
}> = ({ title, icon: Icon, href }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 relative">
    <div className="absolute bottom-0 left-0 right-0 h-0.5= bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
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

// Article preview component with solid black background
const ArticlePreview: React.FC<{
  title: string;
  author: string;
  category: string;
  time: string;
  image: string;
  slug: string;
}> = ({ title, author, category, time, image, slug }) => (
  <Link href={`/news/${slug}`} className="block group">
    <article className="flex gap-3 p-3 rounded-lg bg-black hover:bg-black transition-all duration-300 border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={title}
          width={80}
          height={60}
          className="w-20 h-15 rounded object-cover group-hover:scale-105 transition-transform duration-200 border border-gray-700 group-hover:border-yellow-500/50"
        />
        <div className="absolute top-1 left-1">
          <CategoryBadge category={category} size="xs" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2 drop-shadow-sm">
          {title}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-yellow-400 font-medium">{author}</span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            <Clock size={10} className="text-yellow-400" />
            {time}
          </span>
        </div>
      </div>
    </article>
  </Link>
);

// Trending story component with solid black background
const TrendingStory: React.FC<{ title: string; views: string; index: number }> = ({ title, views, index }) => (
  <Link href="#" className="block group">
    <div className="flex items-start gap-3 p-3 rounded-lg bg-black hover:bg-black transition-all duration-300 border border-gray-800 hover:border-yellow-500/20">
      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h5 className="text-sm text-white group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2 leading-tight">
          {title}
        </h5>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <TrendingUp size={10} className="text-yellow-400" />
          {views} views
        </p>
      </div>
    </div>
  </Link>
);

// Community event component with solid black background
const EventItem: React.FC<{ 
  title: string; 
  date: string; 
  time: string; 
  location: string; 
}> = ({ title, date, time, location }) => (
  <div className="p-4 bg-black rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-md hover:shadow-yellow-500/5">
    <h5 className="font-semibold text-white text-sm mb-3 group-hover:text-yellow-100">{title}</h5>
    <div className="space-y-2 text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <Calendar size={10} className="text-yellow-400" />
        <span>{date} at {time}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={10} className="text-yellow-400" />
        <span>{location}</span>
      </div>
    </div>
  </div>
);

const RightSidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* Weather Widget with deep black gradients */}
      {/* Editor's Picks with varying black depths */}
      <div className="bg-gradient-to-b from-black via-gray-950 to-black border-2 border-gray-800 hover:border-yellow-500/40 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
        <SectionHeader title="Editor's Picks" icon={Star} href="/editors-picks" />
        
        <div className="space-y-4">
          {editorsPicks.map((item) => (
            <ArticlePreview
              key={item.id}
              title={item.title}
              author={item.author}
              category={item.category}
              time={item.time}
              image={item.image}
              slug={item.slug}
            />
          ))}
        </div>
      </div>

      {/* Trending Stories with rich black background */}
      
    </aside>
  );
};

export default RightSidebar;