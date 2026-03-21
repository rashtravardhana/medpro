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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <h1 className="text-lg font-semibold">
          MedCareer
        </h1>

        {/* NAV LINKS */}
        <div className="flex gap-6 text-sm text-gray-600">

          {user ? (
            <>
              <a href="/jobs">Jobs</a>
              <a href="/post-job">Post Job</a>
              <a href="/applications">Applications</a>

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
            <a href="/auth">Login</a>
          )}

        </div>

      </div>
    </header>
  );
}
