// components/MainContent.tsx
import React from 'react';

const MainContent = () => {
  return (
    <main className="lg:col-span-3 space-y-8">
      {/* Hero Article & Featured Image Section */}
      <article className="grid md:grid-cols-2 gap-8 bg-black p-6 rounded-lg">
        {/* Hero Article Details */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold text-gold-500 mb-2">War in Ukraine</p>
          <h2 className="text-4xl font-serif text-white mb-4">
            Russia and Ukraine clash in fierce battle for eastern city
          </h2>
          <p className="text-gray-400 mb-4">
            Kyiv’s troops give ground in Severodonetsk in face of Moscow’s superior firepower.
          </p>
          <p className="text-xs text-gold-500">UPDATED 3 HOURS AGO</p>
        </div>

        {/* Featured Image and Secondary Article */}
        <div className="relative overflow-hidden rounded-lg min-h-[300px] border border-gold-500/50">
          <img 
            src="https://via.placeholder.com/600x400.png/000000/FFFFFF?text=AI+Illustration" 
            alt="AI chat interface" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
            <article>
              <p className="text-sm font-semibold text-gold-500">Artificial intelligence</p>
              <h3 className="text-2xl font-serif text-white mt-1">
                The quiet revolution in AI is changing how we work
              </h3>
            </article>
          </div>
        </div>
      </article>

      {/* Editorial Content Block */}
      <blockquote className="bg-black p-6 rounded-lg border-l-4 border-gold-500">
        <p className="text-lg italic text-white">
          “The central bank has no choice but to raise interest rates, even if it triggers a recession.”
        </p>
        <footer className="mt-4 text-sm text-gray-400">
          — Martin Wolf, Chief Economics Commentator
        </footer>
      </blockquote>
    </main>
  );
};

export default MainContent; 