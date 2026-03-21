"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndRole = async () => {

      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      // ✅ FETCH ROLE FROM PROFILES TABLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      if (profile) {
        setRole(profile.role);
      }
    };

    getUserAndRole();
  }, []);

  return (
    <header className="sticky top-0 z-50 glass soft-shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="/" className="text-lg font-semibold tracking-tight">
          MedCareer
        </a>

        {/* NAV */}
        <div className="flex gap-6 text-sm text-gray-600 items-center">

          {!user && (
            <a href="/auth" className="btn-primary">
              Login
            </a>
          )}

          {user && (
            <>
              <a href="/jobs" className="hover:text-black">Jobs</a>

              {/* 👨‍⚕️ DOCTOR ONLY */}
              {role === "doctor" && (
                <>
                  <a href="/dashboard" className="hover:text-black">
                    Dashboard
                  </a>

                  <a href="/applications" className="hover:text-black">
                    Applications
                  </a>
                </>
              )}

              {/* 🏥 ADMIN ONLY */}
              {role === "admin" && (
                <>
                  <a href="/admin/dashboard" className="hover:text-black">
                    Admin
                  </a>

                  <a href="/post-job" className="hover:text-black">
                    Post Job
                  </a>
                </>
              )}

              {/* LOGOUT */}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
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
