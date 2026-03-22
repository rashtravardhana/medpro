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

  // 🔹 FETCH JOB
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

  // 🔹 APPLY JOB
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

  // ⏳ LOADING
  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  if (!job) {
    return <p className="p-10">Job not found</p>;
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="glass p-8 soft-shadow fade-up">

          <h1 className="text-4xl font-semibold">
            {job.title}
          </h1>

          <p className="mt-3 text-gray-500">
            {job.hospital_name} • {job.location}
          </p>

          {/* 🧾 HIGHLIGHTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Salary</p>
              <p className="font-semibold">
                {job.salary || "Not disclosed"}
              </p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Location</p>
              <p className="font-semibold">{job.location}</p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Experience</p>
              <p className="font-semibold">
                {job.experience || "0-3 yrs"}
              </p>
            </div>

            <div className="glass p-4 text-center">
              <p className="text-gray-400 text-sm">Type</p>
              <p className="font-semibold">
                {job.type || "Full-time"}
              </p>
            </div>

          </div>

        </div>

        {/* 📄 JOB DETAILS */}
        <div className="mt-10 grid md:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-8">

            {/* ABOUT */}
            <div className="glass p-6 soft-shadow">
              <h2 className="text-xl font-semibold mb-3">
                About this role
              </h2>
              <p className="text-gray-700">
                {job.description}
              </p>
            </div>

            {/* RESPONSIBILITIES */}
            <div className="glass p-6 soft-shadow">
              <h2 className="text-xl font-semibold mb-3">
                Responsibilities
              </h2>

              <ul className="list-disc ml-5 text-gray-700 space-y-2">
                <li>Provide patient consultations</li>
                <li>Maintain medical records</li>
                <li>Work with hospital staff</li>
                <li>Ensure quality care</li>
              </ul>
            </div>

            {/* REQUIREMENTS */}
            <div className="glass p-6 soft-shadow">
              <h2 className="text-xl font-semibold mb-3">
                Requirements
              </h2>

              <ul className="list-disc ml-5 text-gray-700 space-y-2">
                <li>Valid medical degree</li>
                <li>Registration with medical council</li>
                <li>Good communication skills</li>
                <li>Relevant experience preferred</li>
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE (APPLY BOX) */}
          <div className="glass p-6 soft-shadow h-fit">

            <button
              onClick={applyJob}
              className="w-full py-3 bg-black text-white rounded-full hover:opacity-80 transition"
            >
              Apply Now
            </button>

            {message && (
              <p className="mt-4 text-green-600 text-sm text-center">
                {message}
              </p>
            )}

            <p className="mt-6 text-sm text-gray-500 text-center">
              Apply securely through MedCareer
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
