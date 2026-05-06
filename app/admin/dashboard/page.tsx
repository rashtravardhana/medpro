"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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

      // 📥 FETCH JOBS
      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      // 🔥 ADD APPLICANT COUNT
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {

          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);

          return {
            ...job,
            applicantsCount: count || 0,
          };
        })
      );

      setJobs(jobsWithCounts);
      setLoading(false);
    };

    init();

  }, [router]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* 🔹 HEADER */}
        <div className="flex justify-between items-center mb-12">

          <div>
            <h1 className="text-3xl font-semibold">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your job postings
            </p>
          </div>

          <a
            href="/post-job"
            className="bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition"
          >
            + Post Job
          </a>

        </div>

        {/* ❌ EMPTY STATE */}
        {jobs.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 text-lg">
              No jobs posted yet
            </p>

            <a
              href="/post-job"
              className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full"
            >
              Post Your First Job
            </a>
          </div>
        ) : (

          <div className="space-y-6">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >

                {/* 🔹 TITLE */}
                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>

                {/* 🔹 HOSPITAL */}
                <p className="text-gray-500">
                  {job.hospital_name}
                </p>

                {/* 🔹 DETAILS */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary || "Not disclosed"}</p>
                </div>

                {/* 🔹 APPLICANTS COUNT */}
                <div className="mt-4">
                  <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                    👨‍⚕️ {job.applicantsCount} Applicants
                  </span>
                </div>

                {/* 🔹 ACTIONS */}
                <div className="mt-5 flex gap-6 text-sm">

                  <a
                    href={`/jobs/${job.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Job
                  </a>

                  <a
                    href={`/admin/applicants/${job.id}`}
                    className="text-green-600 hover:underline"
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
