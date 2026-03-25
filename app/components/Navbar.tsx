"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation"; // ✅ ADD

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter(); // ✅ ADD

  useEffect(() => {

    const getUserAndRole = async () => {

      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      // 🔥 GET ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      setRole(profile?.role?.toLowerCase().trim() || null);
    };

    getUserAndRole();

  }, []);

  // 🔥 LOGOUT FUNCTION (FIXED)
  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null); // optional instant UI update

    router.push("/auth"); // ✅ REDIRECT TO LOGIN
  };

  return (
    <header className="sticky top-0 z-50 glass soft-shadow">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        <a href="/" className="text-lg font-semibold">
          MedCareer
        </a>

        <div className="flex gap-6 text-sm text-gray-600 items-center">

          {!user && (
            <a href="/auth" className="btn-primary">
              Login
            </a>
          )}

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

              {/* ✅ FIXED LOGOUT */}
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
