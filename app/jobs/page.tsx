"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ✅ IMPORTANT: async function
    const fetchJobs = async () => {

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setJobs(data || []);
      }

      setLoading(false);
    };

    fetchJobs();

  }, []);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8">
          Available Jobs
        </h1>

        {jobs.length === 0 && (
          <p>No jobs available</p>
        )}

        <div className="space-y-6">

          {jobs.map((job) => (
            <div
              key={job.id}
              className="border p-6 rounded-lg"
            >
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-500">
                {job.hospital_name}
              </p>

              <p>📍 {job.location}</p>

              <p>💰 {job.salary || "Not disclosed"}</p>

              <p className="mt-2 text-sm text-gray-600">
                {job.description}
              </p>

              <a
                href={`/jobs/${job.id}`}
                className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"
              >
                View Details
              </a>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
