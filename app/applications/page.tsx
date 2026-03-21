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

      // ✅ FETCH ONLY USER APPLICATIONS
      const { data: apps, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", currentUser.id);

      if (error) {
        console.log("Error:", error.message);
      }

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, []);

  // ✅ LOADING SCREEN (NO GAP ISSUE)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-semibold mb-10 text-center">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border p-5 rounded-lg shadow-sm"
              >
                <p><strong>Job ID:</strong> {app.job_id}</p>
                <p><strong>Status:</strong> {app.status}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
