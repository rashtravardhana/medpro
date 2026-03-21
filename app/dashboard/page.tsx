"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UserDashboard() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const checkUserAndFetch = async () => {

      // 🔐 GET USER
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      // 🔥 CHECK ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // ❌ IF ADMIN → REDIRECT
      if (profile?.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // ✅ FETCH APPLICATIONS
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          My Dashboard
        </h1>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications yet.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="glass soft-shadow p-6 mb-4"
            >
              <p><strong>Job ID:</strong> {app.job_id}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}
