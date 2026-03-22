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

  // Fetch job
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

  // Apply job
  const applyJob = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // check existing
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("You already applied.");
      return;
    }

    // insert
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

  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-semibold">
          {job.title}
        </h1>

        <p className="mt-3 text-gray-500">
          {job.hospital_name} • {job.location}
        </p>

        <p className="mt-6">
          💰 {job.salary}
        </p>

        <p className="mt-8 text-gray-700">
          {job.description}
        </p>

        <button
          onClick={applyJob}
          className="mt-10 px-6 py-3 bg-black text-white rounded-full"
        >
          Apply Now
        </button>

        {message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
