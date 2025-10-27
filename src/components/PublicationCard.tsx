"use client";
import { Calendar, ChevronRight, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";

export const PublicationCard = ({
  title,
  imageUrl,
  link = "#",
  isToday = false,
}: {
  title: string;
  imageUrl: string;
  link?: string;
  isToday?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-background rounded-xl overflow-hidden shadow-2xl shadow-background/50 transition-all duration-500 hover:shadow-3xl hover:shadow-accent/10 border border-accent/20 hover:border-accent/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-accent/95 to-accent text-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-background/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Calendar size={16} className="text-background" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest font-roboto">
              {title}
            </h3>
          </div>

          {isToday && (
            <div className="flex items-center gap-2 bg-background/20 rounded-full px-3 py-1 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Live
              </span>
            </div>
          )}
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-background/10"></div>
        </div>
      </div>

      {/* Publication Image Container */}
      <div className="relative group">
        <a href={link} className="block relative overflow-hidden">
          {/* Image with enhanced effects */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            />

            {/* Premium gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              {/* Hover content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`transform transition-all duration-500 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                >
                  <div className="bg-accent/95 backdrop-blur-xl text-background px-8 py-4 rounded-2xl shadow-2xl border border-accent/30">
                    <div className="flex items-center gap-3">
                      <Eye size={24} />
                      <span className="font-bold text-lg font-roboto">
                        {isToday ? "Read Edition" : "Open Archive"}
                      </span>
                      <ExternalLink size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner accent lines */}
              <div className="absolute top-6 left-6">
                <div className="w-8 h-8 border-t-2 border-l-2 border-accent/60"></div>
              </div>
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-t-2 border-r-2 border-accent/60"></div>
              </div>
              <div className="absolute bottom-6 left-6">
                <div className="w-8 h-8 border-b-2 border-l-2 border-accent/60"></div>
              </div>
              <div className="absolute bottom-6 right-6">
                <div className="w-8 h-8 border-b-2 border-r-2 border-accent/60"></div>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Premium Footer */}
      <div className="bg-gradient-to-b from-background to-background/95 p-4 border-t border-accent/10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
              <Calendar size={12} className="text-accent" />
            </div>
            <span className="text-sm font-medium text-foreground/80 font-sans">
              {isToday ? "Latest Edition" : "Archive Collection"}
            </span>
          </div>

          <button className="group flex items-center gap-2 text-accent hover:text-accent/80 transition-all duration-300">
            <span className="text-sm font-bold uppercase tracking-wider font-roboto">
              Read Now
            </span>
            <ChevronRight
              size={14}
              className="transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>

        {/* Enhanced status bar */}
        <div className="relative h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
              isToday
                ? "bg-gradient-to-r from-accent to-accent/80 w-full"
                : "bg-gradient-to-r from-foreground/40 to-foreground/20 w-3/5"
            }`}
          />
          {isToday && (
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-accent/60 to-transparent animate-pulse rounded-full" />
          )}
        </div>
      </div>

      {/* Premium border animation */}
      {isToday && (
        <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-accent/30 via-transparent via-transparent to-accent/30 opacity-50 animate-pulse pointer-events-none" />
      )}

      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none ${isHovered ? "shadow-2xl shadow-accent/20" : ""}`}
      />
    </div>
  );
};
