import Link from "next/link";

export default function HubAndSpokeSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-t border-b border-yellow-500/70 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-yellow-400 uppercase">
            Special Features
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Explore Daily Guardian
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Curated sections featuring stories, destinations, and special
            coverage across Western Visayas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* FOOD MAPS */}
          <Link
            href="/food-maps"
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-yellow-500/30 bg-[#111111] transition-all duration-300 hover:border-yellow-400"
          >
            {/* IMAGE TOP */}
            <div className="overflow-hidden">
              <div className="h-56 bg-[url('/food.png')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
            </div>

            {/* TEXT BOTTOM */}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-400">
                Feature
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white transition group-hover:text-yellow-300">
                Food Maps
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Discover Iloilo’s food scene through curated maps, local spots,
                and culinary stories.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-yellow-400">
                Explore →
              </span>
            </div>
          </Link>

          {/* DG DRIVE */}
          <Link
            href="/dg-drive"
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-yellow-500/30 bg-[#111111] transition-all duration-300 hover:border-yellow-400"
          >
            {/* TEXT TOP */}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-400">
                Special Project
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white transition group-hover:text-yellow-300">
                DG Drive
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Explore in-depth coverage, community initiatives, and special
                projects from Daily Guardian.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-yellow-400">
                Explore →
              </span>
            </div>

            {/* IMAGE BOTTOM */}
            <div className="overflow-hidden">
              <div className="h-56 bg-[url('/dg-drive.png')] bg-cover bg-center transition-transform duration-300 group-hover:scale-105" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
