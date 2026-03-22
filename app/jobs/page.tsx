"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10">
          Available Jobs
        </h1>

        <div className="space-y-6">

          {jobs.map((job) => (
            <div key={job.id} className="glass p-6 soft-shadow">

              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-500">
                {job.hospital_name}
              </p>

              <p>📍 {job.location}</p>
              <p>💰 {job.salary || "Not disclosed"}</p>

              <a
                href={`/jobs/${job.id}`}
                className="mt-4 inline-block btn-primary"
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
