export default function HomeLoading() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Hero + sidebar */}
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
            {/* Main hero */}
            <div className="md:col-span-2 space-y-4">
              <div className="w-24 h-3 bg-white/10 rounded" />
              <div className="aspect-video bg-white/8 rounded" />
              <div className="h-7 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/8 rounded w-1/2" />
            </div>
            {/* Sub cards */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-white/8 rounded" />
                <div className="h-5 bg-white/10 rounded w-5/6" />
                <div className="h-3 bg-white/8 rounded w-1/3" />
              </div>
            ))}
          </div>
          {/* Today's paper sidebar */}
          <div className="hidden lg:block">
            <div className="aspect-[3/4] bg-white/8 rounded" />
          </div>
        </div>

        {/* Top stories strip */}
        <div className="mb-8">
          <div className="h-px bg-[#fcee16]/20 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-white/8 rounded" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/8 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>

        {/* Local section */}
        <div className="mb-8">
          <div className="h-px bg-[#fcee16]/20 mb-6" />
          <div className="w-20 h-6 bg-white/10 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-white/8 rounded" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/8 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Negros + sports section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="w-24 h-6 bg-white/10 rounded" />
            <div className="aspect-video bg-white/8 rounded" />
            <div className="h-7 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/8 rounded w-1/2" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-4 border-b border-white/5 space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/8 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
