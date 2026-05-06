"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {

    const getUserAndRole = async () => {

      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      // 🔥 GET ROLE + AVATAR
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, avatar_url")
        .eq("id", currentUser.id)
        .single();

      setRole(profile?.role?.toLowerCase().trim() || null);
      setAvatarUrl(profile?.avatar_url || null);
    };

    getUserAndRole();

  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 glass soft-shadow bg-white">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="/" className="text-lg font-semibold">
          MedCareer
        </a>

        <div className="flex gap-6 text-sm text-gray-600 items-center">

          {/* NOT LOGGED IN */}
          {!user && (
            <a href="/auth" className="btn-primary">
              Login
            </a>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              <a href="/jobs">Jobs</a>

              {/* 👨‍⚕️ DOCTOR */}
              {role === "doctor" && (
                <>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/applications">Applications</a>
                </>
              )}

              {/* 🏥 ADMIN */}
              {role === "admin" && (
                <>
                  <a href="/admin/dashboard">Admin</a>
                  <a href="/post-job">Post Job</a>
                </>
              )}

              {/* ✅ PROFILE (NEW) */}
              <a href="/profile">
                <img
                  src={avatarUrl || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </a>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
