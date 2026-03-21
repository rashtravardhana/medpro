"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {

    const fetchJobs = async () => {

      // 🔐 CHECK LOGIN
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth"); // 🚀 redirect if not logged in
        return;
      }

      // 📄 FETCH ADMIN JOBS
      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      setJobs(jobsData || []);
      setLoading(false);
    };

    fetchJobs();

  }, [router]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-8 fade-up">
          Admin Dashboard
        </h1>

        {/* POST BUTTON */}
        <a
          href="/post-job"
          className="btn-primary"
        >
          Post New Job
        </a>

        {/* JOB LIST */}
        <div className="mt-10 space-y-6">

          {jobs.length === 0 ? (
            <p className="text-gray-500">
              No jobs posted yet.
            </p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="glass p-6 soft-shadow fade-up"
              >

                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {job.location}
                </p>

                <div className="mt-4 flex gap-4">

                  <a
                    href={`/admin/applicants/${job.id}`}
                    className="text-blue-600"
                  >
                    View Applicants
                  </a>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}
