import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">

        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-blue-100">404</h1>

        {/* Icon */}
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto -mt-8 mb-6">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/jobs"
            className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Browse Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}
