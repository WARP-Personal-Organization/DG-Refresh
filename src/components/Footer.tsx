import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    {
      name: "News",
      href: "/news",
      dropdown: [
        { name: "LOCAL", href: "/subcategory/local" },
        { name: "FACT FIRST PH", href: "/subcategory/fact-first-ph" },
        { name: "CAPIZ", href: "/subcategory/capiz" },
        { name: "NEGROS", href: "/subcategory/negros" },
      ],
    },
    {
      name: "Feature",
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
      name: "Opinion",
      href: "/opinion",
      dropdown: [{ name: "EDITORIAL", href: "/subcategory/editorial" }],
    },
    {
      name: "Initiatives",
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
      name: "Sports",
      href: "/sports",
      dropdown: [
        { name: "LOCAL NEWS", href: "/subcategory/local-news" },
        { name: "NATIONAL NEWS", href: "/subcategory/national-news" },
      ],
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
      name: "Other Pages",
      href: "/other-pages",
      dropdown: [
        { name: "ABOUT US", href: "/subcategory/about-us" },
        { name: "CONTACT US", href: "/subcategory/contact-us" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-accent/20 font-sans">
      {/* Categories Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
            {categories.map((category) => (
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

      {/* Main Footer Content */}
      <div className="w-full mx-auto px-4 py-12 text-center">
        <div className="">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/dg-logo.png"
                alt="Daily Guardian"
                className="h-16 w-auto"
              />
            </Link>

            <div className="max-w-full">
              <p className="text-gray-300 leading-relaxed text-base">
                The Daily Guardian is a renascent Iloilo-based publishing firm
                and media outfit with bureaus in Kalibo, Boracay, Roxas,
                Bacolod, Antique, Guimaras, and Manila. Led by Iloilo&apos;s
                most respected journalists, the Daily Guardian pledges to tell
                the Ilonggo story as seen through the various lenses of society
                so that every side may be told.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-foreground font-roboto font-semibold">
                Follow Daily Guardian
                <div className="flex items-center gap-3">
                  <Link
                    href="https://facebook.com/dailyguardian"
                    className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
                    aria-label="Facebook"
                  >
                    <Facebook
                      size={18}
                      className="text-gray-400 group-hover:text-background"
                    />
                  </Link>
                  <Link
                    href="https://twitter.com/dailyguardian"
                    className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
                    aria-label="Twitter"
                  >
                    <Twitter
                      size={18}
                      className="text-gray-400 group-hover:text-background"
                    />
                  </Link>
                  <Link
                    href="https://instagram.com/dailyguardian"
                    className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
                    aria-label="Instagram"
                  >
                    <Instagram
                      size={18}
                      className="text-gray-400 group-hover:text-background"
                    />
                  </Link>
                  <Link
                    href="https://youtube.com/dailyguardian"
                    className="w-9 h-9 bg-gray-800 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
                    aria-label="YouTube"
                  >
                    <Youtube
                      size={18}
                      className="text-gray-400 group-hover:text-background"
                    />
                  </Link>
                </div>
              </h4>
            </div>
          </div>

          {/* Quick Links */}
          {/* Contact Info */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Daily Guardian. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-accent transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-accent transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
