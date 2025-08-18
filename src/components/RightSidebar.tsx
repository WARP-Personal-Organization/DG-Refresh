// components/RightSidebar.tsx
import React from 'react';

const editorsPicks = [
  { title: "Global inflation crisis deepens as food prices surge", author: "Chris Giles", image: "https://via.placeholder.com/80x80.png/000000/FFFFFF?text=World" },
  { title: "Why the four-day work week is gaining momentum", author: "Sarah O'Connor", image: "https://via.placeholder.com/80x80.png/000000/FFFFFF?text=Work" },
  { title: "Inside the high-stakes world of semiconductor manufacturing", author: "Tim Bradshaw", image: "https://via.placeholder.com/80x80.png/000000/FFFFFF?text=Tech" },
];

const secondaryContent = [
    { title: "ECB signals July rate rise to combat soaring prices" },
    { title: "Opinion: A new era of geopolitics requires new alliances" },
    { title: "How to invest in a bear market" },
];

const RightSidebar = () => {
  return (
    <aside className="lg:col-span-1 space-y-8">
      {/* Editor's Picks */}
      <div className="bg-black p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gold-500 mb-6">Editor&apos;s picks</h3>
        <div className="space-y-6">
          {editorsPicks.map((item) => (
            <div key={item.title} className="flex gap-4 group">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div>
                <h4 className="font-semibold text-white group-hover:text-gold-500 transition-colors cursor-pointer">{item.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Sidebar Content */}
      <div className="bg-black p-6 rounded-lg">
        <div className="space-y-4">
            {secondaryContent.map(item => (
                <div key={item.title}>
                    <h4 className="text-lg font-semibold text-white hover:text-gold-500 transition-colors cursor-pointer">{item.title}</h4>
                </div>
            ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;