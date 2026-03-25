"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function ApplicantsPage() {

  const params = useParams();
  const jobId = params?.id as string;

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {

    setLoading(true);

    // ✅ SIMPLE QUERY (NO JOIN = NO ERROR)
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId);

    if (error) {
      console.log("APPLICATION ERROR:", error);
      setLoading(false); // ✅ IMPORTANT FIX
      return;
    }

    // 🔥 FETCH PROFILE MANUALLY
    const updated = await Promise.all(
      (data || []).map(async (app) => {

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", app.user_id)
          .maybeSingle();

        return {
          ...app,
          profile
        };
      })
    );

    setApplications(updated);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-semibold mb-8">
        Job Applicants
      </h1>

      {applications.length === 0 && (
        <p className="text-neutral-500">
          No applications yet
        </p>
      )}

      <div className="space-y-6">

        {applications.map((app) => (

          <div
            key={app.id}
            className="border p-6 rounded-lg"
          >

            <p className="text-lg font-semibold">
              Doctor: {app.profile?.name || "Unknown"}
            </p>

            <p className="text-neutral-500 mt-1">
              Role: {app.profile?.role || "N/A"}
            </p>

            <p className="mt-2">
              Status: {app.status}
            </p>

            <div className="mt-4 space-x-4">

              <button
                onClick={() => updateStatus(app.id, "accepted")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(app.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
