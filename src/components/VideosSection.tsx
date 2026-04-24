"use client";

import type { YouTubeVideo } from "../../lib/youtube";
import { Filter, Play } from "lucide-react";
import React, { useState } from "react";

interface EnhancedVideoSectionProps {
  videos: YouTubeVideo[];
}

const formatDate = (iso: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EnhancedVideoSection: React.FC<EnhancedVideoSectionProps> = ({
  videos,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(
    videos[0] ?? null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  if (videos.length === 0) return null;

  const handleSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  return (
    <section className="py-12 border-default bg-[#1b1a1b] font-open-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
          <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest mb-2">
            Daily Guardian Documentaries
          </h2>
          <p className="text-gray-400 italic font-open-sans">
            Your Stories Are Us
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player - 2/3 width */}
          <div className="lg:col-span-2">
            {selectedVideo && (
              <>
                <div className="relative aspect-video bg-black mb-6 overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      key={selectedVideo.videoId}
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${selectedVideo.videoId}/hqdefault.jpg`}
                        alt={selectedVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group"
                        onClick={() => setIsPlaying(true)}
                      >
                        <div className="w-16 h-16 bg-[#fcee16] rounded-full flex items-center justify-center group-hover:bg-[#fcee16]/80 transition-colors duration-200">
                          <Play
                            size={24}
                            className="text-[#1b1a1b] ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-roboto font-bold text-white leading-tight">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-gray-400 leading-relaxed font-open-sans">
                      {selectedVideo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t border-default font-open-sans">
                    <span>{formatDate(selectedVideo.publishDate)}</span>
                    <a
                      href={selectedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#fcee16] hover:underline"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Playlist Sidebar - 1/3 width */}
          <div className="lg:col-span-1 border-l border-default pl-8">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-lg font-roboto font-bold text-white">
                Episodes
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Filter size={12} />
                <span>All</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-open-sans mb-4">
              {videos.length} episodes available
            </p>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {videos.map((video, index) => (
                <article
                  key={video.id}
                  onClick={() => handleSelect(video)}
                  className={`cursor-pointer pb-4 border-b border-default last:border-b-0 group transition-opacity duration-200 ${
                    selectedVideo?.videoId === video.videoId
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#fcee16] text-[#1b1a1b] rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="relative flex-shrink-0 w-16 h-12 rounded overflow-hidden bg-gray-800">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-white group-hover:text-[#fcee16] transition-colors duration-200 leading-tight font-roboto line-clamp-2">
                        {video.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 font-open-sans">
                        {formatDate(video.publishDate)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedVideoSection;
