// components/NavigationBar.tsx
import React from 'react';

const navLinks = ["Home", "World", "UK", "Companies", "Markets", "Opinion", "Work & Careers", "Life & Arts"];

const NavigationBar = () => {
  return (
    <nav className="bg-black text-white border-t border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <ul className="flex justify-center space-x-8 text-sm font-semibold">
          {navLinks.map((link, index) => (
            <li key={link}>
              <a 
                href="#" 
                className={`py-2 transition-colors hover:text-gold-500 ${index === 0 ? 'border-b-2 border-gold-500 text-gold-500' : 'text-white'}`}
              >
                {link.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;