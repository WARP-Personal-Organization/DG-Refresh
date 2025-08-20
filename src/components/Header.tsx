"use client"


import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, User, Bell, Search, X, MapPin, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b-2 border-yellow-500/30 shadow-xl relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar with Date and Weather - Enhanced Responsive */}
        <div className="hidden lg:flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-3 text-gray-400">
            <time className="font-medium flex items-center gap-2">
              <Calendar size={12} className="text-yellow-400" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span className="text-gray-600">|</span>
            <span className="text-yellow-400 flex items-center gap-1">
              <MapPin size={12} />
              72°F Partly Cloudy
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <span className="font-semibold">Breaking News</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Local Election Results Tonight</span>
          </div>
        </div>

        {/* Mobile Top Bar - Simplified */}
        <div className="lg:hidden flex justify-between items-center py-2 px-4 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={10} className="text-yellow-400" />
            <time className="font-medium">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-xs font-medium truncate max-w-32">Breaking News</span>
          </div>
        </div>

        {/* Main Header - Enhanced Responsive Layout */}
        <div className="flex justify-between items-center py-4 lg:py-6 px-4">
          {/* Left Section - Responsive */}
          <div className="flex-1 flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <button className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 group">
              <Search size={18} className="group-hover:scale-110 transition-transform duration-200" />
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
                  Since 1985
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
            {/* Notifications (Tablet and Desktop) */}
            <button className="hidden md:flex relative text-gray-300 hover:text-yellow-400 transition-colors duration-200 group p-2">
              <Bell size={18} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Subscribe Button - Responsive */}
            {/* <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-3 sm:px-4 lg:px-6 rounded-lg font-serif text-xs sm:text-sm lg:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 whitespace-nowrap">
              <span className="hidden sm:inline">Subscribe</span>
              <span className="sm:hidden">Sub</span>
            </button>
             */}
            {/* Sign In Button - Responsive */}
            {/* <button className="hidden md:flex items-center gap-2 text-gray-300 hover:text-yellow-400 font-medium transition-all duration-200 group border border-gray-700 hover:border-yellow-500/50 px-3 lg:px-4 py-2 rounded-lg">
              <User size={16} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-serif text-sm lg:text-base">Sign In</span>
            </button> */}

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
            {/* Mobile Navigation Links */}
            <nav className="space-y-4 mb-6">
              <Link 
                href="/" 
                className="block py-3 px-4 text-yellow-400 font-serif font-bold text-lg border-b border-yellow-500/30 bg-yellow-500/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {['Local News', 'Sports', 'Business', 'Opinion', 'Community', 'Events'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="block py-3 px-4 text-gray-300 hover:text-yellow-400 font-serif font-medium transition-colors duration-200 border-b border-gray-800 hover:bg-yellow-500/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Mobile User Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
              {/* <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-4 rounded-lg font-serif transition-all duration-300">
                <User size={16} />
                Sign In
              </button>
               */}
              <button className="flex items-center justify-center gap-2 border border-yellow-500/50 text-yellow-400 font-bold py-3 px-4 rounded-lg font-serif transition-all duration-300 hover:bg-yellow-500/10">
                <Bell size={16} />
                Alerts
              </button>
            </div>

            {/* Mobile Breaking News */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm font-serif">BREAKING NEWS</span>
              </div>
              <p className="text-white text-sm">Local Election Results Tonight</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;