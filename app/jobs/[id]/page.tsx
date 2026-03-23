"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {
  const params = useParams();

  // ✅ FORCE STRING (FIXES BUILD ERROR)
  const id = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string);

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.log(error);

      setJob(jobData);

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

    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("Already applied");
      setApplying(false);
      return;
    }

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
      setMessage("Application submitted");
    }

    setApplying(false);
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!job) return <p className="p-10">Job not found</p>;

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-semibold">{job.title}</h1>

        <p className="text-gray-500 mt-2">
          {job.hospital_name} • {job.location}
        </p>

        <p className="mt-4">
          💰 {job.salary || "Not disclosed"}
        </p>

        <p className="mt-6">{job.description}</p>

        {role === "doctor" && (
          <button
            onClick={applyJob}
            disabled={applying}
            className="mt-6 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply Now"}
          </button>
        )}

        {role === "admin" && (
          <p className="mt-6 text-gray-500">
            Admin cannot apply for jobs
          </p>
        )}

        {message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
