"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import type { Post } from "../../lib/wordpress";

const navigationData = [
  {
    name: "News",
    href: "/news",
    categoryKeywords: ["local", "news", "national", "negros", "capiz", "facts"],
    dropdown: [
      { name: "LOCAL", href: "/news/local" },
      { name: "FACTS FIRST PH", href: "/news/facts-first-ph" },
      { name: "CAPIZ", href: "/news/capiz" },
      { name: "NEGROS", href: "/news/negros" },
    ],
  },
  {
    name: "Voices",
    href: "/opinion",
    categoryKeywords: ["opinion", "voices", "editorial"],
  },
  {
    name: "Business",
    href: "/business",
    categoryKeywords: ["business", "motoring", "tech"],
    dropdown: [
      { name: "MOTORING", href: "/business/motoring" },
      { name: "TECH TALK", href: "/business/tech-talk" },
    ],
  },
  {
    name: "Sports",
    href: "/sports",
    categoryKeywords: ["sports"],
  },
  {
    name: "Features",
    href: "/feature",
    categoryKeywords: ["feature", "entertainment", "lifestyle", "health", "travel", "arts", "education", "environment"],
    dropdown: [
      { name: "HEALTH", href: "/feature/health" },
      { name: "TRAVEL", href: "/feature/travel" },
      { name: "ENTERTAINMENT", href: "/feature/entertainment" },
      { name: "LIFESTYLE", href: "/feature/lifestyle" },
      { name: "ARTS AND CULTURE", href: "/feature/arts-and-culture" },
      { name: "EDUCATION", href: "/feature/education" },
      { name: "ENVIRONMENT", href: "/feature/environment" },
    ],
  },
  {
    name: "Initiative",
    href: "/initiatives",
    categoryKeywords: ["initiative", "fashion", "empower", "global shapers", "zero day"],
    dropdown: [
      { name: "FASHION FRIDAYS", href: "/initiatives/fashion-fridays" },
      { name: "EMPOWER", href: "/initiatives/empower" },
      { name: "GLOBAL SHAPERS ILOILO", href: "/initiatives/global-shapers-iloilo" },
      { name: "ZERO DAY", href: "/initiatives/zero-day" },
    ],
  },
  {
    name: "Policies",
    href: "/Policies",
    categoryKeywords: ["polic"],
    megaMenu: false,
  },
  {
    name: "Others",
    href: "/other-pages",
    categoryKeywords: [],
    megaMenu: false,
    dropdown: [
      { name: "ABOUT US", href: "/about-us" },
      { name: "CONTACT US", href: "/contact-us" },
    ],
  },
];

interface NavProps {
  navPosts?: Post[];
}

const NavigationBar: React.FC<NavProps> = ({ navPosts = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileExpandedItems(new Set());
  };

  const toggleMobileDropdown = (name: string) => {
    const next = new Set(mobileExpandedItems);
    next.has(name) ? next.delete(name) : next.add(name);
    setMobileExpandedItems(next);
  };

  const getPostsForCategory = (keywords: string[]) => {
    if (!keywords.length) return navPosts.slice(0, 4);
    return navPosts
      .filter((p) =>
        keywords.some((kw) =>
          p.data.category?.toLowerCase().includes(kw) ||
          p.data.subcategory?.toLowerCase().includes(kw)
        )
      )
      .slice(0, 4);
  };

  const activeItem = navigationData.find((i) => i.name === activeDropdown);
  const previewPosts = activeItem ? getPostsForCategory(activeItem.categoryKeywords ?? []) : [];

  return (
    <nav
      className="bg-[#1a1a1a] text-white relative z-30 font-open-sans border-t border-b border-[#ffe600]/30"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* ── DESKTOP NAV BAR ─────────────────────────────── */}
        <ul className="hidden md:flex z-20 justify-center space-x-12 text-xs relative">
          {navigationData.map((item) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => item.megaMenu === false && setActiveDropdown(null)}
            >
              {item.href === "/other-pages" ? (
                <span className="flex items-center gap-1 py-2 px-3 font-roboto font-medium tracking-wider transition-all duration-300 hover:text-[#ffe600] cursor-default">
                  {item.name.toUpperCase()}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 py-2 px-3 font-roboto font-medium tracking-wider transition-all duration-300 hover:text-[#ffe600]"
                >
                  {item.name.toUpperCase()}
                  {item.dropdown && (
                    <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                  )}
                </Link>
              )}

              {/* Old-style small dropdown for Policies / Others */}
              {item.megaMenu === false && item.dropdown && (
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#1a1a1a] border-2 border-[#ffe600] rounded-lg shadow-xl shadow-[#ffe600]/20 z-50 transition-all duration-300 ${
                    activeDropdown === item.name
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="py-2">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-4 py-3 text-sm font-open-sans text-gray-300 hover:text-[#ffe600] hover:bg-[#ffe600]/5 transition-all duration-200 border-l-4 border-transparent hover:border-[#ffe600]/50"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* ── MOBILE HEADER ───────────────────────────────── */}
        <div className="md:hidden flex items-center justify-between py-3">
          <span className="text-[#fcee16] font-black text-sm tracking-widest uppercase">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#fcee16] p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── MEGA DROPDOWN PANEL ─────────────────────────────
          Positioned below the nav bar, full container width   */}
      {activeItem && activeItem.megaMenu !== false && (
        <div
          className={`hidden md:block absolute top-full left-0 right-0 bg-[#0d0d0d] border-b border-white/10 shadow-2xl transition-all duration-200 ${
            activeDropdown ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onMouseEnter={() => setActiveDropdown(activeItem.name)}
        >
          {/* Yellow accent line */}
          <div className="h-[2px] bg-[#fcee16]" />

          <div className="max-w-7xl mx-auto px-4 py-6 flex gap-0">

            {/* LEFT — subcategory links */}
            {activeItem.dropdown && (
              <div className="w-52 flex-shrink-0 border-r border-white/8 pr-6 mr-6">
                <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#fcee16]/50 mb-3">
                  {activeItem.name}
                </p>
                <div className="flex flex-col gap-0">
                  {activeItem.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block py-2.5 text-[11px] font-black tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/8">
                  <Link
                    href={activeItem.href}
                    className="text-[11px] font-black tracking-widest uppercase text-[#fcee16] hover:text-[#fcee16]/70 transition-colors"
                  >
                    View All {activeItem.name} →
                  </Link>
                </div>
              </div>
            )}

            {/* RIGHT — article preview cards */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              {previewPosts.length > 0 ? previewPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.uid}`} className="group block">
                  <article>
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#1b1a1b] mb-2">
                      {post.data.featured_image?.url ? (
                        <Image
                          src={post.data.featured_image.url}
                          alt={post.data.featured_image.alt || post.data.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1280px) 25vw, 280px"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1b1a1b]" />
                      )}
                      {/* Category badge */}
                      {post.data.category && (
                        <span className="absolute bottom-0 left-0 bg-black/80 text-white text-[9px] font-black tracking-widest uppercase px-2 py-1">
                          {post.data.category}
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <h4 className="text-[12px] font-bold text-white/80 group-hover:text-white leading-snug transition-colors line-clamp-2">
                      {post.data.title}
                    </h4>
                  </article>
                </Link>
              )) : (
                // Placeholder skeletons when no posts match
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse" />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE OVERLAY ──────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={closeMobileMenu} />
      )}

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-[#0d0d0d] border-l border-white/10 z-50 overflow-y-auto transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-[#0d0d0d]">
          <span className="text-[#fcee16] font-black tracking-widest text-xs uppercase">Daily Guardian</span>
          <button onClick={closeMobileMenu} className="text-white/50 hover:text-[#fcee16] transition-colors">
            <X size={20} />
          </button>
        </div>

        <ul className="py-2">
          {navigationData.map((item) => (
            <li key={item.name} className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex-1 px-5 py-4 text-[11px] font-black tracking-widest uppercase text-white/80 hover:text-[#fcee16] transition-colors"
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="px-4 py-4 text-white/40 hover:text-[#fcee16] transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-200 ${mobileExpandedItems.has(item.name) ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </div>

              {item.dropdown && mobileExpandedItems.has(item.name) && (
                <div className="bg-black/40">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={closeMobileMenu}
                      className="block pl-8 pr-5 py-3 text-[10px] font-black tracking-widest uppercase text-white/50 hover:text-[#fcee16] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block pl-8 pr-5 py-3 text-[10px] font-black tracking-widest uppercase text-[#fcee16] hover:text-[#fcee16]/70 border-t border-white/5 transition-colors"
                  >
                    View All {item.name} →
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
