"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ADD USER + ROLE (important for future logic)
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {

      // 🔹 GET USER ROLE
      const userRes = await supabase.auth.getUser();

      if (userRes.data?.user) {
        const profileRes = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userRes.data.user.id)
          .single();

        setRole(profileRes.data?.role?.toLowerCase().trim() || null);
      }

      // 🔹 GET JOBS
      const jobRes = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobRes.error) {
        console.log(jobRes.error);
      } else {
        setJobs(jobRes.data || []);
      }

      setLoading(false);
    };

    fetchData();

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

              <p className="mt-2 text-sm text-gray-600">
                💰 {job.salary || "Not disclosed"}
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
