import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/"
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}