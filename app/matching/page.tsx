"use client";

export default function MatchingPage() {
  return (
    <div className="min-h-screen px-6 py-20 bg-white text-black">

      <div className="max-w-3xl mx-auto text-center">

        <h1 className="text-4xl font-semibold mb-6">
          Smart Matching
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Our system intelligently connects the right candidates with the right
          jobs based on skills, profession, and preferences.
        </p>

        <ul className="text-left space-y-4 text-gray-700">
          <li>✅ Profession-based job filtering</li>
          <li>✅ Personalized recommendations</li>
          <li>✅ Faster hiring process</li>
          <li>✅ Better career outcomes</li>
        </ul>

        <a
          href="/jobs"
          className="inline-block mt-10 px-6 py-3 bg-black text-white rounded-full"
        >
          Explore Jobs
        </a>

      </div>

    </div>
  );
}
