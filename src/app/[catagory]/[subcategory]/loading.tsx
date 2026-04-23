export default function SubcategoryLoading() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back link */}
        <div className="h-3 bg-white/8 rounded w-24 mb-6" />

        {/* Page header */}
        <div className="mb-12 space-y-4">
          <div className="h-14 bg-white/10 rounded w-64" />
          <div className="h-1 w-24 bg-[#fcee16]/30 rounded" />
        </div>

        {/* Article grid — 3 columns */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#fcee16]/30 rounded" />
            <div className="h-7 bg-white/10 rounded w-56" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-[#111010] border border-white/5 rounded-lg overflow-hidden space-y-0">
                <div className="aspect-[16/10] bg-white/8" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-full" />
                  <div className="h-5 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/8 rounded w-full" />
                  <div className="h-4 bg-white/8 rounded w-3/4" />
                  <div className="flex gap-4 pt-2 border-t border-white/5">
                    <div className="h-3 bg-white/8 rounded w-20" />
                    <div className="h-3 bg-white/8 rounded w-20" />
                    <div className="h-3 bg-white/8 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-9 h-9 bg-white/8 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
