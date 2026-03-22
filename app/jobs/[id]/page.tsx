"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function JobDetail() {

  const { id } = useParams();

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      // job
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(data);

      // role
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        setRole(profile?.role);
      }

      setLoading(false);
    };

    if (id) fetchData();

  }, [id]);

  const applyJob = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

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

    await supabase.from("applications").insert({
      job_id: id,
      user_id: user.id,
      status: "pending"
    });

    setMessage("Application submitted");
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <div className="glass p-8 soft-shadow">

          <h1 className="text-4xl font-semibold">{job.title}</h1>

          <p className="text-gray-500 mt-2">
            {job.hospital_name} • {job.location}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="glass p-3 text-center">
              Salary: {job.salary}
            </div>

            <div className="glass p-3 text-center">
              Exp: {job.experience || "N/A"}
            </div>

            <div className="glass p-3 text-center">
              Type: {job.type || "N/A"}
            </div>

          </div>

        </div>

        {/* DETAILS */}
        <div className="mt-10 grid md:grid-cols-3 gap-10">

          <div className="md:col-span-2 space-y-6">

            <div className="glass p-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p>{job.description}</p>
            </div>

            {job.responsibilities && (
              <div className="glass p-6">
                <h2 className="font-semibold mb-2">Responsibilities</h2>
                <ul className="list-disc ml-5">
                  {job.responsibilities.split(",").map((r:any,i:any)=>(
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && (
              <div className="glass p-6">
                <h2 className="font-semibold mb-2">Requirements</h2>
                <ul className="list-disc ml-5">
                  {job.requirements.split(",").map((r:any,i:any)=>(
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* APPLY BOX */}
          {role === "doctor" && (
            <div className="glass p-6 h-fit">

              <button
                onClick={applyJob}
                className="w-full btn-primary"
              >
                Apply Now
              </button>

              {message && (
                <p className="mt-4 text-green-600 text-center">
                  {message}
                </p>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
