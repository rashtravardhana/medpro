"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

export default function DoctorProfile() {

  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!userId) return;

    const fetchProfile = async () => {

      // 🔥 CLEAN ID (VERY IMPORTANT)
      const cleanId = String(userId).trim();

      console.log("FETCHING ID:", cleanId);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, role, profession, resume_url")
        .eq("id", cleanId)
        .maybeSingle();

      console.log("PROFILE DATA:", data);
      console.log("PROFILE ERROR:", error);

      if (error) {
        console.log("PROFILE ERROR:", error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();

  }, [userId]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!profile) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 text-lg">
          ❌ Profile not found
        </p>
        <p className="text-gray-400 mt-2">
          Check Supabase RLS policy or ID
        </p>
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-10">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          Doctor Profile
        </h1>

        <div className="space-y-4 text-lg">

          <p>
            <strong>Name:</strong> {profile.name || "N/A"}
          </p>

          <p>
            <strong>Role:</strong> {profile.role || "N/A"}
          </p>

          <p>
            <strong>Profession:</strong> {profile.profession || "N/A"}
          </p>

        </div>

        {/* 📄 RESUME */}
        <div className="mt-8 text-center">

          {profile.resume_url ? (
            <a
              href={profile.resume_url}
              target="_blank"
              className="inline-block bg-black text-white px-6 py-3 rounded-full hover:scale-105 transition"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-500">
              No resume uploaded
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
