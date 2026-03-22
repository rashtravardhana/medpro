"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  // 🔹 FETCH JOB + ROLE
  useEffect(() => {

    const fetchData = async () => {

      // 📦 FETCH JOB
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
      }

      setJob(jobData);

      // 🔐 FETCH USER ROLE
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setRole(profile?.role || null);
      }

      setLoading(false);
    };

    if (id) fetchData();

  }, [id]);

  // 🔹 APPLY JOB
  const applyJob = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // ❌ BLOCK ADMIN
    if (role === "admin") {
      setMessage("Admins cannot apply for jobs.");
      return;
    }

    setApplying(true);
    setMessage("");

    // ✅ CHECK EXISTING
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("You already applied.");
      setApplying(false);
      return;
    }

    // ✅ INSERT
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
      setMessage("Application submitted successfully.");
    }

    setApplying(false);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading job...</p>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="glass p-8 soft-shadow fade-up">

          <h1 className="text-4xl font-semibold">
            {job.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {job.hospital_name} • {job.location}
          </p>

          {/* 🧾 HIGHLIGHTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Salary</p>
              <p className="font-semibold">
                {job.salary || "Not disclosed"}
              </p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Location</p>
              <p className="font-semibold">
                {job.location}
              </p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Experience</p>
              <p className="font-semibold">
                {job.experience || "Not specified"}
              </p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Type</p>
              <p className="font-semibold">
                {job.type || "Not specified"}
              </p>
            </div>

          </div>

        </div>

        {/* 📄 DETAILS */}
        <div className="mt-10 grid md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {/* DESCRIPTION */}
            <div className="glass p-6 soft-shadow">
              <h2 className="font-semibold mb-2">
                About this role
              </h2>
              <p className="text-gray-700">
                {job.description}
              </p>
            </div>

            {/* RESPONSIBILITIES */}
            {job.responsibilities && (
              <div className="glass p-6 soft-shadow">
                <h2 className="font-semibold mb-2">
                  Responsibilities
                </h2>

                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                  {job.responsibilities.split(",").map((r: string, i: number) => (
                    <li key={i}>{r.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* REQUIREMENTS */}
            {job.requirements && (
              <div className="glass p-6 soft-shadow">
                <h2 className="font-semibold mb-2">
                  Requirements
                </h2>

                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                  {job.requirements.split(",").map((r: string, i: number) => (
                    <li key={i}>{r.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* RIGHT (APPLY BOX) */}
          <div className="glass p-6 soft-shadow h-fit">

            {/* 👨‍⚕️ DOCTOR */}
            {role === "doctor" && (
              <button
                onClick={applyJob}
                disabled={applying}
                className="w-full btn-primary disabled:opacity-50"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}

            {/* 🏥 ADMIN */}
            {role === "admin" && (
              <p className="text-center text-gray-500">
                Admin cannot apply for jobs
              </p>
            )}

            {/* MESSAGE */}
            {message && (
              <p className="mt-4 text-green-600 text-center text-sm">
                {message}
              </p>
            )}

            <p className="mt-6 text-sm text-gray-400 text-center">
              Apply securely through MedCareer
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
