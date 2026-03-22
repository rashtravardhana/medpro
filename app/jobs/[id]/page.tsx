"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  // 📦 FETCH JOB
  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.log(error);

      setJob(data);
      setLoading(false);
    };

    if (id) fetchJob();
  }, [id]);

  // 📝 APPLY JOB (FIXED)
  const applyJob = async () => {

    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setApplying(true);

    // ✅ CHECK ALREADY APPLIED
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id) // ✅ FIXED
      .maybeSingle();

    if (existing) {
      setMessage("You already applied to this job.");
      setApplying(false);
      return;
    }

    // ✅ INSERT
    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: id,
        user_id: user.id, // ✅ FIXED
        status: "pending"
      });

    if (error) {
      console.log(error);
      setMessage(error.message);
    } else {
      setMessage("Application submitted successfully.");
    }

    setApplying(false);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading job...</p>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-3xl mx-auto glass soft-shadow p-8 fade-up">

        <h1 className="text-4xl font-semibold">
          {job.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {job.hospital_name} • {job.location}
        </p>

        <p className="mt-6 text-lg">
          {job.description}
        </p>

        <div className="mt-6 space-y-2 text-gray-600">
          <p>💰 Salary: {job.salary || "Not disclosed"}</p>
          <p>🩺 Profession: {job.profession}</p>
        </div>

        <button
          onClick={applyJob}
          disabled={applying}
          className="mt-10 btn-primary w-full"
        >
          {applying ? "Applying..." : "Apply Now"}
        </button>

        {message && (
          <p className="mt-6 text-center text-green-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
