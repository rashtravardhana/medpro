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

      const { data, error } = await supabase
        .from("profiles")
        .select("name, role, profession, resume_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.log("PROFILE ERROR:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();

  }, [userId]);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-semibold mb-6">
        Doctor Profile
      </h1>

      <div className="border p-6 rounded-lg space-y-4">

        <p>
          <strong>Name:</strong> {profile.name}
        </p>

        <p>
          <strong>Role:</strong> {profile.role}
        </p>

        <p>
          <strong>Profession:</strong> {profile.profession}
        </p>

        {/* 📄 RESUME */}
        {profile.resume_url ? (
          <a
            href={profile.resume_url}
            target="_blank"
            className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"
          >
            View Resume
          </a>
        ) : (
          <p className="text-gray-500 mt-4">
            No resume uploaded
          </p>
        )}

      </div>

    </div>
  );
}
