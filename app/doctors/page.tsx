"use client";

export default function DoctorsPage() {
  return (
    <div className="min-h-screen px-6 py-20 bg-white text-black">

      <div className="max-w-3xl mx-auto text-center">

        <h1 className="text-4xl font-semibold mb-6">
          Built for Doctors
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          MedCareer is designed specifically for healthcare professionals like
          MBBS, BDS, BAMS, BHMS and more.
        </p>

        <ul className="text-left space-y-4 text-gray-700">
          <li>✅ Find jobs based on your specialization</li>
          <li>✅ Apply in one click</li>
          <li>✅ Track your applications easily</li>
          <li>✅ Discover better career opportunities</li>
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
