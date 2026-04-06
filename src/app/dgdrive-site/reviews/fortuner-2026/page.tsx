import { ImageWithFallback } from '../../ImageWithFallback';

export default function ReviewDetail() {
  return (
    <div className="min-h-screen bg-[#1b1a1b] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1639922195938-611119f7f307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Toyota Fortuner 2026"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1a1b] via-[#1b1a1b]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-6 pb-12">
            <div className="max-w-4xl">
              <div className="inline-block px-3 py-1 bg-[#fbd203] text-[#1b1a1b] mb-4">
                <span className="uppercase tracking-wider text-xs font-bold">SUV Review</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-white">
                Toyota Fortuner 2026: The Ultimate Filipino Family SUV
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-white/60 text-sm uppercase tracking-wider">April 2, 2026</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#fbd203] text-3xl font-bold">9.2/10</span>
                  <span className="text-white/50 text-sm">OVERALL RATING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="border-l-4 border-[#fbd203] pl-8 mb-12">
            <p className="text-xl leading-relaxed text-white/80">
              After two months of rigorous testing across Metro Manila's congested streets, NLEX highways,
              and rough provincial roads in Batangas, the 2026 Toyota Fortuner proves once again why it
              remains the undisputed king of seven-seater SUVs in the Philippines.
            </p>
          </div>

          {/* Quick Specs */}
          <div className="bg-[#242324] border border-[#fbd203]/30 p-8 mb-12 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#fbd203]">Quick Specifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Engine</span>
                  <p className="text-lg">2.8L Turbocharged Diesel</p>
                </div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Power</span>
                  <p className="text-lg">201 hp @ 3,000-3,400 rpm</p>
                </div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Torque</span>
                  <p className="text-lg">500 Nm @ 1,600-2,800 rpm</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Transmission</span>
                  <p className="text-lg">6-Speed Automatic</p>
                </div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Drive Type</span>
                  <p className="text-lg">4x2 / 4x4 (Variant Dependent)</p>
                </div>
                <div className="mb-4">
                  <span className="text-white/50 text-sm uppercase tracking-wider">Price Range</span>
                  <p className="text-lg">₱1,735,000 - ₱2,389,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Performance & Driving Dynamics</h2>
              <div className="flex-1 h-px bg-[#fbd203]/30"></div>
            </div>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              The heart of the Fortuner remains the proven 2.8-liter turbocharged diesel engine, now
              refined for 2026 with improved NVH characteristics. Power delivery is linear and predictable,
              with the turbo spooling up smoothly from as low as 1,600 rpm. The 500 Nm of torque is more
              than adequate for overtaking maneuvers on highways and climbing steep provincial roads.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              The six-speed automatic transmission is well-calibrated for Philippine driving conditions.
              It shifts smoothly in traffic and holds gears appropriately when needed. Manual mode is
              available via the gear selector, though most drivers will rarely need it.
            </p>
            <div className="bg-[#fbd203]/5 border-l-2 border-[#fbd203] p-6 mb-6 rounded-r-lg">
              <p className="text-white/70 italic">
                "On the highway, the Fortuner cruises effortlessly at 100 km/h with the engine barely
                breaking a sweat. Fuel economy averaged 11.2 km/L in mixed driving—impressive for a
                vehicle of this size."
              </p>
            </div>
          </section>

          {/* Interior Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Interior & Comfort</h2>
              <div className="flex-1 h-px bg-[#fbd203]/30"></div>
            </div>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              The 2026 Fortuner's cabin is a significant step up from previous generations. Soft-touch
              materials adorn the dashboard and door panels, while the top-spec LTD variant features
              leather upholstery throughout all three rows. The first and second rows are genuinely
              spacious, easily accommodating adults for long journeys.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              The third row, while tight for adults, is perfectly sized for children—making this an
              ideal family vehicle for Filipino households. Climate control is excellent, with rear
              vents ensuring all passengers stay comfortable even in Metro Manila's notorious heat.
            </p>
          </section>

          {/* Technology Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Technology & Features</h2>
              <div className="flex-1 h-px bg-[#fbd203]/30"></div>
            </div>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              Toyota's latest infotainment system features a 9-inch touchscreen with wireless Apple
              CarPlay and Android Auto. The system is responsive and intuitive, though it lacks the
              visual polish of some competitors. The 360-degree camera is a godsend in tight parking
              situations, displaying a crystal-clear bird's-eye view.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#242324] p-6 rounded-xl">
                <h3 className="text-[#fbd203] font-bold mb-3 uppercase tracking-wider text-sm">Standard Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• 9-inch Touchscreen Display</li>
                  <li>• Wireless Connectivity</li>
                  <li>• 360-Degree Camera</li>
                  <li>• Adaptive Cruise Control</li>
                  <li>• Lane Departure Warning</li>
                </ul>
              </div>
              <div className="bg-[#242324] p-6 rounded-xl">
                <h3 className="text-[#fbd203] font-bold mb-3 uppercase tracking-wider text-sm">Premium Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• JBL Premium Audio</li>
                  <li>• Panoramic Sunroof</li>
                  <li>• Power Tailgate</li>
                  <li>• Wireless Charging</li>
                  <li>• Digital Instrument Cluster</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Safety</h2>
              <div className="flex-1 h-px bg-[#fbd203]/30"></div>
            </div>
            <p className="text-lg leading-relaxed mb-6 text-white/80">
              Toyota Safety Sense comes standard across all variants, including Pre-Collision System,
              Lane Departure Alert, and Dynamic Radar Cruise Control. Seven airbags provide comprehensive
              protection for all occupants. The Fortuner's high seating position offers excellent visibility,
              crucial for navigating Philippine traffic.
            </p>
          </section>

          {/* Rating Breakdown */}
          <div className="bg-[#242324] border-2 border-[#fbd203] p-8 mb-12 rounded-xl">
            <h2 className="text-2xl font-bold mb-8 text-[#fbd203]">Rating Breakdown</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm uppercase tracking-wider text-white/70">Performance</span>
                  <span className="text-[#fbd203] font-bold">9.0/10</span>
                </div>
                <div className="h-2 bg-[#1b1a1b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fbd203]" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm uppercase tracking-wider text-white/70">Interior Quality</span>
                  <span className="text-[#fbd203] font-bold">9.5/10</span>
                </div>
                <div className="h-2 bg-[#1b1a1b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fbd203]" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm uppercase tracking-wider text-white/70">Technology</span>
                  <span className="text-[#fbd203] font-bold">8.5/10</span>
                </div>
                <div className="h-2 bg-[#1b1a1b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fbd203]" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm uppercase tracking-wider text-white/70">Safety</span>
                  <span className="text-[#fbd203] font-bold">9.5/10</span>
                </div>
                <div className="h-2 bg-[#1b1a1b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fbd203]" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm uppercase tracking-wider text-white/70">Value for Money</span>
                  <span className="text-[#fbd203] font-bold">9.0/10</span>
                </div>
                <div className="h-2 bg-[#1b1a1b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fbd203]" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">The Verdict</h2>
              <div className="flex-1 h-px bg-[#fbd203]/30"></div>
            </div>
            <p className="text-xl leading-relaxed mb-6 text-white/80">
              The 2026 Toyota Fortuner remains the benchmark in its segment for good reason. It combines
              proven reliability with modern amenities, robust performance with comfortable ride quality,
              and practical versatility with premium features. For Filipino families seeking a vehicle that
              can handle everything from the daily school run to weekend provincial trips, the Fortuner
              continues to be the gold standard.
            </p>
            <div className="bg-[#fbd203]/10 border-l-4 border-[#fbd203] p-6 rounded-r-lg">
              <h3 className="text-[#fbd203] font-bold mb-4 text-lg">Pros</h3>
              <ul className="space-y-2 text-white/80 mb-6">
                <li>• Unmatched reliability and resale value</li>
                <li>• Spacious and comfortable for seven passengers</li>
                <li>• Strong diesel performance with good fuel economy</li>
                <li>• Comprehensive safety features</li>
                <li>• Excellent dealer network and after-sales support</li>
              </ul>
              <h3 className="text-[#fbd203] font-bold mb-4 text-lg">Cons</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Infotainment system lags behind some competitors</li>
                <li>• Third row tight for adult passengers</li>
                <li>• Premium pricing compared to some rivals</li>
              </ul>
            </div>
          </section>

          {/* Final Score */}
          <div className="text-center py-12 border-t border-b border-[#fbd203]/30">
            <div className="text-[#fbd203] text-7xl font-bold mb-4">9.2/10</div>
            <p className="text-2xl uppercase tracking-widest text-white/70">Highly Recommended</p>
          </div>
        </div>
      </article>

      {/* Related Reviews */}
      <section className="border-t border-[#fbd203]/30 bg-[#242324] py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-white">Related Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-black/20 overflow-hidden mb-4 rounded-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1594978100646-ccd2ae32b711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Mitsubishi Montero Sport"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-block px-3 py-1 bg-[#fbd203] text-[#1b1a1b] rounded-lg">
                    <span className="uppercase tracking-wider text-xs font-bold">SUV</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#fbd203] transition-colors">
                Mitsubishi Montero Sport: Rugged Reliability Tested
              </h3>
              <span className="text-xs text-white/50 uppercase tracking-wider">March 30, 2026</span>
            </article>

            <article className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-black/20 overflow-hidden mb-4 rounded-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1579108041833-8b6f5f59b8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Toyota Raize"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-block px-3 py-1 bg-[#fbd203] text-[#1b1a1b] rounded-lg">
                    <span className="uppercase tracking-wider text-xs font-bold">SUV</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#fbd203] transition-colors">
                Toyota Raize: Small SUV, Big Value
              </h3>
              <span className="text-xs text-white/50 uppercase tracking-wider">March 22, 2026</span>
            </article>

            <article className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-black/20 overflow-hidden mb-4 rounded-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1749058983232-59b967855b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Toyota Vios"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-block px-3 py-1 bg-[#fbd203] text-[#1b1a1b] rounded-lg">
                    <span className="uppercase tracking-wider text-xs font-bold">Sedan</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#fbd203] transition-colors">
                Toyota Vios: The Budget King Still Reigns
              </h3>
              <span className="text-xs text-white/50 uppercase tracking-wider">March 28, 2026</span>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}