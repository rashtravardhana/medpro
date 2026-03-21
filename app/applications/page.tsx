"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ApplicationsPage() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const checkUserAndFetch = async () => {

      // 🔐 CHECK LOGIN
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        // ❌ NOT LOGGED IN → REDIRECT
        window.location.href = "/auth";
        return;
      }

      setUser(currentUser);

      // ✅ FETCH ONLY USER APPLICATIONS
      const { data: apps, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", currentUser.id); // IMPORTANT

      if (error) {
        console.log(error);
      }

      setApplications(apps || []);
      setLoading(false);
    };

    checkUserAndFetch();

  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications yet.
          </p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="border p-4 rounded-lg mb-4">
              <p><strong>Job ID:</strong> {app.job_id}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}
