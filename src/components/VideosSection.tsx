"use client";

import { Clock, Filter, Play, Users } from "lucide-react";
import React, { useState } from "react";

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
    id: "1",
    title: "DGD Episode 9: Business Leaders' Summit 5.0",
    description:
      "An exclusive look at the annual business summit featuring local entrepreneurs and industry leaders discussing the future of our local economy.",
    duration: "12:45",
    views: "2.3K",
    publishDate: "2 days ago",
    thumbnail: "https://youtu.be/pspDeWO-HHQ",
    category: "Business",
    featured: true,
  },
  {
    id: "2",
    title: "DGD Episode 8: Daily Guardian Cup 2019",
    description:
      "Highlights from the annual Daily Guardian sponsored community sports championship.",
    duration: "08:52",
    views: "1.8K",
    publishDate: "5 days ago",
    thumbnail:
      "https://via.placeholder.com/400x225.png/2a2a2a/FFD700?text=Sports+Cup",
    category: "Sports",
  },
  {
    id: "3",
    title: "DGD Episode 7: Pride Celebration",
    description:
      "Community comes together for the annual Pride celebration in downtown.",
    duration: "06:24",
    views: "3.1K",
    publishDate: "1 week ago",
    thumbnail:
      "https://via.placeholder.com/400x225.png/3a3a3a/FFD700?text=Pride+Event",
    category: "Community",
  },
  {
    id: "4",
    title: "DGD Episode 6: The Royal Homecoming",
    description:
      "Local high school celebrates homecoming with record attendance.",
    duration: "10:56",
    views: "4.2K",
    publishDate: "2 weeks ago",
    thumbnail:
      "https://via.placeholder.com/400x225.png/4a4a4a/FFD700?text=Homecoming",
    category: "Education",
  },
  {
    id: "5",
    title: "DGD Episode 5: Iloilo Fade Barber",
    description: "Meet the local barber who's become a community institution.",
    duration: "07:27",
    views: "1.5K",
    publishDate: "3 weeks ago",
    thumbnail:
      "https://via.placeholder.com/400x225.png/5a5a5a/FFD700?text=Local+Barber",
    category: "Profiles",
  },
  {
    id: "6",
    title: "DGD Episode 4: Ilonggo Hablon Heritage",
    duration: "09:34",
    views: "2.7K",
    publishDate: "1 month ago",
    thumbnail:
      "https://via.placeholder.com/400x225.png/6a6a6a/FFD700?text=Heritage",
    category: "Culture",
    description:
      "Exploring the traditional weaving techniques of local artisans.",
  },
];

const categories = [
  "All",
  "Business",
  "Sports",
  "Community",
  "Education",
  "Profiles",
  "Culture",
];

const EnhancedVideoSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(videosData[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos =
    selectedCategory === "All"
      ? videosData
      : videosData.filter((video) => video.category === selectedCategory);

  const handleVideoSelect = (video: VideoData) => {
    setSelectedVideo(video);
  };

  return (
    <section className="py-12 border-t border-gray-800 bg-[#1b1a1b] font-open-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Section Header */}
        <div className="mb-12 pb-4 border-b border-gray-800">
          <h2 className="text-3xl font-roboto font-bold text-white mb-2">
            DGD Documentaries
          </h2>
          <p className="text-gray-400 italic font-open-sans">
            Your Stories Are Us
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Video Player Area */}
            <div className="relative aspect-video bg-black mb-6 overflow-hidden">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />

              {/* Simple Play Button */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group cursor-pointer">
                <div className="w-16 h-16 bg-[#fcee16] rounded-full flex items-center justify-center group-hover:bg-[#fcee16]/80 transition-colors duration-200">
                  <Play
                    size={24}
                    className="text-[#1b1a1b] ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm font-open-sans">
                {selectedVideo.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="text-[#fcee16] text-sm font-medium uppercase tracking-wide font-open-sans">
                {selectedVideo.category}
              </div>

              <h3 className="text-2xl font-roboto font-bold text-white leading-tight">
                {selectedVideo.title}
              </h3>

              <p className="text-gray-400 leading-relaxed font-open-sans">
                {selectedVideo.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500 pt-2 border-t border-gray-800/50 font-open-sans">
                <span className="flex items-center gap-2">
                  <Users size={14} />
                  {selectedVideo.views} views
                </span>
                <span>•</span>
                <span>{selectedVideo.publishDate}</span>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar - 1/3 width */}
          <div className="lg:col-span-1 border-l border-gray-800 pl-8">
            {/* Playlist Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-roboto font-bold text-white">
                  Episodes
                </h4>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-black border border-gray-700 text-white rounded px-2 py-1 text-sm focus:border-[#fcee16] focus:outline-none font-open-sans"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-open-sans">
                {filteredVideos.length} episodes available
              </p>
            </div>

            {/* Video List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredVideos.map((video, index) => (
                <article
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`cursor-pointer pb-4 border-b border-gray-800/50 last:border-b-0 group ${
                    selectedVideo.id === video.id
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  } transition-opacity duration-200`}
                >
                  <div className="flex gap-3">
                    {/* Episode Number */}
                    <div className="flex-shrink-0 w-6 h-6 bg-[#fcee16] text-[#1b1a1b] rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-white group-hover:text-[#fcee16] transition-colors duration-200 leading-tight mb-1 font-roboto">
                        {video.title}
                      </h5>

                      <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {video.duration}
                        </span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <button className="px-6 py-3 text-[#fcee16] hover:text-[#fcee16]/80 font-medium transition-colors duration-200 border border-[#fcee16] hover:border-[#fcee16]/80 rounded font-open-sans">
            View All Episodes
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedVideoSection;
