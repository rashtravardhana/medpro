"use client";

import { useEffect, useState } from "react";

import supabase from "@/lib/supabase";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");

  const [profession, setProfession] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // 🔐 LOAD USER + PROFILE

  useEffect(() => {

    const getProfile = async () => {

      const { data } = await supabase.auth.getUser();

      const currentUser = data?.user;

      if (!currentUser) {

        window.location.href = "/auth";

        return;

      }

      setUser(currentUser);

      const { data: profile } = await supabase

        .from("profiles")

        .select("name, profession, avatar_url")

        .eq("id", currentUser.id)

        .single();

      if (profile) {

        setName(profile.name || "");

        setProfession(profile.profession || "");

        setAvatarUrl(profile.avatar_url || "");

      }

    };

    getProfile();

  }, []);

  // 📄 UPLOAD RESUME

  const uploadResume = async () => {

    if (!resumeFile || !user) {

      alert("Select resume");

      return;

    }

    const filePath = `${user.id}/${Date.now()}-${resumeFile.name}`;

    const { error } = await supabase.storage

      .from("resumes")

      .upload(filePath, resumeFile);

    if (error) {

      alert(error.message);

      return;

    }

    const { data } = supabase.storage

      .from("resumes")

      .getPublicUrl(filePath);

    await supabase

      .from("profiles")

      .update({ resume_url: data.publicUrl })

      .eq("id", user.id);

    alert("✅ Resume uploaded");

  };

  // 🖼 UPLOAD AVATAR

  const uploadAvatar = async () => {

    if (!avatarFile || !user) return avatarUrl;

    const fileExt = avatarFile.name.split(".").pop();

    const fileName = `${user.id}.${fileExt}`;

    const { error } = await supabase.storage

      .from("avatars")

      .upload(fileName, avatarFile, {

        upsert: true,

      });

    if (error) {

      console.log(error);

      return avatarUrl;

    }

    const { data } = supabase.storage

      .from("avatars")

      .getPublicUrl(fileName);

    return data.publicUrl;

  };

  // 💾 SAVE PROFILE

  const handleSave = async () => {

    setLoading(true);

    setMessage("Saving...");

    let finalAvatar = avatarUrl;

    if (avatarFile) {

      const uploaded = await uploadAvatar();

      if (uploaded) finalAvatar = uploaded;

    }

    const { error } = await supabase

      .from("profiles")

      .update({

        name,

        profession,

        avatar_url: finalAvatar

      })

      .eq("id", user.id);

    if (error) {

      setMessage("❌ Error saving");

    } else {

      setMessage("✅ Profile updated");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen px-6 py-20 bg-gray-50">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-semibold mb-6 text-center">

          My Profile

        </h1>

        {/* 🖼 AVATAR */}

        <div className="flex flex-col items-center mb-6">

          {avatarUrl && (

            <img

              src={avatarUrl}

              className="w-24 h-24 rounded-full object-cover mb-4"

            />

          )}

          <input

            type="file"

            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}

          />

        </div>

        {/* NAME */}

        <input

          type="text"

          placeholder="Full Name"

          className="w-full border p-3 rounded mb-4"

          value={name}

          onChange={(e) => setName(e.target.value)}

        />

        {/* PROFESSION */}

        <input

          type="text"

          placeholder="Profession"

          className="w-full border p-3 rounded mb-6"

          value={profession}

          onChange={(e) => setProfession(e.target.value)}

        />

        {/* SAVE BUTTON */}

        <button

          onClick={handleSave}

          className="w-full bg-black text-white py-3 rounded-full mb-6"

        >

          {loading ? "Saving..." : "Save Profile"}

        </button>

        {/* 📄 RESUME */}

        <div className="border-t pt-6">

          <h2 className="text-lg font-semibold mb-3">

            Upload Resume

          </h2>

          <input

            type="file"

            accept=".pdf"

            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}

          />

          <button

            onClick={uploadResume}

            className="mt-4 bg-black text-white px-6 py-2 rounded"

          >

            Upload Resume

          </button>

        </div>

        {/* MESSAGE */}

        {message && (

          <p className="mt-4 text-center text-sm text-gray-600">

            {message}

          </p>

        )}

      </div>

    </div>

  );

}
