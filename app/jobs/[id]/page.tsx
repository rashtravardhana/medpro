"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();

  // ✅ SAFE ID
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // 🔹 FETCH JOB
      const jobRes = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (jobRes.error) {
        console.log(jobRes.error);
      } else {
        setJob(jobRes.data);
      }

      // 🔹 FETCH USER ROLE
      const userRes = await supabase.auth.getUser();

      if (userRes.data?.user) {
        const profileRes = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userRes.data.user.id)
          .single();

        if (profileRes.data) {
          setRole(profileRes.data.role);
        }
      }

      setLoading(false);
    };

    fetchData();

  }, [id]);

  // 🔹 APPLY FUNCTION
  const applyJob = async () => {

    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // ❌ ADMIN BLOCK
    if (role === "admin") {
      setMessage("Admins cannot apply");
      return;
    }

    setApplying(true);
    setMessage("");

    // 🔍 CHECK EXISTING
    const existingRes = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingRes.data) {
      setMessage("You already applied");
      setApplying(false);
      return;
    }

    // 📥 INSERT
    const insertRes = await supabase
      .from("applications")
      .insert({
        job_id: id,
        user_id: user.id,
        status: "pending",
      });

    if (insertRes.error) {
      setMessage(insertRes.error.message);
    } else {
      setMessage("Application submitted successfully");
    }

    setApplying(false);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-semibold">
          {job.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {job.hospital_name} • {job.location}
        </p>

        <p className="mt-4">
          💰 {job.salary || "Not disclosed"}
        </p>

        <p className="mt-6">
          {job.description}
        </p>

        {/* 👨‍⚕️ DOCTOR */}
        {role === "doctor" && (
          <button
            onClick={applyJob}
            disabled={applying}
            className="mt-6 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}

        {/* 🏥 ADMIN */}
        {role === "admin" && (
          <p className="mt-6 text-gray-500">
            Admin cannot apply for jobs
          </p>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
