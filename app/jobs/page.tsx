"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 GET USER + JOBS
  useEffect(() => {

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
        <p className="text-gray-500 text-lg">Loading jobs...</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10">
          Available Jobs
        </h1>

        {jobs.length === 0 && (
          <p className="text-gray-500">No jobs available</p>
        )}

        <div className="space-y-6">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >

              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-500">
                {job.hospital_name}
              </p>

              <p className="mt-2">
                📍 {job.location}
              </p>

              <p>
                💰 {job.salary || "Not disclosed"}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                {job.description}
              </p>

              {/* 🔥 CHANGE IS HERE */}
              <a
                href={`/jobs/${job.id}`}
                className="mt-5 inline-block bg-black text-white px-5 py-2 rounded-lg hover:opacity-80"
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
