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

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // JOB
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(data);

      // ROLE
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
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

    // ❌ ADMIN BLOCK
    if (role === "admin") {
      setMessage("Admins cannot apply");
      return;
    }

    // CHECK
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("Already applied");
      return;
    }

    // INSERT
    await supabase.from("applications").insert({
      job_id: id,
      user_id: user.id,
      status: "pending"
    });

    setMessage("Application submitted");
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!job) return <p className="p-10">Job not found</p>;

  return (
    <div className="min-h-screen p-10">

      <h1 className="text-3xl font-bold">{job.title}</h1>

      <p className="text-gray-500">
        {job.hospital_name} • {job.location}
      </p>

      <p className="mt-4">
        Salary: {job.salary || "Not disclosed"}
      </p>

      <p className="mt-6">{job.description}</p>

      {/* 👨‍⚕️ ONLY DOCTOR */}
      {role === "doctor" && (
        <button
          onClick={applyJob}
          className="mt-6 bg-black text-white px-6 py-2 rounded"
        >
          Apply Now
        </button>
      )}

      {/* 🏥 ADMIN BLOCK */}
      {role === "admin" && (
        <p className="mt-6 text-gray-500">
          Admin cannot apply
        </p>
      )}

      {message && (
        <p className="mt-4 text-green-600">
          {message}
        </p>
      )}

    </div>
  );
}
