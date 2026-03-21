"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
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

          {user ? (
            <>
              <a href="/jobs" className="hover:text-black">Jobs</a>

              <a href="/applications" className="hover:text-black">
                Applications
              </a>

              <a href="/dashboard" className="hover:text-black">
                Dashboard
              </a>

              {/* ✅ ADMIN */}
              <a href="/admin/dashboard" className="hover:text-black">
                Admin
              </a>

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
          ) : (
            <a href="/auth" className="btn-primary">
              Login
            </a>
          )}

        </div>

      </div>
    </header>
  );
}
