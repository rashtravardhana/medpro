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
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // 🔹 FETCH DATA
  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // 📄 JOB
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(jobData);

      // 👤 USER
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {

        const userId = userData.user.id;

        // 🔐 ROLE
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        setRole(profile?.role?.toLowerCase().trim() || null);

        // 🔍 CHECK APPLICATION
        const { data: existing } = await supabase
          .from("applications")
          .select("id")
          .eq("job_id", id)
          .eq("user_id", userId)
          .maybeSingle();

        if (existing) setAlreadyApplied(true);
      }

      setLoading(false);
    };

    fetchData();

  }, [id]);

  // 🔹 APPLY
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

    if (alreadyApplied) {
      setMessage("You already applied");
      return;
    }

    setApplying(true);
    setMessage("");

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
      setMessage("✅ Application submitted successfully");
      setAlreadyApplied(true);
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
    <div className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* 🧾 HEADER CARD */}
        <div className="bg-white p-8 rounded-2xl shadow mb-6">

          <h1 className="text-4xl font-semibold">
            {job.title}
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            {job.hospital_name} • {job.location}
          </p>

          {/* TAGS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              💰 {job.salary || "Not disclosed"}
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              🧠 {job.experience || "N/A"}
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              🏷 {job.type || "N/A"}
            </span>

          </div>

        </div>

        {/* 📄 DETAILS */}
        <div className="bg-white p-8 rounded-2xl shadow space-y-8">

          {/* PROFESSION */}
          {job.profession && (
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Profession Required
              </h2>
              <p className="text-gray-700">{job.profession}</p>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Job Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          {job.responsibilities && (
            <div>
              <h2 className="text-lg font-semibold mb-1">
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
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Requirements
              </h2>
              <ul className="list-disc ml-5 space-y-1">
                {job.requirements.split(",").map((item: string, i: number) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 🚀 APPLY BAR (STICKY STYLE) */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow flex flex-col items-center">

          {role === "doctor" && (
            <button
              onClick={applyJob}
              disabled={applying || alreadyApplied}
              className={`w-full py-3 rounded-xl text-white font-medium transition
              ${
                alreadyApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:opacity-90"
              }`}
            >
              {alreadyApplied
                ? "Already Applied"
                : applying
                ? "Applying..."
                : "Apply Now"}
            </button>
          )}

          {role === "admin" && (
            <p className="text-gray-500">
              Admin cannot apply for jobs
            </p>
          )}

          {message && (
            <p className="mt-3 text-green-600 text-sm text-center">
              {message}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
