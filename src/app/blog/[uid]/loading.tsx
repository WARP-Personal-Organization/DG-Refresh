export default function ArticleLoading() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back + category */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-3 bg-white/8 rounded w-24" />
          <div className="h-5 bg-[#fcee16]/20 rounded w-20" />
        </div>

        {/* Article header */}
        <div className="mb-8 space-y-4">
          <div className="h-10 bg-white/10 rounded w-full" />
          <div className="h-10 bg-white/10 rounded w-5/6" />
          <div className="h-10 bg-white/10 rounded w-2/3" />

          <div className="flex items-center gap-6 pt-2">
            <div className="h-3 bg-white/8 rounded w-28" />
            <div className="h-3 bg-white/8 rounded w-28" />
            <div className="h-3 bg-white/8 rounded w-20" />
          </div>
        </div>

        {/* Hero image */}
        <div className="aspect-video bg-white/8 rounded mb-10" />

        {/* Article body */}
        <div className="space-y-4 mb-10">
          {[...Array(3)].map((_, block) => (
            <div key={block} className="space-y-2">
              {[...Array(4)].map((_, line) => (
                <div
                  key={line}
                  className="h-4 bg-white/8 rounded"
                  style={{ width: line === 3 ? "60%" : "100%" }}
                />
              ))}
            </div>
          ))}

          {/* Pull quote / image placeholder */}
          <div className="my-8 aspect-[16/7] bg-white/5 rounded" />

          {[...Array(2)].map((_, block) => (
            <div key={block} className="space-y-2">
              {[...Array(4)].map((_, line) => (
                <div
                  key={line}
                  className="h-4 bg-white/8 rounded"
                  style={{ width: line === 3 ? "45%" : "100%" }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-6 border-t border-white/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-white/8 rounded-full w-20" />
          ))}
        </div>
      </div>
    </div>
  );
}
