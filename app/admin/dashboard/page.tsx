"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const checkAdmin = async () => {

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
      setLoading(false);
    };

    checkAdmin();

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

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-3xl font-semibold">
            Admin Dashboard
          </h1>

          <a href="/post-job" className="btn-primary">
            + Post Job
          </a>

        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500">
            No jobs posted yet.
          </p>
        ) : (
          <div className="space-y-6">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="glass soft-shadow p-6 fade-up"
              >

                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>

                <p className="text-gray-500">
                  {job.hospital_name}
                </p>

                <p className="mt-2 text-sm">
                  📍 {job.location}
                </p>

                <p className="text-sm">
                  💰 {job.salary || "Not disclosed"}
                </p>

                <div className="mt-4 flex gap-4">

                  <a
                    href={`/jobs/${job.id}`}
                    className="text-blue-600 text-sm"
                  >
                    View Job
                  </a>

                  <a
                    href={`/admin/applicants/${job.id}`}
                    className="text-green-600 text-sm"
                  >
                    View Applicants
                  </a>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
