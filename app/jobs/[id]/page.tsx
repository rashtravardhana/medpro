"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profession, setProfession] = useState<string | null>(null); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  // 🔹 FETCH DATA
  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // 🔹 JOB
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(jobData);

      // 🔹 USER
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, profession")
          .eq("id", userData.user.id)
          .single();

        setRole(profile?.role?.toLowerCase().trim() || null);
        setProfession(profile?.profession || null);
      }

      setLoading(false);
    };

    fetchData();

  }, [id]);

  // 🔹 APPLY JOB
  const applyJob = async () => {

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

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

    // 🔍 CHECK EXISTING
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

    // 📥 INSERT
    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: id,
        user_id: user.id,
        status: "pending",
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Application submitted ✅");
    }

    setApplying(false);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading job...</p>
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
    <div className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">

        {/* TITLE */}
        <h1 className="text-4xl font-semibold">
          {job.title}
        </h1>

        {/* BASIC INFO */}
        <p className="text-gray-500 mt-2 text-lg">
          {job.hospital_name} • {job.location}
        </p>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">

          <div className="p-4 border rounded-xl">
            <p className="text-sm text-gray-400">Salary</p>
            <p className="font-medium">
              {job.salary || "Not disclosed"}
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <p className="text-sm text-gray-400">Experience</p>
            <p className="font-medium">
              {job.experience || "N/A"}
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <p className="text-sm text-gray-400">Job Type</p>
            <p className="font-medium">
              {job.type || "N/A"}
            </p>
          </div>

        </div>

        {/* PROFESSION */}
        {job.profession && (
          <div className="mt-6">
            <p className="text-sm text-gray-400">Profession Required</p>
            <p className="font-medium">{job.profession}</p>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">
            {job.description}
          </p>
        </div>

        {/* RESPONSIBILITIES */}
        {job.responsibilities && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">
              Responsibilities
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {job.responsibilities.split(",").map((item: string, i: number) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* REQUIREMENTS */}
        {job.requirements && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">
              Requirements
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              {job.requirements.split(",").map((item: string, i: number) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ APPLY BUTTON (FINAL FIX) */}
        {role && role !== "admin" && (
          <button
            onClick={applyJob}
            disabled={applying}
            className="mt-10 w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}

        {/* ADMIN BLOCK */}
        {role === "admin" && (
          <p className="mt-10 text-center text-gray-500">
            Admin cannot apply for this job
          </p>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-green-600 text-center">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
