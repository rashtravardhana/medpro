"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null); // ✅ ADD ROLE
  const [loading, setLoading] = useState(true);

  // 🔐 CHECK LOGIN + ROLE
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      setUser(currentUser || null);

      // ✅ GET ROLE
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        setRole(profile?.role || null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  // ⏳ LOADER
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading MedCareer...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* 🚀 HERO */}
      <section className="text-center px-6 py-28">

        <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight max-w-4xl mx-auto">
          The Future of
          <br />
          Medical Careers.
        </h2>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          A modern platform connecting healthcare professionals with the right opportunities — fast, simple, and efficient.
        </p>

        <div className="mt-10 flex gap-6 justify-center flex-wrap">

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <a
                href="/auth"
                className="px-8 py-3 bg-black text-white rounded-full"
              >
                Get Started
              </a>

              <a
                href="/auth"
                className="px-8 py-3 border rounded-full"
              >
                Login
              </a>
            </>
          )}

          {/* 👨‍⚕️ DOCTOR */}
          {user && role === "doctor" && (
            <a
              href="/jobs"
              className="px-8 py-3 bg-black text-white rounded-full"
            >
              Explore Jobs
            </a>
          )}

          {/* 🏥 ADMIN */}
          {user && role === "admin" && (
            <a
              href="/post-job"
              className="px-8 py-3 border rounded-full"
            >
              Post Job
            </a>
          )}

        </div>

      </section>

      {/* 🖼 HERO IMAGE */}
      <section className="px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop"
            alt="Doctor"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ✨ FEATURES */}
      <section className="px-10 py-28">
        <div className="grid md:grid-cols-3 gap-12 text-center">

          <div>
            <h3 className="text-xl font-semibold mt-4">
              Built for Doctors
            </h3>
            <p className="text-gray-500 mt-2">
              Find jobs tailored to MBBS, BDS, BAMS and more.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mt-4">
              For Hospitals
            </h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mt-4">
              Smart Matching
            </h3>
            <p className="text-gray-500 mt-2">
              Jobs based on your profession.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer
      </footer>

    </div>
  );
}
