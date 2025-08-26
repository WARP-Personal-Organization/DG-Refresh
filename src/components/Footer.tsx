import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#fcee16]/20 font-open-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/dg-logo.png"
                alt="Daily Guardian"
                className="h-16 w-auto"
              />
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm max-w-md">
              The Daily Guardian is Iloilo&apos;s trusted source for local news,
              serving Western Visayas with award-winning journalism since 2000.
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-roboto font-semibold">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                <Link
                  href="https://facebook.com/dailyguardian"
                  className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Facebook"
                >
                  <Facebook
                    size={18}
                    className="text-gray-400 group-hover:text-[#1b1a1b]"
                  />
                </Link>
                <Link
                  href="https://twitter.com/dailyguardian"
                  className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Twitter"
                >
                  <Twitter
                    size={18}
                    className="text-gray-400 group-hover:text-[#1b1a1b]"
                  />
                </Link>
                <Link
                  href="https://instagram.com/dailyguardian"
                  className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="Instagram"
                >
                  <Instagram
                    size={18}
                    className="text-gray-400 group-hover:text-[#1b1a1b]"
                  />
                </Link>
                <Link
                  href="https://youtube.com/dailyguardian"
                  className="w-9 h-9 bg-gray-800 hover:bg-[#fcee16] rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label="YouTube"
                >
                  <Youtube
                    size={18}
                    className="text-gray-400 group-hover:text-[#1b1a1b]"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-roboto font-semibold text-lg">
              Quick Links
            </h4>
            <div className="space-y-2">
              {[
                { name: "Local News", href: "/news" },
                { name: "Sports", href: "/sports" },
                { name: "Business", href: "/business" },
                { name: "Opinion", href: "/opinion" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200 group text-sm"
                >
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-roboto font-semibold text-lg">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin
                  size={16}
                  className="text-[#fcee16] mt-0.5 flex-shrink-0"
                />
                <div>
                  <p>Iloilo City, Philippines</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={16} className="text-[#fcee16] flex-shrink-0" />
                <span>+63 33 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={16} className="text-[#fcee16] flex-shrink-0" />
                <span>news@dailyguardian.com.ph</span>
              </div>
            </div>
          </div>
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
                className="text-gray-500 hover:text-[#fcee16] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-[#fcee16] transition-colors duration-200"
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
