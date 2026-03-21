"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 CHECK LOGIN
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
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

      {/* 🔥 NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b">
        <div className="flex justify-between items-center px-10 py-5">

          <h1 className="text-xl font-semibold tracking-tight">
            MedCareer
          </h1>

          <div className="space-x-6 text-sm text-gray-600">

            {user ? (
              <>
                <a href="/jobs" className="hover:text-black transition">
                  Explore Jobs
                </a>

                <a href="/post-job" className="hover:text-black transition">
                  Post Job
                </a>

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="text-red-500 hover:opacity-70 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/auth" className="hover:text-black transition">
                Login / Register
              </a>
            )}

          </div>
        </div>
      </header>

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

          {!user ? (
            <>
              <a
                href="/auth"
                className="px-8 py-3 bg-black text-white rounded-full hover:scale-105 transition"
              >
                Get Started
              </a>

              <a
                href="/auth"
                className="px-8 py-3 border rounded-full hover:bg-gray-100 transition"
              >
                Login
              </a>
            </>
          ) : (
            <>
              <a
                href="/jobs"
                className="px-8 py-3 bg-black text-white rounded-full hover:scale-105 transition"
              >
                Explore Jobs
              </a>

              <a
                href="/post-job"
                className="px-8 py-3 border rounded-full hover:bg-gray-100 transition"
              >
                Post Job
              </a>
            </>
          )}

        </div>

      </section>

      {/* 🖼 HERO IMAGE */}
      <section className="px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop"
            alt="Doctor consulting patient"
            className="w-full h-[420px] object-cover hover:scale-105 transition duration-700"
          />
        </div>
      </section>

      {/* ✨ FEATURES (CLICKABLE NOW) */}
      <section className="px-10 py-28">
        <div className="grid md:grid-cols-3 gap-12 text-center">

          {/* DOCTORS */}
          <a href="/doctors" className="group block cursor-pointer">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop"
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                alt="Doctors"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">
              Built for Doctors
            </h3>
            <p className="text-gray-500 mt-2">
              Find jobs tailored to MBBS, BDS, BAMS and more.
            </p>
          </a>

          {/* HOSPITALS */}
          <a href="/hospitals" className="group block cursor-pointer">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop"
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                alt="Hospital"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">
              For Hospitals
            </h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly and efficiently.
            </p>
          </a>

          {/* MATCHING */}
          <a href="/matching" className="group block cursor-pointer">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop"
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                alt="Matching"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">
              Smart Matching
            </h3>
            <p className="text-gray-500 mt-2">
              Jobs tailored based on your profession and preferences.
            </p>
          </a>

        </div>
      </section>

      {/* ⚡ CTA */}
      <section className="px-6 py-28 bg-black text-white text-center">

        <h2 className="text-4xl md:text-5xl font-semibold">
          Start Your Journey Today
        </h2>

        <p className="mt-4 text-gray-300">
          Join MedCareer and unlock better opportunities in healthcare.
        </p>

        {!user && (
          <a
            href="/auth"
            className="inline-block mt-8 px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition"
          >
            Register / Login
          </a>
        )}

      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer. All rights reserved.
      </footer>

    </div>
  );
}
