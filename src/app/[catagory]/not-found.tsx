import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen flex items-center justify-center font-open-sans">
      <div className="text-center max-w-md px-4">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3 font-roboto">
          404
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">
          Section Not Found
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          No articles found for this section.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-accent text-black text-sm font-semibold rounded hover:bg-accent/80 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
