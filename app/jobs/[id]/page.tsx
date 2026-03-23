"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();

  // ✅ FIX: handle string | string[]
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {

    // ❌ STOP if id not ready
    if (!id) return;

    const fetchData = async () => {

      // 🔹 FETCH JOB
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log("Job error:", error.message);
      }

      setJob(jobData);

      // 🔹 FETCH USER ROLE
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        setRole(profile?.role || null);
      }

      setLoading(false);
    };

    fetchData();

  }, [id]);

  // 🔹 APPLY JOB
  const applyJob = async () => {

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    // ❌ NOT LOGGED IN
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // ❌ BLOCK ADMIN
    if (role === "admin") {
      setMessage("Admins cannot apply");
      return;
    }

    setApplying(true);
    setMessage("");

    // ✅ CHECK IF ALREADY APPLIED
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("You already applied");
      setApplying(false);
      return;
    }

    // ✅ INSERT APPLICATION
    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: id,
        user_id: user.id,
        status: "pending"
      });

    if (error) {
      setMessage(error.message);
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

  // ❌ JOB NOT FOUND
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

        {/* TITLE */}
        <h1 className="text-3xl font-semibold">
          {job.title}
        </h1>

        {/* BASIC INFO */}
        <p className="text-gray-500 mt-2">
          {job.hospital_name} • {job.location}
        </p>

        {/* SALARY */}
        <p className="mt-4">
          💰 {job.salary || "Not disclosed"}
        </p>

        {/* DESCRIPTION */}
        <p className="mt-6">
          {job.description}
        </p>

        {/* 👨‍⚕️ DOCTOR APPLY */}
        {role === "doctor" && (
          <button
            onClick={applyJob}
            disabled={applying}
            className="mt-6 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}

        {/* 🏥 ADMIN BLOCK */}
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
