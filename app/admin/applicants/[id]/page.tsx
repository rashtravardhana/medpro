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
    if (jobId) fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId);

    if (error) {
      console.log("APPLICATION ERROR:", error);
      setLoading(false);
      return;
    }

    // 🔥 FETCH FULL PROFILE DATA
    const updated = await Promise.all(
      (data || []).map(async (app) => {

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role, profession, resume_url, avatar_url")
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
      <div className="p-10 text-center">
        <p className="text-gray-500 animate-pulse">
          Loading applicants...
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">

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
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >

            {/* 👤 PROFILE HEADER */}
            <div className="flex items-center gap-4">

              {/* AVATAR */}
              {app.profile?.avatar_url ? (
                <img
                  src={app.profile.avatar_url}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
              )}

              {/* NAME + PROFESSION */}
              <div>
                <p className="text-lg font-semibold">
                  {app.profile?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  {app.profile?.profession || "No profession"}
                </p>
              </div>

            </div>

            {/* 📊 STATUS */}
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

            {/* 📄 RESUME */}
            {app.profile?.resume_url ? (
              <a
                href={app.profile.resume_url}
                target="_blank"
                className="inline-block mt-4 text-blue-600 underline"
              >
                View Resume
              </a>
            ) : (
              <p className="text-gray-400 mt-4">
                No resume uploaded
              </p>
            )}

            {/* 🔗 PROFILE LINK */}
            <a
              href={`/admin/doctor/${app.user_id}`}
              className="block mt-2 text-indigo-600 underline"
            >
              View Full Profile
            </a>

            {/* 🎯 ACTION BUTTONS */}
            <div className="mt-5 flex gap-4">

              <button
                onClick={() => updateStatus(app.id, "accepted")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(app.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90"
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
