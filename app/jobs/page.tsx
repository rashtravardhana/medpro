"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setJobs(data || []);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-3xl font-semibold mb-10 text-center">
        Browse Jobs
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-neutral-500">
            No jobs available.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-neutral-600 mt-1">
                {job.hospital_name} • {job.location}
              </p>
              <p className="text-neutral-500 mt-3">{job.description}</p>
              <p className="text-sm text-neutral-400 mt-3">
                Salary: {job.salary}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
