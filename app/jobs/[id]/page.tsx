"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setJob(data);
      }

      setLoading(false);
    };

    if (id) fetchJob();
  }, [id]);

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

        <h1 className="text-4xl font-semibold tracking-tight">
          {job.title}
        </h1>

        <p className="mt-3 text-neutral-500 text-lg">
          {job.hospital_name} • {job.location}
        </p>

        <div className="mt-10 text-neutral-700 leading-relaxed">
          {job.description}
        </div>

        <div className="mt-8 text-sm text-neutral-400">
          Salary: {job.salary}
        </div>

      </div>
    </div>
  );
}
