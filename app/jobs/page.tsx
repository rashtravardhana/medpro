"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<string | null>(null);

  // 🔍 FILTER STATES
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      // 🔹 USER ROLE
      const userRes = await supabase.auth.getUser();

      if (userRes.data?.user) {
        const profileRes = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userRes.data.user.id)
          .single();

        setRole(profileRes.data?.role?.toLowerCase().trim() || null);
      }

      // 🔹 JOBS
      const jobRes = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobRes.error) {
        console.log(jobRes.error);
      } else {
        setJobs(jobRes.data || []);
        setFilteredJobs(jobRes.data || []);
      }

      setLoading(false);
    };

    fetchData();

  }, []);

  // 🔍 FILTER LOGIC
  useEffect(() => {

    let result = jobs;

    if (search) {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.hospital_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (salary) {
      result = result.filter((job) =>
        job.salary?.toLowerCase().includes(salary.toLowerCase())
      );
    }

    setFilteredJobs(result);

  }, [search, location, salary, jobs]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10 text-center">
          Available Jobs
        </h1>

        {/* 🔍 FILTER BAR */}
        <div className="bg-white p-6 rounded-xl shadow mb-10 grid md:grid-cols-4 gap-4">

          <input
            placeholder="Search job or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              setSearch("");
              setLocation("");
              setSalary("");
            }}
            className="bg-black text-white rounded px-4"
          >
            Clear
          </button>

        </div>

        {/* ❌ NO JOBS */}
        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No jobs found
          </p>
        ) : (

          <div className="space-y-6">

            {filteredJobs.map((job) => (

              <div
                key={job.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >

                <h2 className="text-xl font-semibold">
                  {job.title}
                </h2>

                <p className="text-gray-500">
                  {job.hospital_name}
                </p>

                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary || "Not disclosed"}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">

                  {/* 👁 VIEW DETAILS */}
                  <a
                    href={`/jobs/${job.id}`}
                    className="text-blue-600 underline"
                  >
                    View Details
                  </a>

                  {/* 🛑 OPTIONAL: HIDE FOR ADMIN */}
                  {role !== "admin" && (
                    <span className="text-sm text-gray-400">
                      Apply from details page
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}
