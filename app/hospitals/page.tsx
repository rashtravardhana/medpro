"use client";

export default function HospitalsPage() {
  return (
    <div className="min-h-screen px-6 py-20 bg-white text-black">

      <div className="max-w-3xl mx-auto text-center">

        <h1 className="text-4xl font-semibold mb-6">
          For Hospitals
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Hospitals and clinics can easily find and hire qualified professionals
          without complicated hiring processes.
        </p>

        <ul className="text-left space-y-4 text-gray-700">
          <li>✅ Post jobs in seconds</li>
          <li>✅ Reach verified doctors</li>
          <li>✅ Manage applications easily</li>
          <li>✅ Hire faster with better matches</li>
        </ul>

        <a
          href="/post-job"
          className="inline-block mt-10 px-6 py-3 bg-black text-white rounded-full"
        >
          Post a Job
        </a>

      </div>

    </div>
  );
}
