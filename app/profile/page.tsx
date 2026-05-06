"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  // 🔹 Profile fields
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 🔹 Resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 LOAD PROFILE
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("name, profession, avatar_url, resume_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name || "");
        setProfession(data.profession || "");
        setAvatarUrl(data.avatar_url || null);
        setResumeUrl(data.resume_url || "");
      }
    };

    getProfile();
  }, []);

  // 🚀 SAVE PROFILE
  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    let newAvatarUrl = avatarUrl;
    let newResumeUrl = resumeUrl;

    // 🔹 UPLOAD AVATAR
    if (avatar) {
      const filePath = `${user.id}/${Date.now()}-${avatar.name}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      newAvatarUrl = data.publicUrl;
    }

    // 🔹 UPLOAD RESUME
    if (resumeFile) {
      if (resumeFile.type !== "application/pdf") {
        setMessage("Only PDF allowed");
        setLoading(false);
        return;
      }

      const filePath = `${user.id}/${Date.now()}-${resumeFile.name}`;

      const { error } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile);

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      newResumeUrl = data.publicUrl;
    }

    // 🔹 UPDATE PROFILE
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        profession,
        avatar_url: newAvatarUrl,
        resume_url: newResumeUrl,
      })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Profile updated successfully");
      setAvatarUrl(newAvatarUrl);
      setResumeUrl(newResumeUrl);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6">
          Edit Profile
        </h1>

        {/* 👤 AVATAR */}
        <div className="text-center mb-6">
          <img
            src={avatarUrl || "https://via.placeholder.com/120"}
            className="w-28 h-28 rounded-full object-cover mx-auto mb-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setAvatar(e.target.files?.[0] || null)
            }
          />
        </div>

        {/* 🧾 NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {/* 🧑‍⚕️ PROFESSION */}
        <input
          type="text"
          placeholder="Profession (MBBS, BDS...)"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full border p-3 rounded mb-6"
        />

        {/* 📄 RESUME */}
        <div className="mb-4">
          <p className="mb-2 font-medium">Resume (PDF)</p>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              className="block mb-2 text-blue-600 underline"
            >
              View Current Resume
            </a>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResumeFile(e.target.files?.[0] || null)
            }
          />
        </div>

        {/* 💾 SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3 rounded mt-4"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {/* 📢 MESSAGE */}
        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
