"use client";

import { useEffect, useState, useRef } from "react";
import supabase from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); // ✅ ACTIVE LINK

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

  // 🔥 CLOSE DROPDOWN
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

  // 🎯 ACTIVE LINK STYLE
  const linkClass = (path: string) =>
    `hover:text-black ${
      pathname === path ? "text-black font-semibold" : "text-gray-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">

      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="/" className="text-lg font-semibold tracking-tight">
          MedCareer
        </a>

        <div className="flex gap-6 text-sm items-center">

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
              <a href="/jobs" className={linkClass("/jobs")}>
                Jobs
              </a>

              {/* 👨‍⚕️ DOCTOR */}
              {role === "doctor" && (
                <>
                  <a href="/dashboard" className={linkClass("/dashboard")}>
                    Dashboard
                  </a>
                  <a href="/applications" className={linkClass("/applications")}>
                    Applications
                  </a>
                </>
              )}

              {/* 🏥 ADMIN */}
              {role === "admin" && (
                <>
                  <a href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                    Admin
                  </a>
                  <a href="/admin/analytics" className={linkClass("/admin/analytics")}>
                    Analytics
                  </a>
                  <a href="/post-job" className={linkClass("/post-job")}>
                    Post Job
                  </a>
                </>
              )}

              {/* 👤 AVATAR */}
              <div className="relative" ref={dropdownRef}>

                {/* Avatar / Fallback */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
                  />
                ) : (
                  <div
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                  >
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                )}

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg overflow-hidden animate-fadeIn">

                    {/* USER INFO */}
                    <div className="px-4 py-3 border-b text-xs text-gray-500">
                      {user.email}
                    </div>

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
