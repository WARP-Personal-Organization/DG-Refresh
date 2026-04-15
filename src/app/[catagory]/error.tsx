"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Category page error:", error);
  }, [error]);

  return (
    <div className="bg-[#1b1a1b] min-h-screen flex items-center justify-center font-open-sans">
      <div className="text-center max-w-md px-4">
        <h1 className="text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          We couldn&apos;t load this section. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-accent text-black text-sm font-semibold rounded hover:bg-accent/80 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2 border border-gray-600 text-gray-300 text-sm rounded hover:border-accent hover:text-accent transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
