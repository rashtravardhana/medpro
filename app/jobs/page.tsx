"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // 🔐 GET USER + JOBS
  useEffect(() => {

    const init = async () => {

      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);

      await fetchJobs();
    };

    init();

  }, []);

  // 📦 FETCH JOBS
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

  // 📝 APPLY JOB
  const applyJob = async (jobId: string) => {

    // ❌ NOT LOGGED IN
    if (!user) {
      alert("Please login first");
      window.location.href = "/auth";
      return;
    }

    setApplyingId(jobId);

    // ✅ CHECK ALREADY APPLIED
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("user_id", user.id) // ✅ FIXED
      .maybeSingle();

    if (existing) {
      alert("You already applied for this job");
      setApplyingId(null);
      return;
    }

    // ✅ INSERT APPLICATION
    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        user_id: user.id, // ✅ FIXED
        status: "pending"
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Application submitted successfully");
    }

    setApplyingId(null);
  };

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

              <button
                onClick={() => applyJob(job.id)}
                disabled={applyingId === job.id}
                className="mt-5 bg-black text-white px-5 py-2 rounded-lg hover:opacity-80 disabled:opacity-50"
              >
                {applyingId === job.id ? "Applying..." : "Apply"}
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
