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

      if (!error) {
        setJobs(data || []);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-semibold tracking-tight">
          Browse Opportunities
        </h1>
        <p className="mt-4 text-lg text-neutral-500">
          Discover curated medical careers across leading hospitals.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Apple Style Skeleton Loader */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-neutral-200 rounded-2xl p-8 animate-pulse"
              >
                <div className="h-6 bg-neutral-200 rounded w-1/3 mb-5"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-neutral-500 text-lg">
            No positions available at the moment.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="border border-neutral-200 rounded-2xl p-8 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {job.title}
              </h2>

              <p className="mt-2 text-neutral-500">
                {job.hospital_name} • {job.location}
              </p>

              <p className="mt-6 text-neutral-600 leading-relaxed">
                {job.description}
              </p>

              <div className="mt-6 text-sm text-neutral-400">
                Salary: {job.salary}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
