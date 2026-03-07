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

  // Fetch job details
  useEffect(() => {

    const fetchJob = async () => {

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
      }

      setJob(data);
      setLoading(false);
    };

    if (id) fetchJob();

  }, [id]);


  // Apply for job
  const applyJob = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    // If user not logged in
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", id)
      .eq("doctor_id", user.id)
      .single();

    if (existingApplication) {
      setMessage("You already applied to this job.");
      return;
    }

    // Insert application
    const { error } = await supabase
      .from("applications")
      .insert([
        {
          job_id: id,
          doctor_id: user.id,
          status: "pending",
        }
      ]);

    if (error) {
      console.log(error);
      setMessage("Application failed.");
    } else {
      setMessage("Application submitted successfully.");
    }

  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Loading job...</p>
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
