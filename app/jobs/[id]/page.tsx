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

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      // FETCH JOB
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
      }

      setJob(jobData);

      // GET USER ROLE
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

    fetchData();

  }, [id]);

  const applyJob = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (role === "admin") {
      setMessage("Admins cannot apply for jobs");
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
      setMessage("You already applied");
      setApplying(false);
      return;
    }

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
      setMessage("Application submitted successfully");
    }

    setApplying(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <div className="glass p-8 soft-shadow">

          <h1 className="text-4xl font-semibold">
            {job.title}
          </h1>

          <p className="mt-2 text-gray-500">
            {job.hospital_name} • {job.location}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="glass p-3 text-center">
              Salary: {job.salary || "Not disclosed"}
            </div>

            <div className="glass p-3 text-center">
              Exp: {job.experience || "N/A"}
            </div>

            <div className="glass p-3 text-center">
              Type: {job.type || "N/A"}
            </div>

          </div>

        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-10">

          <div className="md:col-span-2 space-y-6">

            <div className="glass p-6">
              <h2>Description</h2>
              <p>{job.description}</p>
            </div>

            {job.responsibilities && (
              <div className="glass p-6">
                <h2>Responsibilities</h2>
                <ul className="list-disc ml-5">
                  {job.responsibilities.split(",").map((r: string, i: number) => (
                    <li key={i}>{r.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && (
              <div className="glass p-6">
                <h2>Requirements</h2>
                <ul className="list-disc ml-5">
                  {job.requirements.split(",").map((r: string, i: number) => (
                    <li key={i}>{r.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <div className="glass p-6 h-fit">

            {role === "doctor" && (
              <button
                onClick={applyJob}
                disabled={applying}
                className="w-full btn-primary"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}

            {role === "admin" && (
              <p className="text-center text-gray-500">
                Admin cannot apply
              </p>
            )}

            {message && (
              <p className="mt-4 text-green-600 text-center">
                {message}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
