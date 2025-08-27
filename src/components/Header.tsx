"use client";

import { Bell, Calendar, MapPin, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { BlogPostDocument } from "../../prismicio-types";
import SearchModal from "./SearchModal";

// Weather data interface
interface WeatherData {
  temperature: number;
  description: string;
  loading: boolean;
  error: boolean;
}

// Header props interface
interface HeaderProps {
  posts?: BlogPostDocument[];
}

// Custom hook for weather data
const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    description: "Loading...",
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap API - you'll need to get a free API key from openweathermap.org
        // For demo purposes, I'm using a mock API. Replace with your actual API key.
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo_key";

        // Coordinates for Iloilo City, Philippines
        const lat = 10.7202;
        const lon = 122.5621;

        if (API_KEY === "demo_key") {
          // Mock data for demo purposes
          setTimeout(() => {
            setWeather({
              temperature: 28,
              description: "Partly Cloudy",
              loading: false,
              error: false,
            });
          }, 1000);
          return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Weather data unavailable");
        }

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeather({
          temperature: 28,
          description: "Partly Cloudy",
          loading: false,
          error: true,
        });
      }
    };

    fetchWeather();

    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return weather;
};

const Header: React.FC<HeaderProps> = ({ posts = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const weather = useWeather();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Handle keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearchModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Convert Celsius to Fahrenheit for display
  const getTemperatureDisplay = (celsius: number) => {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  };

  return (
    <>
      <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b-2 border-yellow-500/30 shadow-xl relative font-open-sans">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar with Date and Weather - Enhanced Responsive */}
          <div className="hidden lg:flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
            <div className="flex items-center gap-3 text-gray-400">
              <time className="font-medium flex items-center gap-2 font-open-sans">
                <Calendar size={12} className="text-yellow-400" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-gray-600">|</span>
              <span className="text-yellow-400 flex items-center gap-1 font-open-sans">
                <MapPin size={12} />
                {weather.loading
                  ? "Loading weather..."
                  : `${getTemperatureDisplay(weather.temperature)} ${weather.description}`}
                {weather.error && (
                  <span className="text-gray-500 text-xs ml-1">
                    (Iloilo City)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <span className="font-semibold font-roboto">Breaking News</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium font-open-sans">
                Local Election Results Tonight
              </span>
            </div>
          </div>

          {/* Mobile Top Bar - Simplified */}
          <div className="lg:hidden flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={10} className="text-yellow-400" />
              <time className="font-medium font-open-sans">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 text-xs font-medium truncate max-w-32 font-open-sans">
                {weather.loading
                  ? "Loading..."
                  : `${getTemperatureDisplay(weather.temperature)}`}
              </span>
            </div>
          </div>

          {/* Main Header - Enhanced Responsive Layout */}
          <div className="flex justify-between items-center py-4 lg:py-6 px-4">
            {/* Left Section - Responsive */}
            <div className="flex-1 flex items-center gap-2 sm:gap-4">
              {/* Desktop Search */}
              <button
                onClick={openSearchModal}
                className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 group"
              >
                <Search
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-sm font-medium font-roboto">Search</span>
                <kbd className="hidden xl:inline-flex items-center px-2 py-1 text-xs font-mono text-gray-500 bg-gray-800 border border-gray-700 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Button */}
              <button
                onClick={openSearchModal}
                className="lg:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Mobile Menu Button */}
              {/* <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button> */}
            </div>

            {/* Centered Logo - Fully Responsive */}
            <div className="flex-1 text-center px-2">
              <Link href="/" className="group block">
                <div className="relative flex flex-col items-center">
                  {/* Main Logo Image - Responsive Sizes */}
                  <div className="relative">
                    <img
                      src="/dg-logo.png"
                      alt="Daily Guardian"
                      className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Section - Enhanced Responsive */}
            <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
              {/* Mobile Sign In */}
              <button className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2">
                <User size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-gradient-to-b from-black via-gray-950 to-black border-b-2 border-yellow-500/30 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Search Bar in Mobile Menu */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openSearchModal();
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-left text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Search size={18} />
                  <span className="font-open-sans">Search articles...</span>
                </button>
              </div>

              {/* Weather Widget for Mobile */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-yellow-400" />
                    <span className="text-sm text-gray-400 font-open-sans">
                      Iloilo City
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold font-roboto">
                      {weather.loading
                        ? "Loading..."
                        : getTemperatureDisplay(weather.temperature)}
                    </div>
                    <div className="text-xs text-gray-400 font-open-sans">
                      {weather.loading ? "" : weather.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-4 mb-6">
                <Link
                  href="/"
                  className="block py-3 px-4 text-yellow-400 font-roboto font-bold text-lg border-b border-yellow-500/30 bg-yellow-500/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {[
                  "Local News",
                  "Sports",
                  "Business",
                  "Opinion",
                  "Community",
                  "Events",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="block py-3 px-4 text-gray-300 hover:text-yellow-400 font-roboto font-medium transition-colors duration-200 border-b border-gray-800 hover:bg-yellow-500/5 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                <button className="flex items-center justify-center gap-2 border border-yellow-500/50 text-yellow-400 font-bold py-3 px-4 rounded-lg font-roboto transition-all duration-300 hover:bg-yellow-500/10">
                  <Bell size={16} />
                  Alerts
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-600 text-gray-300 font-bold py-3 px-4 rounded-lg font-roboto transition-all duration-300 hover:bg-gray-700/50">
                  <User size={16} />
                  Sign In
                </button>
              </div>

              {/* Mobile Breaking News */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-bold text-sm font-roboto">
                    BREAKING NEWS
                  </span>
                </div>
                <p className="text-white text-sm font-open-sans">
                  Local Election Results Tonight
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        posts={posts}
      />
    </>
  );
};

export default Header;
