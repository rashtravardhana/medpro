"use client";

import { useEffect, useState, useRef } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 🔐 GET USER
  useEffect(() => {
    const getUserAndRole = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

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

  // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="/" className="text-lg font-semibold">
          MedCareer
        </a>

        <div className="flex gap-6 text-sm text-gray-700 items-center">

          {/* NOT LOGGED IN */}
          {!user && (
            <a
              href="/auth"
              className="px-5 py-2 bg-black text-white rounded-full hover:opacity-90"
            >
              Login
            </a>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              <a href="/jobs" className="hover:text-black">
                Jobs
              </a>

              {/* 👨‍⚕️ DOCTOR */}
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

              {/* 🏥 ADMIN */}
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

              {/* 👤 AVATAR DROPDOWN */}
              <div className="relative" ref={dropdownRef}>

                <img
                  src={avatarUrl || "https://via.placeholder.com/40"}
                  alt="avatar"
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
                />

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg overflow-hidden">

                    <a
                      href="/profile"
                      className="block px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </a>

                    <a
                      href={role === "admin" ? "/admin/dashboard" : "/dashboard"}
                      className="block px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
