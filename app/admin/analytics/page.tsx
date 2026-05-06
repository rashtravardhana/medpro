"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminAnalytics() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    accepted: 0,
    rejected: 0,
  });

  const [jobsData, setJobsData] = useState<any[]>([]);

  useEffect(() => {

    const init = async () => {

      setLoading(true);

      // 🔐 CHECK USER
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      // 🔐 CHECK ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }

      // 📊 TOTAL JOBS
      const { count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("admin_id", user.id);

      // 📊 TOTAL APPLICATIONS
      const { count: appCount } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true });

      // 📊 ACCEPTED
      const { count: acceptedCount } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "accepted");

      // 📊 REJECTED
      const { count: rejectedCount } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");

      // 📊 JOBS WITH APPLICATION COUNT
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("admin_id", user.id);

      const jobsWithApps = await Promise.all(
        (jobs || []).map(async (job) => {

          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);

          return {
            ...job,
            applications: count || 0,
          };
        })
      );

      setStats({
        jobs: jobsCount || 0,
        applications: appCount || 0,
        accepted: acceptedCount || 0,
        rejected: rejectedCount || 0,
      });

      setJobsData(jobsWithApps);
      setLoading(false);
    };

    init();

  }, [router]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* 🔹 HEADER */}
        <h1 className="text-3xl font-semibold mb-10">
          Analytics Dashboard
        </h1>

        {/* 🔹 STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Jobs</p>
            <h2 className="text-2xl font-semibold mt-2">
              {stats.jobs}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Applications</p>
            <h2 className="text-2xl font-semibold mt-2">
              {stats.applications}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Accepted</p>
            <h2 className="text-2xl font-semibold mt-2 text-green-600">
              {stats.accepted}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Rejected</p>
            <h2 className="text-2xl font-semibold mt-2 text-red-600">
              {stats.rejected}
            </h2>
          </div>

        </div>

        {/* 🔹 JOB-WISE DATA */}
        <div className="bg-white p-8 rounded-2xl shadow-sm">

          <h2 className="text-xl font-semibold mb-6">
            Applications per Job
          </h2>

          {jobsData.length === 0 ? (
            <p className="text-gray-500">
              No job data available
            </p>
          ) : (
            <div className="space-y-4">

              {jobsData.map((job) => (

                <div
                  key={job.id}
                  className="flex justify-between items-center border-b pb-3"
                >

                  <p className="font-medium">
                    {job.title}
                  </p>

                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {job.applications} Applicants
                  </span>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
