"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// Updated navigation structure with correct routing hierarchy
const navigationData = [
  {
    name: "News",
    href: "/news",
    dropdown: [
      { name: "LOCAL", href: "/subcategory/local" },
      { name: "FACTS FIRST PH", href: "/subcategory/fact-first-ph" },
      { name: "CAPIZ", href: "/subcategory/capiz" },
      { name: "NEGROS", href: "/subcategory/negros" },
    ],
  },
  {
    name: "Opinion",
    href: "/opinion",
  },
  {
    name: "Business",
    href: "/business",
    dropdown: [
      { name: "MONITORING", href: "/subcategory/monitoring" },
      { name: "TECH TALK", href: "/subcategory/tech-talk" },
    ],
  },
  {
    name: "Sports",
    href: "/sports",
    dropdown: [
      { name: "LOCAL NEWS", href: "/subcategory/local-news" },
      { name: "NATIONAL NEWS", href: "/subcategory/national-news" },
    ],
  },
  {
    name: "Features",
    href: "/feature",
    dropdown: [
      { name: "HEALTH", href: "/subcategory/health" },
      { name: "TRAVEL", href: "/subcategory/travel" },
      { name: "ENTERTAINMENT", href: "/subcategory/entertainment" },
      { name: "LIFESTYLE", href: "/subcategory/lifestyle" },
      { name: "ARTS AND CULTURE", href: "/subcategory/arts-and-culture" },
      { name: "EDUCATION", href: "/subcategory/education" },
      { name: "ENVIRONMENT", href: "/subcategory/environment" },
    ],
  },
  {
    name: "Initiative",
    href: "/initiatives",
    dropdown: [
      { name: "FASHION FRIDAYS", href: "/subcategory/fashion-fridays" },
      { name: "EMPOWER", href: "/subcategory/empower" },
      {
        name: "GLOBAL SHAPERS ILOILO",
        href: "/subcategory/global-shapers-iloilo",
      },
      { name: "ZERO DAY", href: "/subcategory/zero-day" },
    ],
  },
  {
    name: "Policies",
    href: "/Policies",
  },
  {
    name: "Others",
    href: "/other-pages",
    dropdown: [
      { name: "ABOUT US", href: "/subcategory/about-us" },
      { name: "CONTACT US", href: "/subcategory/contact-us" },
    ],
  },
];

const NavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(
    new Set()
  );

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
    <nav className="bg-[#1a1a1a] text-white border-t border-b border-[#ffe600]/30 relative font-open-sans">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex z-20 justify-center space-x-12 text-sm relative">
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
                  flex items-center gap-1 py-2 px-3 font-roboto font-medium tracking-wider transition-all duration-300 hover:text-[#ffe600]
                `}
              >
                {item.name.toUpperCase()}
                {item.dropdown && (
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>

              {/* Desktop Dropdown */}
              {item.dropdown && (
                <div
                  className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 
                  bg-[#1a1a1a] border-2 border-[#ffe600] rounded-lg shadow-xl shadow-[#ffe600]/20
                  transition-all duration-300 ease-out group
                  ${
                    activeDropdown === item.name
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }
                `}
                >
                  {/* Gold accent line - appears on hover */}
                  <div className="h-0 group-hover:h-1 bg-[#ffe600] rounded-t-md transition-all duration-300 ease-out"></div>

                  {/* Scrollable dropdown content */}
                  <div
                    className={`py-2 ${
                      item.name === "Feature"
                        ? "max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#ffe600] scrollbar-track-gray-800 hover:scrollbar-thumb-[#ffe600]/80"
                        : ""
                    }`}
                  >
                    {/* Scroll indicator for Feature dropdown */}
                    {item.name === "Feature" && (
                      <div className="px-4 py-2 border-b border-[#ffe600]/20 bg-[#ffe600]/5 sticky top-0 z-10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#ffe600] font-medium font-open-sans">
                            {item.dropdown?.length} subcategories
                          </span>
                          <span className="text-gray-400 flex items-center gap-1 font-open-sans">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Scroll
                          </span>
                        </div>
                      </div>
                    )}

                    {item.dropdown &&
                      item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-sm font-open-sans text-gray-300 hover:text-[#ffe600] hover:bg-[#ffe600]/5 transition-all duration-200 border-l-4 border-transparent hover:border-[#ffe600]/50"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                  </div>

                  {/* Bottom accent */}
                  <div className="px-4 py-2 border-t border-[#ffe600]/20 bg-[#ffe600]/5 sticky bottom-0">
                    <Link
                      href={item.href}
                      className="text-xs text-[#ffe600] hover:text-[#ffe600]/80 font-medium transition-colors duration-200 font-open-sans"
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
          <div className="text-[#ffe600] font-roboto font-bold text-lg tracking-wider">
            MENU
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-[#ffe600] hover:text-[#ffe600]/80 transition-colors duration-200 p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X
                size={24}
                className="transform transition-transform duration-200"
              />
            ) : (
              <Menu
                size={24}
                className="transform transition-transform duration-200"
              />
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
          md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#1a1a1a] border-l border-[#ffe600]/30 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#ffe600]/30 sticky top-0 bg-[#1a1a1a]">
          <span className="text-[#ffe600] font-roboto font-bold text-xl tracking-wider">
            NAVIGATION
          </span>
          <button
            onClick={closeMobileMenu}
            className="text-[#ffe600] hover:text-[#ffe600]/80 transition-colors duration-200 p-1"
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
                <div className="flex items-center justify-between px-6 py-4">
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`
                      flex-1 font-roboto font-medium tracking-wider transition-all duration-200 border-l-4 border-transparent
                      ${
                        index === 0
                          ? "text-[#ffe600]"
                          : "text-gray-200 hover:text-[#ffe600]"
                      }
                    `}
                  >
                    <span className="flex items-center">
                      {item.name.toUpperCase()}
                      {/* Active indicator dot */}
                      {index === 0 && (
                        <span className="inline-block w-2 h-2 bg-[#ffe600] rounded-full ml-2"></span>
                      )}
                    </span>
                  </Link>

                  {/* Dropdown Toggle */}
                  {item.dropdown && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileDropdown(item.name);
                      }}
                      className="p-2 text-gray-400 hover:text-[#ffe600] transition-colors duration-200"
                    >
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          mobileExpandedItems.has(item.name) ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Items */}
                {item.dropdown && (
                  <div
                    className={`
                    overflow-hidden transition-all duration-300 ease-in-out bg-gray-950/50
                    ${
                      mobileExpandedItems.has(item.name)
                        ? item.name === "Feature"
                          ? "max-h-80 opacity-100"
                          : "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }
                  `}
                  >
                    {/* Mobile scroll indicator for Feature */}
                    {item.name === "Feature" &&
                      mobileExpandedItems.has(item.name) && (
                        <div className="px-10 py-2 border-b border-[#ffe600]/20 bg-[#ffe600]/5 sticky top-0 z-10">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#ffe600] font-medium font-open-sans">
                              {item.dropdown?.length} items
                            </span>
                            <span className="text-gray-400 flex items-center gap-1 font-open-sans">
                              <svg
                                className="w-3 h-3 animate-bounce"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Swipe to scroll
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Scrollable content for Feature category */}
                    <div
                      className={
                        item.name === "Feature"
                          ? "max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#ffe600] scrollbar-track-gray-800"
                          : ""
                      }
                    >
                      {item.dropdown &&
                        item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={closeMobileMenu}
                            className="block px-10 py-3 text-sm font-open-sans text-gray-400 hover:text-[#ffe600] hover:bg-[#ffe600]/5 transition-all duration-200 border-l-4 border-transparent hover:border-[#ffe600]/30"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                    </div>

                    {/* View All Link - sticky at bottom */}
                    <div className="sticky bottom-0 bg-gray-950/50 border-t border-[#ffe600]/20">
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block px-10 py-3 text-xs font-open-sans text-[#ffe600] hover:text-[#ffe600]/80 bg-[#ffe600]/5 transition-colors duration-200"
                      >
                        View All {item.name} →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Footer */}
          <div className="mt-8 px-6 py-4 border-t border-[#ffe600]/20">
            <p className="text-xs text-gray-400 font-open-sans">
              Stay informed with the latest news
            </p>
            <div className="flex space-x-1 mt-2">
              <div className="w-1 h-1 bg-[#ffe600] rounded-full"></div>
              <div className="w-1 h-1 bg-[#ffe600]/80 rounded-full"></div>
              <div className="w-1 h-1 bg-[#ffe600]/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
