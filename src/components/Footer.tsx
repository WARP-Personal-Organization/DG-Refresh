import { Facebook, Instagram, Mail, MapPin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CATEGORIES = [
  {
    name: "News",
    href: "/news",
    dropdown: [
      { name: "LOCAL", href: "/news/local" },
      { name: "FACTS FIRST PH", href: "/news/facts-first-ph" },
      { name: "CAPIZ", href: "/news/capiz" },
      { name: "NEGROS", href: "/news/negros" },
    ],
  },
  {
    name: "Feature",
    href: "/feature",
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
    name: "Opinion",
    href: "/opinion",
    dropdown: [{ name: "EDITORIAL", href: "/opinion/editorial" }],
  },
  {
    name: "Initiatives",
    href: "/initiatives",
    dropdown: [
      { name: "FASHION FRIDAYS", href: "/initiatives/fashion-fridays" },
      { name: "EMPOWER", href: "/initiatives/empower" },
      {
        name: "GLOBAL SHAPERS ILOILO",
        href: "/initiatives/global-shapers-iloilo",
      },
      { name: "ZERO DAY", href: "/initiatives/zero-day" },
    ],
  },
  {
    name: "Sports",
    href: "/sports",
    // No sub-links: the two that were here ("local-news", "national-news")
    // resolved to general news listings, not sport. The nav has no Sports
    // dropdown either. Restore with real slugs if sports subcategories exist.
    dropdown: [],
  },
  {
    name: "Business",
    href: "/business",
    dropdown: [
      { name: "MOTORING", href: "/business/motoring" },
      { name: "TECH TALK", href: "/business/tech-talk" },
    ],
  },
  {
    name: "Others",
    href: "/about-us",
    dropdown: [
      { name: "ABOUT US", href: "/about-us" },
      { name: "CONTACT US", href: "/contact-us" },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-accent/20 font-sans">
      {/* Categories Section */}
      <div className="border-b border-default">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="space-y-3">
                <Link
                  href={category.href}
                  className="block text-foreground font-roboto font-bold text-sm uppercase hover:text-accent transition-colors duration-200"
                >
                  {category.name}
                </Link>
                <div className="space-y-2">
                  {category.dropdown.map((subcategory) => (
                    <Link
                      key={subcategory.name}
                      href={subcategory.href}
                      className="block text-gray-400 hover:text-accent transition-colors duration-200 text-xs"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content — 3-column balance: brand · contact · social */}
      <div className="bg-accent px-4 py-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <Link href="/" className="inline-block justify-self-center md:justify-self-start">
            <Image
              src="/black_dg.png"
              alt="Daily Guardian"
              width={536}
              height={128}
              className="h-20 w-auto"
            />
          </Link>

          {/* Tagline + contact */}
          <div className="text-center text-background space-y-2">
            <p className="font-roboto font-bold text-sm uppercase tracking-[0.3em]">
              We Write &middot; You Decide
            </p>
            <p className="text-xs flex items-center justify-center gap-2 font-open-sans">
              <MapPin size={12} /> Iloilo City, Philippines
            </p>
            <a
              href="mailto:dailyguardian@dailyguardian.com.ph"
              className="text-xs flex items-center justify-center gap-2 font-open-sans hover:underline"
            >
              <Mail size={12} /> dailyguardian@dailyguardian.com.ph
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3 justify-self-center md:justify-self-end">
            <Link
              href="https://www.facebook.com/DailyGuardianPH/"
              className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-gray-400 group-hover:text-background" />
            </Link>
            <Link
              href="https://x.com/dailyguardianph"
              className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
              aria-label="X (Twitter)"
            >
              <Twitter size={18} className="text-gray-400 group-hover:text-background" />
            </Link>
            <Link
              href="https://www.instagram.com/dailyguardianph"
              className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-gray-400 group-hover:text-background" />
            </Link>
            <Link
              href="https://youtube.com/dailyguardian"
              className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
              aria-label="YouTube"
            >
              <Youtube size={18} className="text-gray-400 group-hover:text-background" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-default">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Daily Guardian. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {/* /privacy is not a route on this site — the page is /Policies.
                  As a single unknown segment it was being taken for a legacy
                  article URL and redirected into /blog/privacy, which 404s. */}
              <Link
                href="/Policies"
                className="text-gray-500 hover:text-accent transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
