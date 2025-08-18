// components/Header.tsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left spacer for centering the logo */}
        <div className="flex-1 hidden md:flex"></div>
        
        {/* Centered Logo */}
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gold-500">FT</h1>
        </div>

        {/* User Actions */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <button className="bg-gold-500 text-black font-semibold py-2 px-4 rounded hover:bg-gold-500/90 transition-colors">
            Subscribe
          </button>
          <button className="font-semibold hover:text-gold-500 transition-colors">
            Sign In
          </button>
          <div className="md:hidden">
            {/* Hamburger Menu Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;