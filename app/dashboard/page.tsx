"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UserDashboard() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

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

      // 🔐 GET PROFILE
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("PROFILE ERROR:", profileError);
      }

      const role = profile?.role?.toLowerCase().trim();

      setUserName(profile?.name || "User");

      // 🚫 ADMIN REDIRECT
      if (role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // 📥 FETCH APPLICATIONS + JOB DATA
      const { data: apps, error: appsError } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          created_at,
          jobs (
            title,
            hospital_name,
            location,
            salary
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (appsError) {
        console.log("APPLICATION ERROR:", appsError);
      }

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, [router]);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* 👤 HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome, {userName}
          </h1>
          <p className="text-gray-500 mt-2">
            Track your job applications
          </p>
        </div>

        {/* ❌ EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">
              You haven’t applied to any jobs yet.
            </p>

            <a
              href="/jobs"
              className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full hover:scale-105 transition"
            >
              Explore Jobs
            </a>
          </div>
        ) : (

          /* ✅ APPLICATION LIST */
          <div className="space-y-6">

            {applications.map((app) => (

              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >

                {/* JOB TITLE */}
                <h2 className="text-xl font-semibold">
                  {app.jobs?.title || "Untitled Job"}
                </h2>

                {/* HOSPITAL */}
                <p className="text-gray-500">
                  {app.jobs?.hospital_name}
                </p>

                {/* DETAILS */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📍 {app.jobs?.location}</p>
                  <p>💰 {app.jobs?.salary || "Not disclosed"}</p>
                </div>

                {/* STATUS */}
                <div className="mt-4 flex justify-between items-center">

                  <span className="text-sm text-gray-500">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </span>

                  <span className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}>
                    {app.status}
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}
