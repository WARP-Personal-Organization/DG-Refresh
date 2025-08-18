'use client';

import React, { useState } from 'react';
import { Play, Clock, Users, Calendar, Filter, Grid, List, ExternalLink, Share2, Bookmark } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  publishDate: string;
  thumbnail: string;
  category: string;
  featured?: boolean;
}

const videosData: VideoData[] = [
  {
    id: '1',
    title: 'DGD Episode 9: Business Leaders\' Summit 5.0',
    description: 'An exclusive look at the annual business summit featuring local entrepreneurs and industry leaders discussing the future of our local economy.',
    duration: '12:45',
    views: '2.3K',
    publishDate: '2 days ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/1a1a1a/FFD700?text=Business+Summit',
    category: 'Business',
    featured: true
  },
  {
    id: '2',
    title: 'DGD Episode 8: Daily Guardian Cup 2019',
    description: 'Highlights from the annual Daily Guardian sponsored community sports championship.',
    duration: '08:52',
    views: '1.8K',
    publishDate: '5 days ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/2a2a2a/FFD700?text=Sports+Cup',
    category: 'Sports'
  },
  {
    id: '3',
    title: 'DGD Episode 7: Pride Celebration',
    description: 'Community comes together for the annual Pride celebration in downtown.',
    duration: '06:24',
    views: '3.1K',
    publishDate: '1 week ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/3a3a3a/FFD700?text=Pride+Event',
    category: 'Community'
  },
  {
    id: '4',
    title: 'DGD Episode 6: The Royal Homecoming',
    description: 'Local high school celebrates homecoming with record attendance.',
    duration: '10:56',
    views: '4.2K',
    publishDate: '2 weeks ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/4a4a4a/FFD700?text=Homecoming',
    category: 'Education'
  },
  {
    id: '5',
    title: 'DGD Episode 5: Iloilo Fade Barber',
    description: 'Meet the local barber who\'s become a community institution.',
    duration: '07:27',
    views: '1.5K',
    publishDate: '3 weeks ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/5a5a5a/FFD700?text=Local+Barber',
    category: 'Profiles'
  },
  {
    id: '6',
    title: 'DGD Episode 4: Ilonggo Hablon Heritage',
    duration: '09:34',
    views: '2.7K',
    publishDate: '1 month ago',
    thumbnail: 'https://via.placeholder.com/400x225.png/6a6a6a/FFD700?text=Heritage',
    category: 'Culture',
    description: 'Exploring the traditional weaving techniques of local artisans.'
  }
];

const categories = ['All', 'Business', 'Sports', 'Community', 'Education', 'Profiles', 'Culture'];

const EnhancedVideoSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(videosData[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredVideos = selectedCategory === 'All' 
    ? videosData 
    : videosData.filter(video => video.category === selectedCategory);

  const handleVideoSelect = (video: VideoData) => {
    setSelectedVideo(video);
  };

  return (
    <section className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            <div className="px-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 tracking-wider font-serif">
                DGD DOCUMENTARIES
              </h2>
              <p className="text-gray-400 text-lg mt-2 font-serif italic">
                Your Stories Are Us
              </p>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-500 to-transparent"></div>
          </div>
          
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dive deep into the stories that shape our community. From business leaders to local heroes, 
            our documentary series captures the heart and soul of our neighborhood.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-8">
            <div className="bg-black border-2 border-yellow-500/30 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/10">
              {/* Video Player Area */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={32} className="text-black ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Video Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/80 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {selectedVideo.duration}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 border-t border-yellow-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                      {selectedVideo.category}
                    </span>
                    
                    <h3 className="text-2xl font-serif font-bold text-white leading-tight mb-3">
                      {selectedVideo.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {selectedVideo.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-yellow-400" />
                        <span>{selectedVideo.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-yellow-400" />
                        <span>{selectedVideo.publishDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 bg-gray-800 hover:bg-yellow-500 text-gray-300 hover:text-black rounded-lg transition-all duration-200 group">
                      <Share2 size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-yellow-500 text-gray-300 hover:text-black rounded-lg transition-all duration-200 group">
                      <Bookmark size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-yellow-500 text-gray-300 hover:text-black rounded-lg transition-all duration-200 group">
                      <ExternalLink size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-4">
            <div className="bg-black border-2 border-gray-800 rounded-xl overflow-hidden">
              {/* Playlist Header */}
              <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-serif font-bold text-white">Episode Playlist</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <List size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid size={14} />
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={14} className="text-yellow-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:border-yellow-500 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-gray-400">
                  {filteredVideos.length} episode{filteredVideos.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Video List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2 p-2' : 'space-y-2 p-2'}>
                  {filteredVideos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`cursor-pointer rounded-lg border transition-all duration-300 group ${
                        selectedVideo.id === video.id
                          ? 'border-yellow-500/50 bg-yellow-500/10'
                          : 'border-gray-800 hover:border-yellow-500/30 bg-gray-900/50 hover:bg-gray-800/50'
                      } ${viewMode === 'grid' ? 'p-2' : 'p-3'}`}
                    >
                      {viewMode === 'list' ? (
                        <div className="flex gap-3">
                          {/* Episode Number */}
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">{index + 1}</span>
                          </div>

                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-white group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2 leading-tight mb-1">
                              {video.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {video.duration}
                              </span>
                              <span>•</span>
                              <span>{video.views} views</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Grid Thumbnail */}
                          <div className="relative aspect-video rounded overflow-hidden">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <h5 className="text-xs font-medium text-white group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2">
                            {video.title}
                          </h5>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-xl font-serif transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25">
            View All Episodes
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </section>
  );
};

export default EnhancedVideoSection;