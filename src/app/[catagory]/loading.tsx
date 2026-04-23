export default function CategoryLoading() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Category header */}
        <div className="mb-12 pb-4 border-b border-white/10">
          <div className="h-10 bg-white/10 rounded w-48 mb-3" />
          <div className="h-1 w-24 bg-[#fcee16]/30 rounded" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-12">

            {/* Featured article */}
            <div className="pb-8 border-b border-white/10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-3 bg-[#fcee16]/20 rounded w-20" />
                  <div className="h-8 bg-white/10 rounded w-full" />
                  <div className="h-8 bg-white/10 rounded w-4/5" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/8 rounded w-full" />
                    <div className="h-4 bg-white/8 rounded w-5/6" />
                    <div className="h-4 bg-white/8 rounded w-3/4" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-3 bg-white/8 rounded w-24" />
                    <div className="h-3 bg-white/8 rounded w-24" />
                  </div>
                </div>
                <div className="aspect-[4/3] bg-white/8 rounded" />
              </div>
            </div>

            {/* Latest articles grid */}
            <div>
              <div className="h-7 bg-white/10 rounded w-48 mb-6" />
              <div className="grid md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3 pb-6 border-b border-white/5">
                    <div className="aspect-[16/10] bg-white/8 rounded" />
                    <div className="h-5 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/8 rounded w-5/6" />
                    <div className="h-3 bg-white/8 rounded w-2/3" />
                    <div className="flex gap-3">
                      <div className="h-3 bg-white/8 rounded w-20" />
                      <div className="h-3 bg-white/8 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 border-l border-white/10 pl-8">
            <div className="h-5 bg-white/10 rounded w-28 mb-6" />
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-white/5">
                  <div className="w-6 h-6 bg-[#fcee16]/20 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/8 rounded w-3/4" />
                    <div className="h-3 bg-white/8 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
