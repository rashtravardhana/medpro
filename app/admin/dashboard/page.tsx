"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function AdminDashboard() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchJobs = async () => {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      setJobs(data || []);
      setLoading(false);

    };

    fetchJobs();

  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-semibold mb-8">
        Admin Dashboard
      </h1>

      <a
        href="/admin/post-job"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Post New Job
      </a>

      <div className="mt-10 space-y-6">

        {jobs.length === 0 && (
          <p className="text-neutral-500">
            No jobs posted yet.
          </p>
        )}

        {jobs.map((job) => (

          <div
            key={job.id}
            className="border p-6 rounded-lg"
          >

            <h2 className="text-xl font-semibold">
              {job.title}
            </h2>

            <p className="text-neutral-500 mt-2">
              {job.location}
            </p>

            <a
              href={`/admin/applicants/${job.id}`}
              className="text-blue-600 mt-4 inline-block"
            >
              View Applicants
            </a>

          </div>

        ))}

      </div>

    </div>
  );

}
