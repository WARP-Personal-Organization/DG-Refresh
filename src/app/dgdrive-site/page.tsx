"use client";

import { ArrowRight, Calendar, ChevronDown, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { ImageWithFallback } from './ImageWithFallback';

function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'border-gray-200 shadow-lg' : 'border-gray-200 shadow-sm'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex flex-col group">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent transition-all group-hover:scale-105">DG DRIVE</span>
              <span className="text-xs text-gray-500 tracking-wider uppercase">by Daily Guardian</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center gap-8 ${isSearchOpen ? 'lg:flex md:hidden' : ''}`}>
              <Link href="/" className="text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 relative after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-500 after:to-yellow-600 hover:after:w-full after:transition-all after:duration-300">Home</Link>
              <Link href="/reviews" className="text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 relative after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-500 after:to-yellow-600 hover:after:w-full after:transition-all after:duration-300">Reviews</Link>

              {/* Desktop Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 relative after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-500 after:to-yellow-600 hover:after:w-full after:transition-all after:duration-300">
                  Categories
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 min-w-[200px] shadow-2xl z-50 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/categories/family-cars"
                      className="block px-6 py-3 text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-300 border-b border-gray-100 transform hover:translate-x-1"
                    >
                      Family Cars
                    </Link>
                    <Link
                      href="/categories/sports-cars"
                      className="block px-6 py-3 text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-300 transform hover:translate-x-1"
                    >
                      Sports Cars
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/comparisons" className="text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 relative after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-500 after:to-yellow-600 hover:after:w-full after:transition-all after:duration-300">Comparisons</Link>
              <Link href="/stories" className="text-sm uppercase tracking-wider text-gray-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 relative after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-yellow-400 after:via-yellow-500 after:to-yellow-600 hover:after:w-full after:transition-all after:duration-300">Stories</Link>
            </nav>
          </div>

          {/* Right Side Actions (Search & Mobile Toggle) */}
          <div className="flex items-center gap-4">

            {/* Search Bar / Button */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center animate-in fade-in slide-in-from-right-4 duration-300">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="px-4 py-1.5 text-sm border-2 border-r-0 border-gray-200 rounded-l-full focus:outline-none focus:border-yellow-400 text-gray-800 w-48 md:w-64 transition-colors bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1.5 px-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-2 border-l-0 border-yellow-400 hover:border-yellow-500 rounded-r-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-sm"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-yellow-500 transition-all duration-300 hover:scale-110 hover:rotate-12"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-yellow-500 transition-all duration-300 hover:scale-110 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-wider text-gray-700 hover:text-yellow-500 font-medium"
            >
              Home
            </Link>
            <Link
              href="/reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-wider text-gray-700 hover:text-yellow-500 font-medium"
            >
              Reviews
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="flex items-center justify-between text-sm uppercase tracking-wider text-gray-700 hover:text-yellow-500 font-medium w-full text-left"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileCategoriesOpen && (
                <div className="flex flex-col pl-4 mt-3 space-y-3 border-l-2 border-yellow-400">
                  <Link
                    href="/categories/family-cars"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-wider text-gray-600 hover:text-yellow-500"
                  >
                    Family Cars
                  </Link>
                  <Link
                    href="/categories/sports-cars"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-wider text-gray-600 hover:text-yellow-500"
                  >
                    Sports Cars
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/comparisons"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-wider text-gray-700 hover:text-yellow-500 font-medium"
            >
              Comparisons
            </Link>
            <Link
              href="/stories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-wider text-gray-700 hover:text-yellow-500 font-medium"
            >
              Stories
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative h-[80vh] overflow-hidden bg-white">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1639922195938-611119f7f307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBGb3J0dW5lciUyMFNVViUyMFBoaWxpcHBpbmVzJTIwcm9hZHxlbnwxfHx8fDE3NzUxODkwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Toyota Fortuner on Philippine road"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block px-4 py-2 border-2 border-yellow-500 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-lg animate-fade-up">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent uppercase tracking-widest text-sm font-bold">Feature</span>
          </div>
          <h1 className="text-4xl md:text-6xl leading-tight text-white font-bold animate-fade-up delay-100">
            Drive Stories That Matter
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed animate-fade-up delay-200">
            Finding the Perfect Family SUV for Philippine Roads
          </p>
          <div className="flex items-center gap-4 pt-4 animate-fade-up delay-300">
            <span className="text-sm text-white/70">By Carlos Mendoza • 8 min read</span>
          </div>


          <div className="flex items-center gap-4 animate-fade-up delay-400">
            <Link
              href="/dgdrive-site/reviews/fortuner-2026"
              className="group px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 uppercase tracking-wider text-sm font-bold flex items-center gap-2 rounded-lg hover:scale-105"
            >
              Read Review
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

function CategorySplit() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group cursor-pointer border-2 border-gray-200 hover:border-[#fbd203] transition-all rounded-2xl overflow-hidden hover:shadow-xl bg-white">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1639922195938-611119f7f307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBGb3J0dW5lciUyMFNVViUyMFBoaWxpcHBpbmVzJTIwcm9hZHxlbnwxfHx8fDE3NzUxODkwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Family Cars - Toyota Fortuner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-[#fbd203]"></div>
                <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold">Category</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-gray-900 group-hover:text-[#fbd203] transition-colors font-bold">Family Cars</h2>
              <p className="text-gray-600 leading-relaxed">
                From the Toyota Fortuner to the Innova, discover vehicles built for Filipino families navigating city streets and provincial highways.
              </p>
              <button className="flex items-center gap-2 text-[#fbd203] hover:gap-4 transition-all uppercase tracking-wider text-sm font-bold group/btn">
                View All
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="group cursor-pointer border-2 border-gray-200 hover:border-[#fbd203] transition-all rounded-2xl overflow-hidden hover:shadow-xl bg-white">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1634066640783-c231155c4ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JkJTIwTXVzdGFuZyUyMHNwb3J0cyUyMGNhcnxlbnwxfHx8fDE3NzUxODkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sports Cars - Ford Mustang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-[#fbd203]"></div>
                <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold">Category</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-gray-900 group-hover:text-[#fbd203] transition-colors font-bold">Sports Cars</h2>
              <p className="text-gray-600 leading-relaxed">
                Honda Civic Type R, Ford Mustang, and performance machines that deliver thrills on every corner. For those who live for the drive.
              </p>
              <button className="flex items-center gap-2 text-[#fbd203] hover:gap-4 transition-all uppercase tracking-wider text-sm font-bold group/btn">
                View All
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const reviews = [
  {
    id: 1,
    title: 'Toyota Raize: Urban Agility Meets Value',
    description: 'The perfect entry point for Filipino families seeking modern SUV style without the hefty price tag. Nimble in traffic, practical for daily drives.',
    image: 'https://images.unsplash.com/photo-1579108041833-8b6f5f59b8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBSYWl6ZSUyMGNvbXBhY3QlMjBTVVZ8ZW58MXx8fHwxNzc1MTg5MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Compact SUV',
    author: 'Sofia Garcia',
    readTime: '6 min read',
    date: 'March 22, 2026'
  },
  {
    id: 2,
    title: 'Mitsubishi Montero Sport: The Filipino Favorite',
    description: 'A rugged yet refined 7-seater that conquers EDSA and provincial roads alike. The benchmark for midsize SUVs in the Philippines.',
    image: 'https://images.unsplash.com/photo-1594978100646-ccd2ae32b711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaXRzdWJpc2hpJTIwTW9udGVybyUyMFNwb3J0JTIwU1VWfGVufDF8fHx8MTc3NTE4OTA0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Midsize SUV',
    author: 'Juan dela Cruz',
    readTime: '7 min read',
    date: 'March 30, 2026'
  },
  {
    id: 3,
    title: 'Honda Civic: Sporty Sophistication',
    description: 'The iconic sport sedan that blends performance with everyday practicality. A driver\'s car for those who want more from their daily commute.',
    image: 'https://images.unsplash.com/photo-1689554863306-b236be198a2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBIb25kYSUyMENpdmljfGVufDF8fHx8MTc3NTE4OTAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sport Sedan',
    author: 'Maria Santos',
    readTime: '6 min read',
    date: 'April 1, 2026'
  },
  {
    id: 4,
    title: 'Toyota Fortuner: The People\'s SUV',
    description: 'Unmatched versatility, legendary reliability, and commanding road presence. The gold standard for Filipino family vehicles.',
    image: 'https://images.unsplash.com/photo-1639922195938-611119f7f307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBGb3J0dW5lciUyMFNVViUyMFBoaWxpcHBpbmVzJTIwcm9hZHxlbnwxfHx8fDE3NzUxODkwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Full-Size SUV',
    author: 'Carlos Mendoza',
    readTime: '8 min read',
    date: 'April 2, 2026'
  }
];

function FeaturedReviews() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="mb-12 border-l-4 border-[#fbd203] pl-6">
          <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold mb-2 block">Featured Reviews</span>
          <h2 className="text-3xl md:text-4xl text-gray-900 font-bold">Latest Drives</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="group cursor-pointer border border-gray-200 hover:border-[#fbd203] transition-all bg-white rounded-2xl overflow-hidden hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <ImageWithFallback
                  src={review.image}
                  alt={review.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#fbd203] text-white text-xs uppercase tracking-wider font-bold rounded-lg">
                    {review.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{review.date}</span>
                  <span>•</span>
                  <span>{review.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl text-gray-900 group-hover:text-[#fbd203] transition-colors font-bold">
                  {review.title}
                </h3>
                <p className="text-sm text-gray-500">By {review.author}</p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {review.description}
                </p>
                <div className="pt-2">
                  <span className="text-[#fbd203] uppercase tracking-wider text-xs font-bold group-hover:underline">
                    Read Full Review →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#fbd203] transition-all hover:shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1639922195938-611119f7f307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBGb3J0dW5lciUyMFNVViUyMFBoaWxpcHBpbmVzJTIwcm9hZHxlbnwxfHx8fDE3NzUxODkwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Best Cars for Filipino Families"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-[#fbd203] pl-6">
              <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold mb-2 block">Editorial Story</span>
              <h2 className="text-3xl md:text-4xl text-gray-900 font-bold">
                Best Cars for Filipino Families
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-6">
              <p>
                Choosing your first family car in the Philippines is more than just a purchase—it's a milestone. From navigating Metro Manila's notorious traffic to weekend provincial getaways, your vehicle becomes part of the family story.
              </p>
              <p>
                We've spent months testing vehicles on real Philippine roads—from EDSA's gridlock to Tagaytay's winding climbs. The Fortuner, Montero Sport, and Innova continue to dominate for good reason: they're built for our conditions.
              </p>
              <p>
                Whether you're budgeting ₱1M or stretching to ₱2M, our guide helps Filipino families find the perfect balance of space, safety, and "sulit" value.
              </p>
            </div>

            <div className="pt-4">
              <button className="text-[#fbd203] uppercase tracking-wider text-sm font-bold hover:underline">
                Read the Full Story →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const comparisons = [
    {
      title: 'Fortuner vs Montero Sport',
      subtitle: 'The Ultimate Midsize SUV Battle',
      date: 'April 2, 2026'
    },
    {
      title: 'Vios vs Mirage G4',
      subtitle: 'Budget Sedan Showdown',
      date: 'March 30, 2026'
    },
    {
      title: 'Civic vs Mustang',
      subtitle: 'Sports Car Face-Off',
      date: 'March 28, 2026'
    },
    {
      title: 'Best SUVs Under ₱1M',
      subtitle: 'Value-for-Money Crossovers',
      date: 'March 25, 2026'
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <div className="mb-12 border-l-4 border-[#fbd203] pl-6">
          <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold mb-2 block">Comparisons</span>
          <h2 className="text-3xl md:text-4xl text-gray-900 font-bold">Head to Head</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {comparisons.map((comparison, index) => (
            <article
              key={index}
              className="group cursor-pointer bg-white p-8 hover:shadow-xl transition-all border-2 border-gray-200 hover:border-[#fbd203] rounded-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">{comparison.date}</span>
                  <span className="text-[#fbd203] text-xs font-bold uppercase px-3 py-1 bg-[#fbd203]/10 rounded-lg">Comparison</span>
                </div>
                <h3 className="text-2xl text-gray-900 group-hover:text-[#fbd203] transition-colors font-bold">
                  {comparison.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {comparison.subtitle}
                </p>
                <div className="pt-2">
                  <span className="text-[#fbd203] uppercase tracking-wider text-xs font-bold group-hover:underline">
                    Read Comparison →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const latestReviews = [
  {
    id: 1,
    title: 'Toyota Vios 2026: Still the Sedan King?',
    date: 'April 1, 2026',
    image: 'https://images.unsplash.com/photo-1749058983232-59b967855b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBWaW9zJTIwc2VkYW58ZW58MXx8fHwxNzc1MTg5MDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Budget Sedan',
    author: 'Ana Reyes',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'MG 5: Value-Packed Daily Driver',
    date: 'March 29, 2026',
    image: 'https://images.unsplash.com/photo-1749058982938-8a028edd392f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxUb3lvdGElMjBWaW9zJTIwc2VkYW58ZW58MXx8fHwxNzc1MTg5MDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sedan',
    author: 'Rico Tan',
    readTime: '6 min read'
  },
  {
    id: 3,
    title: 'Kia Sonet: Small SUV, Big Features',
    date: 'March 26, 2026',
    image: 'https://images.unsplash.com/photo-1579108041833-8b6f5f59b8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBSYWl6ZSUyMGNvbXBhY3QlMjBTVVZ8ZW58MXx8fHwxNzc1MTg5MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Compact SUV',
    author: 'Maria Santos',
    readTime: '5 min read'
  },
  {
    id: 4,
    title: 'Honda Civic Type R: Track Beast',
    date: 'March 22, 2026',
    image: 'https://images.unsplash.com/photo-1641922096087-21cf3b4daa9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzcG9ydHMlMjBjYXIlMjBIb25kYSUyMENpdmljfGVufDF8fHx8MTc3NTE4OTAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sports Car',
    author: 'Carlos Mendoza',
    readTime: '7 min read'
  },
  {
    id: 5,
    title: 'Montero Sport: 7 Years Later',
    date: 'March 18, 2026',
    image: 'https://images.unsplash.com/photo-1628684014602-88da45adfb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxNaXRzdWJpc2hpJTIwTW9udGVybyUyMFNwb3J0JTIwU1VWfGVufDF8fHx8MTc3NTE4OTA0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Midsize SUV',
    author: 'Juan dela Cruz',
    readTime: '6 min read'
  },
  {
    id: 6,
    title: 'Mustang GT: American Muscle in Manila',
    date: 'March 14, 2026',
    image: 'https://images.unsplash.com/photo-1634252021864-0af189354801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxGb3JkJTIwTXVzdGFuZyUyMHNwb3J0cyUyMGNhcnxlbnwxfHx8fDE3NzUxODkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sports Car',
    author: 'Rico Tan',
    readTime: '9 min read'
  }
];

function LatestReviews() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <div className="mb-12 border-l-4 border-[#fbd203] pl-6">
          <span className="text-[#fbd203] uppercase tracking-widest text-xs font-bold mb-2 block">Latest Content</span>
          <h2 className="text-3xl md:text-4xl text-gray-900 font-bold">Recent Reviews</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestReviews.map((review) => (
            <article
              key={review.id}
              className="group cursor-pointer bg-white hover:shadow-xl transition-all rounded-2xl overflow-hidden border border-gray-200 hover:border-[#fbd203]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={review.image}
                  alt={review.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#fbd203] text-white text-[10px] uppercase tracking-wider font-bold rounded-lg">
                    {review.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                  <Calendar size={12} />
                  <span>{review.date}</span>
                  <span>•</span>
                  <span>{review.readTime}</span>
                </div>
                <h3 className="text-lg leading-tight text-gray-900 group-hover:text-[#fbd203] transition-colors font-bold">
                  {review.title}
                </h3>
                <p className="text-sm text-gray-500">By {review.author}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-6 border-t-2 border-gray-800">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#fbd203]">DG DRIVE</span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase">by Daily Guardian</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Philippines' trusted source for automotive journalism. Drive stories that matter on Philippine roads.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-[#fbd203] transition-colors">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#fbd203] transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#fbd203] transition-colors">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#fbd203] transition-colors">
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 uppercase text-xs tracking-widest text-[#fbd203] font-bold">Reviews</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Latest Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Family Cars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sports Cars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SUV Comparisons</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Budget Cars</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 uppercase text-xs tracking-widest text-[#fbd203] font-bold">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Buying Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Car Comparisons</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Video Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Filipino Car Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auto News</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 uppercase text-xs tracking-widest text-[#fbd203] font-bold">About</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About DG Drive</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 DG Drive. A sub-brand of Daily Guardian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategorySplit />
        <FeaturedReviews />
        <StorySection />
        <ComparisonSection />
        <LatestReviews />
      </main>
      <Footer />
    </div>
  );
}