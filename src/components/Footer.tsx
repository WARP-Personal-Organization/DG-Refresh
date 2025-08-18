import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  Newspaper,
  Award,
  Users
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t-2 border-yellow-500/30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Logo and Description Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-black font-bold text-xl font-serif">D</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-serif">Daily Guardian</h3>
                  <p className="text-yellow-400 text-sm font-medium">Your Local Voice Since 2000</p>
                </div>
              </div>
            </Link>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-sm max-w-2xl">
                The Daily Guardian is a renascent Iloilo-based publishing firm and media outfit with 
                bureaus in Kalibo, Boracay, Roxas, Bacolod, Antique, and Manila. Led by Iloilo&apos;s 
                most respected journalists, the Daily Guardian pledges to tell the Ilonggo story as seen 
                through the various lenses of society so that every side may be told.
              </p>
              
              {/* Awards/Recognition */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Award size={16} />
                  <span className="text-sm font-medium">Award-Winning Journalism</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Users size={16} />
                  <span className="text-sm font-medium">Trusted by 45K+ Readers</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold font-serif">Follow Us</h4>
              <div className="flex items-center gap-3">
                <Link 
                  href="https://facebook.com/dailyguardian" 
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook size={20} className="text-white group-hover:text-white" />
                </Link>
                
                <Link 
                  href="https://twitter.com/dailyguardian" 
                  className="w-10 h-10 bg-gray-800 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group border hover:border-white"
                  aria-label="Twitter/X"
                >
                  <Twitter size={20} className="text-white" />
                </Link>
                
                <Link 
                  href="https://instagram.com/dailyguardian" 
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram size={20} className="text-white" />
                </Link>
                
                <Link 
                  href="https://youtube.com/dailyguardian" 
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label="YouTube"
                >
                  <Youtube size={20} className="text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg font-serif border-b border-yellow-500/30 pb-2">
              Quick Links
            </h4>
            
            <div className="space-y-3">
              {[
                { name: 'Local News', href: '/news' },
                { name: 'Sports', href: '/sports' },
                { name: 'Business', href: '/business' },
                { name: 'Opinion', href: '/opinion' },
                { name: 'Community', href: '/community' },
                { name: 'Events', href: '/events' },
                { name: 'Archives', href: '/archives' },
                { name: 'About Us', href: '/about' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 group text-sm"
                >
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg font-serif border-b border-yellow-500/30 pb-2">
                Contact Us
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Daily Guardian Building</p>
                    <p>Iloilo City, Philippines 5000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone size={16} className="text-yellow-400 flex-shrink-0" />
                  <span>+63 33 123 4567</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                  <span>news@dailyguardian.com.ph</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock size={16} className="text-yellow-400 flex-shrink-0" />
                  <span>Mon-Fri: 8AM-6PM</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold font-serif">Daily Newsletter</h4>
              <p className="text-gray-400 text-sm">Get local news delivered to your inbox</p>
              
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 hover:border-yellow-500/30 focus:border-yellow-500 rounded text-white text-sm focus:outline-none transition-all duration-200"
                />
                <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-2 px-4 rounded text-sm transition-all duration-200 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Daily Guardian. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Established 1985 • Serving Iloilo and Western Visayas
              </p>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200">
                Contact
              </Link>
              <Link href="/advertise" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200">
                Advertise
              </Link>
            </div>
          </div>

          {/* Final Tagline */}
          <div className="mt-6 pt-4 border-t border-gray-900 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Newspaper size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">Committed to Truth, Dedicated to Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;