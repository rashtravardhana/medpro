"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function JobsPage() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {

    const init = async () => {

      // 🔐 GET USER
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

      // 📦 GET JOBS
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      setJobs(data || []);
      setLoading(false);
    };

    init();

  }, []);

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl mb-10">Available Jobs</h1>

        <div className="space-y-6">

          {jobs.map((job) => (
            <div key={job.id} className="glass p-6">

              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.hospital_name}</p>
              <p>📍 {job.location}</p>
              <p>💰 {job.salary}</p>

              {/* 👨‍⚕️ DOCTOR ONLY */}
              {role === "doctor" && (
                <a
                  href={`/jobs/${job.id}`}
                  className="mt-4 inline-block btn-primary"
                >
                  View & Apply
                </a>
              )}

              {/* 🏥 ADMIN ONLY */}
              {role === "admin" && (
                <a
                  href={`/jobs/${job.id}`}
                  className="mt-4 inline-block btn-secondary"
                >
                  View Details
                </a>
              )}

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
