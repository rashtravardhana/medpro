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

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(data);
      setLoading(false);
    };

    if (id) fetchJob();
  }, [id]);

  const applyJob = async () => {
    const { error } = await supabase.from("applications").insert([
      {
        job_id: id,
        doctor_id: crypto.randomUUID(),
        status: "pending",
      },
    ]);

    if (error) {
      setMessage("Application failed");
    } else {
      setMessage("Application submitted successfully");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-semibold">
          {job.title}
        </h1>

        <p className="mt-3 text-neutral-500">
          {job.hospital_name} • {job.location}
        </p>

        <p className="mt-8 text-neutral-700">
          {job.description}
        </p>

        <p className="mt-6 text-sm text-neutral-400">
          Salary: {job.salary}
        </p>

        <button
          onClick={applyJob}
          className="mt-10 px-6 py-3 bg-black text-white rounded-full hover:opacity-80 transition"
        >
          Apply Now
        </button>

        {message && (
          <p className="mt-6 text-green-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
