"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchJobs = async () => {

      const response = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (response.error) {
        console.log(response.error);
      } else {
        setJobs(response.data || []);
      }

      setLoading(false);
    };

    fetchJobs();

  }, []);

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

        <h1 className="text-3xl font-semibold mb-10">
          Available Jobs
        </h1>

        {jobs.length === 0 && (
          <p>No jobs available</p>
        )}

        <div className="space-y-6">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="border p-6 rounded-xl"
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

              <a
  href={`/jobs/${job.id}`}
  className="inline-block mt-3 text-blue-600 underline"
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
