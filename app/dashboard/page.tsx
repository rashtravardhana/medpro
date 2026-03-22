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

      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      // ✅ CHECK ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // ✅ FETCH APPLICATIONS + JOB DATA
      const { data: apps } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          jobs (
            title,
            hospital_name,
            location,
            salary
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, [router]);

  // ⏳ LOADING
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

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10 text-center">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t applied to any jobs yet.
          </p>
        ) : (
          <div className="space-y-6">

            {applications.map((app) => (
              <div
                key={app.id}
                className="glass soft-shadow p-6 fade-up"
              >

                <h2 className="text-xl font-semibold">
                  {app.jobs?.title}
                </h2>

                <p className="text-gray-500">
                  {app.jobs?.hospital_name}
                </p>

                <p className="mt-2 text-sm">
                  📍 {app.jobs?.location}
                </p>

                <p className="text-sm">
                  💰 {app.jobs?.salary || "Not disclosed"}
                </p>

                <p className="mt-4 text-sm">
                  Status:{" "}
                  <span className="font-semibold text-blue-600">
                    {app.status}
                  </span>
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
