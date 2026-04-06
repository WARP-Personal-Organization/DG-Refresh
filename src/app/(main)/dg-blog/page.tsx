import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Car,
  Zap,
  Award,
} from "lucide-react";

const DGDriveFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20">
          <Car className="w-32 h-32" />
        </div>
        <div className="absolute top-40 right-40">
          <Zap className="w-24 h-24" />
        </div>
        <div className="absolute bottom-20 left-1/3">
          <Award className="w-28 h-28" />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-4xl font-black text-black mb-4">
              STAY IN THE FAST LANE
            </h3>
            <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
              Get exclusive automotive insights, latest reviews, and industry
              news delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg w-full sm:w-auto"
              />
              <button className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                DG-DRIVE
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Premium automotive content platform delivering cutting-edge
                reviews, industry insights, and the latest in automotive
                innovation.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                >
                  <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 relative">
              QUICK LINKS
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-yellow-500"></div>
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Latest Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Electric Vehicles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Luxury Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Performance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Industry News
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 relative">
              CATEGORIES
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-yellow-500"></div>
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Supercars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Classic Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Motorcycles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Concept Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Tech Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Buying Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 relative">
              CONTACT
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-yellow-500"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">
                    123 Automotive Boulevard
                    <br />
                    Detroit, MI 48201
                    <br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a
                  href="mailto:info@dg-drive.com"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  info@dg-drive.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400 mb-2">
                250K+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Monthly Readers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400 mb-2">
                1,200+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Car Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400 mb-2">
                50+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Expert Writers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400 mb-2">5+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 DG-DRIVE. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DGDriveFooter;
