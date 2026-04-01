"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ApplicationsPage() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkUserAndFetch = async () => {

      // 🔐 CHECK LOGIN
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        window.location.href = "/auth";
        return;
      }

      // ✅ FETCH APPLICATIONS + JOB DETAILS (IMPORTANT FIX)
      const { data: apps, error } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          created_at,
          jobs (
            id,
            title,
            hospital_name,
            location,
            salary
          )
        `)
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error:", error.message);
      }

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, []);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10 text-center">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications yet.
          </p>
        ) : (
          <div className="space-y-6">

            {applications.map((app) => (

              <div
                key={app.id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >

                {/* ✅ JOB TITLE */}
                <h2 className="text-xl font-semibold">
                  {app.jobs?.title || "Untitled Job"}
                </h2>

                {/* 🏥 HOSPITAL */}
                <p className="text-gray-500">
                  {app.jobs?.hospital_name}
                </p>

                {/* 📍 DETAILS */}
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>📍 {app.jobs?.location}</p>
                  <p>💰 {app.jobs?.salary || "Not disclosed"}</p>
                </div>

                {/* 📅 STATUS */}
                <div className="mt-4 flex justify-between items-center">

                  <span className="text-sm text-gray-500">
                    Applied on{" "}
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>

                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {app.status}
                  </span>

                </div>

                {/* 🔗 VIEW JOB (optional) */}
                <a
                  href={`/jobs/${app.jobs?.id}`}
                  className="inline-block mt-4 text-blue-600 underline"
                >
                  View Job
                </a>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}
