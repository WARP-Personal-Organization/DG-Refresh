import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

const TodaysPaperSpotlight: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="bg-black py-16 border-t border-b border-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Decorative top border */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
          <div className="px-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 tracking-wider font-serif text-center">
              TODAY&apos;S PAPER
            </h2>
            <p className="text-center text-gray-400 text-sm mt-2 font-serif italic">
              {currentDate}
            </p>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-500/50 to-transparent"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Section - Featured Story */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border-l-4 border-yellow-500 pl-6">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4">
                Front Page
              </span>
              
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white leading-tight mb-4">
                Daily Guardian delivers comprehensive local coverage
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                From breaking news to community events — today&apos;s edition features in-depth reporting 
                on the stories that matter most to our readers.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-yellow-400" />
                  <span>Digital Edition Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper size={14} className="text-yellow-400" />
                  <span>24 Pages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Newspaper Pages Grid */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Main newspaper layout */}
              <div className="grid grid-cols-3 gap-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Front Page - Larger */}
                <div className="col-span-2 relative group">
                  <Link href="/todays-paper/front-page" className="block">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg border-2 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden aspect-[3/4] shadow-lg hover:shadow-xl">
                      <div className="p-4 h-full flex flex-col">
                        {/* Header */}
                        <div className="text-center border-b border-gray-400 pb-2 mb-3">
                          <h4 className="text-lg font-serif font-bold text-black">DAILY GUARDIAN</h4>
                          <p className="text-xs text-gray-600">{currentDate}</p>
                        </div>
                        
                        {/* Headline */}
                        <div className="flex-1">
                          <h5 className="text-sm font-serif font-bold text-black leading-tight mb-2">
                            Local Elections Draw Record Turnout
                          </h5>
                          <div className="bg-gray-200 h-20 rounded mb-2"></div>
                          <div className="space-y-1">
                            <div className="bg-gray-300 h-2 rounded"></div>
                            <div className="bg-gray-300 h-2 rounded w-4/5"></div>
                            <div className="bg-gray-300 h-2 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-xs">
                          READ FRONT PAGE
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Side sections */}
                <div className="space-y-4">
                  {/* Sports Section */}
                  <Link href="/todays-paper/sports" className="block group">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-3 shadow-md hover:shadow-lg">
                      <div className="text-center border-b border-blue-300 pb-1 mb-2">
                        <h5 className="text-xs font-serif font-bold text-black">SPORTS</h5>
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-black">Championship Finals</h6>
                        <div className="bg-blue-300 h-8 rounded"></div>
                        <div className="space-y-1">
                          <div className="bg-blue-300 h-1 rounded"></div>
                          <div className="bg-blue-300 h-1 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Business Section */}
                  <Link href="/todays-paper/business" className="block group">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-3 shadow-md hover:shadow-lg">
                      <div className="text-center border-b border-green-300 pb-1 mb-2">
                        <h5 className="text-xs font-serif font-bold text-black">BUSINESS</h5>
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-black">Market Update</h6>
                        <div className="bg-green-300 h-8 rounded"></div>
                        <div className="space-y-1">
                          <div className="bg-green-300 h-1 rounded"></div>
                          <div className="bg-green-300 h-1 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Additional sections below */}
              <div className="grid grid-cols-4 gap-3 mt-6 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Opinion */}
                <Link href="/todays-paper/opinion" className="block group">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-2 shadow-md">
                    <h6 className="text-xs font-serif font-bold text-center text-black border-b border-purple-300 pb-1 mb-1">OPINION</h6>
                    <div className="space-y-1">
                      <div className="bg-purple-300 h-1 rounded"></div>
                      <div className="bg-purple-300 h-1 rounded w-4/5"></div>
                    </div>
                  </div>
                </Link>

                {/* Life & Arts */}
                <Link href="/todays-paper/lifestyle" className="block group">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-2 shadow-md">
                    <h6 className="text-xs font-serif font-bold text-center text-black border-b border-pink-300 pb-1 mb-1">LIFESTYLE</h6>
                    <div className="space-y-1">
                      <div className="bg-pink-300 h-1 rounded"></div>
                      <div className="bg-pink-300 h-1 rounded w-3/5"></div>
                    </div>
                  </div>
                </Link>

                {/* Weather */}
                <Link href="/todays-paper/weather" className="block group">
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-2 shadow-md">
                    <h6 className="text-xs font-serif font-bold text-center text-black border-b border-cyan-300 pb-1 mb-1">WEATHER</h6>
                    <div className="text-center">
                      <div className="bg-cyan-300 w-6 h-6 rounded-full mx-auto mb-1"></div>
                      <div className="text-xs font-bold text-black">72°F</div>
                    </div>
                  </div>
                </Link>

                {/* Classifieds */}
                <Link href="/todays-paper/classifieds" className="block group">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded border border-gray-600 hover:border-yellow-500/50 transition-all duration-300 aspect-[3/4] p-2 shadow-md">
                    <h6 className="text-xs font-serif font-bold text-center text-black border-b border-orange-300 pb-1 mb-1">CLASSIFIED</h6>
                    <div className="space-y-1">
                      <div className="bg-orange-300 h-1 rounded"></div>
                      <div className="bg-orange-300 h-1 rounded w-2/3"></div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Featured Article */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-yellow-500/30 rounded-lg p-6 bg-black/50">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4">
                Editor&apos;s Choice
              </span>
              
              <blockquote className="border-l-4 border-yellow-500 pl-4 mb-6">
                <p className="text-lg italic text-yellow-100 leading-relaxed mb-4">
                  &quot;This week&apos;s investigation into local infrastructure reveals both challenges and opportunities for our growing community.&quot;
                </p>
                
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-black" />
                  </div>
                  <div>
                    <cite className="text-yellow-200 font-medium not-italic block">Sarah Mitchell</cite>
                    <span className="text-gray-400 text-sm">Editor-in-Chief</span>
                  </div>
                </footer>
              </blockquote>

              <Link 
                href="/todays-paper/featured" 
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200 group"
              >
                Read Full Article 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="flex items-center justify-center mt-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
          <div className="px-6">
            <div className="w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-500/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default TodaysPaperSpotlight;