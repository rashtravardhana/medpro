"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // 🔹 JOB
      const jobRes = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(jobRes.data);

      // 🔹 USER ROLE
      const userRes = await supabase.auth.getUser();

      if (userRes.data?.user) {
        const profileRes = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userRes.data.user.id)
          .single();

        setRole(profileRes.data?.role || null);
      }

      setLoading(false);
    };

    fetchData();

  }, [id]);

  const applyJob = async () => {

    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (role === "admin") {
      setMessage("Admins cannot apply");
      return;
    }

    setApplying(true);
    setMessage("");

    // check existing
    const existing = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing.data) {
      setMessage("Already applied");
      setApplying(false);
      return;
    }

    // insert
    const insert = await supabase
      .from("applications")
      .insert({
        job_id: id,
        user_id: user.id,
        status: "pending",
      });

    if (insert.error) {
      setMessage(insert.error.message);
    } else {
      setMessage("Applied successfully ✅");
    }

    setApplying(false);
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!job) return <p className="p-10">Job not found</p>;

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-semibold">{job.title}</h1>

        <p className="text-gray-500 mt-2">
          {job.hospital_name} • {job.location}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="p-3 border rounded">
            💰 Salary: {job.salary || "Not disclosed"}
          </div>

          <div className="p-3 border rounded">
            🧠 Experience: {job.experience || "N/A"}
          </div>

          <div className="p-3 border rounded">
            📌 Type: {job.type || "N/A"}
          </div>

        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        {/* APPLY */}
        {role === "doctor" && (
          <button
            onClick={applyJob}
            disabled={applying}
            className="mt-8 bg-black text-white px-6 py-3 rounded w-full disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}

        {role === "admin" && (
          <p className="mt-8 text-center text-gray-500">
            Admin cannot apply
          </p>
        )}

        {message && (
          <p className="mt-4 text-green-600 text-center">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
