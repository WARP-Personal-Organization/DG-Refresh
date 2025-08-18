'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = ["Home", "World", "UK", "Companies", "Markets", "Opinion", "Work & Careers", "Life & Arts"];

const NavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black text-white border-t border-b border-yellow-500/30 relative">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-center space-x-8 text-sm">
          {navLinks.map((link, index) => (
            <li key={link}>
              <a 
                href="#" 
                className={`
                  py-2 px-1 font-serif font-medium tracking-wider transition-all duration-300 hover:text-yellow-400
                  ${index === 0 
                    ? 'border-b-2 border-yellow-500 text-yellow-500' 
                    : 'text-white hover:text-yellow-300'
                  }
                `}
              >
                {link.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="text-yellow-500 font-serif font-bold text-lg tracking-wider">
            NEWS
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200 p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="transform transition-transform duration-200" />
            ) : (
              <Menu size={24} className="transform transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-black via-gray-950 to-black border-l border-yellow-500/30 transform transition-transform duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/30">
          <span className="text-yellow-500 font-serif font-bold text-xl tracking-wider">
            NAVIGATION
          </span>
          <button
            onClick={closeMobileMenu}
            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="py-4">
          <ul className="space-y-0">
            {navLinks.map((link, index) => (
              <li key={link}>
                <a 
                  href="#"
                  onClick={closeMobileMenu}
                  className={`
                    block px-6 py-4 font-serif font-medium tracking-wider transition-all duration-200 border-l-4 border-transparent
                    ${index === 0 
                      ? 'bg-yellow-500/10 border-l-yellow-500 text-yellow-500' 
                      : 'text-gray-200 hover:bg-yellow-500/5 hover:border-l-yellow-400 hover:text-yellow-300'
                    }
                  `}
                >
                  {link.toUpperCase()}
                  
                  {/* Active indicator dot */}
                  {index === 0 && (
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Footer */}
          <div className="mt-8 px-6 py-4 border-t border-yellow-500/20">
            <p className="text-xs text-gray-400 font-serif">
              Stay informed with the latest news
            </p>
            <div className="flex space-x-1 mt-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
              <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;