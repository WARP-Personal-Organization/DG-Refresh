'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

// Navigation structure with dropdown items - Updated for category pages
const navigationData = [
  {
    name: "News",
    href: "/news",        // Links to category page
    dropdown: [
      { name: "#PinoyVote2025", href: "/news/PinoyVote2025" },
      { name: "CAPIZ", href: "/news/CAPIZ" },
      { name: "FACTS FIRST PH", href: "/news/FACTS_FIRST_PH" },
      { name: "LOCAL NEWS", href: "/news/LOCAL_NEWS" },
      { name: "NATION", href: "/news/NATION" },
      { name: "NEGROS", href: "/news/NEGROS" }
    ]
  },
  {
    name: "Opinion",
    href: "/opinion",     // Links to category page
  },
  {
    name: "Business",
    href: "/business",    // Links to category page
    dropdown: [
      { name: "MONITORING", href: "/business/MONITORING" },
      { name: "TECH TALK", href: "/business/TECH_TALK" },
    ]
  },
  {
    name: "Sports",
    href: "/sports",      // Links to category page
  },
  {
    name: "Features",
    href: "/features",    // Links to category page
    dropdown: [
      { name: "ARTS AND CULTURE", href: "/features/ARTS_AND_CULTURE" },
      { name: "DOUBLE TEAM", href: "/features/DOUBLE_TEAM" },
      { name: "EDUCATION", href: "/features/EDUCATION" },
      { name: "ENTERTAINMENT", href: "/features/ENTERTAINMENT" },
      { name: "ENVIRONMENT", href: "/features/ENVIRONMENT" },
      { name: "EVENTS", href: "/features/EVENTS" },
    ]
  },
  {
    name: "Initiative",
    href: "/initiative", 
  },
  {
    name: "Policies", 
    href: "/policies",    
  },
  {
    name: "Others",
    href: "/others",      
  }
];

const NavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileExpandedItems(new Set());
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileExpandedItems(new Set());
  };

  const handleDropdownEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileDropdown = (name: string) => {
    const newExpanded = new Set(mobileExpandedItems);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setMobileExpandedItems(newExpanded);
  };

  return (
    <nav className="bg-black text-white border-t border-b border-yellow-500/30 relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex z-20 justify-center space-x-8 text-sm relative">
          {navigationData.map((item, index) => (
            <li 
              key={item.name} 
              className="relative group"
              onMouseEnter={() => handleDropdownEnter(item.name)}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center gap-1 py-2 px-1 font-serif font-medium tracking-wider transition-all duration-300 hover:text-yellow-400
                `}
              >
                {item.name.toUpperCase()}
       {item.dropdown && (
                <ChevronDown 
                    size={12} 
                    className={`transition-transform duration-200 ${
                    activeDropdown === item.name ? 'rotate-180' : ''
                    }`}
                />
                )}

              </Link>

              {/* Desktop Dropdown */}
              {item.dropdown && (
              <div 
                className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 
                  bg-black border-2 border-yellow-500/30 rounded-lg shadow-xl shadow-yellow-500/10
                  transition-all duration-300 ease-out group
                  ${activeDropdown === item.name 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                  }
                `}
              >
                {/* Gold accent line - appears on hover */}
                <div className="h-0 group-hover:h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-t-md transition-all duration-300 ease-out"></div>
                
                <div className="py-2">
               {item.dropdown && item.dropdown.map((dropdownItem) => (

                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      className="block px-4 py-3 text-sm font-serif text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all duration-200 border-l-4 border-transparent hover:border-yellow-500/50"
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>

                {/* Bottom accent */}
                <div className="px-4 py-2 border-t border-yellow-500/20 bg-yellow-500/5">
                  <Link 
                    href={item.href}
                    className="text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
                  >
                    View All {item.name} →
                  </Link>
                </div>
              </div>
              )}
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
          md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-yellow-500/30 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/30 sticky top-0 bg-black">
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
            {navigationData.map((item, index) => (
              <li key={item.name}>
                {/* Main Menu Item */}
                <div 
                  className={`
                    flex items-center justify-between px-6 py-4 font-serif font-medium tracking-wider transition-all duration-200 border-l-4 border-transparent cursor-pointer
                    ${index === 0 
                      ? 'bg-yellow-500/10 border-l-yellow-500 text-yellow-500' 
                      : 'text-gray-200 hover:bg-yellow-500/5 hover:border-l-yellow-400 hover:text-yellow-300'
                    }
                  `}
                  onClick={() => toggleMobileDropdown(item.name)}
                >
                  <span className="flex items-center">
                    {item.name.toUpperCase()}
                    {/* Active indicator dot */}
                    {index === 0 && (
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                    )}
                  </span>
                  
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      mobileExpandedItems.has(item.name) ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* Mobile Dropdown Items */}
                {item.dropdown && (
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out bg-gray-950/50
                    ${mobileExpandedItems.has(item.name) 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                    }
                  `}
                >
              {item.dropdown && item.dropdown.map((dropdownItem) => (

                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      onClick={closeMobileMenu}
                      className="block px-10 py-3 text-sm font-serif text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all duration-200 border-l-4 border-transparent hover:border-yellow-500/30"
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                  
                  {/* View All Link */}
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block px-10 py-3 text-xs font-serif text-yellow-400 hover:text-yellow-300 border-t border-yellow-500/20 bg-yellow-500/5 transition-colors duration-200"
                  >
                    View All {item.name} →
                  </Link>
                </div>
                )}
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