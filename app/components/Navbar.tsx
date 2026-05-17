"use client";

import { useEffect, useRef, useState } from "react";
import supabase from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  // 🔐 GET USER
  useEffect(() => {

    const getUser = async () => {

      const { data } = await supabase.auth.getUser();

      const currentUser = data?.user;

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      // 👤 PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, avatar_url")
        .eq("id", currentUser.id)
        .single();

      setRole(
        profile?.role?.toLowerCase().trim() || null
      );

      setAvatarUrl(profile?.avatar_url || null);
    };

    getUser();

  }, []);

  // ❌ CLOSE DROPDOWN
  useEffect(() => {

    const handleOutside = (e: any) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );

  }, []);

  // 🚪 LOGOUT
  const handleLogout = async () => {

    await supabase.auth.signOut();

    setUser(null);

    router.push("/auth");
  };

  // 🎯 ACTIVE LINK
  const linkClass = (path: string) => {

    const active = pathname === path;

    return `
      transition hover:text-black
      ${active
        ? "text-black font-semibold"
        : "text-gray-600"}
    `;
  };

  return (

    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-16 flex items-center justify-between">

          {/* 🏥 LOGO */}
          <a
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            MedCareer
          </a>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 text-sm">

            {/* NOT LOGGED IN */}
            {!user && (

              <a
                href="/auth"
                className="bg-black text-white px-5 py-2 rounded-full hover:opacity-90 transition"
              >
                Login
              </a>

            )}

            {/* LOGGED IN */}
            {user && (
              <>

                {/* JOBS */}
                <a
                  href="/jobs"
                  className={linkClass("/jobs")}
                >
                  Jobs
                </a>

                {/* 🔔 NOTIFICATIONS */}
                <a
                  href="/notifications"
                  className={linkClass("/notifications")}
                >
                  Notifications
                </a>

                {/* 👨‍⚕️ DOCTOR */}
                {role === "doctor" && (
                  <>
                    <a
                      href="/dashboard"
                      className={linkClass("/dashboard")}
                    >
                      Dashboard
                    </a>

                    <a
                      href="/applications"
                      className={linkClass("/applications")}
                    >
                      Applications
                    </a>
                  </>
                )}

                {/* 🏥 ADMIN */}
                {role === "admin" && (
                  <>
                    <a
                      href="/admin/dashboard"
                      className={linkClass("/admin/dashboard")}
                    >
                      Admin
                    </a>

                    <a
                      href="/admin/analytics"
                      className={linkClass("/admin/analytics")}
                    >
                      Analytics
                    </a>

                    <a
                      href="/post-job"
                      className={linkClass("/post-job")}
                    >
                      Post Job
                    </a>
                  </>
                )}

                {/* 👤 PROFILE DROPDOWN */}
                <div
                  className="relative"
                  ref={dropdownRef}
                >

                  {/* AVATAR */}
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
                      className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer font-semibold"
                    >
                      {user.email?.[0]?.toUpperCase()}
                    </div>

                  )}

                  {/* DROPDOWN */}
                  {open && (

                    <div className="absolute right-0 mt-3 w-56 bg-white border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

                      {/* USER INFO */}
                      <div className="px-4 py-3 border-b">

                        <p className="text-xs text-gray-500">
                          Signed in as
                        </p>

                        <p className="text-sm font-medium truncate mt-1">
                          {user.email}
                        </p>

                      </div>

                      {/* PROFILE */}
                      <a
                        href="/profile"
                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        Profile
                      </a>

                      {/* DASHBOARD */}
                      <a
                        href={
                          role === "admin"
                            ? "/admin/dashboard"
                            : "/dashboard"
                        }
                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        Dashboard
                      </a>

                      {/* NOTIFICATIONS */}
                      <a
                        href="/notifications"
                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        Notifications
                      </a>

                      {/* LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
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

      </div>

    </header>
  );
}
