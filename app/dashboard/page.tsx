"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import useAuth from "@/lib/useAuth";

export default function UserDashboard() {

  // ✅ AUTH
  const { user, loading } = useAuth("doctor");

  const [applications, setApplications] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [uploading, setUploading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });

  // 🔹 FETCH DATA
  useEffect(() => {

    if (!user) return;

    const fetchData = async () => {

      // 👤 PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.name || "User");

      // 📄 APPLICATIONS
      const { data: apps } = await supabase
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

      const list = apps || [];
      setApplications(list);

      // 📊 STATS
      setStats({
        total: list.length,
        accepted: list.filter(a => a.status === "accepted").length,
        pending: list.filter(a => a.status === "pending").length,
        rejected: list.filter(a => a.status === "rejected").length
      });

      setDataLoading(false);
    };

    fetchData();

  }, [user]);

  // 🔹 RESUME UPLOAD
  const handleUploadResume = async (e: any) => {

    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const fileName = `${user.id}.pdf`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({ resume_url: data.publicUrl })
      .eq("id", user.id);

    alert("Resume uploaded ✅");
    setUploading(false);
  };

  // 🎨 STATUS STYLE
  const getStatusStyle = (status: string) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // ⏳ AUTH LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // ⏳ DATA LOADING
  if (dataLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="max-w-6xl mx-auto">

        {/* 👋 HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold">
            Welcome, {userName}
          </h1>
          <p className="text-gray-500 mt-2">
            Track your job applications
          </p>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Total</p>
            <h2 className="text-2xl font-semibold">{stats.total}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Accepted</p>
            <h2 className="text-2xl font-semibold text-green-600">
              {stats.accepted}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-2xl font-semibold text-yellow-600">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Rejected</p>
            <h2 className="text-2xl font-semibold text-red-600">
              {stats.rejected}
            </h2>
          </div>

        </div>

        {/* 📄 RESUME */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow text-center">

          <h2 className="text-lg font-semibold mb-3">
            Upload Resume (PDF)
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={handleUploadResume}
          />

          {uploading && (
            <p className="text-gray-500 mt-2">Uploading...</p>
          )}

        </div>

        {/* ❌ EMPTY */}
        {applications.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-500 text-lg">
              You haven’t applied to any jobs yet.
            </p>

            <a
              href="/jobs"
              className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full"
            >
              Explore Jobs
            </a>
          </div>
        ) : (

          <div className="space-y-6">

            {applications.map((app) => (

              <div
                key={app.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >

                <h2 className="text-xl font-semibold">
                  {app.jobs?.title || "Untitled Job"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {app.jobs?.hospital_name}
                </p>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📍 {app.jobs?.location}</p>
                  <p>💰 {app.jobs?.salary || "Not disclosed"}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">

                  <span className="text-sm text-gray-400">
                    Applied on{" "}
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle(app.status)}`}
                  >
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
