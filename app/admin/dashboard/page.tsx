"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const checkAdmin = async () => {

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
      setLoading(false);
    };

    checkAdmin();

  }, [router]);

  if (loading) {
    return <p className="p-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl mb-6">Admin Dashboard</h1>

      <a href="/post-job" className="btn-primary">
        Post Job
      </a>

      <div className="mt-8 space-y-4">

        {jobs.length === 0 && <p>No jobs yet</p>}

        {jobs.map(job => (
          <div key={job.id} className="glass p-4">
            <h2>{job.title}</h2>
            <p>{job.location}</p>
          </div>
        ))}

      </div>
    </div>
  );
}
