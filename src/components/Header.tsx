"use client";

import { Bell, Calendar, MapPin, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Weather data interface
interface WeatherData {
  temperature: number;
  description: string;
  loading: boolean;
  error: boolean;
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

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const weather = useWeather();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Convert Celsius to Fahrenheit for display
  const getTemperatureDisplay = (celsius: number) => {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b-2 border-yellow-500/30 shadow-xl relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar with Date and Weather - Enhanced Responsive */}
        <div className="hidden lg:flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-3 text-gray-400">
            <time className="font-medium flex items-center gap-2">
              <Calendar size={12} className="text-yellow-400" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-gray-600">|</span>
            <span className="text-yellow-400 flex items-center gap-1">
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
            <span className="font-semibold">Breaking News</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">
              Local Election Results Tonight
            </span>
          </div>
        </div>

        {/* Mobile Top Bar - Simplified */}
        <div className="lg:hidden flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={10} className="text-yellow-400" />
            <time className="font-medium">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-xs font-medium truncate max-w-32">
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
            <button className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 group">
              <Search
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-sm font-medium font-serif">Search</span>
            </button>

            {/* Mobile Search Button */}
            <button className="lg:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2">
              <Search size={18} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Centered Logo - Fully Responsive */}
          <div className="flex-1 text-center px-2">
            <Link href="/" className="group block">
              <div className="relative">
                {/* Main Logo - Responsive Text Sizes */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 tracking-wider drop-shadow-lg group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-300 transition-all duration-300 leading-tight">
                  DAILY GUARDIAN
                </h1>

                {/* Responsive Tagline */}
                <p className="text-xs sm:text-sm lg:text-base text-gray-400 font-serif italic mt-1 tracking-widest hidden sm:block">
                  Your Local Voice Since 2000
                </p>

                {/* Mobile Tagline */}
                <p className="text-xs text-gray-400 font-serif italic mt-1 tracking-wide sm:hidden">
                  Since 2000
                </p>

                {/* Responsive Decorative Elements */}
                <div className="flex items-center justify-center mt-2 gap-1 sm:gap-2">
                  <div className="h-px w-4 sm:w-6 lg:w-8 bg-gradient-to-r from-transparent to-yellow-500"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <div className="h-px w-4 sm:w-6 lg:w-8 bg-gradient-to-l from-transparent to-yellow-500"></div>
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
            {/* Weather Widget for Mobile */}
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-yellow-400" />
                  <span className="text-sm text-gray-400">Iloilo City</span>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold">
                    {weather.loading
                      ? "Loading..."
                      : getTemperatureDisplay(weather.temperature)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {weather.loading ? "" : weather.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-4 mb-6">
              <Link
                href="/"
                className="block py-3 px-4 text-yellow-400 font-serif font-bold text-lg border-b border-yellow-500/30 bg-yellow-500/5 rounded-lg"
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
                  className="block py-3 px-4 text-gray-300 hover:text-yellow-400 font-serif font-medium transition-colors duration-200 border-b border-gray-800 hover:bg-yellow-500/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Mobile User Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
              <button className="flex items-center justify-center gap-2 border border-yellow-500/50 text-yellow-400 font-bold py-3 px-4 rounded-lg font-serif transition-all duration-300 hover:bg-yellow-500/10">
                <Bell size={16} />
                Alerts
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-600 text-gray-300 font-bold py-3 px-4 rounded-lg font-serif transition-all duration-300 hover:bg-gray-700/50">
                <User size={16} />
                Sign In
              </button>
            </div>

            {/* Mobile Breaking News */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm font-serif">
                  BREAKING NEWS
                </span>
              </div>
              <p className="text-white text-sm">
                Local Election Results Tonight
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
